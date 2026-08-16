'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowLeft, ChevronRight, Check, Sparkles } from 'lucide-react';

const STEPS = [
  'The bill arrives',
  'Check your wallet',
  'Top up your balance',
  'Apply your rewards',
  'Payment complete',
];

const TU_AMT = [50, 100, 200, 500];
const TU_BONUS = [2, 5, 12, 35];
const INITIAL_BALANCE = 70;

type Step = 0 | 1 | 2 | 3 | 4;

export function BravoPrototype() {
  const [step, setStep] = useState<Step>(0);
  const [scanning, setScanning] = useState(false);
  const [usePts, setUsePts] = useState(false);
  const [useCoup, setUseCoup] = useState(false);
  const [tuIdx, setTuIdx] = useState(-1);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    if (!usePts) setToast(null);
  }, [usePts]);

  const calcBill = () => {
    let b = 100;
    if (usePts) b -= 12.4;
    if (useCoup && b >= 100) b -= 15;
    return b;
  };

  const bill = calcBill();
  const cashbackPts = Math.round(bill * 5); // 5% as points (5x dollars)
  const cashbackDollars = bill * 0.05;
  const balance =
    INITIAL_BALANCE + (tuIdx >= 0 ? TU_AMT[tuIdx] + TU_BONUS[tuIdx] : 0);

  const goTo = (n: Step) => {
    setStep(n);
    setScanning(false);
  };

  const togglePts = () => {
    const next = !usePts;
    setUsePts(next);
    if (next && useCoup) setUseCoup(false); // conflict — points knock out coupon
  };

  const toggleCoup = () => {
    if (usePts) {
      setToast('Not available since your bill is now below $100');
      return;
    }
    setUseCoup((c) => !c);
  };

  const startScan = () => {
    setScanning(true);
    setTimeout(() => {
      setStep(4);
      setScanning(false);
    }, 2000);
  };

  const reset = () => {
    setStep(0);
    setUsePts(false);
    setUseCoup(false);
    setTuIdx(-1);
    setScanning(false);
  };

  const narratives = [
    '"You just finished dinner at a Michelin Recommended restaurant PiDGin…"',
    '"Before paying, you notice you don\'t have enough balance…"',
    '"So you decided to top up. Pick a tier. Each gives a different bonus…"',
    '"Before you show the code to pay, decide which rewards to use — but be careful, they affect each other…"',
    '"You finally made it!…"',
  ];
  const scanningNarrative = '"Server is scanning your phone for payment…"';
  const currentNarrative = scanning ? scanningNarrative : narratives[step];

  const containerRef = useRef<HTMLDivElement>(null);
  const [hasEntered, setHasEntered] = useState(false);
  useEffect(() => {
    if (hasEntered) return;
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setHasEntered(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasEntered]);

  const typed = useTypewriter(currentNarrative, hasEntered);

  return (
    <div
      ref={containerRef}
      className="bg-white rounded-2xl p-6 flex flex-col gap-5"
    >
      <div className="bg-neutral-100 rounded-xl py-4 px-4 flex items-center justify-center">
        <p className="text-[14px] text-neutral-600 text-center">
          {typed}
          {typed.length < currentNarrative.length && (
            <span className="typing-caret" aria-hidden="true">
              |
            </span>
          )}
        </p>
      </div>

      <style jsx>{`
        .typing-caret {
          display: inline-block;
          margin-left: 1px;
          color: rgb(82, 82, 82);
          animation: typing-caret-blink 800ms steps(1) infinite;
        }
        @keyframes typing-caret-blink {
          0%,
          50% {
            opacity: 1;
          }
          50.01%,
          100% {
            opacity: 0;
          }
        }
      `}</style>

      <div className="flex flex-col md:flex-row gap-6 items-stretch">
        <div className="flex flex-col w-full md:w-[200px] shrink-0">
          <Sidebar step={step} />
          <p className="mt-auto pt-6 text-[12px] text-neutral-400">
            This is not the end UI, only for demo 
          </p>
        </div>

        <div className="flex-1 flex justify-center w-full">
          <PhoneFrame toast={step === 3 && !scanning ? toast : null}>
            {step === 0 && <BillScreen onContinue={() => goTo(1)} />}
            {step === 1 && (
              <WalletScreen
                balance={INITIAL_BALANCE}
                onBack={() => goTo(0)}
                onTopUp={() => goTo(2)}
              />
            )}
            {step === 2 && (
              <TopUpScreen
                selected={tuIdx}
                onSelect={(i) => setTuIdx(i === tuIdx ? -1 : i)}
                onBack={() => goTo(1)}
                onConfirm={() => goTo(3)}
              />
            )}
            {step === 3 && !scanning && (
              <ApplyRewardsScreen
                usePts={usePts}
                useCoup={useCoup}
                balance={balance}
                bill={bill}
                cashbackPts={cashbackPts}
                cashbackDollars={cashbackDollars}
                onTogglePts={togglePts}
                onToggleCoup={toggleCoup}
                onBack={() => goTo(2)}
                onPay={startScan}
              />
            )}
            {step === 3 && scanning && <QrScanScreen balance={balance} />}
            {step === 4 && (
              <SuccessScreen
                bill={bill}
                usePts={usePts}
                useCoup={useCoup}
                tuIdx={tuIdx}
                cashbackPts={cashbackPts}
                cashbackDollars={cashbackDollars}
                onReset={reset}
              />
            )}
          </PhoneFrame>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
 Layout shells
 ─────────────────────────────────────────────────────────────────────── */

function PhoneFrame({
  children,
  toast,
}: {
  children: ReactNode;
  toast?: string | null;
}) {
  return (
    <div className="relative w-full max-w-[320px] h-[600px] rounded-[28px] border border-neutral-300 bg-white p-4 pt-11 pb-3 flex flex-col overflow-hidden">
      {children}
      {toast && (
        <div
          key={toast}
          role="status"
          className="bravo-toast absolute left-1/2 bottom-20 z-20 -translate-x-1/2 max-w-[260px] bg-ink text-white text-[12px] text-center px-3.5 py-2.5 rounded-lg shadow-[0_6px_24px_rgba(0,0,0,0.18)]"
        >
          {toast}
        </div>
      )}
      <style jsx>{`
        .bravo-toast {
          animation: bravo-toast-in 220ms cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        @keyframes bravo-toast-in {
          0% {
            opacity: 0;
            transform: translate(-50%, 8px);
          }
          100% {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
      `}</style>
    </div>
  );
}

function Sidebar({ step }: { step: number }) {
  return (
    <div className="w-full">
      <p className="text-[16px] font-medium text-ink mb-6">The scenario</p>
      <ol className="flex flex-col gap-0">
        {STEPS.map((label, i) => {
          const isActive = i === step;
          const isDone = i < step;
          return (
            <li key={label} className="flex items-start gap-3 py-5 relative">
              {i < STEPS.length - 1 && (
                <span
                  className="absolute left-[10.5px] top-[36px] w-px bg-neutral-200"
                  style={{ height: 'calc(100% - 16px)' }}
                />
              )}
              <span
                className={`relative z-10 size-[22px] rounded-full border flex items-center justify-center text-[10px] font-medium shrink-0 transition-colors ${
                  isActive
                    ? 'bg-ink border-ink text-white'
                    : isDone
                      ? 'bg-neutral-200 border-neutral-200 text-neutral-500'
                      : 'bg-white border-neutral-300 text-neutral-400'
                }`}
              >
                {isDone ? <Check size={11} strokeWidth={2.5} /> : i + 1}
              </span>
              <span
                className={`text-[14px] pt-[2px] ${
                  isActive ? 'text-ink font-medium' : 'text-neutral-500'
                }`}
              >
                {label}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
 Step 1 — Bill arrives
 ─────────────────────────────────────────────────────────────────────── */

function BillScreen({ onContinue }: { onContinue: () => void }) {
  return (
    <div className="relative flex flex-col h-full">
      <div className="flex items-center gap-2 p-1.5 pl-1.5 pr-3 bg-neutral-50 rounded-2xl mb-5 -mt-7 h-12">
        <div className="size-9 rounded-[10px] overflow-hidden shrink-0 bg-ink">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/work/bravo/pidgin-logo.jpg"
            alt="PiDGin"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col justify-between h-full py-1">
          <p className="text-[13px] text-ink leading-none">PiDGin</p>
          <p className="text-[10px] text-neutral-500 leading-none">
            350 Carrall St, Vancouver
          </p>
        </div>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center gap-1.5">
        <div className="text-[44px] font-semibold text-ink">$100.00</div>
        <div className="text-[12px] text-neutral-500 mt-1">
          Your bill tonight
        </div>
      </div>

      {/* Try me! handwritten annotation pointing down to the CTA */}
      <div className="absolute pointer-events-none left-1/2 -translate-x-1/2 bottom-[64px] flex items-start gap-2 select-none">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {/* 30% smaller than the original 24×58. */}
        <img
          src="/work/bravo/try-me-arrow.svg"
          alt=""
          aria-hidden="true"
          className="h-[41px] w-[17px] shrink-0 rotate-180"
        />
        <span
          className="mb-3 text-[26px] leading-none text-ink"
          style={{
            fontFamily: 'var(--font-hand), "Bradley Hand", cursive',
          }}
        >
          Try me!
        </span>
      </div>

      <CTA onClick={onContinue}>Pay with Bravo</CTA>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
 Step 2 — Wallet / Balance
 ─────────────────────────────────────────────────────────────────────── */

function WalletScreen({
  balance,
  onBack,
  onTopUp,
}: {
  balance: number;
  onBack: () => void;
  onTopUp: () => void;
}) {
  return (
    <div className="flex flex-col h-full">
      <BackRow label="View bill" onClick={onBack} />
      <div className="flex-1 flex flex-col items-center justify-center gap-3">
        <div className="text-[12px] text-neutral-500">Balance</div>
        <div className="text-[44px] font-semibold text-ink">
          ${balance.toFixed(2)}
        </div>
        <div className="inline-flex items-center gap-1.5 bg-neutral-100 rounded-full px-2.5 py-1 mt-1">
          <Sparkles size={12} strokeWidth={2} className="text-ink" />
          <span className="text-[12px] text-ink">
            1240 points ($12.4 redeemable)
          </span>
        </div>
      </div>
      <CTA onClick={onTopUp}>Top up now</CTA>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
 Step 3 — Top up
 ─────────────────────────────────────────────────────────────────────── */

function TopUpScreen({
  selected,
  onSelect,
  onBack,
  onConfirm,
}: {
  selected: number;
  onSelect: (i: number) => void;
  onBack: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="flex flex-col h-full">
      <BackRow label="View balance" onClick={onBack} />
      <div className="flex-1 flex flex-col gap-4">
        <div className="text-[12px] text-neutral-500 text-center">
          Choose amount
        </div>
        <div className="grid grid-cols-2 gap-2">
          {TU_AMT.map((amt, i) => {
            const isSel = i === selected;
            return (
              <button
                key={amt}
                type="button"
                onClick={() => onSelect(i)}
                className={`rounded-xl px-3 py-3 text-center transition-colors ${
                  isSel
                    ? 'bg-ink text-white border border-ink'
                    : 'bg-white border border-neutral-200 text-ink hover:border-neutral-400'
                }`}
              >
                <div className="text-[18px] font-semibold">${amt}</div>
                <div
                  className={`text-[11px] mt-1.5 ${
                    isSel ? 'text-emerald-300' : 'text-emerald-600'
                  }`}
                >
                  +${TU_BONUS[i]} bonus
                </div>
              </button>
            );
          })}
        </div>
        {selected >= 0 && (
          <div className="text-center text-[13px] text-neutral-700">
            <div className="font-semibold text-ink">
              New balance: $
              {(
                INITIAL_BALANCE +
                TU_AMT[selected] +
                TU_BONUS[selected]
              ).toFixed(2)}
            </div>
            <div className="text-[12px] text-neutral-500 mt-1">
              Current balance: ${INITIAL_BALANCE}
            </div>
            <div className="text-[12px] text-neutral-500">
              Top up: ${TU_AMT[selected]} + ${TU_BONUS[selected]}
            </div>
          </div>
        )}
      </div>
      <CTA onClick={onConfirm} disabled={selected < 0}>
        Top up now
      </CTA>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
 Step 4 — Apply rewards
 ─────────────────────────────────────────────────────────────────────── */

function ApplyRewardsScreen({
  usePts,
  useCoup,
  balance,
  bill,
  cashbackPts,
  cashbackDollars,
  onTogglePts,
  onToggleCoup,
  onBack,
  onPay,
}: {
  usePts: boolean;
  useCoup: boolean;
  balance: number;
  bill: number;
  cashbackPts: number;
  cashbackDollars: number;
  onTogglePts: () => void;
  onToggleCoup: () => void;
  onBack: () => void;
  onPay: () => void;
}) {
  return (
    <div className="flex flex-col h-full">
      <BackRow label="View balance" onClick={onBack} />

      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="flex flex-col">
          <RewardRow
            name="Redeem 1240 points"
            desc={usePts ? 'Applied -$12.40' : 'Worth $12.40'}
            descColor={usePts ? 'text-emerald-600' : 'text-neutral-500'}
            on={usePts}
            onToggle={onTogglePts}
          />
          <RewardRow
            name="$15 off coupon"
            desc={
              usePts
                ? 'Bill is $87.60, below $100'
                : useCoup
                  ? 'Applied -$15.00'
                  : 'Requires $100 minimum spend'
            }
            descColor={
              usePts
                ? 'text-rose-600'
                : useCoup
                  ? 'text-emerald-600'
                  : 'text-neutral-500'
            }
            on={useCoup}
            onToggle={onToggleCoup}
            locked={usePts}
          />
          <div className="flex items-start justify-between py-3 border-b border-neutral-100">
            <div>
              <div className="text-[13px] font-medium text-ink">
                5% points back
              </div>
              <div className="text-[11px] text-neutral-500 mt-0.5">
                Always applied automatically
              </div>
            </div>
            <div className="text-right">
              <div className="text-[12px] font-medium text-emerald-600">
                + {cashbackPts} points
              </div>
              <div className="text-[12px] text-emerald-600">
                + ${cashbackDollars.toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-neutral-50 rounded-xl p-3.5 mt-4">
          <SumRow label="Your balance" value={`$${balance.toFixed(2)}`} />
          <div className="h-px bg-neutral-200 my-2.5" />
          <SumRow label="Bill total" value="$100.00" />
          {usePts && (
            <SumRow
              label="Points redeemed"
              value="-$12.40"
              valueClass="text-emerald-600"
            />
          )}
          {useCoup && (
            <SumRow
              label="Coupon discount"
              value="-$15.00"
              valueClass="text-emerald-600"
            />
          )}
          <div className="flex items-center justify-between mt-2">
            <span className="text-[13px] font-medium text-ink">You pay</span>
            <span className="text-[14px] font-medium text-ink">
              ${bill.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-end mt-2">
            <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[11px] font-medium px-2.5 py-1 rounded-full">
              <Sparkles size={11} strokeWidth={2} />
              +${cashbackPts} points
            </span>
          </div>
        </div>
      </div>

      <CTA onClick={onPay}>Show code to pay</CTA>
    </div>
  );
}

function RewardRow({
  name,
  desc,
  descColor,
  on,
  onToggle,
  locked = false,
}: {
  name: string;
  desc: string;
  descColor: string;
  on: boolean;
  onToggle: () => void;
  locked?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-neutral-100">
      <div>
        <div className="text-[13px] font-medium text-ink">{name}</div>
        <div className={`text-[11px] mt-0.5 ${descColor}`}>{desc}</div>
      </div>
      <button
        type="button"
        onClick={onToggle}
        aria-disabled={locked}
        aria-pressed={on}
        className={`relative w-12 h-7 rounded-full transition-colors duration-200 shrink-0 ${
          locked ? 'opacity-40 cursor-not-allowed' : ''
        } ${on ? 'bg-emerald-500' : 'bg-neutral-300'}`}
      >
        <span
          className="absolute top-[3px] left-[3px] w-[22px] h-[22px] bg-white rounded-full shadow transition-transform duration-200 ease-out"
          style={{ transform: on ? 'translateX(20px)' : 'translateX(0)' }}
        />
      </button>
    </div>
  );
}

function SumRow({
  label,
  value,
  valueClass = 'text-ink',
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-[12px] text-neutral-600">{label}</span>
      <span className={`text-[12px] font-medium ${valueClass}`}>{value}</span>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
 Step 4.5 — QR scan
 ─────────────────────────────────────────────────────────────────────── */

function QrScanScreen({ balance }: { balance: number }) {
  return (
    <div className="flex flex-col h-full">
      <div className="text-center text-[15px] font-semibold text-ink mt-2 mb-4">
        Bravo balance
      </div>
      <div className="bg-white border border-neutral-200 rounded-2xl p-5 mx-auto relative overflow-hidden">
        <div className="relative">
          <QrPattern />
          <div className="absolute inset-0 pointer-events-none qr-scan-line" />
        </div>
        <div className="mt-4 flex items-center justify-between bg-neutral-50 rounded-xl px-3 py-2">
          <span className="text-[12px] text-ink">Default</span>
          <span className="size-5 rounded-full bg-emerald-500 flex items-center justify-center">
            <Check size={12} className="text-white" strokeWidth={2.5} />
          </span>
        </div>
      </div>
      <div className="text-center text-[12px] text-neutral-500 mt-3">
        Show the code to servers
      </div>
      <div className="flex items-center justify-center gap-1.5 mt-2">
        <span className="size-1.5 rounded-full bg-ink" />
        <span className="size-1.5 rounded-full bg-neutral-300" />
        <span className="size-1.5 rounded-full bg-neutral-300" />
      </div>
      <div className="mt-auto">
        <div className="bg-ink rounded-2xl px-4 py-3 flex items-center justify-between">
          <div>
            <div className="text-[14px] font-semibold text-white">
              ${balance.toFixed(2)} available
            </div>
            <div className="text-[11px] text-neutral-400">Top up</div>
          </div>
          <ChevronRight size={18} className="text-white" />
        </div>
      </div>

      <style jsx>{`
        .qr-scan-line {
          background: linear-gradient(
            180deg,
            transparent 0%,
            rgba(16, 185, 129, 0) 40%,
            rgba(16, 185, 129, 0.6) 50%,
            rgba(16, 185, 129, 0) 60%,
            transparent 100%
          );
          height: 32%;
          animation: qr-scan 2s ease-in-out forwards;
        }
        @keyframes qr-scan {
          0% {
            transform: translateY(-32%);
          }
          100% {
            transform: translateY(310%);
          }
        }
      `}</style>
    </div>
  );
}

function QrPattern() {
  // 21x21 simplified QR-like pattern. Static — purely decorative.
  const SIZE = 21;
  const cells: boolean[] = Array.from({ length: SIZE * SIZE }, (_, i) => {
    // Position-finder squares (corners)
    const x = i % SIZE;
    const y = Math.floor(i / SIZE);
    const inFinder = (cx: number, cy: number) =>
      x >= cx && x < cx + 7 && y >= cy && y < cy + 7;
    if (inFinder(0, 0) || inFinder(SIZE - 7, 0) || inFinder(0, SIZE - 7)) {
      const lx = inFinder(0, 0)
        ? x
        : inFinder(SIZE - 7, 0)
          ? x - (SIZE - 7)
          : x;
      const ly = inFinder(0, 0)
        ? y
        : inFinder(0, SIZE - 7)
          ? y - (SIZE - 7)
          : y;
      const onEdge = lx === 0 || lx === 6 || ly === 0 || ly === 6;
      const inCenter = lx >= 2 && lx <= 4 && ly >= 2 && ly <= 4;
      return onEdge || inCenter;
    }
    // Pseudo-random data
    return (x * 31 + y * 17 + x * y) % 7 < 3;
  });
  return (
    <div
      className="grid w-[180px] h-[180px]"
      style={{ gridTemplateColumns: `repeat(${SIZE}, 1fr)` }}
    >
      {cells.map((on, i) => (
        <span key={i} className={on ? 'bg-ink' : 'bg-white'} />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
 Step 5 — Success
 ─────────────────────────────────────────────────────────────────────── */

function SuccessScreen({
  bill,
  usePts,
  useCoup,
  tuIdx,
  cashbackPts,
  cashbackDollars,
  onReset,
}: {
  bill: number;
  usePts: boolean;
  useCoup: boolean;
  tuIdx: number;
  cashbackPts: number;
  cashbackDollars: number;
  onReset: () => void;
}) {
  const couponSaved = useCoup && !usePts ? 15 : 0;
  const pointsSaved = usePts ? 12.4 : 0;
  const tuBonus = tuIdx >= 0 ? TU_BONUS[tuIdx] : 0;
  const totalEarned = couponSaved + pointsSaved + tuBonus + cashbackDollars;

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="text-center mt-2 mb-1">
        <div className="flex items-center justify-center gap-2 text-[18px] font-semibold text-ink">
          <span className="payment-success-check inline-flex items-center justify-center size-5 rounded-full bg-emerald-500">
            <Check
              size={12}
              strokeWidth={3}
              className="text-white payment-success-check-tick"
            />
          </span>
          <span>Payment Successful!</span>
        </div>
        <div className="text-[12px] text-neutral-500 mt-1">
          ${bill.toFixed(2)} paid · {cashbackPts} points earned
        </div>
      </div>

      <style jsx>{`
        .payment-success-check {
          animation: payment-success-pop 420ms cubic-bezier(0.34, 1.56, 0.64, 1)
            both;
        }
        :global(.payment-success-check-tick) {
          animation: payment-success-tick 320ms ease-out 180ms both;
          transform-origin: center;
        }
        @keyframes payment-success-pop {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          60% {
            transform: scale(1.18);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        @keyframes payment-success-tick {
          0% {
            transform: scale(0.4);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>

      <div className="mt-4 space-y-2">
        <SumRow label="Bill total" value="$100.00" />
        {usePts && (
          <SumRow
            label="Points redeemed"
            value="-$12.40"
            valueClass="text-emerald-600"
          />
        )}
        {useCoup && !usePts && (
          <SumRow
            label="Coupon applied"
            value="-$15.00"
            valueClass="text-emerald-600"
          />
        )}
        <div className="flex items-center justify-between pt-2 border-t border-neutral-200 mt-2">
          <span className="text-[13px] font-medium text-ink">Amount paid</span>
          <span className="text-[14px] font-medium text-ink">
            ${bill.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="bg-neutral-50 rounded-xl p-3.5 mt-4">
        <div className="text-[11px] uppercase text-neutral-500 mb-2">
          In this bill:
        </div>
        {useCoup && !usePts && <SumRow label="Coupon applied" value="$15.00" />}
        {tuIdx >= 0 && (
          <SumRow
            label="Top-up bonus earned"
            value={`$${tuBonus.toFixed(2)}`}
          />
        )}
        <div className="flex items-start justify-between py-1">
          <span className="text-[12px] text-neutral-600">Points earned</span>
          <div className="text-right">
            <div className="text-[12px] font-medium text-ink">
              ${cashbackDollars.toFixed(2)}
            </div>
            <div className="text-[11px] text-neutral-500">
              {cashbackPts} points
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-neutral-200 mt-2">
          <span className="text-[13px] font-medium text-ink">Total earned</span>
          <span className="text-[14px] font-medium text-ink">
            ${totalEarned.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="mt-auto pt-4">
        <button
          type="button"
          onClick={onReset}
          className="w-full rounded-2xl border border-neutral-300 text-ink text-[13px] font-medium py-3 hover:bg-neutral-50 transition-colors"
        >
          Try a different combination
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
 Shared bits
 ─────────────────────────────────────────────────────────────────────── */

function CTA({
  children,
  onClick,
  disabled = false,
}: {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`mt-4 w-full rounded-2xl bg-ink text-white text-[13px] font-semibold py-3 transition-opacity ${
        disabled ? 'opacity-40 cursor-not-allowed' : 'hover:opacity-90'
      }`}
    >
      {children}
    </button>
  );
}

function BackRow({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1.5 mb-3 text-neutral-700"
    >
      <ArrowLeft size={16} />
      <span className="text-[12px]">{label}</span>
    </button>
  );
}

function useTypewriter(text: string, enabled = true, baseDelayMs = 32) {
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    setDisplayed('');
    if (!enabled || !text) return;
    let cancelled = false;
    let i = 0;

    const delayFor = (justTyped: string) => {
      // Human-feel rhythm: jitter ±35%, longer pauses after punctuation,
      // a touch quicker on whitespace.
      let d = baseDelayMs * (0.65 + Math.random() * 0.7);
      if (',;:'.includes(justTyped)) d += 140;
      else if ('.!?'.includes(justTyped)) d += 260;
      else if (justTyped === '—') d += 180;
      else if (justTyped === ' ') d *= 0.75;
      return d;
    };

    let timer = window.setTimeout(function tick() {
      if (cancelled) return;
      i += 1;
      setDisplayed(text.slice(0, i));
      if (i < text.length) {
        timer = window.setTimeout(tick, delayFor(text[i - 1]));
      }
    }, 80);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [text, enabled, baseDelayMs]);

  return displayed;
}
