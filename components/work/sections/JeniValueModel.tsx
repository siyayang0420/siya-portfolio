/**
 * How value moves between the three sides of the marketplace.
 *
 * The three sides used to be introduced by a row of actor cards above the
 * loop. They are gone: the loop already names all three, and the cards spent a
 * screen restating what the surrounding copy says.
 *
 * The question each side left open used to be a second row of cards below the
 * loop. Those are gone too, for the same reason one step further on: the three
 * passes that follow answer those questions one at a time, so stating each
 * question here and again at the head of its own pass said everything twice.
 * They are now the tab triggers in JeniSideTabs — one appearance each, on the
 * control that opens the answer.
 *
 * The loop is four relationships, not every operational step — the point is
 * that the system is graspable at a glance, so a fifth arrow costs more than
 * it explains. "Dine / credit burns" is deliberately one edge rather than two:
 * the diner spending and the merchant's credit drawing down are the same event
 * seen from either end.
 *
 * Monochrome, hairline strokes, no gradient. The reference sketch gives each
 * side a colour, which the labels already do here.
 *
 * ── Two renderings, one source of truth ────────────────────────────────────
 * The diagram is an SVG that has to hold four horizontal labels without
 * overlapping, which needs about 560px. Below `md` it would shrink to roughly
 * 9px type — legible to nobody. So the SVG is `aria-hidden` and desktop-only,
 * and the same four relationships are also written as a list: visible on a
 * phone, `sr-only` on desktop. Screen readers get the list at every width and
 * never meet the diagram, so nothing is announced twice.
 */

const LINE = '#c9c9c9';
const LABEL = '#888888';
const NODE_STROKE = '#e4e4e4';

/** The accessible version of the diagram, and the mobile one. */
const RELATIONSHIPS = [
  { route: 'Diners → Bravo', label: 'Top up' },
  { route: 'Bravo → Merchants', label: 'Buy prepaid credit' },
  { route: 'Diners → Merchants', label: 'Dine / credit burns' },
  { route: 'Bravo → Diners', label: 'Rewards & incentives' },
];

/** One node of the loop: a rounded plate with the party's name centred in it. */
function Node({ x, label }: { x: number; label: string }) {
  return (
    <>
      <rect
        x={x}
        y={70}
        width={120}
        height={60}
        rx={12}
        fill="#ffffff"
        stroke={NODE_STROKE}
      />
      {/* 16 / medium — the same treatment the actor cards above give these
          three names, and the study's one size for a card or figure title.

          y is the plate's true centre (70 + 60/2), not the 105 it sat at, and
          the baseline is placed with dy rather than `dominant-baseline`, which
          behaves the same in every browser. 0.41em rather than the usual
          0.35em: none of these three labels has a descender, so their drawn
          ink *is* the cap height, and the conventional value left it sitting
          0.9px high. Measured against the plate, not guessed. */}
      <text
        x={x + 60}
        y={100}
        dy="0.41em"
        textAnchor="middle"
        fontSize={16}
        fontWeight={500}
        fill="#0c0c0c"
      >
        {label}
      </text>
    </>
  );
}

export function JeniValueModel() {
  return (
    <figure className="m-0 flex flex-col">
      {/* ── The loop ────────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl p-6">
        {/* `max-w-[700px]` is doing typographic work, not layout work. An SVG
            scales its own text with the viewBox, so at the card's 752px inner
            width every label was being multiplied by 1.07 and landing at 20.4
            and 15px — sizes that appear nowhere else on the page. Capping the
            SVG at its viewBox width pins the scale at 1, which makes a viewBox
            unit exactly one CSS pixel: `fontSize={16}` now renders at 16px, on
            the page's scale rather than near it. */}
        <svg
          viewBox="0 0 700 250"
          className="mx-auto hidden h-auto w-full max-w-[700px] md:block"
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            <marker
              id="jeni-loop-arrow"
              viewBox="0 0 10 10"
              refX={9}
              refY={5}
              markerWidth={5}
              markerHeight={5}
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill={LINE} />
            </marker>
          </defs>

          <Node x={20} label="Diners" />
          <Node x={290} label="Bravo" />
          <Node x={560} label="Merchants" />

          {/* Diners → Bravo, and the rewards that come back. Two lines in the
              same gap, one above the other, so neither label has to sit on a
              diagonal. */}
          <line
            x1={146}
            y1={90}
            x2={282}
            y2={90}
            stroke={LINE}
            markerEnd="url(#jeni-loop-arrow)"
          />
          <text x={214} y={78} textAnchor="middle" fontSize={12} fill={LABEL}>
            Top up
          </text>

          <line
            x1={284}
            y1={114}
            x2={148}
            y2={114}
            stroke={LINE}
            markerEnd="url(#jeni-loop-arrow)"
          />
          <text x={214} y={133} textAnchor="middle" fontSize={12} fill={LABEL}>
            Rewards &amp; incentives
          </text>

          {/* Bravo → Merchants */}
          <line
            x1={416}
            y1={100}
            x2={552}
            y2={100}
            stroke={LINE}
            markerEnd="url(#jeni-loop-arrow)"
          />
          <text x={484} y={88} textAnchor="middle" fontSize={12} fill={LABEL}>
            Buy prepaid credit
          </text>

          {/* Diners → Merchants, routed under the row so it closes the loop
              without crossing Bravo. */}
          <path
            d="M 80 130 V 190 Q 80 200 90 200 H 610 Q 620 200 620 190 V 138"
            fill="none"
            stroke={LINE}
            markerEnd="url(#jeni-loop-arrow)"
          />
          <text x={350} y={220} textAnchor="middle" fontSize={12} fill={LABEL}>
            Dine / credit burns
          </text>
        </svg>

        {/* Visible on a phone, announced to screen readers at every width. */}
        <ul className="flex flex-col gap-3 md:sr-only">
          {RELATIONSHIPS.map(({ route, label }) => (
            <li key={label} className="flex flex-col gap-0.5">
              <span className="text-[12px] text-muted">{route}</span>
              <span className="text-[14px] font-medium text-ink">{label}</span>
            </li>
          ))}
        </ul>
      </div>

      <figcaption className="mt-3 text-[12px] text-muted">
        Bravo sits between the two sides: it buys merchant credit in advance,
        rewards diners for spending it, and keeps a margin as that credit burns
        down
      </figcaption>
    </figure>
  );
}
