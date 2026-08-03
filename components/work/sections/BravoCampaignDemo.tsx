'use client';

import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import {
  ArrowLeft,
  Calendar,
  ChevronRight,
  ChevronUp,
  CircleQuestionMark,
  Clock,
  Globe,
  Heart,
  MapPin,
  Share,
  Star,
} from 'lucide-react';

type CashbackMode = 'percentage' | 'amount';

const HELP = {
  firstVisit: 'Rate for a diner’s first-ever order.',
  returnVisit: 'Rate for every order after the first.',
  amount: 'Flat dollar cashback instead of a percentage.',
  maxCashback: 'Cap per transaction.',
  minSpend: 'Minimum bill before cashback applies.',
  dates: 'Days the campaign runs.',
  allTime: 'Always-on, no end date.',
  allDay: 'Live the whole day, every day in the range.',
  dailyWindow: 'Hours the offer is active each day.',
  minVisits: 'Unlocks after N visits.',
  minSpendReq: 'Unlocks after $X total spent.',
};

export function BravoCampaignDemo() {
  // ── State ─────────────────────────────────────────────────────────────────
  const [cashbackMode, setCashbackMode] = useState<CashbackMode>('percentage');
  const [firstVisit, setFirstVisit] = useState(8);
  const [returnVisit, setReturnVisit] = useState(5);

  const [maxOn, setMaxOn] = useState(false);
  const [maxValue, setMaxValue] = useState(10);

  const [minSpendOn, setMinSpendOn] = useState(false);
  const [minSpendValue, setMinSpendValue] = useState(10);

  // Dates say which days the campaign runs; the hours mode says what part of
  // each day. Defaults to today + a 4:30–6:00pm daily window so the demo
  // always shows a "live" happy hour regardless of when the visitor lands.
  // Computed once with lazy init to keep stable across re-renders.
  const [startDate, setStartDate] = useState(() => todayDate());
  const [endDate, setEndDate] = useState(() => todayDate());
  const [allTime, setAllTime] = useState(false);
  const [hoursMode, setHoursMode] = useState<'allDay' | 'window'>('window');
  const [startTime, setStartTime] = useState('16:30');
  const [endTime, setEndTime] = useState('18:00');

  // Earliest selectable start date = today (local). Computed once on mount
  // to avoid hydration drift and to keep the min stable while the user edits.
  const [todayMin] = useState(() => todayDate());

  const [visitsOn, setVisitsOn] = useState(false);
  const [visitsValue, setVisitsValue] = useState(3);

  const [spendReqOn, setSpendReqOn] = useState(false);
  const [spendReqValue, setSpendReqValue] = useState(130);

  // ── Derived ───────────────────────────────────────────────────────────────
  // Badge shows the first-visit rate in both modes (% or $).
  const cashbackLabel =
    cashbackMode === 'percentage' ? `${firstVisit}%` : `$${firstVisit}`;

  // Headline: "Up to $X back" only when a max cap is set, otherwise the offer
  // applies to "All in-store purchase".
  const headlineMaxLabel = maxOn
    ? `Up to $${maxValue} back`
    : 'All in-store purchase';

  const endLabel = useMemo(() => formatEndDate(endDate), [endDate]);

  // Clock row only exists when a daily window is set; all-day campaigns show
  // dates alone.
  const startTimeLabel = hoursMode === 'window' ? formatClock(startTime) : '';
  const endTimeLabel = hoursMode === 'window' ? formatClock(endTime) : '';

  // Date label shown on the date/time variant:
  //   same calendar day → "Sat, Jun 20" (weekday + date, not just a weekday,
  //                        so a one-day window doesn't read as recurring)
  //   multi-day window  → "Jun 20 – Jun 24"
  const isMultiDay = Boolean(startDate && endDate && startDate !== endDate);
  const dateRangeLabel = useMemo(() => {
    if (allTime) return '';
    const s = Date.parse(`${startDate}T00:00`);
    const e = Date.parse(`${endDate}T00:00`);
    if (Number.isNaN(s) || Number.isNaN(e)) return '';
    if (startDate === endDate) {
      const d = new Date(s);
      return `${DAYS[d.getDay()].slice(0, 3)}, ${formatShortDate(startDate)}`;
    }
    return `${formatShortDate(startDate)} – ${formatShortDate(endDate)}`;
  }, [allTime, startDate, endDate]);

  // "daily" suffix on the clock row: only needed when the same hours repeat
  // across multiple days — that's the case the card used to leave ambiguous.
  const dailyHours = hoursMode === 'window' && isMultiDay;

  // Variant selection. Variant 3 is used whenever a date/time window is set
  // (i.e. "All time" is off and no other requirement variants take priority).
  let variant: 1 | 2 | 3 | 4 = 4;
  if (spendReqOn) variant = 1;
  else if (visitsOn) variant = 2;
  else if (!allTime) variant = 3;
  else variant = 4;

  // For variant 4, headline depends on whether first-visit and return-visit
  // rates are differentiated (true for both percentage and amount modes).
  const sameRate = firstVisit === returnVisit;

  // Requirement variants (min visits / min spend) take over the card, so the
  // active-hours controls are moot while one is on — disable them.
  const requirementOn = visitsOn || spendReqOn;

  // Start can never be later than end — for dates and for the daily window.
  // ISO date strings and HH:MM strings both compare correctly as strings.
  const handleStartDateChange = (next: string) => {
    setStartDate(next);
    if (next && endDate && next > endDate) setEndDate(next);
  };
  const handleStartTimeChange = (next: string) => {
    setStartTime(next);
    if (next && endTime && next >= endTime) {
      const [h, m] = next.split(':').map(Number);
      const total = Math.min(h * 60 + m + 90, 23 * 60 + 59);
      setEndTime(
        `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(
          total % 60,
        ).padStart(2, '0')}`,
      );
    }
  };

  // ── Scroll-triggered "this is editable" demo ─────────────────────────────
  // When the form scrolls into view for the first time, briefly flip the Max
  // cashback toggle on then back off — so visitors immediately see that the
  // admin panel is interactive. The toggle row gets a matching emerald pulse
  // ring (mirrors the OfferItem live-update animation).
  const demoSectionRef = useRef<HTMLDivElement>(null);
  const hasPlayedDemoRef = useRef(false);
  const [highlightMax, setHighlightMax] = useState(false);
  useEffect(() => {
    const node = demoSectionRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting || hasPlayedDemoRef.current) return;
        hasPlayedDemoRef.current = true;
        const t0 = window.setTimeout(() => {
          setHighlightMax(true);
          setMaxOn(true);
        }, 400);
        const t1 = window.setTimeout(() => setMaxOn(false), 1900);
        const t2 = window.setTimeout(() => setHighlightMax(false), 2700);
        // Stash for cleanup if the component unmounts mid-sequence.
        node.dataset.timers = [t0, t1, t2].join(',');
      },
      { threshold: 0.35 },
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      const timers = node.dataset.timers?.split(',') ?? [];
      timers.forEach((t) => window.clearTimeout(Number(t)));
    };
  }, []);

  return (
    <div className="flex flex-col gap-6 pt-12">
          <div className="flex flex-col gap-1">
            <p className="text-[16px] text-ink">The Demo</p>
            <h2 className="text-[24px] font-semibold text-ink">
              Don&apos;t take my word for the flexibility. Try it.
            </h2>
          </div>
          <div
            ref={demoSectionRef}
            className="bg-white rounded-2xl p-5 flex flex-col gap-5"
          >
            <style jsx>{`
              @keyframes demoPulseRing {
                0%,
                100% {
                  box-shadow: 0 0 0 0 rgba(52, 211, 153, 0);
                }
                50% {
                  box-shadow: 0 0 0 4px rgba(52, 211, 153, 0.45);
                }
              }
              :global(.demo-pulse-ring) {
                animation: demoPulseRing 1100ms ease-in-out 0s 2;
              }
              @media (prefers-reduced-motion: reduce) {
                :global(.demo-pulse-ring) {
                  animation: none;
                }
              }
            `}</style>
            <div className="bg-neutral-100 rounded-xl py-3 px-4 flex items-center justify-center">
              <p className="text-[14px] text-neutral-600 text-center">
                Change anything on the left, and see the phone preview.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-5 items-stretch">
            {/* ── Left: Configuration form ─────────────────────────── */}
            <div className="flex flex-col gap-5 text-[14px] text-ink">
              <Group label="Set Cashback">
                <Radio
                  checked={cashbackMode === 'percentage'}
                  onChange={() => setCashbackMode('percentage')}
                  label="Percentage"
                />
                {cashbackMode === 'percentage' && (
                  <div className="flex flex-col gap-2 pl-6">
                    <NumberRow
                      label="First visit"
                      tooltip={HELP.firstVisit}
                      value={firstVisit}
                      onChange={setFirstVisit}
                      suffix="%"
                    />
                    <NumberRow
                      label="Return visits"
                      tooltip={HELP.returnVisit}
                      value={returnVisit}
                      onChange={setReturnVisit}
                      suffix="%"
                    />
                  </div>
                )}
                <Radio
                  checked={cashbackMode === 'amount'}
                  onChange={() => setCashbackMode('amount')}
                  label="Amount"
                />
                {cashbackMode === 'amount' && (
                  <div className="flex flex-col gap-2 pl-6">
                    <NumberRow
                      label="First visit"
                      tooltip={HELP.firstVisit}
                      value={firstVisit}
                      onChange={setFirstVisit}
                      suffix="$"
                    />
                    <NumberRow
                      label="Return visits"
                      tooltip={HELP.returnVisit}
                      value={returnVisit}
                      onChange={setReturnVisit}
                      suffix="$"
                    />
                  </div>
                )}
              </Group>

              <Group label="Set threshold">
                <div
                  className={`rounded-md transition-shadow ${
                    highlightMax ? 'demo-pulse-ring' : ''
                  }`}
                >
                  <ToggleRow
                    label="Max cashback"
                    tooltip={HELP.maxCashback}
                    on={maxOn}
                    onToggle={() => setMaxOn((v) => !v)}
                  >
                    {maxOn && (
                      <NumberInput
                        value={maxValue}
                        onChange={setMaxValue}
                        suffix="$"
                      />
                    )}
                  </ToggleRow>
                </div>
                <ToggleRow
                  label="Min spend"
                  tooltip={HELP.minSpend}
                  on={minSpendOn}
                  onToggle={() => setMinSpendOn((v) => !v)}
                >
                  {minSpendOn && (
                    <NumberInput
                      value={minSpendValue}
                      onChange={setMinSpendValue}
                      suffix="$"
                    />
                  )}
                </ToggleRow>
              </Group>

              <Group label="Set dates">
                <FieldRow label="Start date" tooltip={HELP.dates}>
                  <DateTimeInput
                    type="date"
                    value={startDate}
                    onChange={handleStartDateChange}
                    disabled={allTime}
                    min={todayMin}
                  />
                </FieldRow>
                <FieldRow label="End date" tooltip={HELP.dates}>
                  <DateTimeInput
                    type="date"
                    value={endDate}
                    onChange={setEndDate}
                    disabled={allTime}
                    min={startDate || todayMin}
                  />
                </FieldRow>
                <ToggleRow
                  label="All time"
                  tooltip={HELP.allTime}
                  on={allTime}
                  onToggle={() => setAllTime((v) => !v)}
                />
              </Group>

              <Group label="Set active hours">
                <RadioRow
                  label="All day"
                  tooltip={HELP.allDay}
                  checked={hoursMode === 'allDay'}
                  disabled={requirementOn}
                  onSelect={() => setHoursMode('allDay')}
                />
                <RadioRow
                  label="Daily window"
                  tooltip={HELP.dailyWindow}
                  checked={hoursMode === 'window'}
                  disabled={requirementOn}
                  onSelect={() => setHoursMode('window')}
                />
                {hoursMode === 'window' && (
                  <>
                    <FieldRow label="From" tooltip={HELP.dailyWindow}>
                      <DateTimeInput
                        type="time"
                        value={startTime}
                        onChange={handleStartTimeChange}
                        disabled={requirementOn}
                      />
                    </FieldRow>
                    <FieldRow label="To" tooltip={HELP.dailyWindow}>
                      <DateTimeInput
                        type="time"
                        value={endTime}
                        onChange={setEndTime}
                        min={startTime}
                        disabled={requirementOn}
                      />
                    </FieldRow>
                  </>
                )}
              </Group>

              <Group label="Set additional requirements">
                <RadioRow
                  label="Min. visits required"
                  tooltip={HELP.minVisits}
                  checked={visitsOn}
                  onSelect={() => {
                    setVisitsOn((v) => {
                      const next = !v;
                      if (next) setSpendReqOn(false);
                      return next;
                    });
                  }}
                >
                  {visitsOn && (
                    <NumberInput
                      value={visitsValue}
                      onChange={setVisitsValue}
                    />
                  )}
                </RadioRow>
                <RadioRow
                  label="Min. spend required"
                  tooltip={HELP.minSpendReq}
                  checked={spendReqOn}
                  onSelect={() => {
                    setSpendReqOn((v) => {
                      const next = !v;
                      if (next) setVisitsOn(false);
                      return next;
                    });
                  }}
                >
                  {spendReqOn && (
                    <div className="flex items-center gap-1">
                      <span className="text-[14px] text-neutral-500">$</span>
                      <NumberInput
                        value={spendReqValue}
                        onChange={setSpendReqValue}
                      />
                    </div>
                  )}
                </RadioRow>
              </Group>

              <p className="mt-auto pt-4 text-[14px] text-neutral-400">
                Admin interface shown for illustration — not final UI
              </p>
            </div>

            {/* ── Right: Live phone preview ─────────────────────────── */}
            <div className="flex justify-center w-full">
              <PhonePreview
                offer={
                  <OfferItem
                    variant={variant}
                    sameRate={sameRate}
                    cashbackLabel={cashbackLabel}
                    maxLabel={headlineMaxLabel}
                    minSpendOn={minSpendOn}
                    minSpendValue={minSpendValue}
                    endLabel={allTime ? '' : endLabel}
                    visits={visitsValue}
                    spendReqValue={spendReqValue}
                    dateRangeLabel={dateRangeLabel}
                    startTimeLabel={startTimeLabel}
                    endTimeLabel={endTimeLabel}
                    daily={dailyHours}
                    windowTitle={
                      hoursMode === 'window' ? 'Happy hour' : 'Limited time'
                    }
                  />
                }
              />
            </div>
            </div>
          </div>

          <p className="text-[16px] text-ink">
            What I built is a small set of cashback formats that all share the
            same visual shape on the offer card. Marketing picks spend-based,
            visit-based, time-based, or first-purchase. The backend
            doesn&apos;t care which combination. The user — looking at the
            card on their phone — sees the same familiar offer they&apos;ve
            been seeing all along. Different rules underneath. Same surface.
          </p>

          <p className="text-[16px] text-ink">
            Once this was in place, marketing could ship a new campaign
            without filing an engineering ticket. Different rate, different
            threshold, different time window — same offer card shape on the
            user&apos;s phone. That&apos;s the whole move.
          </p>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Helpers — date formatting
   ─────────────────────────────────────────────────────────────────────── */

// Today as a `YYYY-MM-DD` string (local time) for date inputs. Used to seed
// defaults without hard-coding a stale date.
function todayDate() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

// "2026-05-20" → "May 20". Parsed at local midnight — bare date strings parse
// as UTC and would shift a day west of Greenwich.
function formatShortDate(value: string) {
  const d = new Date(`${value}T00:00`);
  if (Number.isNaN(d.getTime())) return '';
  return `${MONTHS[d.getMonth()].slice(0, 3)} ${d.getDate()}`;
}

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
const DAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

function ordinal(n: number) {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function formatEndDate(value: string) {
  const t = Date.parse(`${value}T00:00`);
  if (Number.isNaN(t)) return '';
  const d = new Date(t);
  return `Ends on ${MONTHS[d.getMonth()]} ${ordinal(d.getDate())}`;
}

// "16:30" → "4:30 PM"
function formatClock(value: string) {
  const [hRaw, m] = value.split(':');
  let h = Number(hRaw);
  if (Number.isNaN(h) || m === undefined) return '';
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  if (h === 0) h = 12;
  return `${h}:${m} ${ampm}`;
}


/* ─────────────────────────────────────────────────────────────────────────
   Form atoms
   ─────────────────────────────────────────────────────────────────────── */

function Group({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-[14px] font-semibold text-ink">{label}</p>
      <div className="flex flex-col gap-2.5">{children}</div>
    </div>
  );
}

function Radio({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      className="flex items-center gap-2 text-left text-[14px] text-ink"
    >
      <span
        className={`size-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
          checked ? 'border-ink' : 'border-neutral-300'
        }`}
      >
        {checked && <span className="size-2 rounded-full bg-ink" />}
      </span>
      {label}
    </button>
  );
}

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={on}
      className={`relative w-[38px] h-[19px] rounded-full transition-colors duration-200 shrink-0 ${
        on ? 'bg-emerald-400' : 'bg-neutral-200'
      }`}
    >
      <span
        className={`absolute top-[2px] left-0 size-[15px] bg-white rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.15)] transition-transform duration-200 ease-out ${
          on ? 'translate-x-[21px]' : 'translate-x-[2px]'
        }`}
      />
    </button>
  );
}

