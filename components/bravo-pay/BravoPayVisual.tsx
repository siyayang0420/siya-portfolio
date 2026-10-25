"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import PhoneMockup from "./PhoneMockup";
import InPhoneApp, { type PhoneState } from "./InPhoneApp";
import { SHEET_AT } from "./PaySheet";
import "./bravo-pay.css";

/**
 * Hero visual for the Bravo payments chapter: the bravo-landing phone, played
 * on a clock. bravo AI answers "where to try foie gras", the follow-up is
 * spoken ("Pay the bill please"), and the pay sheet from the Figma file takes
 * it from there: amount, tip, bonus, swipe, processing, receipt (PaySheet).
 * Then it holds, blurs out, and starts over.
 *
 * Same panel and play/pause control as the Jeni demo (project 1).
 */

// Authoring box, shared with the Jeni demo so the two panels match.
const W = 601;
const H = 695;

/* Timeline, in ms. Opens on the empty chat; the pay sheet's own steps are in
   PaySheet, from SHEET_AT. */
const BUBBLE = [1000, 1500];
const THINK = [2100, 2600];
// The answer replaces the status line 1.2s after it shows, then rolls out.
const ANSWER = [[3300, 3900], [3900, 4500], [4500, 5100]];
// Then the mic is tapped, the follow-up is spoken, and sent.
const MIC_AT = 7200;
const REC = [7400, 9900];
const SEND_AT = 9700;
const BUBBLE2 = [9900, 10400];
const THINK2 = [10700, 11100];
// Camera: push in as the question rises, hold while the answer rolls out and
// the follow-up is spoken, then pull back out 1s before the pay sheet rises.
const ZOOM_IN = [900, 1700];
const ZOOM_OUT = [SHEET_AT - 1000, SHEET_AT];
const CLOSE = 1.75; // close-up scale: the full chat width still fits the panel
const EDGE = 24; // px of panel left showing below the phone in the close-up
const LOOP = 26500; // the receipt lands at ~22.7s and holds
const FADE = 600; // blur out at the end, blur back in at the start

const track = (t: number, a: number, b: number) => Math.min(Math.max((t - a) / (b - a), 0), 1);
const smooth = (x: number) => x * x * (3 - 2 * x);

/** A tap: presses in over 90ms, releases over 160ms. */
const press = (t: number, at: number) => (t < at ? track(t, at - 90, at) : 1 - track(t, at, at + 160));

/**
 * The camera: how far it is pushed in, and where it sits, in px below the
 * phone's centre (unscaled). It is fixed to the phone, never to the content:
 * the chat grows and scrolls up inside a still phone, the way it would in the
 * hand, and only the push in and the pull out move the shot. Framed on the
 * bottom of the chat, where every new line lands, with the phone's lower edge
 * just in view.
 */
function camera(t: number, phone: HTMLElement, panelH: number) {
  const zoom = smooth(track(t, ZOOM_IN[0], ZOOM_IN[1])) * (1 - smooth(track(t, ZOOM_OUT[0], ZOOM_OUT[1])));
  const s = 1 + (CLOSE - 1) * zoom;
  const y = phone.offsetHeight / 2 - panelH / (2 * CLOSE) + EDGE / CLOSE;
  return { y: y * zoom, s };
}

function frame(t: number): PhoneState {
  return {
    bubble: track(t, BUBBLE[0], BUBBLE[1]),
    thinking: track(t, THINK[0], THINK[1]),
    kb: 0, // no keyboard: the chat opens with the prompt already at the bottom
    answer: ANSWER.map(([a, b]) => track(t, a, b)),
    micPress: press(t, MIC_AT),
    recording: t >= REC[0] && t < REC[1],
    sendPress: press(t, SEND_AT),
    bubble2: smooth(track(t, BUBBLE2[0], BUBBLE2[1])),
    thinking2: smooth(track(t, THINK2[0], THINK2[1])),
    t,
  };
}

export default function BravoPayVisual() {
  const reduced = useReducedMotion();
  const [t, setT] = useState(0);
  const [paused, setPaused] = useState(false);
  const [onScreen, setOnScreen] = useState(true);
  const panelRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);

  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting), { rootMargin: "80px" });
    const ro = new ResizeObserver(([e]) => {
      const { width, height } = e.contentRect;
      if (width > 0) setScale(Math.min(width / W, height > 0 ? height / H : Infinity));
    });
    io.observe(el);
    ro.observe(el);
    return () => {
      io.disconnect();
      ro.disconnect();
    };
  }, []);

  // The clock only advances while it is visible, playing, and motion is allowed.
  useEffect(() => {
    if (reduced || paused || !onScreen) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(now - last, 100); // a backgrounded tab resumes, not skips
      last = now;
      setT((v) => (v + dt) % LOOP);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced, paused, onScreen]);

  // Reduced motion gets the finished answer, still.
  const now = reduced ? ANSWER[2][1] : t;

  // The camera is written straight to the rig each frame, after layout, so it
  // can read the panel's and the phone's sizes.
  const rigRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const rig = rigRef.current;
    const phone = rig?.querySelector<HTMLElement>(".phone-mockup");
    if (!rig || !phone) return;
    const c = reduced ? { y: 0, s: 1 } : camera(now, phone, rig.offsetHeight);
    rig.style.transform = `scale(${c.s}) translate(0px, ${-c.y}px)`;
  });
  const shown = reduced ? 1 : Math.min(track(now, 0, FADE), 1 - track(now, LOOP - FADE, LOOP));

  return (
    <div className="flex h-full min-h-0 w-full max-h-[70svh] items-center justify-center" style={{ aspectRatio: `${W} / ${H}` }}>
      <div
        ref={panelRef}
        className="bp relative flex h-full w-full items-center justify-center overflow-hidden"
        style={{
          borderRadius: 37 * scale,
          background: "var(--flow-panel, rgba(255,255,255,0.3))",
          backdropFilter: "blur(8.05px)",
          WebkitBackdropFilter: "blur(8.05px)",
        }}
      >
        <div ref={rigRef} className="flex h-full w-full items-center justify-center" style={{ willChange: "transform" }}>
        <PhoneMockup
          style={{ height: "86%" }}
          aria-label="bravo AI recommending PiDGiN for foie gras, then paying the bill there by voice"
        >
          <div
            className="absolute inset-0"
            style={{ opacity: shown, filter: shown < 1 ? `blur(${(1 - shown) * 6}px)` : undefined }}
          >
            <InPhoneApp {...frame(now)} />
          </div>
        </PhoneMockup>
        </div>

        {!reduced && (
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
