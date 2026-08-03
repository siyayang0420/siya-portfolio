"use client";

import { ArrowRight } from "lucide-react";
import WaveCanvas from "./WaveCanvas";
import AppWindow from "./AppWindow";

const BLUE: [string, string, string] = ["#5878c8", "#6d8ad2", "#8ea3d8"];

export default function GetStarted() {
  return (
    // Rides up over the pinned hero on desktop: the -100vh pulls it into the
    // hero's runway, and z-10 keeps it above the sticky frame.
    <section
      id="get-started"
      className="relative z-10 rounded-t-[2.5rem] bg-white px-3 pt-3 shadow-[0_-40px_80px_-24px_rgba(0,0,0,0.5)] lg:-mt-[100vh]"
    >
      {/* Runs flush to the bottom edge — the panel is cut off by the divider
          rather than floating above a gap. */}
      <div className="relative overflow-hidden rounded-t-[2rem]">
        <WaveCanvas
          colors={BLUE}
          ripple={0.3}
          frequency={5.5}
          origin={[-0.9, -0.15]}
          seed={11}
          className="absolute inset-0 size-full"
        />

        <div className="relative flex flex-col items-center px-6 pt-28 text-center sm:pt-36">
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/65">
            Get Started
          </p>
          <h2 className="mt-6 max-w-[16ch] font-display text-[clamp(2.25rem,5vw,4rem)] font-medium leading-[1.02] tracking-[-0.02em] text-white">
            Your sharpest coworker starts today.
          </h2>
          <p className="mt-5 max-w-md text-[0.95rem] leading-relaxed text-white/80">
            Connect your tools and Dimension is working inside of a minute. No
            migration, no rollout plan.
          </p>
          <a
            href="#pricing"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 font-display text-sm font-medium text-black shadow-lg transition hover:bg-white/85"
          >
            Get started today
            <ArrowRight className="size-4" />
          </a>

          {/* The window runs off the bottom edge of the panel. */}
          <div className="mt-20 w-full max-w-5xl px-2 sm:px-6">
            <AppWindow />
          </div>
        </div>
      </div>
    </section>
  );
}
