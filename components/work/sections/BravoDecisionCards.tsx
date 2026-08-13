import { Scissors, RotateCcw, Check, ArrowRight } from 'lucide-react';

/**
 * The three cut/keep/rebuild calls, as scannable verdict cards.
 *
 * This replaced a printed-receipt treatment. The receipt was a nicer object but
 * a worse argument: it made the reader decode a metaphor before they could find
 * the verdict, and it buried the one number the section exists to deliver in a
 * line of monospace fine print.
 *
 * The layout is doing the explaining. Cut and Kept are the two short calls, so
 * they pair off on top; Rebuilt is the one that needs proof, so it runs
 * full-width underneath with the claim and the evidence side by side.
 *
 * All three cards are deliberately parallel: pill, then a plain noun naming the
 * mechanism, then one sentence of reason. The rebuilt card's before/after
 * equation lives in its body rather than its heading — as a heading it made the
 * third card read as a different kind of object from the first two.
 *
 * Surfaces follow the case study's house style (BravoTwoSides et al):
 * `rounded-xl bg-white p-5` for a card, `rounded-lg border border-line` for
 * anything nested inside one.
 */

type Verdict = 'cut' | 'rebuilt' | 'kept';

const VERDICT_STYLE: Record<
  Verdict,
  { label: string; Icon: typeof Scissors; pill: string }
> = {
  cut: { label: 'Cut', Icon: Scissors, pill: 'bg-neutral-100 text-muted' },
  rebuilt: {
    label: 'Rebuilt',
    Icon: RotateCcw,
    pill: 'bg-emerald-50 text-emerald-700',
  },
  kept: { label: 'Kept', Icon: Check, pill: 'bg-emerald-50 text-emerald-700' },
};

// Monthly visits by cashback balance held (PostHog, 90-day cohorts).
// width = % of the top tier, which sets the chart's scale.
const TIERS = [
  { label: '$0–10', value: '4.5', width: 50 },
  { label: '$10–20', value: '4.8', width: 53 },
  { label: '$20–30', value: '5.2', width: 58 },
  { label: '$30+', value: '9.03', width: 100, top: true },
];

function CardShell({
  verdict,
  title,
  className,
  children,
}: {
  verdict: Verdict;
  title: string;
  className?: string;
  children: React.ReactNode;
}) {
  const { label, Icon, pill } = VERDICT_STYLE[verdict];
  return (
    <div className={`flex flex-col gap-4 rounded-xl bg-white p-5 ${className ?? ''}`}>
      {/* Pill and title are one unit on a tight gap, so the space above the
          body is unambiguously larger than the space inside the header. */}
      <div className="flex flex-col gap-2">
        <span
          className={`inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${pill}`}
        >
          <Icon className="size-3" strokeWidth={2.5} aria-hidden="true" />
          {label}
        </span>
        <h3 className="text-[15px] font-medium text-ink">{title}</h3>
      </div>
      {children}
    </div>
  );
}

/** Shared body treatment: the reason in ink, the elaboration behind it. */
function Reason({ lead, children }: { lead: string; children?: React.ReactNode }) {
  return (
    <p className="text-[14px] leading-[1.6] text-neutral-500">
      <span className="text-ink">{lead}</span>
      {children ? <> {children}</> : null}
    </p>
  );
}

/**
 * The chart's own conclusion, stated before the chart.
 *
 * A reader who skims four bars and four decimals has to do the division
 * themselves to find the point. Leading with the ratio makes the bars
 * corroboration for a claim already made, rather than homework.
 */
function Finding() {
  return (
    <div className="flex items-baseline gap-3">
      <span className="text-[36px] font-semibold leading-none tracking-[-0.02em] text-emerald-600">
        2×
      </span>
      <p className="text-[13px] leading-[1.45] text-ink">
        Diners holding <span className="font-medium">$30+</span> in cashback came
        back about twice as often as everyone else.
      </p>
    </div>
  );
}

/**
 * One shared track per row, with the value in a fixed column.
 *
 * The bars previously *were* the layout — each value sat immediately after a
 * bar of its own width, so the four numbers landed at four different x
 * positions and never read as a column. Fixed label and value columns with a
 * flexible track between them is what makes them comparable at a glance.
 */
function TierChart() {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-[12px] text-muted">Monthly visits by cashback balance held</p>
      {TIERS.map((t) => (
        <div key={t.label} className="flex items-center gap-3 text-[12px]">
          <span
            className={`w-[56px] shrink-0 ${t.top ? 'font-medium text-ink' : 'text-muted'}`}
          >
            {t.label}
          </span>
          <span className="relative h-2 flex-1 rounded-full bg-neutral-100">
            <span
              className={`absolute inset-y-0 left-0 rounded-full ${
                t.top ? 'bg-emerald-600' : 'bg-neutral-300'
              }`}
              style={{ width: `${t.width}%` }}
              aria-hidden="true"
            />
          </span>
          <span
            className={`w-[32px] shrink-0 text-right tabular-nums ${
              t.top ? 'font-medium text-emerald-600' : 'text-muted'
            }`}
          >
            {t.value}
          </span>
        </div>
      ))}
    </div>
  );
}

export function BravoDecisionCards() {
  return (
    <div className="flex flex-col gap-3">
      {/* Top row — the two short calls */}
      <div className="grid gap-3 md:grid-cols-2">
        <CardShell verdict="cut" title="Threshold coupon">
          <Reason lead="It was buying downloads, not customers.">
            The installs it drove never came back, so it came out entirely.
          </Reason>
        </CardShell>

        <CardShell verdict="kept" title="Top-up bonus">
          <Reason lead="It never enters the payment moment.">
            Users loved it and it drove revenue, and the whole decision happens
            at home — long before the bill arrives.
          </Reason>
        </CardShell>
      </div>

      {/* Bottom — the call that needs proof, so claim and evidence sit level.
          Nothing is boxed: the card is already a surface, and a bordered panel
          inside a bordered card made the evidence read as a footnote pinned to
          the argument rather than as part of it. Whitespace does the dividing. */}
      <CardShell verdict="rebuilt" title="Points conversion">
        <div className="grid gap-x-10 gap-y-6 md:grid-cols-2 md:items-start">
          <div className="flex flex-col gap-3">
            {/* The change itself — set as a statement, not a heading, so it
                doesn't compete with the two plain nouns in the row above. */}
            <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-[18px]">
              <span className="text-muted line-through">100 pts = $1</span>
              <ArrowRight
                className="size-4 shrink-0 self-center text-neutral-300"
                strokeWidth={1.75}
                aria-hidden="true"
              />
              <span className="font-medium text-ink">$1 = $1</span>
            </p>

            <Reason lead="Kept the engine, removed the math.">
              Nothing to convert, and nothing to work out at the table. Cashback
              earned its place because an unspent balance behaves like a return
              ticket:
            </Reason>
          </div>

          {/* The proof, conclusion first */}
          <div className="flex flex-col gap-4">
            <Finding />
            <TierChart />
            <p className="text-[12px] text-muted">PostHog · 90-day cohorts</p>
          </div>
        </div>
      </CardShell>
    </div>
  );
}
