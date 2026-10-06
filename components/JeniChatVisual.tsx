"use client";

import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, Zap } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLoopStep } from "./useLoopStep";

/**
 * The Jeni story, as a looping screen recording built in code.
 *
 *   the empty chat with its suggested questions · the camera pushes in on the
 *   first one and a cursor clicks it · Jeni works the question out in the open,
 *   naming the sources it reads and how long each took · the ranked table, what
 *   it means, and where to go next
 *
 * The point is the middle beat. One plain-English question is answered by
 * joining PostHog's app views to Bravo's production MySQL, and the trace shows
 * every step of that — so the copy in the trace is the real copy, verbatim,
 * timings included. Nothing here is paraphrased.
 *
 * Authored in the same 601×695 space as the cashback demo, so the two chapters
 * sit in the hero slot identically and scale as one unit. The "camera" is a
 * single transform on the whole scene; the window scrolls its own content
 * underneath it, the way a recording of a real app would.
 */

const W = 601;
const H = 695;
/** The app window inside the frame, with the frame's own margin around it. */
const WIN = { x: 44, y: 83, w: 513, h: 529 };
/** The composer's height and its inset from the window's bottom edge. */
const COMPOSER_H = 75;
const COMPOSER_INSET = 9;

const EASE_OUT = [0.23, 1, 0.32, 1] as const;
const EASE_IN_OUT = [0.77, 0, 0.175, 1] as const;

const TEAL = "#17a589";
const LAVENDER = "#c7cff3";
const AMBER = "#f5b301";

const STEPS = [
  // Reset frame: everything snaps back while the opening is already showing.
  { id: "idle", ms: 150 },
  { id: "open", ms: 1400 },
  // The close-up, then the cursor, then the click — one beat each, so the
  // question is readable before anything touches it.
  { id: "zoom", ms: 1100 },
  { id: "cursor", ms: 1000 },
  { id: "click", ms: 450 },
  { id: "send", ms: 900 },
  { id: "t1", ms: 800 },
  { id: "t2", ms: 800 },
  // The two sources being read — long enough for the shimmer to register as
  // work happening rather than a flicker.
  { id: "run", ms: 1800 },
  { id: "done", ms: 900 },
  { id: "t5", ms: 650 },
  { id: "t6", ms: 650 },
  { id: "t7", ms: 800 },
  { id: "header", ms: 700 },
  { id: "table", ms: 2200 },
  { id: "summary", ms: 2600 },
  { id: "hold", ms: 2000 },
  // Crossfades straight back into the opening, so the loop never shows an
  // empty frame between the last beat and the next first one.
  { id: "clear", ms: 900 },
] as const;

const S = {
  IDLE: 0,
  OPEN: 1,
  ZOOM: 2,
  CURSOR: 3,
  CLICK: 4,
  SEND: 5,
  T1: 6,
  T2: 7,
  RUN: 8,
  DONE: 9,
  T5: 10,
  T6: 11,
  T7: 12,
  HEADER: 13,
  TABLE: 14,
  SUMMARY: 15,
  HOLD: 16,
  CLEAR: 17,
} as const;

const MS = STEPS.map((st) => st.ms);

/* ── Content, verbatim from the product ───────────────────────────────── */

const QUESTIONS = [
  "Which restaurants get lots of views but few payments",
  "Which restaurants have low app attention but strong payment activity",
  "Which restaurants have the most views per payer",
];

type TraceStep = {
  title: string;
  sub?: string;
  time?: string;
  /** While the source is still being read. */
  running?: { title: string; sub: string };
};

