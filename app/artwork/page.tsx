"use client";

import Link from "next/link";
import { useRef, useState } from "react";

type Piece = {
  id: string;
  title: string;
  note: string;
  w: number; // inches
  h: number; // inches
  status: "Sold" | "Available";
  img: string;
};

const pieces: Piece[] = [
  { id: "breer", title: "Breer", note: "longing", w: 60, h: 40, status: "Sold", img: "/images/artwork/web/breer.jpg" },
  { id: "roma-ct", title: "Roma CT", note: "beautiful things happening", w: 36, h: 48, status: "Sold", img: "/images/artwork/web/roma-ct.jpg" },
  { id: "gdp-plus10", title: "GDP +10", note: "flags become paintings when nobody salutes", w: 36, h: 36, status: "Available", img: "/images/artwork/web/gdp-plus-10.jpg" },
  { id: "plane-post", title: "Plane Post", note: "posts from the plane. cloud floats free while we stay gridlocked", w: 36, h: 24, status: "Available", img: "/images/artwork/web/plane-post.jpg" },
  { id: "oceanic-plate", title: "Oceanic Plate", note: "brotherhood reveals itself in yellow pools", w: 36, h: 24, status: "Available", img: "/images/artwork/web/oceanic-plate.jpg" },
];

const REST = { x: 4, y: -16 };

function Canvas3D({ p, i }: { p: Piece; i: number }) {
  const [tilt, setTilt] = useState(REST);
  const [flipped, setFlipped] = useState(false);
  const [active, setActive] = useState(false);
  const stage = useRef<HTMLDivElement>(null);

  function onMove(e: React.PointerEvent) {
    const r = stage.current?.getBoundingClientRect();
    if (!r) return;
    const nx = (e.clientX - r.left) / r.width - 0.5;
    const ny = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ x: -ny * 22, y: nx * 38 });
    setActive(true);
  }

  const ry = tilt.y + (flipped ? 180 : 0);
  const style = {
    "--w": p.w,
    "--h": p.h,
    "--img": `url(${p.img})`,
    transform: `rotateX(${tilt.x}deg) rotateY(${ry}deg)`,
    transition: active ? "transform 0.12s ease-out" : "transform 0.7s cubic-bezier(.2,.8,.2,1)",
  } as React.CSSProperties;

  return (
    <figure className={`art3d ${p.status === "Sold" ? "is-sold" : ""}`} id={p.id}>
      <div
        className="art3d-stage"
        ref={stage}
        onPointerMove={onMove}
        onPointerLeave={() => { setActive(false); setTilt(REST); }}
        onClick={() => setFlipped((f) => !f)}
        role="button"
        tabIndex={0}
        aria-label={`${p.title}. Click to turn the canvas around.`}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setFlipped((f) => !f); } }}
      >
        <div className={`art3d-sway ${active || flipped ? "is-held" : ""}`} style={{ animationDelay: `${i * -1.7}s` }}>
        <div className="art3d-obj" style={style}>
          <div className="art3d-face art3d-front" />
          <div className="art3d-face art3d-back">
            <div className="art3d-label">
              <b>{p.title}</b>
              <span>{p.note}</span>
              <span>{p.w}&Prime; &times; {p.h}&Prime;</span>
              <span>Jack Morello</span>
            </div>
          </div>
          <div className="art3d-face art3d-right" />
          <div className="art3d-face art3d-left" />
          <div className="art3d-face art3d-top" />
          <div className="art3d-face art3d-bottom" />
        </div>
        </div>
        <div className="art3d-shadow" style={{ "--w": p.w } as React.CSSProperties} />
      </div>
      <figcaption className="art3d-cap">
        <span className="art3d-name">{p.title}</span>
        <span className="art3d-size">{p.w}&Prime; &times; {p.h}&Prime;</span>
        {p.status === "Available" ? (
          <a className="art3d-status art3d-available" href={`mailto:jaidanmorello@gmail.com?subject=${encodeURIComponent(p.title)}`}>Available &rarr;</a>
        ) : (
          <span className="art3d-status art3d-sold">Sold</span>
        )}
      </figcaption>
    </figure>
  );
}

export default function ArtworkPage() {
  return (
    <div className="artwork-page">
      <nav className="artwork-nav">
        <Link href="/" className="artwork-back">&larr; Back</Link>
        <span className="artwork-title">Artwork</span>
        <span className="artwork-hint">Move over a canvas to tilt it. Click to see the back.</span>
      </nav>

      <div className="art3d-wall">
        {pieces.map((p, i) => (
          <Canvas3D key={p.id} p={p} i={i} />
        ))}
      </div>

      <footer className="artwork-footer">
        <p>
          Shown at true scale to each other. Inquiries:{" "}
          <a href="mailto:jaidanmorello@gmail.com">jaidanmorello@gmail.com</a>
        </p>
      </footer>
    </div>
  );
}
