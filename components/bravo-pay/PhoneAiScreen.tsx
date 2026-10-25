"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { OrbSphere } from "../orb/OrbSphere";
import PaySheet, { SHEET_AT } from "./PaySheet";

const A = "/work/bravo-pay/app/";
const aiBack = A + "ai-back.svg";
const aiLogo = A + "ai-logo.svg";
const aiMenu = A + "ai-menu.svg";
const kbEmoji = A + "kb-emoji.svg";
const kbMic = A + "kb-mic.svg";
const plus = A + "plus.svg";
const mic = A + "mic.svg";
const audio = A + "audio.svg";
const ansEmma = A + "ans-emma.webp";
const ansVenue = A + "ans-venue.webp";
const ansPhoto1 = A + "ans-photo1.webp";
const ansPhoto2 = A + "ans-photo2.webp";
const quote = A + "quote.svg";
const bookmark = A + "bookmark.svg";


/* "Breeze in": drift up and settle, with a touch of blur coming off. */
const breeze = (t: number): React.CSSProperties => ({
  opacity: t,
  transform: `translateY(${(1 - t) * 16}px)`,
  filter: t < 1 ? `blur(${(1 - t) * 3}px)` : 'none',
});

/* Voice Input pill from bravov3-demo (Figma I19377:5111;1355:26180): ten
   metering bars on Figma's own offset 2s loops, so the row ripples. */
const BARS = [
  { h: 8, keys: [8, 10.2, 5.9, 10, 8], times: [0, 0.1695, 0.489, 0.795, 1] },
  { h: 8, keys: [8, 9.6, 5.9, 9.3, 8], times: [0, 0.1855, 0.4815, 0.7875, 1] },
  { h: 12, keys: [12, 15.4, 8.9, 14.8, 12], times: [0, 0.2015, 0.615, 0.921, 1] },
  { h: 12, keys: [12, 14.5, 8.9, 15.6, 12], times: [0, 0.217, 0.608, 0.9135, 1] },
  { h: 8, keys: [8, 10.3, 6, 9.7, 8], times: [0, 0.233, 0.6005, 0.906, 1] },
  { h: 8, keys: [8, 9.7, 6, 10.2, 8], times: [0, 0.2485, 0.5935, 0.8985, 1] },
  { h: 12, keys: [12, 15.5, 9, 14.4, 12], times: [0, 0.2645, 0.586, 0.891, 1] },
  { h: 10, keys: [10, 13, 7.6, 10], times: [0, 0.296, 0.7125, 1] },
  { h: 8, keys: [8, 9.2, 6.1, 8], times: [0, 0.3275, 0.698, 1] },
  { h: 10, keys: [10, 12.3, 7.6, 10], times: [0, 0.3435, 0.6905, 1] },
];

function VoiceInput() {
  const reduce = useReducedMotion();
  return (
    <span className="ai__voice">
      <span className="ai__voice-bars" aria-hidden>
        {BARS.map((bar, i) => (
          <motion.span
            key={i}
            className="ai__voice-bar"
            initial={{ height: bar.h }}
            animate={reduce ? { height: bar.h } : { height: bar.keys }}
            transition={reduce ? { duration: 0 } : { duration: 2, times: bar.times, ease: "easeInOut", repeat: Infinity }}
          />
        ))}
      </span>
      <span className="ai__voice-stop">Stop</span>
    </span>
  );
}

/* The second question's bubble: 14px × 1.2 line + 20px padding. Its row grows
   from nothing so the thread above is pushed up smoothly, not jumped. */
const BUBBLE_H = 37;
const GAP = 16;

/**
 * Opens a row to its measured height as `t` goes 0 → 1, so whatever lands at
 * the bottom of the thread pushes the conversation up smoothly instead of
 * jumping it. `from` is the height it starts at (what it replaces).
 */
