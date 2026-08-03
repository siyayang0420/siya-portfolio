'use client';

import { ArrowRight } from 'lucide-react';
import { BravoReceipt } from './BravoReceipt';
import { BravoDecisionCards } from './BravoDecisionCards';
import { BravoCampaignShapes } from './BravoCampaignShapes';
import { useDecisionVariant } from '../../ui/decisionVariant';

export function BravoDecision() {
  const variant = useDecisionVariant();
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <p className="text-[16px] text-ink">The Decision</p>
        <h2 className="text-[24px] font-semibold text-ink">
          What I cut, what I kept, and what I rebuilt.
        </h2>
      </div>

      {/* Intro — sets up the 3 cut/keep beats */}
      <p className="text-[16px] text-ink">
        I didn&apos;t own the cut/keep calls — those were the CEO&apos;s.
        What I did own was bringing the data, mapping the tradeoffs, and
        designing the system that made each call work in practice.
        Here&apos;s what we landed on, and what each rested on.
      </p>

      {/* The 3 cut/keep calls. Two presentations, toggled from the tweaker:
          the dense printed receipt, or three scannable verdict cards. Both
          carry the same PostHog evidence. */}
      {variant === 'cards' ? <BravoDecisionCards /> : <BravoReceipt />}

      {/* Summary — the 3 calls retold as one story */}
      <p className="text-[16px] text-ink">
        Three calls, one logic. The coupon went because the data said we were
        buying downloads, not customers. Cashback stayed because the money
        sitting in a diner&apos;s wallet was already pulling them back in. We
        just changed the unit, so nobody had to do math at the table anymore.
        And the top-up bonus survived because users loved it, it drove
        revenue, and the whole decision happens at home, long before the bill
        arrives. Anything that asked the user to think at checkout was out.
        Everything else earned its place.
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
