'use server';

import { cookies } from 'next/headers';
import { gateCookie, passwordMatches, unlockToken } from '@/lib/gate';

export type UnlockState = { error: boolean };

// ponytail: no rate limiting — fine for a portfolio, add a per-IP limiter if
// the password ever guards something worth brute-forcing.
export async function unlock(
  slug: string,
  _prev: UnlockState,
  form: FormData,
): Promise<UnlockState> {
  if (!passwordMatches(slug, String(form.get('password') ?? ''))) {
    return { error: true };
  }
  // Setting a cookie in an action re-renders the route, so the page swaps the
  // gate for the full study without a manual refresh.
  (await cookies()).set(gateCookie(slug), unlockToken(slug), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: `/${slug}`,
    maxAge: 60 * 60 * 24 * 30,
  });
  return { error: false };
}
