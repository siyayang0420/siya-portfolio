import Hero from "@/components/Hero";
import Ethos from "@/components/Ethos";
import Features from "@/components/Features";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    // Footer grey sits behind everything so the rounded bottom corners of the
    // white Features section have something to reveal.
    <main id="top" className="bg-[#e1e1e1]">
      <Hero />
      <Ethos />
      <Features />
      <Footer />
    </main>
  );
}
