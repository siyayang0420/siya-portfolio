"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";

/**
 * The three factors Jeni reasons about, as the Figma cards.
 *
 * Authored in the Figma frame's own 867 × 965 space but expressed as
 * percentages of the card rather than pixels, so the row works at every
 * width the hero gives it without a resize observer. Type is sized in
 * `cqw` against the card's own container for the same reason — a fixed
 * 32px title would swamp the card at 120px wide and get lost at 280px.
 *
 * The icons deliberately do NOT use the file's per-image offsets. Measured,
 * the three assets frame their subjects completely differently — the
 * storefront fills 81% of its own height, the buildings only 40% — so
 * honouring the file made the storefront tower over the other two.
 *
 * Instead each icon is centred and given one scale. That scale normalises
 * the subject's *area*, not its height: matching heights alone left the
 * three at 0.70, 0.78 and 0.82 of the frame's width, because a wide subject
 * like the bowl and cup spreads where the storefront stacks. Equalising
 * √(w·h) puts all three within four points on both axes, which is what the
 * eye actually weighs.
 *
 * `scale` is written before `translateX` so the offset is scaled with the
 * artwork: the nudges below are the subject's measured offset from its own
 * image centre, independent of how big it ends up.
 *
 * Two of the exports have no alpha channel, so they carry an opaque
 * near-white rectangle. `mix-blend-mode: multiply` against the card's pure
 * white erases it without touching the artwork — cheaper and safer than
 * keying the background out of the file.
 *
 * The entrance is a dealt hand: each card slides in from a different edge
 * over the ones already down, which is why the z-index climbs with the
 * index. The chart then arrives a bar at a time once its card has landed.
 *
 * `prefers-reduced-motion` gets the resolved row and no reveal.
 */

/* ── Geometry, as fractions of the 867 × 965 card ─────────────────────── */

const ICON = { left: "19.146%", top: "7.979%", width: "61.822%", height: "55.544%" };
const TITLE_TOP = "9.741%";

/** The bars share a baseline and an even pitch; only the heights differ. */
const BAR_LEFT = [23.068, 29.181, 35.294, 41.522, 47.635, 53.864, 59.977, 66.09, 72.203];
const BAR_WIDTH = [4.729, 4.729, 4.844, 4.729, 4.844, 4.729, 4.729, 4.729, 4.729];
const BAR_BOTTOM = "12.435%";

const CARDS = [
  {
    id: "merchant",
    title: "Merchants’ Need",
    icon: {
      src: "/work/jeni/icon_Merchant.png",
      alt: "A storefront",
      // Subject is 0.914 × 0.811 of the frame; 0.62 / √(0.914·0.811).
      scale: 0.72,
      nudgeX: "0%",
      opaque: false,
    },
    // Rising, because the card is about need building up.
    bars: [9.637, 12.435, 15.337, 19.067, 21.969, 25.699, 27.772, 23.627, 21.969],
    curve: null,
    // From the left, and first, so everything else lands over it.
    from: "-130%",
  },
  {
    id: "diners",
    title: "Diners’ Activity",
    icon: {
      src: "/work/jeni/card-diners-icon.png",
      alt: "A bowl and a drink",
      // A 3:2 export letterboxed into a square frame leaves the subject at
      // 0.573 × 0.456 of the frame; 0.62 / √(0.573·0.456).
      scale: 1.21,
      nudgeX: "0.7%",
      opaque: true,
    },
    bars: null,
    curve: {
      src: "/work/jeni/card-diners-curve.svg",
      // The box the group occupies, then the inset that restores the SVG's
      // own 434.5 × 178 so it is never squashed.
      box: { left: "25.490%", top: "60.311%", width: "48.962%", height: "17.927%" },
      inset: "0 -1.18% -2.89% -1.18%",
    },
    // From the right, crossing over the merchant card.
    from: "130%",
  },
  {
    id: "bravo",
    title: "Bravo’s Economy",
    icon: {
      src: "/work/jeni/card-bravo-icon.png",
      alt: "Two buildings",
      // Subject is 0.522 × 0.395 of the frame; 0.62 / √(0.522·0.395).
      scale: 1.37,
      // This export sits 5.5% left of its own centre.
      nudgeX: "5.5%",
      opaque: true,
    },
    bars: [12.435, 9.637, 23.627, 19.067, 27.772, 25.699, 21.969, 15.337, 9.637],
    curve: {
      src: "/work/jeni/card-bravo-curve.svg",
      box: { left: "25.490%", top: "67.461%", width: "48.962%", height: "15.855%" },
      inset: "-3.27% -1.18%",
    },
    // Out of the middle, over both.
    from: "-100%",
  },
] as const;

