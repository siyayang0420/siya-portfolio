// =============================================================================
// utils/timeParser.js — ETA extraction from restaurant transcript text
//
// extractETA() scans a text string for any mention of a pickup time and
// returns the first match, or null if none is found.
//
// Patterns cover:
//   - Chinese numeral words: "二十分钟", "十五分钟左右"
//   - Chinese digit strings: "大概15分钟", "15到20分钟"
//   - Chinese half/full hour: "半小时", "一个小时"
//   - Chinese clock times: "七点", "七点半"
//   - English range: "15 to 20 minutes", "15-20 min"
//   - English qualified: "about 15 minutes", "around 20 min"
//   - English plain: "15 minutes", "20 min"
//   - English clock: "ready at 7", "at 7:30 pm"
//   - English half/full hour: "half an hour", "one hour"
//   - English "a few minutes"
// =============================================================================

const ETA_PATTERNS = [
    // ── Chinese numeral words ─────────────────────────────────────────────────
    // "二十分钟" / "十五分钟左右" / "三十分钟" / "大概二十分钟"
    /大[约概半]?\s*(?:二十|三十|四十|十五|十|二|三|四|五)\s*分钟/,
    /(?:二十|三十|四十|十五|十|二|三|四|五)\s*分钟(?:左右|以内|以上)?/,

    // ── Chinese digits ────────────────────────────────────────────────────────
    // "大概15分钟" / "15分钟左右" / "15到20分钟"
    /(\d+)\s*到\s*(\d+)\s*分钟/,
    /大[约概]\s*(\d+)\s*分钟/,
    /(\d+)\s*分钟(?:左右|以内|以上)?/,

    // ── Chinese: half-hour / hour ─────────────────────────────────────────────
    /大概半小时|大约半小时|半小时/,
    /一个小时|1\s*个小时|一小时/,

    // ── Chinese: clock time — "七点" / "七点半" ───────────────────────────────
    /[一二三四五六七八九十]+点(?:半|钟)?/,

    // ── English: range — "15 to 20 minutes" / "15-20 min" ────────────────────
    /\b(\d+)\s*(?:to|-)\s*(\d+)\s*min(?:utes?)?\b/i,

    // ── English: qualified — "about 15 minutes" / "around 20 min" ────────────
    /\b(?:about|around|approximately|roughly|maybe|like)\s+(\d+)\s*min(?:utes?)?\b/i,

    // ── English: plain — "15 minutes" / "20 min" ─────────────────────────────
    /\b(\d+)\s*min(?:utes?)?\b/i,

    // ── English: clock time — "ready at 7" / "at 7:30" / "at 7 pm" ──────────
    /\b(?:ready\s+)?at\s+\d{1,2}(?::\d{2})?\s*(?:am|pm)?\b/i,

    // ── English: half / full hour ─────────────────────────────────────────────
    /\bhalf\s+(?:an?\s+)?hour\b/i,
    /\b(?:one|1)\s+hour\b/i,
    /\ban\s+hour\b/i,

    // ── English: "a few minutes" ──────────────────────────────────────────────
    /\ba\s+few\s+min(?:utes?)?\b/i,
];

/**
 * Scan text for any pickup-time mention.
 * Returns the matched string on the first pattern hit, or null.
 *
 * @param {string|null} text
 * @returns {string|null}
 */
export function extractETA(text) {
    if (!text) return null;
    for (const pattern of ETA_PATTERNS) {
        const m = text.match(pattern);
        if (m) return m[0];
    }
    return null;
}
