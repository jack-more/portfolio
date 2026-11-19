"use client";

import { useEffect, useRef } from "react";

// 2.5D portrait. The head turns continuously toward the cursor using a depth map
// (small parallax, so the face never stretches). The eyes swap between nine
// drawn positions (center + 8 directions) with a quick fade, like real eye movement.
// Falls back to the still portrait if WebGL is unavailable.

const VS = `attribute vec2 p;varying vec2 v;void main(){v=vec2(p.x*.5+.5,.5-p.y*.5);gl_Position=vec4(p,0.,1.);}`;
const FS = `precision mediump float;varying vec2 v;
uniform sampler2D uImg,uDepth;uniform float uA,uB,uMix;uniform vec2 uOff;
vec2 t3(float i,vec2 u){return (vec2(mod(i,3.),floor(i/3.))+clamp(u,.002,.998))/3.;}
void main(){vec2 u=.5+(v-.5)*.955;float d=texture2D(uDepth,u).r;vec2 s=u-uOff*d;
 gl_FragColor=mix(texture2D(uImg,t3(uA,s)),texture2D(uImg,t3(uB,s)),uMix);}`;

const MAX_OFF = 0.02; // fraction of width the nearest point moves at full turn
// eye frames: 0 = center, then clockwise from screen-right every 45deg
const dirIndex = (a: number) => 1 + (Math.round(((a + 360) % 360) / 45) % 8);
const dirAngle = (i: number) => (i - 1) * 45;

function load(src: string) {
  return new Promise<HTMLImageElement>((res, rej) => {
    const i = new Image();
    i.decoding = "async";
    i.onload = () => res(i);
    i.onerror = rej;
    i.src = src;
  });
}

export default function GazePortrait({ className, alt }: { className?: string; alt: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const cvs = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = cvs.current, box = wrap.current;
    if (!canvas || !box) return;
    const gl = canvas.getContext("webgl", { premultipliedAlpha: false, antialias: false });
    if (!gl) return;
    let raf = 0, alive = true;
    const target = { x: 0, y: 0 }, cur = { x: 0, y: 0 };
    let eyeNow = 0, eyePrev = 0, fadeStart = -1e9;
    const FADE = 120;

    const sh = (type: number, src: string) => { const s = gl.createShader(type)!; gl.shaderSource(s, src); gl.compileShader(s); return s; };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const U = (n: string) => gl.getUniformLocation(prog, n);

    const tex = (img: HTMLImageElement, unit: number, name: string) => {
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
      gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.NONE);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.uniform1i(U(name), unit);
    };

    const size = () => {
      const r = canvas.getBoundingClientRect(), d = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(r.width * d);
      canvas.height = Math.round(r.height * d);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    const pickEyes = (now: number) => {
      const t = Math.hypot(cur.x, cur.y);
      const a = (Math.atan2(cur.y, cur.x) * 180) / Math.PI;
      let next = eyeNow;
      if (t < 0.28) next = 0;
      else if (eyeNow === 0) next = dirIndex(a);
      else {
        const diff = Math.abs(((a - dirAngle(eyeNow) + 540) % 360) - 180);
        if (diff > 30) next = dirIndex(a); // hysteresis so eyes don't flicker at boundaries
      }
      if (next !== eyeNow) { eyePrev = eyeNow; eyeNow = next; fadeStart = now; }
    };

    const draw = (now: number) => {
      const m = Math.min(1, (now - fadeStart) / FADE);
      gl.uniform1f(U("uA"), eyePrev);
      gl.uniform1f(U("uB"), eyeNow);
      gl.uniform1f(U("uMix"), m);
      gl.uniform2f(U("uOff"), cur.x * MAX_OFF, cur.y * MAX_OFF);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      return m < 1;
    };

    const coarse = window.matchMedia("(pointer: coarse)").matches;
    let last = 0, visible = true, held = false;

    const tick = (now: number) => {
      // On touch screens, when nobody is touching, he looks around on his own.
      const wander = coarse && visible && !held && now - last > 2200;
      if (wander) {
        const k = now / 1000;
        target.x = 0.85 * Math.cos(k * 0.5);
        target.y = 0.6 * Math.sin(k * 0.8);
      }
      const ease = wander ? 0.05 : 0.15;
      cur.x += (target.x - cur.x) * ease;
      cur.y += (target.y - cur.y) * ease;
      pickEyes(now);
      const fading = draw(now);
      const moving = Math.abs(target.x - cur.x) + Math.abs(target.y - cur.y) > 0.002;
      raf = moving || fading || (coarse && visible && !held) ? requestAnimationFrame(tick) : 0;
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(tick); };

    const io = new IntersectionObserver((es) => { visible = es[0].isIntersecting; kick(); });
    io.observe(box);

    const look = (x: number, y: number) => {
      const b = box.getBoundingClientRect();
      const dx = x - (b.left + b.width / 2), dy = y - (b.top + b.height * 0.4);
      const d = Math.hypot(dx, dy), inner = b.width * (coarse ? 0.2 : 0.3);
      const range = coarse ? 60 : Math.max(140, Math.min(420, window.innerWidth * 0.45));
      const t = d < inner ? 0 : Math.min(1, (d - inner) / range);
      const s = t * (2 - t); // ease out
      target.x = d ? (dx / d) * s : 0;
      target.y = d ? (dy / d) * s : 0;
      last = performance.now();
      kick();
    };
    const onPointer = (e: PointerEvent) => look(e.clientX, e.clientY);
    const onTouch = (e: TouchEvent) => { const t = e.touches[0]; if (t) { held = true; look(t.clientX, t.clientY); } };
    const onTouchEnd = () => { held = false; last = performance.now(); kick(); };
    const onLeave = () => { if (!coarse) { target.x = 0; target.y = 0; kick(); } };
    const onResize = () => { size(); draw(performance.now()); };

    Promise.all([load("/images/gaze/eyes-atlas.webp"), load("/images/gaze/depth.png")])
      .then(([img, depth]) => {
        if (!alive) return;
        tex(img, 0, "uImg");
        tex(depth, 1, "uDepth");
        size();
        draw(performance.now());
        canvas.style.opacity = "1";
        window.addEventListener("pointermove", onPointer, { passive: true });
        window.addEventListener("pointerdown", onPointer, { passive: true });
        window.addEventListener("touchstart", onTouch, { passive: true });
        window.addEventListener("touchmove", onTouch, { passive: true });
        window.addEventListener("touchend", onTouchEnd, { passive: true });
        document.addEventListener("pointerleave", onLeave);
        window.addEventListener("resize", onResize);
        kick();
      })
      .catch(() => {});

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("touchstart", onTouch);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("touchend", onTouchEnd);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div ref={wrap} className={className} style={{ position: "relative", overflow: "hidden", background: "#fff" }}>
      <img src="/images/gaze/c.webp" alt={alt} width={640} height={640} style={{ display: "block", width: "100%", height: "100%", objectFit: "cover" }} />
      <canvas ref={cvs} aria-hidden="true" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0 }} />
    </div>
  );
}
