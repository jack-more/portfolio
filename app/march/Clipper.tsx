"use client";

import { useMemo, useRef, useState } from "react";
import styles from "./page.module.css";

/* ---- helpers ---- */

function parseYouTube(input: string): { id: string | null; start: number } {
  let id: string | null = null;
  let start = 0;
  try {
    const u = new URL(input.trim());
    if (u.hostname.includes("youtu.be")) {
      id = u.pathname.slice(1) || null;
    } else if (u.searchParams.get("v")) {
      id = u.searchParams.get("v");
    } else if (u.pathname.includes("/embed/")) {
      id = u.pathname.split("/embed/")[1]?.split("/")[0] || null;
    }
    const t = u.searchParams.get("t") || u.searchParams.get("start");
    if (t) start = parseTime(t);
  } catch {
    // not a URL — maybe a bare 11-char id
    if (/^[\w-]{11}$/.test(input.trim())) id = input.trim();
  }
  return { id, start };
}

// accepts "20:34", "1234", "1234s", "1:02:03"
function parseTime(v: string): number {
  const s = v.trim().replace(/s$/, "");
  if (s.includes(":")) {
    const parts = s.split(":").map((n) => parseInt(n, 10) || 0);
    return parts.reduce((acc, n) => acc * 60 + n, 0);
  }
  return parseInt(s, 10) || 0;
}

