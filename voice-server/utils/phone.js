// =============================================================================
// utils/phone.js — which numbers the demo is allowed to dial.
// Self-check: `npm test` (check.js).
// =============================================================================

// +1, then a valid NANP area code and exchange. Toll-free and premium-rate
// area codes are refused so the demo can't be pointed at paid lines.
const NANP = /^\+1([2-9]\d{2})[2-9]\d{6}$/;
const BLOCKED_AREA = new Set(['800', '833', '844', '855', '866', '877', '888', '900', '976']);

/** Normalises "(778) 555-0100" / "17785550100" to +17785550100, or null. */
export function normalisePhone(raw) {
    const digits = String(raw ?? '').replace(/\D/g, '');
    const e164 = digits.length === 10 ? `+1${digits}` : digits.length === 11 && digits[0] === '1' ? `+${digits}` : null;
    const m = e164 && NANP.exec(e164);
    return m && !BLOCKED_AREA.has(m[1]) ? e164 : null;
}
