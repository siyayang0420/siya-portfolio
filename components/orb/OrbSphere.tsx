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

type Engine = { destroy(): void; setSpeed(v: number): void };

export function OrbSphere({
  speed = 1,
  breathing = false,
  className,
}: {
  speed?: number;
  /** Slow swell on top of the rotation — see `.orb-breathe` in globals.css. */
  breathing?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const orbRef = useRef<Engine | null>(null);

  // Created once. Speed changes go through `setSpeed` below rather than
  // through this effect's deps — rebuilding on every change would tear down
  // and recompile the WebGL context each time the state is switched.
  useEffect(() => {
    const host = ref.current;
    if (!host) return;
    // Guarded: WebGL can be unavailable (blocked, software-blacklisted, or in a
    // headless renderer), and the engine logs and returns rather than throwing.
    // A dead orb should leave the card intact, not take the page down.
    try {
      orbRef.current = new OrbSphereEngine(host, { speed }) as Engine;
    } catch {
      return;
    }
    return () => {
      orbRef.current?.destroy();
      orbRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    orbRef.current?.setSpeed(speed);
  }, [speed]);

  return (
    <div
      ref={ref}
      aria-hidden
      className={`${className ?? ''}${breathing ? ' orb-breathe' : ''}`}
    />
  );
}
