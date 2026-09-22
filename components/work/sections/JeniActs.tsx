import { Play } from 'lucide-react';
import { ActsShell, type Act } from './ActsShell';
import { JeniDinerModel } from './JeniDinerModel';
import { ZoomableImage } from '@/components/work/ZoomableImage';
import { JeniFactors } from './JeniFactors';
import { JeniFigureCarousel } from './JeniFigureCarousel';
import { JeniFigureTabs } from './JeniFigureTabs';
import { JeniIntervention } from './JeniIntervention';
import { JeniMoves } from './JeniMoves';
import { JeniPasses, type Pass } from './JeniPasses';
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

/**
 * A step inside an act — the home page's "selected work" marker (a 3×16
 * accent bar beside 16px semibold) over a one-line subtitle, at the same
 * 4px gap the act heading uses between eyebrow and title. Steps are the
 * chapters of an act, so they borrow the act heading's rhythm at a smaller
 * size rather than inventing a third.
 */
function StepHeading({ marker, title }: { marker: string; title: string }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="flex items-center gap-3 text-[16px] font-semibold text-ink">
        <span
          aria-hidden="true"
          className="h-4 w-[3px] shrink-0 rounded-full bg-[#4f83f7]"
        />
        {marker}
      </p>
      <h3 className="text-[16px] text-ink">{title}</h3>
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
          yet. Same treatment as the Bravo booth photos: plain <ZoomableImage> with the
          study's hairline inset, and a caption at the shared 12px muted. */}
      <figure className="m-0 flex flex-col gap-2">
        <ZoomableImage
          src="/work/jeni/monitoring-overview.png"
          alt="Jeni's monitoring overview: a Needs Attention summary bar over three columns of detected restaurants — New / Opening, Closed / At Risk, and For Sale — with counts for tracked restaurants and signals, and a list of source collectors below."
          className="w-full rounded-xl border border-line"
        />
        <figcaption className="text-[12px] text-muted">
          Jeni V1 — Bringing restaurant openings, closures, and other public
          signals into one monitoring view.
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
        Monitoring would remain one capability within Jeni, but the larger
        product was undefined. There was no predefined problem, workflow, or
        solution. I had to determine{' '}
        <span className="font-semibold">
          where Jeni could actually create value inside the business.
        </span>
      </p>

      {/* One of the collectors, end to end. Drop the screenshot at this path —
          it is not in the repo yet. Same treatment as the monitoring overview
          above: plain <ZoomableImage>, the study's hairline inset, 12px muted caption. */}
      <figure className="m-0 flex flex-col gap-2">
        <ZoomableImage
          src="/work/jeni/vch-report.png"
          alt="Jeni's VCH report: counts for active closures, reopened, and unresolved, above a table of health closures listing each restaurant, city, closure period, reason, and when it was last checked — with a separate collapsed group for unresolved listings."
          className="w-full rounded-xl border border-line"
        />
        <figcaption className="text-[12px] text-muted">
          One collector in detail — health closure orders, with unresolved
          merchant matches preserved for review rather than guessed.
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
          <ZoomableImage
            src="/work/jeni/merchant-credit-table.png"
            alt="A merchant credit table: rows of previous credit, funding amount, credit acquired, resulting Bravo credit balance, previous and new rate, and funding method."
            className="w-full rounded-xl border border-line"
          />
          <ZoomableImage
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
          treatment as every other record figure — plain <ZoomableImage>, the study's
          hairline inset, 12px muted caption. Drop the screenshot at this path;
          it is not in the repo yet. */}
      <figure className="m-0 flex flex-col gap-2">
        <ZoomableImage
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
      <JeniIntervention surface="rounded-xl bg-[#f8f8f8] p-6" />

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

/** The three screenshots in the Merchant / Diner tabs — see the note there. */
const TAB_IMG =
  'w-full rounded-xl border border-line object-cover object-top md:h-[470px]';

