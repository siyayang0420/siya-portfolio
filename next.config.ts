import type { NextConfig } from "next";

// PostHog, served from this domain under /ingest so ad blockers and privacy
// settings don't drop its extra scripts (session recording, dead clicks).
// Derived from the project's own host, e.g. https://us.i.posthog.com.
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";
const posthogAssets = posthogHost.replace(".i.posthog.com", "-assets.i.posthog.com");

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: "/ingest/static/:path*", destination: `${posthogAssets}/static/:path*` },
      { source: "/ingest/:path*", destination: `${posthogHost}/:path*` },
    ];
  },
  // PostHog's API paths end in a slash; without this Next redirects them.
  skipTrailingSlashRedirect: true,
  // Several lockfiles live above this folder; pin the root so tracing is sane.
  outputFileTracingRoot: __dirname,
  images: {
    // The case-study cover is served at quality 90 — it is a UI mockup, so it
    // is mostly small text and hard edges, which the default 75 smears.
    // Undeclared qualities warn today and are an error from Next 16.
    qualities: [75, 90],
  },
};

export default nextConfig;
