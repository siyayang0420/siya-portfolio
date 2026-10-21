import { SeverityNumber } from '@opentelemetry/api-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

export const loggerProvider =
  projectToken && host
    ? new LoggerProvider({
        resource: resourceFromAttributes({
          'service.name': 'siya-portfolio',
        }),
        processors: [
          new BatchLogRecordProcessor({
            exporter: new OTLPLogExporter({
              url: `${host}/i/v1/logs`,
              headers: {
                Authorization: `Bearer ${projectToken}`,
                'Content-Type': 'application/json',
              },
            }),
          }),
        ],
      })
    : undefined;

const portfolioLogger = loggerProvider?.getLogger('posthog-portfolio-logs');

export function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return;

  if (!loggerProvider) {
    if (process.env.NODE_ENV !== 'production') {
      const variableName = !projectToken
        ? 'NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN'
        : 'NEXT_PUBLIC_POSTHOG_HOST';

      console.error(
        new Error(
          `${variableName} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variableName} is configured`,
        ),
      );
    }
    return;
  }
}

export function logCaseStudyUnlockRejected(slug: string) {
  portfolioLogger?.emit({
    body: 'Case study unlock rejected',
    severityNumber: SeverityNumber.INFO,
    attributes: { case_study_slug: slug },
  });
}

export function logCaseStudyUnlockSucceeded(slug: string) {
  portfolioLogger?.emit({
    body: 'Case study unlock succeeded',
    severityNumber: SeverityNumber.INFO,
    attributes: { case_study_slug: slug },
  });
}

export async function flushPostHogLogs() {
  try {
    await loggerProvider?.forceFlush();
  } catch {
    // Log delivery must not affect a visitor's access to a protected study.
  }
}
