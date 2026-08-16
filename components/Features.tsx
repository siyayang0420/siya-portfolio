"use client";

import { useState } from "react";
import {
  Calendar,
  CheckCircle2,
  FileText,
  Mail,
  MessageSquare,
  Search,
} from "lucide-react";
import WaveCanvas from "./WaveCanvas";
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

function SearchCard() {
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

function EverywhereCard() {
  return (
    <article className="relative flex flex-col justify-between overflow-hidden rounded-[1.75rem] p-7 ring-1 ring-black/5">
      <WaveCanvas
        colors={["#ef9346", "#e57e34", "#d26621"]}
        ripple={0.24}
        frequency={6.5}
        origin={[-0.7, -0.4]}
        seed={3}
        className="absolute inset-0 size-full"
      />
      {/* Scrim so the heading holds up over the brightest bands. */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-transparent"
        aria-hidden
      />
      <div className="relative">
        <h3 className="font-display text-2xl font-medium tracking-[-0.01em] text-white">
          Always one message away.
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-white/85">
          Chat from wherever you already are — no new app to remember.
        </p>
      </div>

      <div className="relative mt-10 space-y-2">
        <div className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-md bg-white/90 px-3.5 py-2 text-[13px] text-black shadow">
          Move my 3pm to Thursday?
        </div>
        <div className="w-fit max-w-[85%] rounded-2xl rounded-bl-md bg-black/30 px-3.5 py-2 text-[13px] text-white ring-1 ring-white/20 backdrop-blur">
          Done — Thursday 15:00. Everyone accepted.
        </div>
      </div>
    </article>
  );
}

const tiles = [
  { icon: Mail, tint: "#ff6a5e" },
  { icon: Calendar, tint: "#5ea9ff" },
  { icon: MessageSquare, tint: "#a98bff" },
  { icon: FileText, tint: "#4fd0a8" },
  { icon: CheckCircle2, tint: "#ffc46b" },
  { icon: Search, tint: "#ffffff" },
];

function IntegrationsCard() {
  return (
    <article className="relative flex flex-col justify-between overflow-hidden rounded-[1.75rem] p-7 ring-1 ring-black/5">
      <WaveCanvas
        colors={["#a473d6", "#9560cb", "#7f4bb6"]}
        ripple={0.24}
        frequency={6.5}
        origin={[0.6, -0.3]}
        seed={7}
        className="absolute inset-0 size-full"
      />
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-transparent"
        aria-hidden
      />
      <div className="relative">
        <h3 className="font-display text-2xl font-medium tracking-[-0.01em] text-white">
          Plugs into your whole stack.
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-white/85">
          Thirty-plus integrations, each one read-and-write, none of them a
          screenshot.
        </p>
      </div>

      <div className="relative mt-10 grid grid-cols-3 gap-2.5">
        {tiles.map((t, i) => (
          <div
            key={i}
            className="grid aspect-square place-items-center rounded-2xl bg-white/15 ring-1 ring-white/25 backdrop-blur-sm"
          >
            <t.icon className="size-5" style={{ color: t.tint }} strokeWidth={1.9} />
          </div>
        ))}
      </div>
    </article>
  );
}

export default function Features() {
  return (
    <section
      id="features"
      // Same white as the panel above; a hairline is the only thing marking the
      // boundary. The bottom rounds off to reveal the footer grey behind.
      className="relative z-10 rounded-b-[2.5rem] border-t border-black/[0.07] bg-white px-3 pb-28 pt-32"
    >
      {/* Same gutter scale as the Ethos copy above (px-3 sheet inset + this),
          so both sections share one left edge. */}
      <div className="px-8 sm:px-14 lg:px-20">
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-black/45">
          Playground
        </p>
        <h2 className="mt-5 font-display text-[clamp(2rem,4.4vw,3.5rem)] font-medium leading-none tracking-[-0.02em] text-black">
          Selected Experiences
        </h2>

        {/* Three equal columns. It used to be a 4-track grid with the search
            card spanning two, which made it twice the width of its siblings. */}
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          <SearchCard />
          <EverywhereCard />
          <IntegrationsCard />
        </div>
      </div>
    </section>
  );
}
