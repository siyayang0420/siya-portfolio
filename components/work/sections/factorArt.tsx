/**
 * The three drawings inside the "What I found" cards.
 *
 * Each one draws the subject of its own question, not a generic volume: a
 * marketplace of merchants with one needing help; a population of diners
 * with the reachable subset selected; what Bravo spends against what comes
 * back. If a drawing would still make sense under a different label, it is
 * decoration and does not belong here.
 *
 * The decoration is the footer's rule and node, laid on the drawing's own
 * isometric axes: a solid hairline running out past the object to the edge
 * of the frame, and where two cross, the footer's punched node — a disc of
 * the card's own white that erases the rule around it, leaving a gap on all
 * four sides, with a small solid dot centred in that gap. Small square
 * handles mark the corners of the object being asserted.
 *
 * Sparse, solid and pale: the footer spaces its nodes a long way apart and
 * keeps them a step under its own rules, which is what stops the field
 * reading as a chart behind the drawing.
 *
 * Ground stays the white of the card: no gradient, no tint, no frame.
 *
 * Authored at the size they render (240 × 190) so strokes land on the weight
 * they were drawn at, and strokes carry `non-scaling-stroke` so a hairline
 * survives a narrow card.
 */

const HAIR = '#b9b9b9';
const RAIL = '#f0f0f0';
const NODE = '#e0e0e0';
const ACCENT = '#4f83f7';

const W = 240;
const H = 190;

/* ── Projection ──────────────────────────────────────────────────────── */

const K = 0.5;

/**
 * A projector per drawing, so each is framed on its own terms: one global
 * transform meant a drawing either fitted the box or filled it, never both —
 * the merchant block is wide and low, the stacks are narrow and tall.
 */
type Proj = (x: number, y: number, z?: number) => [number, number];
const mk = (ox: number, oy: number, s: number): Proj =>
  (x, y, z = 0) => [ox + (x - y) * s, oy + ((x + y) * K - z) * s];

const pt = ([x, y]: [number, number]) => `${x.toFixed(1)},${y.toFixed(1)}`;
const poly = (p: [number, number][]) => p.map(pt).join(' ');

type Rect = { x: number; y: number; w: number; d: number };

const quad = (p: Proj, r: Rect, z: number): [number, number][] => [
  p(r.x, r.y, z),
  p(r.x + r.w, r.y, z),
  p(r.x + r.w, r.y + r.d, z),
  p(r.x, r.y + r.d, z),
];

/* ── Decoration ──────────────────────────────────────────────────────── */

const RAIL_FROM = -140;
const RAIL_TO = 240;
const RAIL_STEP = 62;

/**
 * Solid construction lines on both isometric axes, running past the frame so
 * they read as an open plane rather than a bounded grid, with a solid node
 * where they cross. The SVG viewport does the clipping.
 */
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

/**
 * Selection handles on the corners of the thing being asserted — the design
 * tool's own vocabulary, which is what makes the drawing read as a construct
 * rather than an illustration.
 */
function Handles({
  p,
  r,
  z,
  colour = HAIR,
}: {
  p: Proj;
  r: Rect;
  z: number;
  colour?: string;
}) {
  const s = 4;
  return (
    <g fill="#ffffff" stroke={colour} strokeWidth={1}>
      {quad(p, r, z).map(([x, y], i) => (
        <rect key={i} x={x - s / 2} y={y - s / 2} width={s} height={s} />
      ))}
    </g>
  );
}

const CRISP =
  '[&_line]:[vector-effect:non-scaling-stroke] [&_polygon]:[vector-effect:non-scaling-stroke] [&_rect]:[vector-effect:non-scaling-stroke] [&_circle]:[vector-effect:non-scaling-stroke]';

function Frame({
  p,
  label,
  children,
}: {
  p: Proj;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label={label}
      className={`w-full ${CRISP}`}
    >
      <Rails p={p} />
      {children}
    </svg>
  );
}

/** An isometric block: the top face plus the two faces this view can see. */
function Block({
  p,
  r,
  z0,
  z1,
  accent = false,
}: {
  p: Proj;
  r: Rect;
  z0: number;
  z1: number;
  accent?: boolean;
}) {
  const top = quad(p, r, z1);
  const right: [number, number][] = [
    p(r.x + r.w, r.y, z1),
    p(r.x + r.w, r.y + r.d, z1),
    p(r.x + r.w, r.y + r.d, z0),
    p(r.x + r.w, r.y, z0),
  ];
  const left: [number, number][] = [
    p(r.x, r.y + r.d, z1),
    p(r.x + r.w, r.y + r.d, z1),
    p(r.x + r.w, r.y + r.d, z0),
    p(r.x, r.y + r.d, z0),
  ];
  const stroke = accent ? ACCENT : HAIR;
  const fill = accent ? ACCENT : '#ffffff';
  const base = accent ? 0.2 : 0.96;
  return (
    <g stroke={stroke} strokeWidth={1.25} fill="none">
      <polygon points={poly(left)} fill={fill} fillOpacity={base * 0.55} />
      <polygon points={poly(right)} fill={fill} fillOpacity={base * 0.78} />
      <polygon points={poly(top)} fill={fill} fillOpacity={base} />
    </g>
  );
}

/** Painter's order: larger x+y sits in front in this projection. */
const depth = (r: Rect) => r.x + r.y;

/* ── The drawings ────────────────────────────────────────────────────── */

/**
 * Where does the marketplace need help? — a block of merchants, one of them
 * flagged. The marketplace is the subject; the accent building, its pin and
 * its handles are the one that needs something.
 */