function ToggleRow({
  label,
  tooltip,
  on,
  onToggle,
  children,
}: {
  label: string;
  tooltip: string;
  on: boolean;
  onToggle: () => void;
  children?: ReactNode;
}) {
  return (
    <div className="flex items-center gap-1 min-h-[28px]">
      <Toggle on={on} onToggle={onToggle} />
      <span className="text-[14px] text-ink">{label}</span>
      <HelpIcon tooltip={tooltip} />
      <div className="ml-auto">{children}</div>
    </div>
  );
}

function RadioRow({
  label,
  tooltip,
  checked,
  onSelect,
  disabled,
  children,
}: {
  label: string;
  tooltip: string;
  checked: boolean;
  onSelect: () => void;
  disabled?: boolean;
  children?: ReactNode;
}) {
  return (
    <div
      className={`flex items-center gap-1 min-h-[28px] ${
        disabled ? 'opacity-40' : ''
      }`}
    >
      <button
        type="button"
        onClick={onSelect}
        disabled={disabled}
        aria-pressed={checked}
        className={`flex items-center gap-1 text-left ${
          disabled ? 'cursor-not-allowed' : ''
        }`}
      >
        <span
          className={`size-[15px] rounded-full border-2 flex items-center justify-center shrink-0 ${
            checked ? 'border-ink' : 'border-neutral-300'
          }`}
        >
          {checked && <span className="size-[7px] rounded-full bg-ink" />}
        </span>
        <span className="text-[14px] text-ink">{label}</span>
      </button>
      <HelpIcon tooltip={tooltip} />
      <div className="ml-auto">{children}</div>
    </div>
  );
}

