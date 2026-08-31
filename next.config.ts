import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
