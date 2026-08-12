'use client';

import { cn } from '@/lib/cn';
import { PILL } from '@/components/ui/pill';

/**
 * The case study's progress indicator: one pill naming the act you're reading,
 * with a dot travelling its outline to show how far through you are.
 *
 * The surface is the shared PILL treatment, so it reads as the same object as
 * the nav buttons, minus its hover fill. Its ring is switched off and redrawn
 * in SVG instead: the outline and the dot have to be one piece of geometry, and
 * Tailwind's `ring` is a box-shadow sitting *outside* the border box — an SVG
 * path inset within it would show as a second, offset line.
 *
 * The dot and the fill behind it are the same rect stroked twice with dash
 * patterns: a round line cap on a zero-length dash renders as a circle, so the
 * dot needs no separate element and no per-frame position maths.
 */

const ACCENT = '#4f83f7';

/** Matches the nav buttons' computed height; width is fixed — see below. */
const H = 44;

/**
 * Fixed rather than sized to the label. The four words differ in width, and
 * letting the pill resize as you scroll makes it twitch every time the act
 * changes — worse, it would move the dot's track underneath the dot.
 */
const W = 148;

export default function ActPill({
  label,
  progress,
  onClick,
}: {
  label: string;
  /** 0 → 1 through the whole case study. */
  progress: number;
  onClick?: () => void;
}) {
  const p = Math.max(0, Math.min(1, progress)) * 100;
  // With dasharray "a b" and offset d, the dash starts at -d along the path.
  // The fill is a dash of length p at offset 0, so its tail stays pinned to the
  // path's origin and only its leading edge moves — more colour means more read.
  // The dot is a zero-length dash pushed to that same leading edge.
  const dotOffset = -p;

  // Inset by half the outline so the stroke sits inside the box.
  const rect = { x: 0.5, y: 0.5, width: W - 1, height: H - 1, rx: (H - 1) / 2 };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${label} — jump to the next section`}
      className={cn(
        PILL,
        'relative duration-200 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4f83f7]/40',
        // The outline is drawn in SVG instead — see the note above.
        'ring-0',
        // No hover fill. PILL's accent wash would swallow the progress arc,
        // and this pill's job is to report where you are, not to invite a click.
        'hover:bg-white hover:text-black active:bg-white active:text-black',
      )}
      style={{ width: W, height: H }}
    >
      <span key={label} className="anim-swap absolute inset-0 flex items-center justify-center">
        {label}
      </span>

      {/* `overflow-visible` is load-bearing: the strokes are centred on the
          path, so the 5px dot hangs 2.5px outside the box and would otherwise
          be sliced flat against the viewBox edge. */}
      <svg
        aria-hidden
        width={W}
        height={H}
        className="pointer-events-none absolute inset-0 overflow-visible"
      >
        {/* The track, in the same value as the nav buttons' ring. */}
        <rect
          {...rect}
          fill="none"
          stroke="rgba(0,0,0,0.06)"
          strokeWidth={1}
        />
        <rect
          {...rect}
          fill="none"
          pathLength={100}
          stroke={ACCENT}
          strokeWidth={2.5}
          // Butt, not round: with a round cap a progress of 0 would still
          // paint a stray half-circle at the origin.
          strokeLinecap="butt"
          strokeDasharray={`${p} 100`}
          style={{ transition: 'stroke-dasharray 150ms ease-out' }}
        />
        <rect
          {...rect}
          fill="none"
          pathLength={100}
          stroke={ACCENT}
          strokeWidth={5}
          strokeLinecap="round"
          // A dash of almost no length with a round cap *is* the dot.
          strokeDasharray="0.001 100"
          strokeDashoffset={dotOffset}
          style={{ transition: 'stroke-dashoffset 150ms ease-out' }}
        />
      </svg>
    </button>
  );
}
