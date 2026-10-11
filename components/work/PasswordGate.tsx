'use client';

import { useActionState } from 'react';
import { ArrowRight, Lock } from 'lucide-react';
import { unlock } from '@/app/[slug]/actions';
import { PILL } from '@/components/ui/pill';
import { EMAIL, useCopyEmail } from '@/components/ui/useCopyEmail';
import { cn } from '@/lib/cn';

/** A grey bar standing in for a line of the locked study. */
function Ghost({ className }: { className: string }) {
  return <div className={cn('rounded-full bg-[#ececec]', className)} />;
}

/**
 * Stands in for the acts of a locked case study. The study itself is never
 * sent until the server sees the cookie, so what sits behind the card is a
 * ghost of an act — a heading, a paragraph, a figure — fading out bottom to
 * top into the sheet, with the password card centred over it.
 */
export function PasswordGate({ slug, title }: { slug: string; title: string }) {
  const [state, action, pending] = useActionState(unlock.bind(null, slug), {
    error: false,
  });
  const { copied, copy } = useCopyEmail();
  // A drafted request, so asking for access is one click and a send.
  const mailto = `mailto:${EMAIL}?${new URLSearchParams({
    subject: `Password request: ${title}`,
    body: `Hi Siya,\n\nI came across your portfolio and would love to read the ${title} case study. Could you share the password?\n\nThanks,\n`,
  }).toString().replace(/\+/g, '%20')}`;

  return (
    <section className="relative mt-16" aria-labelledby="gate-title">
      <div aria-hidden className="flex flex-col gap-4">
        <Ghost className="h-3 w-24" />
        <Ghost className="mb-4 h-5 w-2/3" />
        <Ghost className="h-3 w-full" />
        <Ghost className="h-3 w-full" />
        <Ghost className="h-3 w-5/6" />
        <Ghost className="mb-4 h-3 w-3/5" />
        <div className="h-[320px] rounded-[1.5rem] bg-[#ececec]" />
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#f8f8f8] via-[#f8f8f8]/90 to-[#f8f8f8]/30"
      />

      <div className="absolute inset-0 flex items-center justify-center">
        <form
          action={action}
          className="flex w-full max-w-[400px] flex-col gap-5 rounded-[1.5rem] bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.06),0_24px_48px_-24px_rgba(0,0,0,0.25)] ring-1 ring-black/[0.06] md:p-8"
        >
          <div className="flex items-center gap-2 text-muted">
            <Lock size={14} strokeWidth={1.75} aria-hidden />
            <span
              id="gate-title"
              className="text-[12px] uppercase tracking-[0.14em]"
            >
              Password protected
            </span>
          </div>

          <p className="text-[16px] text-ink">
            Enter the password to read the full case study.
          </p>

          <div className="flex gap-2">
            <input
              type="password"
              name="password"
              required
              autoComplete="current-password"
              aria-label="Password"
              aria-invalid={state.error}
              aria-describedby={state.error ? 'gate-error' : undefined}
              placeholder="Password"
              className={cn(
                'min-w-0 flex-1 rounded-full bg-[#f8f8f8] px-5 py-3 font-display text-sm text-ink ring-1 outline-none transition placeholder:text-muted focus:ring-[#4f83f7]',
                state.error ? 'ring-[#d14343]' : 'ring-black/[0.06]',
              )}
            />
            <button
              type="submit"
              disabled={pending}
              className={cn(PILL, 'disabled:opacity-60')}
            >
              Unlock
              <ArrowRight size={14} strokeWidth={1.75} aria-hidden />
            </button>
          </div>

          {state.error && (
            <p id="gate-error" role="alert" className="-mt-2 text-[13px] text-[#d14343]">
              That password didn&rsquo;t work. Try again?
            </p>
          )}

          <p className="text-[13px] text-muted">
            Need access?{' '}
            <a
              href={mailto}
              className="underline underline-offset-4 transition-colors hover:text-ink"
            >
              Email me
            </a>
            {/* mailto does nothing useful without a mail app — a private
                window, or a browser with no handler, just opens a blank tab —
                so the address can be copied instead. */}
            {' '}or{' '}
            <button
              type="button"
              onClick={copy}
              className="underline underline-offset-4 transition-colors hover:text-ink"
            >
              {copied ? 'email copied!' : 'copy my email'}
            </button>
            <span className="sr-only" role="status" aria-live="polite">
              {copied ? `${EMAIL} copied to clipboard` : ''}
            </span>
          </p>
        </form>
      </div>
    </section>
  );
}
