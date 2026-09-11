import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { CARD } from './cardKit';

/**
 * The three passes through the marketplace: the answer visible, the proof
 * folded.
 *
 * ── The problem, stated properly ───────────────────────────────────────────
 * Each pass is ~1,500px of tables, figures and narrative. Three of them can
 * never be perceived as one set, however they are headed, because the reader
 * is never looking at more than one. Every earlier attempt — question cards,
 * an index, a rail, hanging numerals — tried to label the sections better and
 * left the length alone, so none of them could work. Tabs did attack the
 * length, but by hiding the substance: finish one pass and you had to scroll
 * back up to learn there were others.
 *
 * ── What this does ─────────────────────────────────────────────────────────
 * Split each pass into what it *found* and how it was found. The finding —
 * the question and its answer, in a line or two of the study's own copy — is
 * always visible on a compact card. The evidence behind it sits in a
 * disclosure beneath, the same native <details> the pipeline uses. Three
 * compact cards stack in a few hundred pixels, so all three are on one screen
 * at once: that is what makes them a set, and what lets the reader carry all
 * three into the solution that follows.
 *
 * Unlike tabs, every answer is visible simultaneously and opening one never
 * hides another. Only the proof is optional — which is the right thing to make
 * optional, since a reader who trusts the finding can move on and one who
 * doesn't can check it.
 *
 * Nothing is announced twice: each name, question and finding appears exactly
 * once, on its own card. A pass without a finding yet shows its marker and
 * question only, so the set of three is visible while the copy is written.
 */

export type Pass = {
  /** Becomes the card id as `pass-${id}`, so a pass can be linked to. */
  id: string;
  /** The side's name alone, e.g. "Merchants". The marker adds the count. */
  label: string;
  question: string;
  /** The answer, in a line or two. Always visible. */
  finding?: ReactNode;
  /** Everything behind the answer — figures and narrative. Folded. */
  evidence?: ReactNode;
};

const pad = (n: number) => String(n).padStart(2, '0');

export function JeniPasses({ passes }: { passes: Pass[] }) {
  // The count is built here rather than written into each label so the
  // denominator cannot drift out of step with the list.
  const total = pad(passes.length);

  return (
    // gap-3, the study's card-grid gap: the three should read as one set
    // rather than as three sections that happen to be adjacent.
    <div className="flex flex-col gap-3">
      {passes.map((pass, i) => (
        <section
          key={pass.id}
          id={`pass-${pass.id}`}
          className={`${CARD} flex flex-col gap-3 scroll-mt-[135px]`}
        >
          <div className="flex flex-col gap-2">
            {/* The marker takes the study's 12px uppercase treatment, as the
                pipeline's "01 · COLLECT" steps do. */}
            <p className="text-[12px] uppercase tracking-[0.08em] text-muted">
              {`${pad(i + 1)} / ${total} · ${pass.label}`}
            </p>
            <p className="text-[16px] font-semibold text-ink">{pass.question}</p>
          </div>

          {pass.finding && (
            <div className="flex flex-col gap-3">{pass.finding}</div>
          )}

          {/* The fold. Same construction as JeniPipeline — native <details>,
              marker hidden, chevron turning on `group-open` — so the two
              disclosures on this page behave and look the same. The rule
              above it is the runway card's footer rule: it separates the
              answer from the control that opens the proof. */}
          {pass.evidence && (
            <details className="group mt-1 border-t border-line pt-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-md text-[14px] font-medium text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4f83f7]/40 [&::-webkit-details-marker]:hidden">
                How I found this
                <ChevronDown
                  className="size-5 shrink-0 text-neutral-500 transition-transform duration-200 group-open:rotate-180"
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
              </summary>
              <div className="flex flex-col gap-6 pt-5">{pass.evidence}</div>
            </details>
          )}
        </section>
      ))}
    </div>
  );
}
