"use client";

import { useEffect, useRef } from "react";

// Live gaze: the straight-ahead ink portrait morphs toward the cursor using
// precomputed motion fields to sixteen drawn directions around the circle.
// Falls back to the still portrait if WebGL is unavailable.

const VS = `attribute vec2 p;varying vec2 v;void main(){v=vec2(p.x*.5+.5,.5-p.y*.5);gl_Position=vec4(p,0.,1.);}`;
const FS = `precision mediump float;varying vec2 v;
uniform sampler2D uImg,uF,uB;uniform float uI,uJ,uW,uT;const float M=0.15;
vec2 c(vec2 u){return clamp(u,.002,.998);}
vec2 t3(float i,vec2 u){return (vec2(mod(i,5.),floor(i/5.))+c(u))/vec2(5.,4.);}
vec2 t4(float i,vec2 u){return (vec2(mod(i,4.),floor(i/4.))+c(u))/4.;}
vec2 dec(sampler2D s,float i,vec2 u){vec4 x=texture2D(s,t4(i,u));return (x.rg*255.-128.)/127.*M;}
void main(){vec2 f=mix(dec(uF,uI,v),dec(uF,uJ,v),uW);
 vec4 a=texture2D(uImg,t3(16.,v+uT*f));
 float n=uW<.5?uI:uJ;float q=1.-smoothstep(.34,.5,min(uW,1.-uW));
 vec4 b=texture2D(uImg,t3(n,v+(1.-uT)*dec(uB,n,v)));
 gl_FragColor=mix(a,b,uT*q);}`;

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

    const sh = (type: number, src: string) => { const s = gl.createShader(type)!; gl.shaderSource(s, src); gl.compileShader(s); return s; };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const U = (n: string) => gl.getUniformLocation(prog, n);

    const tex = (img: HTMLImageElement, unit: number, name: string, linear: boolean) => {
      const t = gl.createTexture();
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, t);
      gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.NONE);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      const f = linear ? gl.LINEAR : gl.NEAREST;
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, f === gl.NEAREST ? gl.LINEAR : gl.LINEAR);
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

    const draw = () => {
      const t = Math.min(1, Math.hypot(cur.x, cur.y));
      let a = (Math.atan2(cur.y, cur.x) * 180) / Math.PI;
      a = (a + 360) % 360;
      const i = Math.floor(a / 22.5) % 16, j = (i + 1) % 16, w = (a - i * 22.5) / 22.5;
      gl.uniform1f(U("uI"), i);
      gl.uniform1f(U("uJ"), j);
      gl.uniform1f(U("uW"), w);
      gl.uniform1f(U("uT"), t);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    const tick = () => {
      cur.x += (target.x - cur.x) * 0.14;
      cur.y += (target.y - cur.y) * 0.14;
      draw();
      raf = Math.abs(target.x - cur.x) + Math.abs(target.y - cur.y) > 0.002 ? requestAnimationFrame(tick) : 0;
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(tick); };

    const onMove = (e: PointerEvent) => {
      const b = box.getBoundingClientRect();
      const dx = e.clientX - (b.left + b.width / 2), dy = e.clientY - (b.top + b.height * 0.4);
      const d = Math.hypot(dx, dy), inner = b.width * 0.3;
      const t = d < inner ? 0 : Math.min(1, (d - inner) / 420);
      const s = t * (2 - t); // ease out
      target.x = d ? (dx / d) * s : 0;
      target.y = d ? (dy / d) * s : 0;
      kick();
    };
    const onLeave = () => { target.x = 0; target.y = 0; kick(); };

    Promise.all([load("/images/gaze/atlas.webp"), load("/images/gaze/flow-f.png"), load("/images/gaze/flow-b.png")])
      .then(([img, f, b]) => {
        if (!alive) return;
        tex(img, 0, "uImg", true);
        tex(f, 1, "uF", true);
        tex(b, 2, "uB", true);
        size();
        draw();
        canvas.style.opacity = "1";
        window.addEventListener("pointermove", onMove, { passive: true });
        document.addEventListener("pointerleave", onLeave);
        window.addEventListener("resize", () => { size(); draw(); });
      })
      .catch(() => {});

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div ref={wrap} className={className} style={{ position: "relative", overflow: "hidden", background: "#fff" }}>
      <img src="/images/gaze/c.webp" alt={alt} width={640} height={640} style={{ display: "block", width: "100%", height: "100%", objectFit: "cover" }} />
      <canvas ref={cvs} aria-hidden="true" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0 }} />
    </div>
  );
}
