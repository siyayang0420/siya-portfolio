// The `Art` components from the source project were index-card artwork and
// aren't bundled with the skill. The detail page never reads them, so the field
// is dropped rather than stubbed.

/**
 * The Bravo case study's slug. Exported because the page gates several
 * sections on it — keeping it a constant stops those checks silently
 * falling through if the slug is ever renamed again.
 */
export const BRAVO_SLUG = 'simplifying-a-consumer-fintech-reward-engine';

/**
 * Same reasoning as BRAVO_SLUG: the page gates its acts on this value.
 *
 * All lowercase, like every other slug here. A capitalised "AI" would make the
 * route case-sensitive in practice — anyone typing the link by hand, or any
 * client that lowercases URLs, would land on a 404.
 */
export const JENI_SLUG = 'building-an-ai-native-operations-platform';

export type ProjectSlug =
  | typeof BRAVO_SLUG
  | typeof JENI_SLUG
  | 'bravo-onboarding'
  | 'oreo';

export type Project = {
  slug: ProjectSlug;
  title: string;
  imgTitle: string;
  heading: string;
  breadcrumb: string;
  year: string;
  role: string;
  collaborators: string;
  /** Optional fourth meta column — tools and services. Omit for none. */
  builtWith?: string;
  overview?: string;
  tags: string[];
  cardBg: string;
  heroBg: string;
  imgTitleDark?: boolean;
  /** Product logo shown beside the breadcrumb. Omit for none. */
  mark?: 'bravo';
  /**
   * Cover artwork for the hero band. When set it replaces the `imgTitle`
   * wordmark treatment; `heroBg` still shows while the image loads.
   */
  cover?: string;
};

export const projects: Project[] = [
  {
    slug: BRAVO_SLUG,
    title: 'Bravo Rewards App',
    imgTitle: 'BRAVO',
    heading: 'Redesigning a reward system that feels simple to users while staying powerful behind the scenes.',
    breadcrumb: 'Bravo Rewards App',
    year: '2025',
    role: 'Lead Product Designer',
    collaborators: 'CEO • 1 Marketing manager • 4 Software Engineers',
    // Must stay in sync with the marked-up copy in app/[slug]/page.tsx, which
    // renders this TL;DR directly so one clause can carry a <strong>.
    overview:
      'Bravo is a QR-based payments and dining rewards app operating across a network of restaurant partners in Metro Vancouver. Its rewards had grown into four overlapping mechanisms, making the value difficult for customers to understand and increasingly complex for the team to operate. I led the redesign to simplify what customers see at payment while preserving the campaign flexibility the business needed — ultimately consolidating the experience around $1 cashback = $1 toward a future meal.',
    tags: ['Fintech', 'Payments', 'Systems Design'],
    cardBg: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    heroBg: '#D9D9D9',
    // The cover is light now, so the wordmark has to be dark to read at all.
    imgTitleDark: true,
    mark: 'bravo',
    cover: '/work/bravo-cover.png',
  },
  {
    slug: 'bravo-onboarding',
    title: 'Bravo Onboarding',
    imgTitle: 'BRAVO ONBOARDING',
    heading: 'Rebuilding onboarding under investor-demo pressure',
    breadcrumb: 'Bravo Onboarding',
    year: '2024',
    role: 'Lead Product Designer',
    collaborators: 'UX · Mobile Onboarding',
    overview:
      "Bravo is a QR-based payments and dining rewards app operating across a network of restaurant partners in Metro Vancouver. This case study covers the design of Bravo's onboarding experience — from a rushed v1 shipped in one week to hit an investor demo, to the v2 rebuild currently in progress. It's a story about making the right call under pressure, measuring what happened, and knowing when something needs to be done properly the second time.",
    tags: ['Fintech', 'Onboarding', 'Mobile'],
    cardBg: 'linear-gradient(135deg, #0f3460 0%, #16213e 50%, #1a1a2e 100%)',
    heroBg: 'linear-gradient(135deg, #0f3460, #1a1a2e)',
  },
  {
    slug: 'oreo',
    title: 'Oreo Design System',
    imgTitle: 'OREO UI',
    heading: 'BUILDING A REUSABLE DESIGN SYSTEM',
    breadcrumb: 'Oreo Design System',
    year: '2024',
    role: 'Design Systems',
    collaborators: 'Tokens · Components',
    tags: ['Design System', 'Tokens'],
    cardBg: '#f5f0e8',
    heroBg: 'linear-gradient(135deg, #f5f0e8, #ede8df)',
    imgTitleDark: true,
  },
  {
    slug: JENI_SLUG,
    // Named to match the hero chapter that links here, so the card, the
    // browser tab and the page heading all say the same thing.
    title: 'Jeni — Marketplace Intelligence',
    imgTitle: 'JENI',
    heading:
      'Turning fragmented marketplace signals into decisions Bravo can act on.',
    breadcrumb: 'Jeni — Marketplace Intelligence',
    year: '2026',
    role: 'Product Designer & Builder',
    collaborators: 'CEO · 1 Backend Engineer',
    builtWith: 'Claude · ChatGPT · AWS · Figma',
    // Two paragraphs. The blank line is load-bearing: the page splits an
    // overview on it rather than rendering the whole string into one <p>,
    // where the break would have collapsed to a single space.
    overview:
      "Bravo is a payments and dining rewards marketplace connecting diners with 500+ restaurant partners across Metro Vancouver. Despite years of customer, merchant, and transaction data, the team lacked a way to understand what those relationships meant—or where to act.\n\nWith no PM, predefined requirements, or predetermined solution, I defined, designed, and built Jeni end to end: an AI-powered intelligence system that turns fragmented marketplace signals into actionable opportunities.",
    tags: ['SaaS', 'Dashboard'],
    cardBg: '#0d0d0d',
    heroBg: 'linear-gradient(135deg, #0d0d0d, #1a1a1a)',
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
