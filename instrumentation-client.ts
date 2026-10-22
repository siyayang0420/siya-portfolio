import posthog from "posthog-js";
// Bundled rather than lazy-loaded: as separate files they're fetched by name
// (posthog-recorder.js, dead-clicks-autocapture.js), and privacy blockers
// match that name wherever it's served from. Shipped in the bundle, there's
// no request for them to drop.
import "posthog-js/dist/posthog-recorder";
import "posthog-js/dist/dead-clicks-autocapture";

const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

if (!projectToken || !host) {
  if (process.env.NODE_ENV !== "production") {
    const variableName = !projectToken
      ? "NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN"
      : "NEXT_PUBLIC_POSTHOG_HOST";

    console.error(
      new Error(
        `${variableName} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variableName} is configured`,
      ),
    );
  }
} else {
  posthog.init(projectToken, {
    // Same-origin proxy (see next.config.ts); ui_host keeps PostHog's own
    // links (toolbar, replays) pointing at the real app.
    api_host: "/ingest",
    ui_host: host.replace(".i.posthog.com", ".posthog.com"),
    defaults: "2025-05-24",
    capture_exceptions: true,
    debug: process.env.NODE_ENV === "development",
  });
}
