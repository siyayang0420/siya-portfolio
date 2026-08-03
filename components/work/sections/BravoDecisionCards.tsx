import { Scissors, RotateCcw, Check } from 'lucide-react';

/**
 * Alternative to BravoReceipt — the same three cut/keep/rebuild calls, broken out
 * of the dense receipt into scannable verdict cards. Cut and Kept sit on top as a
 * pair; Rebuilt runs full-width underneath so its copy and the PostHog evidence
 * can sit side by side and actually read as one argument. Toggleable against the
 * receipt via the floating tweaker.
 */

type Verdict = 'cut' | 'rebuilt' | 'kept';

const VERDICT_STYLE: Record<
  Verdict,
  { label: string; Icon: typeof Scissors; pill: string }
> = {
  cut: { label: 'Cut', Icon: Scissors, pill: 'bg-neutral-100 text-neutral-500' },
  rebuilt: {
    label: 'Rebuilt',
    Icon: RotateCcw,
    pill: 'bg-emerald-50 text-emerald-700',
  },
  kept: { label: 'Kept', Icon: Check, pill: 'bg-emerald-50 text-emerald-700' },
};

// Monthly visits by cashback balance held (PostHog, 90-day cohorts).
// width = % of the top tier for the sparkline.
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
  title: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  const { label, Icon, pill } = VERDICT_STYLE[verdict];
  return (
    <div
      className={`flex flex-col gap-3 rounded-2xl bg-white p-6 ${className ?? ''}`}
    >
      <span
        className={`inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${pill}`}
      >
        <Icon className="size-3" strokeWidth={2.5} aria-hidden="true" />
        {label}
      </span>
      <h3 className="text-[17px] font-semibold text-ink">{title}</h3>
      {children}
    </div>
  );
}

export function BravoDecisionCards() {
  return (
    <div className="flex flex-col gap-4">
      {/* Top row — the two clean calls */}
      <div className="grid gap-4 md:grid-cols-2">
        <CardShell verdict="cut" title="Threshold coupon">
          <p className="text-[14px] leading-[1.55] text-neutral-500">
            Paying for downloads, not customers. It drove installs that never
            came back, so it came out entirely.
          </p>
        </CardShell>

        <CardShell verdict="kept" title="Top-up bonus">
          <p className="text-[14px] leading-[1.55] text-neutral-500">
            Never enters the payment moment. Users loved it, it drove revenue,
            and the whole decision happens at home — long before the bill
            arrives.
          </p>
        </CardShell>
      </div>

      {/* Bottom — the rebuilt call gets the room, copy beside the proof */}
      <CardShell
        verdict="rebuilt"
        title={
          <span className="flex flex-wrap items-baseline gap-x-2">
            <span className="text-neutral-400 line-through">100 pts = $1</span>
            <span aria-hidden="true" className="text-neutral-300">
              →
            </span>
            <span>$1 = $1</span>
          </span>
        }
      >
        <div className="grid gap-x-8 gap-y-4 md:grid-cols-2 md:items-center">
          {/* Copy — ends by handing off to the chart */}
          <p className="text-[14px] leading-[1.6] text-neutral-500">
            Kept the engine, removed the math — points became a flat
            <span className="text-ink"> $1 = $1</span>, nothing to convert at
            checkout. Cashback stayed because the data was clear:{' '}
            <span className="text-ink">
              the more cashback a diner is holding, the more often they return.
            </span>
          </p>

          {/* Proof — the claim above, measured */}
          <div className="flex flex-col gap-1.5 rounded-xl bg-neutral-50 p-4">
            <p className="text-[11px] uppercase tracking-[0.1em] text-neutral-400">
              Monthly visits by cashback balance held
            </p>
            {TIERS.map((t) => (
              <div key={t.label} className="flex items-center gap-2 text-[12px]">
                <span
                  className={`w-[52px] shrink-0 ${
                    t.top ? 'font-semibold text-ink' : 'text-neutral-400'
                  }`}
                >
                  {t.label}
                </span>
                <span
                  className={`h-[7px] rounded-full ${
                    t.top ? 'bg-emerald-600' : 'bg-neutral-300'
                  }`}
                  style={{ width: `${t.width}%` }}
                  aria-hidden="true"
                />
                <span
                  className={
                    t.top
                      ? 'font-semibold text-emerald-600'
                      : 'text-neutral-400'
                  }
                >
                  {t.value}
                </span>
              </div>
            ))}
            <p className="mt-0.5 text-[11px] leading-[1.5] text-emerald-700">
              Diners with $30+ saved come back about twice as often as everyone
              else. · PostHog
            </p>
          </div>
        </div>
      </CardShell>
    </div>
  );
}
