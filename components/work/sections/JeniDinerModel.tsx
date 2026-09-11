import { ArrowRight } from 'lucide-react';

/**
 * Changing the unit of analysis: from one transaction to a person.
 *
 * Three numbers, read left to right: ten rows become four patterns become
 * one person. The count shrinks as the meaning grows — that is the whole
 * argument, and it should be readable in the time it takes to glance at it.
 *
 * ── Why three numbers and not three lists ──────────────────────────────────
 * The first cut of this figure had fifteen rows across three columns — the
 * five transactions, the four questions, the five traits. A reader skimming
 * a case study does not read fifteen rows; they see a table and move on. So
 * each column is collapsed to a count, and the detail is a single line under
 * it in the study's own words: the four patterns are the four the copy above
 * names, and the picture is "preferences, habits, and value" from the
 * finding. Nothing is added; everything is shortened.
 *
 * Same construction as the runway figure, deliberately — one grey surface,
 * three large values with their labels, operators between — so the two
 * passes' models read as the same kind of object. The operators are arrows
 * rather than ÷ and = because this is a transformation, not a sum.
 *
 * Grey because it sits inside a white pass card, where a white card of its
 * own would have no edge.
 */

// The large line is what each stage *is*, not a count — records, patterns,
// a diner — and the note under it is what that stage holds.
const STATS: { label: string; value: string; note: string }[] = [
  {
    label: 'Transactions',
    value: 'Individual records',
    note: 'What they did',
  },
  {
    label: 'Repeated behavior',
    value: 'Patterns over time',
    note: 'Where they return · when they dine · what they spend · how they top up',
  },
  {
    label: 'Diner understanding',
    value: 'One diner',
    note: 'Preferences · habits · value',
  },
];

function Stat({ label, value, note }: (typeof STATS)[number]) {
  return (
    // Stacked on a phone with a rule between each, side by side from `md`.
    // The rule lives here rather than as `divide-y` on the container: the
    // container's direct children include the `contents` wrappers, which
    // paint no box. `first:` reads against the wrapper — the first stat is
    // alone in its wrapper and gets no rule; every later one follows its
    // arrow and does.
    <div className="flex flex-col gap-1 border-t border-line py-3 first:border-t-0 md:border-t-0 md:py-0">
      {/* Text only. The glyphs that used to lead these labels were the one
          thing here the runway figure doesn't have, and three tiny icons on
          a strip meant to be skimmed were noise rather than signal. */}
      <span className="text-[12px] uppercase tracking-[0.08em] text-muted">
        {label}
      </span>
      <span className="text-[24px] font-semibold leading-8 tracking-[-0.02em] text-ink tabular-nums">
        {value}
      </span>
      <span className="text-[12px] text-muted">{note}</span>
    </div>
  );
}

export function JeniDinerModel() {
  return (
    <figure className="m-0 flex flex-col">
      <div className="rounded-xl bg-[#f8f8f8] p-6">
        {/* Five explicit tracks: the arrow columns size to their glyph, so the
            three stat columns share what is left evenly. The arrows are
            top-padded by the label's height so they sit on the values' line
            rather than the labels'. */}
        <div className="flex flex-col md:grid md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] md:items-start md:gap-6">
          {STATS.map((stat, i) => (
            <div key={stat.label} className="contents">
              {i > 0 && (
                <span
                  aria-hidden
                  // 30px puts the 16px glyph's centre on the value line's
                  // centre (label 18px + gap 4px + half of the 32px line).
                  // No fixed height: under border-box a `h-8` here left the
                  // arrow nothing to centre in once the padding was added,
                  // and it sat 6px high. Measured, not estimated.
                  className="hidden md:block md:pt-[30px]"
                >
                  <ArrowRight
                    className="size-4 text-neutral-300"
                    strokeWidth={1.75}
                  />
                </span>
              )}
              <Stat {...stat} />
            </div>
          ))}
        </div>
      </div>

      <figcaption className="mt-3 text-[12px] text-muted">
        The shift was from reading transactions individually to interpreting
        behavior over time.
      </figcaption>
    </figure>
  );
}
