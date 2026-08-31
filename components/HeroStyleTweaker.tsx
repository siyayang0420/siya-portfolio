'use client';

import { useEffect, useState } from 'react';

/**
 * A two-up switch for the hero's treatment.
 *
 * The variant lives in one place — `data-hero-style` on <html> — and everything
 * that reads it is CSS. So this component holds no design decisions at all; it
 * writes an attribute and remembers the choice. That is deliberate: a preview
 * control that owns styling ends up being the only way to see the second style,
 * and the moment you delete the control you delete the design with it.
 *
 * Small, low-contrast, and bottom-left, out of the way of the hero's own
 * content: it is a thing to try, not a thing to read.
 */

export const HERO_STYLES = [
  { id: 'wash', label: 'Wash' },
  { id: 'engraved', label: 'Engraved' },
] as const;

export type HeroStyle = (typeof HERO_STYLES)[number]['id'];

export const HERO_STYLE_KEY = 'hero-style';

export default function HeroStyleTweaker() {
  // Starts undefined rather than 'wash' so the first paint doesn't assert a
  // value the pre-paint script in the document head may already have changed.
  const [style, setStyle] = useState<HeroStyle | null>(null);

  useEffect(() => {
    const current = document.documentElement.dataset.heroStyle;
    setStyle(current === 'engraved' ? 'engraved' : 'wash');
  }, []);

  const pick = (next: HeroStyle) => {
    setStyle(next);
    document.documentElement.dataset.heroStyle = next;
    try {
      localStorage.setItem(HERO_STYLE_KEY, next);
    } catch {
      // Private mode, or storage disabled. The switch still works for this
      // visit; it just won't be remembered.
    }
  };

  return (
    <div
      // Bottom-right: bottom-left is where Next's dev indicator sits, and the
      // mobile scroll cue owns the bottom centre.
      className="fixed bottom-5 right-5 z-50 flex items-center gap-1 rounded-full border border-black/[0.06] bg-white/85 p-1 shadow-[0_1px_2px_rgba(0,0,0,0.06),0_8px_24px_-10px_rgba(0,0,0,0.25)] backdrop-blur-md print:hidden"
      role="group"
      aria-label="Hero style"
    >
      {/* The label is inside the pill rather than above it so the control reads
          as one object at a glance. */}
      {/* Dropped on phones, where the full pill would sit across the scroll
          cue. The two labels say what it is well enough without it. */}
      <span className="hidden pl-2.5 pr-1 text-[11px] uppercase tracking-[0.12em] text-black/35 sm:inline">
        Hero
      </span>
      {HERO_STYLES.map((option) => {
        const isActive = style === option.id;
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => pick(option.id)}
            aria-pressed={isActive}
            className={`rounded-full px-3 py-1.5 font-display text-[13px] font-medium transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4f83f7]/40 ${
              isActive
                ? 'bg-[#4f83f7] text-white'
                : 'text-black/55 hover:bg-black/[0.04] hover:text-black'
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
