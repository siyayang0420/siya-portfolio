import { MathCardCollapse } from './MathCardCollapse';
import { BravoPrototype } from './BravoPrototype';
import { PhoneShotCarousel } from './PhoneShotCarousel';
import { BravoRewardStack } from './BravoRewardStack';
import { BravoSavingMath } from './BravoSavingMath';

/**
 * Field photos from the Richmond booth shifts. Drop the two files at these
 * paths — they are not in the repo yet.
 */
const BOOTH_PHOTOS = [
  {
    src: '/work/bravo/booth-1.jpg',
    alt: 'Customers gathered at the Bravo booth in a Richmond mall food court',
  },
  {
    src: '/work/bravo/booth-2.jpg',
    alt: 'Bravo staff in branded jackets setting up the booth display',
  },
];

export function BravoProblem() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <p className="text-[16px] text-ink">
          The Problem
        </p>
        <h2 className="text-[24px] font-semibold text-ink">
          Every payment turned into a math problem.
        </h2>
      </div>

      <p className="text-[16px] text-ink">
        Our field team regularly promoted Bravo in person at partner locations
        around Richmond, where they kept running into the same problem:
        explaining how someone actually saved money with Bravo took too long.
      </p>

      <p className="text-[16px] text-ink">
        After our CEO experienced this firsthand, I took a booth shift myself to
        find out where the explanation was breaking down. I didn&apos;t
        understand how bad it was until I had to{' '}
        <strong className="font-semibold">sell Bravo myself</strong>.
      </p>

      {/* The booth itself, sitting with the paragraph that puts the reader
          there. Both source photos are portrait, so a shared 3:4 box with
          object-cover keeps the pair level however each was framed. Side by
          side at every width — they are context, and at this size the scene
          still reads on a phone. */}
      <figure className="m-0 flex flex-col gap-2">
        <div className="grid grid-cols-2 gap-3">
          {BOOTH_PHOTOS.map((photo) => (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              key={photo.src}
              src={photo.src}
              alt={photo.alt}
              className="aspect-[3/4] w-full rounded-xl border border-line object-cover"
            />
          ))}
        </div>
        <figcaption className="text-[12px] text-muted">
          Promoting Bravo at partner locations in Richmond
        </figcaption>
      </figure>

      <p className="text-[16px] text-ink">
        People understood the basic idea quickly — pay with Bravo at
        participating restaurants and save money. The conversation became
        difficult when they asked one simple question:
      </p>

      {/* The question the act turns on, with its instruction. Their own tight
          gap-2 rather than the section's gap-8: the second line is a caption on
          the first, and at the section spacing they read as two unrelated
          beats. It hands straight off to the prototype below — the reader is
          meant to try it, not just read about it. */}
      <div className="flex flex-col gap-2">
        <p className="text-[20px] font-medium text-ink">
          &ldquo;So how much do I actually save?&rdquo;
        </p>
        <p className="text-[14px] text-muted">
          Try answering that question using the old reward system.
        </p>
      </div>

      <div id="prototype-demo" className="scroll-mt-[135px]">
        <BravoPrototype />
      </div>

      <MathCardCollapse />

      <p className="text-[16px] text-ink">
        Each reward made sense on its own. The problem emerged when customers
        had to understand how they interacted.
      </p>

      <BravoSavingMath />

      <p className="text-[16px] text-ink">
        At the booth, explaining a single $100 payment could require walking
        through a top-up bonus, an eligible coupon, the remaining balance, a
        cashback rate, and how that cashback could be used later.
      </p>

      {/* The turn the act exists to make, so the second sentence carries the
          weight the old "payment trust problem" phrase used to. */}
      <p className="text-[16px] text-ink">
        I wasn&apos;t the only one running into this. Our 20+ field staff
        consistently had the same issue: it took too long to explain how the
        rewards worked and how much someone would actually save.
      </p>

      <p className="text-[16px] text-ink">
        And without someone there to explain it, the same confusion showed up in customer support. Users regularly reached out to ask how their savings worked or why a reward hadn’t applied.
      </p>

      {/* Its own paragraph, not a trailing clause. Sharing a <p> with the line
          above rendered as "...actually save.The reward model..." — JSX drops
          the whitespace before an element when it spans a newline. */}
      <p className="text-[16px] text-ink">
        <strong className="font-semibold">
          The reward model itself had become too difficult to explain.
        </strong>
      </p>

      {/* Three payment-success states side by side (Figma 42:1896). The
          carousel already renders exactly that from md up — a three-column
          grid on a 24px gap — and falls back to a snapping scroller with dots
          below it, where three 198×460 panels would be unreadable. */}
      <figure className="m-0 flex w-full flex-col items-center gap-1">
        <PhoneShotCarousel />
        <figcaption className="text-[12px] text-neutral-500">
          Payment successfully in different cases
        </figcaption>
      </figure>

      {/* Widens the problem from the till to the org, and hands off to the
          four stakeholder cards in BravoMoreProblem directly below. */}
      <p className="text-[20px] font-semibold text-ink">
        The same complexity was creating work behind the scenes.
      </p>

      <p className="text-[16px] text-ink">
        The reward rules had to be configured, changed, timed, and reconciled across marketing, engineering, operations, and finance.
      </p>

      <p className="text-[16px] text-ink">
        At the booth, we could explain the rules in person. In the app, users had to make sense of the same system on their own. The same confusion showed up in support, where customers regularly called to ask how their savings worked or why a reward hadn’t applied.
      </p>

      {/* Names the shape of the problem, then the diagram shows it. */}
      <h2 className="text-[20px] font-semibold text-ink">
        The incentive system wasn&apos;t badly designed. It was never designed
        as a system at all.
      </h2>

      <p className="text-[16px] text-ink">
        Each reward had been introduced for a different reason. Points
        encouraged repeat visits. Threshold coupons helped bring customers into
        selected restaurants. Top-up bonuses encouraged users to keep money in
        Bravo. Over time, these mechanisms started overlapping in the same
        payment and campaign flows — but they were still being managed as
        separate programs.
      </p>

      <BravoRewardStack />
    </div>
  );
}
