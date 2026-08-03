import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Several lockfiles live above this folder; pin the root so tracing is sane.
  outputFileTracingRoot: __dirname,
};

export default nextConfig;
