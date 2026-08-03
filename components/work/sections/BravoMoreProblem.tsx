import type { ReactNode } from 'react';

export function BravoMoreProblem() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        {/* <p className="text-[16px] text-ink">What was actually broken</p> */}
        <h2 className="text-[20px] font-semibold text-ink">
          The incentive system wasn&apos;t badly designed. It was never designed
          as a system at all.
        </h2>
      </div>

      <p className="text-[16px] text-ink">
        Each mechanism had been built for a different goal: points as the
        retention driver (100 points = $1, so users came back to spend what
        they&apos;d earned), threshold coupons as the acquisition hook,
        top-up bonus as the cashflow lever, stacking logic to combine them
        at checkout. Each made sense for what it was built to do. None had
        ever been evaluated as one experience. The cost showed up everywhere.
      </p>

      <div className="flex flex-col gap-2">
        <p className="text-[16px] text-ink">
          And it wasn&apos;t just the user. The same mess showed up in four
          places at once.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <StakeholderCard
            icon="/work/bravo/illustrations/for-users.png"
            iconHeight={82}
            iconWidth={88}
            innerHeight={64}
            innerWidth={68}
            label="For users"
          >
            <strong className="font-bold">Mental math</strong> at the worst
            possible moment. Payment felt like a calculation, not trust.
          </StakeholderCard>

          <StakeholderCard
            icon="/work/bravo/illustrations/for-finance.png"
            iconHeight={80}
            iconWidth={88}
            label="For finance"
          >
            <strong className="font-bold">Reconciliation</strong> was a
            guessing game. Which reward hit which transaction wasn&apos;t
            always clear.
          </StakeholderCard>

          <StakeholderCard
            icon="/work/bravo/illustrations/for-marketing.png"
            iconHeight={81}
            iconWidth={104}
            label="For marketing"
          >
            <strong className="font-bold">Targeted promotions</strong> were off
            the table. Every campaign had to be one-size-fits-all.
          </StakeholderCard>

          <StakeholderCard
            icon="/work/bravo/illustrations/for-business.png"
            iconHeight={87}
            iconWidth={102}
            label="For the business"
          >
            <strong className="font-bold">Harder to operate</strong>. Harder to
            explain to stakeholders.
          </StakeholderCard>
        </div>
      </div>
    </div>
  );
}

export function StakeholderCard({
  icon,
  iconWidth,
  iconHeight,
  innerWidth,
  innerHeight,
  label,
  children,
}: {
  icon: string;
  iconWidth: number;
  iconHeight: number;
  innerWidth?: number;
  innerHeight?: number;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl px-6 py-8 flex flex-col gap-4 h-[250px]">
      <div className="flex flex-col gap-3">
        <div
          style={{ width: iconWidth, height: iconHeight }}
          className="flex items-center"
        >
          <div
            style={{
              width: innerWidth ?? iconWidth,
              height: innerHeight ?? iconHeight,
            }}
            className="flex items-center"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={icon}
              alt=""
              aria-hidden="true"
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>
        <p className="text-[14px] text-ink">{label}</p>
      </div>
      <p className="text-[14px] text-ink">{children}</p>
    </div>
  );
}
