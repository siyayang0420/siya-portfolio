/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

/*
 * The pay sheet bravo AI raises after "Pay the bill please" — Figma frames
 * 800:1909 → 804:2205 (Portfolio Site Project). Authored at the 402px screen
 * width inside the AI frame, so it scales with it. Four panels share one
 * sheet, all at the height of the tallest, with the button pinned to the
 * bottom:
 *
 *   amount (Select amount + keypad) → method (Select payment method)
 *   → processing (breathing orb) → success (receipt)
 *
 * Everything runs off the hero clock `t`; nothing here is interactive.
 */

const S = "/work/bravo-pay/sheet/";

/* Timeline, in ms on the hero clock. */
export const SHEET_AT = 11900; // sheet rises
const RISE_MS = 600;
const TYPE_AT = 13000; // first keystroke
const KEY_MS = 230;
const AMOUNT = "120.23";
const TIP_AT = 14900; // tap 15%
const CONTINUE_AT = 15700;
const METHOD_AT = 15900;
const BONUS_AT = 17400; // Use Bonus toggled on
const SWIPE = [18500, 19400];
/* Swipe track: a 48px pill (the same height as the other buttons) with a
   40px knob inset 4px, so the knob travels 361 − 40 − 8. */
const KNOB = 40;
const SWIPE_INSET = 4;
const TRAVEL = 361 - KNOB - 2 * SWIPE_INSET;
/* Sparks left in the knob's wake: [where along the track, y offset, size] */
const SPARKS = [
  [0.12, -9, 9],
  [0.3, 8, 7],
  [0.48, -6, 11],
  [0.66, 9, 8],
  [0.84, -8, 9],
] as const;
const PROCESS_AT = 19500;
const SUCCESS_AT = 22200;

const track = (t: number, a: number, b: number) => Math.min(Math.max((t - a) / (b - a), 0), 1);
const smooth = (x: number) => x * x * (3 - 2 * x);
const inOutCubic = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2);
const press = (t: number, at: number) => (t < at ? track(t, at - 90, at) : 1 - track(t, at, at + 160));

const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "del"];
const TIPS = [
  ["15%", "$18.03"],
  ["18%", "$21.64"],
  ["20%", "$24.00"],
] as const;

function To() {
  return (
    <div className="ps-to">
      <span className="ps-to__left">
        <img className="ps-to__logo" src={S + "pidgin-logo.png"} alt="" />
        <span className="ps-to__text">
          <span className="ps-to__label">To</span>
          <span className="ps-to__name">
            PiDGiN <span className="ps-to__dist">• 0.2km</span>
          </span>
        </span>
      </span>
      <img className="ps-icon32" src={S + "chevron-down.svg"} alt="" />
    </div>
  );
}

function MethodHead({ back = true }: { back?: boolean }) {
  return (
    <div className="ps-head">
      <img className="ps-icon32" src={S + (back ? "sheet-back.svg" : "sheet-right.svg")} alt="" />
      <p className="ps-title">Select payment method</p>
      <img className="ps-icon32" src={S + "sheet-right.svg"} alt="" />
    </div>
  );
}

/* ── amount ─────────────────────────────────────────────────────────── */
function AmountPanel({ t }: { t: number }) {
  const typed = AMOUNT.slice(0, Math.max(0, Math.min(AMOUNT.length, Math.floor((t - TYPE_AT) / KEY_MS) + 1)));
  const done = typed.length === AMOUNT.length;
  // the key whose stroke just landed, for a brief press highlight
  const n = Math.floor((t - TYPE_AT) / KEY_MS);
  const down = n >= 0 && n < AMOUNT.length && t - TYPE_AT - n * KEY_MS < 140 ? AMOUNT[n] : null;
  const tipOn = t >= TIP_AT;

  return (
    <>
      <p className="ps-title">Select amount</p>
      <To />
      <div className="ps-amount">
        <p className="ps-amount__num">{typed ? `$${typed}` : "$00.0"}</p>
        <span className="ps-caret" />
      </div>
      <div className="ps-tips">
        {TIPS.map(([pct, amt], i) => (
          <span
            key={pct}
            className={`ps-tip${i === 0 && tipOn ? " is-on" : ""}`}
            style={i === 0 ? { transform: `scale(${1 - 0.06 * press(t, TIP_AT)})` } : undefined}
          >
            <span className="ps-tip__pct">{pct}</span>
            <span className="ps-tip__amt">{done ? amt : "$0.00"}</span>
          </span>
        ))}
        <span className="ps-tip ps-tip--custom">custom</span>
      </div>
      <div className="ps-keys">
        {KEYS.map((k) => (
          <span key={k} className={`ps-key${k === "." ? " ps-key--dot" : ""}${k === down ? " is-down" : ""}`}>
            {k === "del" ? <img src={S + "backspace.svg"} alt="" style={{ width: 24, height: 24 }} /> : k}
          </span>
        ))}
      </div>
      <span
        className={`ps-btn ps__foot${tipOn ? " is-on" : ""}`}
        style={{ transform: `scale(${1 - 0.04 * press(t, CONTINUE_AT)})` }}
      >
        Continue to pay
      </span>
    </>
  );
}

