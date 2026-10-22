// =============================================================================
// state/outcomeClassifier.js — Call outcome resolution
//
// resolveCallOutcome() maps the final agent state + transcript evidence to one
// of 6 canonical outcome strings. Called exactly once per call at close time.
//
// Outcomes:
//   order_completed     — ETA captured, order accepted
//   sold_out            — specific item unavailable
//   store_closed        — restaurant not taking orders
//   voicemail           — reached answering machine
//   unavailable_or_unclear — rejected but unclear reason, or no meaningful reply
//   failed              — call terminated before reaching a terminal state
// =============================================================================

import { detectSoldOut, detectStoreClosed } from '../utils/textClassifiers.js';

/**
 * Resolve a canonical outcome from final call state and transcript evidence.
 *
 * @param {string} agentState      — final agent state machine state
 * @param {object} orderResult     — { status, eta, callbackConfirmed }
 * @param {Array}  callTranscript  — [{ role: 'ai'|'restaurant', text }]
 * @param {string} lang            — active language code
 * @returns {{ outcome: string, details: object }}
 */
export function resolveCallOutcome(agentState, orderResult, callTranscript, lang) {
    // 1. Explicitly set as voicemail during state machine
    if (orderResult.status === 'voicemail') {
        return { outcome: 'voicemail', details: {} };
    }

    // 2. ETA received — order was accepted
    if (orderResult.status === 'accepted' && orderResult.eta) {
        return {
            outcome: 'order_completed',
            details: { eta: orderResult.eta, callbackConfirmed: orderResult.callbackConfirmed },
        };
    }

    // 3. Scan all restaurant lines for specific rejection reasons
    const restaurantText = callTranscript
        .filter(e => e.role === 'restaurant')
        .map(e => e.text)
        .join(' ');

    if (detectSoldOut(restaurantText, lang)) {
        return { outcome: 'sold_out', details: { evidence: restaurantText.slice(0, 150) } };
    }

    if (detectStoreClosed(restaurantText, lang)) {
        return { outcome: 'store_closed', details: { evidence: restaurantText.slice(0, 150) } };
    }

    // 4. Restaurant rejected but reason unclear
    if (orderResult.status === 'rejected') {
        return { outcome: 'unavailable_or_unclear', details: { reason: 'rejected_no_detail' } };
    }

    // 5. Uncertain / no meaningful response
    if (orderResult.status === 'uncertain') {
        return { outcome: 'unavailable_or_unclear', details: { reason: 'no_clear_response' } };
    }

    // 6. Call ended before reaching a terminal conversation state → technical failure
    if (agentState !== 'completed' && agentState !== 'voicemail') {
        return { outcome: 'failed', details: { reason: `terminated_at_state:${agentState}` } };
    }

    // 7. Completed state but no accepted/rejected signal — unclear
    return { outcome: 'unavailable_or_unclear', details: {} };
}
