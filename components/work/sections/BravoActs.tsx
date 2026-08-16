'use client';

import { useEffect, useRef, useState } from 'react';
import { BravoProblem } from './BravoProblem';
import { BravoMoreProblem } from './BravoMoreProblem';
import { BravoChallenge } from './BravoChallenge';
import { BravoDecision } from './BravoDecision';
import { BravoCampaignDemo } from './BravoCampaignDemo';
import { BravoShowcase } from './BravoShowcase';
import { BravoResult } from './BravoResult';
import ActPill from './ActPill';
import { ArrowUp } from 'lucide-react';
import { cn } from '@/lib/cn';
import { PILL } from '@/components/ui/pill';

type ActId = 'problem' | 'challenge' | 'decision' | 'outcome';

const DOCK_ITEMS: { id: ActId; label: string }[] = [
  { id: 'problem', label: 'Problem' },
  { id: 'challenge', label: 'Challenge' },
  { id: 'decision', label: 'Decision' },
  { id: 'outcome', label: 'Outcome' },
];

/**
 * Four-act layout for the Bravo case study.
 *
 * Navigation is a horizontal progress bar that sticks to the top (just below
 * the site nav) while the case study is in view, with a fill line that grows
 * left to right as the reader scrolls. The two demos live inside their parent
 * acts (prototype in Problem, admin tool in Decision) and are linkable from
 * the "View BEFORE / View AFTER" buttons in the meta block.
 */
export function BravoActs() {
  const act1Ref = useRef<HTMLDivElement>(null); // Problem
  const act2Ref = useRef<HTMLDivElement>(null); // Challenge
  const act3Ref = useRef<HTMLDivElement>(null); // Decision
  const act4Ref = useRef<HTMLDivElement>(null); // Outcome

  const [active, setActive] = useState<ActId>('problem');
  const [progress, setProgress] = useState(0);
  // Bar stays hidden until the Problem heading scrolls away, and hides again
  // once the Outcome (last act) has scrolled past.
  const [barVisible, setBarVisible] = useState(false);

  // Track active act + scroll progress (0 = section start, 1 = section end).
  useEffect(() => {
    const ACTIVATION_LINE = 160; // px from viewport top (below nav + bar)
    const refs: { id: ActId; ref: React.RefObject<HTMLDivElement | null> }[] = [
      { id: 'problem', ref: act1Ref },
      { id: 'challenge', ref: act2Ref },
      { id: 'decision', ref: act3Ref },
      { id: 'outcome', ref: act4Ref },
    ];

    const handleScroll = () => {
      let activeIdx = 0;
      for (let i = refs.length - 1; i >= 0; i--) {
        const top = refs[i].ref.current?.getBoundingClientRect().top;
        if (top !== undefined && top <= ACTIVATION_LINE) {
          activeIdx = i;
          break;
        }
      }
      setActive(refs[activeIdx].id);

      // Show the bar only after the Problem heading has scrolled up and out,
      // and hide it again once the last act has scrolled past.
      const firstRect = act1Ref.current?.getBoundingClientRect();
      const lastRect = act4Ref.current?.getBoundingClientRect();
      const scrolledPastHeading = !!firstRect && firstRect.top < -80;
      const beforeEnd = !lastRect || lastRect.bottom > 140;
      setBarVisible(scrolledPastHeading && beforeEnd);

      // Progress anchored to active act + interpolation through its content,
      // so the fill maps cleanly onto the 4 evenly-spaced labels.
      const activeAct = refs[activeIdx].ref.current;
      if (activeAct) {
        const actRect = activeAct.getBoundingClientRect();
        const distancePast = ACTIVATION_LINE - actRect.top;
        const withinAct = Math.max(
          0,
          Math.min(1, actRect.height > 0 ? distancePast / actRect.height : 0),
        );
        const steps = refs.length - 1; // 4 acts → 3 gaps
        const pct = Math.max(0, Math.min(1, (activeIdx + withinAct) / steps));
        setProgress(pct);
      }
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const scrollToAct = (id: ActId) => {
    const map: Record<ActId, React.RefObject<HTMLDivElement | null>> = {
      problem: act1Ref,
      challenge: act2Ref,
      decision: act3Ref,
      outcome: act4Ref,
    };
    const ref = map[id];
    if (!ref.current) return;
    const top = ref.current.getBoundingClientRect().top + window.scrollY - 135;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  const activeIndex = Math.max(
    0,
    DOCK_ITEMS.findIndex((i) => i.id === active),
  );

  return (
    <section
      className="border-t border-line mt-10 [&_h2]:tracking-[0.02em] [&_h2]:leading-[1.55] [&_p]:tracking-[0.02em] [&_p]:leading-[1.55]"
    >
      {/* ── Horizontal progress bar ──────────────────────────────────────
          Fixed just below the site nav. Hidden until the Problem heading
          scrolls away, then fades + slides in. Centered to the 1100px
          content width. */}
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
          labels={DOCK_ITEMS.map((i) => i.label)}
          activeIndex={activeIndex}
          progress={progress}
          // The four separate jump links are gone with the old bar, so the pill
          // carries that job: it steps to the next act, and wraps at the end.
          onClick={() => {
            const next = DOCK_ITEMS[(activeIndex + 1) % DOCK_ITEMS.length];
            scrollToAct(next.id);
          }}
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
          <ArrowUp className="size-[18px] shrink-0" strokeWidth={1.75} aria-hidden="true" />
        </button>
      </nav>

      {/* ── Case study content ─────────────────────────────────────── */}
      <div className="flex flex-col gap-32 pt-12">
        <div
          ref={act1Ref}
          className="flex flex-col gap-12 scroll-mt-[135px]"
          id="the-problem"
        >
          <BravoProblem />
          <BravoMoreProblem />
        </div>

        <div
          ref={act2Ref}
          className="flex flex-col gap-12 scroll-mt-[135px]"
          id="the-challenge"
        >
          <BravoChallenge />
        </div>

        <div
          ref={act3Ref}
          className="flex flex-col gap-12 scroll-mt-[135px]"
          id="the-decision"
        >
          <BravoDecision />
          <div
            id="admin-demo"
            className="flex flex-col gap-12 scroll-mt-[135px]"
          >
            <BravoCampaignDemo />
            <BravoShowcase />
          </div>
        </div>

        <div
          ref={act4Ref}
          className="flex flex-col gap-12 scroll-mt-[135px]"
          id="the-outcome"
        >
          <BravoResult />
        </div>
      </div>
    </section>
  );
}