function Grow({ t, from = 0, pull = 0, children }: { t: number; from?: number; pull?: number; children: ReactNode }) {
  const inner = useRef<HTMLDivElement>(null);
  const [h, setH] = useState(0);
  useEffect(() => {
    const el = inner.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setH(el.offsetHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div style={{ width: "100%", flexShrink: 0, height: t < 1 ? (h ? from + (h - from) * t : from) : undefined, marginTop: -pull * (1 - t), overflow: t < 1 ? "hidden" : undefined }}>
      <div ref={inner}>{children}</div>
    </div>
  );
}

const easeInOut = (x: number) => x * x * (3 - 2 * x);

/* Rotating status lines while bravo AI "searches". */
const THINKING = [
  'Let me look that up for you …',
  'Scanning menus and reviews nearby …',
  'Rounding up the best matches …',
];

const ROW1 = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'];
const ROW2 = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'];
const ROW3 = ['z', 'x', 'c', 'v', 'b', 'n', 'm'];

/* Shift / delete / return are SF Symbols in the design — system glyphs with no
   exported vector, so they're drawn here rather than sourced from Figma. */
const Shift = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#595959" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3.5 3.5 12H8v6.5h8V12h4.5L12 3.5Z" />
  </svg>
);
const Delete = () => (
  <svg viewBox="0 0 26 20" fill="none" stroke="#595959" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8.5 3h13a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-13L2 10l6.5-7Z" />
    <path d="M12.5 7.5l6 5M18.5 7.5l-6 5" />
  </svg>
);
const Return = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 5v6a3 3 0 0 1-3 3H5" />
    <path d="M9 10l-4 4 4 4" />
  </svg>
);

