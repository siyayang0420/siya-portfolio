import { Play } from 'lucide-react';
import { ActsShell, type Act } from './ActsShell';
import { JeniDinerModel } from './JeniDinerModel';
import { JeniIntervention } from './JeniIntervention';
import { JeniMoves } from './JeniMoves';
import { JeniPasses, type Pass } from './JeniPasses';
import { JeniReasoning } from './JeniReasoning';
import { JeniSignals } from './JeniSignals';
import { JeniWorkflow } from './JeniWorkflow';
import { JeniPipeline } from './JeniPipeline';
import { JeniRunway } from './JeniRunway';
import { JeniValueModel } from './JeniValueModel';

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
        Bravo’s CEO and marketing team had a recurring problem. By the time a
        new restaurant opened or an existing one was visibly struggling, the
        team was often already late to the opportunity.
      </p>
      <p className="text-[16px] text-ink">
        The initial ask was loose: could AI help Bravo spot these signals
        earlier?
      </p>
      <p className="text-[16px] text-ink">
        I turned that idea into the first version of Jeni, a market
        intelligence tool that monitored public signals around restaurant
        openings, closures, and other merchant activity.
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

      {/* Semibold by the same rule as "The hard part wasn't the dashboard"
          below: a one-line turn after a figure, with its argument under it. */}
      <p className="text-[16px] font-semibold text-ink">
        That first version changed the scope of my role.
      </p>

      <p className="text-[16px] text-ink">
        After seeing me turn a loosely defined AI idea into a working product,
        the CEO gave me a much broader mandate: expand Jeni across Bravo.
      </p>

      <p className="text-[16px] text-ink">
        The monitoring capability would remain part of Jeni, but it was no
        longer the product itself. The next version needed to address Bravo’s
        internal needs, with no predefined problem, workflow, or solution to
        start from.
      </p>

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

      <JeniPipeline>
        <p className="text-[16px] text-ink">
          I deliberately kept AI narrow: deterministic logic handled what could
          be known reliably, while the LLM stepped in for ambiguous extraction
          and classification. When a merchant couldn’t be resolved with enough
          evidence, Jeni surfaced it for review instead of guessing.
        </p>
      </JeniPipeline>

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

      {/* One of the collectors, end to end. Drop the screenshot at this path —
          it is not in the repo yet. Same treatment as the monitoring overview
          above: plain <img>, the study's hairline inset, 12px muted caption. */}
      <figure className="m-0 flex flex-col gap-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/work/jeni/vch-report.png"
          alt="Jeni's VCH report: counts for active closures, reopened, and unresolved, above a table of health closures listing each restaurant, city, closure period, reason, and when it was last checked — with a separate collapsed group for unresolved listings."
          className="w-full rounded-xl border border-line"
        />
        <figcaption className="text-[12px] text-muted">
          One collector in full — health closure orders, with the listings Jeni
          could not tie to a merchant kept in their own group rather than
          guessed at
        </figcaption>
      </figure>

      {/* TODO — what this act still needs:
          · who complained, and what they were actually doing each week
          · how long the manual search took, and what it cost the team
          · the moment you decided it was worth building */}
    </div>
  );
}

/**
 * The Merchants finding — what the pass established, in its own words.
 *
 * Two sentences lifted verbatim from the pass: its opening line, and the one
 * that names the model the runway figure then draws. They are the answer to
 * "where is demand moving, and where is credit stuck"; everything else in the
 * pass is how that answer was reached, and lives in the fold below. The
 * second sentence is *moved* here, not copied — it no longer sits between
 * the low-credit-alert paragraph and the runway figure, so nothing on the
 * page is said twice.
 */
function MerchantsFinding() {
  return (
    <>
      <p className="text-[16px] text-ink">
        The data showed what happened—not what needed attention.
      </p>
      <p className="text-[16px] text-ink">
        To know when Bravo should act, I needed to connect the credit ledger
        with actual diner demand.
      </p>
    </>
  );
}

/**
 * The Merchants evidence — the records, the story, and the runway model.
 *
 * Everything from the portal's records through the runway figure belongs to
 * this side: it is one continuous argument about merchant credit and the
 * demand that burns it, so it all sits in the one fold rather than being
 * split across the act.
 */
