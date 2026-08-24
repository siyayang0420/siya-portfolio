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
    title: '1,240 points',
    subtitle: '$12.40 available to redeem',
  },
  {
    Icon: TicketPercent,
    title: '$15 off $100',
    subtitle: 'Only if the payable bill stays ≥ $100',
  },
  {
    Icon: Wallet,
    title: '4 bonus tiers',
    subtitle: 'More value when adding funds',
  },
  {
    Icon: TrendingUp,
    title: '5% back',
    subtitle: 'Earned after every payment',
  },
];

export function MathCardCollapse() {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-[16px] font-medium text-ink">
        4 ways to save, each with different rules
      </p>

      {/* Two-by-two. One column below sm, where half of 375px would force the
          longer subtitles to wrap mid-phrase. */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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
    // Left-aligned, and `min-h` rather than a fixed height: the subtitles now
    // carry full sentences, so a hard 117px would clip the ones that wrap.
    // `whitespace-nowrap` is gone for the same reason.
    <div className="bg-white rounded-xl flex flex-col items-start justify-center gap-2 min-h-[117px] p-5">
      <Icon
        className="size-[26px] shrink-0 text-ink"
        strokeWidth={1.5}
        aria-hidden="true"
      />
      <div className="flex flex-col gap-0.5">
        <p className="text-[16px] font-medium text-ink">{title}</p>
        <p className="text-[14px] text-neutral-500">{subtitle}</p>
      </div>
    </div>
  );
}
