'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useEffect, useState, type KeyboardEvent } from 'react';
import { cn } from '@/lib/cn';
import { ZoomableImage } from '@/components/work/ZoomableImage';

/**
 * A figure with several screenshots in one slot.
 *
 * One slide shows at a time; the others are variants of the same thing (the
 * same card for different merchants), so side-by-side would repeat the frame
 * and shrink the evidence. The slides sit on one track that moves left and
 * right, so paging reads as moving along a row rather than swapping a card.
 *
 * Controls sit under the image on the caption line: two arrows on the
 * right. Each slide can carry its own caption; when it doesn't, the figure's
 * caption holds. Left/Right arrow keys work while the figure has focus.
 * Every slide is a `ZoomableImage`, so the lightbox still opens on click.
 *
 * `aspectRatio` locks the frame so slides of slightly different heights
 * don't move the caption and controls as you page. Pass the shortest
 * slide's ratio: taller ones are cropped from the bottom, where these cards
 * carry only padding.
 *
 * `autoplay` advances the track on an interval. It pauses while the pointer
 * or keyboard focus is on the figure — a reader who has stopped to look
 * should not have the slide pulled out from under them — and a manual page
 * restarts the clock, so a click is never followed a moment later by an
 * automatic advance. Off under `prefers-reduced-motion`.
 */

export type CarouselSlide = {
  src: string;
  alt: string;
  caption?: string;
};

const ease = [0.16, 1, 0.3, 1] as const;

const ARROW =
  'flex size-9 items-center justify-center rounded-full bg-white text-ink ring-1 ring-black/[0.06] shadow-[0_1px_2px_rgba(0,0,0,0.06)] transition hover:bg-[#f0f0f0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4f83f7]/40';

export function JeniFigureCarousel({
  slides,
  caption,
  label,
  aspectRatio,
  autoplay,
}: {
  slides: CarouselSlide[];
  /** Milliseconds between automatic advances. Omit for manual paging only. */
  autoplay?: number;
  /** width / height. Omit to let each slide take its natural height. */
  aspectRatio?: number;
  /** Fallback caption, used by any slide without its own. */
  caption?: string;
  /** Names the group for assistive tech. */
  label: string;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  // Bumped on every manual page so the interval effect re-runs and the
  // clock starts over from the slide the reader chose.
  const [epoch, setEpoch] = useState(0);
  const count = slides.length;
  const step = (delta: number) =>
    setIndex((i) => (i + delta + count) % count);
  const go = (delta: number) => {
    step(delta);
    setEpoch((e) => e + 1);
  };

  useEffect(() => {
    if (!autoplay || paused || count < 2) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = window.setInterval(() => step(1), autoplay);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoplay, paused, count, epoch]);
  const slide = slides[index];
  const text = slide.caption ?? caption;

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      go(-1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      go(1);
    }
  };

  return (
    <figure
      className="m-0 flex flex-col gap-2"
      role="group"
      aria-roledescription="carousel"
      aria-label={label}
      onKeyDown={onKey}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div
        className="overflow-hidden rounded-xl"
        style={aspectRatio ? { aspectRatio } : undefined}
      >
        <motion.div
          className="flex h-full"
          animate={{ x: `${-index * 100}%` }}
          transition={{ duration: 0.45, ease }}
        >
          {slides.map((s, i) => (
            <div
              key={s.src}
              className="h-full w-full shrink-0"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}`}
              aria-hidden={i !== index}
            >
              <ZoomableImage
                src={s.src}
                alt={s.alt}
                className={cn(
                  'w-full rounded-xl border border-line',
                  aspectRatio && 'h-full object-cover object-top',
                )}
              />
            </div>
          ))}
        </motion.div>
      </div>

      <div className="flex items-start justify-between gap-6">
        {text ? (
          <figcaption className="text-[12px] text-muted">{text}</figcaption>
        ) : (
          <span />
        )}
        <div className="flex shrink-0 items-center gap-2 pt-0.5">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous"
            className={ARROW}
          >
            <ArrowLeft className="size-4" strokeWidth={1.75} />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next"
            className={ARROW}
          >
            <ArrowRight className="size-4" strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </figure>
  );
}
