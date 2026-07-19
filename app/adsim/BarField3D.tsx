"use client";

import { useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Html, OrbitControls, RoundedBox } from "@react-three/drei";
import * as THREE from "three";

/* Emphasis form: one accent hue for the searched entity, a recessive
   warm gray for context bars. Validated against surface #fcfcfb. */
const ACCENT = "#2a6f9e";
const CONTEXT = "#c9c3b4";
const ACCENT_HOVER = "#25628c";
const CONTEXT_HOVER = "#b9b2a0";

export interface BarDatum {
  id: string;
  label: string;
  value: number;
  display: string; // preformatted "$19.45"
  emphasized?: boolean;
}

const MAX_H = 3.1;
const TOTAL_W = 9.6; // the field's fixed footprint; slots divide it evenly

function Bar({
  datum,
  x,
  width,
  targetH,
  accented,
  labeled,
  hovered,
  setHovered,
}: {
  datum: BarDatum;
  x: number;
  width: number;
  targetH: number;
  accented: boolean; // wears the series hue (emphasized, or single-series view)
  labeled: boolean;
  hovered: boolean;
  setHovered: (id: string | null) => void;
}) {
  const group = useRef<THREE.Group>(null);
  const mat = useRef<THREE.MeshStandardMaterial>(null);
  const h = useRef(0.02);
  const color = useRef(new THREE.Color(accented ? ACCENT : CONTEXT));

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    // critically-damped approach to target height
    h.current = THREE.MathUtils.damp(h.current, targetH, 5.2, delta);
    g.scale.y = Math.max(0.02, h.current);
    g.position.y = g.scale.y / 2;
    if (mat.current) {
      const base = accented
        ? hovered ? ACCENT_HOVER : ACCENT
        : hovered ? CONTEXT_HOVER : CONTEXT;
      color.current.lerp(new THREE.Color(base), Math.min(1, delta * 8));
      mat.current.color.copy(color.current);
    }
  });

  return (
    <group position={[x, 0, 0]}>
      <group ref={group}>
        <RoundedBox
          args={[width, 1, width]}
          radius={Math.min(0.045, width * 0.14)}
          smoothness={3}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHovered(datum.id);
          }}
          onPointerOut={() => setHovered(null)}
        >
          <meshStandardMaterial ref={mat} roughness={0.82} metalness={0} />
        </RoundedBox>
      </group>
      {(labeled || hovered) && (
        <Html
          center
          position={[0, targetH + 0.42, 0]}
          style={{ pointerEvents: "none" }}
          zIndexRange={[10, 0]}
        >
          <div className={`bf-chip${datum.emphasized ? " bf-chip-em" : ""}`}>
            <span className="bf-chip-label">{datum.label}</span>
            <span className="bf-chip-value">{datum.display}</span>
          </div>
        </Html>
      )}
    </group>
  );
}

function Field({ data }: { data: BarDatum[] }) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const max = useMemo(
    () => Math.max(...data.map((d) => d.value), 0.0001),
    [data]
  );
  const slot = TOTAL_W / data.length;
  const barW = Math.min(0.8, slot * 0.62);
  const width = TOTAL_W - (slot - barW);
  const hasEmphasis = data.some((d) => d.emphasized);

  // Selective direct labels: the emphasized bar and the extreme.
  const labeledIds = useMemo(() => {
    const ids = new Set<string>();
    const em = data.find((d) => d.emphasized);
    const top = data.reduce((a, b) => (b.value > a.value ? b : a), data[0]);
    if (em) ids.add(em.id);
    if (top && (!em || top.id !== em.id)) ids.add(top.id);
    return ids;
  }, [data]);

  return (
    <group position={[0, -1.35, 0]}>
      {data.map((d, i) => (
        <Bar
          key={d.id}
          datum={d}
          x={-width / 2 + barW / 2 + i * slot}
          width={barW}
          accented={!!d.emphasized || !hasEmphasis}
          targetH={Math.max(0.06, (d.value / max) * MAX_H)}
          labeled={labeledIds.has(d.id) && hoveredId === null}
          hovered={hoveredId === d.id}
          setHovered={setHoveredId}
        />
      ))}
      {/* hairline baseline strip */}
      <mesh position={[0, -0.012, 0]}>
        <boxGeometry args={[width + 1.1, 0.02, barW + 0.6]} />
        <meshStandardMaterial color="#e7e4da" roughness={1} />
      </mesh>
      <ContactShadows
        position={[0, -0.02, 0]}
        opacity={0.22}
        scale={12}
        blur={3.2}
        far={3}
        resolution={512}
        color="#4a4f4a"
      />
    </group>
  );
}

/* Scale the whole field so its fixed footprint fits any canvas aspect. */
function FitScale({ children }: { children: React.ReactNode }) {
  const { viewport } = useThree();
  const s = Math.min(
    1,
    (viewport.width * 0.86) / (TOTAL_W + 1.2),
    (viewport.height * 0.8) / 5.4
  );
  return <group scale={s}>{children}</group>;
}

export default function BarField3D({ data }: { data: BarDatum[] }) {
  return (
    <Canvas
      camera={{ position: [0, 2.1, 8.6], fov: 34 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
    >
      <hemisphereLight args={["#ffffff", "#d8d5c9", 0.95]} />
      <directionalLight position={[4, 7, 5]} intensity={1.15} />
      <directionalLight position={[-6, 3, -4]} intensity={0.3} />
      <FitScale>
        <Field data={data} />
      </FitScale>
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.25}
        dampingFactor={0.08}
        target={[0, 0.15, 0]}
        maxPolarAngle={Math.PI * 0.55}
        minPolarAngle={Math.PI * 0.3}
      />
    </Canvas>
  );
}
