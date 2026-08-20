import type { Metadata } from "next";
import Footer from "@/components/Footer";
import { TopBar } from "@/components/work/TopBar";

export const metadata: Metadata = {
  title: "About — Siya Yang",
  description: "About Siya Yang.",
};

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
          <h1 className="text-[clamp(28px,3vw,32px)] font-semibold">Coming soon.</h1>
        </div>
      </div>

      <Footer />
    </main>
  );
}
