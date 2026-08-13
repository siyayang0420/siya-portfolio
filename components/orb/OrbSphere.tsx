'use client';

import { useEffect, useRef } from 'react';
import { OrbSphere as OrbSphereEngine } from './orb-sphere.js';

/**
 * React wrapper for the OrbSphere WebGL module.
 *
 * The orb is drawn from a fragment shader rather than shipped as a GIF or
 * video: it stays crisp at any size, its edge is real 8-bit alpha so it
 * composites onto the card behind it with no matte fringe, and the whole thing
 * is ~11KB of shader text instead of megabytes of frames.
 *
 * The engine already caps devicePixelRatio at 2, pauses itself when scrolled
 * off screen, and honours `prefers-reduced-motion`, so this wrapper only has to
 * own the element's lifetime.
 */

type Engine = { destroy(): void };

export function OrbSphere({
  speed = 1,
  className,
}: {
  speed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = ref.current;
    if (!host) return;
    // Guarded: WebGL can be unavailable (blocked, software-blacklisted, or in a
    // headless renderer), and the engine logs and returns rather than throwing.
    // A dead orb should leave the card intact, not take the page down.
    let orb: Engine | undefined;
    try {
      orb = new OrbSphereEngine(host, { speed }) as Engine;
    } catch {
      return;
    }
    return () => orb?.destroy();
  }, [speed]);

  return <div ref={ref} aria-hidden className={className} />;
}
