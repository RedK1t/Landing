import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useReducedMotion } from "../lib/useReducedMotion";

/**
 * Motion-powered custom cursor: a precise dot that tracks the pointer exactly,
 * plus a springy ring that lags slightly and reacts to interactive elements
 * (links, buttons, anything marked data-cursor="hover") by growing, and shrinks
 * on press. Only active on fine-pointer (mouse) devices and disabled under
 * reduced-motion, so touch users keep the native cursor.
 */
export function CustomCursor() {
  const reduced = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [pressed, setPressed] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 350, damping: 28, mass: 0.5 });
  const ringY = useSpring(y, { stiffness: 350, damping: 28, mass: 0.5 });

  useEffect(() => {
    if (reduced) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    setEnabled(true);
    document.documentElement.classList.add("cursor-none");

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const t = e.target as Element | null;
      setHovering(
        !!t?.closest(
          'a, button, [role="button"], input, select, textarea, [data-cursor="hover"]',
        ),
      );
    };
    const down = () => setPressed(true);
    const up = () => setPressed(false);
    const leave = () => {
      x.set(-100);
      y.set(-100);
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    document.addEventListener("mouseleave", leave);

    return () => {
      document.documentElement.classList.remove("cursor-none");
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
      document.removeEventListener("mouseleave", leave);
    };
  }, [reduced, x, y]);

  if (!enabled) return null;

  const ringScale = pressed ? 0.7 : hovering ? 1.9 : 1;

  return (
    <>
      {/* Precise dot (no lag) */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[100] -ml-[3px] -mt-[3px] h-1.5 w-1.5 rounded-full bg-red"
        style={{ x, y }}
      />
      {/* Springy ring that reacts to hovers */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[100] -ml-4 -mt-4 h-8 w-8 rounded-full border border-red"
        style={{ x: ringX, y: ringY }}
        animate={{
          scale: ringScale,
          opacity: hovering ? 1 : 0.55,
          backgroundColor: hovering
            ? "rgba(206,50,50,0.12)"
            : "rgba(206,50,50,0)",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      />
    </>
  );
}
