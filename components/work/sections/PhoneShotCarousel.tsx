'use client';

import { useEffect, useRef, useState } from 'react';

const SHOTS = [
  {
    src: '/work/bravo/phone-1.jpg',
    alt: 'Bravo payment success — points only',
  },
  {
    src: '/work/bravo/phone-2.jpg',
    alt: 'Bravo payment success — coupon applied',
  },
  {
    src: '/work/bravo/phone-3.jpg',
    alt: 'Bravo payment success — coupon and points combined',
  },
];

export function PhoneShotCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const updateActive = () => {
      const wrapRect = el.getBoundingClientRect();
      const wrapCenter = wrapRect.left + wrapRect.width / 2;
      const track = el.firstElementChild as HTMLElement | null;
      if (!track) return;
      const children = Array.from(track.children) as HTMLElement[];
      let closest = 0;
      let closestDist = Infinity;
      for (let i = 0; i < children.length; i++) {
        const r = children[i].getBoundingClientRect();
        const childCenter = r.left + r.width / 2;
        const d = Math.abs(childCenter - wrapCenter);
        if (d < closestDist) {
          closestDist = d;
          closest = i;
        }
      }
      setActiveIdx(closest);
    };

    updateActive();
    el.addEventListener('scroll', updateActive, { passive: true });
    return () => el.removeEventListener('scroll', updateActive);
  }, []);

  return (
    <>
      <div
        ref={scrollRef}
        className="w-full overflow-x-auto md:overflow-visible -mx-2 md:mx-0"
      >
        <div className="flex md:grid md:grid-cols-3 gap-4 md:gap-6 px-2 md:px-0 snap-x snap-mandatory">
          {SHOTS.map((shot) => (
            <div
              key={shot.src}
              className="shrink-0 w-[70%] md:w-auto snap-start aspect-[198/460] rounded-2xl border border-neutral-200 overflow-hidden bg-neutral-50"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={shot.src}
                alt={shot.alt}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
      <div className="md:hidden flex items-center justify-center gap-1.5 mt-1">
        {SHOTS.map((_, i) => (
          <span
            key={i}
            aria-hidden="true"
            className={`size-1.5 rounded-full transition-colors duration-200 ${
              i === activeIdx ? 'bg-ink' : 'bg-neutral-300'
            }`}
          />
        ))}
      </div>
    </>
  );
}
