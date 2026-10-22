// =============================================================================
// routes/twilioRoutes.js — Twilio webhook handlers
//
// Routes:
//   POST     /twilio/voice   — returns TwiML <Connect><Stream> for media bridging
//   POST     /twilio/status  — receives call status updates from Twilio
// =============================================================================

import express from 'express';
import twilio  from 'twilio';
import { STREAM_URL, PUBLIC_BASE_URL, TWILIO_AUTH_TOKEN, VALIDATE_TWILIO } from '../config/env.js';
import { sessionState, callOrders, orders } from '../state/store.js';
import { debugLog }          from '../services/debugLogger.js';

const router = express.Router();

// Only Twilio may hit these: every request is checked against the signature
// Twilio computes over the public URL and the form body.
function fromTwilio(req, res, next) {
    if (!VALIDATE_TWILIO) return next();
    const ok = twilio.validateRequest(
        TWILIO_AUTH_TOKEN,
        req.headers['x-twilio-signature'] ?? '',
        `${PUBLIC_BASE_URL}${req.originalUrl}`,
        req.body ?? {},
    );
    if (!ok) {
        console.warn(`[twilio] ✋ rejected unsigned request to ${req.originalUrl}`);
        return res.sendStatus(403);
    }
    next();
}

// ---------------------------------------------------------------------------
// POST /twilio/voice
//
// Returns TwiML that instructs Twilio to open a media stream to /media-stream.
// This is the webhook Twilio calls when the outbound call connects.
// ---------------------------------------------------------------------------
router.post('/twilio/voice', fromTwilio, (req, res) => {
    console.log(`\n[twilio] ══════════════════════════════════════`);
    console.log(`[twilio] /voice hit`);
    console.log(`[twilio] method    : ${req.method}`);
    const callSid    = req.body?.CallSid    ?? req.query?.CallSid    ?? '(none)';
    const callStatus = req.body?.CallStatus ?? req.query?.CallStatus ?? '(none)';
    console.log(`[twilio] CallSid   : ${callSid}`);
    console.log(`[twilio] CallStatus: ${callStatus}`);
    console.log(`[twilio] stream url: ${STREAM_URL}`);

    try {
        const vr      = new twilio.twiml.VoiceResponse();
        const connect = vr.connect();
        connect.stream({ url: STREAM_URL });

        const xml = vr.toString();
        console.log(`[twilio] TwiML:\n${xml}`);
        console.log(`[twilio] ══════════════════════════════════════`);

        res.type('text/xml');
        res.send(xml);
    } catch (err) {
        // Fallback: if TwiML generation ever throws, still return valid XML
        // so Twilio gets proof the webhook was reached.
        console.error(`[twilio] ❌ TwiML generation error: ${err.message}`);
        const fallback = new twilio.twiml.VoiceResponse();
        fallback.say('Bravo voice webhook fallback reached.');
        console.log(`[twilio] ⚠ returning fallback TwiML`);
        res.type('text/xml');
        res.send(fallback.toString());
    }
});

// ---------------------------------------------------------------------------
// POST /twilio/status
//
// Receives call lifecycle events from Twilio (initiated / ringing / answered /
// completed). ErrorCode/ErrorMessage reveal TwiML or WebSocket failures.
// ---------------------------------------------------------------------------
router.post('/twilio/status', fromTwilio, (req, res) => {
    const { CallSid, CallStatus, CallDuration, From, To, ErrorCode, ErrorMessage } = req.body;

    console.log(`\n[status] ══════════════════════════════════════`);
    console.log(`[status] CallSid      : ${CallSid}`);
    console.log(`[status] CallStatus   : ${CallStatus}`);
    console.log(`[status] From         : ${From}`);
    console.log(`[status] To           : ${To}`);
    if (CallDuration !== undefined) console.log(`[status] CallDuration : ${CallDuration}s`);
    if (ErrorCode) {
        console.error(`[status] ❌ ErrorCode  : ${ErrorCode}`);
        console.error(`[status] ❌ ErrorMsg   : ${ErrorMessage}`);
    }
    console.log(`[status] ══════════════════════════════════════`);

    if (sessionState.current) sessionState.current.callStatus = CallStatus ?? sessionState.current.callStatus;

    // Mirror Twilio's view onto the order, so the card sees ringing, no-answer
    // or busy even when the AI never got on the line.
    const linked = callOrders.get(CallSid);
    if (linked && orders.has(linked.orderId)) {
        orders.set(linked.orderId, { ...orders.get(linked.orderId), twilioStatus: CallStatus });
    }
    debugLog('twilio', `Status: ${CallStatus}`, {
        callSid: CallSid, from: From, to: To,
        duration: CallDuration, errorCode: ErrorCode, errorMessage: ErrorMessage,
    });

    res.sendStatus(204);
});

export default router;
