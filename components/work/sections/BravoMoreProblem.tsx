import type { ReactNode } from 'react';
import { Calculator, Megaphone, Workflow, type LucideIcon } from 'lucide-react';
import { BODY, CARD, Heading } from './cardKit';
import { BravoCampaignGap } from './BravoCampaignGap';

/**
 * The four audiences the fragmented reward system cost something.
 *
 * Same card as the Decision act's cut/keep/rebuild calls — both sections are
 * "N facets of one problem", so they share the kit rather than each inventing
 * a surface. These previously used hand-drawn PNG characters, which were the
 * only decorative illustration in the project and read as imported from a
 * different deck.
 *
 * Glyphs name the audience rather than the symptom: the symptom is already the
 * first clause of every card's body.
 */
const STAKEHOLDERS: { Icon: LucideIcon; label: string; body: ReactNode }[] = [
  {
    Icon: Megaphone,
    label: 'Marketing',
    body: (
      <>
        {/* The explicit {' '} is load-bearing: `</strong>Special` on one line
            renders with no gap between the two sentences. */}
        <strong className="font-semibold">
          Campaign changes meant manual reconfiguration.
        </strong>{' '}
        Special campaigns required identifying eligible restaurants, overriding existing coupon rules, then restoring them when the campaign ended.
      </>
    ),
  },
  {
    Icon: Workflow,
    label: 'Engineering & Operations',
    body: (
      <>
        <strong className="font-semibold">
          Time-sensitive campaigns depended on manual coordination.
        </strong>{' '}
        Backend reward rules and customer-facing campaign content had to be
        turned on and off separately.
      </>
    ),
  },
  {
    Icon: Calculator,
    label: 'Finance',
    body: (
      <>
        <strong className="font-semibold">
          More reward types meant more reconciliation paths.
        </strong>{' '}
        Points earned, bonuses issued, coupons deducted, and rewards redeemed
        created separate earning, deduction, and redemption records to reconcile.
      </>
    ),
  },
];

export function BravoMoreProblem() {
  return (
    // The heading and the "each reward had been introduced" paragraph moved
    // into BravoProblem, where they now introduce the reward-stack diagram.
    <div className="flex flex-col gap-6">
      {/* Both are direct children of the gap-6 parent. They used to sit in
          their own gap-2 wrapper, which put 8px between the line and the cards
          where every other lead-in in this act gets the section's 24px. */}
      <p className="text-[16px] text-ink">
        Behind the scenes, the same complexity created different problems for
        each team.
      </p>

      {/* One card per row at every width. The three bodies differ a lot in
          length, so side by side the shortest card carried a block of empty
          space to match the tallest; stacked, each is only as tall as it
          needs to be and the full column width keeps the lines readable. */}
      <div className="flex flex-col gap-4">
        {STAKEHOLDERS.map(({ Icon, label, body }) => (
          <div key={label} className={`${CARD} flex flex-col gap-4`}>
            <Heading Icon={Icon}>{label}</Heading>
            <p className={BODY}>{body}</p>
          </div>
        ))}
      </div>

      {/* Closes the act on the same 20px-statement / 16px-body pair the
          "complexity didn't stop at the checkout" turn uses, and hands off to
          the Challenge. Deliberately adds no new facts — it names what the
          three cards above already showed. */}
      <p className="text-[20px] font-semibold text-ink">
        We had already seen what manual coordination could cost.
      </p>

      {/* Sets up the timeline below: names the two separate switches whose
          gap the figure then measures. */}
      <p className="text-[16px] text-ink">
        Limited-time campaigns often ended at midnight, but there was no single
        control to end them across the product. Engineering had to disable the
        reward rule, while I separately removed the customer-facing campaign
        content.
      </p>

      <BravoCampaignGap />

      {/* Bounds the anecdote and hands off to the Challenge: the incident is
          evidence about coordination, not about cashback. */}
      <p className="text-[16px] text-ink">
        This wasn’t a cashback-rule failure, but it exposed the risk of
        managing campaign logic across separate systems. For the rewards
        redesign, I wanted to avoid carrying the same kind of coordination into
        checkout.
      </p>

      {/* <p className="text-[16px] text-ink">
        Each one held a piece of it — the campaign, the rules, the ledger — and
        every change had to travel through all three. That is why simplifying
        what customers saw could not be done at the surface alone.
      </p> */}
    </div>
  );
}