function MerchantsEvidence() {
  return (
    <>
      <div className="flex flex-col gap-3">
        <p className="text-[16px] text-ink">
          Bravo’s existing portal already recorded individual transactions and
          merchant credit purchases. But with 500+ restaurant partners, those
          records were difficult to turn into operational awareness.
        </p>

        <p className="text-[16px] text-ink">
          That gap became tangible when a merchant ran out of prepaid credit
          without the BD team noticing. A diner attempted to pay, the
          transaction was rejected, and the team only discovered the issue after
          the diner complained.
        </p>
      </div>

      {/* The records themselves. Side by side rather than stacked: the point
          is the volume, not any single row, and two walls of numbers make that
          argument better than one at twice the width. */}
      <figure className="m-0 flex flex-col gap-2">
        <div className="grid gap-3 sm:grid-cols-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/work/jeni/merchant-credit-table.png"
            alt="A merchant credit table: rows of previous credit, funding amount, credit acquired, resulting Bravo credit balance, previous and new rate, and funding method."
            className="w-full rounded-xl border border-line"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/work/jeni/transactions-table.png"
            alt="A transaction table: rows of QR code payments showing amount, channel, status, balance used, points used, and coupon used."
            className="w-full rounded-xl border border-line"
          />
        </div>
        <figcaption className="text-[12px] text-muted">
          What the portal already held — merchant credit purchases on one side,
          diner transactions on the other. Accurate, complete, and no help in
          telling you which of 500+ partners needed attention today
        </figcaption>
      </figure>

      <p className="text-[16px] text-ink">
        My first instinct could have been to add a low-credit alert. But a
        balance alone says very little about merchant health. $100 remaining
        could last months at one restaurant and disappear tomorrow at another.
      </p>

      {/* Grey inside the white pass card, as the pipeline's cells are inside
          its container — a white card here would have no edge. */}
      <JeniRunway surface="rounded-xl bg-[#f8f8f8] p-6" />

      <div className="flex flex-col gap-3">
        <p className="text-[16px] text-ink">
          But running out wasn’t the only unhealthy state.
        </p>

        <p className="text-[16px] text-ink">
          As I looked across the network, the opposite problem emerged: some
          merchants had plenty of prepaid credit, but too little diner demand to
          move it.
        </p>
      </div>
    </>
  );
}

/**
 * The Diners finding. Same shape as Merchants: the observation, then the
 * model it called for.
 */
function DinersFinding() {
  return (
    <>
      <p className="text-[16px] text-ink">
        The profile showed what they did—not who they were.
      </p>
      <p className="text-[16px] text-ink">
        To make Bravo more relevant to each diner, I needed to turn fragmented
        activity into a picture of their preferences, habits, and value.
      </p>
    </>
  );
}

/**
 * The Diners evidence, in the same order Merchants uses: the records, then
 * the story, then the model. The records paragraphs are here; the figures
 * and the rest follow as they are written.
 *
 * TODO: the diner profile / activity views, and the paragraphs that walk
 * from rows of transactions to a picture of a person.
 */
