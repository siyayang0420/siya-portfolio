import { MathCardCollapse } from './MathCardCollapse';
import { BravoPrototype } from './BravoPrototype';
import { PhoneShotCarousel } from './PhoneShotCarousel';

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
        A user is sitting at a restaurant table. The bill arrives. They open
        Bravo to pay, and start doing calculation in their head:
      </p>

      <div id="prototype-demo" className="scroll-mt-[135px]">
        <BravoPrototype />
      </div>

      <MathCardCollapse />

      <p className="text-[16px] text-ink">
        Each one alone is fine. Hit the user with all four at payment, and
        you&apos;ve got a{' '}
        <strong className="font-bold">payment trust problem</strong>.
        They&apos;re doing math in front of friends, server hovering, unsure
        what showing the code will actually cost.
      </p>

      {/* <figure className="flex flex-col gap-2 items-center w-full">
        <PhoneShotCarousel />
        <figcaption className="text-[12px] text-neutral-500">
          Payment successfully in different cases
        </figcaption>
      </figure> */}
    </div>
  );
}
