# siya-portfolio

Personal portfolio for Siya Yang — a scroll-driven landing page plus long-form
case-study routes at `/<slug>`.

**Origin.** The landing page's layout and motion language began as a from-scratch
study of [dimension.dev](https://dimension.dev) and has since diverged into its
own site — original copy, own palette, own type. Nothing was scraped: no markup,
CSS, images or video from that site is included, and the gradient shader and
product mockups are original. Typeface is Plus Jakarta Sans via `next/font`.

## Stack

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS v4 ·
lucide-react · framer-motion (case-study sections only).

## Running it

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

> This machine's default `node` is 18.15 via nvm, which Next 15 rejects.
> `/opt/homebrew/bin/node` is 25.x — put it first on `PATH`, or `nvm use 20`.

## Layout

```
app/
  layout.tsx          fonts + site metadata
  page.tsx            landing section order
  globals.css         Tailwind theme tokens, keyframes, engraved + fill effects
  scroll-cue.css      the mobile scroll indicator
  [slug]/page.tsx     case-study route, driven by content/projects.ts
components/
  WaveCanvas.tsx      the hero gradient — a hand-written WebGL2 shader
  Hero.tsx            the pinned, scroll-driven project hero
  chapters.ts         the three projects shown in the hero
  ChapterVisuals.tsx  CSS mockups, one per chapter (placeholders)
  Intro.tsx           name block + copy-to-clipboard contact pill
  ScrollCue.tsx       animated scroll indicator (phone only)
  Ethos.tsx           the statement panel that stacks over the hero
  Features.tsx        the "Playground" cards
  Footer.tsx          engraved headings + ledger grid
  ui/, work/sections/ case-study primitives (ported, still named Bravo*)
content/projects.ts   case-study registry
lib/cn.ts             className helper
```

## The pieces worth knowing about

### The hero gradient (`WaveCanvas`)

A three-stop vertical wash with optional rippled banding, in a fragment shader.
Four things here are load-bearing and easy to undo by accident:

- **`gl_FragCoord` is bottom-left origin**, so the shader flips `y` for a
  top-down gradient.
- **Uniforms are driven by primitive props**, not the `colors`/`origin` arrays.
  Callers pass inline literals and re-render on scroll; depending on array
  identity rebuilds the GL context every tick until the browser runs out.
- **Never call `loseContext()` on cleanup.** Once a canvas is force-lost, a later
  `getContext()` returns that same dead context — remounting (navigating away and
  back) then renders nothing at all.
- **`resize()` pushes the viewport and `uRes` on every call**, not only on a size
  change. On remount the canvas is reused at the same size but the program is
  brand new, and `uRes` at `(0,0)` makes the shader paint nothing.

Falls back to a CSS gradient without WebGL2 or on a lost context, and renders one
still frame under `prefers-reduced-motion`.

### The hero (`Hero.tsx`)

A `(chapters + 2) × 100vh` section with a `sticky` inner frame. Scroll maps to an
active chapter; the extra viewport at the end is runway the Ethos panel slides up
through while the hero stays pinned and blurs behind it.

The progress rule's head is driven by a `--p` custom property written straight to
the DOM once per frame, and eased toward its target rather than pinned 1:1 — using
React state there would re-render the whole hero every frame.

Below `lg` the pinned version is `display: none` and a stacked one takes over, so
the scroll math short-circuits.

### The Ethos panel

Copy starts unfilled and paints in with `#4f83f7` as you scroll. One `--p` on the
container per frame; each word derives its own fill in CSS from that plus its own
`--s` offset, so there are no per-word DOM writes across ~70 spans.

Each word is a **single uniform opacity** — an earlier per-word gradient made
every word sit at its own partial fill, which read as speckle rather than one
edge. Softness comes from ~6 neighbouring words overlapping, set by `WORD_SPAN`.

`--p` defaults to `1` in CSS so the copy renders fully filled if JS never runs.

### The footer

- The rules are **cell borders**, not a background grid, and every intersection is
  punched out by an 8px disc filled with the local page colour. The disc's fill
  has to track the footer's vertical gradient — hence the flat stops at 18% and
  74%, pinning the band's edges to `#e1e1e1` and `#fcfcfc`.
- Headings use `.engraved`: a grey ramp clipped to the glyphs plus a blue
  highlight that sweeps across. The three headings run a **relay** — one blob
  crossing the footer, never two at once, never none.

  The timings are coupled and none can derive itself: `ENGRAVE_DELAYS` in
  `Footer.tsx`, `--engrave-cycle`, and the keyframe percentage in `globals.css`.
  Spacing is `0.7 × pass` and cycle is `2.1 × pass` — the band sits off the glyphs
  for the first and last 15% of its travel, so spacing a full pass apart leaves
  the footer dark a third of the time. The keyframe share is `pass ÷ cycle`, which
  is scale-invariant, so changing speed only needs the other two.

## Case studies

`/<slug>` renders from `content/projects.ts`. Only
`simplifying-a-consumer-fintech-reward-engine` has a written study; unknown slugs
404, and hero chapters with `slug: null` show "Coming soon" instead of a link.

Note `app/[slug]` is at the root, so it is greedy — any future static route like
`/about` needs its own file, which will correctly take precedence.

## Known gaps

- Two of the three hero projects have no case study yet.
- The ported case-study sections still carry the source project's names
  (`Bravo*`) and copy; the structure is the reusable part.
- `components/GetStarted.tsx` and `components/AppWindow.tsx` are unreferenced
  since the Ethos panel replaced that section.
- Chapter visuals are placeholder DOM mockups, not real product screens.
