// The `Art` components from the source project were index-card artwork and
// aren't bundled with the skill. The detail page never reads them, so the field
// is dropped rather than stubbed.

/**
 * The Bravo case study's slug. Exported because the page gates several
 * sections on it — keeping it a constant stops those checks silently
 * falling through if the slug is ever renamed again.
 */
export const BRAVO_SLUG = 'simplifying-a-consumer-fintech-reward-engine';

export type ProjectSlug =
  | typeof BRAVO_SLUG
  | 'bravo-onboarding'
  | 'oreo'
  | 'jeni';

export type Project = {
  slug: ProjectSlug;
  title: string;
  imgTitle: string;
  heading: string;
  breadcrumb: string;
  year: string;
  role: string;
  collaborators: string;
  overview?: string;
  tags: string[];
  cardBg: string;
  heroBg: string;
  imgTitleDark?: boolean;
};

export const projects: Project[] = [
  {
    slug: BRAVO_SLUG,
    title: 'Bravo App',
    imgTitle: 'BRAVO',
    heading: 'Redesigning a reward system that feels simple to users while staying powerful behind the scenes.',
    breadcrumb: 'Bravo Rewards App',
    year: '2025',
    role: 'Lead Product Designer',
    collaborators: 'CEO • 1 Marketing manager • 4 Software Engineers',
    overview:
      "Bravo Rewards App is a QR-based payments and dining rewards app operating across a network of restaurant partners in Metro Vancouver. Bravo's reward system had 4 separate mechanisms, each with its own logic. I help to reshape the experience consolidating them into one model : $1 cashback equals $1 toward the next meal, and made the system work for users, marketing, finance, and the business at the same time.",
    tags: ['Fintech', 'Payments', 'Systems Design'],
    cardBg: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    heroBg: '#D9D9D9',
    // The cover is light now, so the wordmark has to be dark to read at all.
    imgTitleDark: true,
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
    slug: 'jeni',
    title: 'Jeni AI Dashboard',
    imgTitle: 'JENI AI',
    heading: 'AGENTIC UI FOR AI WORKFLOWS',
    breadcrumb: 'Jeni AI Dashboard',
    year: '2026',
    role: 'Sole Designer & Builder',
    collaborators: 'Dashboard · SaaS UX',
    overview:
      "Jeni is an internal restaurant intelligence tool built for Bravo's business development team. It monitors Metro Vancouver in real time for restaurant openings, closures, and risk signals — and automates contact discovery so BD can reach new leads without manual searching. This case study covers how the tool went from two offhand complaints to a live product on the CTO's roadmap and the CEO's investor pitch deck. It's a story about turning an informal brief into something the company depends on.",
    tags: ['SaaS', 'Dashboard'],
    cardBg: '#0d0d0d',
    heroBg: 'linear-gradient(135deg, #0d0d0d, #1a1a1a)',
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
