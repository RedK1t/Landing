import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { Lifecycle } from "./components/Lifecycle";
import { FinalCta } from "./components/FinalCta";
import { Research } from "./components/Research";
import { Faq } from "./components/Faq";
import { Footer } from "./components/Footer";
import { CustomCursor } from "./components/CustomCursor";
import { useSmoothScroll } from "./lib/useSmoothScroll";

export default function App() {
  // Lenis smooth scroll wired into GSAP ScrollTrigger (disabled under
  // prefers-reduced-motion). Mount once at the root.
  useSmoothScroll();

  return (
    <div className="min-h-screen bg-bg text-fg">
      <CustomCursor />
      <Nav />
      <main>
        <Hero />
        <Lifecycle />
        <FinalCta />
        <Research />
        <Faq />
      </main>
      <Footer />
    </div>
  );
}
