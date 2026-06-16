import { FaGithub } from "react-icons/fa6";
import { Logo } from "./Logo";
import { PAPER, PAPER_DOI_URL } from "../lib/config";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line px-5 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row">
        <div className="flex items-center gap-3">
          <Logo markClass="h-7 w-7" textClass="text-lg" />
          <span className="ml-1 font-mono text-xs text-fg-muted">
            Offensive Security Platform
          </span>
        </div>

        <div className="flex items-center gap-6 text-sm text-fg-muted">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 transition-colors hover:text-fg"
          >
            <FaGithub /> GitHub
          </a>
          <span>© {year} RedKit</span>
        </div>
      </div>

      <p className="mx-auto mt-6 max-w-6xl text-center font-mono text-[11px] text-fg-muted/60 sm:text-left">
        For authorized security testing and educational use only.
      </p>

      <p className="mx-auto mt-2 max-w-6xl text-center font-mono text-[11px] text-fg-muted/60 sm:text-left">
        Published in {PAPER.journal} {PAPER.volume} ({PAPER.number.replace(/\D/g, "")}) ·{" "}
        <a
          href={PAPER_DOI_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="underline-offset-2 transition-colors hover:text-fg hover:underline"
        >
          DOI {PAPER.doi}
        </a>
      </p>
    </footer>
  );
}
