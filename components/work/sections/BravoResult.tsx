import {
  CircleCheck,
  CircleDollarSign,
  Headset,
  Megaphone,
  Wallet,
} from 'lucide-react';
import { CARD } from './cardKit';

/**
 * What changed after launch, per audience.
 *
 * Drawn monochrome rather than in the source sketch's green/purple: those would
 * be the only chromatic cards in the case study, and colour-coding two
 * audiences implies a contrast between them that isn't the point — both
 * outcomes run the same way. The sketch's tinted icon discs go for the same
 * reason: every other glyph in the study sits bare against its card.
 *
 * The two share one card under one heading rather than standing as separate
 * cards, because they are one finding reported by two teams — which also lets
 * a single attribution line at the bottom cover both. Neither is a measured
 * result, and the Decision act draws a hard line between evidence and
 * inference, so saying "qualitative" out loud keeps that line intact.
 */
const OUTCOMES = [
  {
    Icon: Headset,
    audience: 'Customer support',
    headline: 'Reward questions became rare.',
    body: 'Reward-related questions and calls dropped dramatically after launch.',
  },
  {
    Icon: Megaphone,
    audience: 'Marketing',
    headline: 'Easier to set up. Easier to explain.',
    body: 'One cashback model was easier to configure and communicate across different campaigns.',
  },
];

const TOP_UP_POINTS = [
  'Before dining, not at checkout',
  'Instant value, zero friction',
  'Kept because it works for everyone',
];

const CASHBACK_POINTS = [
  '$1 cashback = $1 toward the next meal',
  'No stacking, no conversion',
  'Flexible for campaigns, invisible to users',
];

export function BravoResult() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <p className="text-[16px] text-ink">The Outcome</p>
        <h2 className="text-[24px] font-semibold text-ink">
          The system no longer needed as much explaining.
        </h2>
      </div>

      {/* Existing 2-column summary card */}
      {/* <div className="bg-white rounded-2xl px-6 py-8 sm:px-10 sm:py-11 flex justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
          <SystemColumn
            icon={<Wallet size={32} strokeWidth={1.5} className="text-ink" />}
            title="Top up bonus"
            points={TOP_UP_POINTS}
          />
          <SystemColumn
            icon={
              <CircleDollarSign
                size={32}
                strokeWidth={1.5}
                className="text-ink"
              />
            }
            title="Cashback system"
            points={CASHBACK_POINTS}
          />
        </div>
      </div> */}

      {/* What changed after launch */}
      <p className="text-[16px] text-ink">
        Before, answering that meant explaining points, coupons, thresholds, top-up bonuses, and how they worked together.
      </p>
      <p className="text-[16px] text-ink">
        After launch, customers rarely contacted support to ask how their savings worked. Marketing also had a simpler model to set up and explain, while the business kept the ability to run different campaign rules behind the same cashback experience.
      </p>

      {/* One card, two beats: the rule, then what it changed. These were two
          separate blocks — an ink bar and a pair of cards — which read as two
          unrelated claims when they are one claim and its consequence. The
          internal rule is the same border-t the Decision act uses to separate
          a statement from a note about it. */}
      <div className={`${CARD} flex flex-col gap-7 sm:p-8`}>
        {/* The figure keeps the filled ink treatment the Challenge act gives
            "One system" — both are the answer their act builds toward, so they
            carry the same weight. */}
        <div className="flex flex-col items-center gap-5 text-center">
          <div className="flex items-center justify-center gap-3">
            <CircleDollarSign
              className="size-6 shrink-0 text-ink"
              strokeWidth={1.5}
              aria-hidden="true"
            />
            {/* The explicit {' '} is load-bearing: `change.` followed by a
                newline and an element renders with no gap between the two
                sentences. */}
            <p className="text-[20px] leading-[1.4] text-ink">
              How you earn it can change.{' '}
              <span className="font-semibold">What it’s worth doesn’t.</span>
            </p>
          </div>
          <span className="rounded-xl bg-[#202020] px-6 py-3 text-[24px] font-semibold tracking-[-0.48px] text-white">
            $1 cashback = $1
          </span>
        </div>

        <div className="flex flex-col gap-6 border-t border-line pt-7">
          <div className="flex items-center gap-2">
            <CircleCheck
              className="size-6 shrink-0 text-ink"
              strokeWidth={1.5}
              aria-hidden="true"
            />
            <p className="text-[20px] font-semibold tracking-[-0.4px] text-ink">
              And people stopped needing the explanation.
            </p>
          </div>

          {/* A rule between the two rather than a gap: they are siblings inside
              one card, so the divider is what separates them. It turns into a
              top border once they stack. */}
          <div className="grid gap-6 md:grid-cols-2 md:gap-8">
            {OUTCOMES.map(({ Icon, audience, headline, body }, i) => (
              <div
                key={audience}
                className={
                  i === 0
                    ? 'flex gap-3'
                    : 'flex gap-3 border-t border-line pt-6 md:border-l md:border-t-0 md:pl-8 md:pt-0'
                }
              >
                <Icon
                  className="mt-0.5 size-5 shrink-0 text-ink"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
                <div className="flex flex-col gap-1.5">
                  <span className="text-[12px] uppercase tracking-[0.08em] text-muted">
                    {audience}
                  </span>
                  <p className="text-[16px] font-medium tracking-[-0.32px] text-ink">
                    {headline}
                  </p>
                  <p className="text-[14px] leading-[1.6] tracking-[-0.28px] text-muted">
                    {body}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* One attribution for both — it is one source of one kind. Two
              pills implied two separate studies. */}
          <span className="mx-auto w-fit rounded-full border border-line px-3 py-1 text-[12px] text-muted">
            Qualitative feedback · Customer Support + Marketing
          </span>
        </div>
      </div>

      {/* Reflection — forward-looking, grounded in the 2x insight */}
      {/* <div className="flex flex-col gap-2 border-l-2 border-neutral-200 pl-5 py-1">
        <p className="text-[12px] tracking-[0.14em] uppercase text-muted">
          What I&apos;d do next
        </p>
        <p className="text-[16px] text-ink">
          The 2× frequency number is an average, and averages hide a lot. A
          regular sitting on $30 of cashback and a first-timer aren&apos;t the
          same person, but today they get the same rate. With more time,
          that&apos;s what I&apos;d change: pull in transaction history, visit
          patterns, and how each person actually uses the app, then build a
          reward algorithm that tunes the rate per user instead of per
          campaign. Same system, just personalized to who it&apos;s
          rewarding.
        </p>
      </div> */}

      {/* Closing line */}
      {/* <p className="text-[16px] text-ink">
        A year in, the model&apos;s still running as-is. Marketing ships
        campaigns on it, finance closes the books on it, and nobody&apos;s
        asked me to add a fifth reward type.
      </p> */}
    </div>
  );
}

function SystemColumn({
  icon,
  title,
  points,
}: {
  icon: React.ReactNode;
  title: string;
  points: string[];
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="mb-1">{icon}</div>
      <p className="text-[16px] font-medium text-ink tracking-[0.02em]">
        {title}
      </p>
      <ul className="list-disc pl-5 text-[14px] text-neutral-500 tracking-[0.02em] leading-[1.5]">
        {points.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>
    </div>
  );
}