function FieldRow({
  label,
  tooltip,
  children,
}: {
  label: string;
  tooltip: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-2 min-h-[28px]">
      <div className="flex items-center gap-1">
        <span className="text-[14px] text-ink">{label}</span>
        <HelpIcon tooltip={tooltip} />
      </div>
      {children}
    </div>
  );
}

function NumberRow({
  label,
  tooltip,
  value,
  onChange,
  suffix,
}: {
  label: string;
  tooltip: string;
  value: number;
  onChange: (n: number) => void;
  suffix?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-2 min-h-[28px]">
      <div className="flex items-center gap-1">
        <span className="text-[14px] text-neutral-600">{label}</span>
        <HelpIcon tooltip={tooltip} />
      </div>
      <NumberInput value={value} onChange={onChange} suffix={suffix} />
    </div>
  );
}

function NumberInput({
  value,
  onChange,
  prefix,
  suffix,
  disabled,
}: {
  value: number;
  onChange: (n: number) => void;
  prefix?: string;
  suffix?: string;
  disabled?: boolean;
}) {
  return (
    <div
      className={`inline-flex items-center gap-1 border border-neutral-300 rounded-md px-2 py-1 text-[14px] ${
        disabled ? 'opacity-40' : ''
      }`}
    >
      {prefix && <span className="text-neutral-400">{prefix}</span>}
      <input
        type="number"
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-7 text-right outline-none bg-transparent text-ink [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
      {suffix && <span className="text-neutral-400">{suffix}</span>}
    </div>
  );
}

function DateTimeInput({
  value,
  onChange,
  disabled,
  min,
  type = 'datetime-local',
}: {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  min?: string;
  type?: 'date' | 'time' | 'datetime-local';
}) {
  return (
    <input
      type={type}
      value={value}
      disabled={disabled}
      min={min}
      onChange={(e) => onChange(e.target.value)}
      className={`border border-neutral-300 rounded-md px-2 py-1 text-[14px] text-ink outline-none ${
        disabled ? 'opacity-40 cursor-not-allowed' : ''
      }`}
    />
  );
}

function HelpIcon({ tooltip }: { tooltip: string }) {
  return (
    <span
      className="relative inline-flex group"
      tabIndex={0}
      aria-label={tooltip}
    >
      <CircleQuestionMark
        size={13}
        strokeWidth={1.5}
        className="text-neutral-400 shrink-0 cursor-help"
      />
      <span
        role="tooltip"
        className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 z-30 w-max max-w-[220px] bg-ink text-white text-[14px] leading-snug text-center px-2.5 py-1.5 rounded-md opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:translate-y-0 transition-all duration-150 ease-out"
      >
        {tooltip}
      </span>
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Phone preview
   ─────────────────────────────────────────────────────────────────────── */

function PhonePreview({ offer }: { offer: ReactNode }) {
  return (
    <div className="relative w-full max-w-[320px] h-[600px] rounded-[28px] border border-neutral-300 bg-white overflow-hidden flex flex-col">
      {/* Food image with floating nav icons — inset 16px from phone edges */}
      <div className="relative mx-4 mt-4 h-[180px] rounded-2xl overflow-hidden shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/work/bravo/pidgin-food.jpg"
          alt="PiDGin signature dish"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-x-0 top-0 px-3 pt-3 flex items-center justify-between">
          <span className="size-7 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-sm">
            <ArrowLeft size={14} className="text-ink" />
          </span>
          <div className="flex items-center gap-1.5">
            <span className="size-7 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-sm">
              <Heart size={13} className="text-ink" />
            </span>
            <span className="size-7 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-sm">
              <Share size={13} className="text-ink" />
            </span>
          </div>
        </div>
        <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded-full bg-black/55 text-white text-[8px] tracking-wide">
          1/12
        </span>
      </div>

      {/* Tabs */}
      <div className="px-4 mt-3 flex items-center gap-3 text-[11px] border-b border-neutral-200">
        <span className="text-ink font-semibold pb-2 border-b-2 border-ink -mb-px">
          Offers
        </span>
        {['Info', 'Menu', 'Amenities', 'Reviews'].map((t) => (
          <span key={t} className="text-neutral-500 pb-2">
            {t}
          </span>
        ))}
      </div>

      {/* Restaurant header */}
      <div className="px-4 mt-3 flex items-start gap-2">
        <div className="size-9 rounded-md overflow-hidden bg-ink shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/work/bravo/pidgin-logo.jpg"
            alt="PiDGin"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold text-ink">PiDGin</p>
          <div className="flex items-center gap-1.5 flex-wrap text-[10px] text-neutral-600">
            <Star size={9} fill="currentColor" className="text-ink" />
            <span className="text-ink">4.6</span>
            <span className="underline text-ink">(35 reviews)</span>
            <span className="text-neutral-300">|</span>
            <Globe size={9} className="text-ink" />
            <span className="underline text-ink">Website</span>
          </div>
          <p className="text-[10px] text-neutral-500 mt-0.5">
            Downtown · 5.3km
          </p>
        </div>
      </div>

      {/* 3-col meta with divider below */}
      <div className="mx-4 mt-3 pb-3 border-b border-neutral-200 grid grid-cols-3 gap-2 text-center">
        {[
          { v: 'Chinese', l: 'Cuisine' },
          { v: '$$', l: 'Cost' },
          { v: 'Family dining', l: 'Category' },
        ].map((m, i) => (
          <div
            key={m.l}
            className={`px-1 ${i > 0 ? 'border-l border-neutral-200' : ''}`}
          >
            <p className="text-[10px] text-ink">{m.v}</p>
            <p className="text-[9px] text-neutral-400">{m.l}</p>
          </div>
        ))}
      </div>

      {/* Description */}
      <p className="px-4 mt-3 text-[10px] text-neutral-600">
        PIDGIN is one of Vancouver&apos;s most talked-about dining rooms for a
        reason. The kitchen focuses …
      </p>
      <button
        type="button"
        className="px-4 mt-0.5 flex items-center gap-0.5 self-end text-[10px] text-ink underline"
      >
        Show more
        <ChevronUp size={10} />
      </button>

      {/* Offer item */}
      <div className="px-4 mt-3">{offer}</div>

      {/* Info section */}
      <div className="px-4 mt-3 mb-2">
        <p className="text-[11px] font-semibold text-ink">Info</p>
        <div className="flex items-center gap-1 mt-1 text-[10px] text-ink">
          <MapPin size={10} className="text-ink" />
          <span className="underline">350 Carrall Street Vancouver</span>
        </div>
      </div>

    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Offer item (4 variants)
   ─────────────────────────────────────────────────────────────────────── */

function OfferItem(props: {
  variant: 1 | 2 | 3 | 4;
  sameRate: boolean;
  cashbackLabel: string;
  maxLabel: string;
  minSpendOn: boolean;
  minSpendValue: number;
  endLabel: string;
  visits: number;
  spendReqValue: number;
  dateRangeLabel: string;
  startTimeLabel: string;
  endTimeLabel: string;
  daily: boolean;
  windowTitle: string;
}) {
  const {
    variant,
    sameRate,
    cashbackLabel,
    maxLabel,
    minSpendOn,
    minSpendValue,
    endLabel,
    visits,
    spendReqValue,
    dateRangeLabel,
    startTimeLabel,
    endTimeLabel,
    daily,
    windowTitle,
  } = props;

  // Variant 3 (Happy hour) has its own footer; others share clock + end label.
  // Also hide when endLabel is empty (e.g. "All time" is enabled in admin).
  const showEndsFooter = variant !== 3 && Boolean(endLabel);

  // ── Live-update pulse ─────────────────────────────────────────────────
  // Whenever any visible prop changes (i.e. the admin edits something on the
  // left), briefly flash the card so the user notices the preview updated.
  const fingerprint = JSON.stringify({
    variant,
    sameRate,
    cashbackLabel,
    maxLabel,
    minSpendOn,
    minSpendValue,
    endLabel,
    visits,
    spendReqValue,
    dateRangeLabel,
    startTimeLabel,
    endTimeLabel,
    daily,
    windowTitle,
  });
  const isFirstRender = useRef(true);
  const [pulseKey, setPulseKey] = useState(0);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setPulseKey((k) => k + 1);
  }, [fingerprint]);

  return (
    <div
      key={pulseKey}
      className={`${pulseKey > 0 ? 'offer-pulse' : ''} relative bg-white rounded-2xl p-2.5 flex gap-2.5 shadow-[0_2px_8px_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.06)]`}
    >
      <style jsx>{`
        @keyframes offerPulse {
          0% {
            transform: scale(1);
            box-shadow:
              0 2px 8px rgba(0, 0, 0, 0.06),
              0 8px 24px rgba(0, 0, 0, 0.06),
              0 0 0 0 rgba(52, 211, 153, 0);
          }
          35% {
            transform: scale(1.015);
            box-shadow:
              0 2px 8px rgba(0, 0, 0, 0.06),
              0 8px 24px rgba(0, 0, 0, 0.06),
              0 0 0 3px rgba(52, 211, 153, 0.35);
          }
          100% {
            transform: scale(1);
            box-shadow:
              0 2px 8px rgba(0, 0, 0, 0.06),
              0 8px 24px rgba(0, 0, 0, 0.06),
              0 0 0 0 rgba(52, 211, 153, 0);
          }
        }
        .offer-pulse {
          animation: offerPulse 600ms ease-out;
        }
        @media (prefers-reduced-motion: reduce) {
          .offer-pulse {
            animation: none;
          }
        }
      `}</style>
      {/* Top-right min spend pill */}
      {minSpendOn && (
        <span className="absolute top-0 right-0 bg-neutral-100 text-ink text-[10px] px-2 py-1.5 rounded-bl-md rounded-tr-xl">
          Min spend ${minSpendValue}
        </span>
      )}

      {/* Cashback badge */}
      <div className="size-12 rounded-xl bg-ink text-white flex flex-col items-center justify-center shrink-0 self-start">
        <span className="text-[14px] font-bold leading-none">{cashbackLabel}</span>
        <span className="text-[10px] text-white/70 mt-0.5">back</span>
      </div>

      {/* Body */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Title block */}
        {variant === 1 && (
          <>
            <p className="text-[14px] font-semibold text-ink">
              Every ${spendReqValue} spent
            </p>
            <p className="text-[12px] text-ink">{maxLabel}</p>
            <ProgressBar value={75} max={spendReqValue} />
            <p className="text-[9px] text-neutral-500 mt-0.5">
              ${75}/${spendReqValue}
            </p>
          </>
        )}

        {variant === 2 && (
          <>
            <p className="text-[14px] font-semibold text-ink">
              Every {visits} purchases
            </p>
            <p className="text-[12px] text-ink">{maxLabel}</p>
            <SegmentedBar total={visits} filled={1} />
            <p className="text-[9px] text-neutral-500 mt-0.5">$6.5 pending</p>
          </>
        )}

        {variant === 3 && (
          <>
            <p className="text-[14px] font-semibold text-ink">{windowTitle}</p>
            <p className="text-[12px] text-ink">{maxLabel}</p>
            <div className="flex items-center gap-1 text-[10px] text-ink mt-1">
              <Calendar size={10} />
              <span>{dateRangeLabel}</span>
            </div>
            {/* Clock row only when a daily window is set; "daily" makes a
                multi-day window read as recurring, not continuous. */}
            {startTimeLabel && (
              <div className="flex items-center gap-2 text-[10px] text-ink">
                <span className="flex items-center gap-1">
                  <Clock size={10} />
                  <span>{startTimeLabel}</span>
                </span>
                <span className="text-neutral-400">- - -</span>
                <span className="flex items-center gap-1">
                  <Clock size={10} />
                  <span>{endTimeLabel}</span>
                </span>
                {daily && <span className="text-neutral-500">· daily</span>}
              </div>
            )}
          </>
        )}

        {variant === 4 && (
          <>
            <p className="text-[14px] font-semibold text-ink">
              {sameRate ? 'Every purchase' : 'First purchase'}
            </p>
            <p className="text-[12px] text-ink">{maxLabel}</p>
          </>
        )}

        {/* Bottom footer row: ends + more details */}
        <div className="flex items-end justify-between mt-1.5 gap-2">
          {showEndsFooter ? (
            <div className="flex items-center gap-1 text-[10px] text-ink">
              <Clock size={10} />
              <span>{endLabel}</span>
            </div>
          ) : (
            <span />
          )}
          <div className="flex items-center gap-0.5 text-[9px] text-neutral-400 shrink-0">
            More details
            <ChevronRight size={10} />
          </div>
        </div>
      </div>
    </div>
  );
}

function ProgressBar({ value, max }: { value: number; max: number }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className="w-full h-1.5 bg-neutral-200 rounded-full overflow-hidden mt-1">
      <div className="h-full bg-ink" style={{ width: `${pct}%` }} />
    </div>
  );
}

function SegmentedBar({ total, filled }: { total: number; filled: number }) {
  return (
    <div className="flex gap-1 mt-1">
      {Array.from({ length: Math.max(1, total) }).map((_, i) => (
        <div
          key={i}
          className={`h-1.5 flex-1 rounded-full ${
            i < filled ? 'bg-ink' : 'bg-neutral-200'
          }`}
        />
      ))}
    </div>
  );
}

