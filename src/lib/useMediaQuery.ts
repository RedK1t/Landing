import { useEffect, useState } from "react";

/**
 * Reactive media-query hook. Used so the lifecycle card layout (JS) and the
 * connector line (JS) share ONE breakpoint and can never disagree the way a
 * CSS `md:` class and a measured width can.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window !== "undefined" && window.matchMedia
      ? window.matchMedia(query).matches
      : false,
  );

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const m = window.matchMedia(query);
    const onChange = () => setMatches(m.matches);
    onChange();
    m.addEventListener("change", onChange);
    return () => m.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}
