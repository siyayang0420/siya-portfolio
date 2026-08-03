'use client';

import { useEffect, useState } from 'react';

/**
 * Shared preview toggle for how the Decision act is presented. Lets the floating
 * tweaker (FontSwitcher) swap the layout the same way it swaps fonts: choice is
 * persisted to localStorage and broadcast via a window event so every subscriber
 * (the Decision section + the tweaker's own active state) stays in sync.
 */
export type DecisionVariant = 'receipt' | 'cards';

export const DECISION_VARIANTS: { id: DecisionVariant; label: string }[] = [
  { id: 'receipt', label: 'Receipt' },
  { id: 'cards', label: 'Cards' },
];

const STORAGE_KEY = 'decision-variant';
const EVENT = 'decision-variant-change';
const DEFAULT: DecisionVariant = 'receipt';

export function setDecisionVariant(id: DecisionVariant) {
  localStorage.setItem(STORAGE_KEY, id);
  window.dispatchEvent(new CustomEvent(EVENT, { detail: id }));
}

export function useDecisionVariant(): DecisionVariant {
  // Start on the default so server + first client render match, then hydrate
  // the persisted choice in an effect.
  const [variant, setVariant] = useState<DecisionVariant>(DEFAULT);

  useEffect(() => {
    const saved =
      (localStorage.getItem(STORAGE_KEY) as DecisionVariant | null) ?? DEFAULT;
    setVariant(saved);

    const onChange = (e: Event) => {
      setVariant((e as CustomEvent).detail as DecisionVariant);
    };
    window.addEventListener(EVENT, onChange);
    return () => window.removeEventListener(EVENT, onChange);
  }, []);

  return variant;
}
