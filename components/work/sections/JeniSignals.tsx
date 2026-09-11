import { ArrowDown } from 'lucide-react';
import { CARD } from './cardKit';

/**
 * What the system needed to understand about each side of the marketplace.
 *
 * The same product the intervention figure states — merchant need × diner
 * opportunity × Bravo economics — opened up: each factor is now the list of
 * signals behind it, and the result is the three questions an opportunity has
 * to answer. Where that figure said *what* the model was, this one says what
 * it is made of.
 *
 * ── Why the questions sit in columns ───────────────────────────────────────
 * Each question belongs to the factor above it — merchant need asks who needs
 * what, diner opportunity asks who could respond, Bravo economics asks
 * whether it is worth acting. Setting them in the same three tracks says that
 * without a word of explanation; stacked under one label they would read as
 * an unordered list and the mapping would be lost.
 *
 * White, not the grey the other models use: this figure sits directly on the
 * page ground rather than inside a white pass card — the same call
 * JeniValueModel makes in the act above.
 *
 * Folds to one column below `md`, operators hidden.
 */

const TRACKS =
  'md:grid md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)]';

const FACTORS: { label: string; signals: string[]; question: string }[] = [
  {
    label: 'Merchant need',
    signals: [
      'Credit position',
      'Burn velocity',
      'Demand trend',
      'Merchant profile',
      'Location',
    ],
    question: 'Who needs what?',
  },
  {
    label: 'Diner opportunity',
    signals: [
      'Visit history',
      'Cuisine affinity',
      'Recency',
      'Spend behavior',
      'Merchant loyalty',
    ],
    question: 'Who could respond?',
  },
  {
    label: 'Bravo economics',
    signals: [
      'Credit economics',
      'Incentive cost',
      'Available margin',
      'Value at stake',
    ],
    question: 'Is it worth acting?',
  },
];

export function JeniSignals() {
  return (
    <figure className="m-0 flex flex-col">
      <div className={`${CARD} flex flex-col gap-4`}>
        {/* ── The three sides, and what Jeni reads on each ──────────────
            `items-stretch` so the three columns share the tallest one's
            height and the × can centre against the row rather than against
            a list that happens to be shorter. */}
        <div className={`flex flex-col gap-4 ${TRACKS} md:items-stretch md:gap-6`}>
          {FACTORS.map((factor, i) => (
            <div key={factor.label} className="contents">
              {i > 0 && (
                <span
                  aria-hidden
                  className="hidden text-[24px] leading-none text-neutral-300 md:flex md:items-center md:justify-center"
                >
                  ×
                </span>
              )}
              <div className="flex flex-col gap-2">
                <span className="text-[12px] uppercase tracking-[0.08em] text-muted">
                  {factor.label}
                </span>
                <ul className="flex flex-col divide-y divide-line border-t border-line">
                  {factor.signals.map((signal) => (
                    <li key={signal} className="py-2 text-[14px] text-ink">
                      {signal}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* ── What they resolve to ─────────────────────────────────────── */}
        <div aria-hidden className="flex justify-center">
          <ArrowDown className="size-4 text-neutral-300" strokeWidth={1.75} />
        </div>

        <div className="flex flex-col gap-2 border-t border-line pt-4">
          <span className="text-[12px] uppercase tracking-[0.08em] text-muted">
            Decision questions
          </span>
          {/* The same tracks as above, so each question lands under the
              factor it belongs to. The empty spans hold the operator
              columns open. */}
          <div className={`flex flex-col gap-1 ${TRACKS} md:gap-6`}>
            {FACTORS.map((factor, i) => (
              <div key={factor.question} className="contents">
                {/* The same glyph, made invisible rather than an empty span:
                    the operator tracks are `auto`, so a zero-width spacer
                    would size its track to 0 and leave the 1fr columns 16px
                    wider than the row above — the questions drifted out of
                    line with their factors by up to 10px. Measuring the same
                    character keeps both grids on identical tracks. */}
                {i > 0 && (
                  <span
                    aria-hidden
                    className="invisible hidden text-[24px] leading-none md:flex md:items-center md:justify-center"
                  >
                    ×
                  </span>
                )}
                <span className="text-[14px] font-medium text-ink">
                  {factor.question}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </figure>
  );
}
