'use client';

import type { ReactNode } from 'react';
import posthog from 'posthog-js';

/**
 * In-page anchor that smooth-scrolls to a target id WITHOUT changing the URL.
 * Changing the hash triggers a Next route update + the View Transitions
 * wipe animation (a visible glitch), so we preventDefault and scroll manually,
 * offsetting for the fixed nav + progress bar (~135px).
 */
export function ScrollLink({
  href,
  className,
  children,
  offset = 135,
}: {
  href: string;
  className?: string;
  children: ReactNode;
  offset?: number;
}) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!href.startsWith('#')) return;
    const el = document.getElementById(href.slice(1));
    if (!el) return;
    e.preventDefault();
    if (
      process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN &&
      process.env.NEXT_PUBLIC_POSTHOG_HOST
    ) {
      posthog.capture('case_study_section_navigated', {
        target_section: href.slice(1),
      });
    }
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}
