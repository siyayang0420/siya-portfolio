import { CalendarRange, Smartphone, Star, TicketPercent, Wallet } from 'lucide-react';

/**
 * Three separately-managed reward programs converging on the same two
 * surfaces — the payment flow the customer sees, and the campaign operations
 * the team runs.
 *
 * Drawn in the case study's own vocabulary rather than the colour-coded source
 * sketch: white cards on the grey ground, hairline `border-line` insets, muted
 * eyebrows over ink statements, and no hue carrying meaning. A green/red/amber
 * version would be the only chromatic figure in the act and would imply a
 * good/bad reading that isn't there — each mechanism was reasonable alone.
 *
 * Glyphs match MathCardCollapse deliberately: the same three mechanisms are
 * introduced there, so reusing Star / TicketPercent / Wallet lets a reader
 * carry the mapping down the page.
 */

const SOURCES = [
  { Icon: Star, name: 'Points', purpose: 'Repeat visits' },
  { Icon: TicketPercent, name: 'Coupons', purpose: 'Restaurant promos' },
  { Icon: Wallet, name: 'Top-up bonus', purpose: 'Stored balance' },
];

const SINKS = [
  { Icon: Smartphone, label: 'One payment flow' },
  { Icon: CalendarRange, label: 'Campaign operations' },
];

/**
 * The connector hairline. `border-line` (#e4e4e4) is the case study's value for
 * panel insets, but at 1px dashed on the grey ground it was almost invisible;
 * neutral-500 and -400 both read as too heavy against the cards. neutral-300 is
 * the setting that shows the structure without drawing the eye to it.
 *
 * The "+" between the two surfaces shares the value — it is part of the same
 * connective layer, and leaving it darker made it the loudest mark in a figure
 * whose subject is the cards.
 *
 * Written out in full rather than composed from a token: Tailwind scans source
 * for complete class strings, so `border-${x}` would never be generated.
 */
const DASH = 'border-dashed border-neutral-300';

export function BravoRewardStack() {
  return (
    <figure className="m-0 flex flex-col">
      <div className="grid grid-cols-3 gap-3">
        {SOURCES.map(({ Icon, name, purpose }) => (
          <div
            key={name}
            className="bg-white rounded-xl p-4 flex flex-col items-center justify-center gap-2 text-center"
          >
            <Icon className="size-[26px] shrink-0 text-ink" strokeWidth={1.5} aria-hidden="true" />
            <div className="flex flex-col gap-0.5">
              {/* medium, not semibold: 600 is the study's weight for
                  statements, 500 for labels, and this is a label. */}
              <span className="text-[16px] font-medium text-ink">{name}</span>
              <span className="text-[14px] text-muted">{purpose}</span>
            </div>
          </div>
        ))}
      </div>

      {/* The converge: a stub down from each card's centre onto a shared rail,
          which then drops into the surfaces below.

          This reuses the cards' own `grid-cols-3 gap-3` rather than positioning
          by percentage. A gapless 3-column grid does NOT share centres with a
          gapped one — the first attempt put the outer stubs 4px off their
          cards. Each rail segment instead runs from its column's centre and
          overhangs 6px, exactly half the 12px gap, so the three meet with no
          arithmetic and stay aligned at any width. */}
      <div aria-hidden className="grid h-12 grid-cols-3 gap-3">
        {SOURCES.map((s, i) => (
          <div key={s.name} className="relative">
            <span className={`absolute left-1/2 top-0 h-5 w-0 border-l ${DASH}`} />
            <span
              className={`absolute top-5 border-t ${DASH} ${
                i === 0 ? 'left-1/2 -right-1.5' : i === 1 ? '-left-1.5 -right-1.5' : '-left-1.5 right-1/2'
              }`}
            />
            {i === 1 && (
              <span className={`absolute left-1/2 top-5 h-7 w-0 border-l ${DASH}`} />
            )}
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        {SINKS.map(({ Icon, label }, i) => (
          <div key={label} className="flex flex-col gap-2">
            <div className="bg-white rounded-xl px-5 py-4 flex items-center justify-center gap-3">
              <Icon className="size-5 shrink-0 text-ink" strokeWidth={1.5} aria-hidden="true" />
              <span className="text-[16px] text-ink">{label}</span>
            </div>
            {/* The two surfaces are additive, not sequential — both had to be
                kept in sync for every rule change. */}
            {i === 0 && (
              <span aria-hidden className="text-center text-[14px] text-neutral-300">
                +
              </span>
            )}
          </div>
        ))}
      </div>

      <figcaption className="mt-3 text-center text-[12px] text-muted">
        Three programs, managed separately, landing on the same payment flow and
        the same campaign operations
      </figcaption>
    </figure>
  );
}
