import { Play } from 'lucide-react';
import { ActsShell, type Act } from './ActsShell';
import { CARD } from './cardKit';
import { JeniDinerModel } from './JeniDinerModel';
import { ZoomableImage } from '@/components/work/ZoomableImage';
import { JeniFactors } from './JeniFactors';
import { JeniFigureCarousel } from './JeniFigureCarousel';
import { JeniFigureTabs } from './JeniFigureTabs';
import { JeniIntervention } from './JeniIntervention';
import { JeniLoop } from './JeniLoop';
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
        <ZoomableImage
          src="/work/jeni/dashboard-opportunities.png"
          alt="Further down Jeni's dashboard: Campaign opportunities ranked by net margin — spend threshold, visit frequency, happy hour — with estimated margin for each; three health panels for merchants, customers, and business impact; and an Insights list of what Jeni noticed this window."
          className="w-full rounded-xl border border-line"
        />
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
          alt="One merchant's Credit panel in Jeni: runway, burn speed at $206 a day, outstanding balance, and batch size; a breakdown of where the batch went via balance and bonus; and a 60-day balance line that saw-tooths — three top-ups of $4k, each burned down to zero across the 5-day threshold band."
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
          alt="One merchant's Operations panel in Jeni: customer mix — 80.3% of visits are repeat diners — beside service mix split across morning, lunch, and dinner; a row of 60-day visits, average spend, lifetime visits, and rating; and a Traffic bar chart of visits by day with the busiest day highlighted."
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
          alt="Jeni's User Intelligence page: 9,292 of 43,282 users flagged, split into at risk, top-up ready, and high value; a Top-ups panel with amount topped up, bonus granted, cost per dollar loaded, and busiest rung; a 30-day bar chart of balance loaded versus bonus granted; and a table of top-up rungs."
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
          alt="Jeni's Ranked users table: 9,311 flagged diners filtered by at risk, top-up, high value, and growth, with a banner that 9,311 diner-specific plays are ready. Each row shows the diner, their signal, a suggested action such as VIP perk, top-up bonus, or win-back bonus with a score and confidence, the net to Bravo, and network value."
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
          alt="A crop of Jeni's ranked users table: six rows with their signal, suggested action and confidence, net to Bravo sorted from +$7.4k down to +$1.6k, and network value — including one VIP perk at +$7.4k net whose network value is −$812."
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

      <p className="text-[16px] font-semibold text-ink">
        The economics came from the operating model itself.
      </p>

      <figure className="m-0 flex flex-col gap-2">
        <ZoomableImage
          src="/work/jeni/credit-book.png"
          alt="Jeni's Credit book and Transaction flow panels: $8.47m of credit bought from merchants — $7.98m used, $491k outstanding, $1.14m Bravo margin, 0.8% average cashback — above a 30-day view of credit used, average bill, biggest bill, and bonus inside it, with a stacked bar chart of credit used per day by cuisine."
          className="w-full rounded-xl border border-line"
        />
        <figcaption className="text-[12px] text-muted">
          Credit usage, Bravo margin, cashback, and transaction behavior
          provided the economic context behind each recommendation.
        </figcaption>
      </figure>

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
          The final design problem was turning that reasoning into something
          the team could actually act on.
        </p>
      </div>

      <JeniFigureCarousel
        label="Recommended action cards"
        aspectRatio={2184 / 652}
        caption="Jeni compressed the underlying evidence into a specific next move without hiding the reasoning behind it."
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

      <p className="text-[16px] text-ink">
        I designed each recommendation around three questions: why does this
        matter now, what should Bravo consider doing, and what could change if
        it works. The action stayed close to the evidence, with the underlying
        reasoning available when the team needed to inspect it.
      </p>

      <figure className="m-0 flex flex-col gap-2">
        <ZoomableImage
          src="/work/jeni/ranked-users-network.png"
          alt="Jeni's Ranked users panel sorted by network value: 9,017 diner-specific plays ready with a Create campaign button; rows for Eric, littleandy, Annpanda33, nessa, and winnie1127, each with a signal, a suggested action such as VIP perk or win-back bonus, net to Bravo, and a negative network value with the number of diners referred."
          className="w-full rounded-xl border border-line"
        />
        <figcaption className="text-[12px] text-muted">
          A ranked opportunity could move directly into an intervention
          instead of ending as another insight to interpret.
        </figcaption>
      </figure>

      <p className="text-[16px] text-ink">
        The same pattern extended to growth opportunities. Signals such as
        inactivity, top-up behavior, or customer value could become a suggested
        intervention, then move directly into campaign creation.
      </p>

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

