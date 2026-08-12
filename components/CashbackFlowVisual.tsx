"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue, useReducedMotion } from "framer-motion";
import OfferCard, { BADGE_CX, CARD_W, type Variant } from "./work/cashback/OfferCard";

/**
 * The Bravo cashback story, as a looping demo.
 *
 *   the rate counts up on a magnified badge · that badge shrinks into a real
 *   offer card · the card rewrites itself a field at a time · then flashes
 *   through the other offers the same system can express
 *
 * It opens on the payoff. An earlier cut spent a third of the loop on a bill
 * rising, four questions being struck out and a "one cash back rule" line
 * before the card arrived — a long wind-up before the thing the section is
 * about.
 *
 * Authored in the Figma frame's own 601×695 space and scaled as one unit, so
 * no internal number has to be responsive.
 */

const W = 601;
const H = 695;

/**
 * Easing. The built-in CSS curves are too weak to read as intentional:
 *   · entering or leaving uses ease-out — motion starts immediately, which is
 *     what makes an interface feel responsive
 *   · moving or morphing on screen uses ease-in-out
 * Nothing uses ease-in: it withholds movement at the moment the eye is
 * watching hardest, and reads as lag.
 */
const EASE_OUT = [0.23, 1, 0.32, 1] as const;
const EASE_IN_OUT = [0.77, 0, 0.175, 1] as const;

const STEPS = [
  // Short: this is the loop's reset frame (everything snaps back with
  // duration 0 while hidden), and after a page load it is dead time.
  { id: "idle", ms: 150 },
  // The opening frame: the magnified badge, counting up.
  { id: "count", ms: 1500 },
  { id: "shrink", ms: 900 },
  { id: "flipTitle", ms: 800 },
  { id: "swapSub", ms: 850 },
  { id: "dateIn", ms: 750 },
  { id: "settle", ms: 700 },
  // The same card becoming a different offer — the point of the whole story.
  { id: "happyHour", ms: 2000 },
  { id: "threePurchases", ms: 2000 },
  { id: "spend130", ms: 2000 },
  { id: "clear", ms: 800 },
] as const;

const S = {
  IDLE: 0,
  COUNT: 1,
  SHRINK: 2,
  FLIP_TITLE: 3,
  SWAP_SUB: 4,
  DATE_IN: 5,
  SETTLE: 6,
  HAPPY_HOUR: 7,
  THREE_PURCHASES: 8,
  SPEND_130: 9,
  CLEAR: 10,
} as const;

/** The panel's centre, in the authoring space. Everything is anchored to it. */
const CENTER_X = 300.5;
const CENTER_Y = 348;

/* ── The phone ──────────────────────────────────────────────────────────── */

/**
 * The device the offer lives on: a body and a screen inset into it, both just
 * translucent white over the frosted panel. It's a suggestion of a phone rather
 * than a drawing of one — the card is what the eye should go to.
 *
 * Taller than the panel on purpose. It starts 187 down and runs 681, so the
 * bottom is cut off by the panel's `overflow-hidden` and the device reads as
 * continuing past the frame instead of floating in it.
 */
const PHONE = { top: 187, w: 359, h: 681, radius: 47 };
/** Inset into the body, so the two are drawn as one unit that moves together. */
const SCREEN = { dx: 11, dy: 12, w: 337, h: 640, radius: 40 };
/**
 * Far enough down to clear the panel's bottom edge: the body's top sits at 187
 * in a 695-tall frame, so 520 puts the whole device outside the clip. It's
 * hidden by being off-frame, not by opacity — a phone that fades in place
 * would look like it was always there.
 */
const PHONE_DOWN = 520;

/* ── The card ───────────────────────────────────────────────────────────── */

/** Base card height for the opening variant — sets the zoom pivot. */
const CARD_H = 153.109;
const CARD_LEFT = CENTER_X - CARD_W / 2;
/**
 * The card rests below the panel's centre, which is where it sits on the
 * phone's screen in the design — not centred in the frame.
 */
const CARD_CY = 398.65;

/**
 * The zoom pivots on the badge, so the badge stays put while the card grows
 * around it. These offsets carry the badge centre to the panel centre; without
 * them the magnified badge would sit far off to the left, and low.
 */
const ZOOM_X = CENTER_X - (CARD_LEFT + BADGE_CX);
const ZOOM_Y = CENTER_Y - (CARD_CY - CARD_H / 2 + BADGE_CX);
/** How far in the card starts, before shrinking to its natural size. */
const Z_NEAR = 2.4;

/**
 * The opening variant rewrites itself field by field, so its copy is derived
 * from the step rather than fixed. The card sees only the current strings and
 * morphs to them — it doesn't know a "flip" or a "swap" is happening.
 */
