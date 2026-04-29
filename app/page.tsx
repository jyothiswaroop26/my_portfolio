import Cursor from "@/components/Cursor";
import Constellation from "@/components/Constellation";
import Loader from "@/components/Loader";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Projects from "@/components/Projects";
import Stack from "@/components/Stack";
import About from "@/components/About";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <>
      <Cursor />
      <Constellation />
      <div className="bg-grid" aria-hidden />
      <div className="bg-noise" aria-hidden />
      <div className="bg-mesh" aria-hidden>
        <div className="mesh mesh-1" />
        <div className="mesh mesh-2" />
        <div className="mesh mesh-3" />
      </div>
      <Loader />
      <Navigation />
      <main>
        <Hero />
        <Marquee />
        <Projects />
        <Stack />
        <About />
        <Contact />
      </main>
    </>
  );
}
