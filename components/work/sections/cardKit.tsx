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

/** Figma: white, 12px radius, 24px padding. */
export const CARD = 'bg-white rounded-xl p-6';
/** Figma: 16px medium, -0.32px tracking. */
export const TITLE = 'text-[16px] font-medium tracking-[-0.32px] text-ink';
/** Figma: 14px regular, 1.6 leading, -0.28px tracking. */
export const BODY = 'text-[14px] leading-[1.6] tracking-[-0.28px] text-ink';

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
