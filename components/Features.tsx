"use client";

import {
  Calendar,
  CheckCircle2,
  FileText,
  Mail,
  MessageSquare,
  Search,
} from "lucide-react";
import WaveCanvas from "./WaveCanvas";

const sources = ["Repos", "Drive", "Notes", "Docs", "Tickets"];
const files = [
  "security/ENCRYPTION.md",
  "compliance/SECURITY.md",
  "docs/API_RATE_LIMITS.md",
  "architecture/SERVICES.md",
];

function SearchCard() {
  return (
    <article className="relative flex flex-col overflow-hidden rounded-[1.75rem] bg-[#111113] p-7 ring-1 ring-black/5 md:col-span-2">
      <h3 className="font-display text-2xl font-medium tracking-[-0.01em] text-white">
        Search everything, at once.
      </h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/55">
        One query across every tool you&apos;ve connected — not five tabs and a
        guess about which one has it.
      </p>

      <div className="mt-7 rounded-2xl bg-white/[0.04] p-4 ring-1 ring-white/10">
        <div className="flex items-center gap-2.5 text-sm text-white/70">
          <Search className="size-3.5" />
          <span>&quot;how we handle encryption at rest&quot;</span>
          <span className="ml-1 inline-block h-4 w-px bg-white/60 [animation:blink_1.1s_steps(1,end)_infinite]" />
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {sources.map((s) => (
            <span
              key={s}
              className="rounded-full bg-white/8 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-white/55"
            >
              {s}
            </span>
          ))}
        </div>

        <ul className="mt-4 space-y-2.5 border-t border-white/8 pt-4">
          {files.map((f) => (
            <li key={f} className="flex items-center gap-2.5 text-sm text-white/75">
              <FileText className="size-3.5 shrink-0 text-white/35" />
              <span className="truncate font-mono text-[12px]">{f}</span>
            </li>
          ))}
        </ul>
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

        <div className="mt-12 grid gap-4 md:grid-cols-4">
          <SearchCard />
          <EverywhereCard />
          <IntegrationsCard />
        </div>
      </div>
    </section>
  );
}