const TRACE: TraceStep[] = [
  {
    title:
      "It’s a filtered list question about restaurant attention against payment activity and restaurant attention in the app.",
    sub: "population: merchants.viewed in app · filters: attention_outcome_quadrant=high_attention_low_outcome",
    time: "436ms",
  },
  {
    title:
      "This needs PostHog and Bravo’s production MySQL and PostHog: the restaurant attention against payment activity and restaurant detail page views (PostHog).",
    sub: "posthog detail views joined to bravo settled bills on store id, over one shared window · $screen events whose current_page_name is '/store', aggregated per restaurant · last 30 days",
  },
  {
    running: {
      title:
        "I’m reading PostHog and Bravo’s production MySQL side by side for the restaurant attention against payment activity...",
      sub: "posthog detail views joined to bravo settled bills on store id, over one shared window · last 30 days · attention_outcome_quadrant=high_attention_low_outcome",
    },
    title:
      "Found 65 matching rows in the restaurant attention against payment activity.",
    sub: "posthog detail views joined to bravo settled bills on store id, over one shared window · last 30 days · attention_outcome_quadrant=high_attention_low_outcome",
    time: "8350ms",
  },
  {
    running: {
      title:
        "I’m checking PostHog for the restaurant detail page views (PostHog)...",
      sub: "$screen events whose current_page_name is '/store', aggregated per restaurant · last 30 days",
    },
    title:
      "Found 523 matching rows in the restaurant detail page views (PostHog).",
    sub: "$screen events whose current_page_name is '/store', aggregated per restaurant · last 30 days",
    time: "8350ms",
  },
  {
    title: "Checked every figure against the catalog’s definitions — they hold.",
    sub: "4 supported · 0 refused",
  },
  {
    title: "Source is healthy, with data through 2026-10-06.",
    sub: "status: healthy · data through 2026-10-06",
    time: "3ms",
  },
  { title: "Laying out the 50 results as a ranked table." },
];

const ROWS: [string, number, number, number][] = [
  ["House of Dawn Steakhouse", 111, 1, 1],
  ["Madame Danh", 96, 1, 1],
  ["Steveston Seafood House", 95, 1, 1],
  ["ELEM", 86, 0, 0],
  ["L’Abattoir", 82, 0, 0],
  ["Heat Pot", 82, 2, 2],
  ["Shizenya", 80, 4, 2],
  ["Masa Ishibashi", 73, 0, 0],
  ["PiDGiN", 68, 0, 0],
  ["Saigon Bites Kingsway", 65, 1, 1],
];

const FOLLOW_UPS = [
  "Which restaurants got lots of views but few payments over the last 7 days",
  "Which restaurants got lots of views but few payments over the last 60 days",
  "What are the total restaurant detail views for these restaurants",
];

/** How many trace steps are on screen at a given beat. */
function shownFor(s: number) {
  if (s < S.T1 || s >= S.CLEAR) return 0;
  if (s === S.T1) return 1;
  if (s === S.T2) return 2;
  if (s <= S.DONE) return 4;
  if (s === S.T5) return 5;
  if (s === S.T6) return 6;
  return 7;
}

/* ── Shared bits ──────────────────────────────────────────────────────── */

const CHIP: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  borderRadius: 999,
  border: "1px solid #e2e2e2",
  background: "#fff",
  padding: "5px 8px",
  fontSize: 9.5,
  lineHeight: "12px",
  color: "#222",
  boxShadow: "0 1px 1.5px rgba(0,0,0,0.04)",
  whiteSpace: "nowrap",
};

