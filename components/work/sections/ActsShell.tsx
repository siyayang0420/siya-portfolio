'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { ArrowUp } from 'lucide-react';
import ActPill from './ActPill';
import { cn } from '@/lib/cn';
import { PILL } from '@/components/ui/pill';

/**
 * The act layout every case study on this site uses.
 *
 * This was BravoActs' body verbatim. It moved here the moment a second case
 * study needed the same reading experience: the progress pill, the scroll
 * tracking and the id scheme are the shape of a case study on this site, not
 * anything specific to Bravo, and two copies of a scroll handler drift the
 * week after they are written.
 *
 * A case study supplies its acts and nothing else — see BravoActs and JeniActs,
 * which are now just lists.
 */

export type Act = {
  /** Becomes the section id as `the-${id}`, and the deep-link target. */
  id: string;
  /** Shown in the progress pill's roller. */
  label: string;
  content: ReactNode;
};

export function ActsShell({
  acts,
  pillWidth,
  lead,
}: {
  acts: Act[];
  /**
   * Overrides the progress pill's width. Only needed when a case study's act
   * names are longer than Bravo's one-word ones — see ActPill.
   */
  pillWidth?: number;
  /**
   * Something to open the case study with, before the first act — a video,
   * a hero figure. Sits inside the rule that separates the header from the
   * acts, so it reads as the start of the study rather than the end of the
   * meta block. Not tracked by the progress pill.
   */
  lead?: ReactNode;
}) {
  // One ref per act, filled by the callback ref below. An array rather than the
  // four named refs this started with, so the shell doesn't care how many acts
  // a case study has.
  const actRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [active, setActive] = useState(0);
  // 0 → hero untouched, 1 → fully covered by the panel above it.
  const [progress, setProgress] = useState(0);
  // Bar stays hidden until the first heading scrolls away, and hides again
  // once the last act has scrolled past.
  const [barVisible, setBarVisible] = useState(false);

  useEffect(() => {
    const ACTIVATION_LINE = 160; // px from viewport top (below nav + bar)

    const handleScroll = () => {
      const els = actRefs.current;
      if (!els.length) return;

      let activeIdx = 0;
      for (let i = els.length - 1; i >= 0; i--) {
        const top = els[i]?.getBoundingClientRect().top;
        if (top !== undefined && top <= ACTIVATION_LINE) {
          activeIdx = i;
          break;
        }
      }
      setActive(activeIdx);

      // Show the bar only after the first heading has scrolled up and out,
      // and hide it again once the last act has scrolled past.
      const firstRect = els[0]?.getBoundingClientRect();
      const lastRect = els[els.length - 1]?.getBoundingClientRect();
      const scrolledPastHeading = !!firstRect && firstRect.top < -80;
      const beforeEnd = !lastRect || lastRect.bottom > 140;
      setBarVisible(scrolledPastHeading && beforeEnd);

      // Progress anchored to active act + interpolation through its content,
      // so the fill maps cleanly onto the evenly-spaced labels.
      const activeAct = els[activeIdx];
      if (activeAct) {
        const actRect = activeAct.getBoundingClientRect();
        const distancePast = ACTIVATION_LINE - actRect.top;
        const withinAct = Math.max(
          0,
          Math.min(1, actRect.height > 0 ? distancePast / actRect.height : 0),
        );
        const steps = Math.max(1, els.length - 1); // N acts → N-1 gaps
        const pct = Math.max(0, Math.min(1, (activeIdx + withinAct) / steps));
        setProgress(pct);
      }
    };

    let frame = 0;
    const onScroll = () => {
      if (!frame)
        frame = requestAnimationFrame(() => {
          frame = 0;
          handleScroll();
        });
    };

    handleScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [acts.length]);

  const scrollToAct = useCallback((index: number) => {
    const el = actRefs.current[index];
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 135;
    window.scrollTo({ top, behavior: 'smooth' });
  }, []);

  return (
    <section className="border-t border-line mt-10">
      {/* ── Horizontal progress bar ──────────────────────────────────────
          Fixed just below the site nav. Hidden until the first heading
          scrolls away, then fades + slides in. */}
      <nav
        aria-label="Case study progress"
        aria-hidden={!barVisible}
        className={`fixed top-[76px] left-0 right-0 z-40 flex items-center justify-center gap-2 transition-all duration-300 ease-out ${
          barVisible
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-2 pointer-events-none'
        }`}
      >
        <ActPill
          labels={acts.map((a) => a.label)}
          activeIndex={active}
          progress={progress}
          width={pillWidth}
          // The pill carries the jump: it steps to the next act, and wraps at
          // the end.
          onClick={() => scrollToAct((active + 1) % acts.length)}
        />

        {/* Back to top. Same PILL surface as the site's nav buttons, squared
            off to a circle at the progress pill's own 44px height so the two
            sit as a pair — and unlike the progress pill it keeps PILL's accent
            hover, because it is a plain action rather than a status readout. */}
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top"
          className={cn(
            PILL,
            'size-11 p-0 duration-200 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4f83f7]/40',
          )}
        >
          <ArrowUp
            className="size-[18px] shrink-0"
            strokeWidth={1.75}
            aria-hidden="true"
          />
        </button>
      </nav>

      {/* ── Lead visual, if the study has one ────────────────────────
          Same pt-12 as the acts below, so it lands where the first act
          otherwise would and the acts keep their own offset under it. */}
      {lead && <div className="pt-12">{lead}</div>}

      {/* ── Case study content ─────────────────────────────────────── */}
      <div className="flex flex-col gap-32 pt-12">
        {acts.map((act, i) => (
          <div
            key={act.id}
            ref={(el) => {
              actRefs.current[i] = el;
            }}
            className="flex flex-col gap-12 scroll-mt-[135px]"
            id={`the-${act.id}`}
          >
            {act.content}
          </div>
        ))}
      </div>
    </section>
  );
}
