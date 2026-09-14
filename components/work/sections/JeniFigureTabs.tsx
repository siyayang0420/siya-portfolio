'use client';

import { useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';

/**
 * A figure switcher: one white card, a row of text tabs across the top, and
 * the open tab's content beneath.
 *
 * Tabs earned their place here where they didn't for the three passes: each
 * panel is a screenshot and a line, not a screen and a half of argument, so
 * switching costs the reader nothing and the two sides sit in the space of
 * one. The passes' failure mode — finish a panel, scroll back up to learn
 * there were others — can't happen with content this short.
 *
 * Underline tabs rather than the pill the site's nav uses: this is a control
 * inside a figure, and it should read as part of the card, not as a button
 * floating on it. The active indicator is the study's hairline weight in ink.
 *
 * Only the open panel is mounted — see JeniSideTabs' note on `hidden` vs
 * `flex`, and it keeps the closed tab's screenshot from loading until asked.
 */

export type FigureTab = {
  /** Used for the tab/panel id pair, so it must be unique on the page. */
  id: string;
  label: string;
  content: ReactNode;
};

export function JeniFigureTabs({
  tabs,
  label,
}: {
  tabs: FigureTab[];
  /** Announced as the tablist's name. */
  label: string;
}) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  /** Wraps at both ends, and carries focus with it — roving tabindex. */
  const move = (to: number) => {
    const i = (to + tabs.length) % tabs.length;
    setActive(i);
    refs.current[i]?.focus();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const step: Record<string, number> = {
      ArrowRight: active + 1,
      ArrowLeft: active - 1,
      Home: 0,
      End: tabs.length - 1,
    };
    if (!(e.key in step)) return;
    e.preventDefault();
    move(step[e.key]);
  };

  const open = tabs[active];

  return (
    <div className="rounded-xl bg-white p-6">
      <div
        role="tablist"
        aria-label={label}
        onKeyDown={onKeyDown}
        className="flex gap-6 border-b border-line"
      >
        {tabs.map((tab, i) => {
          const on = i === active;
          return (
            <button
              key={tab.id}
              ref={(el) => {
                refs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`figtab-${tab.id}`}
              aria-selected={on}
              aria-controls={`figpanel-${tab.id}`}
              tabIndex={on ? 0 : -1}
              onClick={() => setActive(i)}
              // -mb-px lets the active underline sit on the row's hairline
              // rather than a pixel above it.
              className={`-mb-px border-b-2 pb-3 text-[14px] font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4f83f7]/40 ${
                on
                  ? 'border-ink text-ink'
                  : 'border-transparent text-muted hover:text-ink'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`figpanel-${open.id}`}
        aria-labelledby={`figtab-${open.id}`}
        className="flex flex-col gap-4 pt-5"
      >
        {open.content}
      </div>
    </div>
  );
}
