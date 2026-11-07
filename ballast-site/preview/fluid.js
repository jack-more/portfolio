// Cursor smoke for the hero window: a small stable-fluids simulation (advect, divergence, pressure, project) in WebGL2.
// Moving the pointer injects velocity and smoke; the canvas draws only the smoke, so the video underneath stays sharp.
export function smoke(canvas, opts = {}) {
  const gl = canvas.getContext('webgl2', { alpha: true, premultipliedAlpha: true, antialias: false });
  if (!gl || !gl.getExtension('EXT_color_buffer_float')) return null;
  gl.getExtension('OES_texture_float_linear');
  const SIM = opts.sim || 128, DYE = opts.dye || 512, ITER = 20;
  const DISS_V = .985, DISS_D = .965, RADIUS = opts.radius || .0022, FORCE = opts.force || 5200;
  const COLOR = opts.color || [1, 1, 1];

  const vs = `#version 300 es
  in vec2 p; out vec2 uv; out vec2 vL; out vec2 vR; out vec2 vT; out vec2 vB; uniform vec2 tx;
  void main(){ uv=p*.5+.5; vL=uv-vec2(tx.x,0.); vR=uv+vec2(tx.x,0.); vT=uv+vec2(0.,tx.y); vB=uv-vec2(0.,tx.y); gl_Position=vec4(p,0.,1.); }`;
  const fs = {
    splat: `uniform sampler2D T; uniform float ar; uniform vec3 col; uniform vec2 pt; uniform float r;
      void main(){ vec2 d=uv-pt; d.x*=ar; vec3 s=exp(-dot(d,d)/r)*col; o=vec4(texture(T,uv).xyz+s,1.); }`,
    advect: `uniform sampler2D V; uniform sampler2D S; uniform vec2 tx; uniform float dt; uniform float diss;
      void main(){ vec2 c=uv-dt*texture(V,uv).xy*tx; o=diss*texture(S,c); o.a=1.; }`,
    div: `uniform sampler2D V;
      void main(){ float L=texture(V,vL).x,R=texture(V,vR).x,T=texture(V,vT).y,B=texture(V,vB).y; o=vec4(.5*(R-L+T-B),0.,0.,1.); }`,
    pres: `uniform sampler2D P; uniform sampler2D D;
      void main(){ float L=texture(P,vL).x,R=texture(P,vR).x,T=texture(P,vT).x,B=texture(P,vB).x,d=texture(D,uv).x; o=vec4((L+R+B+T-d)*.25,0.,0.,1.); }`,
    grad: `uniform sampler2D P; uniform sampler2D V;
      void main(){ float L=texture(P,vL).x,R=texture(P,vR).x,T=texture(P,vT).x,B=texture(P,vB).x; vec2 v=texture(V,uv).xy-vec2(R-L,T-B); o=vec4(v,0.,1.); }`,
    clear: `uniform sampler2D T; uniform float k; void main(){ o=k*texture(T,uv); }`,
    show: `uniform sampler2D D; uniform vec3 tint;
      void main(){ float a=clamp(length(texture(D,uv).rgb),0.,1.); a=smoothstep(.02,.9,a)*.85; o=vec4(tint*a,a); }`,
  };
  const head = '#version 300 es\nprecision highp float; in vec2 uv; in vec2 vL; in vec2 vR; in vec2 vT; in vec2 vB; out vec4 o;\n';
  const sh = (t, s) => { const x = gl.createShader(t); gl.shaderSource(x, s); gl.compileShader(x); if (!gl.getShaderParameter(x, gl.COMPILE_STATUS)) throw gl.getShaderInfoLog(x); return x; };
  const vsh = sh(gl.VERTEX_SHADER, vs);
  const prog = {}; for (const k in fs) { const p = gl.createProgram(); gl.attachShader(p, vsh); gl.attachShader(p, sh(gl.FRAGMENT_SHADER, head + fs[k])); gl.bindAttribLocation(p, 0, 'p'); gl.linkProgram(p);
    const u = {}; const n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS); for (let i = 0; i < n; i++) { const nm = gl.getActiveUniform(p, i).name; u[nm] = gl.getUniformLocation(p, nm); } prog[k] = { p, u }; }
  const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0); gl.enableVertexAttribArray(0);

  function fbo(w, h) { const t = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, w, h, 0, gl.RGBA, gl.HALF_FLOAT, null);
    const f = gl.createFramebuffer(); gl.bindFramebuffer(gl.FRAMEBUFFER, f); gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, t, 0);
    gl.viewport(0, 0, w, h); gl.clearColor(0, 0, 0, 1); gl.clear(gl.COLOR_BUFFER_BIT); return { t, f, w, h }; }
  const dbl = (w, h) => { let a = fbo(w, h), b = fbo(w, h); return { get r() { return a; }, get w() { return b; }, swap() { [a, b] = [b, a]; } }; };
  let vel, dye, pres, divg, simW, simH, dyeW, dyeH;
  function size() {
    const r = canvas.getBoundingClientRect(), pr = Math.min(devicePixelRatio || 1, 1.5);
    canvas.width = Math.max(1, Math.round(r.width * pr)); canvas.height = Math.max(1, Math.round(r.height * pr));
    const ar = canvas.width / canvas.height;
    simH = SIM; simW = Math.round(SIM * ar); dyeH = DYE; dyeW = Math.round(DYE * ar);
    vel = dbl(simW, simH); dye = dbl(dyeW, dyeH); pres = dbl(simW, simH); divg = fbo(simW, simH);
  }
  size(); addEventListener('resize', size);

  const tex = (u, name, t, unit) => { gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, t); gl.uniform1i(u[name], unit); };
  const draw = (target) => { if (target) { gl.bindFramebuffer(gl.FRAMEBUFFER, target.f); gl.viewport(0, 0, target.w, target.h); }
    else { gl.bindFramebuffer(gl.FRAMEBUFFER, null); gl.viewport(0, 0, canvas.width, canvas.height); } gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); };
  const use = (k, w, h) => { const { p, u } = prog[k]; gl.useProgram(p); if (u.tx) gl.uniform2f(u.tx, 1 / w, 1 / h); return u; };

  function splat(x, y, dx, dy) {
    const ar = canvas.width / canvas.height;
    let u = use('splat', simW, simH); tex(u, 'T', vel.r.t, 0); gl.uniform1f(u.ar, ar); gl.uniform2f(u.pt, x, y);
    gl.uniform3f(u.col, dx * FORCE, dy * FORCE, 0); gl.uniform1f(u.r, RADIUS); draw(vel.w); vel.swap();
    u = use('splat', dyeW, dyeH); tex(u, 'T', dye.r.t, 0); gl.uniform1f(u.ar, ar); gl.uniform2f(u.pt, x, y);
    const k = Math.min(1, Math.hypot(dx, dy) * 60) * .55; gl.uniform3f(u.col, k, k, k); gl.uniform1f(u.r, RADIUS * 1.4); draw(dye.w); dye.swap();
  }
  let last = null; const target = opts.target || canvas;
  target.addEventListener('pointermove', e => { const r = canvas.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width, y = 1 - (e.clientY - r.top) / r.height;
    if (last) splat(x, y, x - last[0], y - last[1]); last = [x, y]; });
  target.addEventListener('pointerleave', () => { last = null; });

  let t0 = 0, running = true;
  function step(t) {
    if (!running) return; requestAnimationFrame(step);
    const dt = Math.min(.033, (t - (t0 || t)) / 1000) || .016; t0 = t;
    let u = use('advect', simW, simH); tex(u, 'V', vel.r.t, 0); tex(u, 'S', vel.r.t, 1); gl.uniform1f(u.dt, dt); gl.uniform1f(u.diss, DISS_V); draw(vel.w); vel.swap();
    u = use('div', simW, simH); tex(u, 'V', vel.r.t, 0); draw(divg);
    u = use('clear', simW, simH); tex(u, 'T', pres.r.t, 0); gl.uniform1f(u.k, .8); draw(pres.w); pres.swap();
    for (let i = 0; i < ITER; i++) { u = use('pres', simW, simH); tex(u, 'P', pres.r.t, 0); tex(u, 'D', divg.t, 1); draw(pres.w); pres.swap(); }
    u = use('grad', simW, simH); tex(u, 'P', pres.r.t, 0); tex(u, 'V', vel.r.t, 1); draw(vel.w); vel.swap();
    u = use('advect', dyeW, dyeH); gl.uniform2f(u.tx, 1 / simW, 1 / simH); tex(u, 'V', vel.r.t, 0); tex(u, 'S', dye.r.t, 1); gl.uniform1f(u.dt, dt); gl.uniform1f(u.diss, DISS_D); draw(dye.w); dye.swap();
    gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA); gl.clearColor(0, 0, 0, 0);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null); gl.viewport(0, 0, canvas.width, canvas.height); gl.clear(gl.COLOR_BUFFER_BIT);
    u = use('show', dyeW, dyeH); tex(u, 'D', dye.r.t, 0); gl.uniform3f(u.tint, ...COLOR); draw(null); gl.disable(gl.BLEND);
  }
  requestAnimationFrame(step);
  return { splat, stop() { running = false; } };
}
