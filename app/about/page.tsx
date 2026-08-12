import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import { TopBar } from "@/components/work/TopBar";
import { BODY, HEADLINE } from "@/content/ethos";
import { BRAVO_SLUG } from "@/content/projects";

export const metadata: Metadata = {
  title: "About — Siya Yang",
  description:
    "Product designer working across fintech, AI tooling and design systems — designing how products work, and building them into reality.",
};

/**
 * Every claim here is already stated somewhere on the site — the hero pitch,
 * the ethos panel, the chapter list, the Bravo case study. Nothing about
 * employers, dates or education is invented; those need Siya's own words.
 */

const ELSEWHERE = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/siya-yang/" },
  { label: "GitHub", href: "https://github.com/siyayang0420" },
  { label: "SuperMe", href: "https://www.superme.ai/siyay" },
];

const PRACTICE = [
  {
    title: "Systems, not screens",
    body: "Bravo's rewards ran on four separate mechanisms, each with its own logic. I consolidated them into one model — $1 cashback equals $1 toward the next meal — so it held up for users, marketing, finance and the business at once.",
  },
  {
    title: "Design and build",
    body: "I design it, then I build it. The marketing site was mine end to end: layout, copy, SEO, and the analytics afterwards that told me what to cut. Revenue doubled.",
  },
  {
    title: "AI that shows its working",
    body: "An internal assistant with the team's context already loaded — it drafts, looks things up, and shows how it got there, so people can check it before they trust it.",
  },
];

export default function AboutPage() {
  return (
    // Same shell as a case study: grey ground, a rounded sheet over it, and
    // the footer revealed by the sheet's bottom corners.
    <main className="min-h-screen bg-[#e1e1e1] font-light text-[#0a0a0a]">
      <div className="relative z-10 rounded-b-[2.5rem] bg-[#f8f8f8]">
        <div
          className="relative w-full overflow-hidden"
          style={{ height: "42vh", background: "#D9D9D9" }}
        >
          <TopBar />
          <div className="absolute left-1/2 top-1/2 max-w-[calc(100%-32px)] -translate-x-1/2 -translate-y-1/2 text-center font-display text-[clamp(28px,5.5vw,72px)] tracking-[0.12em] text-black/55">
            ABOUT
          </div>
        </div>

        <div className="mx-auto max-w-[800px] px-4 pb-24 pt-12 md:px-0">
          <p className="mb-[18px] text-[14px] uppercase tracking-[0.18em] text-neutral-500">
            Siya Yang
          </p>
          <h1 className="mb-6 text-[clamp(28px,3vw,32px)] font-semibold">
            I design how products work, and build them into reality.
          </h1>
          <p className="text-[16px] leading-relaxed">
            I&apos;m a product designer working across fintech, AI tooling and design
            systems. Currently obsessed with AI behavior, product systems, and the
            invisible decisions that shape trust.
          </p>

          {/* The belief, in the same words as the home page — imported, not
              retyped, so the two can't drift apart. */}
          <section className="mt-16 border-t border-black/[0.08] pt-10">
            <h2 className="max-w-[20ch] font-display text-[clamp(1.5rem,2.4vw,2rem)] font-medium leading-[1.15] tracking-[-0.02em]">
              {HEADLINE}
            </h2>
            <div className="mt-6 flex max-w-[60ch] flex-col gap-5 text-[16px] leading-relaxed">
              {BODY.map((p, i) => (
                <p key={i} className={i === BODY.length - 1 ? "font-medium" : undefined}>
                  {p}
                </p>
              ))}
            </div>
          </section>

          <section className="mt-16 border-t border-black/[0.08] pt-10">
            <h2 className="mb-8 text-[14px] uppercase tracking-[0.18em] text-neutral-500">
              How I work
            </h2>
            <div className="flex flex-col gap-8">
              {PRACTICE.map((item) => (
                <div key={item.title}>
                  <h3 className="mb-2 text-[18px] font-semibold">{item.title}</h3>
                  <p className="max-w-[60ch] text-[16px] leading-relaxed">{item.body}</p>
                </div>
              ))}
            </div>
            <Link
              href={`/${BRAVO_SLUG}`}
              className="mt-8 inline-block text-[15px] underline underline-offset-4 transition-colors hover:text-neutral-500"
            >
              Read the Bravo case study
            </Link>
          </section>

          <section className="mt-16 border-t border-black/[0.08] pt-10">
            <h2 className="mb-6 text-[14px] uppercase tracking-[0.18em] text-neutral-500">
              Elsewhere
            </h2>
            <ul className="flex flex-wrap gap-x-8 gap-y-3 text-[16px]">
              {ELSEWHERE.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-4 transition-colors hover:text-neutral-500"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      <Footer />
    </main>
  );
}
