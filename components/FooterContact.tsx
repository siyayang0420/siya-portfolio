"use client";

import { EMAIL, useCopyEmail } from "@/components/ui/useCopyEmail";

/**
 * The footer's contact button. Was an anchor to #contact — which pointed at
 * the footer it already lives in — so it now does the same thing as the hero
 * pill: copies the address and says so.
 */
export default function FooterContact() {
  const { copied, copy } = useCopyEmail();

  return (
    <>
      <button
        type="button"
        onClick={copy}
        className="mt-3 inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-3 font-display text-sm font-medium text-black shadow-[0_1px_2px_rgba(0,0,0,0.06),0_8px_24px_-10px_rgba(0,0,0,0.25)] ring-1 ring-black/[0.06] transition hover:bg-black hover:text-white hover:ring-black"
      >
        {/* Keyed so React remounts the span and the swap animation replays. */}
        <span key={String(copied)} className="anim-swap block whitespace-nowrap">
          {copied ? "Email copied!" : "Contact me"}
        </span>
      </button>

      {/* Announced without stealing focus. */}
      <span className="sr-only" role="status" aria-live="polite">
        {copied ? `${EMAIL} copied to clipboard` : ""}
      </span>
    </>
  );
}
