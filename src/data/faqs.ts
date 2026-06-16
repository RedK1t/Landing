export interface Faq {
  q: string;
  a: string;
}

/**
 * Landing-page FAQ. Answers describe the actual RedKit product (containerized,
 * browser-based, AI-assisted scanning + reporting). Edit freely.
 */
export const FAQS: Faq[] = [
  {
    q: "What is RedKit?",
    a: "RedKit is a lightweight, browser-based penetration-testing framework. Each engagement runs in isolated Docker containers and covers the full lifecycle — from reconnaissance and scanning to exploitation and reporting.",
  },
  {
    q: "Do I need to install anything?",
    a: "No. RedKit runs entirely in your browser. The toolchain — recon, the AI vulnerability scanner, the mitmproxy interceptor, and a full Kali browser — is containerized server-side, so there's nothing to set up locally.",
  },
  {
    q: "Is it safe and legal to use?",
    a: "RedKit is intended for authorized security testing and educational use only. Always test systems you own or have explicit, written permission to assess.",
  },
  {
    q: "What kinds of vulnerabilities can it find?",
    a: "The live AI-assisted scanner flags issues such as SQL injection and reflected XSS, then uses an LLM to confirm findings and attach a confidence score — cutting down on false positives.",
  },
  {
    q: "Can I export reports?",
    a: "Yes. RedKit generates AI-written reports from your findings and exports them to PDF, DOCX, and Markdown.",
  },
  {
    q: "Is RedKit based on published research?",
    a: "Yes — RedKit is documented in a peer-reviewed paper in the International Journal of Computer Applications (Volume 187, Number 106). See the Published Research section above for the paper and DOI.",
  },
];
