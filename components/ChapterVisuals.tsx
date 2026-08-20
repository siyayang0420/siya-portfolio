"use client";

import CashbackFlowVisual from "./CashbackFlowVisual";

import {
  ArrowUpRight,
  Calendar,
  Check,
  CheckCircle2,
  FileText,
  Mail,
  MessageSquare,
  Send,
  Sparkles,
  Users,
} from "lucide-react";

/**
 * Seven DOM mockups, one per hero chapter. Everything is drawn with CSS —
 * generic app tiles rather than third-party logos, and stand-in content.
 */

const card =
  "rounded-3xl bg-black/25 ring-1 ring-white/15 backdrop-blur-xl shadow-[0_24px_70px_-24px_rgba(0,0,0,0.55)]";

function Stagger({
  i,
  children,
  className = "",
}: {
  i: number;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`anim-rise ${className}`}
      style={{ animationDelay: `${60 + i * 55}ms` }}
    >
      {children}
    </div>
  );
}

/* ── 01 ─ Morning Briefing ─────────────────────────────────────────────── */

const dock = [
  { icon: Mail, label: "Mail", count: 32, from: "#ff6a5e", to: "#d9375f" },
  { icon: Calendar, label: "Calendar", count: 4, from: "#5ea9ff", to: "#2f5fe0" },
  { icon: MessageSquare, label: "Chat", count: 53, from: "#a98bff", to: "#6a45e6" },
  { icon: FileText, label: "Docs", count: 12, from: "#4fd0a8", to: "#1a8f74" },
  { icon: CheckCircle2, label: "Tasks", count: 3, from: "#ffc46b", to: "#e0872f" },
];

function BriefingVisual() {
  return (
    <div className="flex flex-col items-center gap-8">
      <Stagger i={0}>
        <div className="flex items-end gap-2 rounded-[2rem] bg-white/12 p-3 ring-1 ring-white/20 backdrop-blur-xl sm:gap-5 sm:p-5">
          {dock.map((app, i) => (
            <div key={app.label} className="relative anim-pop" style={{ animationDelay: `${120 + i * 55}ms` }}>
              <div
                className="grid size-11 place-items-center rounded-[1.15rem] shadow-lg ring-1 ring-white/25 sm:size-[4.25rem]"
                style={{
                  backgroundImage: `linear-gradient(150deg, ${app.from}, ${app.to})`,
                }}
              >
                <app.icon className="size-5 text-white sm:size-7" strokeWidth={2} />
              </div>
              <span className="absolute -right-2 -top-2 grid h-6 min-w-6 place-items-center rounded-full bg-[#ff3b30] px-1.5 font-mono text-[11px] font-medium text-white ring-2 ring-white/80">
                {app.count}
              </span>
              <span className="sr-only">{app.label}</span>
            </div>
          ))}
        </div>
      </Stagger>

      <Stagger i={4} className="w-full max-w-xl">
        <div className={`${card} flex items-center gap-4 px-5 py-4`}>
          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-white/90">
            <Sparkles className="size-4 text-black" strokeWidth={2.2} />
          </span>
          <p className="text-sm text-white/85">
            <span className="font-medium text-white">Overnight:</span> 104 new
            items. 6 need you today.
          </p>
          <span className="ml-auto hidden font-mono text-[11px] uppercase tracking-widest text-white/45 sm:block">
            08:00
          </span>
        </div>
      </Stagger>
    </div>
  );
}

/* ── 02 ─ Catch Up ─────────────────────────────────────────────────────── */

const threads = [
  { who: "Priya R.", tint: "#ff6a5e", note: "Can you confirm the launch date?" },
  { who: "Marco V.", tint: "#5ea9ff", note: "Sending the revised scope tonight." },
  { who: "Design", tint: "#a98bff", note: "Feedback on the new nav?" },
];

