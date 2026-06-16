import { useRef } from "react";
import { motion } from "framer-motion";
import { PHASES } from "../data/phases";
import { PhaseCard } from "./PhaseCard";
import { LifecycleConnector } from "./LifecycleConnector";
import { useReducedMotion } from "../lib/useReducedMotion";
import { useMediaQuery } from "../lib/useMediaQuery";

/**
 * The pentest lifecycle told as a scroll narrative. Cards are a single column
 * (alternating left/right on desktop); a rounded connector snakes through the
 * gutters around them and draws on scroll. On mobile the cards go full-width
 * with a simple rounded left rail and a node beside each card.
 */
export function Lifecycle() {
  const reduced = useReducedMotion();
  // ONE breakpoint shared by the card layout and the connector line.
  const desktop = useMediaQuery("(min-width: 768px)");
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  return (
    <section id="lifecycle" className="relative px-5 py-24">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="font-mono text-sm uppercase tracking-widest text-red">
            How it works
          </p>
          <h2 className="font-display mt-3 text-4xl font-bold tracking-tight text-fg sm:text-5xl md:text-6xl">
            The penetration testing lifecycle
          </h2>
          <p className="mt-4 text-fg-muted">
            Every phase of an engagement, mapped to a RedKit module — follow the
            line from scoping all the way to the final report.
          </p>
        </motion.div>

        {/* Track: connector overlay + single column of cards */}
        <div ref={trackRef} className="relative mt-16 pt-2">
          <LifecycleConnector
            trackRef={trackRef}
            cards={cardRefs}
            reduced={reduced}
            desktop={desktop}
          />

          <div className="flex flex-col gap-12 md:gap-20">
            {PHASES.map((phase, i) => {
              const side = i % 2 === 0 ? "left" : "right";
              // Desktop: alternating 70% cards (snake routes between them).
              // Mobile: full-width cards with the line hugging their left side.
              const wrapClass = desktop
                ? `w-[70%] ${side === "right" ? "ml-auto" : "mr-auto"}`
                : "w-full";
              return (
                <div
                  key={phase.num}
                  className={`relative ${desktop ? "px-12" : "pl-9"}`}
                >
                  <div
                    ref={(el) => {
                      cardRefs.current[i] = el;
                    }}
                    className={wrapClass}
                  >
                    <PhaseCard phase={phase} side={desktop ? side : "left"} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
