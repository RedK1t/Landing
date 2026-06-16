import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import type { Phase } from "../data/phases";
import { useReducedMotion } from "../lib/useReducedMotion";

/**
 * One lifecycle phase. Scroll-linked reveal (Recordly-style): the card grows
 * and fades in as it enters the viewport, sits at full size through the middle,
 * and gently recedes as it leaves — driven continuously by scroll position.
 */
export function PhaseCard({ phase, side }: { phase: Phase; side: "left" | "right" }) {
  const Icon = phase.icon;
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // 0 = just entering from bottom · ~0.3 = settled · ~0.9 = starting to leave top
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.3, 0.88, 1],
    [0, 1, 1, 0.5],
  );
  const scale = useTransform(
    scrollYProgress,
    [0, 0.3, 0.88, 1],
    [0.9, 1, 1, 0.97],
  );
  const y = useTransform(scrollYProgress, [0, 0.3], [60, 0]);

  const style = reduced ? undefined : { opacity, scale, y };

  return (
    <motion.article
      ref={ref}
      style={style}
      className={`group relative overflow-hidden rounded-2xl border border-line bg-surface p-6 transition-colors hover:border-red/50 sm:p-7 ${
        side === "right" ? "md:text-right" : ""
      }`}
    >
      {/* Ghost ordinal */}
      <span
        className={`font-display pointer-events-none absolute top-2 select-none text-7xl font-bold leading-none text-fg/[0.05] ${
          side === "right" ? "left-4" : "right-4"
        }`}
      >
        {phase.num}
      </span>

      <div
        className={`flex items-center gap-3 ${
          side === "right" ? "md:flex-row-reverse" : ""
        }`}
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red/12 text-xl text-light-red ring-1 ring-red/30">
          <Icon />
        </span>
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-red">
            Phase {phase.num}
          </p>
          <h3 className="font-display text-xl font-bold tracking-tight text-fg">
            {phase.title}
          </h3>
        </div>
      </div>

      <p className="mt-4 text-fg-secondary">{phase.blurb}</p>

      <ul
        className={`mt-5 flex flex-wrap gap-2 ${
          side === "right" ? "md:justify-end" : ""
        }`}
      >
        {phase.badges.map((b) => (
          <li
            key={b}
            className="rounded-md border border-line bg-fg/[0.04] px-2.5 py-1 font-mono text-[11px] text-fg-muted"
          >
            {b}
          </li>
        ))}
      </ul>
    </motion.article>
  );
}
