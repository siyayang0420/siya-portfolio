import FooterContact from "@/components/FooterContact";

type FooterLink = { label: string; href: string };

const columns: { title: string; links: FooterLink[] }[] = [
  {
    title: "Pages",
    links: [
      { label: "Works", href: "#" },
      { label: "About me", href: "#" },
    ],
  },
  {
    title: "Me",
    links: [
      { label: "LinkedIn", href: "https://www.linkedin.com/in/siya-yang/" },
      { label: "GitHub", href: "https://github.com/siyayang0420" },
      { label: "SuperMe", href: "https://www.superme.ai/siyay" },
    ],
  },
];

const RULE = "border-black/[0.08]";

/**
 * When each heading's highlight starts, in seconds: the wordmark, then the two
 * column titles.
 *
 * Spacing is 5.6s, NOT the 8s pass length. The bright band has width and sits
 * outside the glyphs at both ends of its travel, so a heading is only visibly
 * lit for the middle 70% of its pass — 5.6s of 8s. Spacing the starts a full
 * pass apart would leave the footer dark for a third of every cycle. Spacing
 * by the visible duration instead hands off exactly on the frame the previous
 * band clears the glyphs.
 *
 * Cycle is 3 × 5.6 = 16.8s. To change how fast the blob crosses a word, scale
 * all three together — spacing = 0.7 × pass, cycle = 2.1 × pass. The 47.619%
 * keyframe in globals.css is pass ÷ cycle, so it stays put under any scaling.
 */
const ENGRAVE_DELAYS = [0, 5.6, 11.2];

/**
 * The node the original punches into every rule intersection: an 8px disc
 * filled with the local page colour, so it erases the rule underneath, with a
 * 3.5px dot centred in the gap. `tone` has to match the background behind it,
 * which is why the top and bottom nodes differ.
 */
function Node({ at, tone }: { at: string; tone: string }) {
  return (
    <span
      className={`absolute z-10 hidden size-2 items-center justify-center rounded-full md:flex ${at}`}
      style={{ backgroundColor: tone }}
      aria-hidden
    >
      <span className="size-[3.5px] rounded-full bg-black/10" />
    </span>
  );
}

function Cell({
  children,
  className = "",
}: {
  // Optional: the spacer cell between the wordmark and "Menu" renders empty.
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative flex grow flex-col self-stretch border-r ${RULE} px-6 pb-10 pt-9 md:pb-12 md:pt-11 ${className}`}
    >
      {children}
      <Node at="-right-[4.5px] -top-[4.5px]" tone="#e1e1e1" />
      <Node at="-bottom-[4.5px] -right-[4.5px]" tone="#fcfcfc" />
    </div>
  );
}

export default function Footer() {
  return (
    <footer
      id="contact"
      className="relative overflow-hidden text-black"
      // Held flat above the band and below it so the punched nodes sit on the
      // exact colours they're filled with.
      style={{
        backgroundImage:
          "linear-gradient(to bottom, #e1e1e1 0%, #e1e1e1 18%, #fcfcfc 74%, #fcfcfc 100%)",
      }}
    >
      <div className="h-14 md:h-20" />

      {/* Full-bleed band, ruled top and bottom; columns are divided by their
          own right-hand rules rather than by gap. */}
      <div className={`relative border-y ${RULE}`}>
        {/* Row from md up so tablet matches desktop; a single stacked column
            only below that. Four tracks for four cells now Legal is gone. */}
        <div className="grid md:grid-cols-[1.8fr_0.85fr_1fr_1fr]">
          <Cell className="gap-4 md:px-10">
            <p
              className="engraved font-display text-[clamp(2.75rem,5vw,4.25rem)] font-medium leading-none tracking-[-0.035em]"
              // First leg of the relay; the columns take the next two.
              style={
                {
                  "--engrave-delay": `${ENGRAVE_DELAYS[0]}s`,
                } as React.CSSProperties
              }
            >
              Let's Chat
            </p>
            <p className="text-sm text-black/45">
              siya.yang.design@gmail.com
            </p>
            <FooterContact />
          </Cell>

          {/* Deliberately empty — this blank cell is what gives the band its
              wide, ledger-like rhythm. */}
          <Cell className="hidden md:flex" />

          {columns.map((c, i) => (
            <Cell
              key={c.title}
              className={`gap-4 border-t md:border-t-0 ${RULE} md:px-10`}
            >
              <p
                className="engraved font-display text-3xl font-medium leading-none tracking-[-0.035em] md:text-[40px] md:leading-[48px]"
                // Picks up its own leg of the relay: 5s, then 8s.
                style={
                  {
                    "--engrave-delay": `${ENGRAVE_DELAYS[i + 1]}s`,
                  } as React.CSSProperties
                }
              >
                {c.title}
              </p>
              <ul className="flex flex-col gap-4 md:gap-5">
                {c.links.map((l) => {
                  const external = l.href.startsWith("http");
                  return (
                    <li key={l.label}>
                      <a
                        href={l.href}
                        // Profiles open in a new tab; noreferrer so the target
                        // can't reach back through window.opener.
                        {...(external
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                        className="text-sm text-black/45 transition hover:text-black"
                      >
                        {l.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </Cell>
          ))}
        </div>
      </div>

      <div className="relative px-6 pb-20 pt-10 md:px-10 md:pb-12">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/25">
          © 2026 Siya — Product Designer
        </p>
      </div>
    </footer>
  );
}
