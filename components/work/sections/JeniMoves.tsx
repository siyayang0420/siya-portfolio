import { ArrowDown, ArrowRight, ArrowUp } from 'lucide-react';

/**
 * Same marketplace, different moves.
 *
 * Three situations that look alike from a distance — a merchant, a diner,
 * a signal — and the three different things Bravo should do about them. The
 * point is the divergence: the same two readings, credit and demand, land
 * on three different actions once you read them together, and one of those
 * actions is to spend nothing.
 *
 * ── Drawn in the study's language ──────────────────────────────────────────
 * The reference sketch colours each column red / blue / green and badges
 * every value. Neither survives: the site's figures are monochrome, and the
 * columns are already told apart by their titles and by the action each
 * lands on. Direction is kept — a small ↑ / ↓ before each reading — because
 * it is the one thing colour was doing that words alone do slower.
 *
 * Each column is a ledger: title and premise, three readings as ruled lines
 * (the runway figure's mobile treatment), then the action under a rule, set
 * the way the runway's footer sets its action — an arrow and a line of text,
 * not a button. Grey columns because the figure sits inside a white pass
 * card, where a white column would have no edge.
 *
 * Folds to one column below `md`.
 */

type Reading = { label: string; up: boolean; value: string; note?: string };

const MOVES: {
  n: string;
  title: string;
  premise: string;
  readings: Reading[];
  action: string;
  why: string;
}[] = [
  {
    n: '01',
    title: 'Demand exists, credit is low',
    premise: 'Protect demand that already exists.',
    readings: [
      { label: 'Credit', up: false, value: 'Low' },
      { label: 'Demand', up: true, value: 'High' },
      { label: 'Diner', up: true, value: 'Active', note: 'Still visiting' },
    ],
    action: 'Buy more merchant credit',
    why: 'Keep the restaurant online and meet existing demand.',
  },
  {
    n: '02',
    title: 'Credit exists, demand is low',
    premise: 'Move capital already sitting in the network.',
    readings: [
      { label: 'Credit', up: true, value: 'High' },
      { label: 'Demand', up: false, value: 'Low' },
      { label: 'Diner', up: false, value: 'Lapsed', note: 'Past visitors' },
    ],
    action: 'Create demand',
    why: 'Run a targeted campaign to bring diners back.',
  },
  {
    n: '03',
    title: 'Credit exists, demand exists',
    premise: 'Avoid subsidizing behavior that would happen anyway.',
    readings: [
      { label: 'Credit', up: true, value: 'Healthy' },
      { label: 'Demand', up: true, value: 'Healthy' },
      { label: 'Diner', up: true, value: 'Active', note: 'Already active' },
    ],
    action: 'Do nothing',
    why: 'No intervention needed.',
  },
];

function Move({ n, title, premise, readings, action, why }: (typeof MOVES)[number]) {
  return (
    <div className="flex flex-col gap-4 rounded-xl bg-[#f8f8f8] p-4">
      <div className="flex flex-col gap-1">
        <span className="text-[12px] uppercase tracking-[0.08em] text-muted">{n}</span>
        <span className="text-[14px] font-medium text-ink">{title}</span>
        <span className="text-[12px] text-muted">{premise}</span>
      </div>

      <ul className="flex flex-col divide-y divide-line border-t border-line">
        {readings.map((r) => {
          const Arrow = r.up ? ArrowUp : ArrowDown;
          return (
            <li key={r.label} className="flex items-start justify-between gap-3 py-2">
              <span className="text-[14px] text-muted">{r.label}</span>
              <span className="flex flex-col items-end">
                <span className="flex items-center gap-1 text-[14px] font-medium text-ink">
                  <Arrow
                    className="size-3.5 shrink-0 text-neutral-500"
                    strokeWidth={1.75}
                    aria-hidden="true"
                  />
                  {r.value}
                </span>
                {r.note && <span className="text-[12px] text-muted">{r.note}</span>}
              </span>
            </li>
          );
        })}
      </ul>

      {/* The action, the way the runway's footer sets it: an arrow and a
          line of text at the row's size — a consequence, not a control. */}
      <div className="mt-auto flex flex-col gap-0.5 border-t border-line pt-3">
        <span className="flex items-center gap-1.5 text-[14px] font-medium text-ink">
          <ArrowRight
            className="size-4 shrink-0 text-muted"
            strokeWidth={1.75}
            aria-hidden="true"
          />
          {action}
        </span>
        {/* Two lines' minimum, so a one-line reason ("No intervention
            needed.") doesn't let its block sit lower than the others once
            the actions are bottom-aligned — the three arrows should read as
            one line across the row. */}
        <span className="min-h-9 pl-[22px] text-[12px] text-muted">{why}</span>
      </div>
    </div>
  );
}

export function JeniMoves() {
  return (
    <figure className="m-0 flex flex-col">
      {/* Stretch, not start: the three are one row and read as one, so they
          take the tallest one's height, and the actions inside are pushed to
          the bottom so they line up across the row. */}
      <div className="grid gap-3 md:grid-cols-3 md:items-stretch">
        {MOVES.map((move) => (
          <Move key={move.n} {...move} />
        ))}
      </div>
    </figure>
  );
}