function CatchUpVisual() {
  return (
    <div className="w-full max-w-xl space-y-3">
      {threads.map((t, i) => (
        <Stagger key={t.who} i={i}>
          <div className={`${card} p-4`}>
            <div className="flex items-center gap-3">
              <span
                className="grid size-8 place-items-center rounded-full text-xs font-semibold text-white"
                style={{ backgroundColor: t.tint }}
              >
                {t.who[0]}
              </span>
              <span className="text-sm font-medium text-white">{t.who}</span>
              <span className="ml-auto rounded-full bg-white/12 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-white/70">
                Draft ready
              </span>
            </div>
            <p className="mt-3 text-sm text-white/60">{t.note}</p>
            {i === 0 && (
              <div className="mt-3 rounded-2xl bg-white/10 p-3 ring-1 ring-white/15">
                <p className="text-sm text-white/90">
                  Locked for the 14th — I&apos;ll send the run-of-show Friday.
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <button className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-black">
                    <Send className="size-3" /> Send
                  </button>
                  <button className="rounded-full px-3 py-1.5 text-xs text-white/60 ring-1 ring-white/20">
                    Edit
                  </button>
                </div>
              </div>
            )}
          </div>
        </Stagger>
      ))}
    </div>
  );
}

/* ── 03 ─ Action Plan ──────────────────────────────────────────────────── */

const todos = [
  { text: "Send the revised scope to Marco", src: "Mail", done: true },
  { text: "Approve the Q3 media budget", src: "Chat", done: true },
  { text: "Review nav explorations", src: "Docs", done: false },
  { text: "Reply to the vendor security form", src: "Mail", done: false },
  { text: "Book the offsite room", src: "Calendar", done: false },
];

