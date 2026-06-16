import { useEffect, useRef, useState, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const GAP = 16; // distance the line sits outside a card's edge
const R = 22; // corner radius

/** Build an SVG path through `points` with rounded corners of radius `r`. */
function roundedPath(points: number[][], r: number): string {
  if (points.length < 2) return "";
  const n = points.length;
  let d = `M ${points[0][0].toFixed(1)} ${points[0][1].toFixed(1)}`;
  for (let i = 1; i < n - 1; i++) {
    const [x0, y0] = points[i - 1];
    const [x1, y1] = points[i];
    const [x2, y2] = points[i + 1];
    const l1 = Math.hypot(x1 - x0, y1 - y0) || 1;
    const l2 = Math.hypot(x2 - x1, y2 - y1) || 1;
    const rr = Math.min(r, l1 / 2, l2 / 2);
    const sx = x1 + ((x0 - x1) / l1) * rr;
    const sy = y1 + ((y0 - y1) / l1) * rr;
    const ex = x1 + ((x2 - x1) / l2) * rr;
    const ey = y1 + ((y2 - y1) / l2) * rr;
    d += ` L ${sx.toFixed(1)} ${sy.toFixed(1)} Q ${x1.toFixed(1)} ${y1.toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}`;
  }
  const last = points[n - 1];
  d += ` L ${last[0].toFixed(1)} ${last[1].toFixed(1)}`;
  return d;
}

interface Props {
  trackRef: RefObject<HTMLDivElement | null>;
  cards: RefObject<(HTMLDivElement | null)[]>;
  reduced: boolean;
  /** Desktop = snake around alternating cards; mobile = vertical left line. */
  desktop: boolean;
}

/**
 * Connector line for the lifecycle. On desktop it snakes through the gutters
 * *around* the alternating cards; on mobile it's a single vertical line hugging
 * the left edge of the centered cards with a node per phase. Draws on scroll.
 * `desktop` is the SAME breakpoint the card layout uses, so they can't disagree.
 */
export function LifecycleConnector({
  trackRef,
  cards,
  reduced,
  desktop,
}: Props) {
  const pathRef = useRef<SVGPathElement>(null);
  const glowRef = useRef<SVGPathElement>(null);
  const nodeRefs = useRef<(SVGGElement | null)[]>([]);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [d, setD] = useState("");
  const [nodes, setNodes] = useState<{ x: number; y: number }[]>([]);

  // Measure card positions and build the rounded path.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const compute = () => {
      const tr = track.getBoundingClientRect();
      const W = tr.width;
      const H = tr.height;
      const rects = (cards.current ?? [])
        .map((el) => {
          if (!el) return null;
          const r = el.getBoundingClientRect();
          return {
            top: r.top - tr.top,
            bottom: r.bottom - tr.top,
            left: r.left - tr.left,
            right: r.right - tr.left,
          };
        })
        .filter((r): r is NonNullable<typeof r> => r !== null);

      if (rects.length < 2) return;
      const n = rects.length;

      setSize({ w: W, h: H });

      if (!desktop) {
        // Single vertical line hugging the left edge of the cards, with a node
        // at each phase. The line runs from the FIRST dot to the LAST dot only
        // (it doesn't extend past them).
        const minLeft = Math.min(...rects.map((r) => r.left));
        const railX = Math.max(7, minLeft - GAP);
        const centers = rects.map((r) => (r.top + r.bottom) / 2);
        const pts: number[][] = [
          [railX, centers[0]],
          [railX, centers[n - 1]],
        ];
        setD(roundedPath(pts, R));
        setNodes(centers.map((y) => ({ x: railX, y })));
        return;
      }

      // Desktop: snake through the gutters around alternating cards.
      // Outer-edge x for each card: left cards → left gutter, right cards → right gutter.
      const outerX = rects.map((r, i) =>
        i % 2 === 0
          ? Math.max(R, r.left - GAP)
          : Math.min(W - R, r.right + GAP),
      );

      // Nodes hug the card corners (no dangling tail past the dots).
      const startY = rects[0].top + 12; // top corner of card 1
      const endY = rects[n - 1].bottom - 12; // bottom corner of last card

      const pts: number[][] = [];
      pts.push([outerX[0], startY]); // start node
      for (let i = 1; i < n; i++) {
        const midY = (rects[i - 1].bottom + rects[i].top) / 2;
        pts.push([outerX[i - 1], midY]); // down into the gap, then turn
        pts.push([outerX[i], midY]); // across the gap (rounded elbow)
      }
      pts.push([outerX[n - 1], endY]); // end node

      setD(roundedPath(pts, R));
      setNodes([
        { x: pts[0][0], y: pts[0][1] },
        { x: pts[pts.length - 1][0], y: pts[pts.length - 1][1] },
      ]);
    };

    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(track);
    window.addEventListener("resize", compute);
    const settle = window.setTimeout(compute, 350); // after layout settles
    // Recompute once web fonts load (they change card heights → path geometry).
    if (document.fonts?.ready) document.fonts.ready.then(compute);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", compute);
      window.clearTimeout(settle);
    };
  }, [trackRef, cards, desktop]);

  // Draw-on-scroll: the line + glow draw in, and each node lights up as the
  // line reaches it.
  useEffect(() => {
    const path = pathRef.current;
    const glow = glowRef.current;
    if (!path || !d) return;
    const len = path.getTotalLength();
    const lines = [path, glow].filter(Boolean) as SVGPathElement[];
    lines.forEach((p) => gsap.set(p, { strokeDasharray: len }));

    // Fraction along the section at which each node should light up.
    const ys = nodes.map((n) => n.y);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const fracs = nodes.map((n) =>
      maxY > minY ? (n.y - minY) / (maxY - minY) : 0,
    );

    if (reduced) {
      lines.forEach((p) => gsap.set(p, { strokeDashoffset: 0 }));
      nodeRefs.current.forEach((g) => g && gsap.set(g, { opacity: 1 }));
      return;
    }

    lines.forEach((p) => gsap.set(p, { strokeDashoffset: len }));
    nodeRefs.current.forEach((g) => g && gsap.set(g, { opacity: 0.18 }));

    const ctx = gsap.context(() => {
      gsap.to(lines, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: trackRef.current,
          start: "top 80%",
          end: "bottom 85%",
          scrub: 1,
          onUpdate: (self) => {
            const p = self.progress;
            nodeRefs.current.forEach((g, i) => {
              if (g) gsap.set(g, { opacity: p >= fracs[i] - 0.02 ? 1 : 0.18 });
            });
          },
        },
      });
    });
    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [d, reduced, trackRef, nodes]);

  if (!size.w) return null;

  return (
    <svg
      className="pointer-events-none absolute inset-0 block text-fg"
      width={size.w}
      height={size.h}
      viewBox={`0 0 ${size.w} ${size.h}`}
      fill="none"
      aria-hidden
    >
      <defs>
        <linearGradient id="lcGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FF5050" />
          <stop offset="100%" stopColor="#CE3232" />
        </linearGradient>
      </defs>

      {/* Wide glow — draws in with the line (cheap stroke, no per-frame filter) */}
      <path
        ref={glowRef}
        d={d}
        stroke="#CE3232"
        strokeOpacity={0.18}
        strokeWidth={8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Main line — draws in on scroll */}
      <path
        ref={pathRef}
        d={d}
        stroke="url(#lcGrad)"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Nodes — light up as the line reaches them */}
      {nodes.map((n, i) => (
        <g
          key={i}
          ref={(el) => {
            nodeRefs.current[i] = el;
          }}
        >
          <circle cx={n.x} cy={n.y} r={11} fill="#CE3232" fillOpacity={0.18} />
          <circle cx={n.x} cy={n.y} r={5} fill="#FF5050" />
        </g>
      ))}
    </svg>
  );
}