/**
 * Three lines quoted from the agent's contract file. Set as a card rather
 * than a figure: it is text, and the point is that it was short enough to
 * be read at the start of every session.
 */
function ContractCallout() {
  const lines = [
    'Read this before any UI work. Every session. It is short on purpose.',
    'Components read L2 semantic variables only. Never an L1 primitive, never a raw hex.',
    'Confidence gates level in code, not by convention.',
  ];
  return (
    <figure className="m-0 flex flex-col gap-2">
      <div className={`${CARD} flex flex-col`}>
        <span className="pb-3 text-[12px] uppercase tracking-[0.08em] text-muted">
          CLAUDE.md
        </span>
        {lines.map((line) => (
          <p
            key={line}
            className="border-t border-line py-3 text-[14px] font-medium text-ink last:pb-0"
          >
            &ldquo;{line}&rdquo;
          </p>
        ))}
      </div>
      <figcaption className="text-[12px] text-muted">
        The non-negotiables, distilled into a file the coding agent reads at
        the start of every session. When the showcase and the spec files
        disagree, the spec files win.
      </figcaption>
    </figure>
  );
}

function BuildSystem() {
  return (
    <div className="flex flex-col gap-6">
      <Heading
        eyebrow="Designing the Build System"
        title="I turned the design system into a source of truth for both me and the agent."
      />

      <div className="flex flex-col gap-3">
        <p className="text-[16px] text-ink">
          Building Jeni with AI made iteration dramatically faster, but it
          introduced a different problem: the product could drift just as
          quickly as it could grow.
        </p>

        <p className="text-[16px] text-ink">
          I needed more than a component library. I built a living system that
          encoded not only how Jeni should look, but how its data, states,
          recommendations, and interactions should behave.
        </p>
      </div>

      {/* ── 01 ─────────────────────────────────────────────────────── */}
      <StepHeading
        marker="01 / Encode the Product"
        title="More than a component library."
      />

      <div className="flex flex-col gap-3">
        <p className="text-[16px] text-ink">
          Drift was not hypothetical. The same bar drifted to four heights and
          three radii. The same figure appeared twice under two labels. A fix
          on one screen never reached the second screen carrying the same
          data.
        </p>

        <p className="text-[16px] text-ink">
          So the system had to hold the product, not just its parts: 22
          sections in one HTML document, from tokens and components at the
          top to a rulebook of 125 laws and 136 things never to do at the
          bottom.
        </p>
      </div>

      <figure className="m-0 flex flex-col gap-2">
        <div className="grid gap-3">
          <ZoomableImage
            src="/work/jeni/ds-principles.png"
            alt="The top of the Jeni design system document: a navigation strip naming its 22 sections — Principles, Tokens, Colour, Type, Space, Depth, Icons, Primitives, Controls, Nav, Data, Pagination, Charts, Burn, Agent, Decision, Record, Merchant, Feedback, States, Shell, Motion, Laws — above section 01, Principles, and its four principle cards: colour is an argument, numbers before prose, assertions are ranked, every number is a door."
            className="w-full rounded-xl border border-line"
          />
          <ZoomableImage
            src="/work/jeni/ds-laws.png"
            alt="Section 23 of the same document, Laws & handoff: numbered rules such as 01 Every metric declares a polarity, 03 Every agent claim shows a source and a freshness, 05 Confidence gates assertion level, 14 Solid is measured, dashed is modelled, 21 Observed and inferred are separated structurally, followed by rules from the list of things never to do."
            className="w-full rounded-xl border border-line"
          />
        </div>
        <figcaption className="text-[12px] text-muted">
          One document, 22 sections: tokens and components at the top, 125
          product laws and 136 &ldquo;never&rdquo; rules at the bottom.
        </figcaption>
      </figure>

      <figure className="m-0 flex flex-col gap-2">
        <ZoomableImage
          src="/work/jeni/ds-tracks.png"
          alt="The Tracks entry from the design system: a paragraph stating that every horizontal bar in the system is one component with one geometry and that nine of them had drifted to four heights and three radii; a table of the track tokens — 6px height, 2px radius per segment, 2px gap, 16px marker, 12px tick; and a specimen showing a value on a scale, a composition, a band, a runway, a sequential ramp, and a loading bar all drawn from the same tokens."
          className="w-full rounded-xl border border-line"
        />
        <figcaption className="text-[12px] text-muted">
          Nine bars had drifted to four heights and three radii. One token now
          sets all of them, so a tenth variant cannot appear.
        </figcaption>
      </figure>

      <p className="text-[16px] text-ink">
        The visual rules mattered less for how they looked than for what they
        ruled out. Components reference the semantic token layer only; a
        component reaching for a primitive is a bug. Stable boundaries like
        that are what let implementation move quickly without every screen
        becoming its own dialect.
      </p>

      {/* ── 02 ─────────────────────────────────────────────────────── */}
      <StepHeading
        marker="02 / Encode the Reasoning"
        title="The system documented why, not just what."
      />

      <div className="flex flex-col gap-3">
        <p className="text-[16px] font-semibold text-ink">
          An AI guess never renders with the weight of a measured fact.
        </p>

        <p className="text-[16px] text-ink">
          Most of the rules are not visual. They decide when Jeni is allowed to
          recommend, when it must only observe, and how a number earns its
          colour. Jeni&rsquo;s output is ranked into five levels of assertion,
          and the level is gated in code: low confidence cannot render above
          an insight, stale data caps Jeni at an observation, and only the
          top two levels may ask for an action.
        </p>
      </div>

      <figure className="m-0 flex flex-col gap-2">
        <div className="grid gap-3">
          <ZoomableImage
            src="/work/jeni/ds-assertion.png"
            alt="The five assertion levels rendered top to bottom: L1 Value — $519,058 credit outstanding on a recessed surface; L2 Observation — a plain sentence; L3 Insight — a tinted card with medium confidence and its sources; L4 Recommendation — release $84k of idle balance with an off-peak bonus, with estimated impact, reach, horizon, and reversibility and buttons to create a campaign or show the working; L5 Alert — a red-tinted card that acts by 12 August with an open recharge list button."
            className="w-full rounded-xl border border-line"
          />
          <ZoomableImage
            src="/work/jeni/ds-gating.png"
            alt="The gating rules: confidence gates level, low confidence cannot render above L3; only L4 and L5 get buttons; stale data caps at L2; one L5 and one L4 per view; every L4 shows impact, reach, horizon and reversibility."
            className="w-full rounded-xl border border-line"
          />
        </div>
        <figcaption className="text-[12px] text-muted">
          Five levels of assertion. Confidence decides the level; only the top
          two may ask for an action.
        </figcaption>
      </figure>

      <p className="text-[16px] text-ink">
        The same principle reaches down to a single number. Colour never comes
        from the sign of a change; it comes from a polarity every metric has
        to declare, because up is good for visits and bad for credit
        outstanding. A metric with no polarity renders grey. When
        Bravo&rsquo;s credit burn broke that model&mdash;both tails bad, the
        target a middle band&mdash;the model got a fourth polarity rather than
        an exception.
      </p>

      <figure className="m-0 flex flex-col gap-2">
        <ZoomableImage
          src="/work/jeni/ds-polarity.png"
          alt="The delta polarity table: higher-better for visits and margin, lower-better for credit outstanding and churn, neutral for merchant count, band for credit burn rate where both tails are bad, and undefined where polarity is not yet set — each with how an up and a down arrow render; followed by the rule that polarity is a required property and a metric shipped without it renders grey."
          className="w-full rounded-xl border border-line"
        />
        <figcaption className="text-[12px] text-muted">
          Colour comes from a declared polarity, never from the arrow. A
          metric with no polarity renders grey.
        </figcaption>
      </figure>

      <p className="text-[16px] text-ink">
        Where Jeni models rather than measures, the system makes the
        difference visible. A projection is dashed, names its assumption, and
        carries its confidence. A campaign plan splits what was measured from
        what was assumed, rounds every figure to the precision the softest
        input earns, and&mdash;at a hand-set conversion rate with no prior
        run&mdash;offers a test instead of a Create button.
      </p>

      <figure className="m-0 flex flex-col gap-2">
        <div className="grid gap-3">
          <ZoomableImage
            src="/work/jeni/ds-burndown.png"
            alt="The burn-down chart for Yunshang Rice Noodle: a strip of balance $1,412, burn $118 a day, runway 12 days inside the caution band, and empties 2 September captioned projected, not measured; a legend where Measured is a solid line and Projected is dashed; the chart with a recharge step and a dashed tail crossing the 5-day threshold band; and a footer stating that the projection assumes the trailing 14-day burn rate holds and no recharge lands, at 64% confidence."
            className="w-full rounded-xl border border-line"
          />
          <ZoomableImage
            src="/work/jeni/ds-plan.png"
            alt="A campaign plan at 48% confidence, hand-set: the offer, a $20 bonus on a $100 top-up across two merchants; a warning that the merchants differ 2.6× in average bill and an existing campaign overlaps; a modelled return chain where each row carries a modelled, measured, or bounded chip and figures round to the precision the softest input earns; a sensitivity strip on uplift with a break-even at $66; two evidence columns headed Measured and Assumed; and an action row reading Adjust sizing and preview, Run as a 500-diner test, Dismiss."
            className="w-full rounded-xl border border-line"
          />
        </div>
        <figcaption className="text-[12px] text-muted">
          Measured is solid; modelled is dashed and names its assumption. A
          plan built on a hand-set rate rounds to what that guess earns, and
          gets a test button, not a Create button.
        </figcaption>
      </figure>

      <p className="text-[16px] text-ink">
        These are deterministic rules, not model behaviour. Writing them down
        is what let the product stay honest at the speed it was being built.
      </p>

      {/* ── 03 ─────────────────────────────────────────────────────── */}
      <StepHeading
        marker="03 / Build From Shared Context"
        title="The same rules guided both design and implementation."
      />

      <div className="flex flex-col gap-3">
        <p className="text-[16px] text-ink">
          The system ends in a handoff contract written for whoever builds the
          next screen: which values are derived at render and never stored,
          which thresholds live in config rather than in components, how
          sentinels are resolved in one shared formatter, which Figma nodes the
          buttons are pulled from, and what to build first.
        </p>

        <p className="text-[16px] text-ink">
          That is what stopped drift between surfaces. A runway computed from
          balance and burn cannot disagree with itself; a campaign state
          derived from its dates cannot outlive its window.
        </p>
      </div>

      <figure className="m-0 flex flex-col gap-2">
        <ZoomableImage
          src="/work/jeni/ds-handoff.png"
          alt="Six rows from the handoff notes. Campaign plan: a plan returns measured and assumed as separate objects so a new assumption cannot arrive looking observed. Campaign monitor: state is never returned as a string; the client derives Draft, Scheduled, Live, or Ended from three timestamps. Formatting boundary: sentinels are resolved server-side or in one shared formatter, never per component — minus one becomes Unlimited. Burn data model: runway is derived, not stored, and zone thresholds live in config, not in components. Figma source: buttons come from three named Bravo Design System Core nodes; re-pull them rather than editing CSS by hand. Build order: tokens and Lucide wrapper first, then metric tile and delta, block frame and table, segment strip, filter bar, assertion levels, and the agent panel last."
          className="w-full rounded-xl border border-line"
        />
        <figcaption className="text-[12px] text-muted">
          The rules carried their implementation: what is derived and never
          stored, which thresholds live in config, which Figma nodes to
          re-pull, and what to build first.
        </figcaption>
      </figure>

      <p className="text-[16px] text-ink">
        The coding agent read the same rules I did. A short contract file
        distilled the non-negotiables, and the full system sat behind it as
        the detail to load when needed&mdash;so design intent did not have to
        be re-explained at the start of every task.
      </p>

      <ContractCallout />

      <p className="text-[16px] text-ink">
        When a rule was broken in the product, the fix went back into the
        system as a &ldquo;what changed and why&rdquo; entry with its reason,
        so the next build started from the corrected rule rather than from my
        memory of it. The system became a feedback loop, not static
        documentation.
      </p>

      <JeniLoop />

      <p className="text-[16px] font-semibold text-ink">
        The system became the shared memory of the product: what Jeni looked
        like, how it behaved, and why those decisions existed.
      </p>
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
  { id: 'build', label: 'Build system', content: <BuildSystem /> },
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
