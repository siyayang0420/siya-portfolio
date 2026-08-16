import { Star, TicketPercent, TrendingUp, Wallet } from 'lucide-react';

/**
 * The four reward mechanisms a diner is juggling at the till.
 *
 * Icons are lucide rather than the bitmap set these used to load: they inherit
 * `currentColor` and stroke weight, so they stay consistent with the rest of
 * the case study and stay sharp at any density.
 *
 * The first and last tile are both about points, so they deliberately differ —
 * `Star` is the balance you are holding, `TrendingUp` the rate you accrue at.
 * Reusing one glyph for both (as the old PNGs did) read as a duplicate row.
 */
const TILES = [
  {
    Icon: Star,
    title: '1240 points',
    subtitle: '$12.4 redeemable',
  },
  {
    Icon: TicketPercent,
    title: '$15 off',
    subtitle: 'when spend $100',
  },
  {
    Icon: Wallet,
    title: '4 top up tiers',
    subtitle: 'different bonuses',
  },
  {
    Icon: TrendingUp,
    title: 'earn points',
    subtitle: '5%',
  },
];

export function MathCardCollapse() {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-[16px] font-medium text-ink">
        4 rewards systems are going on at the same time
      </p>

      {/* One row of four from md up; two-up below, where four would leave each
          tile under 100px. */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {TILES.map((tile) => (
          <StatTile key={tile.title + tile.subtitle} {...tile} />
        ))}
      </div>
    </div>
  );
}

function StatTile({
  Icon,
  title,
  subtitle,
}: {
  Icon: typeof Star;
  title: string;
  subtitle: string;
}) {
  return (
    // Icon above the text rather than beside it. Four across the 800px column
    // leaves 191px per tile, and the side-by-side arrangement needs 203px for
    // the longest label — stacking gets the same content into ~156px.
    <div className="bg-white rounded-xl flex flex-col items-center justify-center gap-2 h-[117px] px-3 text-center">
      <Icon
        className="size-[26px] shrink-0 text-ink"
        strokeWidth={1.5}
        aria-hidden="true"
      />
      <div className="flex flex-col gap-0.5 justify-center whitespace-nowrap">
        <p className="text-[16px] font-medium text-ink">{title}</p>
        <p className="text-[14px] text-neutral-500">{subtitle}</p>
      </div>
    </div>
  );
}
