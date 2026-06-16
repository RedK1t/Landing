import type { IconType } from "react-icons";
import {
  FaBullseye,
  FaSitemap,
  FaRobot,
  FaTerminal,
  FaFileShield,
} from "react-icons/fa6";

export interface Phase {
  /** Two-digit ordinal shown as a large ghost number. */
  num: string;
  title: string;
  /** One-line value statement. */
  blurb: string;
  /** Real RedKit tools/capabilities for this phase (shown as mono badges). */
  badges: string[];
  icon: IconType;
}

/**
 * The five pentest-lifecycle phases narrated down the page. Tool badges are the
 * ACTUAL capabilities implemented in the RedKit services (WHOIS, Recon,
 * web-check, AI scanner/report, orchestrator + Kali, mitmproxy proxy).
 */
export const PHASES: Phase[] = [
  {
    num: "01",
    title: "Planning & Scoping",
    blurb: "Map the target before you touch it.",
    badges: ["WHOIS lookup", "DNS records", "Registrar & expiry"],
    icon: FaBullseye,
  },
  {
    num: "02",
    title: "Reconnaissance",
    blurb: "Enumerate the full attack surface.",
    badges: [
      "Subdomain enum (crt.sh + wordlists)",
      "web-check: SSL · headers · WAF",
      "Tech-stack & Wayback",
      "Port scan & fuzzing",
    ],
    icon: FaSitemap,
  },
  {
    num: "03",
    title: "AI Vulnerability Analysis",
    blurb: "Automated, LLM-confirmed findings in real time.",
    badges: [
      "Live WebSocket scanner",
      "SQLi & reflected XSS",
      "Cohere LLM confirmation + confidence",
    ],
    icon: FaRobot,
  },
  {
    num: "04",
    title: "Exploitation & Post-Exploitation",
    blurb: "Intercept, replay, and break in.",
    badges: [
      "mitmproxy interceptor & repeater",
      "Intruder: sniper · battering-ram · pitchfork · cluster-bomb",
      "Kali browser (noVNC desktop)",
      "Encoders/decoders & reverse-shell generator",
    ],
    icon: FaTerminal,
  },
  {
    num: "05",
    title: "Reporting & AI Assistant",
    blurb: "Turn findings into a deliverable.",
    badges: ["AI-generated reports", "PDF · DOCX · Markdown", "Scan history"],
    icon: FaFileShield,
  },
];
