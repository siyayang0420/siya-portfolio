"use client";

import { useEffect, useRef, useState } from "react";
import {
  cubicBezier,
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { Coins, Percent, Ticket, TrendingUp } from "lucide-react";

/**
 * Reward-engine visual for the fintech case study.
 *
 * A single progress value 0 → 1 drives everything; it's animated on a loop:
 *
 *   0.00–0.28  tangled   — four mechanisms, overlapping, each in its own unit
 *   0.28–0.62  resolving — every value converts to dollars; the web straightens
 *   0.62–1.00  one       — the rows collapse into a single balance
 *
 * The four never leave: they settle to a faint ghost stack behind the total, so
 * the "before" is still on screen to compare the "after" against.
 */

/** Long ease-out. No overshoot anywhere — motion should feel inevitable. */
const ease = cubicBezier(0.16, 1, 0.3, 1);

/**
 * One breath, in seconds. The clock is advanced by hand rather than handed to
 * `animate()` with a `times` array — that route quietly ignored the weighting
 * and split the cycle into four equal segments.
 */
const HOLD_TANGLED = 1.2;
const CONSOLIDATE = 6;
const HOLD_ONE = 2.5;
const DISSOLVE = 2.3;
const CYCLE_S = HOLD_TANGLED + CONSOLIDATE + HOLD_ONE + DISSOLVE;

/** Cycle position in seconds → progress 0 → 1. */
function phase(s: number) {
  if (s < HOLD_TANGLED) return 0;
  const a = s - HOLD_TANGLED;
  if (a < CONSOLIDATE) return ease(a / CONSOLIDATE);
  const b = a - CONSOLIDATE;
  if (b < HOLD_ONE) return 1;
  return 1 - ease((b - HOLD_ONE) / DISSOLVE);
}

const W = 520;
const H = 360;

type Mechanism = {
  id: string;
  label: string;
  /** The rule that governs it — attached to the chip, not floating loose. */
  rule: string;
  /** What it reads as before the redesign. */
  native: string;
  /** What it's worth once everything is one currency. */
  dollars: number;
  Icon: typeof Coins;
  /** Overlapping start positions — density, not a tidy grid. */
  x: number;
  y: number;
  r: number;
};

const MECHANISMS: Mechanism[] = [
  { id: "points", label: "Points", rule: "100 pts = $1", native: "1,240 pts", dollars: 12.4, Icon: Coins, x: -96, y: -74, r: -2 },
  { id: "coupon", label: "Threshold", rule: "Spend $100", native: "$15 OFF", dollars: 15, Icon: Ticket, x: 62, y: -96, r: 1.6 },
  { id: "rate", label: "Cashback", rule: "First visit", native: "Earn 5%", dollars: 4.2, Icon: Percent, x: -74, y: 48, r: 2 },
  { id: "topup", label: "Top-up", rule: "Before dining", native: "+7%", dollars: 5.88, Icon: TrendingUp, x: 86, y: 26, r: -1.4 },
];

const TOTAL = MECHANISMS.reduce((n, m) => n + m.dollars, 0);

/** Where each chip sits once aligned, before the final collapse. */
const ROW_Y = [-66, -22, 22, 66];

/** Interconnections — the web that makes four things read as one tangle. */
const WEB: [number, number][] = [
  [0, 1],
  [0, 2],
  [1, 3],
  [2, 3],
  [0, 3],
];

const money = (v: number) =>
  `$${v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/**
 * Writes a formatted number straight to the DOM on every frame. Going through
 * state here would re-render the tree sixty times a second.
 */
function Ticker({
  value,
  className,
}: {
  value: MotionValue<number>;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const write = (v: number) => {
      if (ref.current) ref.current.textContent = money(v);
    };
    write(value.get());
    return value.on("change", write);
  }, [value]);
  return <span ref={ref} className={className} />;
}

function Chip({
  m,
  index,
  t,
}: {
  m: Mechanism;
  index: number;
  t: MotionValue<number>;
}) {
  // Tangled → aligned column → stacked ghost behind the total.
  const x = useTransform(t, [0, 0.28, 0.62, 0.8], [m.x, m.x, 0, 0]);
  const y = useTransform(t, [0, 0.28, 0.62, 0.86], [m.y, m.y, ROW_Y[index], 0]);
  const rotate = useTransform(t, [0, 0.28, 0.5], [m.r, m.r, 0]);
  const opacity = useTransform(t, [0, 0.62, 0.9], [1, 1, 0.11]);
  const scale = useTransform(t, [0, 0.62, 0.9], [1, 1, 0.94]);

  // The unit swap: the native reading hands off to a dollar amount.
  const nativeOpacity = useTransform(t, [0.28, 0.42], [1, 0]);
  const dollarOpacity = useTransform(t, [0.36, 0.5], [0, 1]);
  const dollars = useTransform(t, [0.36, 0.62], [0, m.dollars]);
  const ruleOpacity = useTransform(t, [0, 0.3, 0.44], [0.55, 0.55, 0]);

  return (
    <motion.div
      className="absolute left-1/2 top-1/2 flex items-center gap-3 rounded-2xl border border-white/25 bg-white/12 px-3.5 py-2.5 backdrop-blur-md"
      style={{ x, y, rotate, opacity, scale, translateX: "-50%", translateY: "-50%" }}
    >
      <m.Icon className="size-4 shrink-0 text-white/85" strokeWidth={1.6} />

      <div className="flex flex-col leading-tight">
        <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-white/50">
          {m.label}
        </span>
        <motion.span
          className="font-mono text-[9px] uppercase tracking-[0.1em] text-white/70"
          style={{ opacity: ruleOpacity }}
        >
          {m.rule}
        </motion.span>
      </div>

      {/* Both readings occupy the same grid cell so the row never reflows. */}
      <span className="relative ml-1 grid min-w-[74px] justify-items-end text-[13px] font-medium text-white">
        <motion.span className="col-start-1 row-start-1" style={{ opacity: nativeOpacity }}>
          {m.native}
        </motion.span>
        <motion.span className="col-start-1 row-start-1" style={{ opacity: dollarOpacity }}>
          <Ticker value={dollars} />
        </motion.span>
      </span>
    </motion.div>
  );
}

export default function RewardEngineVisual() {
  const reduced = useReducedMotion();
  const t = useMotionValue(0);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Don't burn frames while the chapter is off-screen.
  const onScreen = useRef(true);
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen.current = entry.isIntersecting;
      },
      { rootMargin: "80px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const clock = useRef(0);
  useAnimationFrame((_, delta) => {
    if (reduced) {
      t.set(1); // hold the resolved state; never loop
      return;
    }
    if (!onScreen.current) return;
    clock.current = (clock.current + delta / 1000) % CYCLE_S;
    t.set(phase(clock.current));
  });

  // Keep the authored 520×360 composition proportional at any width.
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => {
      setScale(Math.min(1, e.contentRect.width / W));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const webOpacity = useTransform(t, [0, 0.28, 0.5], [0.18, 0.18, 0]);
  const spineOpacity = useTransform(t, [0.3, 0.44, 0.66], [0, 0.3, 0]);
  const glow = useTransform(t, [0.5, 0.85], [0.15, 1]);
  const totalOpacity = useTransform(t, [0.66, 0.86], [0, 1]);
  const totalScale = useTransform(t, [0.66, 0.94], [0.93, 1]);
  const totalBlur = useTransform(t, [0.66, 0.9], [8, 0]);
  const totalFilter = useTransform(totalBlur, (b) => `blur(${b}px)`);
  const total = useTransform(t, [0.66, 0.94], [0, TOTAL]);

  return (
    <div ref={wrapRef} className="w-full max-w-[520px]">
      <div className="relative mx-auto" style={{ width: W * scale, height: H * scale }}>
        <div
          className="absolute left-0 top-0"
          style={{ width: W, height: H, transform: `scale(${scale})`, transformOrigin: "top left" }}
        >
          {/* Swells as the system consolidates. Static blur, animated opacity. */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              opacity: glow,
              background:
                "radial-gradient(circle, rgba(255,255,255,0.3), rgba(255,255,255,0) 68%)",
              filter: "blur(30px)",
            }}
          />

          <svg
            aria-hidden
            className="absolute inset-0"
            width={W}
            height={H}
            viewBox={`${-W / 2} ${-H / 2} ${W} ${H}`}
          >
            {/* The tangle: mechanisms depending on each other, not on a centre. */}
            <motion.g style={{ opacity: webOpacity }}>
              {WEB.map(([a, b]) => (
                <line
                  key={`${a}-${b}`}
                  x1={MECHANISMS[a].x}
                  y1={MECHANISMS[a].y}
                  x2={MECHANISMS[b].x}
                  y2={MECHANISMS[b].y}
                  stroke="white"
                  strokeWidth={0.75}
                />
              ))}
            </motion.g>

            {/* One axis, briefly, while the rows line up on it. */}
            <motion.line
              x1={0}
              y1={ROW_Y[0] - 14}
              x2={0}
              y2={ROW_Y[3] + 14}
              stroke="white"
              strokeWidth={0.75}
              style={{ opacity: spineOpacity }}
            />
          </svg>

          {MECHANISMS.map((m, i) => (
            <Chip key={m.id} m={m} index={i} t={t} />
          ))}

          {/* One balance, one unit. Arrives soft and sharpens. */}
          <motion.div
            className="absolute left-1/2 top-1/2 flex flex-col items-center gap-2 rounded-[1.75rem] border border-white/25 bg-white/14 px-9 py-6 backdrop-blur-xl"
            style={{
              opacity: totalOpacity,
              scale: totalScale,
              filter: totalFilter,
              translateX: "-50%",
              translateY: "-50%",
            }}
          >
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/55">
              Cashback balance
            </span>
            <Ticker value={total} className="text-[34px] font-medium leading-none text-white" />
            <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/60">
              $1 = $1 next meal
            </span>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
