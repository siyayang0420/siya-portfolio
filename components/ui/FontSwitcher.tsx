'use client';

import { useEffect, useState } from 'react';
import {
  DECISION_VARIANTS,
  setDecisionVariant,
  useDecisionVariant,
} from './decisionVariant';

type FontId = 'jakarta' | 'dm' | 'switzer';

const FONTS: { id: FontId; label: string; value: string; preview: string }[] = [
  { id: 'jakarta', label: 'Plus Jakarta', value: 'var(--font-jakarta)', preview: "var(--font-jakarta), sans-serif" },
  { id: 'dm', label: 'DM Sans', value: 'var(--font-dm)', preview: 'var(--font-dm), sans-serif' },
  { id: 'switzer', label: 'Switzer', value: "'Switzer'", preview: "'Switzer', sans-serif" },
];

const STORAGE_KEY = 'preview-font';

/**
 * Dev control to preview the site in different body fonts. Swaps the global
 * --font-sans variable (which every font-sans / font-display class reads) and
 * persists the choice to localStorage. Floating, collapsible, bottom-right.
 * Remove this component + its mount in layout.tsx once a font is chosen.
 */
export function FontSwitcher() {
  const [active, setActive] = useState<FontId>('dm');
  const [open, setOpen] = useState(false);
  const decision = useDecisionVariant();

  // Apply persisted choice on mount.
  useEffect(() => {
    const saved = (localStorage.getItem(STORAGE_KEY) as FontId | null) ?? 'dm';
    apply(saved);
    setActive(saved);
  }, []);

  const apply = (id: FontId) => {
    const font = FONTS.find((f) => f.id === id);
    if (!font) return;
    document.documentElement.style.setProperty('--font-sans', font.value);
  };

  const choose = (id: FontId) => {
    apply(id);
    setActive(id);
    localStorage.setItem(STORAGE_KEY, id);
  };

  return (
    <div className="fixed bottom-5 right-5 z-[200] flex flex-col items-end gap-2">
      {open && (
        <div className="flex w-[220px] flex-col gap-1 rounded-xl border border-neutral-200 bg-white p-1.5 shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
          <div className="px-2 pt-1 pb-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
            Font
          </div>
          {FONTS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => choose(f.id)}
              className={`flex items-center justify-between gap-6 rounded-lg px-3 py-2 text-left text-[14px] transition-colors ${
                active === f.id
                  ? 'bg-ink text-white'
                  : 'text-ink hover:bg-neutral-100'
              }`}
              style={{ fontFamily: f.preview }}
            >
              <span>{f.label}</span>
              <span className="text-[12px] opacity-60">Aa 0–9</span>
            </button>
          ))}

          <div className="mx-2 my-1 border-t border-neutral-100" />

          <div className="px-2 pt-0.5 pb-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
            Decision layout
          </div>
          {DECISION_VARIANTS.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => setDecisionVariant(v.id)}
              className={`flex items-center justify-between gap-6 rounded-lg px-3 py-2 text-left text-[14px] transition-colors ${
                decision === v.id
                  ? 'bg-ink text-white'
                  : 'text-ink hover:bg-neutral-100'
              }`}
            >
              <span>{v.label}</span>
            </button>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Toggle font switcher"
        className="flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2.5 text-[12px] font-medium tracking-[0.06em] uppercase text-ink shadow-[0_4px_16px_rgba(0,0,0,0.1)] hover:bg-neutral-50 transition-colors"
      >
        <span aria-hidden="true" className="text-[15px] leading-none">
          Aa
        </span>
        {FONTS.find((f) => f.id === active)?.label ?? 'Font'}
      </button>
    </div>
  );
}
