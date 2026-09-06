import {
  ClipboardCheck,
  Database,
  Download,
  Link2,
  Newspaper,
  Search,
  Sparkles,
  Store,
  type LucideIcon,
} from 'lucide-react';
import { BODY, TITLE } from './cardKit';

/**
 * How a scattered public web becomes one structured merchant signal.
 *
 * Drawn in the case study's own vocabulary rather than the source sketch's:
 * white cards on the grey ground, dashed neutral-300 for anything connective,
 * lucide glyphs, and no hue carrying meaning. The sketch colour-coded each
 * source and each signal type, which would make this the only chromatic figure
 * in the study and would imply the categories rank against each other — they
 * don't, they are just different inputs.
 *
 * Two deliberate departures from the reference:
 *
 * · The per-step commentary moves inside its card instead of sitting in a
 *   right-hand column. A second column would have to align its own rails to a
 *   different centre than every other rail in the figure, and on a phone it
 *   collapses under the card anyway — which is where it now lives at every
 *   width.
 *
 * · The "Monitoring Overview" tile at the end is gone. The reference needs it
 *   because the sketch stands alone; here the actual screenshot sits directly
 *   above this figure on the page, so a card pointing at it would send the
 *   reader back up to something they have already seen.
 */

const DASH = 'border-dashed border-neutral-300';

/**
 * Rail segment for one column of an N-up grid: runs from its own centre and
 * overhangs 6px, half the 12px gap, so the segments meet without arithmetic.
 * Same technique as BravoRewardStack — a gapless grid would not share centres
 * with the gapped one the cards sit in.
 */
const SEG_3 = [
  'left-1/2 -right-1.5',
  '-left-1.5 -right-1.5',
  '-left-1.5 right-1/2',
];
const SEG_2 = ['left-1/2 -right-1.5', '-left-1.5 right-1/2'];

const SOURCES: {
  Icon: LucideIcon;
  name: string;
  sub: string;
  chips: string[];
}[] = [
  {
    Icon: Newspaper,
    name: 'Editorial & news',
    sub: 'Local media, magazines, blogs',
    chips: ['Noms', 'Scout', 'Vancouver Is Awesome', '…'],
  },
  {
    Icon: ClipboardCheck,
    name: 'Health records',
    sub: 'Inspection and closure data',
    chips: ['Vancouver Coastal Health'],
  },
  {
    Icon: Store,
    name: 'Business listings',
    sub: 'Restaurants for sale or lease',
    chips: ['BizBuySell', 'Commercial listings', '…'],
  },
];

const STEPS: {
  n: string;
  label: string;
  Icon: LucideIcon;
  title: string;
  body: string;
  note: string;
}[] = [
  {
    n: '01',
    label: 'Collect',
    Icon: Download,
    title: 'Discover and fetch content',
    body: 'RSS feeds, sitemaps, search, and browser automation.',
    note: 'Different sources need different strategies — from a plain HTTP request to a headless browser.',
  },
  {
    n: '02',
    label: 'Interpret',
    Icon: Sparkles,
    title: 'Rules first, LLM when needed',
    body: 'Filter irrelevant content, extract the key entities, and classify the signal.',
    note: 'Deterministic filters handle what can be known reliably. The model is reserved for ambiguous extraction and classification.',
  },
  {
    n: '03',
    label: 'Resolve merchant',
    Icon: Link2,
    title: 'Match to a real restaurant',
    body: 'Resolve names, addresses, and locations against Google Places.',
    note: 'Candidates are matched on name similarity, address, restaurant type, and a BC geofence.',
  },
];

const SIGNAL_TYPES = [
  'New opening',
  'Restaurant closed',
  'Health risk',
  'For sale',
];

/** The study's pill: hairline border, muted 12px. No fill, no colour. */
function Chip({ children }: { children: string }) {
  return (
    <span className="rounded-full border border-line px-2.5 py-1 text-[12px] text-muted">
      {children}
    </span>
  );
}

/** A vertical dashed drop, centred. `h` is a Tailwind height class. */
function Drop({ h = 'h-6' }: { h?: string }) {
  return (
    <div aria-hidden className="flex justify-center">
      <span className={`${h} w-0 border-l ${DASH}`} />
    </div>
  );
}

