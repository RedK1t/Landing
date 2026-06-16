/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Public URL of the RedKit dashboard (the `dash.` subdomain). Baked at build time. */
  readonly VITE_DASH_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
