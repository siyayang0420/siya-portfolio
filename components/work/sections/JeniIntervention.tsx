import { ArrowDown } from 'lucide-react';
import { CARD } from './cardKit';

/**
 * Every opportunity as a relationship between three questions.
 *
 * Three factors multiplied — need, opportunity, economics — resolving to one
 * intervention. Drawn as the product it is: the three side by side with ×
 * between them, and the result under a rule, the way a total sits under the
 * line in a sum. The × is the point. Any one factor at zero makes the whole
 * thing zero, which is why "do nothing" is a legitimate answer and sits in
 * the same list as the others.
 *
 * Same construction as the runway figure and the 10 → 4 → 1 strip, so the
 * three passes' models read as the same kind of object: one grey surface
 * (it sits inside a white pass card), 12px labels, operators between,
 * footer under a rule. Folds to one column below `md`, operators hidden.
 *
 * The surface is the caller's: white `CARD` on the page ground, grey when it
 * sits inside a white card, the same way the runway figure takes it.
 */

const FACTORS: { label: string; question: string }[] = [
  {
    label: 'Merchant need',
    question: 'Where does a merchant need help?',
  },
  {
    label: 'Diner opportunity',
    question: 'Who is relevant, and whose behavior might change?',
  },
  {
    label: 'Bravo economics',
    question: 'Would intervening create enough value to justify the cost?',
  },
];

function Factor({ label, question }: (typeof FACTORS)[number]) {
  return (
    // The rule between factors on a phone lives here, not as `divide-y` on
    // the container — its direct children are the `contents` wrappers, which
    // paint no box. `first:` reads against the wrapper: the first factor is
    // alone in its wrapper and gets no rule; every later one follows its
    // operator and does.
    <div className="flex flex-col gap-1 border-t border-line py-3 first:border-t-0 md:border-t-0 md:py-0">
      <span className="text-[12px] uppercase tracking-[0.08em] text-muted">
        {label}
      </span>
      <span className="text-[14px] font-medium text-ink">{question}</span>
    </div>
  );
}

export function JeniIntervention({
  surface = CARD,
}: {
  surface?: string;
}) {
  return (
    <figure className="m-0 flex flex-col">
      <div className={`${surface} flex flex-col gap-4`}>
        {/* ── The product ──────────────────────────────────────────────
            Five explicit tracks: the operator columns size to their glyph,
            so the three factor columns share what is left evenly. The ×
            sits on the question line, not the label's, by the label's
            height. */}
        <div className="flex flex-col md:grid md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] md:items-start md:gap-6">
          {FACTORS.map((factor, i) => (
            <div key={factor.label} className="contents">
              {i > 0 && (
                <span
                  aria-hidden
                  className="hidden text-[24px] leading-6 text-neutral-300 md:block md:pt-[22px]"
                >
                  ×
                </span>
              )}
              <Factor {...factor} />
            </div>
          ))}
        </div>

        {/* ── What it resolves to ──────────────────────────────────────
            A drop, then the result under a rule. */}
        <div aria-hidden className="flex justify-center">
          <ArrowDown className="size-4 text-neutral-300" strokeWidth={1.75} />
        </div>
        <div className="flex flex-col gap-1 border-t border-line pt-4">
          <span className="text-[12px] uppercase tracking-[0.08em] text-muted">
            Intervention
          </span>
          <span className="text-[14px] font-medium text-ink">
            Buy credit · Create demand · Retain · Reward · Do nothing
          </span>
        </div>
      </div>
    </figure>
  );
}
