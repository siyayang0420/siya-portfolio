/**
 * The site's pill treatment, taken verbatim from the footer's "Contact me"
 * button so every actionable pill reads as the same object: white fill, a
 * black hairline ring, a tight contact shadow under a wide soft one, and an
 * inner white glow along the top edge.
 *
 * Height is intrinsic — the padding sets it, so there's no fixed h- to keep in
 * sync with the font size.
 *
 * The ring replaces what used to be a white border. A white hairline on a white
 * fill only reads against a coloured ground; the ring seats the pill on any
 * background, and it takes the accent on hover so the outline fills with the
 * button rather than staying behind as a halo.
 *
 * Anything that varies per use — width behaviour, the transition property —
 * belongs at the call site, not here.
 */
export const PILL =
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-white px-5 py-3 font-display text-sm font-medium text-black shadow-[0_1px_2px_rgba(0,0,0,0.06),0_8px_24px_-10px_rgba(0,0,0,0.25),inset_0_0_8px_-1px_#fff] ring-1 ring-black/[0.06] transition hover:bg-[#4f83f7] hover:text-white hover:ring-[#4f83f7] active:bg-[#4f83f7] active:text-white active:ring-[#4f83f7]";
