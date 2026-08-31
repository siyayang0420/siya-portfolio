/**
 * What answering "how much did I save?" actually took on a single $100 bill.
 *
 * Set as a ledger, not a diagram. An earlier pass boxed every step, numbered
 * it, and chevroned one row into the next — which put four borders, four
 * badges and three arrows around what is, in the end, a short sum. The chrome
 * competed with the figures.
 *
 * So: no per-row boxes, no numbering, no connectors. Rows separated by a
 * hairline, labels left in ink, amounts right in muted tabular figures so the
 * column reads as arithmetic. The step count still lands — you can count the
 * rules — and the answer arrives only at the bottom, which is the argument:
 * nobody standing at a table could hold this.
 */

/**
 * `tone` colours the amount, not the label.
 *
 * Green for value gained, rose for value spent, muted for the rate — which is
 * an operation rather than an amount, so colouring it would imply a direction
 * it doesn't have. The two accents are `emerald-600` and `rose-600`, the exact
 * pair the prototype above already uses for earned and saved, so the ledger
 * reads in the same language as the screens it is describing.
 */
const STEPS: { label: string; effect: string; tone: 'gain' | 'spend' | 'rate' }[] = [
  { label: 'Top up $100', effect: '+ $5 bonus balance', tone: 'gain' },
  { label: 'Pay a $100 bill', effect: '− $15 coupon today', tone: 'spend' },
  { label: '$85 charged', effect: '× 5% cashback', tone: 'rate' },
  { label: 'Cashback earned', effect: '+ $4.25 for later', tone: 'gain' },
];

const TONE = {
  gain: 'text-emerald-600',
  spend: 'text-rose-600',
  rate: 'text-muted',
} as const;

export function BravoSavingMath() {
  return (
    <figure className="m-0 flex flex-col gap-2">
      <div className="bg-white rounded-xl p-6 flex flex-col gap-4">
        <span className="text-[12px] text-muted">A typical $100 bill</span>

        <ul className="flex flex-col">
          {STEPS.map((step, i) => (
            <li
              key={step.label}
              className={`flex items-baseline justify-between gap-4 py-2.5 ${
                i > 0 ? 'border-t border-line' : ''
              }`}
            >
              <span className="text-[14px] text-ink">{step.label}</span>
              <span className={`text-[14px] tabular-nums shrink-0 ${TONE[step.tone]}`}>
                {step.effect}
              </span>
            </li>
          ))}
        </ul>

        <div className="border-t border-line pt-4 flex items-baseline justify-between gap-4">
          <span className="text-[14px] text-ink">
            &ldquo;So how much did I save?&rdquo;
          </span>
          <span className="text-[16px] font-semibold text-ink tabular-nums shrink-0">
            $24.25
          </span>
        </div>
      </div>

      <figcaption className="text-[12px] text-muted">
        A simple question about savings required explaining what applied now, what was earned later, and what required topping up first.
      </figcaption>
    </figure>
  );
}
