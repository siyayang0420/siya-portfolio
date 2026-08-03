import { BravoTwoSides } from './BravoTwoSides';

export function BravoChallenge() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <p className="text-[16px] text-ink">The Challenge</p>
        <h2 className="text-[24px] font-semibold text-ink">
          Two sides. One system. Both had to win.
        </h2>
      </div>

      <p className="text-[16px] text-ink">
        The problem wasn&apos;t only on the user&apos;s end. After spending
        time with marketing and the business development team, I realized
        there was a second problem hiding on the restaurant side.
      </p>

      <p className="text-[16px] text-ink">
        Bravo earns differently from every restaurant on the network. Each
        partner has its own{' '}
        <strong className="font-bold">margin deal</strong>, which means
        different restaurants{' '}
        <strong className="font-bold">need different campaign shapes</strong>.
        The business genuinely needed that flexibility. What it didn&apos;t
        need was for all of it to hit the user at the moment of payment.
        That&apos;s the worst possible moment to ask someone to think. The
        flexibility had to stay. It just couldn&apos;t sit in front of the
        user.
      </p>

      <BravoTwoSides />
    </div>
  );
}
