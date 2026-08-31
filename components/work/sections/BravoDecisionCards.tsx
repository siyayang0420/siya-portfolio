import type { ReactNode } from 'react';
import { Check, RotateCw, X, type LucideIcon } from 'lucide-react';
import { BODY, CARD, Heading, TITLE } from './cardKit';

/**
 * A measured figure with the thing it measures underneath.
 *
 * The number leads and the label follows in muted 12px, so a reader takes the
 * movement first and the definition second — which is the order they matter in.
 */
function Stat({ figure, label }: { figure: string; label: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[16px] font-medium text-ink tabular-nums">
        {figure}
      </span>
      <span className="text-[12px] leading-[1.4] text-muted">{label}</span>
    </div>
  );
}

/**
 * The three calls, each showing the evidence it rested on and what followed.
 *
 * Cards rather than a table: a table put every row on the same three tracks,
 * which flattened the one call that carries real evidence into a cell of text.
 * Cards let the cashback row keep its 2X figure at full size while the two
 * short calls stay compact beside each other.
 *
 * Structure is constant across all three — glyph and decision, the evidence,
 * then "Therefore". Keeping the shape identical is what lets a reader compare
 * the three; the heading above asks one question of each, and each card answers
 * in the same place.
 */

/** `evidence` is a node, not a string — one call measures, the others assert. */
const CALLS: {
  Icon: LucideIcon;
  decision: string;
  evidence: ReactNode;
  therefore: string;
}[] = [
  {
    Icon: X,
    decision: 'Remove threshold coupons',
    evidence: (
      <>
        {/* The lead sits in ink and the two sentences under it in muted, so
            the tension — easy / hard — registers before the detail. */}
        <p className={TITLE}>Easy to understand. Hard to guarantee.</p>
        <p className="mt-3 text-ink">
          $15 off $100 gave customers immediate, concrete value. But eligibility depended on the restaurant, campaign, spend threshold,
          and commercial agreement.
        </p>
      </>
    ),
    therefore: 'The instant value wasn’t worth the unpredictable eligibility and operational complexity.',
  },
  {
    Icon: Check,
    decision: 'Keep top-up bonus',
    evidence: (
      <>
        {/* Two figures side by side rather than buried in a sentence: the pair
            is the argument, and reading them as a pair is what shows the
            campaign moved both how many people topped up and by how much. */}
        <div className="grid grid-cols-2 gap-3">
          <Stat figure="$117 → $300" label="average top-up per transaction" />
          <Stat figure="+65%" label="unique top-up users per day" />
        </div>
        <p className="mt-3 text-[12px] italic leading-[1.5] text-muted">
          Oct 3–6 elevated-bonus campaign vs. Sep 24–Oct 2 active baseline ·
          PostHog
        </p>
      </>
    ),
    therefore:
      'Preserve the incentive. Remove its complexity from checkout.',
  },
];

const REBUILT = {
  Icon: RotateCw,
  decision: 'Convert points → dollar cashback',
  therefore: 'Preserve stored reward value, remove the conversion math.',
};

/**
 * The conclusion every card ends on. No rule above it — the muted "Therefore"
 * label already marks the shift, and a divider on top of a label made two
 * separators doing one job.
 */
function Therefore({ children }: { children: string }) {
  return (
    <div className="mt-auto flex flex-col gap-1 pt-1">
      <span className="text-[12px] text-muted">Therefore</span>
      <p className={BODY}>{children}</p>
    </div>
  );
}

export function BravoDecisionCards() {
  return (
    <div className="flex flex-col gap-4">
      {/* The two short calls */}
      <div className="grid gap-4 md:grid-cols-2">
        {CALLS.map(({ Icon, decision, evidence, therefore }) => (
          <div key={decision} className={`${CARD} flex flex-col gap-4`}>
            <Heading Icon={Icon}>{decision}</Heading>
            {/* A div, not a p: one card's evidence is a block of stats, and a
                <p> cannot legally contain a <div>. No colour here — every
                child sets its own, so the `text-muted` this used to carry was
                overridden everywhere it landed. */}
            <div className={BODY}>{evidence}</div>
            <Therefore>{therefore}</Therefore>
          </div>
        ))}
      </div>

      {/* The call that carries the number, so it runs full width */}
      <div className={`${CARD} flex flex-col gap-5`}>
        <div className="flex flex-col gap-6 md:flex-row md:gap-10">
          <div className="flex flex-col gap-4 md:max-w-[300px] md:flex-1">
            <Heading Icon={REBUILT.Icon}>{REBUILT.decision}</Heading>
            <Therefore>{REBUILT.therefore}</Therefore>
          </div>

          <div className="flex shrink-0 flex-col gap-2">
            <span className="text-[12px] text-muted">Evidence</span>
            {/* Grid, not flex: the tile takes its height from the paragraph and
                squares off against it, and only a grid can size an item from
                its own ratio against a stretched height — a flex item draws its
                base size from content, so `aspect-square` is ignored there. */}
            <div className="grid grid-cols-[auto_minmax(0,240px)] items-stretch gap-4">
              <div className="h-full">
                {/* The one tracking utility left in the case study, and it is
                    on a display numeral rather than prose: a 36px figure needs
                    the tightening, and a <span> is outside the wrapper's
                    paragraph rule so nothing is fighting it. */}
                <span className="flex aspect-square h-full items-center justify-center rounded-xl bg-[#202020] text-[36px] font-bold leading-none tracking-[-0.9px] text-white">
                  2X
                </span>
              </div>
              <p className={BODY}>
                Users holding <span className="font-medium">$30+</span> in
                unspent cashback returned about twice as often as everyone else.
              </p>
            </div>
            <span className="text-[12px] text-muted">
              PostHog · 90-day cohorts
            </span>
          </div>
        </div>

        {/* Full width under both columns rather than tucked into the evidence
            block. It qualifies the whole call, and at the evidence column's
            ~305px it would have set as five lines of fine print — the wrong
            weight for the one line that says how far the data goes. This rule
            stays: it separates two columns from a note about both, which is a
            different job from the label inside a card. */}
        <p className="border-t border-line pt-4 text-[12px] font-semibold text-ink">
          *This was correlational, not proof that cashback caused the higher
          return rate. But it was enough directional evidence to avoid removing
          stored rewards while simplifying the system.
        </p>
      </div>
    </div>
  );
}
