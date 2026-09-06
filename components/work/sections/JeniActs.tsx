import { ActsShell, type Act } from './ActsShell';

/**
 * Four-act layout for the Jeni case study.
 *
 * ── DRAFT ──────────────────────────────────────────────────────────────────
 * Every sentence below is drawn from the project's own overview in
 * content/projects.ts. Nothing here is invented: there are no figures, no
 * quotes and no research findings, because none have been supplied yet. The
 * acts are deliberately short rather than padded — a thin true page can be
 * filled in, whereas a full page of plausible fiction has to be unpicked
 * first, and in a portfolio the fiction is the part that gets asked about in
 * an interview.
 *
 * Each act carries a TODO naming what it still needs. The structure matches
 * Bravo's so the two read as the same kind of document.
 * ───────────────────────────────────────────────────────────────────────────
 */

function Heading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-[16px] text-ink">{eyebrow}</p>
      <h2 className="text-[24px] font-semibold text-ink">{title}</h2>
    </div>
  );
}

function Problem() {
  return (
    <div className="flex flex-col gap-6">
      <Heading eyebrow="The Problem" title="It started as two offhand complaints." />

      <p className="text-[16px] text-ink">
        Bravo&apos;s business development team works a market that turns over
        constantly — restaurants across Metro Vancouver open, close, and change
        hands — and tracking it meant searching by hand.
      </p>

      {/* TODO — what this act still needs:
          · who complained, and what they were actually doing each week
          · how long the manual search took, and what it cost the team
          · the moment you decided it was worth building */}
    </div>
  );
}

function Challenge() {
  return (
    <div className="flex flex-col gap-6">
      <Heading
        eyebrow="The Challenge"
        title="An informal brief, and no one asking for it."
      />

      <p className="text-[16px] text-ink">
        There was no request, no spec, and no allocated time. Turning two
        passing remarks into something the company could rely on meant defining
        the problem before anyone had agreed it was one.
      </p>

      {/* TODO — what this act still needs:
          · the constraint that shaped the build (time, data access, cost?)
          · what you had to decide without a stakeholder to ask
          · why it had to be built rather than bought or done manually */}
    </div>
  );
}

function Decision() {
  return (
    <div className="flex flex-col gap-6">
      <Heading eyebrow="The Decision" title="Watch the market, then close the loop." />

      <p className="text-[16px] text-ink">
        Jeni monitors Metro Vancouver in real time for restaurant openings,
        closures, and risk signals, then automates contact discovery — so a new
        lead arrives with a way to reach it, rather than as a name to go and
        research.
      </p>

      {/* TODO — what this act still needs:
          · where the signals come from, and how they are judged reliable
          · what you deliberately left out of scope
          · the screens: the monitoring view and the contact-discovery flow */}
    </div>
  );
}

function Outcome() {
  return (
    <div className="flex flex-col gap-6">
      <Heading eyebrow="The Outcome" title="From a side project to the roadmap." />

      <p className="text-[16px] text-ink">
        Jeni is live. It sits on the CTO&apos;s roadmap and in the CEO&apos;s
        investor pitch deck.
      </p>

      {/* TODO — what this act still needs:
          · what changed for the BD team once it shipped, in their words
          · anything measured — leads found, time saved, coverage
          · what you would build next, and what the tool still gets wrong */}
    </div>
  );
}

const ACTS: Act[] = [
  { id: 'problem', label: 'Problem', content: <Problem /> },
  { id: 'challenge', label: 'Challenge', content: <Challenge /> },
  { id: 'decision', label: 'Decision', content: <Decision /> },
  { id: 'outcome', label: 'Outcome', content: <Outcome /> },
];

export function JeniActs() {
  return <ActsShell acts={ACTS} />;
}
