/** The agent trace copy, shared by the hero animation and the case study figure. Verbatim from the product. */

export const QUESTIONS = [
  "Which restaurants get lots of views but few payments",
  "Which restaurants have low app attention but strong payment activity",
  "Which restaurants have the most views per payer",
];

type TraceStep = {
  title: string;
  sub?: string;
  time?: string;
  /** While the source is still being read. */
  running?: { title: string; sub: string };
};

export const TRACE: TraceStep[] = [
  {
    title:
      "It’s a filtered list question about restaurant attention against payment activity and restaurant attention in the app.",
    sub: "population: merchants.viewed in app · filters: attention_outcome_quadrant=high_attention_low_outcome",
    time: "436ms",
  },
  {
    title:
      "This needs PostHog and Bravo’s production MySQL and PostHog: the restaurant attention against payment activity and restaurant detail page views (PostHog).",
    sub: "posthog detail views joined to bravo settled bills on store id, over one shared window · $screen events whose current_page_name is '/store', aggregated per restaurant · last 30 days",
  },
  {
    running: {
      title:
        "I’m reading PostHog and Bravo’s production MySQL side by side for the restaurant attention against payment activity...",
      sub: "posthog detail views joined to bravo settled bills on store id, over one shared window · last 30 days · attention_outcome_quadrant=high_attention_low_outcome",
    },
    title:
      "Found 65 matching rows in the restaurant attention against payment activity.",
    sub: "posthog detail views joined to bravo settled bills on store id, over one shared window · last 30 days · attention_outcome_quadrant=high_attention_low_outcome",
    time: "8350ms",
  },
  {
    running: {
      title:
        "I’m checking PostHog for the restaurant detail page views (PostHog)...",
      sub: "$screen events whose current_page_name is '/store', aggregated per restaurant · last 30 days",
    },
    title:
      "Found 523 matching rows in the restaurant detail page views (PostHog).",
    sub: "$screen events whose current_page_name is '/store', aggregated per restaurant · last 30 days",
    time: "8350ms",
  },
  {
    title: "Checked every figure against the catalog’s definitions — they hold.",
    sub: "4 supported · 0 refused",
  },
  {
    title: "Source is healthy, with data through 2026-10-06.",
    sub: "status: healthy · data through 2026-10-06",
    time: "3ms",
  },
  { title: "Laying out the 50 results as a ranked table." },
];
