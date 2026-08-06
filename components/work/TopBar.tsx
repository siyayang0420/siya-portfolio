import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/cn';
import { PILL } from '@/components/ui/pill';

/**
 * Case-study top bar: Home on the left, Work and About me on the right.
 *
 * Absolutely positioned over the cover rather than fixed — the page has no
 * site nav, and a fixed bar would need a top offset on <main>'s first child,
 * which collapses out and exposes the dark body behind it.
 *
 * The pills are the shared PILL treatment, used as-is.
 */
const NAV_PILL = PILL;

export function TopBar() {
  return (
    <nav
      aria-label="Site"
      className="absolute inset-x-0 top-0 z-10 flex items-center justify-between gap-2 px-4 py-4 md:px-11 md:py-6"
    >
      {/* Icon only — aria-label carries the name the visible text used to. */}
      <Link href="/" aria-label="Home" className={NAV_PILL}>
        <ArrowLeft className="size-[18px] shrink-0" strokeWidth={1.75} />
      </Link>

      <div className="flex items-center gap-2 md:gap-3">
        <Link href="/#work" className={NAV_PILL}>
          Work
        </Link>
        <Link href="/#ethos" className={NAV_PILL}>
          About me
        </Link>
      </div>
    </nav>
  );
}
