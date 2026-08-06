export type Chapter = {
  id: string;
  name: string;
  /** Sits in the mono label between the city and the project name. */
  meta: string;
  blurb: string;
  /**
   * Which mockup to render on the stage. These still point at the placeholder
   * visuals — swap them for real project screens when you have them.
   */
  visual: string;
  /**
   * Routes to /<slug> at the site root. Must match a slug in
   * content/projects.ts — null means no case study is written yet, and the
   * link is hidden rather than pointing at a 404.
   */
  slug: string | null;
};

export const chapters: Chapter[] = [
  {
    id: "cashback",
    name: "Simplifying a consumer fintech reward engine",
    meta: "Bravo Rewards App",
    blurb:
      "Redesigning a reward system that feels simple to users while staying powerful behind the scenes.",
    visual: "reward-engine",
    slug: "simplifying-a-consumer-fintech-reward-engine",
  },
  {
    id: "copilot",
    name: "Internal AI Copilot",
    meta: "Internal tooling",
    blurb:
      "An assistant with the team's context already loaded. It drafts, looks things up, and shows its working — so people can check it before they trust it.",
    visual: "deep-work",
    slug: null,
  },
  {
    id: "site",
    name: "Marketing Site, End to End",
    meta: "Design · Code · Growth",
    blurb:
      "Designed it, built it, wrote the copy, planned the SEO — then read the analytics and cut what wasn't earning its place. Revenue doubled.",
    visual: "recap",
    slug: null,
  },
];
