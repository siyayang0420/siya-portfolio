"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";

const EMAIL = "siya.yang.design@gmail.com";

/**
 * Name block and contact pill that sit across the top of the hero's left rail.
 * Built to the Figma spec (28px name, 16px sub-lines, 1.5px white pill).
 */
export default function Intro() {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
    } catch {
      // navigator.clipboard needs a secure context; fall back to a scratch node.
      const scratch = document.createElement("textarea");
      scratch.value = EMAIL;
      scratch.setAttribute("readonly", "");
      scratch.style.position = "fixed";
      scratch.style.opacity = "0";
      document.body.appendChild(scratch);
      scratch.select();
      document.execCommand("copy");
      document.body.removeChild(scratch);
    }

    setCopied(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1">
          <p className="font-display text-[28px] uppercase leading-[1.2] text-white">
            Siya Yang
          </p>
          <ArrowUpRight className="size-6 text-white" strokeWidth={1.75} />
        </div>
        <div className="text-[16px] leading-[1.2] text-white">
          <p>Product Designer / UI UX Designer</p>
          {/* <p>Designing AI, fintech, and complex product systems.</p> */}
        </div>
      </div>

      <button
        type="button"
        onClick={copy}
        // 139×44 at rest, straight from the Figma frame. Both widths are
        // explicit so the swap to the longer label animates instead of jumping.
        // px-[22px] not the spec's 24px: Plus Jakarta renders "Contact me" ~2px
        // wider here than in Figma, and the 139px outer is what has to match.
        className="flex h-11 shrink-0 items-center justify-center rounded-full border-[1.5px] border-white bg-[#eae9e9] px-[22px] text-[16px] text-[#0d1e46] shadow-[0_8px_9px_rgba(0,0,0,0.05),inset_0_0_8px_rgba(255,255,255,1)] transition-[width,transform] duration-300 hover:brightness-105"
        // Inline rather than two Tailwind width classes — same utility, same
        // specificity, so whichever landed later in the sheet always won and
        // the width never actually changed.
        style={{
          width: copied ? 168 : 139,
          transform: copied ? "scale(1.03)" : "scale(1)",
        }}
      >
        {/* Keyed so React remounts the span and the swap animation replays. */}
        <span key={String(copied)} className="anim-swap block whitespace-nowrap">
          {copied ? "Copied Email!" : "Contact me"}
        </span>
      </button>

      {/* Announced without stealing focus. */}
      <span className="sr-only" role="status" aria-live="polite">
        {copied ? `${EMAIL} copied to clipboard` : ""}
      </span>
    </div>
  );
}
