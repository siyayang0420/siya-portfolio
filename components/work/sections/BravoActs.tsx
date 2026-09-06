import { BravoProblem } from './BravoProblem';
import { BravoMoreProblem } from './BravoMoreProblem';
import { BravoChallenge } from './BravoChallenge';
import { BravoDecision } from './BravoDecision';
import { BravoCampaignDemo } from './BravoCampaignDemo';
import { BravoShowcase } from './BravoShowcase';
import { BravoResult } from './BravoResult';
import { ActsShell, type Act } from './ActsShell';

/**
 * Four-act layout for the Bravo case study.
 *
 * The progress bar, scroll tracking and id scheme all live in ActsShell now —
 * they are how a case study reads on this site rather than anything about
 * Bravo. What is left here is the running order.
 *
 * The two demos live inside their parent acts (prototype in Problem, admin tool
 * in Decision) and are linkable from the "View BEFORE / View AFTER" buttons in
 * the meta block.
 */
const ACTS: Act[] = [
  {
    id: 'problem',
    label: 'Problem',
    content: (
      <>
        <BravoProblem />
        <BravoMoreProblem />
      </>
    ),
  },
  { id: 'challenge', label: 'Challenge', content: <BravoChallenge /> },
  {
    id: 'decision',
    label: 'Decision',
    content: (
      <>
        <BravoDecision />
        <div id="admin-demo" className="flex flex-col gap-12 scroll-mt-[135px]">
          <BravoCampaignDemo />
          <BravoShowcase />
        </div>
      </>
    ),
  },
  { id: 'outcome', label: 'Outcome', content: <BravoResult /> },
];

export function BravoActs() {
  return <ActsShell acts={ACTS} />;
}
