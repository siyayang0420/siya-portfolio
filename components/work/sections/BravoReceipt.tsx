'use client';

import { useEffect, useRef, useState } from 'react';

/* Transaction frequency by points balance held — PostHog, 90-day cohorts.
   Bar widths are % of the receipt's printable width, scaled to the top tier. */
const TIERS = [
  { label: '$0–10', value: '4.5', width: 31, top: false },
  { label: '$10–20', value: '4.8', width: 33, top: false },
  { label: '$20–30', value: '5.2', width: 36, top: false },
  { label: '$30+', value: '9.03', width: 62, top: true },
];

const BARCODE = [3, 1, 4, 2, 1, 3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 3];

export function BravoReceipt() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [printed, setPrinted] = useState(false);

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPrinted(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setPrinted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // Each printed line gets a staggered transition delay in render order.
  let line = 0;
  const delay = () => ({ '--d': `${line++ * 110}ms` }) as React.CSSProperties;

  return (
    <div ref={rootRef} className={printed ? 'r-printed' : undefined}>
      <style jsx>{`
        .r-line {
          opacity: 0;
          transform: translateY(4px);
        }
        .r-printed .r-line {
          opacity: 1;
          transform: translateY(0);
          transition:
            opacity 0.35s ease,
            transform 0.35s ease;
          transition-delay: var(--d);
        }
        .r-bar {
          transform: scaleX(0);
          transform-origin: left;
        }
        .r-printed .r-bar {
          transform: scaleX(1);
          transition: transform 0.5s ease;
          transition-delay: var(--d);
        }
        @media (prefers-reduced-motion: reduce) {
          .r-line,
          .r-printed .r-line {
            opacity: 1;
            transform: none;
            transition: none;
          }
          .r-bar,
          .r-printed .r-bar {
            transform: scaleX(1);
            transition: none;
          }
        }
      `}</style>

      <div
        className="mx-auto w-full max-w-[400px] bg-white px-6 pt-7 pb-6 text-[12.5px] leading-[1.7] text-ink [clip-path:polygon(0_0,100%_0,100%_calc(100%-8px),96%_100%,92%_calc(100%-8px),88%_100%,84%_calc(100%-8px),80%_100%,76%_calc(100%-8px),72%_100%,68%_calc(100%-8px),64%_100%,60%_calc(100%-8px),56%_100%,52%_calc(100%-8px),48%_100%,44%_calc(100%-8px),40%_100%,36%_calc(100%-8px),32%_100%,28%_calc(100%-8px),24%_100%,20%_calc(100%-8px),16%_100%,12%_calc(100%-8px),8%_100%,4%_calc(100%-8px),0_100%)]"
      >
        <div className="r-line text-center text-[14px] tracking-[0.2em]" style={delay()}>
          BRAVO REWARDS
        </div>
        <div className="r-line text-center text-neutral-400" style={delay()}>
          decision receipt · metro vancouver
        </div>
        <div className="r-line my-2.5 border-t border-dashed border-neutral-300" style={delay()} />

        <div className="r-line flex justify-between gap-2" style={delay()}>
          <span>THRESHOLD COUPON</span>
          <span className="font-semibold text-neutral-400">VOID</span>
        </div>
        <div className="r-line pl-3 text-neutral-400" style={delay()}>
          paying for downloads, not customers
        </div>
        <div className="r-line h-2" style={delay()} />

        <div className="r-line flex justify-between gap-2" style={delay()}>
          <span className="text-neutral-400 line-through">POINTS 100PTS=$1</span>
          <span className="font-semibold text-emerald-600">REBUILT</span>
        </div>
        <div className="r-line pl-3" style={delay()}>
          → CASHBACK&nbsp;&nbsp;$1 = $1
        </div>
        {/* <div className="r-line pl-3 text-neutral-400" style={delay()}>
          engine kept, math removed
        </div> */}

        {/* <div className="r-line mt-2 mb-1 pl-3 text-neutral-400" style={delay()}>
          ITEMIZED — WHY THE ENGINE STAYED
        </div> */}
        <div className="r-line pl-3 text-neutral-400" style={delay()}>
          avg transactions by points held*
        </div>
        {TIERS.map((tier) => (
          <div
            key={tier.label}
            className="r-line flex items-center gap-2 pl-3"
            style={delay()}
          >
            <span
              className={`w-[58px] shrink-0 ${
                tier.top ? 'font-semibold' : 'text-neutral-400'
              }`}
            >
              {tier.label}
            </span>
            <span
              className={`r-bar block h-[9px] rounded-[100px] ${
                tier.top ? 'bg-emerald-600' : 'bg-neutral-300'
              }`}
              style={{ ...delay(), width: `${tier.width}%` }}
              aria-hidden="true"
            />
            <span
              className={
                tier.top ? 'font-semibold text-emerald-600' : 'text-neutral-400'
              }
            >
              {tier.value}
            </span>
          </div>
        ))}
        <div className="r-line pl-3 text-emerald-700 font-medium" style={delay()}>
          ≈2× every tier below — money in the
        </div>
        <div className="r-line pl-3 text-emerald-700 font-medium" style={delay()}>
          wallet acts as a return ticket
        </div>
        <div className="r-line pl-3 text-neutral-300" style={delay()}>
          * data from Posthog
        </div>
        <div className="r-line h-2" style={delay()} />

        <div className="r-line flex justify-between gap-2" style={delay()}>
          <span>TOP-UP BONUS</span>
          <span className="font-semibold text-emerald-600">KEPT</span>
        </div>
        <div className="r-line pl-3 text-neutral-400" style={delay()}>
          never enters the payment moment
        </div>

        <div className="r-line my-2.5 border-t border-dashed border-neutral-300" style={delay()} />
        <div className="r-line flex justify-between gap-2 text-[13px] font-semibold" style={delay()}>
          <span>COMPLEXITY AT CHECKOUT</span>
          <span>$0.00</span>
        </div>
        <div className="r-line flex justify-between gap-2 text-neutral-400" style={delay()}>
          <span>LEVERS KEPT BY BUSINESS</span>
          <span>ALL</span>
        </div>
        <div className="r-line my-2.5 border-t border-dashed border-neutral-300" style={delay()} />
        <div className="r-line text-center tracking-[0.14em]" style={delay()}>
          THANK YOU
        </div>
        <div className="r-line text-center text-neutral-400" style={delay()}>
          see you next meal
        </div>
        <div
          className="r-line mt-2.5 flex justify-center gap-[2px]"
          style={delay()}
          aria-hidden="true"
        >
          {BARCODE.map((w, i) => (
            <span
              key={i}
              className="h-[26px] bg-ink"
              style={{ width: w }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
