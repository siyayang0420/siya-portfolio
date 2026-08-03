'use client';

import { useEffect } from 'react';

/**
 * Click feedback inspired by marttin.framer.website: on every click, four
 * short strokes radiate outward from the cursor and fade. Pointer-events:
 * none, so it never interferes with the actual click target.
 */
export function ClickBurst() {
  useEffect(() => {
    const onClick = (e: PointerEvent) => {
      if (e.button !== 0) return;

      const wrap = document.createElement('span');
      wrap.className = 'click-burst-wrap';
      wrap.style.left = `${e.clientX}px`;
      wrap.style.top = `${e.clientY}px`;

      const angles = [-42, -14, 14, 42];
      for (const a of angles) {
        const stroke = document.createElement('span');
        stroke.className = 'click-burst-stroke';
        stroke.style.setProperty('--angle', `${a}deg`);
        wrap.appendChild(stroke);
      }

      document.body.appendChild(wrap);
      const last = wrap.lastElementChild as HTMLElement | null;
      const cleanup = () => wrap.remove();
      if (last) last.addEventListener('animationend', cleanup, { once: true });
      else cleanup();
    };

    window.addEventListener('pointerdown', onClick);
    return () => window.removeEventListener('pointerdown', onClick);
  }, []);

  return null;
}
