'use client';

import { animate, motion, useMotionValue, useTransform } from 'framer-motion';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { cn } from '@/lib/cn';
import { PILL } from '@/components/ui/pill';

/**
 * The case study's progress indicator: one pill naming the act you're reading,
 * with a dot travelling its outline to show how far through you are — and the
 * same object opened out into the full list of acts.
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
 *
 * Opening is a morph rather than a panel: the box animates to the open size and
 * the outline is redrawn against it every frame, so the progress arc and its dot
 * stretch around the growing rectangle instead of being swapped for a second
 * shape. `pathLength={100}` is what makes that free — progress stays a fraction
 * of the perimeter whatever the perimeter currently is.
 *
 * The box is a pair of motion values rather than React state. Reporting each
 * frame back through `setState` re-renders the component mid-animation, which
 * hands Framer a fresh target every frame and restarts the transition from
 * wherever it had got to — the morph crawls a few pixels and stalls. Motion
 * values write straight to the DOM, so the outline tracks the box with no
 * render at all.
 *
 * The corner radius is held at the chip's own, so the open shape is the chip
 * with more height rather than a different family of rectangle.
 */

const ACCENT = '#4f83f7';

/** Matches the nav buttons' computed height; width is fixed — see below. */
const H = 44;
/** A list row. */
const ITEM_H = 36;
/** A row's own side padding, inside the list's inset. */
const ITEM_PAD = 16;
/** The open list's own inset, `p-1.5`. */
const PAD = 6;

/**
 * Wide enough for Bravo's four one-word acts.
 *
 * Constant rather than sized to the active label: the names differ in width,
 * and resizing as you scroll makes the pill twitch on every act change —
 * worse, it moves the dot's track out from under the dot. A case study whose
 * names don't fit passes its own `width` instead, so the pill is still a fixed
 * size *within* a study.
 */
const DEFAULT_W = 148;

const ease = [0.23, 1, 0.32, 1] as const;

