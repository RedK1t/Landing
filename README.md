# RedKit — Landing Page

Animated, 3D, scroll-driven marketing landing page for RedKit, served at the
apex domain `{domain}.{tld}`. The dashboard (the `Front-End` app) lives
separately at `dash.{domain}.{tld}`.

Built with the `claude-design-skillstack` stack:

- **React 19 + Vite 7 + Tailwind v4** — base (mirrors `Front-End`).
- **GSAP + ScrollTrigger** — the lifecycle "winding path" draws itself on scroll.
- **@react-three/fiber + drei + three** — lazy-loaded hero 3D scene (rotating
  wireframe globe + animated attack-vector arcs). Split into its own chunk and
  only mounted on capable desktops.
- **framer-motion** — section/card reveals.
- **Lenis** — smooth scroll, wired into ScrollTrigger; auto-disabled under
  `prefers-reduced-motion`.

The page narrates the five pentest-lifecycle phases (Planning & Scoping →
Reconnaissance → AI Vulnerability Analysis → Exploitation → Reporting), each
tagged with the real RedKit tools behind it.

### Theming & fonts

- **Light + dark mode** with a `light / dark / system` toggle in the nav. Theme
  is a `.dark` class on `<html>`, stored under `redkit-theme` (same mechanism as
  the Front-End app), applied pre-paint by a tiny inline script to avoid flash.
  Colors are semantic tokens (`bg`, `surface`, `fg`, `fg-secondary`, `fg-muted`,
  `line`, `red`) defined in `src/index.css` and mirror the app's palette.
- **Headings/display text** use **Junicode** (variable serif), subset to Latin
  and self-hosted at `public/fonts/Junicode-Roman.woff2` (~104 KB). Body uses
  Quicksand; tool badges use JetBrains Mono.
- Brand logo: theme-swapped squared mark in `public/logo/` (source artwork kept
  in `Redkit/`, excluded from the Docker build).

## Configure

Vite bakes `VITE_*` values in at **build time**:

```bash
cp .env.example .env
# VITE_DASH_URL=https://dash.yourdomain.tld      # the dashboard link
# VITE_DEMO_VIDEO_URL=https://.../demo.mp4        # hero demo (blank = placeholder)
```

The hero demo frame shows a styled placeholder until `VITE_DEMO_VIDEO_URL` is
set (a direct `.mp4`/`.webm`, or a YouTube/Vimeo/embed URL — auto-detected).

## Develop

```bash
npm install
npm run dev        # local dev server
npm run build      # type-check + production build -> dist/
npm run preview    # preview the production build
```

## Docker

Built and served as the `landing` service in the root `docker-compose.yaml`:

```bash
docker compose build landing
docker compose up -d landing
```

In deployment, the (commented) `caddy` service serves this container at the apex
domain over HTTPS — see `../Caddyfile` and `../host.md`.

## Accessibility / performance

- Respects `prefers-reduced-motion`: 3D scene and scroll-hijack are disabled,
  the path renders fully drawn, and motion is reduced.
- The heavy three/R3F bundle is a lazy chunk; low-core/mobile devices get a
  static gradient hero instead.
- The demo video never autoplays — poster + click-to-play only.
