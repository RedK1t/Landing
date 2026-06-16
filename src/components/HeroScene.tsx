import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/** Slowly rotating low-poly wireframe globe — the "target surface". */
function Globe({ light }: { light: boolean }) {
  const group = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.12;
  });

  return (
    <group ref={group}>
      {/* Wireframe shell */}
      <mesh>
        <icosahedronGeometry args={[2, 4]} />
        <meshBasicMaterial
          color="#CE3232"
          wireframe
          transparent
          opacity={light ? 0.4 : 0.28}
        />
      </mesh>
      {/* Inner solid core for depth — light tint on light bg, near-black on dark. */}
      <mesh scale={0.985}>
        <icosahedronGeometry args={[2, 4]} />
        <meshStandardMaterial
          color={light ? "#f0dcdc" : "#1a0606"}
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>
    </group>
  );
}

/** Faint drifting point cloud around the globe. */
function Particles({ count = 320 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 3 + Math.random() * 3.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [count]);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y -= delta * 0.04;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color="#FF5050"
        transparent
        opacity={0.7}
        sizeAttenuation
      />
    </points>
  );
}

/** A single glowing arc that animates a "probe" travelling its length. */
function AttackArc({
  start,
  end,
  speed,
  offset,
}: {
  start: THREE.Vector3;
  end: THREE.Vector3;
  speed: number;
  offset: number;
}) {
  const dot = useRef<THREE.Mesh>(null);

  const curve = useMemo(() => {
    const mid = start.clone().add(end).multiplyScalar(0.5);
    mid.normalize().multiplyScalar(3.4); // bow the arc outward
    return new THREE.QuadraticBezierCurve3(start, mid, end);
  }, [start, end]);

  const geometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(curve.getPoints(48));
  }, [curve]);

  useFrame((state) => {
    if (!dot.current) return;
    const t = (state.clock.elapsedTime * speed + offset) % 1;
    const p = curve.getPoint(t);
    dot.current.position.copy(p);
  });

  return (
    <group>
      <primitive
        object={
          new THREE.Line(
            geometry,
            new THREE.LineBasicMaterial({
              color: "#FF5050",
              transparent: true,
              opacity: 0.35,
            }),
          )
        }
      />
      <mesh ref={dot}>
        <sphereGeometry args={[0.05, 12, 12]} />
        <meshBasicMaterial color="#FF5050" />
      </mesh>
    </group>
  );
}

function Arcs() {
  const arcs = useMemo(() => {
    const onSphere = () => {
      const v = new THREE.Vector3(
        Math.random() * 2 - 1,
        Math.random() * 2 - 1,
        Math.random() * 2 - 1,
      );
      return v.normalize().multiplyScalar(2);
    };
    return Array.from({ length: 6 }, (_, i) => ({
      start: onSphere(),
      end: onSphere(),
      speed: 0.18 + Math.random() * 0.22,
      offset: i / 6,
    }));
  }, []);

  return (
    <>
      {arcs.map((a, i) => (
        <AttackArc key={i} {...a} />
      ))}
    </>
  );
}

/** Default export so it can be React.lazy()-imported as a separate chunk. */
export default function HeroScene({ light = false }: { light?: boolean }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  // Pause the render loop while the hero is scrolled off-screen so it doesn't
  // burn GPU/CPU (and cause scroll jank, esp. in Firefox) on lower sections.
  const [active, setActive] = useState(true);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { rootMargin: "100px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className="h-full w-full">
      <Canvas
        frameloop={active ? "always" : "never"}
        camera={{ position: [0, 0, 6.5], fov: 50 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true }}
        style={{ pointerEvents: "none" }}
      >
        <ambientLight intensity={light ? 0.9 : 0.6} />
        <pointLight position={[5, 5, 5]} intensity={1.2} color="#FF5050" />
        <pointLight position={[-6, -3, -4]} intensity={0.6} color="#3B82F6" />
        <Globe light={light} />
        <Particles />
        <Arcs />
      </Canvas>
    </div>
  );
}
