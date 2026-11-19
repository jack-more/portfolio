"use client";

import { useEffect, useRef, useState } from "react";

// Nine ink portraits; the one facing the cursor is shown.
const DIRS = ["r", "dr", "d", "dl", "l", "ul", "u", "ur"]; // clockwise from 0deg (screen right)
const ALL = ["c", ...DIRS];

export default function GazePortrait({ className, alt }: { className?: string; alt: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [dir, setDir] = useState("c");

  useEffect(() => {
    const pick = (x: number, y: number) => {
      const el = ref.current;
      if (!el) return;
      const b = el.getBoundingClientRect();
      const dx = x - (b.left + b.width / 2);
      const dy = y - (b.top + b.height * 0.4);
      if (Math.hypot(dx, dy) < b.width * 0.35) return setDir("c");
      const a = (Math.atan2(dy, dx) * 180) / Math.PI; // 0 = right, 90 = down
      setDir(DIRS[Math.round(((a + 360) % 360) / 45) % 8]);
    };
    const onMove = (e: PointerEvent) => pick(e.clientX, e.clientY);
    const onLeave = () => setDir("c");
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div ref={ref} className={className} style={{ position: "relative", overflow: "hidden", background: "#fff" }}>
      {ALL.map((k) => (
        <img
          key={k}
          src={`/images/gaze/${k}.webp`}
          alt={k === "c" ? alt : ""}
          aria-hidden={k === "c" ? undefined : true}
          width={640}
          height={640}
          decoding="async"
          style={{
            position: k === "c" ? "relative" : "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            opacity: dir === k ? 1 : 0,
          }}
        />
      ))}
    </div>
  );
}
