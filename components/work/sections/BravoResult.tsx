import { CircleDollarSign, Wallet } from 'lucide-react';

const TOP_UP_POINTS = [
  'Before dining, not at checkout',
  'Instant value, zero friction',
  'Kept because it works for everyone',
];

const CASHBACK_POINTS = [
  '$1 cashback = $1 toward the next meal',
  'No stacking, no conversion',
  'Flexible for campaigns, invisible to users',
];

export function BravoResult() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <p className="text-[16px] text-ink">The Outcome</p>
        <h2 className="text-[24px] font-semibold text-ink">
          It worked for all four sides at once.
        </h2>
      </div>

      {/* Existing 2-column summary card */}
      <div className="bg-white rounded-2xl px-6 py-8 sm:px-10 sm:py-11 flex justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
          <SystemColumn
            icon={<Wallet size={32} strokeWidth={1.5} className="text-ink" />}
            title="Top up bonus"
            points={TOP_UP_POINTS}
          />
          <SystemColumn
            icon={
              <CircleDollarSign
                size={32}
                strokeWidth={1.5}
                className="text-ink"
              />
            }
            title="Cashback system"
            points={CASHBACK_POINTS}
          />
        </div>
      </div>

      {/* What changed after launch */}
      <p className="text-[16px] text-ink">
        The unified system shipped to all 45,000 users. Marketing started
        configuring new campaigns without filing engineering tickets. Finance
        moved from reconciling four reward types to reconciling one. Customer
        support stopped fielding &ldquo;how does this work?&rdquo; questions
        about cashback within a few weeks of launch.
      </p>

      {/* Reflection — forward-looking, grounded in the 2x insight */}
      <div className="flex flex-col gap-2 border-l-2 border-neutral-200 pl-5 py-1">
        <p className="text-[12px] tracking-[0.14em] uppercase text-muted">
          What I&apos;d do next
        </p>
        <p className="text-[16px] text-ink">
          The 2× frequency number is an average, and averages hide a lot. A
          regular sitting on $30 of cashback and a first-timer aren&apos;t the
          same person, but today they get the same rate. With more time,
          that&apos;s what I&apos;d change: pull in transaction history, visit
          patterns, and how each person actually uses the app, then build a
          reward algorithm that tunes the rate per user instead of per
          campaign. Same system, just personalized to who it&apos;s
          rewarding.
        </p>
      </div>

      {/* Closing line */}
      {/* <p className="text-[16px] text-ink">
        A year in, the model&apos;s still running as-is. Marketing ships
        campaigns on it, finance closes the books on it, and nobody&apos;s
        asked me to add a fifth reward type.
      </p> */}
    </div>
  );
}

function SystemColumn({
  icon,
  title,
  points,
}: {
  icon: React.ReactNode;
  title: string;
  points: string[];
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="mb-1">{icon}</div>
      <p className="text-[16px] font-medium text-ink tracking-[0.02em]">
        {title}
      </p>
      <ul className="list-disc pl-5 text-[14px] text-neutral-500 tracking-[0.02em] leading-[1.5]">
        {points.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>
    </div>
  );
}