function Challenge() {
  return (
    <div className="flex flex-col gap-6">
      <Heading
        eyebrow="Finding the product"
        title="The next brief was one sentence: make Jeni useful to Bravo."
      />

      <p className="text-[16px] text-ink">
        After seeing V1, Bravo’s CEO asked me to take Jeni further into the
        business. There was no feature list, target workflow, or predefined
        problem to solve.
      </p>

      <p className="text-[16px] text-ink">
        I started with the systems Bravo already used. The existing merchant portal tracked credit balances and transaction history, while customer records captured balances, rewards, referrals, and dining activity. The data was there. What was missing was a way to interpret it across the marketplace.
      </p>

      {/* The two sides, as tabs: each is a finding and the records behind it.
          The Merchant finding lives inside its tab rather than above the
          switcher, so it isn't sitting over the Diner records when that tab
          is open. Diner has no finding yet — just the records.

          All three screenshots take one height from `md`, so the pair line
          up and the panel doesn't jump when the tab changes. 470px is the
          taller of the merchant pair at its column width, so neither of
          those is cropped; the diner table, which runs ~750px tall at full
          width, is cropped to match — anchored to the top so the header and
          the first rows survive, which is how a table should be cut. Below
          `md` the images keep their natural height: the pair stacks there,
          so there is nothing to line up, and a fixed height would crop the
          diner table sideways. */}
      <JeniFigureTabs
        label="The two sides of the marketplace"
        tabs={[
          {
            id: 'merchant',
            label: 'Merchant',
            content: (
              <>
                <p className="text-[16px] text-ink">
                  The ledger showed credit remaining, but not when a merchant
                  was becoming a problem.
                </p>
                {/* A figure, so the caption is the study's figcaption — 12px
                    muted, gap-2 under the image — rather than a loose line. */}
                <figure className="m-0 flex flex-col gap-2">
                  {/* Side by side: the point is the volume across two
                      ledgers, not any single row. */}
                  <div className="grid gap-3 sm:grid-cols-2">
                    <ZoomableImage
                      src="/work/jeni/merchant-credit-table.png"
                      alt="A merchant credit table: rows of previous credit, funding amount, credit acquired, resulting Bravo credit balance, previous and new rate, and funding method."
                      className={TAB_IMG}
                    />
                    <ZoomableImage
                      src="/work/jeni/transactions-table.png"
                      alt="A transaction table: rows of QR code payments showing amount, channel, status, balance used, points used, and coupon used."
                      className={TAB_IMG}
                    />
                  </div>
                  <figcaption className="text-[12px] text-muted">
                    Bravo&rsquo;s existing merchant portal exposed balances and
                    transactions, but recognizing urgency still required
                    someone to interpret them manually.
                  </figcaption>
                </figure>
              </>
            ),
          },
          {
            id: 'diner',
            label: 'Diner',
            content: (
              <>
                <p className="text-[16px] text-ink">
                  Customer profiles showed activity, but not who the diner was becoming.
                </p>
                {/* A figure, so the caption is the study's figcaption, as in
                    the Merchant tab. */}
                <figure className="m-0 flex flex-col gap-2">
                  {/* Side by side, as the Merchant tab's pair: the
                      transaction history and the points ledger are two views
                      of the same diner. Drop the second screenshot at this
                      path — it is not in the repo yet. */}
                  <div className="grid gap-3 sm:grid-cols-2">
                    <ZoomableImage
                      src="/work/jeni/diner-transactions.png"
                      alt="One diner's transaction history in the portal: ten rows from April to May, each with an id, date and time, transaction number, the restaurant visited, a type badge (Spend or RedPocket), and the amount broken into points and cash."
                      className={TAB_IMG}
                    />
                    <ZoomableImage
                      src="/work/jeni/diner-points-ledger.png"
                      alt="A diner's points ledger: rows of points before, the change (earned in green, redeemed in red), points after, a type code, the restaurant, and the date."
                      className={TAB_IMG}
                    />
                  </div>
                  <figcaption className="text-[12px] text-muted">
                    Bravo&rsquo;s existing customer portal captured balances,
                    rewards, referrals, and transaction history, but
                    understanding a diner still meant reconstructing patterns
                    across individual records.
                  </figcaption>
                </figure>
              </>
            ),
          },
        ]}
      />

      <p className="text-[16px] text-ink">
        Understanding both sides still didn&rsquo;t tell Bravo what to do.
      </p>

      <p className="text-[16px] text-ink">
        A merchant could need help and a diner could be a strong match, but
        that still didn&rsquo;t mean Bravo should intervene. The decision
        also depended on whether the expected value justified the cost.
      </p>

      <JeniFactors />

      <p className="text-[16px] font-semibold text-ink">
        This became the product thesis for Jeni.
      </p>

      <p className="text-[16px] text-ink">
        Jeni would connect merchant need, diner opportunity, and Bravo&rsquo;s
        economics to identify where intervention was actually worth
        considering.
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
      <Heading
        eyebrow="Building Jeni"
        title="Turning the product thesis into a decision workflow."
      />

      <figure className="m-0 flex flex-col gap-2">
        <ZoomableImage
          src="/work/jeni/dashboard.png"
          alt="Jeni's dashboard: Today's Executive Brief with merchant counts — 514 of 574 need attention, split into high opportunity, needs credit, at risk, and credit outstanding — and user counts flagged for a win-back play, above a Metro Vancouver heatmap of merchant locations and user activity."
          className="w-full rounded-xl border border-line"
        />
      </figure>

      <div className="flex flex-col gap-3">
        <p className="text-[16px] text-ink">
          The thesis gave Jeni three things to reason about. The product still
          had to make that reasoning useful to the people running Bravo.
        </p>

        <p className="text-[16px] text-ink">
          I designed Jeni around a simple progression: surface what needs
          attention, explain why it matters, connect the relevant merchant and
          diner signals, and make the next decision easier to evaluate.
        </p>
      </div>

      <StepHeading
        marker="01 / See What Needs Attention"
        title="Start with the exceptions, not the database."
      />

      <div className="flex flex-col gap-3">
        <p className="text-[16px] text-ink">
          Bravo already had the data. The problem was knowing where to look
          first.
        </p>

        <p className="text-[16px] text-ink">
          I designed Jeni to surface the merchants, diners, and opportunities
          showing meaningful change, then prioritize them by urgency and
          potential business value.
        </p>
      </div>

      <figure className="m-0 flex flex-col gap-2">
        <div className="grid gap-3">
          <ZoomableImage
            src="/work/jeni/dashboard-opportunities.png"
            alt="Jeni's Campaign opportunities panel — the best set that can run at once: if all eight run, $134,159 of spend across 8 campaigns for +$8k net margin; the top three ranked by net margin — spend threshold at +$5k, visit frequency at +$1k, happy hour at +$781 — with five more in the runnable set."
            className="w-full rounded-xl border border-line"
          />
          <ZoomableImage
            src="/work/jeni/dashboard-health.png"
            alt="Three health panels from Jeni's dashboard. Merchant health: 426 need attention, 387 with upside, 198 sitting on credit. Customer health: 3,894 need attention, 447 new customers, 81 merchants worth promoting. Business impact: 0 visits Bravo can evidence, $7,951,323 of credit used, $1,136,103 Bravo margin realised as credit burns."
            className="w-full rounded-xl border border-line"
          />
        </div>
        <figcaption className="text-[12px] text-muted">
          Instead of another dashboard to explore, Jeni opened with what Bravo
          could act on.
        </figcaption>
      </figure>

      <StepHeading
        marker="02 / Understand Why"
        title="Show the evidence behind the signal."
      />

      <div className="flex flex-col gap-3">
        <p className="text-[16px] text-ink">
          A flag only mattered if the team could understand what was driving
          it.
        </p>

        <p className="text-[16px] text-ink">
          I designed Jeni to connect each state back to the underlying
          behavior, such as credit burn, transaction activity, visit patterns,
          and recent change, so the team could judge whether an opportunity was
          real before acting.
        </p>
      </div>

      <figure className="m-0 flex flex-col gap-2">
        <ZoomableImage
          src="/work/jeni/merchant-intelligence.png"
          alt="Jeni's Merchant Intelligence page: the credit book — used, outstanding, Bravo margin, average cashback — above a Transaction flow panel with a 30-day window, credit used and average bill versus the previous period, and a stacked bar chart of credit used per day by cuisine."
          className="w-full rounded-xl border border-line"
        />
        <figcaption className="text-[12px] text-muted">
          Jeni first established the network baseline: how credit was being
          used, where transaction volume was moving, and what normal looked
          like across the marketplace.
        </figcaption>
      </figure>

      <p className="text-[16px] text-ink">
        From there, the team could drill into a flagged merchant and see what
        was actually driving the signal.
      </p>

      <figure className="m-0 flex flex-col gap-2">
        <ZoomableImage
          src="/work/jeni/merchant-credit.png"
          alt="One merchant's Credit panel in Jeni: 14 days of runway emptying 5 October, burn speed $152 a day marked above the healthy band, $2,274 outstanding, a $2,952 batch from $4,000 cash; a breakdown of where the batch went via balance and bonus; and a 60-day balance line that saw-tooths through two $4k top-ups, with a dashed projection running to empty and a footer naming the assumption at 75% confidence."
          className="w-full rounded-xl border border-line"
        />
        <figcaption className="text-[12px] text-muted">
          For Happy Day Cafe Kingsway, a static credit balance became a
          time-sensitive signal once Jeni showed burn velocity, replenishment
          history, and runway.
        </figcaption>
      </figure>

      <div className="flex flex-col gap-3">
        <p className="text-[16px] text-ink">
          But urgency alone wasn&rsquo;t enough. Jeni also needed to understand
          the business behind the number.
        </p>

        <p className="text-[16px] text-ink">
          Credit showed when attention was needed. Operational behavior helped
          explain what kind of opportunity it was.
        </p>
      </div>

      <figure className="m-0 flex flex-col gap-2">
        <ZoomableImage
          src="/work/jeni/merchant-operations.png"
          alt="One merchant's Operations panel in Jeni: customer mix — only 36% of visits come back, tagged Mostly new — beside service mix split across morning, lunch, and dinner, with morning flagged n=1; a row of 491 visits over 60 days, $21.50 average spend, 200 lifetime visits, and a 4.79 rating; and a Traffic bar chart of visits by day with the busiest day, Saturday 29 August, highlighted."
          className="w-full rounded-xl border border-line"
        />
        <figcaption className="text-[12px] text-muted">
          Visit frequency, customer mix, daypart behavior, and spend patterns
          gave the financial signal operational context.
        </figcaption>
      </figure>

      <StepHeading
        marker="03 / Find Who Can Move It"
        title="Connect merchant need with diner opportunity."
      />

      <div className="flex flex-col gap-3">
        <p className="text-[16px] text-ink">
          Understanding the merchant explained the problem, but not who could
          change the outcome.
        </p>

        <p className="text-[16px] text-ink">
          I designed the diner side of Jeni around behavioral signals&mdash;
          inactivity, top-up likelihood, value, visit history, and merchant
          affinity&mdash;so the system could identify not just an audience, but
          the diners most relevant to a specific merchant need.
        </p>
      </div>

      <figure className="m-0 flex flex-col gap-2">
        <ZoomableImage
          src="/work/jeni/user-intelligence.png"
          alt="Jeni's User Intelligence page: 9,041 of 43,320 users flagged at score 40 or above, split into 6,949 at risk, 549 top-up ready, and 884 high value; a Top-ups panel for the last 30 days — $288,355 topped up, $21,933 bonus granted, $0.08 cost per dollar loaded, $50 busiest rung — and a bar chart of balance loaded versus bonus granted by day."
          className="w-full rounded-xl border border-line"
        />
        <figcaption className="text-[12px] text-muted">
          Instead of treating diners as a list of accounts, Jeni organized them
          by behavioral state: who was drifting away, likely to top up, or
          worth retaining.
        </figcaption>
      </figure>

      <div className="flex flex-col gap-3">
        <p className="text-[16px] font-semibold text-ink">
          But behavioral state alone didn&rsquo;t make a diner relevant.
        </p>

        <p className="text-[16px] text-ink">
          Jeni also needed evidence that the diner and merchant actually
          belonged together.
        </p>
      </div>

      <figure className="m-0 flex flex-col gap-2">
        <ZoomableImage
          src="/work/jeni/diners-who-also-visit.png"
          alt="Jeni's Diners who also visit panel for Happy Day Cafe Richmond: three merchants ranked by lift — Wasan Cafe at 2.5×, Grill King at 2.4×, AJEA Noodle at 1.0× — with shared diners and the overlap the other way, a note that the list is ranked by lift rather than raw overlap, and a prompt to plan a cross-merchant campaign."
          className="w-full rounded-xl border border-line"
        />
        <figcaption className="text-[12px] text-muted">
          Cross-merchant behavior exposed relationships that raw audience
          overlap would miss. I used lift rather than shared-diner count so
          large merchants wouldn&rsquo;t automatically dominate the
          recommendation.
        </figcaption>
      </figure>

      <div className="flex flex-col gap-3">
        <p className="text-[16px] font-semibold text-ink">
          Relevance could then become a specific play.
        </p>

        <p className="text-[16px] text-ink">
          Once diner behavior and merchant context were connected, Jeni could
          move from &ldquo;who looks interesting?&rdquo; to &ldquo;who could
          change this outcome, and how?&rdquo;
        </p>
      </div>

      <figure className="m-0 flex flex-col gap-2">
        <ZoomableImage
          src="/work/jeni/ranked-users.png"
          alt="Eight rows of Jeni's Ranked users table: each diner with their average spend or inactivity, a High value or Inactive signal, a suggested action of VIP perk or win-back bonus, net to Bravo from +$874 down to +$684, and network value with diners referred. A hover tooltip on one action reads: Card boost — spend $210 at Bar Bravo, $15 in balance."
          className="w-full rounded-xl border border-line"
        />
        <figcaption className="text-[12px] text-muted">
          Each diner carried the signal, suggested action, and expected value
          forward, preserving the reasoning behind the recommendation.
        </figcaption>
      </figure>

      <StepHeading
        marker="04 / Make the Economics Visible"
        title="A useful intervention still had to be worth running."
      />

      <div className="flex flex-col gap-3">
        <p className="text-[16px] text-ink">
          Connecting the right diner to the right merchant still wasn&rsquo;t
          enough. Every intervention had a cost to Bravo, and more activity did
          not necessarily mean more value.
        </p>

        <p className="text-[16px] text-ink">
          I made the economics part of the recommendation itself, so the team
          could evaluate an opportunity against credit cost, expected margin,
          and network value before deciding to act.
        </p>
      </div>

      <p className="text-[16px] font-semibold text-ink">
        The same action could look very different once Bravo&rsquo;s economics
        entered the decision.
      </p>

      <figure className="m-0 flex flex-col gap-2">
        <ZoomableImage
          src="/work/jeni/net-to-bravo.png"
          alt="A crop of Jeni's ranked users table: seven rows with their signal — churn risk, referral potential, inactive, high value — a suggested action of re-engagement offer, referral invite, win-back bonus, or VIP perk, net to Bravo sorted from +$667 down to +$620, and network value with diners referred — including one referral invite at +$655 net whose network value is −$21."
          className="w-full rounded-xl border border-line"
        />
        <figcaption className="text-[12px] text-muted">
          I surfaced expected value beside the recommended action, making the
          tradeoff visible before the team committed budget.
        </figcaption>
      </figure>

      <p className="text-[16px] text-ink">
        I didn&rsquo;t reduce value to a single number. Direct value to Bravo
        and broader network value could point in different directions, so I
        kept them visible separately rather than hiding the tradeoff inside
        one score.
      </p>

      <div className="flex flex-col gap-3">
        <p className="text-[16px] font-semibold text-ink">
          Economics also changed prioritization.
        </p>

        <p className="text-[16px] text-ink">
          Once Jeni could estimate the value of individual plays, the same
          logic could compare opportunities across the business.
        </p>
      </div>

      <figure className="m-0 flex flex-col gap-2">
        <ZoomableImage
          src="/work/jeni/campaign-intelligence.png"
          alt="Jeni's Campaign Intelligence page: 8 of 14 campaign levers can run at once, with +$8k net if all run; below, seven diner cohorts ranked by movable credit — Lapsing regulars at $458k, Big-basket diners at $198k, Lapsed regulars at $183k, Card-first diners at $134k — each with its definition, size, a one-line rationale, and a suggested play."
          className="w-full rounded-xl border border-line"
        />
        <figcaption className="text-[12px] text-muted">
          Opportunities were ranked by estimated net margin rather than
          activity alone, showing both the spend required and the expected
          return.
        </figcaption>
      </figure>

      <p className="text-[16px] text-ink">
        I deliberately showed expected upside together with the spend required
        to create it. The goal wasn&rsquo;t to make Jeni sound confident; it
        was to give Bravo enough context to judge whether the recommendation
        was worth taking.
      </p>

      <div className="flex flex-col gap-3">
        <p className="text-[16px] font-semibold text-ink">
          The decision model was now complete.
        </p>

        <p className="text-[16px] font-semibold text-ink">
          Merchant Need &times; Diner Opportunity &times; Bravo Economics
          &rarr; Intervention
        </p>
      </div>

      <p className="text-[16px] text-ink">
        Jeni could now identify where Bravo had a reason to act, who could
        change the outcome, and whether acting made economic sense.
      </p>

      <StepHeading
        marker="05 / Turn the Decision Into Action"
        title="A recommendation only mattered if the team could do something with it."
      />

      <div className="flex flex-col gap-3">
        <p className="text-[16px] text-ink">
          By this point, Jeni could identify an opportunity, explain the
          evidence behind it, connect the relevant diners, and make the
          economics visible.
        </p>

        <p className="text-[16px] text-ink">
          The final step was turning that reasoning into a specific next move
          the team could evaluate and act on.
        </p>
      </div>

      <JeniFigureCarousel
        label="Recommended action cards"
        aspectRatio={2184 / 652}
        autoplay={2500}
        caption="Each recommendation shows why action matters now, what to do next, and what could change if it works."
        slides={[
          {
            src: '/work/jeni/recommended-action.png',
            alt: "A Recommended Action card in Jeni: 'Promote to nearby cafe fans to accelerate burn' with 66% confidence, split into Why now ($2,959 sitting unused, burning $0 a day), The move (promote to nearby fans, run a win-back push), and If it lands (+34 visits in 30 days), with Create campaign and Show the working buttons.",
          },
          {
            src: '/work/jeni/recommended-action-credit.png',
            alt: "A Recommended Action card in Jeni: 'Sales follow-up — credit is nearly gone; buy the next tranche now' with 66% confidence, split into Why now (3 days of runway left, burning $203 a day against $545 outstanding), The move (buy more credit, offer a return-visit coupon), and If it lands ($545 left, 77 visits a month), with Open the credit book and Show the working buttons.",
          },
          {
            src: '/work/jeni/recommended-action-steady.png',
            alt: "A Recommended Action card in Jeni tagged Steady: 'Maintain — healthy balance of repeat and new customers' with 66% confidence, split into Why now (60% come back, credit and traffic inside their normal bands, nothing time-bound), The move (promote to nearby fans, run a win-back push), and If it lands (+13 visits in 30 days), with Create campaign and Show the working buttons.",
          },
        ]}
      />

      <div className="flex flex-col gap-3">
        <p className="text-[16px] text-ink">
          I structured each recommendation around three questions: why does
          this matter now, what should Bravo consider doing, and what could
          change if it works.
        </p>

        <p className="text-[16px] text-ink">
          The recommendation stayed close to the evidence, with the underlying
          reasoning available for the team to inspect before acting.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-[16px] font-semibold text-ink">
          SEE &rarr; UNDERSTAND &rarr; CONNECT &rarr; EVALUATE &rarr; ACT
        </p>

        <p className="text-[16px] text-ink">
          This became Jeni&rsquo;s core interaction model: move from fragmented
          signals to an inspectable decision, then make the next action easier
          to take.
        </p>
      </div>

      <p className="text-[16px] text-ink">
        Jeni had started by turning messy public information into structured
        merchant signals. It had evolved into a system for turning
        Bravo&rsquo;s own marketplace signals into decisions the team could
        inspect and act on.
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

      <div className="flex flex-col gap-3">
        <p className="text-[16px] text-ink">
          Jeni started as an open-ended experiment around restaurant
          intelligence. It has since become a live internal product for
          understanding Bravo&rsquo;s marketplace and identifying where the
          team can act.
        </p>

        <p className="text-[16px] text-ink">
          The product is now part of the CTO&rsquo;s roadmap and has been
          included in the CEO&rsquo;s investor pitch deck as part of
          Bravo&rsquo;s evolving intelligence capabilities.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-[16px] font-semibold text-ink">
          The project also changed my role.
        </p>

        <p className="text-[16px] text-ink">
          I entered Jeni as a product designer with a loosely defined AI
          opportunity. I ended up defining the product strategy, designing the
          decision model, and building the working system myself.
        </p>

        <p className="text-[16px] text-ink">
          More importantly, it changed how I think about product design: when
          the path is unclear, designing the interface is only one part of the
          job. Sometimes the larger responsibility is defining what should
          exist in the first place.
        </p>
      </div>

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
  // The id stays 'challenge' for the same reason — the anchor (#the-challenge)
  // survives the rename.
  { id: 'challenge', label: 'Finding the product', content: <Challenge /> },
  // The id stays 'decision' so the section anchor (#the-decision) and any
  // link to it survive the rename — only the label a reader sees changes.
  { id: 'decision', label: 'Building Jeni', content: <Decision /> },
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
  // 172 = the measured width of the longest label, "Finding the product"
  // (132px at the pill's 14px/500), plus PILL's
  // 40px of horizontal padding. Bravo's default 148 would clip them. Measured
  // in the browser, not estimated — re-measure if a label changes.
  return (
    <ActsShell acts={ACTS} pillWidth={172} lead={<VideoPlaceholder />} />
  );
}
