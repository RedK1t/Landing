import { useEffect, useState } from "react";
import { FaArrowRightLong } from "react-icons/fa6";
import { DASH_URL } from "../lib/config";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

/** Sticky top nav: brand mark + section links + theme toggle + Launch CTA. */
export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "border-b border-line bg-bg/80 backdrop-blur-md"
          : "border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <a href="#top" aria-label="RedKit home">
          <Logo markClass="h-9 w-9" textClass="text-xl" />
        </a>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <a
            href={DASH_URL}
            className="group inline-flex items-center gap-2 rounded-full bg-red px-4 py-2 text-sm font-semibold text-white shadow-[0_4px_20px_rgba(206,50,50,0.35)] transition-all hover:bg-light-red"
          >
            <span className="hidden sm:inline">Launch Dashboard</span>
            <span className="sm:hidden">Launch</span>
            <FaArrowRightLong className="transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>
      </nav>
    </header>
  );
}
