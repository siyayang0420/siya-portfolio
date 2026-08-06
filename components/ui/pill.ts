/**
 * The site's pill treatment, from the Figma "Contact me" frame: 44px tall,
 * 1.5px white hairline over #eae9e9, a soft drop shadow plus an inner white
 * glow, and a brightness lift on hover.
 *
 * Shared verbatim by the hero's contact button and the case-study top bar so
 * the two can't drift. Anything that varies per use — width behaviour, the
 * transition property, gaps for an icon — belongs at the call site, not here.
 */
export const PILL =
  "flex h-11 shrink-0 items-center justify-center rounded-full border-[1.5px] border-white bg-[#eae9e9] px-[22px] text-[16px] text-[#0d1e46] shadow-[0_8px_9px_rgba(0,0,0,0.05),inset_0_0_8px_rgba(255,255,255,1)] hover:brightness-105";
