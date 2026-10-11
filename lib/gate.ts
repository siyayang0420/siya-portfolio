import { createHash, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import { getProject } from '@/content/projects';

/**
 * Password gate for locked case studies. Each study names its own env var in
 * `passwordEnv` (.env.local locally, the host's settings in production), so
 * passwords never land in the public repo and every study can have its own.
 * The cookie holds a hash of the password rather than a flag, so changing it
 * signs every visitor out.
 *
 * Everything is looked up from the slug on the server — the env var name is
 * never taken from the client. A missing var means nothing unlocks: a secret
 * forgotten on deploy should leave the page locked, not quietly open.
 */
const hash = (s: string) => createHash('sha256').update(s).digest('hex');

function passwordFor(slug: string) {
  const env = getProject(slug)?.passwordEnv;
  return env ? process.env[env] : undefined;
}

export const gateCookie = (slug: string) => `unlock-${slug}`;

export function passwordMatches(slug: string, attempt: string) {
  const password = passwordFor(slug);
  if (!password) return false;
  return timingSafeEqual(Buffer.from(hash(attempt)), Buffer.from(hash(password)));
}

export function unlockToken(slug: string) {
  return hash(passwordFor(slug) ?? '');
}

export async function isUnlocked(slug: string) {
  if (!passwordFor(slug)) return false;
  return (await cookies()).get(gateCookie(slug))?.value === unlockToken(slug);
}
