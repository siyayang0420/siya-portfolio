"use client";

import { useRef } from "react";
import { motion, useScroll } from "framer-motion";
import AiCallCard from "./AiCallCard";

// The old sheet's inset plus its copy gutter (12px + 32/56/80px), inline
// because the dev build skips new arbitrary classes in this file.
const GUTTER = "clamp(24px, 6.4vw, 92px)";

export default function Features() {
  const sectionRef = useRef<HTMLElement>(null);
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
      <div className="sticky top-0 flex min-h-screen flex-col justify-center">
        <div style={{ paddingInline: GUTTER }}>
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-black/45">
            Playground
          </p>
          <h2 className="mt-5 font-display text-[clamp(2rem,4.4vw,3.5rem)] font-medium leading-none tracking-[-0.02em] text-black">
            Selected AI Experiences
          </h2>
        </div>

        {/* One experience for now, full width between the gutters. The
            orb cards and the sideways scroll are in git history if more
            experiences come back. */}
        <div className="mt-12 grid" style={{ paddingInline: GUTTER }}>
          <AiCallCard />
        </div>
      </div>
    </section>
  );
}