/* ── method ─────────────────────────────────────────────────────────── */
/** Opens a row to its measured height as `g` goes 0 → 1. */
function Open({ g, children }: { g: number; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [h, setH] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setH(el.offsetHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div style={{ width: "100%", height: g < 1 ? h * g : undefined, marginTop: -10 * (1 - g), overflow: "hidden", opacity: g }}>
      <div ref={ref}>{children}</div>
    </div>
  );
}

function MethodPanel({ t }: { t: number }) {
  const on = t >= BONUS_AT;
  const g = smooth(track(t, BONUS_AT, BONUS_AT + 400));
  // a gentle sine ease: eases off the start and into the end without a lurch
  const k = (1 - Math.cos(Math.PI * track(t, SWIPE[0], SWIPE[1]))) / 2;
  const settle = track(t, SWIPE[1], SWIPE[1] + 250);

  return (
    <>
      <MethodHead />
      <To />
      {/* keyed so the struck-through state fades in rather than snapping */}
      <div className="ps-total" key={on ? "on" : "off"}>
        <div className="ps-total__row">
          {on && <p className="ps-strike ps-total__was">$138.26</p>}
          <p className="ps-total__now">{on ? "$14.71" : "$138.26"}</p>
        </div>
        <p className="ps-total__tip">includes $18.03 tip</p>
      </div>
      <div className="ps-cards">
        <div className="ps-card ps-card--bonus">
          <div className="ps-card__row">
            <span className="ps-card__col">
              <span className="ps-card__label">Use Bonus</span>
              <span className="ps-card__amt" key={on ? "on" : "off"}>
                {on && <span className="ps-strike">$123.55</span>}
                <b>{on ? "$0.0" : "$123.55"}</b>
              </span>
            </span>
            <span className={`ps-toggle${on ? " is-on" : ""}`}>
              <img src={S + (on ? "toggle-on.svg" : "toggle-off.svg")} alt="" />
            </span>
          </div>
          <Open g={g}>
            <div className="ps-bonus-btns">
              <span className="ps-bonus-btn ps-bonus-btn--max">
                <em>Max</em>
                <b>$123.55</b>
              </span>
              <span className="ps-bonus-btn">Customize</span>
            </div>
          </Open>
        </div>
        <div className="ps-card">
          <div className="ps-card__row">
            <span className="ps-card__col">
              <span className="ps-card__label">Bravo Balance</span>
              <span className="ps-card__bal">
                <span className="ps-badge">
                  <img src={S + "bravo-mark.svg"} alt="" />
                </span>
                <b>$234.12</b>
              </span>
            </span>
            <img className="ps-icon32" src={S + "chevron-down.svg"} alt="" />
          </div>
        </div>
      </div>
      <div className="ps-swipe ps__foot">
        <span className="ps-swipe__label" style={{ opacity: 1 - k }}>Swipe to pay $14.71</span>
        {/* the secure glint: a soft trail behind the knob, and sparks that
            twinkle on as it passes them, then settle out once it lands */}
        <span className="ps-swipe__trail" style={{ width: KNOB + k * TRAVEL, opacity: 1 - settle }} />
        {SPARKS.map(([f, dy, size], i) => {
          const life = Math.min(Math.max((k - f) / 0.42, 0), 1);
          const on = Math.sin(Math.PI * life) * (1 - settle);
          return (
            <svg
              key={i}
              className="ps-spark"
              viewBox="0 0 24 24"
              width={size}
              height={size}
              style={{
                left: SWIPE_INSET + f * TRAVEL + 6 - size / 2, // just off the knob's trailing edge
                top: `calc(50% + ${dy}px - ${size / 2}px)`,
                opacity: on,
                transform: `scale(${0.4 + 0.6 * on}) rotate(${life * 90}deg)`,
              }}
              aria-hidden
            >
              <path d="M12 0C12.9 7.6 16.4 11.1 24 12 16.4 12.9 12.9 16.4 12 24 11.1 16.4 7.6 12.9 0 12 7.6 11.1 11.1 7.6 12 0Z" fill="currentColor" />
            </svg>
          );
        })}
        <span className="ps-swipe__knob" style={{ transform: `translate(${k * TRAVEL}px, -50%)` }}>
          <img src={S + "swipe-arrow.svg"} alt="" style={{ width: 24, height: 24 }} />
        </span>
      </div>
    </>
  );
}

/* ── processing ─────────────────────────────────────────────────────── */
/* Figma's breathing orb (804:2081): six layers on one 2s loop, each
   swelling and brightening by its own amount. [layer, box, inset%, o, o', s'] */
const ORB = [
  ["orb-reflection.svg", [64, 48, 60, 38], "-31.58% -20%", 0.55, 0.7, 1.035],
  ["orb-rose.svg", [49, 77, 58, 62], "-25.81% -27.59%", 0.85, 0.93, 1.06],
  ["orb-warm.svg", [94, 93, 59, 60], "-21.67% -22.03%", 0.9, 0.95, 1.07],
  ["orb-body.svg", [40, 40, 120, 120], "0", 1, 1, 1.045],
  ["orb-ring.svg", [18, 18, 164, 164], "0", 0.55, 0.75, 1.07],
  ["orb-halo.svg", [16, 16, 168, 168], "-13.1%", 0.28, 0.42, 1.13],
] as const;

function ProcessingPanel() {
  return (
    <>
      <MethodHead back={false} />
      <div className="ps-proc">
        <div className="ps-orb">
          {ORB.map(([src, [l, top, w, h], inset, o0, o1, s1]) => (
            <motion.div
              key={src}
              className="ps-orb__layer"
              style={{ left: l, top, width: w, height: h }}
              initial={{ opacity: o0, scale: 1 }}
              animate={{ opacity: [o0, o1, o0], scale: [1, s1, 1] }}
              transition={{ duration: 2, times: [0, 0.75, 1], ease: "easeInOut", repeat: Infinity }}
            >
              <img src={S + src} alt="" style={{ position: "absolute", inset }} />
            </motion.div>
          ))}
        </div>
        <div className="ps-proc__msg">
          <p className="ps-proc__title">Processing your payment</p>
          <p className="ps-proc__sub">Just a moment while we connect to Pidgin.</p>
        </div>
      </div>
    </>
  );
}

/* ── success ────────────────────────────────────────────────────────── */
function SuccessPanel({ t }: { t: number }) {
  const pop = smooth(track(t, SUCCESS_AT + 50, SUCCESS_AT + 550));
  return (
    <>
      <div className="ps-ok">
        <div className="ps-ok__top">
          <img src={S + "check.svg"} alt="" style={{ width: 80, height: 80, transform: `scale(${0.6 + 0.4 * pop})` }} />
          <div className="ps-ok__heads">
            <p className="ps-ok__title">Payment Successful</p>
            <div className="ps-ok__sum">
              <p className="ps-strike ps-ok__was">$138.26</p>
              <p className="ps-ok__now">$14.71</p>
              <p className="ps-ok__from">from Bravo Balance</p>
            </div>
          </div>
        </div>
        <div className="ps-ok__body">
          <div className="ps-receipt">
            <div className="ps-receipt__row">
              <span>Total bill</span>
              <span>$138.26</span>
            </div>
            <div className="ps-receipt__row ps-green">
              <span>Bravo bonus used</span>
              <span>-$123.55</span>
            </div>
            <img className="ps-receipt__dash" src={S + "dash.svg"} alt="" />
            <div className="ps-receipt__row">
              <span className="ps-receipt__paid">
                <b>You paid</b>
                <small>From Balance</small>
              </span>
              <b>$14.71</b>
            </div>
          </div>
          <div className="ps-earned">
            <div className="ps-earned__card">
              <b>Bonus earned</b>
              <b className="ps-earned__amt">+$1.60</b>
            </div>
            <p className="ps-earned__now">
              Your Bravo Bonus now is
              <span className="ps-coin">
                <img src={S + "coin-ring.svg"} alt="" />
                <img className="ps-coin__mark" src={S + "coin-mark.svg"} alt="" />
              </span>
              <b className="ps-green">$1.60</b>
            </p>
          </div>
        </div>
      </div>
      <span className="ps-btn ps-btn--close ps__foot is-on">Close</span>
    </>
  );
}

/* ── the sheet ──────────────────────────────────────────────────────── */
export default function PaySheet({ t }: { t: number }) {
  const rise = inOutCubic(track(t, SHEET_AT, SHEET_AT + RISE_MS));
  // Panels swap instantly, like screens in the app, not cross-fading.
  const m = t >= METHOD_AT ? 1 : 0;
  const p = t >= PROCESS_AT ? 1 : 0;
  const s = t >= SUCCESS_AT ? 1 : 0;
  const weights = [1 - m, m * (1 - p), p * (1 - s), s];

  // One height for every panel: the amount panel's, the tallest (keypad).
  // The others stretch to it, with their button pinned to the bottom.
  const tallest = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  useEffect(() => {
    const el = tallest.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setHeight(el.offsetHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const panels = [
    <AmountPanel key="a" t={t} />,
    <MethodPanel key="m" t={t} />,
    <ProcessingPanel key="p" />,
    <SuccessPanel key="s" t={t} />,
  ];

  return (
    <div
      className="ps"
      style={{
        height: height || undefined,
        transform: `translateY(${(1 - rise) * 100}%)`,
        visibility: rise > 0 ? undefined : "hidden",
      }}
    >
      <span className="ps__wash" style={{ opacity: s }} />
      {panels.map((panel, i) => (
        <div
          key={i}
          ref={i === 0 ? tallest : undefined}
          className="ps__panel"
          style={{
            height: i === 0 ? undefined : height || undefined,
            opacity: weights[i],
            visibility: weights[i] > 0.001 ? undefined : "hidden",
          }}
        >
          {panel}
        </div>
      ))}
    </div>
  );
}
