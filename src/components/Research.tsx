import { motion } from "framer-motion";
import { FaBookOpen, FaArrowRightLong, FaArrowUpRightFromSquare } from "react-icons/fa6";
import { PAPER, PAPER_DOI_URL } from "../lib/config";

/**
 * "Published Research" — credits the peer-reviewed IJCA paper behind RedKit.
 * Card styling mirrors FinalCta (glow accents + red border) so the two closing
 * sections feel of a piece.
 */
export function Research() {
  return (
    <section id="research" className="px-5 py-24">
      <div className="mx-auto max-w-4xl">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.5 }}
          className="text-center font-mono text-sm uppercase tracking-widest text-red"
        >
          Published Research
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
          className="relative mt-6 overflow-hidden rounded-3xl border border-red/30 bg-surface p-8 sm:p-10"
        >
          {/* Glow accents */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-red/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-60 w-60 rounded-full bg-light-red/10 blur-3xl" />

          <div className="relative flex flex-col items-start gap-6 sm:flex-row">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red/12 text-xl text-light-red ring-1 ring-red/30">
              <FaBookOpen />
            </span>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <h2 className="font-display text-2xl font-bold tracking-tight text-fg sm:text-3xl">
                  {PAPER.title}
                </h2>
                <p className="font-mono text-xs text-fg-muted">
                  IJCA · {PAPER.volume} · {PAPER.number}
                </p>
                <p className="select-all font-mono text-xs text-fg-secondary">
                  DOI: {PAPER.doi}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={PAPER.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 rounded-full bg-red px-6 py-3 font-semibold text-white shadow-[0_8px_30px_rgba(206,50,50,0.45)] transition-all hover:bg-light-red"
                >
                  Read the paper
                  <FaArrowRightLong className="transition-transform group-hover:translate-x-1" />
                </a>
                <a
                  href={PAPER_DOI_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 font-semibold text-fg-secondary transition-colors hover:border-red/50 hover:text-fg"
                >
                  View DOI
                  <FaArrowUpRightFromSquare className="text-xs" />
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
