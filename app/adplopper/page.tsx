"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./page.module.css";

/* Ad frame renders straight to canvas at export resolution, so what you
   see is exactly what downloads. 1080x1920, 9:16. */

const W = 1080;
const H = 1920;
const NAVY = "#17255A";

type Pills = [string, string, string];

export default function AdPlopper() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [photo, setPhoto] = useState<HTMLImageElement | null>(null);
  const [logo, setLogo] = useState<HTMLImageElement | null>(null);
  const [dragging, setDragging] = useState(false);

  const [headline, setHeadline] = useState("For people who read the label.");
  const [pills, setPills] = useState<Pills>([
    "Beverly Hills",
    "Shipped in 24 hours",
    "Research use only",
  ]);
  const [tag, setTag] = useState("Research\nwith SKO");
  const [legal, setLegal] = useState(
    "For laboratory research use only. Not for human consumption."
  );

  /* preload the logo once */
  useEffect(() => {
    const img = new Image();
    img.onload = () => setLogo(img);
    img.src = "/sko-logo.png";
  }, []);

  const loadFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      setPhoto(img);
      URL.revokeObjectURL(url);
    };
    img.src = url;
  }, []);

  /* ---------- drawing ---------- */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, W, H);

    // photo, cover-fit
    if (photo) {
      const scale = Math.max(W / photo.width, H / photo.height);
      const w = photo.width * scale;
      const h = photo.height * scale;
      ctx.drawImage(photo, (W - w) / 2, (H - h) / 2, w, h);
    } else {
      const g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, "#cbb9a4");
      g.addColorStop(0.4, "#d8cec2");
      g.addColorStop(0.65, "#e6ded3");
      g.addColorStop(1, "#cbb1a6");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    }

    // scrims for legibility
    const top = ctx.createLinearGradient(0, 0, 0, H * 0.34);
    top.addColorStop(0, "rgba(20,18,16,.42)");
    top.addColorStop(1, "rgba(20,18,16,0)");
    ctx.fillStyle = top;
    ctx.fillRect(0, 0, W, H * 0.34);

    const bot = ctx.createLinearGradient(0, H, 0, H * 0.6);
    bot.addColorStop(0, "rgba(20,18,16,.55)");
    bot.addColorStop(1, "rgba(20,18,16,0)");
    ctx.fillStyle = bot;
    ctx.fillRect(0, H * 0.6, W, H * 0.4);

    const padX = W * 0.065;

    // headline
    ctx.fillStyle = "#fff";
    ctx.textBaseline = "top";
    ctx.font = `600 68px "Avenir Next", "Helvetica Neue", Arial, sans-serif`;
    ctx.shadowColor = "rgba(0,0,0,.3)";
    ctx.shadowBlur = 24;
    const lines = wrap(ctx, headline, W * 0.62);
    lines.forEach((line, i) => {
      ctx.fillText(line, padX, H * 0.075 + i * 80);
    });
    ctx.shadowBlur = 0;

    // pills
    ctx.font = `700 22px "Avenir Next", "Helvetica Neue", Arial, sans-serif`;
    let px = padX;
    const pillY = H - 300;
    pills.filter(Boolean).forEach((label) => {
      const text = label.toUpperCase();
      const tw = ctx.measureText(text).width + 8 * (text.length - 1) * 0.08;
      const pw = tw + 44;
      roundRect(ctx, px, pillY, pw, 46, 23);
      ctx.fillStyle = "rgba(255,255,255,.93)";
      ctx.fill();
      ctx.fillStyle = NAVY;
      ctx.fillText(text, px + 22, pillY + 14);
      px += pw + 10;
    });

    // legal
    ctx.font = `400 19px "Avenir Next", "Helvetica Neue", Arial, sans-serif`;
    ctx.fillStyle = "rgba(255,255,255,.8)";
    wrap(ctx, legal, W * 0.42).forEach((line, i) => {
      ctx.fillText(line, padX, H - 200 + i * 26);
    });

    // logo chip, bottom right
    if (logo) {
      const tagLines = tag.split("\n");
      ctx.font = `700 24px "Avenir Next", "Helvetica Neue", Arial, sans-serif`;
      const tagW = Math.max(...tagLines.map((l) => ctx.measureText(l).width));
      const logoH = 72;
      const logoW = (logo.width / logo.height) * logoH;
      const chipH = 96;
      const chipW = logoW + tagW + 46;
      const chipX = W - padX - chipW;
      const chipY = H - 200;

      roundRect(ctx, chipX, chipY, chipW, chipH, chipH / 2);
      ctx.fillStyle = "rgba(255,255,255,.93)";
      ctx.fill();

      ctx.drawImage(logo, chipX + 12, chipY + (chipH - logoH) / 2, logoW, logoH);

      ctx.fillStyle = NAVY;
      const startY = chipY + chipH / 2 - (tagLines.length * 28) / 2;
      tagLines.forEach((line, i) => {
        ctx.fillText(line, chipX + logoW + 22, startY + i * 28);
      });
    }
  }, [photo, logo, headline, pills, tag, legal]);

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.download = `sko-ad-${headline.slice(0, 20).replace(/\W+/g, "-").toLowerCase()}.png`;
    a.href = canvas.toDataURL("image/png");
    a.click();
  };

  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.head}>
          <h1>Ad Plopper</h1>
          <p>Drop a photo, edit the copy, download at 1080×1920. Nothing leaves your browser.</p>
        </header>

        <div className={styles.layout}>
          <div
            className={`${styles.frame} ${dragging ? styles.frameDrag : ""}`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              const f = e.dataTransfer.files?.[0];
              if (f) loadFile(f);
            }}
          >
            <canvas ref={canvasRef} width={W} height={H} className={styles.canvas} />
            {!photo && <div className={styles.hint}>Drop a photo here</div>}
          </div>

          <div className={styles.controls}>
            <label className={styles.field}>
              <span>Photo</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) loadFile(f);
                }}
              />
            </label>

            <label className={styles.field}>
              <span>Headline</span>
              <textarea
                rows={2}
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
              />
            </label>

            <div className={styles.field}>
              <span>Pills</span>
              {pills.map((p, i) => (
                <input
                  key={i}
                  value={p}
                  placeholder={`Pill ${i + 1}`}
                  onChange={(e) => {
                    const next = [...pills] as Pills;
                    next[i] = e.target.value;
                    setPills(next);
                  }}
                />
              ))}
            </div>

            <label className={styles.field}>
              <span>Logo tag</span>
              <textarea rows={2} value={tag} onChange={(e) => setTag(e.target.value)} />
            </label>

            <label className={styles.field}>
              <span>Legal line</span>
              <textarea rows={2} value={legal} onChange={(e) => setLegal(e.target.value)} />
            </label>

            <button className={styles.download} onClick={download} disabled={!photo}>
              Download PNG
            </button>

            <p className={styles.note}>
              Preset headlines — click to use:
            </p>
            <div className={styles.presets}>
              {[
                "For people who read the label.",
                "Research with SKO",
                "Most suppliers won't show you this.",
                "Read the certificate. Then decide.",
                "Nothing here is unverified.",
                "We'll show you the paperwork.",
                "Know what's in it.",
                "Every batch, on paper.",
                "Ask what's in it.",
                "No guessing.",
              ].map((h) => (
                <button key={h} onClick={() => setHeadline(h)}>
                  {h}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- helpers ---------- */

function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
