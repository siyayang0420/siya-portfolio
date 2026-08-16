import type { Metadata } from "next";
import { Caveat, DM_Sans, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

// The site family — body, display and the mono-styled labels.
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

// Scoped to the Bravo offer card in the hero, which is drawn to the real app's
// spec. Nothing outside that visual should reach for it.
const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

// The handwritten annotation on the Bravo prototype. `--font-hand` was already
// being asked for there, but nothing ever defined it, so it silently fell back
// to the body sans. Caveat is the closest Google face to Figma Hand.
const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-hand",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Siya Yang | Product Designer",
  description:
    "Product designer working across fintech, AI tooling and design systems — designing how products work, and building them into reality.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${jakarta.variable} ${dmSans.variable} ${caveat.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
