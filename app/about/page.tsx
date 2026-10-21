import type { Metadata } from "next";
import Footer from "@/components/Footer";
import { TopBar } from "@/components/work/TopBar";
import { Reveal } from "@/components/about/Reveal";
import { Slot } from "@/components/about/Slot";

export const metadata: Metadata = {
  title: "About — Siya Yang",
  description: "About Siya Yang.",
};

/**
 * About: a short bio card with a portrait, ruled Currently / Previously rows,
 * and a sideways strip of captioned photos. Straight on the site's grey, no
 * case-study sheet.
 *
 * Every <Slot> is a placeholder; copy marked "Placeholder" is too.
 *
 * Arbitrary sizes are inline: the dev build skips new arbitrary classes.
 */

// The gutter lives on the wrapper below (px-4 md:px-11, the TopBar's own
// inset), so every band lines up with the back arrow and the nav pills.
const WIDE = {} as const;


/**
 * The three ruled rows. Copy is final; edit in place.
 */
const EXPERIENCE = [
  {
    label: "Right now",
    title: "Designing, building, and learning where the line is",
    detail:
      "My work has been moving closer to implementation lately. I’m designing the product, shaping the logic behind it, and increasingly building the working version too.",
  },
  {
    label: "Curious about",
    title: "More things I don’t quite know how to make yet.",
    detail:
      "The projects I enjoy most usually start a little outside what I already know. That’s probably where I’ll keep looking.",
  },
];

const OUT_OF_WORK = {
  label: "Out of work",
  title: "Usually somewhere with Zemo.",
  detail:
    "When I’m not working, I’m usually hunting for a hidden gem to eat, driving somewhere just because it looks interesting, or walking around Coal Harbour with Zemo, my four-year-old Goldendoodle and full-time interruption.",
};

/**
 * Placeholder frames, one shared height with the width following each
 * frame's ratio, so the strip reads as a single line of photos. `place` is
 * the caption.
 */
const PHOTO_H = "clamp(240px, 26vw, 400px)";
const PHOTOS = [
  { ratio: 0.75, place: "Place" },
  { ratio: 1.45, place: "Place" },
  { ratio: 0.75, place: "Place" },
  { ratio: 0.67, place: "Place" },
  { ratio: 1.45, place: "Place" },
  { ratio: 0.75, place: "Place" },
];

/** A ruled row: mono label on the left half, a title and one line on the right. */
function Row({ label, title, detail }: { label: string; title: string; detail: string }) {
  return (
    <Reveal className="grid gap-4 md:grid-cols-2 md:gap-10">
      <p className="font-mono uppercase text-muted" style={{ fontSize: 12, letterSpacing: "0.12em", paddingTop: 4 }}>
        {label}
      </p>
      <div className="flex flex-col" style={{ gap: 12, maxWidth: 640 }}>
        <h2 className="font-display text-ink" style={{ fontSize: 20, lineHeight: 1.4, fontWeight: 500 }}>
          {title}
        </h2>
        <p className="text-muted" style={{ fontSize: 18, lineHeight: 1.5 }}>
          {detail}
        </p>
      </div>
    </Reveal>
  );
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#e1e1e1] font-light text-ink">
      <div className="relative">
        <TopBar />
      </div>

      <div className="px-4 md:px-11">
      {/* ── 01 POV ───────────────────────────────────────────────────────
          Laid out like a short bio card: a mono eyebrow, one large paragraph
          that carries the point of view, the links, and a small portrait at
          the far edge. */}
      <section
        className="flex flex-col justify-center"
        style={{ ...WIDE, minHeight: "86vh", paddingTop: 120, paddingBottom: 72 }}
      >
        <div className="flex flex-col-reverse md:flex-row md:justify-between" style={{ gap: "clamp(40px, 6vw, 96px)" }}>
          <Reveal className="flex flex-col" style={{ maxWidth: 640 }}>
            <p className="font-mono uppercase text-muted" style={{ fontSize: 12, letterSpacing: "0.12em" }}>
              About me
            </p>
            <h1
              className="font-display text-ink"
              style={{ marginTop: 20, fontSize: 22, lineHeight: 1.45, letterSpacing: "-0.01em", fontWeight: 500 }}
            >
              I started in interior design, where I became fascinated by how the spaces around us
              quietly shape how we behave. Ironically, an AutoCAD class was what pulled me out of
              physical space and into digital design.
            </h1>
            {/* Same size and weight as the opening line, so the two read as
                one statement rather than a headline and its body copy. */}
            <div className="flex flex-col font-display text-ink" style={{ marginTop: 28, gap: 28, fontSize: 22, lineHeight: 1.45, letterSpacing: "-0.01em", fontWeight: 500 }}>
              <p>
                I picked it up quickly and got hooked on making things on screen. That led me from
                graphic design to UI/UX, then into products, code, and eventually AI. I still care
                deeply about how things look and feel. I&rsquo;ve just become increasingly curious
                about everything underneath them.
              </p>
            </div>
            <ul className="flex flex-wrap gap-x-8 gap-y-3 font-display text-ink" style={{ marginTop: 40, fontSize: 16 }}>
              <li>
                <a href="mailto:siya.yang.design@gmail.com" className="transition hover:text-[#4f83f7]">
                  Email →
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/siya-yang/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition hover:text-[#4f83f7]"
                >
                  LinkedIn →
                </a>
              </li>
              <li>
                <a
                  href="https://www.superme.ai/siyay"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition hover:text-[#4f83f7]"
                >
                  SuperMe →
                </a>
              </li>
            </ul>
          </Reveal>

          {/* Side by side, the row stretches this to the copy's height and
              h-full fills it (a box with both sizes set ignores its ratio).
              Stacked, the height is auto again, so the 4:5 takes over. */}
          <Reveal delay={0.12} className="shrink-0" style={{ width: "clamp(240px, 30vw, 400px)" }}>
            <Slot label="Portrait" ratio="4 / 5" className="h-full" />
          </Reveal>
        </div>
      </section>

      {/* ── Experience ──────────────────────────────────────────────────
          Ruled rows: a mono label on the left half, the line and its detail
          on the right half. */}
      <section className="border-y border-black/[0.08]" style={{ paddingBlock: "clamp(56px, 9vh, 96px)" }}>
        <div className="flex flex-col" style={{ gap: "clamp(48px, 8vh, 88px)" }}>
          {EXPERIENCE.map((row) => (
            <Row key={row.label} {...row} />
          ))}
        </div>
      </section>

      {/* ── Out of work: the same row, introducing the photos below it. */}
      <section style={{ paddingTop: "clamp(56px, 9vh, 96px)" }}>
        <Row {...OUT_OF_WORK} />
      </section>
      </div>

      {/* ── Photos ────────────────────────────────────────────────────────
          A full-bleed strip that scrolls sideways, mixed widths, each frame
          captioned underneath. Swap each Slot for an <Image> when the photos
          are chosen; the caption is the place it was taken. */}
      <section style={{ paddingBlock: "clamp(72px, 12vh, 128px)" }}>
        <div
          className="flex items-start gap-4 overflow-x-auto px-4 md:px-11"
          style={{ scrollbarWidth: "none" }}
        >
          {PHOTOS.map((ph, i) => (
            <figure
              key={i}
              className="m-0 flex shrink-0 flex-col items-center gap-3"
              style={{ width: `calc(${PHOTO_H} * ${ph.ratio})` }}
            >
              <Slot label="Photo" ratio={`${ph.ratio}`} />
              <figcaption className="text-muted" style={{ fontSize: 15 }}>
                {ph.place}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <div>
      </div>

      <Footer />
    </main>
  );
}