function Need() {
  const p = mk(120, 54, 1.12);
  const S = 34;
  const G = 11;
  const cols = [-8, -8 + S + G, -8 + (S + G) * 2];
  const rows = [15, 15 + S + G];
  const heights = [20, 36, 14, 30, 17, 26];
  const flagged = 3;
  const blocks = cols
    .flatMap((x, ci) =>
      rows.map((y, ri) => ({
        r: { x, y, w: S, d: S } as Rect,
        h: heights[ci * rows.length + ri],
        i: ci * rows.length + ri,
      })),
    )
    .sort((a, b) => depth(a.r) - depth(b.r));
  const hit = blocks.find((b) => b.i === flagged)!;
  const [px, py] = p(hit.r.x + S / 2, hit.r.y + S / 2, hit.h);
  return (
    <Frame
      p={p}
      label="A block of merchants drawn as isometric buildings, with one flagged in accent, pinned and handled"
    >
      {blocks.map((b) => (
        <Block key={b.i} p={p} r={b.r} z0={0} z1={b.h} accent={b.i === flagged} />
      ))}
      <g stroke={ACCENT} strokeWidth={1.25} fill="none">
        <line x1={px} y1={py - 5} x2={px} y2={py - 23} />
        <circle cx={px} cy={py - 27} r={4.5} fill={ACCENT} fillOpacity={0.2} />
      </g>
      <Handles p={p} r={hit.r} z={hit.h} colour={ACCENT} />
    </Frame>
  );
}

/**
 * Who could realistically respond? — a population of diners on the plane,
 * with the reachable subset inside an accent boundary. The crowd is the
 * subject; the selection is the answer.
 */
function Opportunity() {
  const p = mk(120, 40, 1.1);
  const pins: [number, number][] = [
    [4, 16],
    [34, 4],
    [66, 12],
    [98, 22],
    [12, 48],
    [44, 34],
    [74, 44],
    [104, 54],
    [8, 80],
    [40, 68],
    [70, 78],
    [100, 88],
    [26, 104],
    [58, 106],
    [88, 100],
  ];
  const sel: Rect = { x: 30, y: 26, w: 56, d: 56 };
  const inside = ([x, y]: [number, number]) =>
    x >= sel.x && x <= sel.x + sel.w && y >= sel.y && y <= sel.y + sel.d;
  const dot = ([x, y]: [number, number], d = 5) =>
    quad(p, { x: x - d, y: y - d, w: d * 2, d: d * 2 }, 0);
  const sorted = [...pins].sort((a, b) => a[0] + a[1] - (b[0] + b[1]));
  return (
    <Frame
      p={p}
      label="A population of diners as markers on a plane, with the reachable subset inside an accent selection"
    >
      <polygon
        points={poly(quad(p, sel, 0))}
        fill={ACCENT}
        fillOpacity={0.09}
        stroke={ACCENT}
        strokeWidth={1.25}
        strokeDasharray="4 3"
      />
      {sorted.map((q, i) => {
        const on = inside(q);
        const [cx, cy] = p(q[0], q[1], 0);
        return (
          <g key={i}>
            {on && (
              <line
                x1={cx}
                y1={cy - 2}
                x2={cx}
                y2={cy - 15}
                stroke={ACCENT}
                strokeWidth={1.1}
              />
            )}
            <polygon
              points={poly(dot(q))}
              fill={on ? ACCENT : '#ffffff'}
              fillOpacity={on ? 0.85 : 1}
              stroke={on ? ACCENT : HAIR}
              strokeWidth={1.1}
            />
            {on && (
              <circle cx={cx} cy={cy - 18} r={2.8} fill={ACCENT} fillOpacity={0.9} />
            )}
          </g>
        );
      })}
      <Handles p={p} r={sel} z={0} colour={ACCENT} />
    </Frame>
  );
}

/**
 * Would acting create enough value? — what Bravo puts in beside what comes
 * back, as two stacks to scale, with the cost height carried across so the
 * difference is the drawing rather than a caption.
 */
function Economics() {
  const p = mk(120, 44, 1.2);
  const S = 34;
  const slab = 12;
  const cost: Rect = { x: 12, y: 40, w: S, d: S };
  const ret: Rect = { x: 66, y: 40, w: S, d: S };
  const costN = 2;
  const retN = 5;
  const z = costN * slab;
  const [lx, ly] = p(cost.x + S, cost.y + S / 2, z);
  const [rx, ry] = p(ret.x, ret.y + S / 2, z);
  return (
    <Frame
      p={p}
      label="Two stacks to scale: what Bravo spends beside what comes back, with the cost height carried across"
    >
      {Array.from({ length: costN }, (_, i) => (
        <Block key={`c${i}`} p={p} r={cost} z0={i * slab} z1={(i + 1) * slab} />
      ))}
      <line
        x1={lx}
        y1={ly}
        x2={rx}
        y2={ry}
        stroke={ACCENT}
        strokeWidth={1}
        strokeDasharray="4 3"
      />
      {Array.from({ length: retN }, (_, i) => (
        <Block
          key={`r${i}`}
          p={p}
          r={ret}
          z0={i * slab}
          z1={(i + 1) * slab}
          accent={i >= costN}
        />
      ))}
      <Handles p={p} r={ret} z={retN * slab} colour={ACCENT} />
    </Frame>
  );
}

const ART = [Need, Opportunity, Economics];

export function FactorArt({ index }: { index: number }) {
  const Art = ART[index];
  return <Art />;
}