function baseVariant(s: number): Variant {
  return {
    title: s >= S.FLIP_TITLE ? "Every purchase" : "First purchase",
    sub: s >= S.SWAP_SUB ? "Up to $10 back" : "All in-store purchase",
    meta: "date",
    action: "more",
    minSpend: true,
  };
}

/**
 * Everything else the same engine can express.
 *
 * Parked, not deleted: these five played as quick cuts after the card settled,
 * and the story is built to morph straight into them. Re-adding is a matter of
 * putting the flash steps back on the timeline and picking the variant by
 * index. Kept here so that work isn't lost.
 */

const FLASHES: Variant[] = [
  { title: "Happy hour", sub: "Up to $10 back", meta: "happy-hour", action: "more", minSpend: true },
  {
    title: "Every 3 purchases",
    sub: "Up to $10 back",
    meta: "date",
    action: "more",
    minSpend: true,
    progress: { segments: 3, filled: 1, label: "$6.5 pending" },
  },
  {
    title: "Every $130 spent",
    sub: "Up to $30 back",
    meta: "date",
    action: "more",
    minSpend: true,
    progress: { ratio: 0.577, label: "$75/$130" },
  },
  {
    title: "Every 3 purchases",
    sub: "Up to $10 back",
    meta: "date",
    action: "view",
    minSpend: true,
    progress: { segments: 3, filled: 1, label: "$6.5 Pending" },
    merchants: { chips: 2, extra: 2 },
  },
  {
    title: "Every $130 spent",
    sub: "Up to $30 back",
    meta: "date",
    action: "view",
    progress: { ratio: 0.577, label: "$75/$130" },
    merchants: { chips: 1 },
  },
];

/* ── Live rate counter ──────────────────────────────────────────────────── */

