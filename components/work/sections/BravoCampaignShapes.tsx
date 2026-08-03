import { ChevronRight, Clock } from 'lucide-react';

/**
 * Restaurant offer cards — one "campaign shape" per partner, shown over the
 * restaurant's own photo. Illustrates how each partner runs a different deal
 * (flat %, spend threshold, punch-card) while the user only ever sees a card.
 *
 * Cards use DM Sans (the Bravo app's product font) regardless of the portfolio
 * font switcher, so they read as real app UI. Horizontal scroll on overflow.
 */

type Segment = { filled: boolean };

type Offer = {
  img: string;
  pct: string;
  title: string;
  sub: string;
  /** Single spend-progress bar (fill % + caption). */
  bar?: { fill: number; label: string };
  /** Multi-segment punch-card progress + caption under the filled segments. */
  segments?: Segment[];
  segLabel?: string;
  /** Countdown footer, left side. */
  ends?: string;
  /** Corner ribbon, top-right. */
  ribbon?: string;
};

const OFFERS: Offer[] = [
  {
    img: '/work/bravo/challenge-1.jpg',
    pct: '3%',
    title: 'First purchase',
    sub: 'Up to $10 back',
  },
  {
    img: '/work/bravo/challenge-2.jpg',
    pct: '25%',
    title: 'Every $320 spent',
    sub: 'Up to $20 back',
    bar: { fill: 29.96, label: '$105.56/$320' },
  },
  {
    img: '/work/bravo/challenge-3.jpg',
    pct: '20%',
    title: 'Every 3 purchases',
    sub: 'Up to $15 back',
    segments: [{ filled: true }, { filled: false }, { filled: false }],
    segLabel: '$6.5 pending',
    ends: 'Ends on Aug 29th',
    ribbon: 'Min spend $10',
  },
  {
    img: '/work/bravo/challenge-4.jpg',
    pct: '15%',
    title: 'Every 3 purchases',
    sub: 'Up to $30 back',
    segments: [{ filled: true }, { filled: false }, { filled: false }],
    segLabel: '$121.5 pending',
    ends: 'Ends on July 29th',
  },
  {
    img: '/work/bravo/challenge-5.jpg',
    pct: '15%',
    title: 'Every purchase',
    sub: 'Up to $10 back',
    ends: 'Ends on May 29th',
  },
];

function OfferCard({ offer }: { offer: Offer }) {
  return (
    <div className="relative w-[345px] rounded-[15px] bg-white p-4 shadow-[0_0_4px_rgba(0,0,0,0.1)]">
      {offer.ribbon && (
        <div className="absolute right-0 top-0 rounded-bl-[15px] rounded-tr-[15px] bg-[#f8f8f8] px-2 py-1.5">
          <span className="text-[10px] leading-[13px] text-black">
            {offer.ribbon}
          </span>
        </div>
      )}

      <div className="flex gap-3">
        {/* Cashback badge */}
        <div className="flex size-11 shrink-0 flex-col items-center justify-center rounded-[10px] bg-[#282828] px-1.5 py-2 text-center text-white">
          <span className="text-[16px] font-bold leading-[21px]">
            {offer.pct}
          </span>
          <span className="text-[10px] leading-[13px]">back</span>
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex flex-col gap-1">
            <p className="text-[16px] font-bold leading-[21px] text-[#202020]">
              {offer.title}
            </p>
            <p className="text-[14px] leading-[19px] text-[#202020]">
              {offer.sub}
            </p>
          </div>

          {/* Single spend-progress bar */}
          {offer.bar && (
            <div className="flex flex-col gap-0.5">
              <div className="relative h-[7px] w-full overflow-hidden rounded-[5px] bg-[#e5e5ea]">
                <div
                  className="absolute inset-y-0 left-0 rounded-[5px] bg-[#202020]"
                  style={{ width: `${offer.bar.fill}%` }}
                />
              </div>
              <p className="text-[12px] leading-[16px] text-[#8e8e93]">
                {offer.bar.label}
              </p>
            </div>
          )}

          {/* Multi-segment punch-card */}
          {offer.segments && (
            <div className="flex w-full items-start gap-[5px]">
              {offer.segments.map((seg, i) => (
                <div key={i} className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <div
                    className={`h-[7px] w-full rounded-[5px] ${
                      seg.filled ? 'bg-black' : 'bg-[#e5e5ea]'
                    }`}
                  />
                  {seg.filled && offer.segLabel && (
                    <p className="text-[12px] leading-[16px] text-[#8e8e93]">
                      {offer.segLabel}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer: countdown (left) + more details (right) */}
      <div className="mt-3 flex items-center justify-between">
        {offer.ends ? (
          <div className="flex items-center gap-1 text-[#282828]">
            <Clock className="size-3 shrink-0" strokeWidth={1.5} />
            <span className="text-[10px] leading-[13px]">{offer.ends}</span>
          </div>
        ) : (
          <span className="text-[10px] leading-[13px] text-[#8e8e93]">
            More details
          </span>
        )}
        <ChevronRight className="size-3 shrink-0 text-[#8e8e93]" strokeWidth={2} />
      </div>
    </div>
  );
}

export function BravoCampaignShapes() {
  return (
    // Full-bleed: break out of the centered max-w-[800px] content column so the
    // cards run edge-to-edge across the page, scrolling horizontally on overflow.
    // Snap + touch momentum make the swipe feel native on mobile/tablet.
    <div className="relative left-1/2 right-1/2 z-20 -ml-[50vw] -mr-[50vw] w-screen snap-x snap-proximity overflow-x-auto px-6 [-webkit-overflow-scrolling:touch] [font-family:var(--font-dm)] [scrollbar-width:none] md:px-10">
      <div className="flex w-max gap-8">
        {OFFERS.map((offer) => (
          <div
            key={offer.img}
            className="relative flex h-[452px] w-[377px] shrink-0 snap-start items-end justify-center rounded-2xl bg-neutral-100 p-4"
          >
            <img
              src={offer.img}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 size-full rounded-2xl object-cover"
            />
            <div className="relative">
              <OfferCard offer={offer} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
