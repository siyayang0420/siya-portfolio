import { ArrowDown, ArrowUpDown, RotateCcw } from 'lucide-react';
import { CARD } from './cardKit';

/**
 * How the build system sat between design and implementation.
 *
 * A single column, read top to bottom: design decisions feed the living
 * system; the system is read by both me and the coding agent; what they
 * build is Jeni; and what Jeni teaches goes back into the system. The one
 * two-way arrow is the point — the system is consulted, not handed off —
 * and the return arrow at the foot is what makes it a loop rather than a
 * pipeline.
 *
 * Same construction as the other strips in this study: 12px uppercase
 * markers, 16px semibold names, 14px descriptors, grey operator glyphs
 * between, on the white card surface.
 */

const NODES: { label: string; name: string; note?: string }[] = [
  { label: 'Source', name: 'Figma & product decisions' },
  {
    label: 'Living product system',
    name: 'One HTML document, twelve spec files',
    note: 'tokens · components · product laws · implementation rules',
  },
  {
    label: 'Readers',
    name: 'Me and the coding agent',
    note: 'the same rules, read at the start of every session',
  },
  { label: 'Output', name: 'Jeni' },
];

function Node({ label, name, note }: (typeof NODES)[number]) {
  return (
    <div className="flex flex-col gap-1 text-center">
      <span className="text-[12px] uppercase tracking-[0.08em] text-muted">
        {label}
      </span>
      <span className="text-[16px] font-semibold text-ink">{name}</span>
      {note && <span className="text-[14px] text-muted">{note}</span>}
    </div>
  );
}

function Between({ two }: { two?: boolean }) {
  const Glyph = two ? ArrowUpDown : ArrowDown;
  return (
    <div aria-hidden className="flex justify-center py-1">
      <Glyph className="size-4 text-neutral-300" strokeWidth={1.75} />
    </div>
  );
}

export function JeniLoop() {
  return (
    <figure className="m-0 flex flex-col">
      <div className={`${CARD} flex flex-col gap-2`}>
        {NODES.map((node, i) => (
          <div key={node.label} className="contents">
            {/* The system ↔ its readers is the one two-way edge. */}
            {i > 0 && <Between two={i === 2} />}
            <Node {...node} />
          </div>
        ))}

        <div className="mt-3 flex items-center justify-center gap-2 border-t border-line pt-4">
          <RotateCcw
            aria-hidden
            className="size-4 shrink-0 text-neutral-300"
            strokeWidth={1.75}
          />
          <span className="text-[14px] text-muted">
            New product decisions return to the system as rules, with their
            reasons.
          </span>
        </div>
      </div>
    </figure>
  );
}
