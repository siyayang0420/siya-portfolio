'use client';

import { ArrowRight } from 'lucide-react';
import { BravoDecisionCards } from './BravoDecisionCards';
import { BravoCampaignShapes } from './BravoCampaignShapes';

export function BravoDecision() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <p className="text-[16px] text-ink">The Decision</p>
        <h2 className="text-[24px] font-semibold text-ink">
          We used one question to evaluate each reward mechanism: did its value justify the complexity it added to the payment experience?
        </h2>
      </div>

      {/* Intro — sets up the 3 cut/keep beats */}
      <p className="text-[16px] text-ink">
        That led to three different decisions. We removed the mechanism whose promotional value no longer justified the complexity it introduced, preserved the mechanism customers were actively responding to, and simplified how stored reward value was understood.
      </p>

      {/* The 3 cut/keep calls, as verdict cards. */}
      <BravoDecisionCards />

      {/* Summary — the 3 calls retold as one story */}
      <p className="text-[16px] text-ink">
        Three decisions, one principle: remove complexity unless we had a reason to preserve it. Threshold coupons offered clear value, but their unpredictable eligibility created checkout and operational complexity. Stored rewards showed a strong relationship with repeat behavior, so we preserved the value but removed the points conversion. Top-up bonuses stayed because the elevated-bonus period showed much larger top-ups and broader participation, while the decision to top up happened before checkout.
      </p>

      {/* Campaign shapes — one offer per partner, over their own storefront */}
      <BravoCampaignShapes />

      {/* Reveal — the rule, written out as a moment */}
      {/* <p className="text-[16px] text-ink">That rule, written out:</p> */}

      {/* Decision card (existing, unchanged) */}
      {false && (
      <div className="bg-white rounded-2xl px-6 py-11 md:px-[100px] flex flex-col items-center justify-center gap-8">
        <div className="flex flex-col items-center gap-1 text-center">
          <p className="text-[32px] text-ink">$1 cashback = $1</p>
          <p className="text-[16px] text-neutral-500">
            redeemable for next meal
          </p>
          <p className="text-[14px] text-neutral-500">
            eg. 10% cashback on $100 bill → $10 back to use for next meal
          </p>
        </div>

        {/* Before → after unit comparison (stacked: old on top, new below) */}
        <div className="w-full max-w-[360px] flex flex-col items-center gap-3">
          {/* Before — the old unit that forced math */}
          <div className="w-full bg-neutral-50 rounded-xl px-5 py-4 flex flex-col items-center gap-1 text-center">
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-neutral-400">
              Before
            </span>
            <p className="text-[22px] text-neutral-400 line-through">
              100 points = $1
            </p>
            <p className="text-[13px] text-neutral-400">
              conversion math at checkout
            </p>
          </div>

          <ArrowRight
            size={20}
            strokeWidth={1.5}
            className="text-neutral-400 rotate-90 shrink-0"
          />

          {/* After — the unit that removed the math */}
          <div className="w-full bg-emerald-50 rounded-xl px-5 py-4 flex flex-col items-center gap-1 text-center">
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-emerald-600">
              After
            </span>
            <p className="text-[22px] font-medium text-ink">$1 = $1</p>
            <p className="text-[13px] text-neutral-500">
              no conversion, no math
            </p>
          </div>
        </div>
      </div>
      )}
    </div>
  );
}
