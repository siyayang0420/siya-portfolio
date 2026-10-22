// =============================================================================
// websocket/mediaStreamHandler.js — Twilio /media-stream WebSocket handler
//
// registerMediaStreamHandler(wss) wires up the WebSocket server that Twilio
// connects to when a call answers. It:
//   1. Receives inbound audio from Twilio (g711_ulaw frames)
//   2. Opens an OpenAI Realtime session via createOpenAISession()
//   3. Forwards inbound audio to OpenAI
//   4. Relays outbound audio (from OpenAI) back to Twilio
//   5. Cleans up the OpenAI session when Twilio disconnects
//
// Audio bridge: both directions use g711_ulaw at 8kHz — zero codec conversion.
// =============================================================================

import { WebSocket }           from 'ws';
import { CALL_LANGUAGE }       from '../config/env.js';
import { callOrders, sessionState } from '../state/store.js';
import { debugLog }            from '../services/debugLogger.js';
import { createOpenAISession } from '../ai/callStateMachine.js';

// Throttle constants for media frame logging
const MEDIA_LOG_HEAD  = 5;
const MEDIA_LOG_EVERY = 100;

/**
 * Register the /media-stream WebSocket connection handler and error handler.
 *
 * @param {import('ws').WebSocketServer} wss
 */
export function registerMediaStreamHandler(wss) {

    wss.on('connection', (twilioWs, req) => {
        let frameCount = 0;
        let streamSid  = null;
        let callSid    = null;
        let openaiWs   = null;

        console.log(`\n[media-stream] ✅ WebSocket connected`);
        console.log(`[media-stream]    remote : ${req.socket.remoteAddress}`);

        twilioWs.on('message', (raw) => {
            let msg;
            try {
                msg = JSON.parse(raw.toString());
            } catch (err) {
                console.error(`[media-stream] ❌ JSON parse error: ${err.message}`);
                return;
            }

            switch (msg.event) {

                case 'connected':
                    console.log(`[media-stream] ── connected event`);
                    console.log(`[media-stream]    protocol : ${msg.protocol}`);
                    console.log(`[media-stream]    version  : ${msg.version}`);
                    break;

                case 'start': {
                    streamSid = msg.start.streamSid;
                    callSid   = msg.start.callSid;
                    console.log(`\n[media-stream] ── start event`);
                    console.log(`[media-stream]    streamSid   : ${streamSid}`);
                    console.log(`[media-stream]    callSid     : ${callSid}`);
                    console.log(`[media-stream]    tracks      : ${JSON.stringify(msg.start.tracks)}`);
                    console.log(`[media-stream]    mediaFormat : ${JSON.stringify(msg.start.mediaFormat)}`);

                    // Retrieve the order that was linked to this callSid at call-creation time
                    const callOrder = callOrders.get(callSid);
                    if (!callOrder) {
                        console.error(`[media-stream] ❌ No order found for callSid: ${callSid} — closing WebSocket`);
                        twilioWs.close();
                        break;
                    }

                    if (sessionState.current) sessionState.current.connections.mediaStream = true;
                    console.log(`[media-stream] order loaded — restaurant: ${callOrder.restaurantName?.en}  orderId: ${callOrder.orderId}`);
                    debugLog('media-stream', 'Stream started — order loaded', {
                        streamSid, callSid,
                        restaurantName: callOrder.restaurantName?.en,
                        orderId:        callOrder.orderId,
                    });

                    openaiWs = createOpenAISession(
                        streamSid, callSid, twilioWs,
                        callOrder, CALL_LANGUAGE, callOrder.orderId
                    );
                    break;
                }

                case 'media':
                    frameCount++;
                    if (openaiWs?.readyState === WebSocket.OPEN) {
                        openaiWs.send(JSON.stringify({
                            type:  'input_audio_buffer.append',
                            audio: msg.media.payload,   // base64 g711_ulaw — no conversion
                        }));
                        if (frameCount <= MEDIA_LOG_HEAD) {
                            console.log(`[bridge] ◀ inbound audio → OpenAI  frame #${frameCount}`);
                        } else if (frameCount === MEDIA_LOG_HEAD + 1) {
                            console.log(`[bridge] ◀ inbound forwarding active (logging every ${MEDIA_LOG_EVERY}th frame)`);
                        } else if (frameCount % MEDIA_LOG_EVERY === 0) {
                            console.log(`[bridge] ◀ inbound frame #${frameCount} → OpenAI`);
                        }
                    }
                    break;

                case 'stop':
                    console.log(`\n[media-stream] ── stop event`);
                    console.log(`[media-stream]    streamSid         : ${msg.stop?.streamSid}`);
                    console.log(`[media-stream]    callSid           : ${msg.stop?.callSid}`);
                    console.log(`[media-stream]    total frames rcvd : ${frameCount}`);
                    if (openaiWs && openaiWs.readyState !== WebSocket.CLOSED) {
                        openaiWs.close();
                    }
                    break;

                case 'mark':
                    console.log(`[media-stream] ── mark ack: "${msg.mark?.name}"`);
                    break;

                default:
                    console.log(`[media-stream] ── unknown event: "${msg.event}"`);
                    console.log(`[media-stream]    payload:`, JSON.stringify(msg));
            }
        });

        twilioWs.on('close', (code, reason) => {
            console.log(`\n[media-stream] ❎ WebSocket closed — code: ${code}  reason: ${reason?.toString() || '(none)'}`);
            console.log(`[media-stream]    total frames rcvd : ${frameCount}`);
            if (sessionState.current) sessionState.current.connections.mediaStream = false;
            debugLog('media-stream', `Stream closed — ${frameCount} frames`, { code, frames: frameCount });
            if (openaiWs && openaiWs.readyState !== WebSocket.CLOSED) {
                openaiWs.close();
                console.log('[openai] session cleaned up on Twilio disconnect');
            }
        });

        twilioWs.on('error', (err) => {
            console.error(`[media-stream] ❌ WebSocket error: ${err.message}`);
        });
    });

    wss.on('error', (err) => {
        console.error(`[wss] ❌ WebSocketServer error: ${err.message}`);
    });
}