function DinersEvidence() {
  return (
    <>
      <div className="flex flex-col gap-3">
        <p className="text-[16px] text-ink">
          Bravo already had plenty of customer data: balance, cashback, rewards,
          referrals, and a chronological history of every restaurant they
          visited.
        </p>

        <p className="text-[16px] text-ink">
          But each signal lived as an isolated fact. Understanding a diner still
          meant manually reading through rows of transactions and trying to
          infer the pattern yourself.
        </p>
      </div>

      {/* One diner's history, as the portal shows it. A single table at full
          width rather than Merchants' pair: the point here is one person's
          rows, read top to bottom, not the volume across partners. Same
          treatment as every other record figure — plain <img>, the study's
          hairline inset, 12px muted caption. Drop the screenshot at this path;
          it is not in the repo yet. */}
      <figure className="m-0 flex flex-col gap-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/work/jeni/diner-transactions.png"
          alt="One diner's transaction history in the portal: ten rows from April to May, each with an id, date and time, transaction number, the restaurant visited, a type badge (Spend or RedPocket), and the amount broken into points and cash."
          className="w-full rounded-xl border border-line"
        />
        <figcaption className="text-[12px] text-muted">
          What the portal already knew — individual transactions, balances, and
          rewards. Enough to reconstruct what someone had done, but not enough
          to understand them at a glance.
        </figcaption>
      </figure>

      {/* The turn — the same beat as Merchants' "my first instinct could have
          been a low-credit alert": the obvious fix named and set aside for
          the model that actually answers the question. */}
      <div className="flex flex-col gap-3">
        <p className="text-[16px] text-ink">
          I realized I didn’t need more customer data. I needed to change the
          unit of analysis.
        </p>

        <p className="text-[16px] text-ink">
          A single transaction says very little about a person. But repeated
          behavior starts to reveal patterns: where they return, what cuisines
          they choose, when they dine, how much they typically spend, and how
          they fund their account.
        </p>
      </div>

      {/* The model — the slot the runway figure fills for Merchants. */}
      <JeniDinerModel />

      {/* The same beat Merchants lands on after its model — "but running out
          wasn't the only unhealthy state": the model is not the end, the
          change it lets you see is. */}
      <div className="flex flex-col gap-3">
        <p className="text-[16px] text-ink">
          I started looking for changes in behavior, not just patterns.
        </p>

        <p className="text-[16px] text-ink">
          Patterns told me who a diner was. Changes in those patterns could
          tell me when something needed attention.
        </p>

        <p className="text-[16px] text-ink">
          A useful customer profile shouldn’t just describe the diner. It
          should help Bravo recognize when there is a reason to act.
        </p>
      </div>
    </>
  );
}

/**
 * The Bravo evidence, in the same order the others use: the problem the
 * first two passes exposed, then the reasoning, then the model. The opening
 * paragraphs are here; the model follows as it is written.
 *
 * TODO: the intervention economics — what each option costs, what it
 * returns, and how Jeni weighs them.
 */
function BravoEvidence() {
  return (
    <>
      <div className="flex flex-col gap-3">
        <p className="text-[16px] text-ink">
          Once I could see merchant health and diner behavior more clearly, a
          new problem appeared: knowing that something needed attention still
          didn’t tell Bravo what to do.
        </p>

        <p className="text-[16px] text-ink">
          The same intervention could create value in one situation and waste
          money in another. Buying more credit only made sense if diner demand
          justified it. A promotion only made sense if there was merchant
          capacity to absorb that demand—and a diner whose behavior could
          actually be changed.
        </p>
      </div>

      {/* The model — the slot the runway and the 10 → 4 → 1 strip fill for
          the other two passes. */}
      <JeniMoves />

      {/* The qualifier the figure needs: three clean cases, then the
          admission that the real ones are conditional. */}
      <div className="flex flex-col gap-3">
        <p className="text-[16px] text-ink">
          These were the simplest cases. The real decisions were more
          conditional.
        </p>

        <p className="text-[16px] text-ink">
          Creating demand, for example, wasn’t just about finding a merchant
          with unused credit. I also needed to understand which diners were a
          plausible fit, whether their behavior could realistically change, and
          whether changing it would create enough value to justify the
          incentive.
        </p>
      </div>

      {/* What the three cases add up to. The second paragraph ends on a
          colon on purpose — the three questions it announces are the next
          block, still to be written. */}
      <div className="flex flex-col gap-3">
        <p className="text-[16px] text-ink">
          This gave me a clearer definition of what Jeni needed to do.
        </p>

        <p className="text-[16px] text-ink">
          Instead of analyzing merchants, diners, and transactions separately,
          I began treating every opportunity as a relationship between three
          questions:
        </p>
      </div>

      {/* The three questions the colon above announces, as a product. */}
      <JeniIntervention />

      {/* Where the three passes land — the same beat the other two folds end
          on, and the line the Decision act picks up from. */}
      <p className="text-[16px] text-ink">
        Jeni was no longer a tool for surfacing signals. It was becoming a
        system for deciding where to act, how to act, and when not to act at
        all.
      </p>
    </>
  );
}

/**
 * The Bravo finding. Same shape as the other two: the observation, then what
 * it called for.
 */
