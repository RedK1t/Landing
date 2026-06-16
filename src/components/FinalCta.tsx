import { motion } from "framer-motion";
import { FaArrowRightLong } from "react-icons/fa6";
import { DASH_URL } from "../lib/config";

export function FinalCta() {
  return (
    <section className="px-5 py-24">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6 }}
        className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl border border-red/30 bg-surface p-10 text-center sm:p-16"
      >
        {/* Glow accents */}
        <div className="pointer-events-none absolute -left-20 -top-20 h-60 w-60 rounded-full bg-red/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-60 w-60 rounded-full bg-light-red/15 blur-3xl" />

        <h2 className="font-display relative text-4xl font-bold tracking-tight text-fg sm:text-5xl">
          Ready to start testing?
        </h2>
        <p className="relative mx-auto mt-4 max-w-xl text-fg-secondary">
          Spin up a target, run the full lifecycle, and export a report — all
          from your browser.
        </p>
        <a
          href={DASH_URL}
          className="group relative mt-8 inline-flex items-center gap-2 rounded-full bg-red px-7 py-3.5 font-semibold text-white shadow-[0_8px_30px_rgba(206,50,50,0.45)] transition-all hover:bg-light-red"
        >
          Launch Dashboard
          <FaArrowRightLong className="transition-transform group-hover:translate-x-1" />
        </a>
      </motion.div>
    </section>
  );
}
