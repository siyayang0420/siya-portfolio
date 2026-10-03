import { X } from 'lucide-react';
import { FactorArt } from './factorArt';

/**
 * What I found — the three questions every intervention has to answer.
 *
 * Three tall white cards in a row with × between them: a drawing of the
 * mechanism, then the label and the question pinned to the bottom. The ×
 * carries the argument — any one factor at zero zeroes the whole thing.
 *
 * Folds to one column below `md`, the operators hidden.
 */

const FACTORS: { label: string; question: string }[] = [
  { label: 'Merchant Need', question: 'Where does the marketplace need help?' },
  { label: 'Diner Opportunity', question: 'Who could realistically respond?' },
  { label: 'Bravo Economics', question: 'Would acting create enough value?' },
];

export function JeniFactors({
  heading = 'What I found',
  plain = false,
}: {
  /** Empty string drops the heading, for a second row under the first. */
  heading?: string;
  /** Flat icons on white, no isometric field. */
  plain?: boolean;
}) {
  return (
    <figure className="m-0 flex flex-col gap-4">
      {heading && (
        <p className="text-[16px] font-semibold text-ink">{heading}</p>
      )}
      <div className="flex w-full flex-col gap-3 md:flex-row md:items-stretch md:gap-1.5">
        {FACTORS.map((factor, i) => (
          <div key={factor.label} className="contents">
            {i > 0 && (
              <X
                aria-hidden="true"
                className="hidden size-5 shrink-0 self-center text-[#a3a3a3] md:block"
                strokeWidth={1.5}
              />
            )}
            <div className="flex min-w-0 flex-1 flex-col rounded-2xl bg-white px-5 pb-5 pt-4">
              <FactorArt index={i} plain={plain} />
              <div className="mt-auto flex flex-col gap-1 pt-4">
                <p className="text-[16px] font-semibold text-ink">
                  {factor.label}
                </p>
                <p className="text-[14px] text-ink">{factor.question}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </figure>
  );
}
