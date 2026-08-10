"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * A value that changes in place rather than being replaced.
 *
 * An invisible copy of the current text holds the box open, so the animating
 * copies can be absolutely positioned without collapsing the layout. Width
 * changes are then picked up by the `layout` props on the ancestors, which is
 * what lets the card resize as one object instead of snapping between states.
 *
 * `mode` picks the gesture: "up" rolls the old line out the top, "side" sends
 * it out to the left while the new one arrives from the right.
 */
export function MorphText({
  text,
  mode = "up",
  className,
  style,
}: {
  text: string;
  mode?: "up" | "side" | "fade";
  className?: string;
  style?: React.CSSProperties;
}) {
  // "fade" holds position and lets opacity and blur do the whole handover.
  const out =
    mode === "up" ? { y: "-100%", x: 0 } : mode === "side" ? { y: 0, x: -160 } : { y: 0, x: 0 };
  const inFrom =
    mode === "up" ? { y: "100%", x: 0 } : mode === "side" ? { y: 0, x: 160 } : { y: 0, x: 0 };

  return (
    <span className={`relative block ${className ?? ""}`} style={style}>
      <span className="invisible block whitespace-nowrap" aria-hidden>
        {text}
      </span>
      <AnimatePresence initial={false}>
        <motion.span
          key={text}
          className="absolute left-0 top-0 block whitespace-nowrap"
          initial={{ opacity: 0, filter: "blur(4px)", ...inFrom }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0, x: 0 }}
          exit={{ opacity: 0, filter: "blur(4px)", ...out }}
          transition={{ duration: 0.42, ease: EASE_OUT }}
        >
          {text}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/**
 * The Bravo "Offer item" card, drawn to the Figma spec.
 *
 * Sizes are literals from the frame — 523 wide, 24.255 padding, a 66.701
 * badge. They look arbitrary because the frame was authored at a fractional
 * scale; rounding them would drift the layout, and the whole composition is
 * scaled as one unit anyway, so they stay verbatim.
 *
 * The card is also the animation's subject: it starts magnified on its badge
 * and shrinks into place, then swaps its own content a piece at a time. So the
 * parts that animate individually (title, subtitle, min-spend, date) take
 * their motion from props rather than owning it.
 */

export const CARD_W = 523;
export const CARD_PAD = 24.255;
export const BADGE_SIZE = 66.701;
/** Badge centre in card-local space — the anchor the zoom pivots around. */
export const BADGE_CX = CARD_PAD + BADGE_SIZE / 2;
/** Corner softness. Doubled from the frame's 15 — a deliberate departure. */
export const CARD_RADIUS = 30;

/**
 * The badge carries two sets of proportions.
 *
 * As part of the card it's a small 66.7 tile. Magnified at the top of the
 * story it *is* the frame, and the hero design gives it a much softer corner
 * and proportionally smaller numerals. Both are expressed in card-local units
 * so they can be interpolated — the badge morphs between the two as the card
 * zooms, rather than two different badges being swapped.
 */
export type BadgeStyle = { radius: number; rate: number; back: number };

export const CARD_BADGE: BadgeStyle = { radius: 10, rate: 24.26, back: 15.16 };
/** Divided by the 3.84× zoom, so it renders at the hero frame's 56/64/48. */
export const HERO_BADGE: BadgeStyle = { radius: 14.58, rate: 16.67, back: 12.5 };

const EASE_OUT = [0.23, 1, 0.32, 1] as const;
/** Firm settle with just enough bounce to read as weight landing. */
const SNAP = { type: "spring" as const, duration: 0.55, bounce: 0.28 };

/** Footer heights: one line of date, or the two-line happy-hour block. */
const META_SHORT = 19.707;
const META_TALL = 44;

/** Progress row: the 9px bars, a 3px gap, and a 21px label line. */
const PROGRESS_H = 9 + 3 + 21;

export type Variant = {
  title: string;
  sub: string;
  /** Bottom-left slot. */
  meta?: "date" | "happy-hour";
  /** Bottom-right slot. */
  action?: "more" | "view" | "chevron";
  /** Either a segmented counter or a continuous bar. */
  progress?: { segments?: number; filled?: number; ratio?: number; label: string };
  minSpend?: boolean;
  /** Renders the "Eligible merchants" strip with this many placeholder chips. */
  merchants?: { chips: number; extra?: number };
};

function ClockIcon({ size = 18.191 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="10.5" stroke="#282828" strokeWidth="1.7" />
      <path d="M12 6.5V12l3.5 2" stroke="#282828" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function CalendarIcon({ size = 18.191 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="5" width="18" height="16" rx="3" stroke="#282828" strokeWidth="1.7" />
      <path d="M3 10h18M8 3v4M16 3v4" stroke="#282828" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function Chevron({ size = 18.191 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M9 5l7 7-7 7"
        stroke="#8e8e93"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function OfferCard({
  variant,
  rate,
  titleMode = "up",
  subMode = "up",
  metaEnter = "bottom",
  showMinSpend,
  showMeta,
  chrome = 1,
  badge = CARD_BADGE,
}: {
  variant: Variant;
  /** The badge number — a live node during the count-up. */
  rate: ReactNode;
  /** Which gesture each line uses when its text changes. */
  titleMode?: "up" | "side" | "fade";
  subMode?: "up" | "side" | "fade";
  /** Where the date row comes in from. */
  metaEnter?: "bottom" | "left";
  showMinSpend: boolean;
  showMeta: boolean;
  /**
   * How much of the card *around* the badge is visible, 0–1. At full zoom the
   * opening frame is the badge alone, so the paper and its copy fade in only
   * as the card pulls back and becomes legible as a card.
   */
  chrome?: number;
  /** Which set of badge proportions to render — see BadgeStyle. */
  badge?: BadgeStyle;
}) {
  const p = variant.progress;

  return (
    <motion.div
      // Deliberately no `layout` here. Framer measures layout boxes in screen
      // space, so while an ancestor is animating `scale` it computes the delta
      // against a box that is itself mid-transform — which showed up as a
      // second, slightly-smaller ghost of the card. The blocks below animate
      // their own height instead, which needs no measurement.
      className="relative flex flex-col items-end"
      style={{
        width: CARD_W,
        gap: 18.191,
        padding: CARD_PAD,
        borderRadius: CARD_RADIUS,
        fontFamily: "var(--font-dm-sans), sans-serif",
      }}
      animate={{
        backgroundColor: `rgba(255,255,255,${chrome})`,
        filter: chrome > 0.5 ? "drop-shadow(0 0 6.064px rgba(0,0,0,0.1))" : "none",
      }}
      transition={{ duration: 0.4, ease: EASE_OUT }}
    >
      <div className="flex w-full items-start" style={{ gap: 18.191 }}>
        {/* Rate badge — the element the whole scene zooms around. */}
        <motion.div
          className="flex shrink-0 flex-col items-center justify-center bg-[#202020]"
          // Base values live in `style` so Framer has a defined starting point.
          // Animating them from nothing makes it read the computed value —
          // 0 radius, inherited font size — and morph up from that.
          style={{ width: BADGE_SIZE, height: BADGE_SIZE, borderRadius: badge.radius }}
          animate={{ borderRadius: badge.radius }}
          transition={{ duration: 0.6, ease: EASE_OUT }}
        >
          <motion.span
            className="font-bold text-white"
            style={{ fontSize: badge.rate, lineHeight: 1.312, marginBottom: badge.rate * -0.187 }}
            animate={{ fontSize: badge.rate, marginBottom: badge.rate * -0.187 }}
            transition={{ duration: 0.6, ease: EASE_OUT }}
          >
            {rate}
          </motion.span>
          <motion.span
            className="text-white"
            style={{ fontSize: badge.back, lineHeight: 1.3 }}
            animate={{ fontSize: badge.back }}
            transition={{ duration: 0.6, ease: EASE_OUT }}
          >
            back
          </motion.span>
        </motion.div>

        <motion.div
          className="flex min-w-0 flex-1 flex-col"
          style={{ gap: 6.064 }}
          animate={{ opacity: chrome }}
          transition={{ duration: 0.4, ease: EASE_OUT }}
        >
          <div style={{ height: 31.835 }} className="relative overflow-hidden">
            <p
              className="font-bold text-[#202020]"
              style={{ fontSize: 24.26, lineHeight: "31.835px" }}
            >
              <MorphText text={variant.title} mode={titleMode} />
            </p>
          </div>
          <div className="relative" style={{ height: 28.803 }}>
            <p className="text-[#202020]" style={{ fontSize: 21.22, lineHeight: "28.803px" }}>
              <MorphText text={variant.sub} mode={subMode} />
            </p>
          </div>

          {/* Grows and shrinks the card rather than popping — `layout` on the
              ancestors turns the height change into a move. */}
          <AnimatePresence initial={false}>
            {p && (
              <motion.div
                className="flex flex-col overflow-hidden"
                style={{ gap: 3 }}
                // Slides in from the right while the row's height opens, so
                // the card's lower edge extends with it instead of the bars
                // appearing into a box that has already grown.
                //
                // An explicit height, not `auto`: measuring "auto" mid-flight
                // while the row is also translating produced a visible hitch
                // on the first frames. PROGRESS_H is the row's real height.
                initial={{ opacity: 0, height: 0, marginTop: 0, x: 70 }}
                animate={{ opacity: 1, height: PROGRESS_H, marginTop: 4, x: 0 }}
                exit={{ opacity: 0, height: 0, marginTop: 0, x: 70 }}
                transition={{ duration: 0.5, ease: EASE_OUT }}
              >
                {/* Segmented and continuous bars occupy the same 9px slot and
                    are overlaid, so switching between them slides rather than
                    swapping in place — the row never changes height. */}
                <span className="relative block w-full" style={{ height: 9 }}>
                  <AnimatePresence initial={false}>
                    <motion.span
                      key={p.segments ? "segments" : "bar"}
                      className="absolute inset-0 block"
                      initial={{ opacity: 0, x: 70 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -70 }}
                      transition={{ duration: 0.46, ease: EASE_OUT }}
                    >
                      {p.segments ? (
                        <span className="flex h-full w-full" style={{ gap: 6 }}>
                          {Array.from({ length: p.segments }).map((_, i) => (
                            <span
                              key={i}
                              className="block flex-1"
                              style={{
                                borderRadius: 6,
                                background: i < (p.filled ?? 0) ? "#202020" : "#e5e5ea",
                              }}
                            />
                          ))}
                        </span>
                      ) : (
                        <span
                          className="relative block h-full w-full overflow-hidden"
                          style={{ borderRadius: 6, background: "#e5e5ea" }}
                        >
                          {/* Fills from empty, so the amount reads as progress
                              being made rather than a bar that arrives full. */}
                          <motion.span
                            className="block h-full"
                            style={{ borderRadius: 6, background: "#202020" }}
                            initial={{ width: "0%" }}
                            animate={{ width: `${(p.ratio ?? 0) * 100}%` }}
                            transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.15 }}
                          />
                        </span>
                      )}
                    </motion.span>
                  </AnimatePresence>
                </span>
                <p className="text-[#8e8e93]" style={{ fontSize: 16, lineHeight: "21px" }}>
                  <MorphText text={p.label} />
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Footer rail. Its height is animated rather than left to the content,
          which is what makes the card's lower edge extend smoothly when the
          single-line date gives way to the two-line happy-hour block. */}
      <motion.div
        // items-end so the action keeps to the card's lower edge when the meta
        // block is two lines tall, rather than riding up beside the first line.
        className="relative flex w-full items-end"
        animate={{
          opacity: chrome,
          height: variant.meta === "happy-hour" ? META_TALL : META_SHORT,
        }}
        style={{ height: META_SHORT }}
        transition={{ duration: 0.5, ease: EASE_OUT, opacity: { duration: 0.4 } }}
      >
        {/* AnimatePresence stays mounted with no children rather than being
            wrapped in the guard. Inside the guard it mounts *with* the date
            already present, and `initial={false}` suppresses that first enter —
            which made the date appear instead of sliding up. */}
        <AnimatePresence initial={false}>
          {showMeta && variant.meta && (
            <motion.span
              // Keyed on the kind, so the two blocks genuinely hand over.
              key={variant.meta}
              className="absolute left-0 top-0 flex items-start"
              style={{ gap: 12, transformOrigin: "top left" }}
              // The date rises from below the card, or slides in from the left
              // when it's replacing another meta block; the happy-hour block
              // squeezes in from a compressed state.
              initial={
                variant.meta === "date"
                  ? metaEnter === "left"
                    ? { x: -60, y: 0, opacity: 0 }
                    : { y: 44, x: 0, opacity: 0 }
                  : { opacity: 0, scaleY: 0.55, y: -4 }
              }
              animate={{ y: 0, x: 0, opacity: 1, scaleY: 1 }}
              // The date leaves to the left; anything else compresses away.
              exit={{ opacity: 0, x: -46, scaleY: 0.9 }}
              transition={
                variant.meta === "date" && metaEnter === "bottom"
                  ? SNAP
                  : { duration: 0.46, ease: EASE_OUT }
              }
            >
              {variant.meta === "date" ? (
                <>
                  <ClockIcon />
                  <span className="text-[#282828]" style={{ fontSize: 15.16 }}>
                    Ends on May 29th
                  </span>
                </>
              ) : (
                <span className="flex flex-col" style={{ gap: 2 }}>
                  <span className="flex items-center" style={{ gap: 8 }}>
                    <CalendarIcon size={16} />
                    <span className="text-[#282828]" style={{ fontSize: 16 }}>
                      Monday
                    </span>
                  </span>
                  <span className="flex items-center" style={{ gap: 8 }}>
                    <ClockIcon size={16} />
                    <span className="text-[#282828]" style={{ fontSize: 16 }}>
                      4:30 PM
                    </span>
                    <span className="text-[#8e8e93]">---</span>
                    <ClockIcon size={16} />
                    <span className="text-[#282828]" style={{ fontSize: 16 }}>
                      7:30 PM
                    </span>
                  </span>
                </span>
              )}
            </motion.span>
          )}
        </AnimatePresence>

        <span className="ml-auto flex items-center" style={{ gap: 6.064 }}>
          {variant.action !== "chevron" && (
            <span className="text-[#8e8e93]" style={{ fontSize: 15.16 }}>
              <MorphText text={variant.action === "view" ? "View details" : "More details"} />
            </span>
          )}
          <Chevron />
        </span>
      </motion.div>

      {/* Eligible merchants strip, on the variants that carry one. It grows
          the card open rather than appearing on top of it. */}
      <AnimatePresence initial={false}>
        {variant.merchants && (
          <motion.div
            className="flex w-full items-center justify-between overflow-hidden border-t border-black/[0.06]"
            initial={{ opacity: 0, height: 0, paddingTop: 0 }}
            animate={{ opacity: 1, height: "auto", paddingTop: 18 }}
            exit={{ opacity: 0, height: 0, paddingTop: 0 }}
            transition={{ duration: 0.42, ease: EASE_OUT }}
          >
          <span className="text-[#282828]" style={{ fontSize: 16 }}>
            Eligible merchants:
          </span>
          <span className="flex items-center" style={{ gap: 8 }}>
            {Array.from({ length: variant.merchants.chips }).map((_, i) => (
              // Neutral stand-ins: the real marks are third-party brands.
              <span
                key={i}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: i % 2 === 0 ? "#202020" : "#ece9e0",
                }}
              />
            ))}
            {variant.merchants.extra ? (
              <span className="text-[#282828]" style={{ fontSize: 16 }}>
                +{variant.merchants.extra}
              </span>
            ) : null}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Flush to the card's top-right corner, sharing its radius. */}
      {showMinSpend && variant.minSpend && (
        <motion.div
          className="absolute right-0 top-0 flex items-center justify-center bg-[#f8f8f8]"
          style={{
            paddingInline: 12.128,
            paddingBlock: 9.096,
            borderBottomLeftRadius: CARD_RADIUS,
            // Matches the card so it stays flush in the corner.
            borderTopRightRadius: CARD_RADIUS,
          }}
          // Falls in from above and snaps to the corner.
          initial={{ y: -70, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={SNAP}
        >
          <span className="text-black" style={{ fontSize: 15.16 }}>
            Min spend $10
          </span>
        </motion.div>
      )}
    </motion.div>
  );
}

export { EASE_OUT };
