"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Clock, Lock, MessagesSquare, Sparkles } from "lucide-react";
import Intro from "./Intro";
import { ScrollCue } from "./ScrollCue";
import WaveCanvas from "./WaveCanvas";
import ChapterVisual from "./ChapterVisuals";
import { chapters } from "./chapters";

// Muted on purpose: each stop is pulled ~25% toward a neutral of the same
// lightness. The saturated version reads as poster art rather than atmosphere.
const HERO_COLORS: [string, string, string] = ["#4763a4", "#9aa6b0", "#bd8c68"];

const bullets = [
  { icon: Sparkles, text: "Works across 30+ of the tools you already use" },
  { icon: Clock, text: "Drafts, files and preps while you're asleep" },
  { icon: MessagesSquare, text: "Reachable from Slack, iMessage, mobile or web" },
  { icon: Lock, text: "Encrypted end to end — your data never trains a model" },
];

function Pitch() {
  return (
    <>
      <h1 className="mt-3 max-w-[14ch] font-display text-[clamp(2.5875rem,4.485vw,3.91rem)] font-medium leading-[1.0] tracking-[-0.025em] text-white">
        I design how products work, and build them into reality.
      </h1>

      {/* <ul className="mt-6 space-y-2.5">
        {bullets.map((b) => (
          <li key={b.text} className="flex items-start gap-3">
            <b.icon className="mt-0.5 size-4 shrink-0 text-white/70" strokeWidth={1.8} />
            <span className="text-[0.9rem] leading-snug text-white/85">
              {b.text}
            </span>
          </li>
        ))}
      </ul> */}
      <span className="mt-4 text-white/90 text-[1.25rem]">
        Currently obsessed with AI behavior, product systems, and the invisible decisions that shape trust.
      </span>
    </>
  );
}

/** The vertical ruler of ticks that splits the two hero columns. */
function TickRule() {
  return (
    <div className="pointer-events-none absolute inset-y-0 left-0 w-3">
      <div className="tick-rule absolute inset-y-0 left-0 w-1.5 opacity-60" />
      <div className="absolute inset-y-0 left-1.5 w-px bg-white/15" />
    </div>
  );
}

/**
 * The section is one viewport taller than the chapters need. That spare
 * viewport is the runway the Get Started panel slides up through while the
 * hero is still pinned behind it.
 */
