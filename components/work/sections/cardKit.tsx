import type { LucideIcon } from 'lucide-react';

/**
 * The shared card vocabulary for the Bravo case study.
 *
 * Two sections use it — the Decision act's cut/keep/rebuild calls and the
 * Problem act's four stakeholders — and both are the same shape of argument:
 * a glyph naming the facet, then one paragraph of reasoning. Keeping the
 * surface and the heading here rather than duplicating them means the two
 * cannot drift apart, which is exactly how the stakeholder cards ended up in
 * a different visual language in the first place.
 */

/**
 * Size and weight only — tracking and leading are deliberately absent.
 *
 * The page wrapper sets `[&_p]:tracking-[0.02em] [&_p]:leading-[1.55]`, and a
 * descendant selector outranks a utility class, so the `tracking-[-0.28px]`
 * these constants used to carry never applied to a paragraph — it rendered as
 * *+0.28px*, the opposite value. Worse, it did apply to a `<div>`, so the same
 * constant set two different ways depending on the tag it landed on.
 *
 * One owner now: the wrapper sets tracking and leading for all prose, and these
 * say nothing about either.
 */

/** Figma: white, 12px radius, 24px padding. */
export const CARD = 'bg-white rounded-xl p-6';
/** Figma: 16px medium. Card and figure titles, and any label-weight line. */
export const TITLE = 'text-[16px] font-medium text-ink';
/** Figma: 14px regular. Card body copy. */
export const BODY = 'text-[14px] text-ink';

export function Heading({
  Icon,
  children,
}: {
  Icon: LucideIcon;
  children: string;
}) {
  return (
    // `items-end` so the glyph sits on the text baseline rather than centred
    // against the cap height, which is what the design does.
    <div className="flex items-end gap-1">
      <Icon className="size-5 shrink-0 text-ink" strokeWidth={1.75} aria-hidden="true" />
      <p className={TITLE}>{children}</p>
    </div>
  );
}
