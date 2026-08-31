/**
 * What each side needed, and the single thing that had to satisfy both.
 *
 * The heading this sits under asserts something — "Both had to win" — so the
 * figure resolves rather than asks: the two columns converge on one filled ink
 * bar, not on a question. That bar is the only dark element in the act besides
 * the Decision card's 2X tile, which is deliberate; it is the claim.
 *
 * The asymmetry is the argument. The customer column is short and the business
 * column is long, and they are set to the same width so that difference is
 * visible as shape before it is read as content. One side wants less, the other
 * needs more, and neither list could be shortened.
 *
 * House vocabulary otherwise: white cards, muted eyebrow over ink statement,
 * dashed neutral-300 connectives, no colour.
 */

const SIDES = [
  {
    eyebrow: 'Customer',
    statement: '“I just want to know what I get.”',
    needs: ['Predictable savings', 'Simple checkout', 'Clear reward value'],
  },
  {
    eyebrow: 'Business',
    statement: 'Different partners needed different campaign rules',
    needs: [
      'Different cashback rates',
      'Spend thresholds',
      'Time windows',
      'Visit requirements',
      'Campaign eligibility',
    ],
  },
];

const DASH = 'border-dashed border-neutral-300';

export function BravoBothSides() {
  return (
    <figure className="m-0 flex flex-col">
      <div className="grid gap-3 md:grid-cols-2">
        {SIDES.map((side) => (
          <div key={side.eyebrow} className="bg-white rounded-xl p-6 flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-[12px] text-muted">{side.eyebrow}</span>
              <span className="text-[14px] font-semibold text-ink">{side.statement}</span>
            </div>
            <ul className="flex flex-col gap-2">
              {side.needs.map((need) => (
                <li key={need} className="flex items-baseline gap-2.5">
                  <span
                    aria-hidden
                    className="mt-1.5 size-1 shrink-0 rounded-full bg-neutral-300"
                  />
                  <span className="text-[14px] text-ink">{need}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* The converge. Two stubs onto a shared rail, then one drop into the
          bar. Segments overhang 6px — half the 12px gap — so they meet at the
          container centre, which for two equal columns is also the midpoint of
          the two column centres. */}
      {/* Height is exactly the stub length, with the rail on the bottom edge,
          so the drop below continues from it with no dead space between. */}
      <div aria-hidden className="hidden h-6 grid-cols-2 gap-3 md:grid">
        {SIDES.map((side, i) => (
          <div key={side.eyebrow} className="relative">
            <span className={`absolute left-1/2 top-0 h-6 w-0 border-l ${DASH}`} />
            <span
              className={`absolute bottom-0 border-t ${DASH} ${
                i === 0 ? 'left-1/2 -right-1.5' : '-left-1.5 right-1/2'
              }`}
            />
          </div>
        ))}
      </div>
      {/* Stacked layout has nothing to converge across, so it gets a plain
          vertical run instead of a rail that would point at nothing. */}
      <div aria-hidden className="flex h-8 justify-center md:hidden">
        <span className={`h-full w-0 border-l ${DASH}`} />
      </div>
      <div aria-hidden className="hidden justify-center md:flex">
        <span className={`h-7 w-0 border-l ${DASH}`} />
      </div>

      <div className="rounded-xl bg-[#202020] px-5 py-4 text-center">
        <span className="text-[16px] font-medium text-white">One system</span>
      </div>

      <figcaption className="mt-3 text-[12px] text-muted">
        The flexibility had to stay. It just couldn&apos;t stay in the
        customer&apos;s payment flow.
      </figcaption>
    </figure>
  );
}