const ease = [0.23, 1, 0.32, 1] as const;
/** The slide: confident, with a soft settle rather than a bounce. */
const slide = { type: "spring", stiffness: 170, damping: 20, mass: 0.9 } as const;
/** The bars: enough bounce to feel sprung, not enough to wobble. */
const pop = { type: "spring", stiffness: 420, damping: 22, mass: 0.6 } as const;

/** How long after the previous card this one is dealt. */
const DEAL = 0.18;
/** How long after its own card lands the chart starts. */
const CHART = 0.5;

export function JeniSignalVisual() {
  const ref = useRef<HTMLDivElement>(null);
  // One observer for the row, so the three cards are dealt as one sequence
  // however they happen to cross the fold.
  const seen = useInView(ref, { once: true, margin: "-40px" });

  return (
    <div className="flex h-full min-h-0 w-full max-h-[70svh] items-center justify-center">
      {/* The panel takes the whole slot, matching the cashback chapter; the
          row centres inside it. `overflow-hidden` is what makes the cards
          arrive from behind its edges rather than from open page. */}
      <div
        ref={ref}
        className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[1.75rem] p-[2.2%]"
        style={{
          background: "var(--flow-panel, rgba(255,255,255,0.3))",
          backdropFilter: "blur(8.05px)",
          WebkitBackdropFilter: "blur(8.05px)",
        }}
      >
        <div className="flex w-full gap-[2.2%]">
          {CARDS.map((card, i) => (
            <Card key={card.id} card={card} index={i} seen={seen} />
          ))}
        </div>
      </div>
    </div>
  );
}

function Card({
  card,
  index,
  seen,
}: {
  card: (typeof CARDS)[number];
  index: number;
  seen: boolean;
}) {
  const reduced = useReducedMotion();
  const on = reduced || seen;
  const dealt = index * DEAL;
  const chart = dealt + CHART;

  return (
    <motion.div
      // z climbs with the index so each card is dealt over the last.
      style={{ zIndex: index + 1 }}
      className="relative aspect-[867/965] min-w-0 flex-1 overflow-hidden rounded-[14px] bg-white shadow-[0_8px_24px_-12px_rgba(0,0,0,0.18)]"
      initial={reduced ? false : { x: card.from, opacity: 0 }}
      animate={{ x: on ? 0 : card.from, opacity: on ? 1 : 0 }}
      transition={{ ...slide, delay: dealt, opacity: { duration: 0.25, ease, delay: dealt } }}
    >
      {/* `containerType` can't live on the motion element: it would make the
          card a containment context for its own transform. */}
      <div className="absolute inset-0" style={{ containerType: "inline-size" }}>
        {/* Above the icon frame, which is where the text sits in the file —
            the icons overlap the title band and would cover it. */}
        <p
          className="absolute inset-x-0 z-10 text-center font-medium text-[#202020]"
          style={{ top: TITLE_TOP, fontSize: "3.69cqw", lineHeight: 1.25 }}
        >
          {card.title}
        </p>

        <div className="absolute" style={ICON}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={card.icon.src}
            alt={card.icon.alt}
            draggable={false}
            className="absolute inset-0 size-full object-contain"
            style={{
              transform: `scale(${card.icon.scale}) translateX(${card.icon.nudgeX})`,
              // These exports have no alpha; multiply drops their white.
              mixBlendMode: card.icon.opaque ? "multiply" : undefined,
            }}
          />
        </div>

        {card.bars && (
          <div aria-hidden="true">
            {card.bars.map((h, i) => (
              <motion.span
                key={i}
                className="absolute bg-[#4f83f7]"
                style={{
                  left: `${BAR_LEFT[i]}%`,
                  width: `${BAR_WIDTH[i]}%`,
                  height: `${h}%`,
                  bottom: BAR_BOTTOM,
                  borderRadius: "1.38cqw",
                  transformOrigin: "bottom",
                }}
                initial={reduced ? false : { scaleY: 0, opacity: 0 }}
                animate={{ scaleY: on ? 1 : 0, opacity: on ? 1 : 0 }}
                transition={{ ...pop, delay: chart + i * 0.06 }}
              />
            ))}
          </div>
        )}

        {card.curve && (
          <motion.div
            className="absolute"
            style={card.curve.box}
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: on ? 1 : 0, y: on ? 0 : 8 }}
            transition={{
              duration: 0.6,
              ease,
              // After the bars, when there are bars to wait for.
              delay: chart + (card.bars ? card.bars.length * 0.06 : 0),
            }}
          >
            <div className="absolute" style={{ inset: card.curve.inset }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={card.curve.src}
                alt=""
                draggable={false}
                className="block size-full max-w-none"
              />
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export default JeniSignalVisual;
