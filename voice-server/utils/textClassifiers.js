// =============================================================================
// utils/textClassifiers.js — Restaurant utterance classification
//
// All functions take a text string (and optional lang) and return a boolean
// or a classification string. No side effects. No imports.
//
// Functions:
//   detectVoicemail(text)                    — automated/recorded greeting?
//   detectAvailability(text, lang)           — 'positive' | 'negative' | 'uncertain'
//   detectSoldOut(text, lang)                — item unavailable?
//   detectStoreClosed(text, lang)            — store closed / not taking orders?
//   isHoldOrWait(text)                       — "one moment", "稍等", etc.?
//   isWeakOrIrrelevantReply(text)            — filler / noise with no intent?
//   isExplicitRejection(text, lang)          — clear can't-take-order signal?
//   isOrderClarificationRequest(text, lang)  — "can you repeat that?" etc.?
//   isPhoneNumberRepeatRequest(text, lang)   — "what's the number again?" etc.?
//   inferOrderStatus(text, lang)             — 'accepted' | 'rejected' | 'uncertain'
// =============================================================================

// ---------------------------------------------------------------------------
// detectVoicemail(text)
//
// Returns true if the transcript looks like a voicemail / answering-machine
// greeting. Used to intercept before the availability-check state machine.
// ---------------------------------------------------------------------------
export function detectVoicemail(text) {
    if (!text) return false;
    const t = text.toLowerCase();
    // English voicemail patterns
    if (/\b(?:leave a message|after the (?:tone|beep)|please leave|record(?:ing)? your message|voicemail|voice mail|mailbox|not available to take your call|can't take your call|no one.*to answer|press \d+ (?:to|for)|for .+ press)\b/.test(t)) return true;
    // Chinese voicemail patterns
    if (/请留言|无法接听|语音信箱|请在.{0,8}后留言|拨打的电话|暂时无法接听|提示音后/.test(text)) return true;
    return false;
}

// ---------------------------------------------------------------------------
// detectAvailability(text, lang)
//
// Classifies the restaurant's first response to the availability check.
// Returns 'positive', 'negative', or 'uncertain'.
// Conservative — only 'positive' if there is a clear affirmative signal.
// ---------------------------------------------------------------------------
export function detectAvailability(text, lang = 'en') {
    if (!text) return 'uncertain';
    const t = text.toLowerCase();

    if (lang === 'zh_cn' || lang === 'zh_tw') {
        if (/好的|可以|没问题|没問題|行|嗯|好啊|当然|當然|请说|請說|您说|您說|说吧|說吧/.test(text)) return 'positive';
        if (/不行|不方便|打烊|没空|沒空|忙|暂时不|暫時不|不接单|不接單|关门|關門|已关|已關/.test(text)) return 'negative';
        return 'uncertain';
    }

    // English
    if (/\b(?:yes|yeah|yep|yup|sure|okay|ok|go ahead|go on|ready|of course|absolutely|please|certainly|no problem|right away|uh.?huh|mm.?hmm)\b/.test(t)) {
        return 'positive';
    }
    if (/\b(?:no\b|nope|not now|not available|unavailable|busy|closed|can't|cannot|not right now|call back|later|not a good time)\b/.test(t)) {
        return 'negative';
    }
    return 'uncertain';
}

// ---------------------------------------------------------------------------
// detectSoldOut(text, lang)
//
// Returns true if the restaurant says a specific item is unavailable/sold out.
// Kept distinct from detectStoreClosed so the outcome can be classified precisely.
// ---------------------------------------------------------------------------
export function detectSoldOut(text, lang = 'en') {
    if (!text) return false;
    if (lang === 'zh_cn' || lang === 'zh_tw') {
        return /没有|没货|卖完|没得|售完|今天没|不卖这个|已经没了|暂时没|那个没|这个没/.test(text);
    }
    return /\b(?:sold out|out of stock|don'?t have|do not have|no longer (?:have|sell|carry)|all out|none left|not available today|ran out|we don'?t carry|don'?t carry that|don'?t have that)\b/i.test(text);
}

// ---------------------------------------------------------------------------
// detectStoreClosed(text, lang)
//
// Returns true if the restaurant says they are closed or not taking orders now.
// ---------------------------------------------------------------------------
export function detectStoreClosed(text, lang = 'en') {
    if (!text) return false;
    if (lang === 'zh_cn' || lang === 'zh_tw') {
        return /打烊|关门|關門|停止营业|停止營業|今天不做|不接单|不接受|暂停营业|休息|没营业|没开|沒開|今天关|今天關/.test(text);
    }
    return /\b(?:we(?:'re| are) closed|not open(?:\s+today)?|kitchen(?:'s| is) closed|not taking orders|stop(?:ped)? serving|done for the day|already closed|closed for|no longer open|closing soon|just closed)\b/i.test(text);
}

// ---------------------------------------------------------------------------
// isHoldOrWait(text)
//
// Returns true if the restaurant is asking the agent to wait.
// Used both in language_selection and waiting_for_eta to respond naturally
// without counting the wait as a failed detection or missed ETA.
// ---------------------------------------------------------------------------
export function isHoldOrWait(text) {
    if (!text) return false;
    const t = text.toLowerCase().trim();
    // English hold phrases
    if (/\b(?:one (?:moment|second|sec|minute|min)|hold on|hold (?:on|please)|just a (?:moment|second|sec)|hang on|give me a (?:moment|second|sec)|wait a (?:moment|second)|bear with me|let me (?:check|see|look)|be right (?:back|with you)|just a bit|in a (?:moment|second|sec))\b/.test(t)) return true;
    // Chinese hold phrases
    if (/等一下|稍等|等一等|先等等|让我(?:看|查|问)|一下子|马上(?:来)?|稍候|等着|先等|等等/.test(text)) return true;
    return false;
}

// ---------------------------------------------------------------------------
// isWeakOrIrrelevantReply(text)
//
// Returns true for short/generic phrases that carry no actionable intent:
//   "Thank you", "bye", "hello", single-char noise, punctuation only, etc.
// Conservative — only obvious non-responses are flagged.
// ---------------------------------------------------------------------------
export function isWeakOrIrrelevantReply(text) {
    if (!text || text.trim().length < 2) return true;
    const t = text.trim().toLowerCase();

    // Very short (≤3 chars) — almost always transcription noise
    if (t.length <= 3) return true;

    // English weak / filler patterns (full-utterance match only)
    const enWeak = [
        /^(?:thank you|thanks|thank u|thx)\.?$/,
        /^(?:bye|goodbye|bye bye|see you|see ya|ciao)\.?$/,
        /^(?:hello|hi|hey|howdy|good (?:morning|afternoon|evening))\.?$/,
        /^(?:mm+|hmm+|uhh*|ahh*|ohh*)\.?$/,
        /^(?:hold on|one moment|one sec|just a (?:moment|sec))\.?$/,
        /^[.\s,!?]+$/,   // punctuation / whitespace only
    ];
    for (const p of enWeak) if (p.test(t)) return true;

    // Chinese weak / filler patterns
    const zhWeak = [
        /^(?:谢谢|谢了|谢谢你|谢谢您|感谢|谢)$/,
        /^(?:再见|拜拜|拜|88)$/,
        /^(?:喂|你好|您好)$/,
        /^(?:哦|嗯|啊|哈|呢|呀|哎|唉|哦哦|嗯嗯)$/,
    ];
    for (const p of zhWeak) if (p.test(text.trim())) return true;

    return false;
}

// ---------------------------------------------------------------------------
// isExplicitRejection(text, lang)
//
// Returns true if the restaurant clearly cannot or will not take the order.
// Used in waiting_for_eta to close the call gracefully on rejection.
// ---------------------------------------------------------------------------
export function isExplicitRejection(text, lang = 'en') {
    if (!text) return false;
    if (lang === 'zh_cn' || lang === 'zh_tw') {
        return /没有|没货|卖完了|不卖|打烊|关门|關門|停止营业|停止營業|不接单|不接受|无法接单|今天不做/.test(text);
    }
    return /\b(?:can't take|cannot take|not available|unavailable|we(?:'re| are) closed|out of (?:stock|service)|don't (?:have|carry)|no longer|discontinued|not (?:taking|accepting) orders|closed for|stop serving)\b/i.test(text);
}

// ---------------------------------------------------------------------------
// isOrderClarificationRequest(text, lang)
//
// Returns true when the restaurant is asking the agent to REPEAT something
// (an item, the whole order, the phone number, etc.).
//
// This is a POSITIVE signal — the restaurant is engaged and processing the
// order. It must NEVER be counted as an ETA failure or cause the call to end.
//
// Separate from isHoldOrWait: hold = "give me a moment",
//                             clarification = "say that again".
// ---------------------------------------------------------------------------
export function isOrderClarificationRequest(text, lang = 'en') {
    if (!text) return false;
    const t = text.toLowerCase().trim();

    if (lang === 'zh_cn' || lang === 'zh_tw') {
        return /再说一[遍次]|说一[遍次]|重复一?[下遍次]|再报一?[下次]|再说一次|听不清楚?|没听清楚?|说什么|什么菜|哪道菜|你说的是|能再说|麻烦再说|再讲一[遍次]|什么名字/.test(text);
    }

    // English clarification patterns — full-utterance and embedded
    return /\b(?:can you (?:repeat|say that|say it again|say that again|go over that|read that back)|(?:please\s+)?repeat(?: that)?(?:\s+again)?|say that again|what (?:was|did you say|were the items?|is the (?:item|dish|order))|(?:i(?:'m|\s+am)|we(?:'re|\s+are)) sorry,?\s+(?:could you|can you)|didn't (?:catch|hear)(?: that)?|couldn't (?:catch|hear)(?: that)?|come again|pardon\??|what was that|what was the (?:item|dish|order)|which (?:item|dish)|one more time|say again|could you (?:repeat|say that))\b/i.test(t);
}

// ---------------------------------------------------------------------------
// isPhoneNumberRepeatRequest(text, lang)
//
// Returns true when the restaurant asks the agent to repeat the customer
// phone / callback number. Distinct from isOrderClarificationRequest which
// covers repeat of items.
//
// Examples that should match:
//   "What's the number again?"
//   "Can you repeat the number?"
//   "What was the phone number?"
//   "那个电话几号？"
// ---------------------------------------------------------------------------
export function isPhoneNumberRepeatRequest(text, lang = 'en') {
    if (!text) return false;
    const t = text.toLowerCase().trim();

    if (lang === 'zh_cn' || lang === 'zh_tw') {
        return /电话|号码|手机号|联系号|几号|多少号|再说.*号|号.*再说|号码.*再|再.*号码/.test(text);
    }

    return /\b(?:(?:what(?:'s| is) the (?:phone\s+)?(?:number|num))|(?:(?:repeat|say|give me|tell me)(?: the)?(?: phone)? (?:number|num))|(?:(?:number|num) again)|(?:phone again)|(?:(?:didn't|couldn't) (?:get|catch|hear) the (?:number|num)))\b/i.test(t);
}

// ---------------------------------------------------------------------------
// inferOrderStatus(text, lang)
//
// Heuristic check on restaurant transcript to decide if order was accepted,
// rejected, or uncertain. Conservative — defaults to 'uncertain'.
// ---------------------------------------------------------------------------
export function inferOrderStatus(text, lang = 'en') {
    if (!text) return 'uncertain';
    const t = text.toLowerCase();

    if (lang === 'zh_cn' || lang === 'zh_tw') {
        if (/没有|没货|卖完|不卖|没得|打烊|关门|關門|停止营业|停止營業/.test(text)) return 'rejected';
        if (/好的|可以|没问题|分钟|小时|等一下|马上|稍等|好/.test(text)) return 'accepted';
        return 'uncertain';
    }

    if (/\b(?:can't|cannot|sorry|not available|unavailable|closed|unable|out of|don't have|do not have|no longer|discontinued)\b/.test(t)) {
        return 'rejected';
    }
    if (/\b(?:ready in|pickup in|be ready|minutes?|hours?|got it|okay|sure|of course|no problem|perfect|absolutely|will do|sounds good|coming right up)\b/.test(t)) {
        return 'accepted';
    }
    return 'uncertain';
}

// ---------------------------------------------------------------------------
// isUtensilOrRiceQuestion(text, lang)
//
// Returns true when the restaurant asks whether the customer wants utensils,
// chopsticks, a fork, a spoon, napkins, or rice as a side / accompaniment.
//
// The AI should always answer YES to these questions (never "no" or "up to
// the customer" — the caller cannot relay that back in real time).
//
// Short standalone forms ("Fork?", "Chopsticks?", "筷子？") are also matched.
// ---------------------------------------------------------------------------
export function isUtensilOrRiceQuestion(text, lang = 'en') {
    if (!text) return false;
    const t = text.trim();

    if (lang === 'zh_cn' || lang === 'zh_tw') {
        // keyword present
        const hasItem     = /餐具|叉子|筷子|勺子|汤匙|汤勺|纸巾|餐巾|白饭|米饭|炒饭|饭/.test(t);
        // question or offer marker
        const hasQuestion = /要不要|需不需要|加不加|放不放|带不带|想不想|要.*吗|需要.*吗|加.*吗|放.*吗|带.*吗/.test(t) ||
                            t.endsWith('吗') || t.endsWith('吗？') || t.endsWith('吗?');
        // short standalone: "筷子？" / "要筷子？"
        const shortForm   = /^要?(?:餐具|叉子|筷子|勺子|白饭|米饭|饭)[吗？?。]*$/.test(t);
        return (hasItem && hasQuestion) || shortForm;
    }

    // English — item keyword + question/offer indicator, or standalone short form
    const hasItem     = /\b(?:utensil|fork|chopstick|spoon|napkin|rice|white rice)\b/i.test(t);
    const hasQuestion = /\b(?:need|want|like|include|add|get|require)\b/i.test(t) || /\?/.test(t);
    // short forms: "Fork?" / "Chopsticks?" / "Rice?"
    const shortForm   = /^(?:fork|chopsticks?|spoon|utensils?|napkins?|rice)\s*[?.!]?$/i.test(t);
    return (hasItem && hasQuestion) || shortForm;
}

// ---------------------------------------------------------------------------
// isLikelyEcho(restaurantText, lastAgentText)
//
// Returns true when the restaurant's transcription appears to be acoustic
// echo of the AI's most-recent utterance (AI audio bleeding back through the
// restaurant's handset or speaker into the return audio channel).
//
// Uses two checks — whichever fires first:
//   1. Direct substring: the entire restaurant text (normalised) appears as a
//      literal substring of the normalised agent utterance.  Highly reliable.
//   2. Word-overlap ratio ≥ 70 % AND at least 4 matching words.  Conservative
//      threshold — avoids false-positives on genuine restaurant replies that
//      happen to re-use a few of the AI's words.
//
// Short restaurant texts (< 4 words for Latin, < 4 chars for CJK) are never
// flagged — they are handled by isWeakOrIrrelevantReply instead.
// ---------------------------------------------------------------------------
export function isLikelyEcho(restaurantText, lastAgentText) {
    if (!restaurantText || !lastAgentText) return false;

    const normalize = s => s.toLowerCase()
        .replace(/[^\w\s\u4e00-\u9fff]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

    const rNorm = normalize(restaurantText);
    const aNorm = normalize(lastAgentText);
    if (!rNorm || !aNorm) return false;

    const hasCJK = /[\u4e00-\u9fff]/.test(rNorm);

    if (hasCJK) {
        const rChars = [...rNorm.replace(/\s/g, '')];
        const aStr   = aNorm.replace(/\s/g, '');
        if (rChars.length < 4) return false;
        // Direct inclusion check
        if (aStr.includes(rNorm.replace(/\s/g, '')) && rChars.length > 5) return true;
        const overlap = rChars.filter(c => aStr.includes(c)).length;
        return overlap / rChars.length >= 0.7 && overlap >= 4;
    }

    // Latin / English
    const rWords = rNorm.split(' ').filter(Boolean);
    const aWords = new Set(aNorm.split(' ').filter(Boolean));
    if (rWords.length < 4) return false;   // too short — let weak-reply guard handle it

    // Direct substring (most reliable)
    if (aNorm.includes(rNorm) && rNorm.length > 8) return true;

    const overlap = rWords.filter(w => aWords.has(w)).length;
    return overlap / rWords.length >= 0.7 && overlap >= 4;
}
