import { BravoBothSides } from './BravoBothSides';
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
        Simplifying the rewards wasn’t as simple as removing the rules. Bravo had different commercial agreements across its restaurant network, so campaigns needed to support different rates, thresholds, time windows, and eligibility conditions.

The business needed that flexibility. Customers didn’t need to manage it at checkout.
      </p>
      {/* States the two sets of needs and resolves them into the assertion the
          heading makes. NOTE: BravoTwoSides below makes a closely related
          two-column argument and ends on a question — see the handoff note in
          the component. Worth deciding whether the act needs both. */}
      <BravoBothSides />

      <BravoTwoSides />
    </div>
  );
}
