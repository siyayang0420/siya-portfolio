import { CARD } from './cardKit';

/**
 * The decision workflow: five steps, read top to bottom.
 *
 * The sequence the copy above names — from what is happening, to why it
 * matters, to what Bravo could do next — with the two steps that sit between
 * them made explicit. Each step is a question the system answers on the
 * team's behalf, so they never have to reconstruct the reasoning themselves.
 *
 * ── Numbered, not arrowed ──────────────────────────────────────────────────
 * Four ↓ glyphs between five steps would add most of a screen of padding to
 * say what `01 … 05` already says, and this act is dense enough. The
 * numbering carries the order; the hairlines carry the separation. It is the
 * same head treatment the reasoning figure directly above uses — 12px
 * uppercase marker, 14px medium question — so the two figures read as the
 * same kind of object rather than two different diagram languages on one
 * page.
 *
 * The step name sits in its own column from `md` so the five can be scanned
 * as a sequence without reading the questions; below `md` the two stack.
 *
 * White, not the grey the models inside the pass cards use — this figure sits
 * directly on the page ground.
 */

const STEPS: { n: string; name: string; question: string }[] = [
  { n: '01', name: 'Observe', question: 'What changed?' },
  { n: '02', name: 'Understand', question: 'Why is it happening?' },
  { n: '03', name: 'Prioritize', question: 'What deserves attention?' },
  {
    n: '04',
    name: 'Connect',
    question: 'Which merchant and diner signals belong together?',
  },
  { n: '05', name: 'Recommend', question: 'What should Bravo consider doing?' },
];

export function JeniWorkflow() {
  return (
    <figure className="m-0 flex flex-col">
      <ol className={`${CARD} flex flex-col divide-y divide-line`}>
        {STEPS.map((step) => (
          <li
            key={step.n}
            // 160px holds the longest marker ("05 · Recommend") on one line,
            // so the questions start on a single left edge down the figure.
            className="flex flex-col gap-0.5 py-3 first:pt-0 last:pb-0 md:grid md:grid-cols-[160px_minmax(0,1fr)] md:items-baseline md:gap-4"
          >
            <span className="text-[12px] uppercase tracking-[0.08em] text-muted">
              {`${step.n} · ${step.name}`}
            </span>
            <span className="text-[14px] font-medium text-ink">
              {step.question}
            </span>
          </li>
        ))}
      </ol>
    </figure>
  );
}
