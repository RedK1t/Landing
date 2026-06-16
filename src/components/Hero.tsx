import { Suspense, lazy, useMemo } from "react";
import { motion, type Variants } from "framer-motion";
import { FaArrowRightLong, FaShieldHalved } from "react-icons/fa6";
import { DASH_URL } from "../lib/config";
import { useReducedMotion, isLowPowerDevice } from "../lib/useReducedMotion";
import { useTheme } from "../context/ThemeContext";
import { DemoVideo } from "./DemoVideo";

// Heavy three/R3F bundle — split into its own lazy chunk.
const HeroScene = lazy(() => import("./HeroScene"));

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

// Word-by-word reveal for the tagline: the <p> staggers its word children,
// each fading up from just below.
const wordContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};
const word: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const TAGLINE =
  "A modern approach to web-application penetration testing — the entire lifecycle, from scoping to reporting, in one platform.";

export function Hero() {
  const reduced = useReducedMotion();
  const { resolvedTheme } = useTheme();
  // Decide once per mount whether to render the WebGL scene.
  const enable3D = useMemo(() => !reduced && !isLowPowerDevice(), [reduced]);

  return (
    <section id="top" className="relative overflow-hidden px-5 pt-32 pb-20">
      {/* Background: 3D scene or static fallback */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        {enable3D ? (
          <Suspense fallback={<StaticGlow />}>
            <div className="absolute right-[-10%] top-[-6%] h-[120%] w-[70%] opacity-80">
              <HeroScene light={resolvedTheme === "light"} />
            </div>
          </Suspense>
        ) : (
          <StaticGlow />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg/40 to-bg" />
      </div>

      <motion.div
        className="mx-auto max-w-6xl"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.span
          variants={item}
          className="inline-flex items-center gap-2 rounded-full border border-line bg-fg/[0.03] px-3 py-1 font-mono text-xs text-fg-muted"
        >
          <FaShieldHalved className="text-red" />
          Offensive Security Platform
        </motion.span>

        <motion.h1
          variants={item}
          className="mt-6 max-w-3xl font-display text-6xl font-bold leading-[1.02] tracking-tight sm:text-7xl md:text-8xl"
        >
          <span className="text-red">Red</span>
          <span className="text-fg">Kit</span>
        </motion.h1>

        <motion.p
          variants={wordContainer}
          className="mt-5 max-w-2xl font-display text-2xl text-fg-secondary sm:text-3xl"
        >
          {TAGLINE.split(" ").map((w, i) => (
            <motion.span
              key={`${w}-${i}`}
              variants={word}
              className="inline-block whitespace-pre"
            >
              {w}{" "}
            </motion.span>
          ))}
        </motion.p>

        <motion.div
          variants={item}
          className="mt-9 flex flex-wrap items-center gap-4"
        >
          <a
            href={DASH_URL}
            className="group inline-flex items-center gap-2 rounded-full bg-red px-6 py-3 font-semibold text-white shadow-[0_8px_30px_rgba(206,50,50,0.4)] transition-all hover:bg-light-red"
          >
            Launch Dashboard
            <FaArrowRightLong className="transition-transform group-hover:translate-x-1" />
          </a>
        </motion.div>

        {/* Demo video */}
        <motion.div variants={item} className="mt-16">
          <DemoVideo />
        </motion.div>
      </motion.div>
    </section>
  );
}

/** CSS-only radial glow used as the reduced-motion / loading / low-power fallback. */
function StaticGlow() {
  return (
    <div className="absolute right-[-15%] top-[-10%] h-[80vh] w-[80vh] rounded-full bg-[radial-gradient(circle,rgba(206,50,50,0.22),transparent_60%)] blur-2xl" />
  );
}
