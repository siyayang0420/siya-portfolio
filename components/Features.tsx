"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { OrbSphere } from "./orb/OrbSphere";

/**
 * The orb's three states, as speed multipliers on its idle rotation.
 *
 * Thinking is the 3× figure; Idle is the shader's own baseline. Listening sits
 * between them so the three read as a progression rather than a switch with a
 * gap in the middle.
 */
const ORB_STATES = [
  { label: "Idle", speed: 1, breathing: false },
  // Listening is attentive, not hurried: the rotation barely lifts and the
  // swell carries the state instead. Speeding it up read as a second
  // "thinking" rather than as something waiting on you.
  { label: "Listening", speed: 1.15, breathing: true },
  { label: "Thinking", speed: 3, breathing: false },
];

function OrbCard() {
  const [state, setState] = useState(ORB_STATES[0]);

  return (
    <article className="relative flex flex-col justify-between overflow-hidden rounded-[1.75rem] bg-[#111113] p-7 ring-1 ring-black/5">
      <div>
        <h3 className="font-display text-2xl font-medium tracking-[-0.01em] text-white">
              WebGL AI Orb
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-white/55">
              Real-time shader and motion experiment
        </p>
      </div>

      {/* The orb sits behind the query line rather than beside it: the card is
          a third of its old width, so a side-by-side would squeeze both. The
          shader's alpha is real, so it composites straight onto the card. */}
      <div className="relative mt-8 flex flex-1 items-center justify-center">
        <OrbSphere
          speed={state.speed}
          breathing={state.breathing}
          className="aspect-square w-full max-w-[260px]"
        />
      </div>

      <div className="relative mt-6 flex items-center gap-2.5 text-sm text-white/70">
        <span className="truncate">WebGL · GLSL · Motion Study</span>
      </div>

      {/* Real buttons, not styled spans — these drive the shader, so they need
          to be reachable by keyboard and announce their state. */}
      <div className="mt-4 flex flex-wrap gap-1.5" role="group" aria-label="Orb state">
        {ORB_STATES.map((s) => {
          const active = s.label === state.label;
          return (
            <button
              key={s.label}
              type="button"
              onClick={() => setState(s)}
              aria-pressed={active}
              className={`rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/60 ${
                active
                  ? "bg-white text-black"
                  : "bg-white/8 text-white/55 hover:bg-white/15 hover:text-white/80"
              }`}
            >
              {s.label}
            </button>
          );
        })}
      </div>
    </article>
  );
}

/** Placeholder count until real experiments land — each is its own WebGL context. */
const CARDS = 4;

// The old sheet's inset plus its copy gutter (12px + 32/56/80px), inline
// because the dev build skips new arbitrary classes in this file.
const GUTTER = "clamp(44px, 6.4vw, 92px)";

export default function Features() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  // How far the track has to travel: its overflow past the viewport. The
  // section is that much taller than a screen, so one px down = one px across.
  const [travel, setTravel] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const measure = () =>
      setTravel(Math.max(track.scrollWidth - window.innerWidth, 0));
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const x = useTransform(scrollYProgress, [0, 1], [0, -travel]);
  // The page grey fades in as the section rises, so by the time it pins the
  // hero sliding away underneath is already covered.
  const { scrollYProgress: rise } = useScroll({
    target: sectionRef,
    offset: ["start end", "start start"],
  });

  return (
    <section
      ref={sectionRef}
      id="features"
      // No sheet: transparent, it rides up over the pinned hero (-100vh, the
      // runway the Ethos panel used) as the hero blurs behind it.
      className="relative z-10 lg:-mt-[100vh]"
      style={{ height: `calc(100vh + ${travel}px)` }}
    >
      {/* Feathered 50vh above the section so the rising edge has no line. */}
      <motion.div
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10"
        style={{
          top: "-50vh",
          opacity: rise,
          backgroundImage: "linear-gradient(to bottom, transparent, #e1e1e1 50vh)",
        }}
        aria-hidden
      />
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div style={{ paddingInline: GUTTER }}>
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-black/45">
            Playground
          </p>
          <h2 className="mt-5 font-display text-[clamp(2rem,4.4vw,3.5rem)] font-medium leading-none tracking-[-0.02em] text-black">
            Selected AI Experiences
          </h2>
        </div>

        {/* Vertical scroll drives this sideways; the padding keeps the first
            and last card on the heading's left edge. */}
        <motion.div
          ref={trackRef}
          style={{ x, paddingInline: GUTTER }}
          className="mt-12 flex w-max gap-4"
        >
          {Array.from({ length: CARDS }, (_, i) => (
            <div key={i} className="grid shrink-0"
              style={{ width: "min(80vw, 560px)" }}>
              <OrbCard />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