function BravoFinding() {
  return (
    <>
      <p className="text-[16px] text-ink">
        Understanding each side wasn’t enough. I needed to understand when
        connecting them could improve the outcome.
      </p>
      <p className="text-[16px] text-ink">
        Bravo could spend money in many ways—buying more merchant credit,
        funding an incentive, or doing nothing. The harder question was
        deciding which intervention made economic sense.
      </p>
    </>
  );
}

/**
 * The three passes, in order. See JeniPasses for how they are grouped.
 *
 * Order matters: a pass's position here is the number it shows. A pass with
 * no `finding` yet renders its marker and question only — the set of three is
 * visible while the copy is written, and nothing invented stands in for it.
 */
const PASSES: Pass[] = [
  {
    id: 'merchants',
    label: 'Merchants',
    question: 'Where is demand moving—and where is credit stuck?',
    finding: <MerchantsFinding />,
    evidence: <MerchantsEvidence />,
  },
  {
    id: 'diners',
    label: 'Diners',
    question: 'Who are they, and what do they actually want?',
    finding: <DinersFinding />,
    evidence: <DinersEvidence />,
  },
  {
    id: 'bravo',
    label: 'Bravo',
    question: 'Where does intervention create real value?',
    finding: <BravoFinding />,
    evidence: <BravoEvidence />,
  },
];

