import type { ReactNode } from 'react';
import { Building2, Megaphone, Scale, Users, type LucideIcon } from 'lucide-react';
import { BODY, CARD, Heading } from './cardKit';

/**
 * The four audiences the fragmented reward system cost something.
 *
 * Same card as the Decision act's cut/keep/rebuild calls — both sections are
 * "N facets of one problem", so they share the kit rather than each inventing
 * a surface. These previously used hand-drawn PNG characters, which were the
 * only decorative illustration in the project and read as imported from a
 * different deck.
 *
 * Glyphs name the audience rather than the symptom: the symptom is already the
 * first clause of every card's body.
 */
const STAKEHOLDERS: { Icon: LucideIcon; label: string; body: ReactNode }[] = [
  {
    Icon: Users,
    label: 'For users',
    body: (
      <>
        <strong className="font-bold">Mental math</strong> at the worst possible
        moment. Payment felt like a calculation, not trust.
      </>
    ),
  },
  {
    Icon: Scale,
    label: 'For finance',
    body: (
      <>
        <strong className="font-bold">Reconciliation</strong> was a guessing
        game. Which reward hit which transaction wasn&apos;t always clear.
      </>
    ),
  },
  {
    Icon: Megaphone,
    label: 'For marketing',
    body: (
      <>
        <strong className="font-bold">Targeted promotions</strong> were off the
        table. Every campaign had to be one-size-fits-all.
      </>
    ),
  },
  {
    Icon: Building2,
    label: 'For the business',
    body: (
      <>
        <strong className="font-bold">Harder to operate</strong>. Harder to
        explain to stakeholders.
      </>
    ),
  },
];

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
        {/* No fixed height — the grid already equalises the two cards in a
            row, so a hard 250px only ever added dead space under short copy. */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {STAKEHOLDERS.map(({ Icon, label, body }) => (
            <div key={label} className={`${CARD} flex flex-col gap-4`}>
              <Heading Icon={Icon}>{label}</Heading>
              <p className={BODY}>{body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

