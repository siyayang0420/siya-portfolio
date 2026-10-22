// =============================================================================
// utils/languageDetection.js — Language inference and preference detection
//
// Three functions covering the language-selection phase of a call:
//
//   detectLanguagePreference()    — STRICT: explicit "English"/"Chinese" keyword
//   inferLanguageFromAnyUtterance() — SOFT: script/ASCII detection from any text
//   detectLanguageSwitchRequest() — mid-call: "can you speak English?" etc.
// =============================================================================

// ---------------------------------------------------------------------------
// detectLanguagePreference(text)
//
// STRICT: requires an explicit "English" / "Chinese" keyword in the response.
// Used as the first-pass check during language_selection.
// If this returns null, fall through to inferLanguageFromAnyUtterance().
//
// Returns: 'en' | 'zh_cn' | null
// ---------------------------------------------------------------------------
export function detectLanguagePreference(text) {
    if (!text) return null;
    const t = text.toLowerCase();
    // Chinese preference — explicit keyword
    if (/\b(?:chinese|mandarin|cantonese)\b|中文|普通话|国语|说中文|讲中文|用中文/.test(t)) return 'zh_cn';
    // English preference — explicit keyword
    if (/\benglish\b|英[文语]/.test(t)) return 'en';
    return null;
}

// ---------------------------------------------------------------------------
// inferLanguageFromAnyUtterance(text)
//
// SOFT: infers language from ANY restaurant utterance — even a plain greeting.
// Called as the second-pass fallback when detectLanguagePreference() returns null.
//
// Logic:
//   1. Any CJK character → Chinese  (unambiguous script signal)
//   2. Common Chinese verbal tokens (喂, 你好, etc.) → Chinese
//   3. Explicit language keyword (belt+suspenders) → respective lang
//   4. All-ASCII printable text (2+ chars) → English
//      Catches: "Hello?", "Typhoon restaurant", "Yes?", "Go ahead", etc.
//   5. Mixed / ambiguous → null
//
// Returns: 'en' | 'zh_cn' | null
// ---------------------------------------------------------------------------
export function inferLanguageFromAnyUtterance(text) {
    if (!text) return null;
    const t = text.trim();
    if (t.length < 2) return null;

    // ── Strong signal: Chinese characters present ─────────────────────────────
    // Unicode CJK blocks: main (4E00-9FFF), extension A (3400-4DBF),
    // fullwidth / symbols (FF00-FFEF)
    if (/[\u4e00-\u9fff\u3400-\u4dbf\uff00-\uffef]/.test(t)) {
        return 'zh_cn';
    }

    // ── Chinese tokens transcribed without hanzi (rare but possible) ──────────
    const tl = t.toLowerCase();
    if (/\b(?:ni hao|wei|nin hao|nimen hao)\b/.test(tl)) return 'zh_cn';

    // ── Explicit language keyword (belt+suspenders) ───────────────────────────
    if (/\b(?:chinese|mandarin|cantonese)\b/.test(tl)) return 'zh_cn';
    if (/\benglish\b/.test(tl)) return 'en';

    // ── All ASCII printable text → English ────────────────────────────────────
    // Key fix: any recognizable English restaurant utterance
    // ("Hello?", "Hello, Typhoon restaurant", "Yes?", "Typhoon, Alex speaking")
    // is all-ASCII and at least 2 chars. Treat as English.
    if (/^[\x20-\x7E]+$/.test(t)) return 'en';

    return null; // mixed / truly ambiguous
}

// ---------------------------------------------------------------------------
// detectLanguageSwitchRequest(text, currentLang)
//
// Returns a new language code if the restaurant explicitly asks to switch
// language mid-call, or null if no switch is requested.
//
// Only called in non-language_selection states — when the agent is already
// speaking in a confirmed language and the restaurant wants to change.
//
// Returns: 'en' | 'zh_cn' | null
// ---------------------------------------------------------------------------
export function detectLanguageSwitchRequest(text, currentLang) {
    if (!text) return null;
    const t = text.toLowerCase();

    // Restaurant asks for English while agent is speaking Chinese
    if ((currentLang === 'zh_cn' || currentLang === 'zh_tw') &&
        /\b(?:english|speak english|in english|english please|don't speak chinese|don't understand chinese|i don't speak|can you speak english|switch to english|use english)\b/.test(t)) {
        return 'en';
    }

    // Restaurant asks for Chinese while agent is speaking English
    if (currentLang === 'en' &&
        /说中文|讲中文|用中文|说普通话|我不会英[文语]|听不懂英[文语]|请说中文|改说中文/.test(text)) {
        return 'zh_cn';
    }

    return null;
}
