// =============================================================================
// ai/callStateMachine.js — OpenAI Realtime conversational agent
//
// Architecture: conversational agent driven by a rich system prompt.
// The model handles turn-taking, language switching, hold responses, repeats,
// and all conversation nuance naturally — no per-turn scripted instructions.
//
// What this code handles (monitoring + infrastructure only):
//   • Audio bridging         — relay g711_ulaw frames between Twilio and OpenAI
//   • Echo prevention        — disable VAD while agent speaks, re-enable after
//   • Voicemail override     — intercept + send a specific message, schedule hang-up
//   • Outcome monitoring     — extract ETA, detect goodbye, track call phase
//   • Result logging         — outcome classification, SMS, call history
//   • Hang-up coordination   — Twilio mark-ack → hang up after final audio plays
//
// VAD: semantic_vad + create_response:true
//   The model auto-responds when it detects end-of-thought — no JS middleware
//   in the hot path. Latency is dominated by model generation, not application
//   round-trips. VAD is manually disabled during agent speech to prevent acoustic
//   echo from the restaurant's handset triggering a spurious auto-response.
//
// Phase tracking (agentState):
//   greeting    → language check + availability check
//   ordering    → order items spoken, waiting for ETA
//   phone_given → callback number delivered, awaiting ack
//   completed   → goodbye spoken, awaiting final audio playback
//   voicemail   → voicemail path, brief message + hang-up
// =============================================================================

import { WebSocket }          from 'ws';
import {
    OPENAI_API_KEY,
    OPENAI_REALTIME_MODEL,
    OPENAI_VOICE,
    twilioClient,
}                             from '../config/env.js';
import { orders, sessionState } from '../state/store.js';
import { debugLog }           from '../services/debugLogger.js';
import {
    buildConversationalPrompt,
    buildSpokenItemList,
    callerName,
}                             from '../utils/promptBuilders.js';
import {
    detectVoicemail,
    isExplicitRejection,
}                             from '../utils/textClassifiers.js';
import { extractETA }         from '../utils/timeParser.js';
import { resolveCallOutcome } from '../state/outcomeClassifier.js';

