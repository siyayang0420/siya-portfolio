import {
  ArrowRight,
  Gauge,
  Timer,
  Wallet,
  type LucideIcon,
} from 'lucide-react';
import { CARD } from './cardKit';

/**
 * Why a balance on its own is not a signal.
 *
 * The figure's argument is arithmetic: what is left, divided by how fast it
 * goes, is a date. So it is drawn as the sum it is — one strip, three numbers,
 * the operators between them — and the action sits under a rule as the line
 * the sum resolves to. Demand is not a fourth term; it is where the burn rate
 * comes from, so it appears as the note under velocity rather than as a box
 * of its own.
 *
 * ── What this replaced ─────────────────────────────────────────────────────
 * Two earlier cuts drew it as boxes joined by arrows — first four stacked
 * full-width cards (~490px for four short values), then a horizontal chain
 * of five cells with a pill floating under the last one. Both had the same
 * fault: a box per number leaves most of each box empty, and arrows between
 * equal boxes say "then", not "divided by". One surface with the numbers set
 * large and the relationship written out says more in a third of the height.
 *
 * The values take the study's 24px semibold — the act-title size, the one
 * step above body the page uses — because a figure about three numbers should
 * let you read the numbers from across the room.
 */

const STATS: {
  Icon: LucideIcon;
  label: string;
  value: string;
  note?: string;
}[] = [
  { Icon: Wallet, label: 'Credit left', value: '$19' },
  { Icon: Gauge, label: 'Velocity', value: '$31 / day', note: '25 visits / 30d' },
  { Icon: Timer, label: 'Runway', value: '≈ 1 day' },
];

/** The operators, in sequence between the three stats. */
const OPS = ['÷', '='];

function Stat({ Icon, label, value, note }: (typeof STATS)[number]) {
  return (
    // A row on a phone — label left, number right, like a ledger line — and a
    // column from `md`, where the three sit side by side with the operators.
    //
    // The rule between rows lives here, not as `divide-y` on the container:
    // the container's direct children are the `contents` wrappers below, which
    // paint no box, so a divider set there draws nothing. `first:` reads
    // against the wrapper — the first stat is alone in its wrapper and gets no
    // rule; every later one follows its operator and does.
    <div className="flex items-baseline justify-between gap-4 border-t border-line py-3 first:border-t-0 md:border-t-0 md:flex-col md:items-start md:gap-1 md:py-0">
      <span className="flex items-center gap-1.5 text-[12px] uppercase tracking-[0.08em] text-muted">
        <Icon className="size-4 shrink-0" strokeWidth={1.75} aria-hidden="true" />
        {label}
      </span>
      <span className="flex flex-col items-end md:items-start">
        <span className="text-[24px] font-semibold leading-8 tracking-[-0.02em] text-ink tabular-nums">
          {value}
        </span>
        {note && <span className="text-[12px] text-muted">{note}</span>}
      </span>
    </div>
  );
}

export function JeniRunway({
  // The figure sits inside a white pass card now, where a white card of its
  // own would vanish. The pipeline solved the same problem with grey cells on
  // a white container; the caller picks the surface so this file stays
  // ignorant of where it is mounted.
  surface = CARD,
}: {
  surface?: string;
}) {
  return (
    <figure className="m-0 flex flex-col">
      <div className={`${surface} flex flex-col gap-5`}>
        {/* ── The sum ─────────────────────────────────────────────────
            `divide-y` draws the ledger rules between stats on a phone; the
            operators are display:none there and so draw nothing. From `md`
            the rules go and the operators come in, top-padded by the label's
            height so they sit on the values' line rather than the labels'. */}
        <div className="flex flex-col md:grid md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] md:items-start md:gap-6">
          {STATS.map((stat, i) => (
            <div key={stat.label} className="contents">
              {i > 0 && (
                <span
                  aria-hidden
                  className="hidden text-[24px] leading-8 text-neutral-300 md:block md:pt-5"
                >
                  {OPS[i - 1]}
                </span>
              )}
              <Stat {...stat} />
            </div>
          ))}
        </div>

        {/* ── What it resolves to ──────────────────────────────────────
            Under a rule, the way a total sits under the line in a sum. The
            filled pill is the one element here that is a decision rather
            than a number, and it is anchored to the card instead of floating
            in the figure's whitespace. */}
        <div className="flex flex-col items-start gap-3 border-t border-line pt-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <span className="flex items-center gap-2 text-[14px] text-ink">
            <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-[#202020]" />
            Runway under a day
          </span>
          {/* Set as a consequence, not a control: an arrow and a line of text
              at the row's own size. It was a filled pill before, which read
              as a button on a figure with nothing to press — the study's
              filled ink is for things that can be clicked. */}
          <span className="flex shrink-0 items-center gap-1.5 text-[14px] font-medium text-ink">
            <ArrowRight
              className="size-4 shrink-0 text-muted"
              strokeWidth={1.75}
              aria-hidden="true"
            />
            Buy more credit
          </span>
        </div>
      </div>

      <figcaption className="mt-3 text-[12px] text-muted">
        The same $19 means nothing on its own — read against this merchant&apos;s
        own demand it is about a day of runway, which is a date the team can act
        on
      </figcaption>
    </figure>
  );
}