function fmt(sec: number): string {
  sec = Math.max(0, Math.round(sec));
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  const mm = h > 0 ? String(m).padStart(2, "0") : String(m);
  const ss = String(s).padStart(2, "0");
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

type Clip = { id: number; start: number; end: number; label: string };

const DEMO_URL = "https://www.youtube.com/watch?v=D5NW0I0Lw68&t=1234s";
const DEMO_ID = "D5NW0I0Lw68";

let uid = 1;

export default function Clipper() {
  const [mode, setMode] = useState<"youtube" | "raw">("youtube");

  /* ---- youtube state ---- */
  const [url, setUrl] = useState(DEMO_URL);
  const [videoId, setVideoId] = useState(DEMO_ID);
  const [startStr, setStartStr] = useState("20:34");
  const [endStr, setEndStr] = useState("21:19");
  const [clips, setClips] = useState<Clip[]>([
    { id: 0, start: 1234, end: 1279, label: "Milken — the opening line" },
  ]);
  const [activeId, setActiveId] = useState(0);
  const [copied, setCopied] = useState(false);

  const active = clips.find((c) => c.id === activeId) ?? clips[0];

  function loadUrl() {
    const { id, start } = parseYouTube(url);
    if (id) {
      setVideoId(id);
      if (start) {
        setStartStr(fmt(start));
        setEndStr(fmt(start + 45));
      }
    }
  }

  function addClip() {
    const start = parseTime(startStr);
    const end = parseTime(endStr);
    if (end <= start) return;
    const c: Clip = {
      id: uid++,
      start,
      end,
      label: `Clip ${clips.length + 1}`,
    };
    setClips((prev) => [...prev, c]);
    setActiveId(c.id);
  }

  function removeClip(id: number) {
    setClips((prev) => prev.filter((c) => c.id !== id));
  }

  const embedSrc = active
    ? `https://www.youtube-nocookie.com/embed/${videoId}?start=${active.start}&end=${active.end}&rel=0`
    : "";
  const snippet = active
    ? `<iframe width="560" height="315" src="${embedSrc}" frameborder="0" allowfullscreen></iframe>`
    : "";

  function copySnippet() {
    navigator.clipboard?.writeText(snippet).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  /* ---- raw file state ---- */
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [inPt, setInPt] = useState(0);
  const [outPt, setOutPt] = useState(0);

  function onFile(f: File | undefined) {
    if (!f) return;
    if (fileUrl) URL.revokeObjectURL(fileUrl);
    const objUrl = URL.createObjectURL(f);
    setFileUrl(objUrl);
    setFileName(f.name);
    setInPt(0);
    setOutPt(0);
  }

  function markIn() {
    if (videoRef.current) setInPt(videoRef.current.currentTime);
  }
  function markOut() {
    if (videoRef.current) setOutPt(videoRef.current.currentTime);
  }
  function previewRegion() {
    const v = videoRef.current;
    if (!v || outPt <= inPt) return;
    v.currentTime = inPt;
    v.play();
    const stop = () => {
      if (v.currentTime >= outPt) {
        v.pause();
        v.removeEventListener("timeupdate", stop);
      }
    };
    v.addEventListener("timeupdate", stop);
  }

  return (
    <div className={styles.clipper}>
      <div className={styles.clpTabs}>
        <button
          className={mode === "youtube" ? styles.clpTabActive : styles.clpTab}
          onClick={() => setMode("youtube")}
        >
          Video link
        </button>
        <button
          className={mode === "raw" ? styles.clpTabActive : styles.clpTab}
          onClick={() => setMode("raw")}
        >
          Raw file
        </button>
      </div>

      <div className={styles.clpPad}>
        {mode === "youtube" ? (
          <>
            <div className={styles.clpRow}>
              <div className={`${styles.clpField} ${styles.clpInputWide}`}>
                <span className={styles.clpLabel}>Paste a talk (YouTube URL)</span>
                <input
                  className={styles.clpInput}
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  spellCheck={false}
                />
              </div>
              <button className={styles.clpBtnGhost} onClick={loadUrl}>
                Load
              </button>
            </div>

            <div className={styles.clpRow}>
              <div className={styles.clpField}>
                <span className={styles.clpLabel}>In</span>
                <input
                  className={`${styles.clpInput} ${styles.clpTimeInput}`}
                  value={startStr}
                  onChange={(e) => setStartStr(e.target.value)}
                  placeholder="mm:ss"
                />
              </div>
              <div className={styles.clpField}>
                <span className={styles.clpLabel}>Out</span>
                <input
                  className={`${styles.clpInput} ${styles.clpTimeInput}`}
                  value={endStr}
                  onChange={(e) => setEndStr(e.target.value)}
                  placeholder="mm:ss"
                />
              </div>
              <button className={styles.clpBtn} onClick={addClip}>
                + Add clip
              </button>
            </div>

            {active && (
              <div className={styles.clpFrame}>
                <iframe
                  key={`${videoId}-${active.id}-${active.start}-${active.end}`}
                  src={embedSrc}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="Clip preview"
                />
              </div>
            )}

            {clips.length > 0 && (
              <div className={styles.clpList}>
                {clips.map((c) => (
                  <div
                    key={c.id}
                    className={c.id === activeId ? styles.clpItemActive : styles.clpItem}
                    onClick={() => setActiveId(c.id)}
                  >
                    <span className={styles.clpItemName}>{c.label}</span>
                    <span className={styles.clpItemTime}>
                      {fmt(c.start)} – {fmt(c.end)}
                    </span>
                    <span className={styles.clpItemDur}>{fmt(c.end - c.start)}</span>
                    <button
                      className={styles.clpDel}
                      onClick={(e) => {
                        e.stopPropagation();
                        removeClip(c.id);
                      }}
                      aria-label="Remove clip"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            {active && (
              <>
                <div className={styles.clpSnippet}>{snippet}</div>
                <button className={styles.clpBtnGhost} onClick={copySnippet}>
                  {copied ? "Copied ✓" : "Copy embed code"}
                </button>
              </>
            )}

            <p className={styles.clpNote}>
              Marks moments on any talk and turns each into a shareable, embeddable
              clip — reading the <b>t=</b> timestamp automatically. Compliant by
              design: it embeds the segment rather than ripping the file.
            </p>
          </>
        ) : (
          <>
            {!fileUrl ? (
              <div
                className={styles.clpDrop}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  onFile(e.dataTransfer.files?.[0]);
                }}
              >
                Drop an MP4 here, or click to choose a file. Everything stays in your
                browser — nothing is uploaded.
              </div>
            ) : (
              <>
                <p className={styles.clpMeta}>{fileName}</p>
                <div className={styles.clpFrame}>
                  <video ref={videoRef} className={styles.clpVideo} src={fileUrl} controls />
                </div>
                <div className={styles.clpRow}>
                  <button className={styles.clpBtnGhost} onClick={markIn}>
                    Set in = {fmt(inPt)}
                  </button>
                  <button className={styles.clpBtnGhost} onClick={markOut}>
                    Set out = {fmt(outPt)}
                  </button>
                  <button className={styles.clpBtn} onClick={previewRegion}>
                    ▶ Preview clip {outPt > inPt ? `(${fmt(outPt - inPt)})` : ""}
                  </button>
                  <button
                    className={styles.clpBtnGhost}
                    onClick={() => {
                      if (fileUrl) URL.revokeObjectURL(fileUrl);
                      setFileUrl(null);
                    }}
                  >
                    Clear
                  </button>
                </div>
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              hidden
              onChange={(e) => onFile(e.target.files?.[0])}
            />
            <p className={styles.clpNote}>
              Scrub, mark in/out, and preview the cut instantly — fully local. The
              next iteration adds <b>one-click MP4 export</b> in-browser via
              ffmpeg.wasm.
            </p>
          </>
        )}

        <div className={styles.clpRoadmap}>
          <span className={styles.clpChip}>Now · link + raw trim</span>
          <span className={styles.clpChip}>Next · ffmpeg.wasm export</span>
          <span className={styles.clpChip}>Roadmap · AI auto-highlights</span>
        </div>
      </div>
    </div>
  );
}
