"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * The guards every looping hero demo needs, in one place.
 *
 *   · advances through `durations` on a timer and wraps
 *   · stops while off screen, so a demo below the fold is not burning frames
 *   · stops while paused
 *   · never starts under `prefers-reduced-motion` — the caller resolves a
 *     single frame instead, which is why `reduced` comes back out
 *
 * Attach `ref` to the element whose visibility decides whether the loop
 * runs. It is a plain ref, so the caller can hang its own observers on the
 * same element.
 *
 * `durations` is read by value, not identity: an inline array is safe.
 */
export function useLoopStep(durations: readonly number[]) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const [onScreen, setOnScreen] = useState(true);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => setOnScreen(e.isIntersecting),
      { rootMargin: "80px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const ms = durations[step];
  const count = durations.length;
  useEffect(() => {
    if (reduced || !onScreen || paused) return;
    const id = setTimeout(() => setStep((n) => (n + 1) % count), ms);
    return () => clearTimeout(id);
  }, [step, ms, count, reduced, onScreen, paused]);

  return { step, paused, setPaused, reduced, ref };
}
