/**
 * The three drawings inside the "What I found" cards: a 3D icon on the
 * isometric field.
 *
 * The field is the footer's rule and node laid on isometric axes — a solid
 * hairline running past the edge of the frame, and where two cross, the
 * footer's punched node: a disc of the card's own white that erases the
 * rule around it, leaving a gap on all four sides, with a small dot
 * centred in that gap. Sparse and pale, so it reads as decoration rather
 * than a chart behind the subject.
 *
 * Ground stays the white of the card: no gradient, no tint, no frame.
 *
 * Authored at the size they render (240 × 190) so strokes land on the
 * weight they were drawn at, and strokes carry `non-scaling-stroke` so a
 * hairline survives a narrow card.
 */

const RAIL = '#f0f0f0';
const NODE = '#e0e0e0';

const W = 240;
const H = 190;

/* ── Projection ──────────────────────────────────────────────────────── */

const K = 0.5;

type Proj = (x: number, y: number, z?: number) => [number, number];
const mk = (ox: number, oy: number, s: number): Proj =>
  (x, y, z = 0) => [ox + (x - y) * s, oy + ((x + y) * K - z) * s];

/* ── Decoration ──────────────────────────────────────────────────────── */

const RAIL_FROM = -140;
const RAIL_TO = 240;
const RAIL_STEP = 62;

function Rails({ p }: { p: Proj }) {
  const ticks: number[] = [];
  for (let t = RAIL_FROM; t <= RAIL_TO; t += RAIL_STEP) ticks.push(t);
  const nodes = ticks.flatMap((x) => ticks.map((y) => p(x, y)));
  return (
    <>
      <g stroke={RAIL} strokeWidth={1} fill="none">
        {ticks.map((t) => {
          const [ax, ay] = p(RAIL_FROM, t);
          const [bx, by] = p(RAIL_TO, t);
          return <line key={`a${t}`} x1={ax} y1={ay} x2={bx} y2={by} />;
        })}
        {ticks.map((t) => {
          const [ax, ay] = p(t, RAIL_FROM);
          const [bx, by] = p(t, RAIL_TO);
          return <line key={`b${t}`} x1={ax} y1={ay} x2={bx} y2={by} />;
        })}
      </g>
      {/* The punch: a disc of the card's white, then the dot in the gap. */}
      <g>
        {nodes.map(([x, y], i) =>
          x > -6 && x < W + 6 && y > -6 && y < H + 6 ? (
            <g key={i}>
              <circle cx={x} cy={y} r={4.5} fill="#ffffff" />
              <circle cx={x} cy={y} r={1.75} fill={NODE} />
            </g>
          ) : null,
        )}
      </g>
    </>
  );
}

const CRISP =
  '[&_line]:[vector-effect:non-scaling-stroke] [&_circle]:[vector-effect:non-scaling-stroke]';

/* ── The drawings ────────────────────────────────────────────────────── */

/** Square, so the icon keeps its own proportions inside the 240 × 190 box. */
const ICON = 124;

const ART = [
  { name: 'Merchant', label: 'A storefront — the merchant that needs attention' },
  { name: 'Diner', label: 'A cloche lifted off a plate — the diner who could respond' },
  { name: 'Business', label: "Two buildings — Bravo's own economics" },
];

/**
 * `plain` drops the isometric field and uses the JPG icons, which carry
 * their own soft shadow — the rails would fight it.
 */
export function FactorArt({
  index,
  plain = false,
}: {
  index: number;
  plain?: boolean;
}) {
  const { name, label } = ART[index];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label} className={`w-full ${CRISP}`}>
      {!plain && <Rails p={mk(120, 56, 1.5)} />}
      <image
        href={`/work/jeni/icon_${name}.${plain ? 'jpg' : 'png'}`}
        x={(W - ICON) / 2}
        y={(H - ICON) / 2}
        width={ICON}
        height={ICON}
      />
    </svg>
  );
}
