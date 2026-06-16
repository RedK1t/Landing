/**
 * Build-time public config. Vite bakes VITE_* values into the bundle, so these
 * are fixed at `npm run build` time — set them in `.env` before building.
 */

/** The dashboard (Front-End app) — the `dash.` subdomain in production. */
export const DASH_URL = import.meta.env.VITE_DASH_URL ?? "https://dash.example.com";

/** The published RedKit paper — single source of truth for the citation. */
export const PAPER = {
  title:
    "RedKit: A Lightweight Penetration Testing Framework using Docker-based Isolation",
  journal: "International Journal of Computer Applications",
  volume: "Volume 187",
  number: "Number 106",
  doi: "10.5120/ijca077168be4e15",
  url: "https://www.ijcaonline.org/archives/volume187/number106/redkit-a-lightweight-penetration-testing-framework-using-docker-based-isolation/",
} as const;

/** Resolvable DOI link for the paper. */
export const PAPER_DOI_URL = `https://doi.org/${PAPER.doi}`;