export function JeniPipeline() {
  return (
    <figure className="m-0 flex flex-col">
      {/* ── Sources ─────────────────────────────────────────────────── */}
      <div className="grid gap-3 md:grid-cols-3">
        {SOURCES.map(({ Icon, name, sub, chips }) => (
          <div
            key={name}
            className="bg-white rounded-xl p-4 flex flex-col gap-3"
          >
            <div className="flex items-end gap-1">
              <Icon
                className="size-5 shrink-0 text-ink"
                strokeWidth={1.75}
                aria-hidden="true"
              />
              <p className={TITLE}>{name}</p>
            </div>
            <p className="text-[12px] text-muted">{sub}</p>
            <div className="mt-auto flex flex-wrap gap-1.5">
              {chips.map((c) => (
                <Chip key={c}>{c}</Chip>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Three sources converge onto one rail. Stacked, there is nothing to
          converge across, so it gets a plain drop instead of a rail pointing
          at nothing. */}
      <div aria-hidden className="hidden h-10 grid-cols-3 gap-3 md:grid">
        {SOURCES.map((s, i) => (
          <div key={s.name} className="relative">
            <span className={`absolute left-1/2 top-0 h-5 w-0 border-l ${DASH}`} />
            <span className={`absolute top-5 border-t ${DASH} ${SEG_3[i]}`} />
            {i === 1 && (
              <span className={`absolute left-1/2 top-5 h-5 w-0 border-l ${DASH}`} />
            )}
          </div>
        ))}
      </div>
      <div className="md:hidden">
        <Drop h="h-8" />
      </div>

      {/* ── The pipeline ────────────────────────────────────────────── */}
      {STEPS.map(({ n, label, Icon, title, body, note }, i) => (
        <div key={n}>
          <div className="bg-white rounded-xl p-6 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Icon
                className="size-5 shrink-0 text-ink"
                strokeWidth={1.75}
                aria-hidden="true"
              />
              <span className="text-[12px] uppercase tracking-[0.08em] text-muted">
                {n} · {label}
              </span>
            </div>
            <div className="flex flex-col gap-1.5">
              <p className={TITLE}>{title}</p>
              <p className={BODY}>{body}</p>
            </div>
            {/* The reasoning behind the step, held apart from what the step
                does by a hairline — the same separation the Decision cards
                use for a note about a claim. */}
            <p className="border-t border-line pt-3 text-[12px] leading-[1.5] text-muted">
              {note}
            </p>
          </div>
          {/* A drop after every step, including the last — that one leads
              into the question below. */}
          <Drop />
        </div>
      ))}

      {/* ── The branch ──────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl px-5 py-4 text-center">
        <span className="text-[16px] font-medium text-ink">
          Is it a reliable match?
        </span>
      </div>

      {/* One rail out, two drops down. The mirror of the converge above. */}
      <div aria-hidden className="hidden h-10 grid-cols-2 gap-3 md:grid">
        {SEG_2.map((seg, i) => (
          <div key={seg} className="relative">
            {i === 0 && (
              <span
                className={`absolute left-1/2 top-0 h-5 w-0 border-l ${DASH}`}
                style={{ left: 'calc(100% + 6px)' }}
              />
            )}
            <span className={`absolute top-5 border-t ${DASH} ${seg}`} />
            <span className={`absolute left-1/2 top-5 h-5 w-0 border-l ${DASH}`} />
          </div>
        ))}
      </div>
      <div className="md:hidden">
        <Drop h="h-8" />
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="bg-white rounded-xl p-6 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Database
              className="size-5 shrink-0 text-ink"
              strokeWidth={1.75}
              aria-hidden="true"
            />
            <span className="text-[12px] uppercase tracking-[0.08em] text-muted">
              04 · Structured signal
            </span>
          </div>
          <div className="flex flex-col gap-1.5">
            <p className={TITLE}>Save as a merchant signal</p>
            <p className={BODY}>
              Written against a resolved restaurant, typed by what happened.
            </p>
          </div>
          <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
            {SIGNAL_TYPES.map((t) => (
              <Chip key={t}>{t}</Chip>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Search
              className="size-5 shrink-0 text-ink"
              strokeWidth={1.75}
              aria-hidden="true"
            />
            <span className="text-[12px] uppercase tracking-[0.08em] text-muted">
              Not confident · Review
            </span>
          </div>
          <div className="flex flex-col gap-1.5">
            <p className={TITLE}>Keep for human review</p>
            <p className={BODY}>
              An uncertain match is saved as uncertain, rather than forced into
              a merchant record.
            </p>
          </div>
        </div>
      </div>

      {/* Both branches answer to one rule, so it gets the filled bar the
          Challenge act gives "One system": the claim the figure is built to
          land, not another step in it. */}
      <div className="md:hidden">
        <Drop h="h-8" />
      </div>
      <div aria-hidden className="hidden h-10 grid-cols-2 gap-3 md:grid">
        {SEG_2.map((seg, i) => (
          <div key={seg} className="relative">
            <span className={`absolute left-1/2 top-0 h-5 w-0 border-l ${DASH}`} />
            <span className={`absolute top-5 border-t ${DASH} ${seg}`} />
            {i === 1 && (
              <span
                className={`absolute top-5 h-5 w-0 border-l ${DASH}`}
                style={{ left: '-6px' }}
              />
            )}
          </div>
        ))}
      </div>

      <div className="rounded-xl bg-[#202020] px-5 py-4 text-center">
        <span className="text-[16px] font-medium text-white">
          A wrong match was worse than no match.
        </span>
      </div>

      <figcaption className="mt-3 text-[12px] text-muted">
        Three public sources, one pipeline, and an explicit exit for anything it
        could not resolve with enough evidence
      </figcaption>
    </figure>
  );
}
