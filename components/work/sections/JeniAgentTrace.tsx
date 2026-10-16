'use client';

import { Fragment, useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { ChevronUp } from 'lucide-react';
import { QUESTIONS, TRACE } from '@/components/jeniTrace';

const TEAL = '#17a589';
const LAVENDER = '#c7cff3';
const EASE_OUT = [0.23, 1, 0.32, 1] as const;
/** One step's beat: it arrives pulsing, then settles teal as the next lands. */
const STEP_MS = 750;
/** How long the finished trace holds before it clears and replays. */
const HOLD_MS = 2000;
/** The rows' fade-out before the next run starts. */
const CLEAR_MS = 500;

/** The sources the agent reached for — picked out so the cross-system read is visible. */
const SOURCES = /(Bravo’s production MySQL|PostHog)/;

function withSources(text: string) {
  return text.split(SOURCES).map((part, i) =>
    i % 2 ? (
      <span key={i} style={{ color: '#222', fontWeight: 500 }}>
        {part}
      </span>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}

/**
 * The agent's finished "How I worked this out" trace, drawn in code rather
 * than screenshotted so it stays sharp. Copy is shared with the hero
 * animation (JeniChatVisual), and so is the motion: while in view the steps
 * arrive one by one, each dot pulsing lavender while it works and settling
 * teal as the rail draws down to the next. Inline sizes because the dev build
 * skips new arbitrary classes in this folder.
 */
export function JeniAgentTrace() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const reduced = useReducedMotion();
  // How many steps have arrived; the last one is still "working" until done.
  const [shown, setShown] = useState(0);
  const [done, setDone] = useState(false);
  // Bumped to replay: hold the finished trace HOLD_MS, clear it, run again.
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setShown(TRACE.length);
      setDone(true);
      return;
    }
    const end = TRACE.length * STEP_MS;
    const timers = TRACE.map((_, i) => setTimeout(() => setShown(i + 1), i * STEP_MS));
    timers.push(setTimeout(() => setDone(true), end));
    timers.push(
      setTimeout(() => {
        setShown(0);
        setDone(false);
      }, end + HOLD_MS),
    );
    // Restart once the rows have faded out.
    timers.push(setTimeout(() => setCycle((c) => c + 1), end + HOLD_MS + CLEAR_MS));
    return () => timers.forEach(clearTimeout);
  }, [inView, reduced, cycle]);

  return (
    <div
      ref={ref}
      className="m-0 rounded-xl border border-line bg-white"
      style={{ padding: '24px 20px 12px' }}
    >
      <div className="flex justify-end">
        <span
          style={{
            background: '#f0f0f0',
            borderRadius: 999,
            padding: '9px 14px',
            fontSize: 14,
            lineHeight: '18px',
            color: '#222',
          }}
        >
          {QUESTIONS[0]}
        </span>
      </div>

      <div style={{ marginTop: 20 }}>
        {/* The collapsible summary appears once the work is done; its line is
            reserved so nothing below jumps. */}
        <motion.div
          className="flex items-center"
          style={{ gap: 10, fontSize: 12, color: '#9a9a9a', marginBottom: 8 }}
          initial={false}
          animate={{ opacity: done ? 1 : 0 }}
          transition={{ duration: 0.4 }}
        >
          <span style={{ width: 7, height: 7, borderRadius: 9, background: TEAL, marginLeft: 1 }} />
          How I worked this out
          <ChevronUp size={13} strokeWidth={2} aria-hidden />
        </motion.div>

        {TRACE.map((t, i) => {
          const on = i < shown;
          const working = on && i === shown - 1 && !done;
          return (
            <motion.div
              key={i}
              className="relative grid"
              style={{ gridTemplateColumns: '14px 1fr auto', columnGap: 10, paddingBottom: 12 }}
              initial={false}
              animate={{ opacity: on ? 1 : 0, y: on ? 0 : 6 }}
              transition={{ duration: 0.4, ease: EASE_OUT }}
            >
              {i < TRACE.length - 1 && (
                <motion.span
                  aria-hidden
                  className="absolute"
                  style={{
                    left: 3.5,
                    top: 13,
                    bottom: -3,
                    width: 1,
                    background: '#e1e1e1',
                    transformOrigin: 'top',
                  }}
                  initial={false}
                  animate={{ scaleY: i + 1 < shown ? 1 : 0 }}
                  transition={{ duration: 0.35, ease: EASE_OUT }}
                />
              )}
              <motion.span
                style={{ marginTop: 5.5, width: 8, height: 8, borderRadius: 9 }}
                initial={false}
                animate={
                  working
                    ? { backgroundColor: LAVENDER, scale: [1, 1.45, 1], opacity: [1, 0.55, 1] }
                    : { backgroundColor: on ? TEAL : LAVENDER, scale: 1, opacity: 1 }
                }
                transition={
                  working ? { duration: 1.1, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.3 }
                }
              />
              <div className="min-w-0">
                <p style={{ fontSize: 14, lineHeight: '19px', color: '#868686' }}>
                  {withSources(t.title)}
                </p>
                {t.sub && (
                  <p
                    className="truncate"
                    style={{ fontSize: 11, lineHeight: '15px', color: '#9a9a9a', marginTop: 3 }}
                  >
                    {t.sub}
                  </p>
                )}
              </div>
              <motion.span
                style={{ fontSize: 11, color: '#b0b0b0', paddingTop: 2 }}
                initial={false}
                animate={{ opacity: on && !working ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {t.time}
              </motion.span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