// ---------------------------------------------------------------------------
// createOpenAISession — opens a Realtime WebSocket and drives an ordering call
// ---------------------------------------------------------------------------
export function createOpenAISession(streamSid, callSid, twilioWs, order, initialLang, orderId = null) {

    const openaiUrl = `wss://api.openai.com/v1/realtime?model=${OPENAI_REALTIME_MODEL}`;

    // lang is updated by monitoring AI transcript — model picks English, French or Chinese (French stays "en": the ETA parser is digit-based)
    let lang = initialLang;

    // ── Per-session state ──────────────────────────────────────────────────────
    let sessionReady    = false;
    let audioDeltaCount = 0;
    let turnCount       = 0;

    // Agent speech tracking — for echo prevention
    // isAgentSpeaking:   true from first response.audio.delta → response.audio.done
    //                    (or response.cancelled if interrupted).
    // agentAudioStartTs: wall-clock ms at first chunk — for duration logging.
    let isAgentSpeaking   = false;
    let agentAudioStartTs = 0;

    // Opening greeting barge-in — detected via input_audio_buffer.speech_started
    let agentGreetingDone     = false;
    let bargeInDuringGreeting = false; // logged; model handles recovery naturally

    // Call phase — updated by monitoring transcripts.
    // The model drives the actual conversation; this just tracks progress
    // for outcome classification and hang-up coordination.
    let agentState = 'greeting';

    // Hang-up coordination:
    //   lastSentMarkName — mark sent in most recent response.audio.done turn
    //   closingMarkName  — set when goodbye detected → Twilio ack triggers hang-up
    let lastSentMarkName = null;
    let closingMarkName  = null;

    // Outcome data
    const callTranscript = [];
    const orderResult = {
        status:            'pending',
        eta:               null,
        callbackConfirmed: false,
        finalOutcome:      null,
    };
    let outcomeEmitted     = false;
    let lastAgentUtterance = '';

    // ── VAD config ─────────────────────────────────────────────────────────────
    // semantic_vad understands end-of-thought rather than just silence gaps.
    // create_response:true — model auto-responds; no JS round-trip per turn.
    // eagerness 'medium' — patient enough to avoid cutting in mid-sentence.
    //
    // VAD is disabled on first audio.delta (echo prevention) and re-enabled in
    // audio.done after we flush the input buffer of any accumulated echo.
    // eagerness 'high' → the model commits to end-of-turn sooner, cutting the
    // pause before each reply. 'medium' felt sluggish on the phone line.
    const VAD_CONFIG = {
        type:            'semantic_vad',
        eagerness:       'high',
        create_response: true,
    };

    // ── Helpers ────────────────────────────────────────────────────────────────
    function updateCallStatus(status) {
        if (orderId && orders.has(orderId)) {
            orders.set(orderId, { ...orders.get(orderId), callStatus: status });
            console.log(`[call] ${orderId} → ${status}`);
        }
    }

    // GA API: turn_detection lives under session.audio.input
    function disableVad() {
        openaiWs.send(JSON.stringify({
            type: 'session.update',
            session: { type: 'realtime', audio: { input: { turn_detection: null } } },
        }));
    }

    function enableVad() {
        openaiWs.send(JSON.stringify({
            type: 'session.update',
            session: { type: 'realtime', audio: { input: { turn_detection: VAD_CONFIG } } },
        }));
        // Purge any echo / noise that accumulated while VAD was off
        openaiWs.send(JSON.stringify({ type: 'input_audio_buffer.clear' }));
    }

    function sendTwilioMark(name) {
        if (twilioWs.readyState === WebSocket.OPEN) {
            twilioWs.send(JSON.stringify({ event: 'mark', streamSid, mark: { name } }));
        }
    }

    // ── logOrderResult ─────────────────────────────────────────────────────────
    function logOrderResult() {
        if (outcomeEmitted) return;
        outcomeEmitted = true;

        const { outcome, details } = resolveCallOutcome(agentState, orderResult, callTranscript, lang);
        orderResult.finalOutcome = outcome;

        console.log(`\n[order] ════════════════════════════════════════`);
        console.log(`[result] outcome       : ${outcome}`);
        if (details.eta)      console.log(`[result]   eta         : ${details.eta}`);
        if (details.evidence) console.log(`[result]   evidence    : ${details.evidence}`);
        if (details.reason)   console.log(`[result]   reason      : ${details.reason}`);
        console.log(`[order] eta            : ${orderResult.eta ?? '(not captured)'}`);
        console.log(`[order] callback conf  : ${orderResult.callbackConfirmed}`);
        if (callTranscript.length > 0) {
            console.log('[order] transcript:');
            callTranscript.forEach(({ role, text }) =>
                console.log(`[order]   [${role === 'ai' ? 'AI         ' : 'restaurant '}] ${text}`)
            );
        }
        console.log(`[order] ════════════════════════════════════════`);

        if (sessionState.current) {
            sessionState.current.orderResult.finalOutcome = outcome;
            sessionState.current.orderResult.status       = outcome;
        }

        debugLog('result', `Final outcome: ${outcome}`, {
            outcome,
            eta:               details.eta ?? orderResult.eta ?? null,
            callbackConfirmed: orderResult.callbackConfirmed,
            reason:            details.reason  ?? null,
            evidence:          details.evidence ?? null,
            orderId,
        });

        // Portfolio demo: no SMS and nothing written to disk. The result lives
        // on the in-memory order, where GET /api/calls/:id reads it.
        if (orderId && orders.has(orderId)) {
            orders.set(orderId, {
                ...orders.get(orderId),
                outcome,
                eta: details.eta ?? orderResult.eta ?? null,
            });
        }
    }

    // ── Connect ────────────────────────────────────────────────────────────────
    console.log(`\n[openai] connecting — model: ${OPENAI_REALTIME_MODEL}`);
    console.log(`[agent]  orderId    : ${orderId ?? '(unknown)'}`);
    console.log(`[agent]  items (en) : ${buildSpokenItemList(order, 'en')}`);
    console.log(`[agent]  items (zh) : ${buildSpokenItemList(order, 'zh_cn')}`);

    // GA Realtime API — no 'OpenAI-Beta: realtime=v1' header. Sending that header
    // selects the retired beta wire format and the server closes with
    // `beta_api_shape_disabled`.
    const openaiWs = new WebSocket(openaiUrl, {
        headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
    });

    // =========================================================================
    // WebSocket event handlers
    // =========================================================================

    // ── open ──────────────────────────────────────────────────────────────────
    openaiWs.on('open', () => {
        console.log('[openai] ✅ realtime connected');
        if (sessionState.current) sessionState.current.connections.openai = true;
        debugLog('openai', 'Realtime WebSocket connected', { model: OPENAI_REALTIME_MODEL, voice: OPENAI_VOICE, orderId });

        // Load the comprehensive system prompt once.
        // Everything the model needs to handle the conversation is in here.
        // GA session shape: audio config is nested under session.audio.{input,output}
        // and the g711_ulaw format is now { type: 'audio/pcmu' }.
        openaiWs.send(JSON.stringify({
            type: 'session.update',
            session: {
                type:              'realtime',
                output_modalities: ['audio'],
                instructions:      buildConversationalPrompt(order),
                audio: {
                    input: {
                        format:         { type: 'audio/pcmu' },
                        transcription:  { model: 'whisper-1' },
                        turn_detection: VAD_CONFIG,
                    },
                    output: {
                        format: { type: 'audio/pcmu' },
                        voice:  OPENAI_VOICE,
                        speed:  1.0,                         // steady, confident cadence (range 0.25–1.5)
                    },
                },
                // Counts AUDIO tokens (~20/sec), not words. 150 was ~7 s of speech and
                // truncated the callback-number line mid-sentence. Brevity is enforced by
                // the prompt ("two sentences max"); this is only a runaway guard.
                max_output_tokens: 1000,
            },
        }));
        console.log(`[openai] session.update sent — conversational agent, semantic VAD, ${OPENAI_VOICE} voice`);
        debugLog('agent', 'Session config sent — conversational agent mode', { orderId });
    });

    // ── message ───────────────────────────────────────────────────────────────
    openaiWs.on('message', (raw) => {
        let event;
        try {
            event = JSON.parse(raw.toString());
        } catch (err) {
            console.error('[openai] ❌ JSON parse error:', err.message);
            return;
        }

        switch (event.type) {

            // ── Session lifecycle ────────────────────────────────────────────
            case 'session.created':
                console.log('[openai] session.created');
                break;

            case 'session.updated':
                if (!sessionReady) {
                    sessionReady = true;
                    updateCallStatus('connected');
                    if (sessionState.current) sessionState.current.agentState = 'greeting';
                    console.log('[openai] session ready ✅');
                    console.log(`[openai]   voice         : ${event.session?.audio?.output?.voice}`);
                    console.log(`[openai]   turn_detection: ${event.session?.audio?.input?.turn_detection?.type ?? 'null'}`);
                    debugLog('agent', 'Session ready — triggering opening line', { orderId });

                    // Manually trigger the opening greeting — there is no inbound audio
                    // yet to wake the auto-response mechanism.
                    openaiWs.send(JSON.stringify({
                        type: 'response.create',
                        response: {
                            output_modalities: ['audio'],
                            instructions: `Someone just picked up. Greet them warmly and confidently, in one turn: introduce yourself as ${callerName(order)}’s AI assistant calling from Siya’s portfolio demo to place a pickup order, AND ask whether they prefer English or French. Roughly: "Hi there... this is ${callerName(order)}’s AI assistant, calling from Siya’s portfolio demo to place a pickup order. Would you prefer English or French?" Say both parts before you stop. Then stop completely and wait for their answer.`,
                        },
                    }));
                }
                break;

            // ── Audio output: OpenAI → Twilio ────────────────────────────────
            // GA event names are response.output_audio.*; the beta names are kept
            // as fall-through aliases.
            case 'response.output_audio.delta':
            case 'response.audio.delta':
                audioDeltaCount++;

                if (!isAgentSpeaking) {
                    isAgentSpeaking   = true;
                    agentAudioStartTs = Date.now();

                    // Disable VAD the moment agent audio starts.
                    // Without this, acoustic echo from the restaurant's handset
                    // (agent audio feeding back through their mic) reaches OpenAI
                    // as inbound speech, and with create_response:true the model
                    // would auto-respond to its own voice.
                    disableVad();

                    console.log(`[agent] 🔊 audio started — turn ${turnCount + 1}  state=${agentState}`);
                    debugLog('agent', 'Audio started — VAD disabled (echo prevention)', {
                        turn: turnCount + 1, state: agentState, orderId,
                    });
                }

                if (event.delta && twilioWs.readyState === WebSocket.OPEN) {
                    twilioWs.send(JSON.stringify({
                        event: 'media', streamSid,
                        media: { payload: event.delta },   // g711_ulaw — no conversion
                    }));
                    if (audioDeltaCount <= 3 || audioDeltaCount % 20 === 0) {
                        console.log(`[bridge] ▶ audio → Twilio  chunk #${audioDeltaCount}`);
                    } else if (audioDeltaCount === 4) {
                        console.log(`[bridge] ▶ forwarding active (logging every 20th chunk)`);
                    }
                } else if (event.delta && audioDeltaCount <= 3) {
                    console.warn(`[bridge] ⚠ Twilio WS not open — dropped chunk #${audioDeltaCount}`);
                }
                break;

            case 'response.output_audio.done':
            case 'response.audio.done': {
                turnCount++;
                const durationMs = isAgentSpeaking ? Date.now() - agentAudioStartTs : 0;
                isAgentSpeaking = false;
                audioDeltaCount = 0;

                console.log(`[agent] ✅ audio done — turn #${turnCount}  ${durationMs}ms  state=${agentState}`);
                debugLog('agent', 'Audio turn complete', { turn: turnCount, durationMs, state: agentState, orderId });

                // Send Twilio mark so we know exactly when the last byte played out.
                // Saved as lastSentMarkName — the transcript handler may retroactively
                // promote this to closingMarkName if the turn contains a goodbye.
                const markName = `openai-turn-${turnCount}-done`;
                lastSentMarkName = markName;
                sendTwilioMark(markName);

                if (!agentGreetingDone && turnCount === 1) {
                    agentGreetingDone = true;
                    console.log('[agent] opening greeting complete — listening');
                    debugLog('agent', 'Opening greeting complete', { bargeInDuringGreeting, orderId });
                }

                // Re-enable VAD after this turn's audio is flushed to Twilio.
                // Timing: audio.done fires when OpenAI finishes sending chunks.
                // Twilio still has ~0.5–2 s buffered — the restaurant can't respond
                // before hearing the question, so re-enabling here is safe.
                //
                // Skip for terminal states — the transcript handler will have already
                // or is about to disable VAD permanently for completed/voicemail.
                if (agentState !== 'completed' && agentState !== 'voicemail') {
                    enableVad();
                    console.log(`[agent] 👂 VAD re-enabled (semantic) — waiting for restaurant`);
                }
                break;
            }

            // ── AI transcript: what Bravo said ───────────────────────────────
            case 'response.output_audio_transcript.done':
            case 'response.audio_transcript.done': {
                if (!event.transcript) break;
                const aiText = event.transcript.trim();
                lastAgentUtterance = aiText;

                console.log(`[openai] AI said: "${aiText}"`);
                callTranscript.push({ role: 'ai', text: aiText });
                if (sessionState.current) {
                    sessionState.current.transcript.push({
                        role: 'ai', text: aiText, ts: Date.now(), state: agentState,
                    });
                }
                debugLog('openai', `AI: "${aiText.slice(0, 120)}"`, { state: agentState, orderId });

                // Infer active language from model output — model picks English, French or Chinese (French stays "en": the ETA parser is digit-based)
                if (/[\u4e00-\u9fff]/.test(aiText)) lang = 'zh_cn';
                else lang = 'en';

                // ── Phase transitions ────────────────────────────────────────
                // Track which stage the model has reached based on what it just said.

                // Order items spoken → ordering phase
                const orderKeywords = /popcorn|milk[\s-]?tea|ready for pickup|盐酥鸡|鹽酥雞|珍珠奶茶|外带自取|取餐/i;
                if (agentState === 'greeting' && orderKeywords.test(aiText)) {
                    agentState = 'ordering';
                    if (sessionState.current) sessionState.current.agentState = 'ordering';
                    console.log('[agent] order items spoken — phase: ordering');
                    debugLog('agent', 'Phase: ordering', { orderId });
                }

                // Callback number delivered → phone_given phase
                if (
                    /\d{3}[-.\s]\d{3}[-.\s]\d{4}|联系电话|customer'?s?\s*number/i.test(aiText) &&
                    agentState !== 'completed' && agentState !== 'voicemail'
                ) {
                    orderResult.callbackConfirmed = true;
                    agentState = 'phone_given';
                    if (sessionState.current) sessionState.current.agentState = 'phone_given';
                    console.log('[agent] 📞 callback number delivered — phase: phone_given');
                    debugLog('agent', 'Phase: phone_given', { orderId });
                }

                // ── Goodbye detection → trigger hang-up sequence ─────────────
                // audio.done fires before audio_transcript.done for the same turn.
                // By the time we reach here, lastSentMarkName already holds the
                // mark for this turn — so we can retroactively designate it as
                // the closing mark and gate the hang-up on Twilio's ack.
                const isGoodbye = /\bhave a good (day|one|night|evening)\b|\bgoodbye\b|\bbye\b|再见[！!。.]?\s*$/i.test(aiText);
                if (isGoodbye && agentState !== 'completed' && agentState !== 'voicemail') {
                    agentState = 'completed';
                    if (sessionState.current) sessionState.current.agentState = 'completed';
                    updateCallStatus('completed');
                    closingMarkName = lastSentMarkName;

                    // Re-disable VAD — we enabled it in audio.done, but now we know
                    // this was the closing turn. Prevent any further auto-responses.
                    disableVad();

                    console.log(`[agent] 👋 goodbye spoken — hang-up gated on mark: "${closingMarkName}"`);
                    debugLog('agent', 'Goodbye detected — awaiting Twilio mark ack', {
                        closingMarkName, aiText: aiText.slice(0, 80), orderId,
                    });

                    // Fallback: hang up after 8 s if Twilio mark ack is lost
                    setTimeout(async () => {
                        if (outcomeEmitted) return;
                        console.log('[agent] ⚠ fallback hang-up — mark ack not received within 8 s');
                        debugLog('agent', 'Fallback hang-up triggered', { orderId });
                        try { await twilioClient.calls(callSid).update({ status: 'completed' }); } catch {}
                    }, 8000);
                }
                break;
            }

            // ── Restaurant transcript: what the restaurant said ───────────────
            // Monitored for outcome signals only — the model drives responses.
            case 'conversation.item.input_audio_transcription.completed': {
                if (!event.transcript) break;
                const restText = event.transcript.trim();
                if (!restText) break;

                console.log(`[openai] restaurant said: "${restText}"`);
                callTranscript.push({ role: 'restaurant', text: restText });
                if (sessionState.current) {
                    sessionState.current.transcript.push({
                        role: 'restaurant', text: restText, ts: Date.now(), state: agentState,
                    });
                }
                debugLog('openai', `Restaurant: "${restText}"`, { state: agentState, orderId });

                if (agentState === 'completed' || agentState === 'voicemail') break;

                // ── Voicemail override — highest priority ─────────────────────
                // The model would respond conversationally here, which is wrong
                // for voicemail. Override: cancel auto-response, leave a brief
                // message, then hang up.
                if (detectVoicemail(restText)) {
                    agentState         = 'voicemail';
                    orderResult.status = 'voicemail';
                    if (sessionState.current) sessionState.current.agentState = 'voicemail';
                    console.log('[agent] 📼 voicemail detected — overriding response');
                    debugLog('agent', 'Voicemail detected — sending brief message', { restText, orderId });

                    openaiWs.send(JSON.stringify({ type: 'response.cancel' }));
                    disableVad();

                    const vmInstruction = /[\u4e00-\u9fff]/.test(restText)
                        ? `只说这一句话，不要说其他内容："这里是 Bravo AI，帮顾客来电预订外卖。" 然后完全停止。`
                        : `Say ONLY: "Hi, this is ${callerName(order)}’s AI assistant, calling from Siya’s portfolio demo to place a pickup order." Then stop completely.`;

                    openaiWs.send(JSON.stringify({
                        type: 'response.create',
                        response: { output_modalities: ['audio'], instructions: vmInstruction },
                    }));

                    setTimeout(async () => {
                        try { await twilioClient.calls(callSid).update({ status: 'completed' }); } catch {}
                    }, 8000);
                    break;
                }

                // ── ETA extraction ────────────────────────────────────────────
                const eta = extractETA(restText);
                if (eta && !orderResult.eta) {
                    orderResult.eta    = eta;
                    orderResult.status = 'accepted';
                    if (sessionState.current) {
                        sessionState.current.orderResult.eta    = eta;
                        sessionState.current.orderResult.status = 'accepted';
                    }
                    console.log(`[agent] ✅ ETA captured: "${eta}"`);
                    debugLog('agent', `ETA captured: "${eta}"`, { eta, orderId });
                }

                // ── Rejection tracking ────────────────────────────────────────
                if (!orderResult.eta && isExplicitRejection(restText, lang)) {
                    orderResult.status = 'rejected';
                    console.log('[agent] ❌ rejection detected');
                    debugLog('agent', 'Rejection detected', { restText, orderId });
                }
                break;
            }

            // ── Input audio buffer events ────────────────────────────────────
            case 'input_audio_buffer.speech_started': {
                const inGreetingWindow = !agentGreetingDone && agentState === 'greeting';
                if (inGreetingWindow) {
                    bargeInDuringGreeting = true;
                    console.log('[agent] ⚡ barge-in during opening greeting — model will handle naturally');
                    debugLog('agent', 'Barge-in during opening greeting', { orderId });
                } else {
                    console.log(`[openai] 🎤 restaurant speaking (state=${agentState})`);
                }
                break;
            }

            case 'input_audio_buffer.speech_stopped':
                console.log(`[openai] 🤫 restaurant stopped speaking (state=${agentState})`);
                break;

            case 'input_audio_buffer.committed':
                break;

            // ── Response lifecycle ───────────────────────────────────────────
            case 'response.created':
                break;

            // ── Barge-in / deliberate cancel ─────────────────────────────────
            // GA API reports a cancellation as response.done with status
            // 'cancelled' (there is no separate response.cancelled event).
            case 'response.done':
                if (event.response?.status === 'incomplete') {
                    // Truncated by the server (token cap / content filter). Surface it —
                    // this is what a mid-sentence cut-off looks like from our side.
                    const why = event.response?.status_details?.reason ?? 'unknown';
                    console.warn(`[openai] ⚠ response incomplete — reason: ${why}`);
                    debugLog('openai', `Response truncated — ${why}`, { state: agentState, orderId });
                }
                if (event.response?.status !== 'cancelled') break;
                // fall through
            case 'response.cancelled': {
                if (isAgentSpeaking) {
                    // Unexpected mid-speech cancellation — barge-in or server VAD
                    // race condition before our disableVad() reached the server.
                    const elapsed = Date.now() - agentAudioStartTs;
                    isAgentSpeaking = false;
                    console.log(`[agent] ⚡ barge-in — agent audio cut off after ${elapsed}ms  state=${agentState}`);
                    debugLog('agent', 'Agent audio cut off — response.cancelled', {
                        elapsedMs: elapsed, state: agentState, orderId,
                    });

                    // audio.done will NOT fire for a cancelled response, so we must
                    // re-enable VAD here to avoid a permanently deaf state.
                    if (agentState !== 'completed' && agentState !== 'voicemail') {
                        enableVad();
                        console.log('[agent] 👂 VAD re-enabled after barge-in');
                    }
                } else {
                    // Deliberate cancel from our voicemail override — normal operation.
                    console.log(`[agent] deliberate cancel acknowledged (state=${agentState})`);
                    debugLog('agent', 'Deliberate cancel acknowledged', { state: agentState, orderId });
                }
                break;
            }

            // ── High-volume / informational events — silently ignored ────────
            case 'response.audio_transcript.delta':
            case 'response.output_audio_transcript.delta':
            case 'response.output_text.delta':
            case 'response.output_text.done':
            case 'conversation.item.added':
            case 'conversation.item.done':
            case 'conversation.item.input_audio_transcription.delta':
            case 'response.text.delta':
            case 'response.text.done':
            case 'response.output_item.added':
            case 'response.output_item.done':
            case 'response.content_part.added':
            case 'response.content_part.done':
            case 'conversation.item.created':
            case 'rate_limits.updated':
                break;

            case 'error':
                console.error('[openai] ❌ error event:');
                console.error(`[openai]    code    : ${event.error?.code}`);
                console.error(`[openai]    message : ${event.error?.message}`);
                console.error(`[openai]    param   : ${event.error?.param ?? '(none)'}`);
                break;

            default:
                break;
        }
    });

    // ── close ─────────────────────────────────────────────────────────────────
    openaiWs.on('close', (code, reason) => {
        const reasonStr     = reason?.toString() || '(none)';
        const etaCaptured   = !!orderResult.eta;
        const closeCodeDesc = code === 1000 ? 'normal' : code === 1005 ? 'no status / abrupt' : code === 1006 ? 'abnormal / network' : 'other';

        if (sessionState.current) sessionState.current.connections.openai = false;

        console.log(`\n[openai] ════ SESSION CLOSED ════════════════════════════`);
        console.log(`[openai]   code         : ${code} (${closeCodeDesc})`);
        console.log(`[openai]   reason       : ${reasonStr}`);
        console.log(`[openai]   agent state  : ${agentState}`);
        console.log(`[openai]   order status : ${orderResult.status}`);
        console.log(`[openai]   eta          : ${orderResult.eta ?? '(none)'}`);
        console.log(`[openai]   lang         : ${lang}`);
        console.log(`[openai] ══════════════════════════════════════════════════\n`);

        debugLog('openai', `Session closed — code: ${code}`, {
            code, reasonStr, orderId,
            agentState, orderStatus: orderResult.status, eta: orderResult.eta, lang,
        });

        if (!outcomeEmitted && agentState !== 'completed' && agentState !== 'voicemail') {
            if (!etaCaptured) {
                // ETA not captured → order was not placed
                const closeReason = `unexpected_close_${code}_at_${agentState}`;
                orderResult.status = 'failed';
                if (sessionState.current) sessionState.current.orderResult.status = 'failed';
                updateCallStatus('failed');
                console.warn(`[result] ⚠ call closed without terminal state — ${closeReason}`);
                debugLog('agent', `Abnormal close — ${closeReason}`, { code, agentState, orderId });
            } else {
                // ETA was captured even if call dropped before formal close — count as success
                console.log('[result] ℹ ETA captured before close — marking accepted');
            }
        }

        logOrderResult();
    });

    // ── error ─────────────────────────────────────────────────────────────────
    openaiWs.on('error', (err) => {
        console.error(`[openai] ❌ WebSocket error: ${err.message}`);
        if (!outcomeEmitted) {
            orderResult.status = 'failed';
            if (sessionState.current) sessionState.current.orderResult.status = 'failed';
            debugLog('result', 'Final outcome: failed', { reason: err.message, orderId });
            outcomeEmitted = true;
        }
    });

    // ── Twilio mark-ack listener ───────────────────────────────────────────────
    // mediaStreamHandler.js already listens on twilioWs for audio bridging.
    // Adding a second listener here is safe — Node EventEmitter fans out to all
    // registered handlers. We use this solely to detect when Twilio has fully
    // played out the closing audio, which is the right moment to hang up.
    //
    // Why mark-ack instead of response.done + timer?
    //   response.done fires when OpenAI finishes generating/sending chunks.
    //   Twilio still has 1–3 s of buffered audio to play at that point.
    //   A fixed timer is unreliable; the mark ack is an explicit receipt sent
    //   only after Twilio drains every byte up to the marked position.
    twilioWs.on('message', (raw) => {
        let msg;
        try { msg = JSON.parse(raw.toString()); } catch { return; }
        if (msg.event !== 'mark') return;

        const markName = msg.mark?.name ?? '';
        if (!closingMarkName || markName !== closingMarkName) return;

        // Closing audio fully played — hang up after a short grace period
        closingMarkName = null;
        console.log(`[agent] ✅ closing audio confirmed via Twilio mark: "${markName}"`);
        debugLog('agent', 'Final audio confirmed — ending call', { markName, orderId });

        setTimeout(async () => {
            try {
                await twilioClient.calls(callSid).update({ status: 'completed' });
                console.log('[agent] ✅ call ended after full closing line');
            } catch (e) {
                console.error(`[agent] ❌ hang-up failed: ${e.message}`);
            }
        }, 500);   // 500 ms grace — lets the very last audio frame finish at the speaker
    });

    return openaiWs;
}
