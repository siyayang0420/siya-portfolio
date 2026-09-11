import { ArrowDown, ArrowRight } from 'lucide-react';
import { CARD } from './cardKit';

/**
 * How the system reasons: three layers, each one deriving from the last.
 *
 * The argument the copy above makes, drawn. What can be calculated is
 * calculated; rules turn those facts into named states; AI works one layer
 * higher, on what the states mean together. Reading the same merchant across
 * all three columns is the point — "$19 credit left" becomes "credit nearly
 * depleted" becomes "why this matters", and only then is there a decision to
 * support.
 *
 * ── Across, not down ───────────────────────────────────────────────────────
 * A stack is the obvious way to draw layers, and it is the wrong one here:
 * three stacked lists run to roughly a screen and a half, and the reader
 * never sees two layers at once — which is exactly the comparison the figure
 * exists to make. Laid left to right, the same row of each column lines up,
 * so the derivation reads across. The layers are still numbered, so nothing
 * about the ordering is lost. It folds back to a stack below `md`, where
 * there is no width to read across.
 *
 * Arrows, not the intervention figure's ×: these layers derive from one
 * another, they are not multiplied together.
 *
 * White, not the grey the models inside the pass cards use — this figure
 * sits directly on the page ground.
 */

const TRACKS =
  'md:grid md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)]';

const LAYERS: {
  n: string;
  title: string;
  question: string;
  /** Numerals in the first layer; set them tabular so the column aligns. */
  figures?: boolean;
  items: string[];
}[] = [
  {
    n: '01',
    title: 'Facts & calculations',
    question: 'What can we know reliably?',
    figures: true,
    items: [
      '$19 credit left',
      '$31 / day burn',
      '25 visits / 30d',
      '67 days since last visit',
      '$48 average spend',
    ],
  },
  {
    n: '02',
    title: 'Rules & heuristics',
    question: 'What state does that imply?',
    items: [
      'Credit nearly depleted',
      'Demand still active',
      'Diner lapsing',
      'High-value customer',
    ],
  },
  {
    n: '03',
    title: 'AI interpretation',
    question: 'What does it mean together?',
    items: [
      'Why this matters',
      'How signals relate',
      'What deserves attention',
      'What the team should consider',
    ],
  },
];

const ACTIONS = 'Buy credit · Create demand · Retain · Reward · Do nothing';

function Layer({ n, title, question, figures, items }: (typeof LAYERS)[number]) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-0.5">
        <span className="text-[12px] uppercase tracking-[0.08em] text-muted">
          {`${n} · ${title}`}
        </span>
        <span className="text-[14px] font-medium text-ink">{question}</span>
      </div>
      <ul className="flex flex-col divide-y divide-line border-t border-line">
        {items.map((item) => (
          <li
            key={item}
            className={`py-2 text-[14px] text-ink ${figures ? 'tabular-nums' : ''}`}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function JeniReasoning() {
  return (
    <figure className="m-0 flex flex-col">
      <div className={`${CARD} flex flex-col gap-4`}>
        {/* `items-stretch` so the three columns share the tallest one's
            height and the arrows can centre against the row rather than
            against whichever list happens to be shortest. */}
        <div className={`flex flex-col gap-4 ${TRACKS} md:items-stretch md:gap-6`}>
          {LAYERS.map((layer, i) => (
            <div key={layer.n} className="contents">
              {i > 0 && (
                <span
                  aria-hidden
                  className="flex items-center justify-center md:h-full"
                >
                  <ArrowRight
                    className="size-4 rotate-90 text-neutral-300 md:rotate-0"
                    strokeWidth={1.75}
                  />
                </span>
              )}
              <Layer {...layer} />
            </div>
          ))}
        </div>

        {/* ── What the three layers are for ────────────────────────────── */}
        <div aria-hidden className="flex justify-center">
          <ArrowDown className="size-4 text-neutral-300" strokeWidth={1.75} />
        </div>

        <div className="flex flex-col gap-1 border-t border-line pt-4">
          <span className="text-[12px] uppercase tracking-[0.08em] text-muted">
            Decision support
          </span>
          <span className="text-[14px] font-medium text-ink">{ACTIONS}</span>
        </div>
      </div>
    </figure>
  );
}
