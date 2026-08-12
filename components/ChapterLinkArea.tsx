"use client";

import { useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * Makes a whole chapter block behave like one big link.
 *
 * Clicking anywhere in it opens the case study, and a small "View Project"
 * pill trails the pointer while it's inside.
 *
 * Two things it deliberately does *not* do:
 *
 * · It isn't a `<Link>` wrapper. The block contains the demo's pause button,
 *   and interactive content inside an anchor is invalid HTML that browsers
 *   handle inconsistently. A click handler plus `stopPropagation` on the
 *   button is the honest version.
 * · It adds no tab stop of its own. The real "View more" anchor inside stays
 *   the keyboard and right-click path — putting `role="link"` here as well
 *   would just duplicate it in the tab order for no gain.
 */

/** Offset from the pointer, so the pill sits beside it rather than under it. */
const OFFSET_X = 16;
const OFFSET_Y = 16;

export default function ChapterLinkArea({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);

  // Motion values, not state: this updates on every pointer move and a state
  // write per move would re-render the whole chapter each time.
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  // Springs so the pill trails with a little weight instead of being welded to
  // the cursor, which reads as mechanical.
  const spring = { stiffness: 520, damping: 42, mass: 0.6 };
  const sx = useSpring(x, spring);
  const sy = useSpring(y, spring);

  const track = (e: React.MouseEvent, jump = false) => {
    const box = ref.current?.getBoundingClientRect();
    if (!box) return;
    // Offset here rather than on the element: the pill carries the padding and
    // background, so shifting it internally would just pad the label.
    const nx = e.clientX - box.left + OFFSET_X;
    const ny = e.clientY - box.top + OFFSET_Y;
    x.set(nx);
    y.set(ny);
    // On entry, snap the spring to the pointer — otherwise the pill flies in
    // from wherever it was left, across the whole block.
    if (jump) {
      sx.jump(nx);
      sy.jump(ny);
    }
  };

  return (
    <div
      ref={ref}
      className={`relative cursor-pointer ${className ?? ""}`}
      onMouseEnter={(e) => {
        track(e, true);
        setHovering(true);
      }}
      onMouseMove={(e) => track(e)}
      onMouseLeave={() => setHovering(false)}
      onClick={(e) => {
        // Anything genuinely interactive inside handles its own click.
        if ((e.target as HTMLElement).closest("a,button")) return;
        router.push(href);
      }}
    >
      {children}

      <motion.span
        aria-hidden
        // Underscores are Tailwind's escape for spaces in an arbitrary
        // variant. Without them this compiles to `@media(hover:hover)and(...)`,
        // which is invalid, so the rule never applies and the pill stays hidden.
        className="pointer-events-none absolute left-0 top-0 z-50 hidden rounded-full bg-[#4f83f7] px-3 py-1 text-[12px] leading-normal text-white whitespace-nowrap [@media(hover:hover)_and_(pointer:fine)]:block"
        style={{ x: sx, y: sy }}
        initial={false}
        animate={{
          opacity: hovering ? 1 : 0,
          // Never from scale(0) — it should look like it shrank away, not
          // like it blinked out of existence.
          scale: hovering ? 1 : 0.85,
        }}
        transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
      >
        View Project
      </motion.span>
    </div>
  );
}
