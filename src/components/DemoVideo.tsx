import { useTheme } from "../context/ThemeContext";

// Per-theme demo sources.
const DEMO_SOURCES = {
  dark: { webm: "/demo/demo-dark.webm", mp4: "/demo/demo-dark.mp4" },
  light: { webm: "/demo/demo-light.webm", mp4: "/demo/demo-light.mp4" },
} as const;

/**
 * 16:9 demo frame showing the product walkthrough as a muted, looping,
 * controls-less background video that autoplays. Source follows the theme.
 */
export function DemoVideo() {
  const { resolvedTheme } = useTheme();
  const src = DEMO_SOURCES[resolvedTheme];

  return (
    <div id="demo" className="relative aspect-video w-full overflow-hidden rounded-2xl">
      <video
        // Remount on theme switch so the right source loads.
        key={resolvedTheme}
        // Guarantee muted (React doesn't reflect the muted attribute reliably)
        // so the browser allows autoplay.
        ref={(el) => {
          if (el) el.muted = true;
        }}
        className="absolute inset-0 h-full w-full bg-black object-cover"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src={src.webm} type="video/webm" />
        <source src={src.mp4} type="video/mp4" />
      </video>
    </div>
  );
}