function ActionPlanVisual() {
  return (
    <div className={`${card} w-full max-w-xl overflow-hidden`}>
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
        <span className="text-sm font-medium text-white">Today</span>
        <span className="font-mono text-[11px] uppercase tracking-widest text-white/45">
          5 found
        </span>
      </div>
      <ul className="divide-y divide-white/8">
        {todos.map((t, i) => (
          <li key={t.text}>
            <Stagger i={i} className="flex items-center gap-3 px-5 py-3.5">
              <span
                className={`grid size-5 shrink-0 place-items-center rounded-md ring-1 ${
                  t.done
                    ? "bg-white ring-white"
                    : "bg-white/5 ring-white/25"
                }`}
              >
                {t.done && <Check className="size-3.5 text-black" strokeWidth={3} />}
              </span>
              <span
                className={`text-sm ${
                  t.done ? "text-white/40 line-through" : "text-white/90"
                }`}
              >
                {t.text}
              </span>
              <span className="ml-auto rounded-full bg-white/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-white/55">
                {t.src}
              </span>
            </Stagger>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ── 04 ─ Deep Work ──── PARKED ────────────────────────────────────────────
   Pulled from the `visuals` registry below, so the Copilot chapter renders
   bare for now. Kept rather than deleted: re-enabling is one line. */

const steps = [
  "Pulled 14 files from your drive",
  "Read last quarter's update",
  "Checked the numbers against the dashboard",
  "Drafted v1 — 620 words",
];

function DeepWorkVisual() {
  return (
    <div className={`${card} w-full max-w-xl p-5`}>
      <div className="flex items-center gap-3">
        <span className="grid size-8 place-items-center rounded-full bg-white/90">
          <Sparkles className="size-4 text-black" strokeWidth={2.2} />
        </span>
        <p className="text-sm font-medium text-white">
          Draft the Q3 partner update
        </p>
      </div>

      <ul className="mt-5 space-y-3">
        {steps.map((s, i) => (
          <li key={s}>
            <Stagger i={i} className="flex items-center gap-3">
              <span className="grid size-4 place-items-center rounded-full bg-white/85">
                <Check className="size-2.5 text-black" strokeWidth={3.5} />
              </span>
              <span className="text-sm text-white/65">{s}</span>
            </Stagger>
          </li>
        ))}
      </ul>

      <div className="mt-5 h-1 overflow-hidden rounded-full bg-white/12">
        <div className="h-full w-3/4 rounded-full bg-white/80" />
      </div>
      <p className="mt-3 font-mono text-[11px] uppercase tracking-widest text-white/45">
        Working — 4 of 5 steps
      </p>
    </div>
  );
}

/* ── 05 ─ Inbox ────────────────────────────────────────────────────────── */

const mail = [
  { from: "Legal", subject: "Vendor MSA — signature needed", tag: "Action" },
  { from: "Priya R.", subject: "Launch date confirmation", tag: "Action" },
  { from: "Analytics", subject: "Weekly traffic digest", tag: "FYI" },
  { from: "Design", subject: "Nav explorations, round 2", tag: "FYI" },
  { from: "Conference", subject: "Last chance for early-bird pricing", tag: "Noise" },
];

const tagStyle: Record<string, string> = {
  Action: "bg-[#ffc46b]/20 text-[#ffd79b] ring-[#ffc46b]/30",
  FYI: "bg-[#5ea9ff]/20 text-[#b3d6ff] ring-[#5ea9ff]/30",
  Noise: "bg-white/8 text-white/45 ring-white/15",
};

function InboxVisual() {
  return (
    <div className={`${card} w-full max-w-xl overflow-hidden`}>
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
        <span className="text-sm font-medium text-white">Inbox</span>
        <span className="font-mono text-[11px] uppercase tracking-widest text-white/45">
          Auto-tagged
        </span>
      </div>
      <ul className="divide-y divide-white/8">
        {mail.map((m, i) => (
          <li key={m.subject}>
            <Stagger i={i} className="flex items-center gap-3 px-5 py-3.5">
              <div className="min-w-0">
                <p className="truncate text-sm text-white/90">{m.subject}</p>
                <p className="mt-0.5 text-xs text-white/45">{m.from}</p>
              </div>
              <span
                className={`ml-auto shrink-0 rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider ring-1 ${tagStyle[m.tag]}`}
              >
                {m.tag}
              </span>
            </Stagger>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ── 06 ─ Meeting Prep ─────────────────────────────────────────────────── */

const attendees = ["#ff6a5e", "#5ea9ff", "#a98bff", "#4fd0a8"];
const points = [
  "They asked for pricing tiers last time — you owe them a number.",
  "Their contract renews in six weeks.",
  "Open thread: SSO timeline, unanswered since Tuesday.",
];

function MeetingVisual() {
  return (
    <div className={`${card} w-full max-w-xl p-5`}>
      <div className="flex items-center gap-3">
        <span className="grid size-9 place-items-center rounded-xl bg-white/12 ring-1 ring-white/20">
          <Users className="size-4 text-white" />
        </span>
        <div>
          <p className="text-sm font-medium text-white">Northwind — quarterly</p>
          <p className="font-mono text-[11px] uppercase tracking-widest text-white/45">
            16:00 · 30 min
          </p>
        </div>
        <div className="ml-auto flex -space-x-2">
          {attendees.map((c, i) => (
            <span
              key={c}
              className="size-7 rounded-full ring-2 ring-black/40 anim-pop"
              style={{ backgroundColor: c, animationDelay: `${200 + i * 70}ms` }}
            />
          ))}
        </div>
      </div>

      <ul className="mt-5 space-y-3 border-t border-white/10 pt-4">
        {points.map((p, i) => (
          <li key={p}>
            <Stagger i={i} className="flex gap-3">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-white/50" />
              <span className="text-sm text-white/70">{p}</span>
            </Stagger>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ── 07 ─ Daily Recap ──── PARKED ──────────────────────────────────────────
   Pulled from the `visuals` registry below, so the Marketing Site chapter
   renders bare for now. Kept rather than deleted: re-enabling is one line. */

const stats = [
  { n: "23", l: "Handled" },
  { n: "6", l: "Sent for you" },
  { n: "2", l: "Still open" },
];

const timeline = [
  "Partner update drafted and sent",
  "Media budget approved",
  "Security form still waiting on legal",
];

function RecapVisual() {
  return (
    <div className={`${card} w-full max-w-xl p-5`}>
      <div className="grid grid-cols-3 gap-3">
        {stats.map((s, i) => (
          <Stagger
            key={s.l}
            i={i}
            className="rounded-2xl bg-white/8 px-4 py-4 ring-1 ring-white/12"
          >
            <p className="font-display text-3xl font-medium text-white">{s.n}</p>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-white/50">
              {s.l}
            </p>
          </Stagger>
        ))}
      </div>

      <ul className="mt-5 space-y-3 border-t border-white/10 pt-4">
        {timeline.map((t, i) => (
          <li key={t}>
            <Stagger i={i + 3} className="flex items-center gap-3">
              <ArrowUpRight className="size-3.5 shrink-0 text-white/40" />
              <span className="text-sm text-white/70">{t}</span>
            </Stagger>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────── */

const visuals: Record<string, () => React.ReactElement> = {
  "reward-engine": CashbackFlowVisual,
  briefing: BriefingVisual,
  "catch-up": CatchUpVisual,
  "action-plan": ActionPlanVisual,
  inbox: InboxVisual,
  "meeting-prep": MeetingVisual,
};

export default function ChapterVisual({ id }: { id: string }) {
  const Visual = visuals[id];
  return Visual ? <Visual /> : null;
}