function metrics(section: HTMLElement) {
  const vh = window.innerHeight;
  return {
    vh,
    // Scroll distance the chapters are spread across.
    chapterScroll: section.offsetHeight - 2 * vh,
    scrolled: -section.getBoundingClientRect().top,
  };
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  // The progress rule is driven through a CSS variable rather than state, so
  // scrolling doesn't re-render the whole hero on every frame.
  const frameRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  // 0 → hero untouched, 1 → fully covered by the panel above it.
  const [dim, setDim] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let frame = 0;
    let glideFrame = 0;
    let target = 0; // where the head wants to be
    let shown = 0; // where it actually is

    // Snap instead of glide if the visitor has asked for less motion.
    const smoothing = window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches
      ? 1
      : 0.14;

    /**
     * Eases the head toward the scroll position rather than pinning it 1:1, so
     * it trails a little and settles. Runs only while there's distance left to
     * cover, then stops itself.
     */
    const glide = () => {
      const next = shown + (target - shown) * smoothing;
      const settled = Math.abs(target - next) < 0.0002;
      shown = settled ? target : next;
      frameRef.current?.style.setProperty("--p", shown.toFixed(4));
      glideFrame = settled ? 0 : requestAnimationFrame(glide);
    };

    const measure = () => {
      frame = 0;
      // Hidden on small screens: offsetHeight is 0, nothing to track.
      const { vh, chapterScroll, scrolled } = metrics(section);
      if (chapterScroll <= 0) return;

      const progress = Math.min(Math.max(scrolled / chapterScroll, 0), 0.9999);
      setActive(Math.floor(progress * chapters.length));

      target = progress;
      if (!glideFrame) glideFrame = requestAnimationFrame(glide);

      // Once the chapters are done, ramp the dim/blur across the runway.
      const into = (scrolled - chapterScroll) / vh;
      setDim(Math.min(Math.max(into, 0), 1));
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      if (glideFrame) cancelAnimationFrame(glideFrame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const goTo = useCallback((index: number) => {
    const section = sectionRef.current;
    if (!section) return;
    const step = metrics(section).chapterScroll / chapters.length;
    window.scrollTo({
      top: section.offsetTop + step * (index + 0.5),
      behavior: "smooth",
    });
  }, []);

  const chapter = chapters[active] ?? chapters[0];

  return (
    <>
      {/* Anchor target for the case-study "Work" pill. A bare div rather than
          an id on either section below: those are `hidden lg:block` /
          `lg:hidden`, and an anchor pointing at a display:none element does
          nothing — so one of the two breakpoints would always be dead. */}
      <div id="work" aria-hidden />

      {/* ── Desktop: one pinned frame, seven scroll chapters ─────────── */}
      <section
        ref={sectionRef}
        aria-label="Selected work"
        className="relative z-0 hidden lg:block"
        // +2 not +1: one extra viewport of runway for the panel to slide over.
        style={{ height: `${(chapters.length + 2) * 100}vh` }}
      >
        <div ref={frameRef} className="sticky top-0 h-screen overflow-hidden">
          {/* Everything that recedes behind the incoming panel lives in here.
              Scaled up slightly so the blur doesn't pull transparent edges in. */}
          <div
            className="absolute inset-0"
            style={
              dim > 0
                ? {
                    filter: `blur(${dim * 16}px)`,
                    transform: `scale(${1 + dim * 0.04})`,
                  }
                : undefined
            }
          >
            {/* No ripple here — the hero backdrop is a plain wash. The banding
                belongs to the CTA panel and the accent cards only. */}
            <WaveCanvas
              colors={HERO_COLORS}
              ripple={0}
              origin={[-0.55, 0.35]}
              className="absolute inset-0 size-full"
            />

            <div className="relative grid h-full grid-cols-[minmax(0,57%)_minmax(0,43%)]">
            {/* Left rail: intro pinned to the top, the rest centred below it. */}
            <div className="flex flex-col px-10 py-12 xl:px-14">
              <Intro />

              <div className="flex flex-1 flex-col justify-center">
              <Pitch />

              {/* 32px + 64px. The rail centres this group, so widening the gap
                  pushes the list down and the pitch up in equal measure. */}
              <p className="mt-24 font-display text-[20px] font-medium text-white">
                Selected work
              </p>
              <ul className="mt-2 max-w-lg">
                {chapters.map((c, i) => {
                  const isActive = i === active;
                  return (
                    <li key={c.id}>
                      <button
                        onClick={() => goTo(i)}
                        aria-current={isActive}
                        className={`relative flex w-full items-center justify-between rounded-lg px-4 py-2 text-left transition-colors duration-300 ${
                          isActive ? "bg-black/25" : "hover:bg-white/6"
                        }`}
                      >
                        <span
                          className={`absolute left-2 top-1/2 h-4 w-[3px] -translate-y-1/2 rounded-full bg-[#4f83f7] transition-opacity duration-300 ${
                            isActive ? "opacity-100" : "opacity-0"
                          }`}
                        />
                        <span
                          className={`text-[16px] transition-colors duration-300 ${
                            isActive ? "font-semibold text-white" : "text-white/60"
                          }`}
                        >
                          {c.name}
                        </span>
                        <span
                          className={`font-mono text-sm tabular-nums transition-colors duration-300 ${
                            isActive ? "text-white/80" : "text-white/40"
                          }`}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
              </div>
            </div>

            {/* Right stage. `min-h-0` because a grid item defaults to
                `min-height: auto`, which floors the row at its content height —
                so a tall chapter visual pushed this cell past the pinned
                frame's height and got clipped instead of scaling down. */}
            <div className="relative min-h-0 pr-10 xl:pr-14">
              <TickRule />

              <div className="flex h-full flex-col pt-14">
                <p className="self-end font-mono text-[11px] uppercase tracking-[0.18em] text-white/60">
                  {chapter.meta}
                </p>

                {/* Hairline doubles as a progress track. `--p` is written by the
                    scroll handler; the head rides along it. */}
                {/* Starts on the tick rule's vertical line (ml matches its
                    left-1.5) and runs full-bleed past the stage's right pad. */}
                <div
                  className="relative -mr-10 ml-1.5 mt-4 h-[0.5px] xl:-mr-14"
                  style={{
                    backgroundImage:
                      "linear-gradient(90deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.5) 100%)",
                  }}
                >
                  <div
                    className="absolute inset-y-0 left-0 bg-white/70"
                    style={{ width: "calc(var(--p, 0) * 100%)" }}
                  />
                  {/* -4.5px centres the 10px head on the 1px vertical line. */}
                  <div
                    className="absolute -top-[5px] z-50 flex size-2.5 items-center justify-center rounded-full bg-white/5"
                    style={{ left: "calc(var(--p, 0) * 100% - 4.5px)" }}
                  >
                    <span className="head-core size-1 rounded-full bg-white" />
                  </div>
                </div>

                {/* Keyed remount replays the entrance animations per chapter. */}
                <div key={chapter.id} className="flex min-h-0 flex-1 flex-col pl-8 pt-10">
                  {/* <p className="anim-rise mb-1 font-display text-[20px] font-medium text-white">
                    Selected work
                  </p> */}
                  <h2 className="anim-rise font-display text-[clamp(1.615rem,2.38vw,2.3375rem)] font-medium leading-tight tracking-[-0.02em] text-white">
                    {chapter.name}
                  </h2>
                  <p className="anim-rise mt-3 max-w-xl text-[16px] leading-relaxed text-white/75" style={{ animationDelay: "60ms" }}>
                    {chapter.blurb}
                  </p>
                  {chapter.slug ? (
                    <Link
                      href={`/${chapter.slug}`}
                      className="anim-rise mt-5 w-fit text-[15px] text-white underline underline-offset-4 transition hover:text-white/70"
                      style={{ animationDelay: "120ms" }}
                    >
                      View more
                    </Link>
                  ) : (
                    // Same slot and rhythm as the link, but not underlined —
                    // it isn't clickable, and underlining would imply it is.
                    <span
                      className="anim-rise mt-5 w-fit text-[15px] text-white/75"
                      style={{ animationDelay: "120ms" }}
                    >
                      Coming soon
                    </span>
                  )}
                  <div className="flex min-h-0 flex-1 items-center justify-center pb-24 pt-8">
                    <ChapterVisual id={chapter.visual} />
                  </div>
                </div>
              </div>
            </div>
            </div>
          </div>

          {/* Sits outside the blurred layer so it stays a clean flat wash. */}
          <div
            className="pointer-events-none absolute inset-0 bg-[#0c0c0c]"
            style={{ opacity: dim * 0.72 }}
            aria-hidden
          />
        </div>
      </section>

      {/* ── Mobile: the same content, simply stacked ─────────────────── */}
      <section className="relative lg:hidden">
        <WaveCanvas
          colors={HERO_COLORS}
          ripple={0}
          origin={[-0.2, 0.3]}
          className="absolute inset-0 size-full"
        />
        <div className="relative px-6">
          {/* First screen: intro at the top, pitch filling the rest. svh not vh
              so mobile browser chrome doesn't push the fold off-screen. */}
          {/* `relative` so the cue can anchor to this screen's bottom. */}
          <div className="relative flex min-h-svh flex-col pb-16 pt-16">
            <Intro />
            <div className="flex flex-1 flex-col justify-center pt-16">
              <Pitch />
            </div>

            {/* Phone and tablet — hidden at lg, where the pinned desktop hero
                takes over and scrolling is self-evident. Matches this stacked
                section's own lg:hidden so the two can't disagree. Inline styles
                override the skill's hero-card offset and retint it for the dark
                gradient it sits on here. */}
            <ScrollCue
              className="lg:hidden"
              style={
                {
                  bottom: 24,
                  "--scroll-cue-color": "#ffffff",
                  "--scroll-cue-track": "rgba(255,255,255,0.3)",
                  "--scroll-cue-sweep-color": "#ffffff",
                } as React.CSSProperties
              }
            />
          </div>

          <p className="mt-24 font-display text-[20px] font-medium text-white">
            Selected work
          </p>

          <div className="mt-6 space-y-14 pb-20">
            {chapters.map((c, i) => (
              <div key={c.id}>
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/55">
                  {String(i + 1).padStart(2, "0")} — {c.meta}
                </p>
                <h2 className="mt-2 font-display text-2xl font-medium tracking-[-0.02em] text-white">
                  {c.name}
                </h2>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-white/75">
                  {c.blurb}
                </p>
                <div className="mt-6 flex justify-center">
                  <ChapterVisual id={c.visual} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
