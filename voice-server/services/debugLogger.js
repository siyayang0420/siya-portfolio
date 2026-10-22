// =============================================================================
// services/debugLogger.js — Structured debug event logging + SSE broadcast
//
// debugLog() records an event to the ring buffer AND pushes it to all
// connected SSE clients in real time. It also emits a session_update snapshot
// after every event so the UI stays current without polling.
//
// Does NOT suppress console.log — terminal logging and SSE push run in
// parallel throughout the codebase.
// =============================================================================

import { debugEvents, sseClients, sessionState } from '../state/store.js';

/**
 * Record a structured debug event and push to all live SSE clients.
 *
 * @param {string} category  — e.g. 'agent', 'twilio', 'openai', 'order', 'sms'
 * @param {string} message   — human-readable summary
 * @param {object} [data={}] — arbitrary key/value detail payload
 */
export function debugLog(category, message, data = {}) {
    const evt = {
        id:       `dbg_${Date.now()}_${(Math.random() * 1e6 | 0).toString(36)}`,
        ts:       Date.now(),
        category,
        message,
        data,
    };

    debugEvents.push(evt);
    if (debugEvents.length > 500) debugEvents.shift();

    // Push event to every connected SSE client
    const payload = `data: ${JSON.stringify(evt)}\n\n`;
    for (const client of sseClients) {
        try { client.write(payload); }
        catch { sseClients.delete(client); }
    }

    // Also emit a lightweight session-state update so UI stays current
    if (sessionState.current) {
        const snap = `data: ${JSON.stringify({
            type:    'session_update',
            session: { ...sessionState.current },
        })}\n\n`;
        for (const client of sseClients) {
            try { client.write(snap); }
            catch { sseClients.delete(client); }
        }
    }
}