export default function ActPill({
  labels,
  activeIndex,
  progress,
  items,
  onClick,
  onSelect,
  open = false,
  width = DEFAULT_W,
}: {
  /** Every act name, in order — they all render, stacked. */
  labels: string[];
  activeIndex: number;
  /** The open list: one row per act — see ActsShell. */
  items: { label: string; id: string; active: boolean }[];
  /** 0 → 1 through the whole case study. */
  progress: number;
  /** Closed only: the whole surface is the jump-to-next target. */
  onClick?: () => void;
  /** Open only: a row was picked. */
  onSelect?: (id: string) => void;
  open?: boolean;
  /**
   * Must clear the longest label plus PILL's 40px of horizontal padding, or
   * that name will be clipped. Measured, not guessed — see JeniActs.
   */
  width?: number;
}) {
  const W = width;
  const openH = items.length * ITEM_H + PAD * 2;

  /**
   * The open width has to clear the longest row. Measured rather than
   * derived from `width`: a row carries different padding from the closed
   * pill, so each label sits in an inline-block span, which keeps its
   * natural width inside a full-width row, and the widest one sets the box.
   */
  const listRef = useRef<HTMLUListElement>(null);
  const [openW, setOpenW] = useState(W);
  useLayoutEffect(() => {
    const el = listRef.current;
    if (!el) return;
    let max = 0;
    el.querySelectorAll<HTMLElement>('[data-label]').forEach((span) => {
      max = Math.max(max, span.offsetWidth);
    });
    setOpenW(Math.max(W, Math.ceil(max) + (ITEM_PAD + PAD) * 2));
  }, [items, W]);

  // The live box, driven straight to the DOM — see the note above.
  const w = useMotionValue(W);
  const h = useMotionValue(H);
  useEffect(() => {
    const a = animate(w, open ? openW : W, { duration: 0.34, ease });
    const b = animate(h, open ? openH : H, { duration: 0.34, ease });
    return () => {
      a.stop();
      b.stop();
    };
  }, [open, openW, openH, W, w, h]);

  // Held at the chip's own radius, so the open shape is the chip with more
  // height rather than a different family of rectangle.
  const radius = useTransform([w, h], ([a, b]: number[]) => Math.min(H, a, b) / 2);
  // Inset by half the outline so the stroke sits inside the box.
  const rw = useTransform(w, (v) => Math.max(0, v - 1));
  const rh = useTransform(h, (v) => Math.max(0, v - 1));
  const rx = useTransform(radius, (v) => Math.max(0, v - 0.5));

  const label = labels[activeIndex] ?? '';
  const p = Math.max(0, Math.min(1, progress)) * 100;
  // With dasharray "a b" and offset d, the dash starts at -d along the path.
  // The fill is a dash of length p at offset 0, so its tail stays pinned to the
  // path's origin and only its leading edge moves — more colour means more read.
  // The dot is a zero-length dash pushed to that same leading edge.
  const dotOffset = -p;

  const rect = { x: 0.5, y: 0.5, width: rw, height: rh, rx };

  return (
    <motion.div
      aria-label={open ? 'Sections' : undefined}
      className={cn(
        PILL,
        'relative p-0',
        // The outline is drawn in SVG instead — see the note above.
        'ring-0',
        // No hover fill. PILL's accent wash would swallow the progress arc,
        // and this pill's job is to report where you are, not to invite a click.
        'hover:bg-white hover:text-black active:bg-white active:text-black',
      )}
      style={{ width: w, height: h, borderRadius: radius }}
    >
      {/* ── Closed: the rolling name, and the surface as one jump target ── */}
      <button
        type="button"
        onClick={onClick}
        tabIndex={open ? -1 : 0}
        aria-hidden={open}
        aria-label={`${label} — jump to the next section`}
        className={cn(
          'absolute inset-0 rounded-[inherit] transition-opacity duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4f83f7]/40',
          open && 'pointer-events-none opacity-0',
        )}
      >
        {/* All four names live in one column, one pill-height per slot; the
            column slides so the active name lands dead centre. A crossfade would
            swap two words in place — this reads as one list being scrolled,
            which is what the acts actually are. */}
        <span className="absolute inset-0 overflow-hidden rounded-[inherit]">
          <span
            className="flex flex-col ease-[cubic-bezier(0.23,1,0.32,1)] transition-transform duration-[520ms] motion-reduce:transition-none"
            style={{ transform: `translateY(${-activeIndex * H}px)` }}
          >
            {labels.map((l, i) => (
              <span
                key={l}
                // Only the centred slot is legible; its neighbours are already
                // clipped, and fading them keeps the edges from flashing text
                // as the column passes.
                className="flex shrink-0 items-center justify-center transition-opacity duration-[520ms]"
                style={{ height: H, opacity: i === activeIndex ? 1 : 0 }}
                aria-hidden={i !== activeIndex}
              >
                {l}
              </span>
            ))}
          </span>
        </span>
      </button>

      {/* ── Open: every act and its landmarks, each its own target ───── */}
      <ul
        ref={listRef}
        id="act-list"
        aria-hidden={!open}
        className={cn(
          'absolute inset-0 flex flex-col overflow-hidden rounded-[inherit] transition-opacity duration-200',
          open ? 'delay-100' : 'pointer-events-none opacity-0',
        )}
        style={{ padding: PAD }}
      >
        {items.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              tabIndex={open ? 0 : -1}
              onClick={() => onSelect?.(item.id)}
              aria-current={item.active ? 'true' : undefined}
              // Centred, like the chip's own label: the open list is the
              // chip's label column with more rows in it, so left-aligning a
              // row would break the morph. Where you are is black; everything
              // else is grey, so the list reads as one live line among
              // options rather than a set of equal buttons.
              className={cn(
                'flex w-full items-center justify-center rounded-full text-center text-sm transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4f83f7]/40',
                item.active
                  // PILL's own weight, so the live row reads as the chip's
                  // label sitting in a list rather than a heavier variant.
                  ? 'font-medium text-black'
                  : 'font-normal text-neutral-400 hover:bg-black/[0.04] hover:text-neutral-600',
              )}
              style={{ height: ITEM_H, paddingInline: ITEM_PAD }}
            >
              <span data-label className="inline-block whitespace-nowrap">
                {item.label}
              </span>
            </button>
          </li>
        ))}
      </ul>

      {/* `overflow-visible` is load-bearing: the strokes are centred on the
          path, so the 5px dot hangs 2.5px outside the box and would otherwise
          be sliced flat against the viewBox edge. */}
      <motion.svg
        aria-hidden
        style={{ width: w, height: h }}
        className="pointer-events-none absolute inset-0 overflow-visible"
      >
        {/* The track, in the same value as the nav buttons' ring. */}
        <motion.rect {...rect} fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth={1} />
        <motion.rect
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
        <motion.rect
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
      </motion.svg>
    </motion.div>
  );
}