/** A classic arrow pointer, tip at (1, 1). */
function Cursor() {
  return (
    <svg width="12" height="18" viewBox="0 0 12 18" aria-hidden>
      <path
        d="M1 1 L1 14.6 L4.4 11.5 L6.7 16.7 L8.9 15.7 L6.7 10.7 L11 10.7 Z"
        fill="#111"
        stroke="#fff"
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ───────────────────────────────────────────────────────────────────────── */

export default function JeniChatVisual({
  bare = false,
}: {
  /**
   * For a full-bleed band (the study's own hero): the grey runs edge to edge
   * with no rounded panel and no play/pause control, and the band — not a
   * 70svh cap — sets the height.
   */
  bare?: boolean;
} = {}) {
  const { step, paused, setPaused, reduced, ref: wrapRef } = useLoopStep(MS);
  // Reduced motion gets the finished answer, not the loop.
  const s = reduced ? S.HOLD : step;
  const stepRef = useRef(s);
  stepRef.current = s;
  const snap = s === S.IDLE;

  /**
   * Framer only server-renders an explicit `initial`, so every layer would
   * ship visible and piled up until hydration. Holding the scene back until
   * mount makes the served frame an empty panel instead.
   */
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  const [scale, setScale] = useState(0.5);
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => {
      const { width, height } = e.contentRect;
      if (width > 0) setScale(Math.min(width / W, height > 0 ? height / H : Infinity));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [wrapRef]);

  /**
   * The panel the viewer actually sees. On a phone it is the canvas's own
   * width; on desktop it is the whole column, much wider than the canvas. The
   * close-up is framed against this, not the canvas, so it composes the same
   * way in both — window corner near the panel's top-left, questions filling
   * across it.
   */
  const panelRef = useRef<HTMLDivElement>(null);
  const [panelW, setPanelW] = useState(0);
  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setPanelW(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /**
   * Where things actually landed, measured rather than guessed: the camera has
   * to frame the first chip, and the window has to scroll to the table and to
   * the follow-ups, and all three depend on how the type set. Re-measured once
   * the web font has loaded, since the fallback face wraps differently.
   */
  const chipRef = useRef<HTMLDivElement>(null);
  const chipsRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  const traceRef = useRef<HTMLDivElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const [geo, setGeo] = useState({
    chip: { x: 9, y: 28, w: 250, h: 23 },
    /** Right edge of the widest question, in the window's own space. */
    chipsRight: 345,
    /** Bottom of the finished trace, in the window's own space. */
    traceBottom: 300,
    tableScroll: 280,
    summaryScroll: 420,
  });
  useLayoutEffect(() => {
    if (!ready) return;
    const c = chipRef.current;
    const t = tableRef.current;
    const m = summaryRef.current;
    if (!c || !t || !m) return;
    const measure = () => {
      // The hero mounts this twice and hides one with display:none, where
      // every offset reads 0. Taking that reading aimed the close-up at the
      // window's corner and put the click there too — so a zero is never
      // trusted, and the last good measurement (or the estimate) stands.
      if (c.offsetWidth === 0 || t.offsetHeight === 0) return;
      const tableScroll = Math.max(0, t.offsetTop - 6);
      const chips = [...(chipsRef.current?.children ?? [])] as HTMLElement[];
      const tr = traceRef.current;
      // The thinking shot is solved from this, so it is frozen while that
      // shot is on screen: the "I'm reading…" row wraps to two lines and then
      // settles to one, and re-reading the height mid-scene re-solved the
      // zoom and made the camera pump in and out under the trace. Read in the
      // settled layout and held, the shot stays put until the table arrives.
      const st = stepRef.current;
      const holding = st >= S.SEND && st < S.TABLE;
      setGeo((prev) => ({
        traceBottom: holding || !tr ? prev.traceBottom : tr.offsetTop + tr.offsetHeight,
        chip: { x: c.offsetLeft, y: c.offsetTop, w: c.offsetWidth, h: c.offsetHeight },
        chipsRight: Math.max(...chips.map((el) => el.offsetLeft + el.offsetWidth)),
        tableScroll,
        // Stops with the last follow-up just clear of the composer, which
        // comes back at the end and would otherwise sit over it.
        summaryScroll: Math.max(
          tableScroll,
          m.offsetTop + m.offsetHeight - (WIN.h - COMPOSER_H - COMPOSER_INSET) + 10,
        ),
      }));
    };
    // A ResizeObserver rather than a one-off read: it fires again when a
    // hidden mount is shown and when the web font swaps in, which are exactly
    // the two moments the first reading goes stale.
    const ro = new ResizeObserver(measure);
    ro.observe(c);
    ro.observe(t);
    ro.observe(m);
    if (traceRef.current) ro.observe(traceRef.current);
    measure();
    return () => ro.disconnect();
  }, [ready]);

  /* ── Camera ──
   * Wide and reading both keep the whole window inside the grey, with a
   * margin on every side at any width.
   */
  const MARGIN = 22;
  const WIDE = { x: 0, y: 0, scale: 1 };
  const readS = (W - MARGIN * 2) / WIN.w;
  const READ = {
    scale: readS,
    x: W / 2 - readS * (WIN.x + WIN.w / 2),
    y: H / 2 - readS * (WIN.y + WIN.h / 2),
  };

  /**
   * The close-up is a push-in on the whole window, the way a camera would:
   * its top-left corner held near the panel's top-left with a strip of grey
   * above and beside it, the questions large and readable, and the rest of
   * the window running off the right and bottom where the panel clips it.
   *
   * Solved rather than tuned, so it composes the same at any width: the
   * window's left edge lands at FRAME_L of the panel and the widest question's
   * right edge at FRAME_R, which fixes the scale; the window's top lands at
   * FRAME_T of the panel's height.
   */
  const FRAME_L = 0.08;
  const FRAME_R = 0.93;
  const FRAME_T = 0.12;
  // The panel in canvas units, and where its left edge sits in them.
  const pw = panelW > 0 && scale > 0 ? panelW / scale : W;
  const panelLeft = (W - pw) / 2;
  // Capped: in a full-bleed band the panel can be twice the canvas's width,
  // and solving the frame against all of it would blow the questions up past
  // the point of reading as a close-up of an app.
  const closeS = Math.min(2.6, ((FRAME_R - FRAME_L) * pw) / geo.chipsRight);
  const CLOSE_UP = {
    scale: closeS,
    x: panelLeft + FRAME_L * pw - closeS * WIN.x,
    y: FRAME_T * H - closeS * WIN.y,
  };
  /**
   * The thinking shot: held close while Jeni works, so the trace reads at a
   * glance. The window's top sits at FRAME_T like the question close-up and
   * it is centred across the panel; the scale is the largest that keeps both
   * the whole window width (times and all) inside the panel's 91% and the
   * whole trace above the panel's bottom 5% — so the newest step is never
   * cropped off. Never looser than the reading shot.
   */
  const RUNNING_SLACK = 16; // the two-line "I'm reading…" row, before it settles to one
  const thinkS = Math.max(
    readS,
    Math.min(
      2.6,
      (0.91 * pw) / WIN.w,
      ((0.95 - FRAME_T) * H) / (geo.traceBottom + RUNNING_SLACK),
    ),
  );
  const THINK = {
    scale: thinkS,
    x: panelLeft + (pw - thinkS * WIN.w) / 2 - thinkS * WIN.x,
    y: FRAME_T * H - thinkS * WIN.y,
  };
  const camera =
    s >= S.ZOOM && s <= S.CLICK
      ? CLOSE_UP
      : s >= S.SEND && s < S.TABLE
        ? THINK
        : s >= S.TABLE && s < S.CLEAR
          ? READ
          : WIDE;

  /* ── Cursor, in the window's own space so it rides the camera ── */
  const tip = {
    x: geo.chip.x + geo.chip.w * 0.58,
    y: geo.chip.y + geo.chip.h * 0.62,
  };
  const cursorFrom = { x: tip.x + 60, y: tip.y + 50 };
  const cursorAt = s >= S.CURSOR && s <= S.CLICK;
  const cursorOn = cursorAt;
  /**
   * A real pointer doesn't grow when the page zooms, so the cursor is
   * counter-scaled against the camera and the canvas to hold ~20px on screen
   * whatever width the close-up resolved to.
   */
  const CURSOR_PX = 20;
  const cursorK = CURSOR_PX / (18 * closeS * scale);

  /* ── Layers ── */
  const openingOn = s <= S.CLICK || s === S.CLEAR;
  const convoOn = s >= S.SEND && s < S.CLEAR;
  // Leaves as the answer arrives — it would otherwise sit over the table —
  // and returns once the follow-ups have landed, so the loop ends where a
  // real conversation does: ready for the next question.
  const inputOn = s < S.HEADER || s >= S.SUMMARY;
  /** Matches the last follow-up chip's arrival: 1.0 + 2 × 0.12, plus its fade. */
  const INPUT_RETURN_DELAY = 1.6;
  const shown = shownFor(s);
  const headerOn = s >= S.HEADER && s < S.CLEAR;
  const tableOn = s >= S.HEADER && s < S.CLEAR;
  const rowsOn = s >= S.TABLE && s < S.CLEAR;
  const summaryOn = s >= S.SUMMARY && s < S.CLEAR;
  const scroll =
    s >= S.SUMMARY && s < S.CLEAR
      ? geo.summaryScroll
      : s >= S.TABLE && s < S.CLEAR
        ? geo.tableScroll
        : 0;

  const fade = (on: boolean, delay = 0) => ({
    animate: { opacity: on ? 1 : 0, y: on ? 0 : 5 },
    transition: snap ? { duration: 0 } : { duration: 0.45, ease: EASE_OUT, delay: on ? delay : 0 },
  });

  return (
    // Same two-box arrangement as the cashback demo: the outer takes whatever
    // height the slot gives it, the inner is driven by that height.
    <div
      className={
        bare
          ? "flex h-full w-full"
          : "flex h-full min-h-0 w-full max-h-[70svh] items-center justify-center"
      }
      style={bare ? undefined : { aspectRatio: `${W} / ${H}` }}
    >
      {/* The panel takes the column's full width, so the close-up can spill
          past the authoring box and still be clipped by the panel's edge. */}
      <div
        ref={panelRef}
        className="relative flex h-full w-full items-center justify-center overflow-hidden"
        style={{
          borderRadius: bare ? 0 : 37 * scale,
          background: "var(--flow-panel, rgba(255,255,255,0.3))",
          backdropFilter: "blur(8.05px)",
          WebkitBackdropFilter: "blur(8.05px)",
        }}
      >
        <div
          ref={wrapRef}
          className="relative h-full"
          style={{ aspectRatio: `${W} / ${H}`, width: "auto", maxWidth: `min(${W}px, 100%)` }}
        >
          {ready && (
            <div
              className="absolute left-1/2 top-1/2 text-[#222]"
              style={{ width: W, height: H, transform: `translate(-50%, -50%) scale(${scale})` }}
            >
              {/* ── Camera ───────────────────────────────────────────── */}
              <motion.div
                className="absolute inset-0"
                style={{ transformOrigin: "0 0" }}
                initial={false}
                animate={camera}
                transition={
                  snap
                    ? { duration: 0 }
                    : {
                        // ZOOM is the slow push onto the question; TABLE matches
                        // the window's 1s scroll so the pull-back and the move
                        // down to the table are a single camera move.
                        duration: s === S.ZOOM ? 1.1 : s === S.TABLE ? 1.0 : 0.85,
                        ease: EASE_IN_OUT,
                      }
                }
              >
                {/* ── The app window ────────────────────────────────── */}
                <div
                  className="absolute overflow-hidden bg-white"
                  style={{
                    left: WIN.x,
                    top: WIN.y,
                    width: WIN.w,
                    height: WIN.h,
                    borderRadius: 14,
                    boxShadow:
                      "0 0 0 3px rgba(255,255,255,0.6), 0 0 0 4px rgba(0,0,0,0.05), 0 18px 40px -18px rgba(0,0,0,0.3)",
                  }}
                >
                  <div className="absolute inset-0">
                  {/* Opening: the suggested questions. */}
                  <motion.div
                    className="absolute inset-0"
                    style={{ padding: "11px 9px" }}
                    initial={false}
                    animate={{ opacity: openingOn ? 1 : 0 }}
                    transition={{ duration: s === S.CLEAR ? 0.6 : 0.35, ease: EASE_OUT }}
                  >
                    <p
                      className="uppercase"
                      style={{ fontSize: 8.5, letterSpacing: "0.08em", color: "#a3a3a3", fontWeight: 600 }}
                    >
                      Questions that span two sources
                    </p>
                    <div ref={chipsRef} className="flex flex-col items-start" style={{ marginTop: 6, gap: 4 }}>
                      {QUESTIONS.map((q, i) => (
                        <motion.div
                          key={q}
                          ref={i === 0 ? chipRef : undefined}
                          style={CHIP}
                          initial={false}
                          animate={
                            i === 0 && s === S.CLICK
                              ? { scale: [1, 0.96, 1], backgroundColor: ["#ffffff", "#ededed", "#f6f6f6"] }
                              : { scale: 1, backgroundColor: "#ffffff" }
                          }
                          transition={{ duration: 0.35, ease: EASE_OUT }}
                        >
                          {q}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Conversation: scrolls under the camera like a real
                      window, measured offsets drive where it stops. */}
                  <motion.div
                    className="absolute inset-x-0 top-0"
                    style={{ padding: "11px 9px" }}
                    initial={false}
                    animate={{ opacity: convoOn ? 1 : 0, y: -scroll }}
                    transition={
                      snap
                        ? { duration: 0 }
                        : { opacity: { duration: 0.35 }, y: { duration: 1.0, ease: EASE_IN_OUT } }
                    }
                  >
                    {/* The question, as sent. */}
                    <motion.div className="flex justify-end" initial={false} {...fade(convoOn, 0.25)}>
                      <span
                        style={{
                          background: "#f0f0f0",
                          borderRadius: 999,
                          padding: "7px 9px",
                          fontSize: 10,
                          lineHeight: "12px",
                          color: "#222",
                        }}
                      >
                        {QUESTIONS[0]}
                      </span>
                    </motion.div>

                    {/* The trace. */}
                    <div ref={traceRef} className="relative" style={{ marginTop: 9 }}>
                      {/* Appears once the work is done, as the collapsible
                          summary of it. Its line is reserved from the start
                          so the steps never jump when it arrives. */}
                      <motion.div
                        className="flex items-center"
                        style={{ height: 16, gap: 6, fontSize: 8.5, color: "#9a9a9a" }}
                        initial={false}
                        animate={{ opacity: headerOn ? 1 : 0 }}
                        transition={snap ? { duration: 0 } : { duration: 0.4 }}
                      >
                        <span style={{ width: 4, height: 4, borderRadius: 9, background: TEAL, marginLeft: 0.5 }} />
                        How I worked this out
                        <ChevronUp size={8} strokeWidth={2} />
                      </motion.div>

                      {TRACE.map((t, i) => {
                        const on = i < shown;
                        const running = !!t.running && s === S.RUN;
                        const done = on && !running;
                        const title = running ? t.running!.title : t.title;
                        const sub = running ? t.running!.sub : t.sub;
                        const nextOn = i + 1 < shown;
                        return (
                          <motion.div
                            key={i}
                            className="relative grid"
                            style={{ gridTemplateColumns: "9px 1fr auto", columnGap: 6, paddingBottom: 7 }}
                            initial={false}
                            animate={{ opacity: on ? 1 : 0, y: on ? 0 : 5 }}
                            transition={snap ? { duration: 0 } : { duration: 0.4, ease: EASE_OUT }}
                          >
                            {/* The rail down to the next step, drawn as that
                                step arrives. */}
                            {i < TRACE.length - 1 && (
                              <motion.span
                                className="absolute"
                                style={{
                                  left: 2,
                                  top: 9,
                                  bottom: -2,
                                  width: 1,
                                  background: "#e1e1e1",
                                  transformOrigin: "top",
                                }}
                                initial={false}
                                animate={{ scaleY: nextOn ? 1 : 0 }}
                                transition={snap ? { duration: 0 } : { duration: 0.35, ease: EASE_OUT }}
                              />
                            )}

                            <motion.span
                              style={{ marginTop: 4, width: 5, height: 5, borderRadius: 9 }}
                              initial={false}
                              animate={
                                running
                                  ? { backgroundColor: LAVENDER, scale: [1, 1.45, 1], opacity: [1, 0.55, 1] }
                                  : { backgroundColor: done ? TEAL : LAVENDER, scale: 1, opacity: 1 }
                              }
                              transition={
                                running
                                  ? { duration: 1.1, repeat: Infinity, ease: "easeInOut" }
                                  : { duration: 0.3 }
                              }
                            />

                            <div className="min-w-0">
                              {running ? (
                                // Work in progress reads as light moving
                                // through the line, not a spinner.
                                <motion.p
                                  style={{
                                    fontSize: 9.5,
                                    lineHeight: "13px",
                                    backgroundImage:
                                      "linear-gradient(90deg, #555 0%, #555 35%, #c4c4c4 50%, #555 65%, #555 100%)",
                                    backgroundSize: "250% 100%",
                                    WebkitBackgroundClip: "text",
                                    backgroundClip: "text",
                                    color: "transparent",
                                  }}
                                  animate={{ backgroundPosition: ["100% 0", "-150% 0"] }}
                                  transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
                                >
                                  {title}
                                </motion.p>
                              ) : (
                                <p style={{ fontSize: 9.5, lineHeight: "13px", color: "#868686" }}>{title}</p>
                              )}
                              {sub && (
                                <p className="truncate" style={{ fontSize: 7.3, lineHeight: "10px", color: "#c6c6c6", marginTop: 2 }}>
                                  {sub}
                                </p>
                              )}
                            </div>

                            <motion.span
                              style={{ fontSize: 7.3, color: "#c8c8c8", paddingTop: 2 }}
                              initial={false}
                              animate={{ opacity: t.time && done ? 1 : 0 }}
                              transition={snap ? { duration: 0 } : { duration: 0.3 }}
                            >
                              {t.time ?? ""}
                            </motion.span>
                          </motion.div>
                        );
                      })}
                    </div>

                    {/* The answer. */}
                    <motion.div
                      ref={tableRef}
                      style={{ marginTop: 12, border: "1px solid #e6e6e6", borderRadius: 8, overflow: "hidden" }}
                      initial={false}
                      {...fade(tableOn)}
                    >
                      <div style={{ padding: "9px 9px 7px" }}>
                        <p style={{ fontSize: 10, lineHeight: "13px" }}>
                          <span style={{ fontWeight: 600, color: "#111" }}>Restaurant detail views</span>{" "}
                          <span style={{ fontSize: 8.6, color: "#a8a8a8" }}>
                            high app attention but weak payment activity · last 30 days · default window
                          </span>
                        </p>
                        <p style={{ fontSize: 8.5, color: "#8f8f8f", marginTop: 5 }}>Ranked by restaurant detail views</p>

                        <table className="w-full" style={{ marginTop: 6, fontSize: 9.5, borderCollapse: "collapse" }}>
                          <thead>
                            <tr style={{ fontSize: 8.5, color: "#6f6f6f", borderBottom: "1px solid #d9d9d9" }}>
                              <th className="text-left font-normal" style={{ padding: "0 0 5px 5px", width: 20 }}>#</th>
                              <th className="text-left font-normal" style={{ paddingBottom: 5 }}>Merchant</th>
                              <th className="text-right font-normal" style={{ paddingBottom: 5 }}>Restaurant detail views</th>
                              <th className="text-right font-normal" style={{ paddingBottom: 5, paddingLeft: 12 }}>Qualifying payments</th>
                              <th className="text-right font-normal" style={{ padding: "0 4px 5px 12px" }}>Paying diners</th>
                            </tr>
                          </thead>
                          <tbody>
                            {ROWS.map(([name, views, pays, diners], i) => (
                              <motion.tr
                                key={name}
                                style={{ borderBottom: i < ROWS.length - 1 ? "1px solid #eeeeee" : undefined }}
                                initial={false}
                                animate={{ opacity: rowsOn ? 1 : 0 }}
                                transition={
                                  snap
                                    ? { duration: 0 }
                                    : { duration: 0.35, ease: EASE_OUT, delay: rowsOn ? 0.35 + i * 0.07 : 0 }
                                }
                              >
                                <td style={{ padding: "7px 0 7px 5px", color: "#b0b0b0" }}>{i + 1}</td>
                                <td style={{ color: "#222" }}>{name}</td>
                                <td className="text-right tabular-nums" style={{ fontWeight: 600, color: "#111" }}>{views}</td>
                                <td className="text-right tabular-nums" style={{ color: "#444" }}>{pays}</td>
                                <td className="text-right tabular-nums" style={{ color: "#444", paddingRight: 4 }}>{diners}</td>
                              </motion.tr>
                            ))}
                          </tbody>
                        </table>

                        <p style={{ fontSize: 7.6, lineHeight: "11px", color: "#b0b0b0", marginTop: 7 }}>
                          high app attention but weak payment activity: above the median on app views, at or below it on
                          paying diners. Jeni read 50 of the 65 matching rows for this display, so these 10 are the
                          highest among what it read — not a global top 10.
                        </p>
                      </div>
                      <div
                        className="flex items-center"
                        style={{ gap: 5, background: "#f6f6f6", borderTop: "1px solid #ececec", padding: "5px 9px", fontSize: 7.6, color: "#7d7d7d" }}
                      >
                        <span style={{ width: 4, height: 4, borderRadius: 9, background: TEAL }} />
                        two sources · live
                      </div>
                    </motion.div>

                    {/* What it means, and where to go next. */}
                    <div ref={summaryRef} style={{ marginTop: 12 }}>
                      <motion.p style={{ fontSize: 10.5, lineHeight: "15px", color: "#222" }} initial={false} {...fade(summaryOn, 0.4)}>
                        65 restaurants match. The highest 10 by restaurant detail views among the 50 Jeni read.
                      </motion.p>
                      <motion.p style={{ fontSize: 10.5, lineHeight: "15px", color: "#222", marginTop: 6 }} initial={false} {...fade(summaryOn, 0.6)}>
                        This covers restaurants viewed in the bravo app only, which is a subset of all stores. This figure
                        cannot be added up across rows. No period was given in the question, so this covers the last 30
                        days. Some matching rows were not carried through, so this is not a complete list.
                      </motion.p>
                      <motion.p
                        className="flex items-center"
                        style={{ gap: 3, fontSize: 8.5, color: "#ababab", marginTop: 8 }}
                        initial={false}
                        {...fade(summaryOn, 0.8)}
                      >
                        <Zap size={8} fill={AMBER} stroke={AMBER} />
                        Jev interpreted · governed
                        <ChevronDown size={8} strokeWidth={2} />
                      </motion.p>
                      <div className="flex flex-col items-start" style={{ marginTop: 10, gap: 4 }}>
                        {FOLLOW_UPS.map((q, i) => (
                          <motion.div key={q} style={CHIP} initial={false} {...fade(summaryOn, 1.0 + i * 0.12)}>
                            {q}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>

                  {/* The composer, pinned to the bottom. */}
                  <motion.div
                    className="absolute"
                    style={{ left: 9, right: 9, bottom: COMPOSER_INSET, height: COMPOSER_H }}
                    initial={false}
                    animate={{ opacity: inputOn ? 1 : 0, y: inputOn ? 0 : 14 }}
                    transition={
                      snap
                        ? { duration: 0 }
                        : {
                            duration: 0.45,
                            ease: EASE_OUT,
                            delay: s === S.SUMMARY ? INPUT_RETURN_DELAY : 0,
                          }
                    }
                  >
                    <div
                      className="relative h-full bg-white"
                      style={{ border: "1px solid #e4e4e4", borderRadius: 10, padding: 9, boxShadow: "0 1px 2px rgba(0,0,0,0.03)" }}
                    >
                      <p style={{ fontSize: 10, color: "#b2b2b2" }}>Ask Jeni...</p>
                      <span
                        className="absolute flex items-center"
                        style={{ left: 9, bottom: 9, gap: 3, border: "1px solid #e4e4e4", borderRadius: 4, padding: "2px 5px", fontSize: 8, color: "#555" }}
                      >
                        <Zap size={8} fill={AMBER} stroke={AMBER} />
                        Jev
                        <ChevronDown size={8} strokeWidth={2} color="#999" />
                      </span>
                    </div>
                  </motion.div>
                  {/* ── The cursor ─────────────────────────────────────── */}
                  <motion.div
                    aria-hidden
                    className="pointer-events-none absolute"
                    style={{ left: 0, top: 0, transformOrigin: "1px 1px" }}
                    initial={false}
                    animate={{
                      x: (cursorAt ? tip.x : cursorFrom.x) - 1,
                      y: (cursorAt ? tip.y : cursorFrom.y) - 1,
                      opacity: cursorOn ? 1 : 0,
                      scale: s === S.CLICK ? [1, 0.82, 1] : 1,
                    }}
                    transition={
                      snap
                        ? { duration: 0 }
                        : {
                            x: { duration: 0.85, ease: EASE_IN_OUT },
                            y: { duration: 0.85, ease: EASE_IN_OUT },
                            opacity: { duration: 0.25 },
                            scale: { duration: 0.3, ease: EASE_OUT },
                          }
                    }
                  >
                    <div style={{ transform: `scale(${cursorK})`, transformOrigin: "1px 1px" }}>
                      <Cursor />
                    </div>
                  </motion.div>

                  {/* The click, as a ring leaving the tip. */}
                  <motion.span
                    aria-hidden
                    className="pointer-events-none absolute rounded-full"
                    style={{ left: tip.x - 9, top: tip.y - 9, width: 18, height: 18, border: "1.5px solid rgba(79,131,247,0.55)" }}
                    initial={false}
                    animate={s === S.CLICK ? { scale: [0.3, 1.4], opacity: [0.9, 0] } : { scale: 0.3, opacity: 0 }}
                    transition={{ duration: 0.45, ease: EASE_OUT }}
                  />
                  </div>
                </div>

              </motion.div>
            </div>
          )}
        </div>

        {!reduced && !bare && (
          <button
            type="button"
            onClick={(e) => {
              // The chapter around this is one big link; pausing is not navigating.
              e.stopPropagation();
              setPaused((p) => !p);
            }}
            aria-label={paused ? "Play the demo" : "Pause the demo"}
            className="absolute bottom-4 right-4 grid size-10 place-items-center rounded-full bg-black/25 text-white backdrop-blur-sm transition-[transform,background-color] duration-150 ease-out hover:bg-black/40 active:scale-[0.97]"
          >
            {paused ? (
              <svg width="14" height="16" viewBox="0 0 14 16" aria-hidden>
                <path d="M1 1.6a1 1 0 0 1 1.53-.85l10 6.4a1 1 0 0 1 0 1.7l-10 6.4A1 1 0 0 1 1 14.4V1.6Z" fill="currentColor" />
              </svg>
            ) : (
              <svg width="12" height="16" viewBox="0 0 12 16" aria-hidden>
                <rect x="0" y="0" width="4" height="16" rx="1.6" fill="currentColor" />
                <rect x="8" y="0" width="4" height="16" rx="1.6" fill="currentColor" />
              </svg>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