export default function PhoneAiScreen({
  scale, frameH, bubble = 0, thinking = 0, kb = 1, answer = [0, 0, 0],
  micPress = 0, recording = false, sendPress = 0, bubble2 = 0,
  thinking2 = 0, t = 0,
}: {
  scale: number; frameH: number; bubble?: number; thinking?: number; kb?: number; answer?: number[];
  /** 0..1..0 tap on the mic, then on send — a quick press-in and release */
  micPress?: number; sendPress?: number;
  recording?: boolean;
  bubble2?: number;
  /** the reply to the follow-up: a status line, then the app swipes to Pay */
  thinking2?: number;
  t?: number;
}) {
  const [line, setLine] = useState(0);
  const answering = answer[0] > 0;
  const active = thinking > 0.5 && !answering;

  /* cycle the status line only while the row is actually on screen */
  useEffect(() => {
    if (!active) { setLine(0); return; }
    const id = setInterval(() => setLine((i) => (i + 1) % THINKING.length), 2200);
    return () => clearInterval(id);
  }, [active]);

  return (
    <div className="ai__frame" style={{ transform: `scale(${scale})`, height: `${frameH}px` }}>
      <div className="ai__glow" />

      <div className="ai__top">
        <div className="ai__bar">
          <span className="ai__iconbtn"><img src={aiBack} alt="" /></span>
          <img className="ai__logo" src={aiLogo} alt="bravo AI" />
          <span className="ai__iconbtn"><img src={aiMenu} alt="" /></span>
        </div>
        <p className="ai__note">bravo AI may make mistakes, so please double check.</p>
      </div>

      <div className="ai__bottom">
        <div className="ai__thread">
          <div className="ai__bubble-row">
            <div
              className="ai__bubble"
              style={{ opacity: bubble, transform: `translateY(${(1 - bubble) * 26}px)` }}
            >
              where to try foie gras in town ?
            </div>
          </div>

          {/* answer — orb stays, status line is replaced by the reply.
              The three blocks breeze in one after another. */}
          <div
            className="ai__reply"
            style={{ opacity: thinking, transform: `translateY(${(1 - thinking) * 14}px)` }}
          >
            <OrbSphere className="ai__orb" speed={1.4} />

            <div className="ai__reply-body">
              {!answering && <span className="ai__think-line" key={line}>{THINKING[line]}</span>}

              {answering && (
                // Grows from the status line's 32px to the answer's full height as
                // the three blocks land, so the thread above eases up, not snaps.
                <Grow t={easeInOut((answer[0] + answer[1] + answer[2]) / 3)} from={32}>
                <div className="flex flex-col" style={{ gap: 16 }}>
                  <p className="ai__answer breeze" style={breeze(answer[0])}>
                    PiDGiN in Downtown is your best bet — it’s Michelin recommended, and their
                    seared Foie Gras with rice is the one dish regulars keep coming back for.
                    Go early if you want the counter.
                  </p>

                  <div className="ai__friend breeze" style={breeze(answer[1])}>
                    <div className="ai__friend-head">
                      <span>Your friend</span>
                      <span className="ai__friend-av"><img src={ansEmma} alt="" /></span>
                      <span>Emma posted about it last week</span>
                    </div>
                    <div className="ai__friend-quote">
                      <img className="ai__quote-mark" src={quote} alt="" />
                      <p>What a great place to be, I like their foie gras on rice and the drinks are amazing</p>
                    </div>
                  </div>

                  <div className="ai__result breeze" style={breeze(answer[2])}>
                    <div className="ai__venue">
                      <div className="ai__venue-left">
                        <span className="ai__venue-thumb">
                          <img src={ansVenue} alt="" />
                          <span className="ai__venue-pct">3%</span>
                        </span>
                        <span className="ai__venue-meta">
                          <span className="ai__venue-name">PiDGiN</span>
                          <span className="ai__venue-sub">Fine Dining • Vancouver • 15.13km</span>
                        </span>
                      </div>
                      <span className="ai__venue-save"><img src={bookmark} alt="" /></span>
                    </div>
                    <div className="ai__photos">
                      <span className="ai__photo"><img src={ansPhoto1} alt="" /></span>
                      <span className="ai__photo"><img src={ansPhoto2} alt="" /></span>
                    </div>
                  </div>
                </div>
                </Grow>
              )}
            </div>
          </div>

          {/* the follow-up, spoken: its row opens up and the bubble rises into it */}
          {bubble2 > 0 && (
            <div
              className="ai__bubble-row"
              style={{ height: BUBBLE_H * bubble2, marginTop: -GAP * (1 - bubble2), overflow: "visible" }}
            >
              <div
                className="ai__bubble"
                style={{ opacity: bubble2, transform: `translateY(${(1 - bubble2) * 26}px)` }}
              >
                Pay the bill please
              </div>
            </div>
          )}

          {/* the follow-up's reply: its row opens like the bubble's, then the pay sheet rises over it */}
          {thinking2 > 0 && (
            <Grow t={thinking2} pull={GAP}>
            <div
              className="ai__reply"
              style={{ opacity: thinking2, transform: `translateY(${(1 - thinking2) * 14}px)` }}
            >
              <OrbSphere className="ai__orb" speed={1.4} />
              <div className="ai__reply-body">
                <span className="ai__think-line ai__think-line--sm">
                  {t < SHEET_AT ? "Looking for the closest restaurants ..." : "Setting up the bill now ..."}
                </span>
              </div>
            </div>
            </Grow>
          )}

          <div className="pbox ai__prompt">
            <div className="pbox__inner">
              <span className="ai__prompt-plus"><img src={plus} alt="" /></span>
              <span className="ai__prompt-ph" style={{ opacity: recording ? 0 : 1 }}>Ask or search anything...</span>
              {/* Same three end states as bravov3's PromptBox: idle (mic + voice),
                  recording (Voice Input pill + send). Scale from 0.9, never 0. */}
              <AnimatePresence mode="wait" initial={false}>
                {recording ? (
                  <motion.span
                    key="rec"
                    className="ai__prompt-end"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
                  >
                    <VoiceInput />
                    <span className="ai__prompt-audio" style={{ transform: `scale(${1 - 0.08 * sendPress})` }}>
                      <ArrowUp size={20} strokeWidth={2.4} color="#fff" />
                    </span>
                  </motion.span>
                ) : (
                  <motion.span
                    key="idle"
                    className="ai__prompt-end"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
                  >
                    <img className="ai__prompt-mic" src={mic} alt="" style={{ transform: `scale(${1 - 0.15 * micPress})` }} />
                    <span className="ai__prompt-audio"><img src={audio} alt="" /></span>
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Keyboard drops away once bravo AI starts working. The negative margin
            collapses its layout space in step with the slide, otherwise it keeps
            reserving 342px and pushes the thread out through the top. */}
        <div
          className="ai__kb"
          style={{
            transform: `translateY(${(1 - kb) * 100}%)`,
            opacity: kb,
            marginBottom: `${-(1 - kb) * 342}px`,
          }}
        >
          <div className="ai__kb-suggest">
            <span>“The”</span><i /><span>the</span><i /><span>to</span>
          </div>

          <div className="ai__kb-keys">
            <div className="ai__kb-row">
              {ROW1.map((k) => <span className="ai__key" key={k}>{k}</span>)}
            </div>
            <div className="ai__kb-row ai__kb-row--2">
              {ROW2.map((k) => <span className="ai__key" key={k}>{k}</span>)}
            </div>
            <div className="ai__kb-row ai__kb-row--3">
              <span className="ai__key ai__key--shift"><Shift /></span>
              <span className="ai__kb-mid">
                {ROW3.map((k) => <span className="ai__key" key={k}>{k}</span>)}
              </span>
              <span className="ai__key ai__key--del"><Delete /></span>
            </div>
            <div className="ai__kb-row ai__kb-row--4">
              <span className="ai__key ai__key--abc">ABC</span>
              <span className="ai__key ai__key--space" />
              <span className="ai__key ai__key--return"><Return /></span>
            </div>
          </div>

          <div className="ai__kb-foot">
            <img src={kbEmoji} alt="" style={{ width: 26.92, height: 26.92 }} />
            <img src={kbMic} alt="" style={{ width: 18.866, height: 28.213 }} />
          </div>
        </div>
      </div>

      <PaySheet t={t} />
    </div>
  );
}
