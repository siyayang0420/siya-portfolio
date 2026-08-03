"use client";

import { useEffect, useRef } from "react";

const HEADLINE = "I believe every product shapes the people who use it.";

const BODY = [
  "People rarely use products only for what they say they want. They use them for how those products make them feel about themselves.",
  "The best products don’t just solve problems. They reshape motivation. They make new behaviors feel natural, rewarding, and worth repeating.",
  "That’s why I don’t just ask whether a feature works. I ask:",
  "Who does this encourage people to become?",
];

/**
 * How much of the whole sweep one word takes to fade in. At ~70 words the
 * starts are ~0.014 apart, so 0.08 keeps roughly six words in transition at
 * any moment — enough to read as one soft edge moving through the sentence,
 * not so many that the whole passage is half-lit at once.
 *
 * Must stay in sync with the divisor in `.ethos-word` in globals.css.
 */
const WORD_SPAN = 0.08;

const headWords = HEADLINE.split(" ");
const bodyBlocks = BODY.map((b) => b.split(" "));
const TOTAL =
  headWords.length + bodyBlocks.reduce((n, b) => n + b.length, 0);

/**
 * Where each paragraph begins in the global word order. The fill has to sweep
 * continuously across the whole passage, so every block needs to know how many
 * words came before it rather than restarting from zero.
 */
const blockOffsets = bodyBlocks.reduce<number[]>((acc, block, i) => {
  acc.push(i === 0 ? headWords.length : acc[i - 1] + bodyBlocks[i - 1].length);
  return acc;
}, []);

/** Progress at which word `i` starts filling; the last one completes at p = 1. */
const startFor = (i: number) => (i / (TOTAL - 1)) * (1 - WORD_SPAN);

function Words({ words, offset }: { words: string[]; offset: number }) {
  return (
    <>
      {words.map((w, i) => (
        <span
          key={`${i}-${w}`}
          className="ethos-word"
          style={{ "--s": startFor(offset + i) } as React.CSSProperties}
        >
          {w}{" "}
        </span>
      ))}
    </>
  );
}

/**
 * The quiet panel that stacks over the pinned hero.
 *
 * The copy starts unfilled and paints in with the brand blue as you scroll.
 * One `--p` is written to the container per frame; each word derives its own
 * fill from that in CSS, so there are no per-word DOM writes.
 */
export default function Ethos() {
  const copyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const copy = copyRef.current;
    if (!copy) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      copy.style.setProperty("--p", "1");
      return;
    }

    let frame = 0;

    const measure = () => {
      frame = 0;
      const vh = window.innerHeight;
      const r = copy.getBoundingClientRect();

      // Fills as the copy rises past 90% of the viewport, completing once it
      // has travelled a little more than its own height upward.
      const from = vh * 0.9;
      const travel = vh * 0.55 + r.height * 0.6;
      const p = Math.min(Math.max((from - r.top) / travel, 0), 1);

      copy.style.setProperty("--p", p.toFixed(4));
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    // Rides up over the pinned hero: -100vh pulls it into the hero's runway,
    // z-10 keeps it above the sticky frame.
    <section
      id="ethos"
      // -mt-12 (48px) clears the 40px corner radius, so on mobile the rounded
      // top sits over the hero and reveals its gradient rather than the page's
      // grey. Desktop pulls a whole viewport instead, to stack over the pin.
      className="relative z-10 -mt-12 rounded-t-[2.5rem] bg-white px-3 pt-3 shadow-[0_-40px_80px_-24px_rgba(0,0,0,0.5)] lg:-mt-[100vh]"
    >
      {/* No ground of its own — the section's white shows through, so this
          reads as one continuous sheet with Features below. Runs flush to the
          bottom edge so the hairline into Features still cuts the panel. */}
      <div className="relative overflow-hidden rounded-t-[2rem]">
        <div
          ref={copyRef}
          className="ethos-copy relative flex min-h-screen flex-col justify-center px-8 py-32 sm:px-14 lg:px-20"
        >
          <h2 className="max-w-[18ch] font-display text-[clamp(2rem,4.4vw,3.5rem)] font-medium leading-[1.08] tracking-[-0.025em]">
            <Words words={headWords} offset={0} />
          </h2>

          <div className="mt-8 flex max-w-[55ch] flex-col gap-6 text-[clamp(1rem,1.5vw,1.25rem)] leading-relaxed">
            {bodyBlocks.map((words, i) => (
              <p
                key={i}
                // The closing question is the payoff the line above sets up
                // with its colon, so it carries a little more weight.
                className={i === bodyBlocks.length - 1 ? "font-medium" : undefined}
              >
                <Words words={words} offset={blockOffsets[i]} />
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