function Challenge() {
  return (
    <div className="flex flex-col gap-6">
      <Heading
        eyebrow="Understanding the business"
        title="Bravo could see the pieces. I needed to understand how they connected."
      />

      <p className="text-[16px] text-ink">
        I already knew many of Bravo’s operational pain points: merchant credit
        could run out without warning, prepaid credit could sit unused,
        high-value or lapsing diners were difficult to identify, and marketing
        had little ability to personalize what people saw.
      </p>

      <p className="text-[16px] text-ink">
        But those were individual symptoms. Before deciding what Jeni should
        become, I needed to understand how value actually moved through the
        business—between diner behavior, merchant demand, and Bravo’s own
        economics.
      </p>

      <JeniValueModel />

      {/* One set: the statement and the two paragraphs that explain it. Their
          own gap-3 rather than the act's gap-6, so they read as a unit rather
          than as three separate beats — the same tightening BravoProblem uses
          for its question and the line under it. */}
      <div className="flex flex-col gap-3">
        <p className="text-[16px] font-semibold text-ink">
          Each answer exposed the next question.
        </p>

        <p className="text-[16px] text-ink">
          I started connecting Bravo’s transaction data and building small ways
          to interrogate it. What began as basic visibility quickly exposed
          deeper questions about demand, credit, customer behavior, and
          ultimately the economics behind each relationship.
        </p>

        <p className="text-[16px] text-ink">
          Instead of defining Jeni upfront, I let each working view sharpen the
          next question.
        </p>
      </div>

      <JeniPasses passes={PASSES} />

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
      <Heading
        eyebrow="Defining the system"
        title="Turning the decision model into something Jeni could actually reason over."
      />

      <div className="flex flex-col gap-3">
        <p className="text-[16px] text-ink">
          The framework gave me the questions, but not yet the system. To
          answer them consistently, Jeni needed to connect signals that had
          previously lived apart—from merchant credit and transaction velocity
          to diner behavior and Bravo’s own economics.
        </p>

        <p className="text-[16px] text-ink">
          I started by defining what the system needed to understand about each
          side of the marketplace—not as raw fields, but as signals that could
          change a decision.
        </p>
      </div>

      {/* The marker is bound to its figure at gap-3 rather than sitting loose
          at the act's gap-6, so it reads as that figure's label and not as a
          heading for everything that follows it. Same 12px uppercase
          treatment the passes' markers and the pipeline's steps take. */}
      <div className="flex flex-col gap-3">
        <p className="text-[12px] uppercase tracking-[0.08em] text-muted">
          01 / What the system needed to know
        </p>

        {/* The signals behind the product the Challenge act's last figure
            stated — the same three factors, opened up. */}
        <JeniSignals />
      </div>

      {/* Second step of the series. Wrapped in its own gap-3 group like 01,
          so whatever goes under it binds to the marker rather than floating
          at the act's spacing — the marker stands alone until then. */}
      <div className="flex flex-col gap-3">
        <p className="text-[12px] uppercase tracking-[0.08em] text-muted">
          02 / Deciding how the system should reason
        </p>

        {/* Semibold, as the passes set the line that follows their marker:
            this is the step's claim, and the three paragraphs under it are
            the argument for it. */}
        <p className="text-[16px] font-semibold text-ink">
          Not every question needed AI.
        </p>

        <p className="text-[16px] text-ink">
          Once I defined the signals Jeni needed, I had to decide how the
          system should reason with them.
        </p>

        <p className="text-[16px] text-ink">
          My first principle was simple: if something could be calculated
          reliably, it shouldn’t be guessed by AI. Credit balance, transaction
          velocity, visit recency, and spend behavior could all be derived
          deterministically from Bravo’s data.
        </p>

        <p className="text-[16px] text-ink">
          Rules and heuristics could then turn those facts into explicit
          states—such as credit running low, demand slowing, or a diner
          becoming inactive. AI was more useful one layer higher: interpreting
          multiple signals together, explaining why an opportunity mattered,
          and helping the team understand what to consider next.
        </p>

        {/* The three layers the paragraph above names, one merchant read
            across all of them. */}
        <JeniReasoning />
      </div>

      {/* Third step of the series, set like 02: marker, then the step's claim
          in semibold. */}
      <div className="flex flex-col gap-3">
        <p className="text-[12px] uppercase tracking-[0.08em] text-muted">
          03 / Making the reasoning actionable
        </p>

        <p className="text-[16px] font-semibold text-ink">
          From analysis to a decision workflow.
        </p>

        <p className="text-[16px] text-ink">
          Defining the reasoning model still wasn’t enough. Jeni could
          understand that a merchant was running low on credit or that a
          high-value diner was drifting away—but the team shouldn’t have to
          reconstruct that reasoning themselves.
        </p>

        <p className="text-[16px] text-ink">
          I needed to translate the system’s internal logic into a workflow
          that moved from what is happening, to why it matters, to what Bravo
          could do next.
        </p>

        {/* That workflow, with the steps between those three beats made
            explicit. */}
        <JeniWorkflow />

        <p className="text-[16px] text-ink">
          This became Jeni’s decision workflow: progressively turning raw
          signals into context, priorities, and actions.
        </p>
      </div>

      {/* Fourth step, set like 02 and 03: marker, then the step's claim. */}
      <div className="flex flex-col gap-3">
        <p className="text-[12px] uppercase tracking-[0.08em] text-muted">
          04 / From model to product
        </p>

        <p className="text-[16px] font-semibold text-ink">
          I designed Jeni around decisions, not dashboards.
        </p>
      </div>

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
  {
    id: 'challenge',
    label: 'Understanding the business',
    content: <Challenge />,
  },
  // The id stays 'decision' so the section anchor (#the-decision) and any
  // link to it survive the rename — only the label a reader sees changes.
  { id: 'decision', label: 'Defining the system', content: <Decision /> },
  { id: 'outcome', label: 'Outcome', content: <Outcome /> },
];

/**
 * Where the walkthrough video goes. A slot, not a video: the study's card
 * surface at the height the video will take, with a play glyph so it reads
 * as a video that isn't here yet rather than a figure that failed to load.
 * Replace the whole element with the player when the cut exists.
 */
function VideoPlaceholder() {
  return (
    <div
      role="img"
      aria-label="Walkthrough video — coming soon"
      className="flex h-[500px] w-full flex-col items-center justify-center gap-3 rounded-xl bg-white"
    >
      <span className="flex size-12 items-center justify-center rounded-full bg-[#f8f8f8]">
        <Play
          className="ml-0.5 size-5 text-neutral-500"
          strokeWidth={1.75}
          aria-hidden="true"
        />
      </span>
      <span className="text-[12px] uppercase tracking-[0.08em] text-muted">
        Video
      </span>
    </div>
  );
}

export function JeniActs() {
  // 226 = the measured width of "Understanding the business" at the pill's
  // 14px/500 (186px) plus PILL's 40px of horizontal padding. Bravo's default
  // 148 would clip it. Measured in the browser, not estimated.
  return (
    <ActsShell acts={ACTS} pillWidth={226} lead={<VideoPlaceholder />} />
  );
}
