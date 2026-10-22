// =============================================================================
// routes/callRoutes.js — the portfolio demo's call API
//
//   POST /api/calls      { items: [{ id, quantity }], phone, name, consent }
//                        → dials the visitor's own phone; the AI places the
//                          order with whoever picks up (they play the staff)
//   GET  /api/calls/:id  → status, outcome, ETA and the live transcript
//
// Guardrails, in order: kill switch, allowed origin, consent, North American
// number (no toll-free / premium), one call at a time, per-number and daily
// caps. Twilio's timeLimit hangs up anything that runs long.
// =============================================================================

import express        from 'express';
import { randomUUID } from 'crypto';
import {
    twilioClient,
    TWILIO_PHONE_NUMBER,
    PUBLIC_BASE_URL,
    CALL_LANGUAGE,
    CALLS_ENABLED,
    ALLOWED_ORIGINS,
    DAILY_CALL_CAP,
    PER_NUMBER_DAILY_CAP,
    CALL_TIME_LIMIT_S,
    BONUS_NUMBERS,
}                            from '../config/env.js';
import { orders, callOrders, sessionState } from '../state/store.js';
import { debugLog }          from '../services/debugLogger.js';
import { RESTAURANT, buildItems, cleanName } from '../menu.js';
import { normalisePhone }  from '../utils/phone.js';

const router = express.Router();

// In-memory daily counters. ponytail: resets on restart; good enough for a
// portfolio demo, move to a store (Redis/KV) if it ever gets real traffic.
let day = '';
let dailyTotal = 0;
const perNumber = new Map();
function countToday(phone) {
    const today = new Date().toISOString().slice(0, 10);
    if (today !== day) { day = today; dailyTotal = 0; perNumber.clear(); }
    return { total: dailyTotal, mine: perNumber.get(phone) ?? 0 };
}

// How many extra calls each number has been granted (one per listing).
const bonus = new Map();
for (const raw of BONUS_NUMBERS) {
    const n = normalisePhone(raw);
    if (n) bonus.set(n, (bonus.get(n) ?? 0) + 1);
}

const TERMINAL = new Set(['completed', 'failed', 'busy', 'no-answer', 'canceled']);
function lineBusy() {
    const s = sessionState.current;
    if (!s) return false;
    const o = orders.get(s.orderId);
    const done = TERMINAL.has(o?.callStatus) || TERMINAL.has(o?.twilioStatus);
    return !done && Date.now() - s.startTime < (CALL_TIME_LIMIT_S + 60) * 1000;
}

router.post('/api/calls', async (req, res) => {
    if (!CALLS_ENABLED) return res.status(503).json({ ok: false, error: 'calls_disabled' });

    if (!ALLOWED_ORIGINS.includes(req.headers.origin)) {
        return res.status(403).json({ ok: false, error: 'origin_not_allowed' });
    }
    if (req.body?.consent !== true) {
        return res.status(400).json({ ok: false, error: 'consent_required' });
    }
    const phone = normalisePhone(req.body?.phone);
    if (!phone) return res.status(400).json({ ok: false, error: 'invalid_phone' });

    // Spoken on the call ("Hi, this is Alex's AI assistant…"), so it's held
    // to plain letters; nothing else from the visitor reaches the agent.
    const customerName = cleanName(req.body?.name);
    if (!customerName) return res.status(400).json({ ok: false, error: 'invalid_name' });

    const items = buildItems(req.body?.items);
    if (!items) return res.status(400).json({ ok: false, error: 'invalid_items' });

    if (lineBusy()) return res.status(409).json({ ok: false, error: 'line_busy' });

    const { total, mine } = countToday(phone);
    if (total >= DAILY_CALL_CAP)        return res.status(429).json({ ok: false, error: 'daily_cap' });
    if (mine >= PER_NUMBER_DAILY_CAP + (bonus.get(phone) ?? 0)) {
        return res.status(429).json({ ok: false, error: 'number_cap' });
    }

    const orderId = randomUUID();
    // The visitor is both the customer (callback number) and, on the phone,
    // the restaurant staff taking the order.
    const order = {
        orderId,
        restaurantName:      RESTAURANT,
        customerName,
        callbackPhoneNumber: phone,
        items,
        callStatus: 'pending',
        callSid:    null,
        createdAt:  new Date().toISOString(),
    };
    orders.set(orderId, order);

    sessionState.current = {
        orderId,
        callSid:     null,
        startTime:   Date.now(),
        order,
        lang:        CALL_LANGUAGE,
        agentState:  'language_selection',
        callStatus:  'pending',
        orderResult: { status: 'pending', eta: null, callbackConfirmed: false, finalOutcome: null },
        connections: { twilio: true, mediaStream: false, openai: false },
        transcript:  [],
    };

    try {
        const call = await twilioClient.calls.create({
            to:                   phone,
            from:                 TWILIO_PHONE_NUMBER,
            url:                  `${PUBLIC_BASE_URL}/twilio/voice`,
            method:               'POST',
            statusCallback:       `${PUBLIC_BASE_URL}/twilio/status`,
            statusCallbackMethod: 'POST',
            statusCallbackEvent:  ['initiated', 'ringing', 'answered', 'completed'],
            timeLimit:            CALL_TIME_LIMIT_S,
        });

        dailyTotal += 1;
        perNumber.set(phone, mine + 1);

        const updated = { ...order, callStatus: 'calling', callSid: call.sid };
        orders.set(orderId, updated);
        callOrders.set(call.sid, updated);
        sessionState.current.callSid    = call.sid;
        sessionState.current.callStatus = 'calling';
        debugLog('twilio', `Call created — SID: ${call.sid}`, { callSid: call.sid });

        res.json({ ok: true, callId: orderId });
    } catch (err) {
        console.error(`[call] ❌ Twilio API error: ${err.message}`);
        orders.set(orderId, { ...order, callStatus: 'failed' });
        sessionState.current = null;
        res.status(502).json({ ok: false, error: 'call_failed' });
    }
});

router.get('/api/calls/:id', (req, res) => {
    const o = orders.get(req.params.id);
    if (!o) return res.status(404).json({ ok: false, error: 'not_found' });
    const live = sessionState.current?.orderId === o.orderId ? sessionState.current : null;
    res.json({
        ok:           true,
        status:       o.callStatus,
        twilioStatus: o.twilioStatus ?? null,
        outcome:      o.outcome ?? null,
        eta:          o.eta ?? null,
        transcript:   live?.transcript ?? [],
    });
});

export default router;
