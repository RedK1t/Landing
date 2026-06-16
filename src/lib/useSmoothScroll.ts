import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "./useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

/**
 * Lenis smooth-scroll wired into GSAP's ticker so ScrollTrigger stays in sync.
 * This is the documented Lenis ↔ GSAP integration pattern:
 *   - drive `lenis.raf` from `gsap.ticker`
 *   - turn off GSAP lag smoothing so the two clocks agree
 *   - call `ScrollTrigger.update` on every Lenis scroll event
 *
 * Skipped entirely when the user prefers reduced motion — native scroll is
 * used instead (CSS handles smooth anchor jumps), and ScrollTrigger still works
 * against the native scroller.
 *
 * Returns nothing; mount it once near the root.
 */
export function useSmoothScroll(): void {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) {
      // Make sure ScrollTrigger measures against the native scroller.
      ScrollTrigger.refresh();
      return;
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const onTick = (time: number) => {
      // gsap.ticker time is in seconds; Lenis expects milliseconds.
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    // Recalculate trigger positions once fonts/layout settle.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);

    return () => {
      gsap.ticker.remove(onTick);
      lenis.off("scroll", ScrollTrigger.update);
      lenis.destroy();
      window.removeEventListener("load", refresh);
    };
  }, [reduced]);
}

/**
 * Smoothly scroll to an element by id (used by the hero "Watch demo" link).
 * Falls back to native scrollIntoView when Lenis isn't active.
 */
export function scrollToId(id: string): void {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}
