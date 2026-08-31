'use client';

import { BravoDecisionCards } from './BravoDecisionCards';
import { BravoCampaignShapes } from './BravoCampaignShapes';

export function BravoDecision() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <p className="text-[16px] text-ink">The Decision</p>
        {/* The act titles are short assertions — five to eight words. This one
            was a 24-word sentence set at 24px/600, which is a paragraph wearing
            a heading's clothes. The full question keeps its exact wording; it
            has just moved down into the prose, where a sentence that long
            reads. */}
        <h2 className="text-[24px] font-semibold text-ink">
          Did the value justify the complexity?
        </h2>
      </div>

      {/* Intro — sets up the 3 cut/keep beats */}
      <p className="text-[16px] text-ink">
        We used one question to evaluate each reward mechanism: did its value
        justify the complexity it added to the payment experience? That led to
        three different decisions. We removed the mechanism whose promotional
        value no longer justified the complexity it introduced, preserved the
        mechanism customers were actively responding to, and simplified how
        stored reward value was understood.
      </p>

      {/* The 3 cut/keep calls, as verdict cards. */}
      <BravoDecisionCards />

      {/* Summary — the 3 calls retold as one story */}
      <p className="text-[16px] text-ink">
        Three decisions, one principle: remove complexity unless we had a reason to preserve it. Threshold coupons offered clear value, but their unpredictable eligibility created checkout and operational complexity. Stored rewards showed a strong relationship with repeat behavior, so we preserved the value but removed the points conversion. Top-up bonuses stayed because the elevated-bonus period showed much larger top-ups and broader participation, while the decision to top up happened before checkout.
      </p>

      {/* Campaign shapes — one offer per partner, over their own storefront */}
      <BravoCampaignShapes />
    </div>
  );
}
