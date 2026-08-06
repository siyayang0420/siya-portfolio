/**
 * The site's pill treatment: 12/16 padding at 14px, a 1.5px white hairline
 * over a white fill, a soft drop shadow plus an inner white glow.
 *
 * Height is intrinsic — the padding sets it, so there's no fixed h- to keep in
 * sync with the font size.
 *
 * Shared verbatim by the hero's contact button and the case-study top bar so
 * the two can't drift. Anything that varies per use — width behaviour, the
 * transition property — belongs at the call site, not here.
 *
 * Hover and press fill with #4f83f7, matching the footer's contact button, so
 * every actionable pill on the site gives the same feedback. The white
 * hairline stays put — on the blue it reads as a halo rather than an outline.
 */
export const PILL =
  "inline-flex shrink-0 items-center justify-center gap-1 rounded-full border-[1.5px] border-white bg-white px-4 py-3 text-[14px] text-[#0d1e46] shadow-[0_8px_9px_rgba(0,0,0,0.05),inset_0_0_8px_rgba(255,255,255,1)] hover:bg-[#4f83f7] hover:text-white active:bg-[#4f83f7] active:text-white";
