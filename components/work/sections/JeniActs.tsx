import { ActsShell, type Act } from './ActsShell';
import { JeniPipeline } from './JeniPipeline';

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
      <Heading
        eyebrow="The starting point"
        title="I wasn’t given a product to design. I was given an ambition."
      />

      <p className="text-[16px] text-ink">
        Jeni started with a complaint from Bravo’s CEO and marketing team: by the time a new restaurant opened, or an existing one was visibly struggling, Bravo was often already late to the conversation.
      </p>
      <p className="text-[16px] text-ink">
      The initial ask was loose: could we use AI to spot those signals earlier, giving the team a better window to approach merchants before the opportunity became obvious?
      </p>
      <p className="text-[16px] text-ink">
        I turned that idea into Jeni’s first form: a market intelligence tool that monitored public signals around restaurant openings, closures, and other merchant activity.
      </p>

      {/* The first version, showing what "monitoring public signals" actually
          looked like. Drop the screenshot at this path — it is not in the repo
          yet. Same treatment as the Bravo booth photos: plain <img> with the
          study's hairline inset, and a caption at the shared 12px muted. */}
      <figure className="m-0 flex flex-col gap-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/work/jeni/monitoring-overview.png"
          alt="Jeni's monitoring overview: a Needs Attention summary bar over three columns of detected restaurants — New / Opening, Closed / At Risk, and For Sale — with counts for tracked restaurants and signals, and a list of source collectors below."
          className="w-full rounded-xl border border-line"
        />
        <figcaption className="text-[12px] text-muted">
          Jeni v1 — Metro Vancouver restaurant change detection, grouped by the
          signal each source reported
        </figcaption>
      </figure>

      {/* 20px semibold: the site's one weight for an in-act statement, the
          same treatment Bravo gives its turns. This is the act's pivot — the
          screen above is not the work — so it is set as a statement rather
          than as another body paragraph. */}
      <p className="text-[16px] font-semibold text-ink">
        The hard part wasn’t the dashboard. The signals Jeni needed didn’t exist
        as clean data.
      </p>

      <p className="text-[16px] text-ink">
        I built a pipeline that collected information across local media, health
        records, and business-for-sale listings, then combined deterministic
        rules, LLM interpretation, and entity matching to turn messy public
        information into structured merchant signals.
      </p>

      <JeniPipeline />
      <p className="text-[16px] text-ink">
        I deliberately kept AI narrow: deterministic logic handled what could be
        known reliably, while the LLM stepped in for ambiguous extraction and
        classification. When a merchant couldn’t be resolved with enough
        evidence, Jeni surfaced it for review instead of guessing.
      </p>

      <p className="text-[16px] text-ink">
        But after the first version worked, the brief became even less defined.
      </p>
      <p className="text-[16px] font-semibold italic text-ink">
        “Jeni could be more powerful. Could we connect it with Bravo and make it directly useful to the business?”
      </p>
      {/* The explicit {' '} before <strong> is load-bearing: `out` followed by
          a newline and a tag renders as "outwhat", because JSX strips the
          trailing whitespace on a line that ends in text. The comment sits out
          here rather than inside the paragraph for the same reason — placed
          mid-sentence it swallows the space next to it. */}
      <p className="text-[16px] text-ink">
        There was no PM, feature list, defined user flow, or clear answer for
        what “useful” meant. The next version of Jeni would have to start with
        figuring out{' '}
        <strong className="font-semibold">
          what problem was actually worth solving.
        </strong>
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
  // The id stays 'problem' so the section anchor (#the-problem) and any link
  // to it survive the rename — only the label a reader sees changes.
  { id: 'problem', label: 'Starting point', content: <Problem /> },
  { id: 'challenge', label: 'Challenge', content: <Challenge /> },
  { id: 'decision', label: 'Decision', content: <Decision /> },
  { id: 'outcome', label: 'Outcome', content: <Outcome /> },
];

export function JeniActs() {
  return <ActsShell acts={ACTS} />;
}
