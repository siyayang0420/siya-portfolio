// =============================================================================
// menu.js — the demo's fixed menu, owned by the server.
//
// The browser only sends item ids and quantities. Names the agent speaks come
// from here, never from the request, so nobody can make the AI say arbitrary
// text on a real phone call.
// =============================================================================

export const RESTAURANT = {
    en:    'A&W',
    zh_cn: 'A&W',
    zh_tw: 'A&W',
};

export const MENU = [
    { id: 'teen-burger',  en: 'Teen Burger',   zh_cn: 'Teen 汉堡',  zh_tw: 'Teen 漢堡',  mw: '个' },
    { id: 'mozza-burger', en: 'Mozza Burger',  zh_cn: 'Mozza 汉堡', zh_tw: 'Mozza 漢堡', mw: '个' },
    { id: 'root-beer',    en: 'A&W Root Beer', zh_cn: '根汁汽水',   zh_tw: '麥根沙士',   mw: '杯' },
];

const byId = new Map(MENU.map((m) => [m.id, m]));

/** Turns [{ id, quantity }] into the payload the agent speaks, or null if invalid. */
export function buildItems(requested) {
    if (!Array.isArray(requested) || requested.length === 0 || requested.length > 5) return null;
    const items = [];
    for (const r of requested) {
        const m = byId.get(r?.id);
        const q = Number(r?.quantity);
        if (!m || !Number.isInteger(q) || q < 1 || q > 5) return null;
        items.push({
            id: m.id,
            quantity: q,
            name: { en: m.en, zh_cn: m.zh_cn, zh_tw: m.zh_tw },
            measure_word: { zh_cn: m.mw, zh_tw: m.mw },
        });
    }
    return items;
}

/** The name the agent introduces itself for: letters, spaces, . ' - only, 1–20 chars. */
export function cleanName(raw) {
    const n = String(raw ?? '').trim().replace(/\s+/g, ' ');
    return /^[\p{L}][\p{L} .'-]{0,19}$/u.test(n) ? n : null;
}