function RateCounter({ step }: { step: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const v = useMotionValue(8);

  useEffect(() => {
    const write = (n: number) => {
      if (ref.current) ref.current.textContent = `${Math.round(n)}%`;
    };
    write(v.get());
    return v.on("change", write);
  }, [v]);

  useEffect(() => {
    if (step < S.COUNT) {
      v.set(8);
      return;
    }
    if (step > S.COUNT) {
      v.set(20);
      return;
    }
    const controls = animate(v, 20, { duration: 1.25, ease: EASE_OUT });
    return () => controls.stop();
  }, [step, v]);

  return <span ref={ref} />;
}

/* ───────────────────────────────────────────────────────────────────────── */

export default function CashbackFlowVisual() {
  const reduced = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState<number>(0);
  const [onScreen, setOnScreen] = useState(true);
  const [paused, setPaused] = useState(false);

  /**
   * Framer only server-renders an explicit `initial`; everything here is driven
   * from `animate`, which is applied on mount. So the server would otherwise
   * ship each element with no opacity and no transform — every scene visible at
   * once, piled up, until hydration. Holding the artwork back until mount makes
   * the served frame an empty panel, which is exactly what step 0 looks like.
   */
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting), {
      rootMargin: "80px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (reduced || !onScreen || paused) return;
    const id = setTimeout(() => setStep((n) => (n + 1) % STEPS.length), STEPS[step].ms);
    return () => clearTimeout(id);
  }, [step, reduced, onScreen, paused]);

  // Reduced motion gets a resolved frame, never the loop.
  const s = reduced ? S.SETTLE : step;

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
  }, []);

  const snap = s === S.IDLE;

  const cardOn = s >= S.COUNT && s < S.CLEAR;
  /**
   * The card's pose, not a scene flag. It holds the magnified pose before it
   * appears as well as during the count, so it fades in already zoomed —
   * otherwise it animates *into* the zoom and straight back out, which reads
   * as the same frame twice.
   */
  const zoomPose = s <= S.COUNT;

  /**
   * The phone is absent for the opening close-up and rises as the card shrinks
   * — arriving with the card rather than waiting for it. It drops away again on
   * CLEAR so the loop restarts on the same bare panel it opened with.
   */
  const phoneUp = s >= S.SHRINK && s < S.CLEAR;

  /**
   * The offers the same engine expresses, in the order the story shows them.
   *
   * The last one is held through CLEAR as well: the card is still fading out
   * there, and reverting to the opening variant mid-fade made it visibly
   * rewrite itself back to the first offer on the way off screen.
   */
  const variant =
    s === S.HAPPY_HOUR
      ? FLASHES[0]
      : s === S.THREE_PURCHASES
        ? FLASHES[1]
        : s >= S.SPEND_130
          ? FLASHES[2]
          : baseVariant(s);

  return (
    // Two boxes because the two mount points size differently and one element
    // can only carry one max-height.
    //
    // Outer: never taller than the slot it was given, and never more than
    // 70svh — that pair is what stops the panel running past the fold and
    // being clipped by the hero's overflow.
    //
    // Inner: fills the outer. Where the outer has a real height (the desktop
    // hero) both axes are definite and the ratio is ignored, so the panel
    // simply fills its slot. Where it doesn't (the stacked mobile hero) the
    // height resolves to auto and the ratio supplies one, instead of the panel
    // collapsing to nothing.
    // `min-h-0` matters: as a flex item this defaults to `min-height: auto`,
    // which floors it at the aspect-ratio box's intrinsic height. That floor is
    // what pushed the hero's own slot past the fold and got the panel clipped.
    <div className="flex h-full min-h-0 w-full max-h-[70svh] items-center justify-center">
      <div
        ref={wrapRef}
        className="relative h-full max-h-full w-full"
        style={{ aspectRatio: `${W} / ${H}` }}
      >
      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          borderRadius: 37 * scale,
          background: "rgba(255,255,255,0.3)",
          backdropFilter: "blur(8.05px)",
          WebkitBackdropFilter: "blur(8.05px)",
        }}
      >
        {/* Client-only — see `ready`. The frosted panel above stays server
            rendered so the box and its layout are stable with no shift. */}
        {ready && (
        <div
          className="absolute left-1/2 top-1/2 text-[#202020]"
          style={{ width: W, height: H, transform: `translate(-50%, -50%) scale(${scale})` }}
        >
          {/* ── The phone ────────────────────────────────────────────────── */}
          {/* First in source order, so it is always behind the card.
              `left` is a number, not a -translate-x-1/2 class: Framer writes
              its own `transform` for y, which would overwrite the class and
              throw the phone off-centre the moment it moved. */}
          <motion.div
            aria-hidden
            className="absolute"
            style={{
              left: CENTER_X - PHONE.w / 2,
              top: PHONE.top,
              width: PHONE.w,
              height: PHONE.h,
              borderRadius: PHONE.radius,
              background: "rgba(255,255,255,0.45)",
            }}
            // Rises on the same beat as the card pulls back, so the two read as
            // one move: the camera backing off to reveal where the offer lives.
            animate={{ y: phoneUp ? 0 : PHONE_DOWN }}
            transition={
              snap
                ? { duration: 0 }
                : { duration: s === S.SHRINK ? 0.78 : 0.5, ease: EASE_IN_OUT }
            }
          >
            <div
              className="absolute"
              style={{
                left: SCREEN.dx,
                top: SCREEN.dy,
                width: SCREEN.w,
                height: SCREEN.h,
                borderRadius: SCREEN.radius,
                background: "rgba(255,255,255,0.5)",
              }}
            />
          </motion.div>

          {/* ── The offer card ───────────────────────────────────────────── */}
          <div
            className="absolute -translate-y-1/2"
            style={{ left: CARD_LEFT, top: CARD_CY, width: CARD_W }}
          >
            <motion.div
              // Pivots on the badge, so the badge holds still while the card
              // grows and shrinks around it.
              style={{ transformOrigin: `${BADGE_CX}px ${BADGE_CX}px` }}
              animate={{
                scale: zoomPose ? Z_NEAR : 1,
                x: zoomPose ? ZOOM_X : 0,
                y: zoomPose ? ZOOM_Y : 0,
                opacity: cardOn ? 1 : 0,
              }}
              transition={
                snap
                  ? { duration: 0 }
                  : {
                      // The shrink is the hero move — long enough to follow,
                      // in-out because it's travelling across the frame.
                      duration: s === S.SHRINK ? 0.78 : 0.5,
                      ease: s === S.SHRINK ? EASE_IN_OUT : EASE_OUT,
                      opacity: { duration: 0.3 },
                    }
              }
            >
              <OfferCard
                // Deliberately *not* keyed per variant. One persistent card
                // morphs between states — a new card per flash would make each
                // cut an instant swap and reset the rate counter mid-story.
                variant={variant}
                rate={<RateCounter step={s} />}
                showMinSpend={s >= S.SWAP_SUB}
                showMeta={s >= S.DATE_IN}
                // The title rolls up, except into the third offer where it
                // crossfades in place. The subtitle slides sideways on the one
                // beat where that was asked for, and rolls otherwise.
                titleMode={s === S.THREE_PURCHASES || s === S.SPEND_130 ? "fade" : "up"}
                subMode={s === S.SWAP_SUB ? "side" : "up"}
                // The date drops in from below the first time; when it comes
                // back after the happy-hour block it arrives from the left.
                metaEnter={s === S.THREE_PURCHASES ? "left" : "bottom"}
              />
            </motion.div>
          </div>
        </div>
        )}
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
              <path
                d="M1 1.6a1 1 0 0 1 1.53-.85l10 6.4a1 1 0 0 1 0 1.7l-10 6.4A1 1 0 0 1 1 14.4V1.6Z"
                fill="currentColor"
              />
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
