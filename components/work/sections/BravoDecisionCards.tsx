import { Check, RotateCw, X } from 'lucide-react';
import { BODY, CARD, Heading } from './cardKit';

/**
 * The three cut/keep/rebuild calls (Figma 593:6370).
 *
 * Each card is a glyph and a name on one line, then the reasoning underneath.
 * The verdict is carried by the icon — a cross, a tick, a redraw — rather than
 * by a coloured label, which keeps the row monochrome and lets the three read
 * as one set.
 *
 * Cut and Kept pair off on top; Rebuilt runs full width because it is the only
 * one carrying evidence, and the evidence sits opposite the claim.
 *
 * The icons are lucide rather than the exported SVGs: the Figma layers are
 * literally named `x`, `check` and `rotate-cw`, so the package has the same
 * glyphs, and they inherit colour and stroke instead of relying on asset URLs
 * that expire after a week.
 */

export function BravoDecisionCards() {
  return (
    <div className="flex flex-col gap-4">
      {/* The two short calls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={`${CARD} flex flex-col gap-4`}>
          <Heading Icon={X}>Threshold coupon</Heading>
          <p className={BODY}>
            Rounds of rounds campaign showed, the users it brings are only
            buying the downloads, users left quickly when coupons are redeemed.
          </p>
        </div>

        <div className={`${CARD} flex flex-col gap-4`}>
          <Heading Icon={Check}>Top-up bonus</Heading>
          <p className={BODY}>
            A win-win feature, not only drives the revenue and users are loving
            it.
          </p>
        </div>
      </div>

      {/* The call that carries proof — claim left, evidence right */}
      <div
        className={`${CARD} flex flex-col gap-6 md:flex-row md:items-center md:justify-between md:gap-10`}
      >
        <div className="flex flex-col gap-4 md:max-w-[344px]">
          <Heading Icon={RotateCw}>Points conversion</Heading>
          <p className={BODY}>
            Cashback earned its place because an unspent balance behaves like a
            return ticket:
          </p>
        </div>

        <div className="flex shrink-0 flex-col items-start justify-center gap-1.5">
          {/* Grid, not flex. The tile takes its height from the paragraph and
              squares off against it, and only a grid can do that: a flex item
              draws its base size from content, so `aspect-square` was ignored
              and the tile overflowed its own track — the copy ended up sitting
              6px over the tile's right edge instead of clearing it. */}
          <div className="grid grid-cols-[auto_minmax(0,240px)] items-stretch gap-4">
            <div className="h-full">
              <span className="flex aspect-square h-full items-center justify-center rounded-2xl bg-[#202020] text-[36px] font-bold leading-none tracking-[-0.9px] text-white">
                2X
              </span>
            </div>
            <p className={BODY}>
              Diners holding $30+ in cashback came back about twice as often as
              everyone else.
            </p>
          </div>
          <p className="text-[14px] tracking-[-0.28px] text-neutral-400">
            PostHog • 90-day cohorts
          </p>
        </div>
      </div>
    </div>
  );
}
