"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";

/* ================= helpers ================= */

function parseYouTube(input: string): { id: string | null; start: number } {
  let id: string | null = null;
  let start = 0;
  try {
    const u = new URL(input.trim());
    if (u.hostname.includes("youtu.be")) id = u.pathname.slice(1) || null;
    else if (u.searchParams.get("v")) id = u.searchParams.get("v");
    else if (u.pathname.includes("/embed/"))
      id = u.pathname.split("/embed/")[1]?.split("/")[0] || null;
    const t = u.searchParams.get("t") || u.searchParams.get("start");
    if (t) start = parseTime(t);
  } catch {
    if (/^[\w-]{11}$/.test(input.trim())) id = input.trim();
  }
  return { id, start };
}

function parseTime(v: string): number {
  const s = v.trim().replace(/s$/, "");
  if (s.includes(":"))
    return s.split(":").map((n) => parseInt(n, 10) || 0).reduce((a, n) => a * 60 + n, 0);
  return parseInt(s, 10) || 0;
}

function fmt(sec: number): string {
  sec = Math.max(0, Math.round(sec));
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

type Clip = { id: number; start: number; end: number; label: string };

const DEMO_URL = "https://www.youtube.com/watch?v=D5NW0I0Lw68&t=1234s";
const DEMO_ID = "D5NW0I0Lw68";
const SAMPLE = "/march-sample.mp4";

let uid = 1;

export default function Clipper() {
  const [mode, setMode] = useState<"youtube" | "raw">("youtube");

  /* ---------- youtube tab ---------- */
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
    const c: Clip = { id: uid++, start, end, label: `Clip ${clips.length + 1}` };
    setClips((p) => [...p, c]);
    setActiveId(c.id);
  }
  const embedSrc = active
    ? `https://www.youtube-nocookie.com/embed/${videoId}?start=${active.start}&end=${active.end}&autoplay=1&mute=1&playsinline=1&rel=0`
    : "";
  function copyLink() {
    if (!videoId || !active) return;
    // A watch link, not the embed src — embed URLs open as a bare
    // youtube-nocookie player page and aren't shareable.
    const shareUrl = `https://youtu.be/${videoId}?t=${active.start}`;
    navigator.clipboard?.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  /* ---------- raw / captioned-clip tab ---------- */
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const loopRef = useRef<number | null>(null);
  const recRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const recordingRef = useRef(false);
  // lazily-loaded in-browser encoder (only fetched on first MP4 export)
  const ffmpegRef = useRef<unknown>(null);
  const ffmpegLoadRef = useRef<Promise<unknown> | null>(null);
  // lazily-loaded in-browser speech-to-text (Whisper via transformers.js)
  const asrRef = useRef<((a: Float32Array, o: unknown) => Promise<{ text?: string; chunks?: { text?: string; timestamp?: [number, number | null] }[] }>) | null>(null);
  const asrLoadRef = useRef<Promise<unknown> | null>(null);

  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [duration, setDuration] = useState(0);
  const [start, setStart] = useState(0);
  const [len, setLen] = useState(8);
  const [caption, setCaption] = useState(
    "This is the moment your whole feed stops scrolling"
  );
  const [timed, setTimed] = useState<{ w: string; s: number; e: number }[]>([]);
  const [transcribing, setTranscribing] = useState(false);
  const [status, setStatus] = useState("");
  const [exporting, setExporting] = useState(false);

  // keep latest values available inside the render loop
  const st = useRef({ start, len, caption, timed });
  st.current = { start, len, caption, timed };

  function onFile(f: File | undefined) {
    if (!f) return;
    if (fileUrl) URL.revokeObjectURL(fileUrl);
    setFileUrl(URL.createObjectURL(f));
    setFileName(f.name);
    setStart(0);
    setStatus("");
  }
  function loadSample() {
    if (fileUrl) URL.revokeObjectURL(fileUrl);
    setFileUrl(SAMPLE);
    setFileName("march-sample.mp4 (demo)");
    setStart(0);
    setStatus("");
  }

  // size the canvas to the video once metadata is known, start the draw loop
  function onMeta() {
    const v = videoRef.current,
      c = canvasRef.current;
    if (!v || !c) return;
    setDuration(v.duration || 0);
    // fixed 9:16 vertical output
    c.width = 720;
    c.height = 1280;
    if (loopRef.current == null) loopRef.current = window.setInterval(tick, 33);
    // auto-loop the clip window (muted) so the captioned preview plays on its own
    v.muted = true;
    v.currentTime = start;
    v.play().catch(() => {});
  }

  function seekPreview(s: number) {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.currentTime = Math.min(s, Math.max(0, (v.duration || 0) - st.current.len));
    if (v.paused && !recordingRef.current) v.play().catch(() => {});
  }

  function drawCaption(
    ctx: CanvasRenderingContext2D,
    W: number,
    H: number,
    words: string[],
    activeIdx: number
  ) {
    if (!words.length) return;
    const fs = Math.round(W * 0.06);
    ctx.font = `900 ${fs}px "Arial Black", Impact, system-ui, sans-serif`;
    ctx.textBaseline = "alphabetic";
    const maxW = W * 0.86;
    const spaceW = ctx.measureText(" ").width;
    type W2 = { w: string; i: number; ww: number };
    const lines: W2[][] = [];
    let cur: W2[] = [];
    let curW = 0;
    words.forEach((w, i) => {
      const ww = ctx.measureText(w).width;
      if (cur.length && curW + spaceW + ww > maxW) {
        lines.push(cur);
        cur = [];
        curW = 0;
      }
      cur.push({ w, i, ww });
      curW += (cur.length > 1 ? spaceW : 0) + ww;
    });
    if (cur.length) lines.push(cur);

    const lineH = fs * 1.2;
    let y = H * 0.9 - lines.length * lineH + lineH;
    ctx.lineJoin = "round";
    ctx.lineWidth = Math.max(3, fs * 0.16);
    for (const line of lines) {
      const lineW =
        line.reduce((a, o) => a + o.ww, 0) + spaceW * (line.length - 1);
      let x = (W - lineW) / 2;
      for (const o of line) {
        if (o.i <= activeIdx) {
          ctx.strokeStyle = "rgba(0,0,0,0.92)";
          ctx.strokeText(o.w, x, y);
          ctx.fillStyle = o.i === activeIdx ? "#7CFF7C" : "#ffffff";
          ctx.fillText(o.w, x, y);
        }
        x += o.ww + spaceW;
      }
      y += lineH;
    }
  }

  function tick() {
    const v = videoRef.current,
      c = canvasRef.current;
    if (v && c) {
      const ctx = c.getContext("2d");
      if (ctx) {
        // center-crop the source to cover the 9:16 frame
        const cw = c.width,
          ch = c.height;
        const vw = v.videoWidth || cw,
          vh = v.videoHeight || ch;
        const sc = Math.max(cw / vw, ch / vh);
        const dw = vw * sc,
          dh = vh * sc;
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, cw, ch);
        ctx.drawImage(v, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
        const { start: s, len: l, caption: cap, timed: tw } = st.current;
        const off = v.currentTime - s;
        let words: string[];
        let activeIdx: number;
        if (tw && tw.length) {
          // synced to Whisper word timestamps
          words = tw.map((t) => t.w);
          activeIdx = 0;
          for (let i = 0; i < tw.length; i++) if (tw[i].s <= off) activeIdx = i;
        } else {
          // even distribution over a typed caption
          words = cap.trim() ? cap.trim().split(/\s+/) : [];
          const progress = Math.min(1, Math.max(0, off / l));
          activeIdx = Math.min(words.length - 1, Math.floor(progress * words.length));
        }
        drawCaption(ctx, c.width, c.height, words, activeIdx);
        if (v.currentTime >= s + l) {
          if (recordingRef.current) finishExport();
          else if (!v.paused) v.currentTime = s;
        }
      }
    }
  }

  function supported() {
    const c = canvasRef.current;
    return !!(
      c &&
      typeof (c as HTMLCanvasElement & { captureStream?: unknown })
        .captureStream === "function" &&
      typeof MediaRecorder !== "undefined"
    );
  }

  // load single-threaded ffmpeg.wasm from CDN (no cross-origin isolation needed)
  function getFFmpeg(): Promise<unknown> {
    if (ffmpegRef.current) return Promise.resolve(ffmpegRef.current);
    if (ffmpegLoadRef.current) return ffmpegLoadRef.current;
    ffmpegLoadRef.current = (async () => {
      const w = window as unknown as { FFmpeg?: { createFFmpeg: (o: unknown) => unknown } };
      if (!w.FFmpeg) {
        await new Promise<void>((res, rej) => {
          const s = document.createElement("script");
          s.src = "https://unpkg.com/@ffmpeg/ffmpeg@0.11.6/dist/ffmpeg.min.js";
          s.onload = () => res();
          s.onerror = () => rej(new Error("encoder failed to load"));
          document.head.appendChild(s);
        });
      }
      const createFFmpeg = (window as unknown as { FFmpeg: { createFFmpeg: (o: unknown) => unknown } }).FFmpeg.createFFmpeg;
      const ff = createFFmpeg({
        log: false,
        corePath: "https://unpkg.com/@ffmpeg/core@0.11.0/dist/ffmpeg-core.js",
      }) as { load: () => Promise<void> };
      await ff.load();
      ffmpegRef.current = ff;
      return ff;
    })();
    return ffmpegLoadRef.current;
  }

  async function toMp4(webm: Blob): Promise<Blob> {
    const ff = (await getFFmpeg()) as {
      FS: (op: string, ...a: unknown[]) => Uint8Array;
      run: (...a: string[]) => Promise<void>;
    };
    const fetchFile = (window as unknown as { FFmpeg: { fetchFile: (b: Blob) => Promise<Uint8Array> } }).FFmpeg.fetchFile;
    ff.FS("writeFile", "in.webm", await fetchFile(webm));
    await ff.run(
      "-i", "in.webm",
      "-c:v", "libx264", "-preset", "ultrafast", "-pix_fmt", "yuv420p",
      "-c:a", "aac", "-movflags", "+faststart", "out.mp4"
    );
    const data = ff.FS("readFile", "out.mp4");
    ff.FS("unlink", "in.webm");
    ff.FS("unlink", "out.mp4");
    return new Blob([data as unknown as BlobPart], { type: "video/mp4" });
  }

  // load Whisper (transformers.js) from CDN, bypassing the bundler
  function getASR() {
    if (asrRef.current) return Promise.resolve(asrRef.current);
    if (asrLoadRef.current) return asrLoadRef.current;
    asrLoadRef.current = (async () => {
      const importer = new Function("u", "return import(u)") as (u: string) => Promise<{
        env: { allowLocalModels: boolean };
        pipeline: (task: string, model: string) => Promise<unknown>;
      }>;
      const mod = await importer("https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2");
      mod.env.allowLocalModels = false;
      const asr = (await mod.pipeline(
        "automatic-speech-recognition",
        "Xenova/whisper-tiny.en"
      )) as (a: Float32Array, o: unknown) => Promise<{
        text?: string;
        chunks?: { text?: string; timestamp?: [number, number | null] }[];
      }>;
      asrRef.current = asr;
      return asr;
    })();
    return asrLoadRef.current;
  }

  // decode the clip window to 16kHz mono for Whisper
  async function extractAudio(url: string, startSec: number, lenSec: number): Promise<Float32Array> {
    const buf = await (await fetch(url)).arrayBuffer();
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const actx = new AC();
    const audio = await actx.decodeAudioData(buf);
    actx.close();
    const sr = 16000;
    const off = new OfflineAudioContext(1, Math.max(1, Math.floor(lenSec * sr)), sr);
    const src = off.createBufferSource();
    src.buffer = audio;
    src.connect(off.destination);
    src.start(0, startSec, lenSec);
    const rendered = await off.startRendering();
    return rendered.getChannelData(0);
  }

  async function autoCaption() {
    if (!fileUrl || transcribing) return;
    setTranscribing(true);
    try {
      setStatus("Reading the clip's audio…");
      const audio = await extractAudio(fileUrl, start, len);
      setStatus("Loading captions model… (first run downloads it)");
      const asr = (await getASR()) as (
        a: Float32Array,
        o: unknown
      ) => Promise<{
        text?: string;
        chunks?: { text?: string; timestamp?: [number, number | null] }[];
      }>;
      setStatus("Transcribing…");
      const out = await asr(audio, { return_timestamps: "word", chunk_length_s: 30 });
      const words = (out.chunks ?? [])
        .map((c) => ({
          w: (c.text ?? "").trim(),
          s: c.timestamp?.[0] ?? 0,
          e: c.timestamp?.[1] ?? (c.timestamp?.[0] ?? 0) + 0.4,
        }))
        .filter((x) => x.w);
      const text = (out.text ?? "").trim();
      if (text) {
        setCaption(text);
        setTimed(words);
        setStatus("Captions ready ✓ — edit if needed");
      } else {
        setStatus("No speech detected in this clip.");
      }
    } catch {
      setStatus("Auto-caption unavailable here — type a caption instead.");
    }
    setTranscribing(false);
  }

  function download(blob: Blob, ext: string) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `clip.${ext}`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1500);
  }

  async function exportClip() {
    const v = videoRef.current,
      c = canvasRef.current;
    if (!v || !c) return;
    if (!supported()) {
      setStatus("Export needs a Chromium-based browser (Chrome/Edge/Arc).");
      return;
    }
    setExporting(true);
    setStatus("Recording…");
    const canvasStream = (
      c as HTMLCanvasElement & { captureStream: (fps: number) => MediaStream }
    ).captureStream(30);
    const tracks = [...canvasStream.getVideoTracks()];
    try {
      const vAny = v as HTMLVideoElement & {
        captureStream?: () => MediaStream;
        mozCaptureStream?: () => MediaStream;
      };
      const vs = (vAny.captureStream || vAny.mozCaptureStream)?.call(v);
      if (vs) tracks.push(...vs.getAudioTracks());
    } catch {
      /* no audio track — silent export */
    }
    const stream = new MediaStream(tracks);
    const mime =
      ["video/mp4;codecs=h264,aac", "video/webm;codecs=vp9,opus", "video/webm"].find(
        (m) => MediaRecorder.isTypeSupported(m)
      ) || "";
    const rec = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
    recRef.current = rec;
    chunksRef.current = [];
    rec.ondataavailable = (e) => e.data.size && chunksRef.current.push(e.data);
    rec.onstop = async () => {
      const type = rec.mimeType || "video/webm";
      const raw = new Blob(chunksRef.current, { type });
      if (type.includes("mp4")) {
        download(raw, "mp4");
        setStatus("Downloaded MP4 ✓");
      } else {
        setStatus("Encoding MP4… (first run downloads the encoder)");
        try {
          download(await toMp4(raw), "mp4");
          setStatus("Downloaded MP4 ✓");
        } catch {
          download(raw, "webm");
          setStatus("Downloaded WebM ✓ (MP4 encoder unavailable)");
        }
      }
      setExporting(false);
      recordingRef.current = false;
      // resume the muted preview loop
      const vEl = videoRef.current;
      if (vEl) {
        vEl.muted = true;
        vEl.currentTime = start;
        vEl.play().catch(() => {});
      }
    };
    v.currentTime = start;
    await new Promise<void>((r) => {
      const on = () => {
        v.removeEventListener("seeked", on);
        r();
      };
      v.addEventListener("seeked", on);
    });
    recordingRef.current = true;
    v.muted = false; // capture audio for the download
    rec.start();
    await v.play().catch(() => {});
  }

  function finishExport() {
    recordingRef.current = false;
    const v = videoRef.current;
    if (recRef.current?.state === "recording") recRef.current.stop();
    v?.pause();
  }

  // cleanup
  useEffect(() => {
    return () => {
      if (loopRef.current != null) clearInterval(loopRef.current);
    };
  }, []);

  const maxStart = Math.max(0, duration - len);

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
          Captioned clip
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
                />
              </div>
              <div className={styles.clpField}>
                <span className={styles.clpLabel}>Out</span>
                <input
                  className={`${styles.clpInput} ${styles.clpTimeInput}`}
                  value={endStr}
                  onChange={(e) => setEndStr(e.target.value)}
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
                        setClips((p) => p.filter((x) => x.id !== c.id));
                      }}
                      aria-label="Remove"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
            {active && (
              <button className={styles.clpBtnGhost} onClick={copyLink}>
                {copied ? "Copied ✓" : "Copy clip link"}
              </button>
            )}
            <p className={styles.clpNote}>
              Marks a moment on any talk and plays it back as a clip, reading the{" "}
              <b>t=</b> timestamp automatically. Copy the link to share a normal
              YouTube link that starts at your clip&apos;s start time. For a
              downloadable file with captions, use the <b>Captioned clip</b> tab.
            </p>
          </>
        ) : (
          <>
            {!fileUrl ? (
              <>
                <div
                  className={styles.clpDrop}
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    onFile(e.dataTransfer.files?.[0]);
                  }}
                >
                  Drop an MP4 here, or click to choose. Everything stays in your
                  browser — nothing is uploaded.
                </div>
                <button className={styles.clpSampleBtn} onClick={loadSample}>
                  ▶ Try it with a sample clip
                </button>
              </>
            ) : (
              <>
                {/* live, looping captioned preview */}
                <div className={styles.clpCanvasWrap}>
                  <canvas ref={canvasRef} className={styles.clpCanvas} />
                  <span className={styles.clpCanvasLabel}>
                    Live preview · {fileName}
                  </span>
                </div>
                <video
                  ref={videoRef}
                  className={styles.clpVideoHidden}
                  src={fileUrl}
                  muted
                  playsInline
                  crossOrigin="anonymous"
                  onLoadedMetadata={onMeta}
                />

                <div className={styles.clpStep}>
                  <span className={styles.clpStepNum}>1</span> Position your clip
                </div>
                <div className={styles.clpRow}>
                  <div className={styles.clpField}>
                    <span className={styles.clpLabel}>
                      Start {fmt(Math.min(start, maxStart))}
                    </span>
                    <input
                      className={styles.clpSlider}
                      type="range"
                      min={0}
                      max={Math.max(1, Math.floor(maxStart))}
                      step={1}
                      value={Math.min(start, maxStart)}
                      onChange={(e) => {
                        const s = parseInt(e.target.value, 10);
                        setStart(s);
                        seekPreview(s);
                      }}
                    />
                  </div>
                  <div className={styles.clpField}>
                    <span className={styles.clpLabel}>Length {len}s</span>
                    <input
                      className={styles.clpSlider}
                      type="range"
                      min={5}
                      max={10}
                      step={1}
                      value={len}
                      onChange={(e) => {
                        setLen(parseInt(e.target.value, 10));
                        seekPreview(start);
                      }}
                    />
                  </div>
                  <span className={styles.clpWindow}>
                    Clip {fmt(start)}–{fmt(start + len)}
                  </span>
                </div>

                <div className={styles.clpStep}>
                  <span className={styles.clpStepNum}>2</span> Caption
                </div>
                <div className={styles.clpRow}>
                  <button
                    className={styles.clpBtn}
                    onClick={autoCaption}
                    disabled={transcribing || exporting}
                  >
                    {transcribing ? "Captioning…" : "✨ Auto-caption"}
                  </button>
                  <span className={styles.clpWindow}>
                    transcribes the clip&apos;s audio in your browser
                  </span>
                </div>
                <textarea
                  className={styles.clpTextarea}
                  value={caption}
                  placeholder="Auto-caption, or type your own…"
                  onChange={(e) => {
                    setCaption(e.target.value);
                    setTimed([]);
                  }}
                />

                <div className={styles.clpStep}>
                  <span className={styles.clpStepNum}>3</span> Download
                </div>
                <div className={styles.clpRow}>
                  <button
                    className={`${styles.clpBtn} ${styles.clpDownload}`}
                    onClick={exportClip}
                    disabled={exporting}
                  >
                    {exporting ? "Preparing…" : "⬇ Download MP4"}
                  </button>
                  <button
                    className={styles.clpBtnGhost}
                    onClick={() => {
                      videoRef.current?.pause();
                      if (fileUrl.startsWith("blob:")) URL.revokeObjectURL(fileUrl);
                      setFileUrl(null);
                      setStatus("");
                    }}
                  >
                    Start over
                  </button>
                </div>
                <p className={styles.clpStatus}>{status}</p>
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
              Makes a vertical <b>9:16 MP4</b> with captions burned in.{" "}
              <b>Auto-caption</b> transcribes the clip&apos;s audio in your browser
              (first run downloads a small model); or type your own. Nothing is
              uploaded.
            </p>
          </>
        )}

        <div className={styles.clpRoadmap}>
          <span className={styles.clpChip}>Now · captioned clips (raw)</span>
          <span className={styles.clpChip}>Next · auto-transcribe captions</span>
          <span className={styles.clpChip}>Roadmap · link → clip render service</span>
        </div>
      </div>
    </div>
  );
}
