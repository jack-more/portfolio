'use client';

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const B = "https://ballast.la/work/health";

type Tile =
  | { kind: "ad"; file: string; label: string }
  | { kind: "still"; file: string; label: string }
  | { kind: "yt"; id: string; label: string; title: string; wide?: boolean; thumb: string; poster?: string };

const SKO = "SKO Compounds";
const UGC = "SKO · creator";
const ad = (file: string, label = SKO): Tile => ({ kind: "ad", file, label });
const still = (file: string, label = SKO): Tile => ({ kind: "still", file, label });
const yt = (id: string, label: string, title: string, thumb: string, wide = false, poster?: string): Tile => ({ kind: "yt", id, label, title, thumb, wide, poster });

// Every tile is 9:16; wide spots crop to the tile and play at full size when tapped.
const wall: Tile[] = [
  yt("JSpUNWjQk6c", "STARZPLAY", "the Raising Kanan promo", "oar2"), ad("sko-founder-1"), ad("ugc-hanna-1", UGC), yt("jtJ_DbPYnrU", "Starbucks", "the Starbucks holiday 2021 spot", "mqdefault", true),
  yt("Y_IuBEtfzGM", "Toyota", "the Toyota 4Runner Warm Up spot", "", true, "toyota-4runner"), yt("y3ZCJLz1m-s", "Starbucks", "the Starbucks Together Again spot", "mqdefault", true), still("epeps-corona", "ePeps"), ad("sko-ai-spot"),
  yt("HsZkjGvj8e8", "STARZPLAY", "the BMF promo", "oar2"), ad("ugc-dennis-1", UGC), still("sko-alpine"), yt("YwdFISPk86E", "Toyota", "the Toyota Imagine spot", "", true, "toyota-imagine"),
  ad("sko-frutiger-1"), ad("sko-founder-2"), ad("ugc-ethan-1", UGC), ad("sko-dna"),
  yt("-yjEoZtTExw", "STARZPLAY", "the Heels trailer", "maxresdefault", true), ad("ugc-hanna-2", UGC), yt("LzvrQ0vAF0w", "STARZPLAY", "the Raising Kanan promo", "oar2"), yt("GHA2DH2kEb0", "Toyota", "the Toyota Tacoma Magic Hour spot", "", true, "toyota-tacoma"),
  ad("sko-tennis"), ad("sko-frutiger-2"), ad("ugc-dennis-2", UGC), ad("sko-bubbles"),
  ad("sko-laborday-1"), ad("sko-truck"), yt("WotAnYua7-k", "Toyota", "the Toyota Helping Hands spot", "", true, "toyota-helping"), ad("sko-box2"),
  ad("sko-frutiger-3"), ad("sko-freevial"),
];

function AdVideo({ file }: { file: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        if (!v.src) v.src = `${B}/ads/${file}.mp4`;
        v.play().catch(() => {});
      } else v.pause();
    }, { rootMargin: "200px 0px" });
    io.observe(v);
    return () => io.disconnect();
  }, [file]);
  return <video ref={ref} poster={`${B}/ads/${file}.webp`} muted loop playsInline preload="none" />;
}

function TileView({ t, onPlay }: { t: Tile; onPlay: (id: string, wide: boolean, title: string) => void }) {
  return (
    <figure className={`wall-tile${t.kind === "yt" ? " wall-tile--yt" : ""}`}>
      {t.kind === "ad" && <AdVideo file={t.file} />}
      {t.kind === "still" && <img src={`${B}/${t.file}.webp`} alt="" loading="lazy" />}
      {t.kind === "yt" && (
        <button type="button" aria-label={`Play ${t.title}`} onClick={() => onPlay(t.id, !!t.wide, t.title)}>
          <img src={t.poster ? `https://ballast.la/work/brands/${t.poster}.webp` : `https://i.ytimg.com/vi/${t.id}/${t.thumb}.jpg`} alt="" loading="lazy" />
          <span className="wall-play" />
        </button>
      )}
      <figcaption>{t.label}</figcaption>
    </figure>
  );
}

export default function WorkPage() {
  const [playing, setPlaying] = useState<{ id: string; wide: boolean; title: string } | null>(null);
  const dlg = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (playing) dlg.current?.showModal();
    else dlg.current?.close();
  }, [playing]);
  const play = (id: string, wide: boolean, title: string) => setPlaying({ id, wide, title });

  return (
    <div className="artwork-page wall-page">
      <nav className="artwork-nav wall-nav">
        <Link href="/" className="artwork-back">&larr; Back</Link>
        <span className="artwork-title">Work</span>
      </nav>
      <p className="wall-intro">
        Ads and creative I&apos;ve run for SKO Compounds, ePeps, STARZPLAY, Starbucks and Toyota.
        More at <a href="https://ballast.la" target="_blank" rel="noopener noreferrer">ballast.la</a>.
      </p>

      <div className="wall">
        {wall.map((t, i) => <TileView key={i} t={t} onPlay={play} />)}
      </div>
      <p className="wall-cap">STARZPLAY, Starbucks and Toyota spots are the brands&apos; own creative; I ran the media. Tap to play.</p>

      <dialog
        ref={dlg}
        className="wall-lb"
        onClose={() => setPlaying(null)}
        onClick={(e) => { if (e.target === dlg.current) setPlaying(null); }}
      >
        {playing && (
          <div className={`wall-lb-f${playing.wide ? " wall-lb-f--wide" : ""}`}>
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${playing.id}?autoplay=1&playsinline=1&rel=0`}
              title={playing.title}
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}
        <button type="button" className="wall-lb-x" aria-label="Close" onClick={() => setPlaying(null)}>&times;</button>
      </dialog>
    </div>
  );
}
