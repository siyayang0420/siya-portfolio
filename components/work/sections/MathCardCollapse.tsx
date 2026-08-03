const TILES = [
  {
    iconSrc: '/work/bravo/icons/point.png',
    title: '1240 points',
    subtitle: '$12.4 redeemable',
  },
  {
    iconSrc: '/work/bravo/icons/coupon.png',
    title: '$15 off',
    subtitle: 'when spend $100',
  },
  {
    iconSrc: '/work/bravo/icons/wallet.png',
    title: '4 top up tiers',
    subtitle: 'different bonuses',
  },
  {
    iconSrc: '/work/bravo/icons/point.png',
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {TILES.map((tile) => (
          <StatTile key={tile.title + tile.subtitle} {...tile} />
        ))}
      </div>
    </div>
  );
}

function StatTile({
  iconSrc,
  title,
  subtitle,
}: {
  iconSrc: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="bg-white rounded-xl flex items-center justify-center gap-3 h-[117px] px-4">
      <div className="size-[35px] flex items-center justify-center shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={iconSrc}
          alt=""
          aria-hidden="true"
          className="max-w-full max-h-full object-contain"
        />
      </div>
      <div className="flex flex-col gap-1 justify-center whitespace-nowrap">
        <p className="text-[16px] font-medium text-ink">{title}</p>
        <p className="text-[14px] text-neutral-500">{subtitle}</p>
      </div>
    </div>
  );
}
