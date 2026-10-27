/* Koi pool hero, 3D. The camera looks straight down into an LA pool. Koi are 3D models that swim with a body wave and
   cast soft shadows on the tiles; the light patterns on the tiles are drawn live and move with the water. Click or tap
   the water: something drops in (mostly iconic things from Ballast's clients: a SailGP F50, a 4Runner, a Starbucks holiday
   cup, an LG G2...), splashes, floats or sinks, and the koi come to it. The F50 foils off across the pool.
   Passes per frame: 1) ripple simulation on the GPU (height + velocity); 2) everything under the surface (floor, koi,
   sunk objects; floating objects only cast shadows) into a buffer; 3) the water surface refracts that buffer and adds
   sun glints; 4) floating objects and splash drops on top. No WebGL2 or reduced motion: the still pool stays.
   World units are CSS pixels on the pool floor: x right, z down the screen, y up toward the camera. */
import * as THREE from 'three';
import { GLTFLoader } from '/hero/vendor/jsm/loaders/GLTFLoader.js';
import { RoomEnvironment } from '/hero/vendor/jsm/environments/RoomEnvironment.js';

const BASE = '/hero/koi/';
const FISH = [{ src: 'koi1.glb', fix: { ry: Math.PI } }, { src: 'koi2.glb', fix: { ry: Math.PI } }, { src: 'koi3.glb', fix: { ry: Math.PI } }];   // Hunyuan3D puts the head at -x
// What drops in: the F50 first, then everything in a shuffled round, no repeats until all have come up. Mostly iconic
// things from Ballast's clients, with no wordmarks on any of them.
// glb: a 3D model (Hunyuan3D from a generated product shot, slimmed with gltf-transform; brandkit-ballast/koi/gen5*, gen6*);
// img: a top-down photo plus a height map (brandkit-ballast/koi/items25d.py), so a ball is a sphere and the donut a torus.
// size: longest side as a fraction of a koi's length; float: stays on the surface (else it sinks); ride: how high it floats
// (0 = centred on the surface, 1 = sitting on it); food: the koi eat it; shower: that many flutter down; lie: lies on its
// side; flat: lays face-up a model that came out standing on its edge; depth: the height map's top as a fraction of the
// longest side (printed by items25d.py); bow: turn so the bow leads; env: how much it reflects (glossy black reads white
// under water); sail: heads off across the pool at that speed (px/s), heeled over, throwing spray; drift: floats slowly
// across, turning.
const ITEMS = [
  { glb: 'item-f50.glb', size: 1.1, float: true, ride: 1, bow: Math.PI / 2, env: .4, sail: { speed: 230, heel: .42, spray: true } },   // NEAR × SailGP
  { glb: 'item-4runner.glb', size: 1.05 },                                                                            // Toyota
  { img: 'obj-basketball', size: .36, float: true, depth: .487, rough: .75 },
  { glb: 'item-jordan.glb', size: .5, float: true },                                                                  // Jordan
  { img: 'obj-bill', size: .40, float: true, shower: 5, flutter: true, depth: .004, curl: .1, rough: .9 },
  { glb: 'item-cup.glb', size: .36, float: true, lie: true },                                                         // Starbucks, holidays
  { img: 'obj-dalgona', size: .3, float: true, food: true, depth: .022, rough: .5 },                                  // Netflix, Squid Game
  { glb: 'item-lgg2.glb', size: .3, env: .2 },                                                                                 // LG G2
  { glb: 'item-coffee.glb', size: .42, float: true, lie: true },                                                      // Starbucks
  { glb: 'item-belt.glb', size: .8, flat: true },                                                                                 // STARZPLAY, Heels
  { img: 'obj-donut', size: .34, float: true, food: true, depth: .146, rough: .5 },
  { glb: 'item-flamingo.glb', size: 1.1, float: true, ride: .3, drift: true },                                        // Dtravel
  { glb: 'item-m3.glb', size: 1 },                                                                                    // BMW
  { glb: 'item-hint.glb', size: .42, float: true },                                                                   // Hint
  { glb: 'item-bird.glb', size: .4, float: true },                                                                    // the old Twitter bird
  { glb: 'item-samba.glb', size: .5, float: true },                                                                   // Adidas
  { glb: 'item-vial.glb', size: .22, float: true, lie: true },
  { img: 'obj-baseball', size: .23, float: true, depth: .492, rough: .65 },
];

const scene0 = document.getElementById('scene');
const still = scene0 && scene0.querySelector('.scene__bg');
if (scene0 && still) boot();

function boot() {
  still.src = BASE + 'still.webp';
  still.alt = 'Orange and white koi swimming in a pool lined with cobalt tiles';
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const canvas = document.createElement('canvas');
  canvas.className = 'scene__koi';
  canvas.setAttribute('aria-hidden', 'true');
  still.after(canvas);
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' }); } catch (e) { canvas.remove(); return; }
  if (!renderer.capabilities.isWebGL2) { renderer.dispose(); canvas.remove(); return; }

  const small = () => innerWidth < 900;
  const rnd = (a, b) => a + Math.random() * (b - a);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.shadowMap.autoUpdate = false;

  let W = 1, H = 1, D = 1, L = 1;                         // view size, water depth, koi length (px)
  const world = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(22, 1, 10, 50000);
  cam.up.set(0, 0, -1);
  const LAYER_FLOAT = 1, LAYER_DROPS = 2;

  // ---------------- light: a high sun from the upper right, so shadows fall down and to the left
  const SUN = new THREE.Vector3(.5, 1, -.56).normalize();
  const amb = new THREE.AmbientLight(0xffffff, 1.5); world.add(amb);
  const pmrem = new THREE.PMREMGenerator(renderer);
  world.environment = pmrem.fromScene(new RoomEnvironment(), .04).texture;   // wet highlights on the koi; the floor (Lambert) ignores it
  const sun = new THREE.DirectionalLight(0xfff6e6, 2.2);
  sun.castShadow = true;
  sun.shadow.bias = -.0006; sun.shadow.normalBias = .5;
  world.add(sun, sun.target);
  amb.layers.enable(LAYER_FLOAT); sun.layers.enable(LAYER_FLOAT);     // pass 4 draws only the floating layer, lit

  // ---------------- ripple simulation (Evan Wallace's height + velocity scheme), half-float ping-pong
  const ortho = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const quadGeo = new THREE.PlaneGeometry(2, 2);
  const QUAD_VS = 'varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}';
  const simMat = new THREE.ShaderMaterial({
    uniforms: { tPrev: { value: null }, texel: { value: new THREE.Vector2() } },
    vertexShader: QUAD_VS,
    fragmentShader: `uniform sampler2D tPrev;uniform vec2 texel;varying vec2 vUv;
      void main(){vec4 i=texture2D(tPrev,vUv);
        float avg=(texture2D(tPrev,vUv-vec2(texel.x,0.)).r+texture2D(tPrev,vUv+vec2(texel.x,0.)).r+
                   texture2D(tPrev,vUv-vec2(0.,texel.y)).r+texture2D(tPrev,vUv+vec2(0.,texel.y)).r)*.25;
        i.g+=(avg-i.r)*2.;i.g*=.993;i.r+=i.g;i.r*=.9992;gl_FragColor=i;}`,
  });
  const dropMat = new THREE.ShaderMaterial({
    uniforms: { tPrev: { value: null }, center: { value: new THREE.Vector2() }, radius: { value: .02 }, strength: { value: .1 }, aspect: { value: 1 } },
    vertexShader: QUAD_VS,
    fragmentShader: `uniform sampler2D tPrev;uniform vec2 center;uniform float radius,strength,aspect;varying vec2 vUv;
      void main(){vec4 i=texture2D(tPrev,vUv);float d=length((vUv-center)*vec2(aspect,1.));
        float k=max(0.,1.-d/radius);k=.5-cos(k*3.14159265)*.5;i.r-=k*strength;gl_FragColor=i;}`,
  });
  const simQuad = new THREE.Mesh(quadGeo, simMat); const simScene = new THREE.Scene(); simScene.add(simQuad);
  let simA, simB, simW = 0, simH = 0;
  const drops = [];
  function makeSim() {
    simA && simA.dispose(); simB && simB.dispose();
    simW = small() ? 256 : 512; simH = Math.max(16, Math.round(simW * H / W));
    const o = { type: THREE.HalfFloatType, format: THREE.RGBAFormat, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, depthBuffer: false };
    simA = new THREE.WebGLRenderTarget(simW, simH, o); simB = new THREE.WebGLRenderTarget(simW, simH, o);
    for (const t of [simA, simB]) { renderer.setRenderTarget(t); renderer.setClearColor(0x000000, 0); renderer.clear(); }
    renderer.setRenderTarget(null);
  }
  function simStep() {
    while (drops.length) {
      const d = drops.shift();
      simQuad.material = dropMat;
      dropMat.uniforms.tPrev.value = simA.texture; dropMat.uniforms.center.value.set(d.x / W, 1 - d.z / H);
      dropMat.uniforms.radius.value = d.r / H; dropMat.uniforms.strength.value = d.s; dropMat.uniforms.aspect.value = W / H;
      renderer.setRenderTarget(simB); renderer.render(simScene, ortho); [simA, simB] = [simB, simA];
    }
    simQuad.material = simMat;
    simMat.uniforms.tPrev.value = simA.texture; simMat.uniforms.texel.value.set(1 / simW, 1 / simH);
    renderer.setRenderTarget(simB); renderer.render(simScene, ortho); [simA, simB] = [simB, simA];
  }
  const splash = (x, z, r, s) => drops.push({ x, z, r, s });

  // ---------------- the pool floor: the empty pool photo, lit, with live light patterns that shadows block
  const shared = { tH: { value: null }, texel: { value: new THREE.Vector2() }, time: { value: 0 }, aspect: { value: 1 } };
  const floorMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
  floorMat.onBeforeCompile = sh => {
    Object.assign(sh.uniforms, shared);
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying vec2 vPool;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvPool=uv;');
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', `#include <common>
      varying vec2 vPool;uniform sampler2D tH;uniform vec2 texel;uniform float time,aspect;
      vec2 hh(vec2 p){p=vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3)));return fract(sin(p)*43758.5453);}
      float web(vec2 p,float t){vec2 i=floor(p),f=fract(p);float f1=8.,f2=8.;
        for(int y=-1;y<=1;y++)for(int x=-1;x<=1;x++){vec2 g=vec2(float(x),float(y));vec2 o=hh(i+g);o=.5+.42*sin(t+6.2831*o);
          float d=length(g+o-f);if(d<f1){f2=f1;f1=d;}else if(d<f2)f2=d;}
        return f2-f1;}
      float caustic(vec2 p,float t){p+=.45*vec2(sin(p.y*.9+t*.7)+.5*sin(p.y*2.3-t*.9),cos(p.x*.8-t*.6)+.5*cos(p.x*2.1+t*.8));
        float a=1.-smoothstep(0.,.075,web(p,t)),b=1.-smoothstep(0.,.05,web(p*1.73+3.1,t*1.27));
        return a*a*a+.55*b*b*b;}`)
      .replace('#include <lights_fragment_end>', `#include <lights_fragment_end>
        float h0=texture2D(tH,vPool).r,hx1=texture2D(tH,vPool+vec2(texel.x,0.)).r,hx0=texture2D(tH,vPool-vec2(texel.x,0.)).r,
              hy1=texture2D(tH,vPool+vec2(0.,texel.y)).r,hy0=texture2D(tH,vPool-vec2(0.,texel.y)).r;
        float lap=hx1+hx0+hy1+hy0-4.*h0;vec2 g=vec2(hx1-hx0,hy1-hy0);
        float c=caustic(vPool*vec2(aspect,1.)*10.5+g*12.,time*.6)*clamp(1.-lap*90.,.25,3.2);
        reflectedLight.directDiffuse*=.58+c*1.35;`);
  };
  let floor = null;

  // ---------------- under the surface -> buffer; then the surface
  let rtUnder = null;
  const surfMat = new THREE.ShaderMaterial({
    uniforms: { tUnder: { value: null }, tH: shared.tH, texel: shared.texel, time: shared.time, aspect: shared.aspect, sun: { value: SUN } },
    vertexShader: QUAD_VS,
    fragmentShader: `uniform sampler2D tUnder,tH;uniform vec2 texel;uniform float time,aspect;uniform vec3 sun;varying vec2 vUv;
      float H(vec2 p){return texture2D(tH,p).r;}
      void main(){vec2 uv=vUv;
        float dx=H(uv+vec2(texel.x,0.))-H(uv-vec2(texel.x,0.)),dy=H(uv+vec2(0.,texel.y))-H(uv-vec2(0.,texel.y));
        vec2 q=uv*vec2(aspect,1.)*9.;     // a light breeze on the surface, always moving a little
        vec2 br=vec2(cos(q.x*1.7+time*1.1)*cos(q.y*1.3-time*.9)+.6*cos(q.x*3.3-time*1.6+q.y*2.1),
                     -sin(q.x*1.7+time*1.1)*sin(q.y*1.3-time*.9)+.6*cos(q.y*2.9+time*1.4-q.x*1.3))*.006;
        vec3 n=normalize(vec3(-dx*14.-br.x,-dy*14.-br.y,1.));
        vec2 off=n.xy*.055;
        vec3 col=vec3(texture2D(tUnder,uv+off*1.04).r,texture2D(tUnder,uv+off).g,texture2D(tUnder,uv+off*.96).b);
        col*=vec3(.93,.98,1.);                                      // water takes a little red out
        vec3 R=reflect(-sun,n);float rv=max(R.z,0.);
        col+=vec3(1.,.97,.9)*(pow(rv,700.)*3.+pow(rv,90.)*.10);     // sun glints on the ripples
        float fr=pow(1.-n.z,4.)*40.;col=mix(col,vec3(.8,.9,1.),clamp(fr,0.,.28));
        gl_FragColor=vec4(col,1.);
        #include <colorspace_fragment>
      }`,
  });
  const surfScene = new THREE.Scene(); surfScene.add(new THREE.Mesh(quadGeo, surfMat));

  // ---------------- koi
  const loader = new GLTFLoader();
  const loadTex = src => new Promise((ok, no) => new THREE.TextureLoader().load(BASE + src, t => { t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; ok(t); }, undefined, no));
  const SWIM = `uniform float uPhase,uAmp,uTurn;\n`;
  const SWIM_VS = `#include <begin_vertex>
    float tt=clamp(.5-transformed.x,0.,1.);
    float tw=smoothstep(.72,.92,tt)*1.1;          // fan the tail fin out a little so it reads from above
    vec2 yz=vec2(transformed.y,transformed.z);transformed.y=yz.x*cos(tw)+yz.y*sin(tw);transformed.z=-yz.x*sin(tw)+yz.y*cos(tw);
    transformed.z+=uAmp*sin(uPhase-tt*4.6)*tt*tt+uTurn*tt*tt*.32;`;
  function swimify(mat, u) {
    mat.onBeforeCompile = sh => {
      Object.assign(sh.uniforms, u);
      sh.vertexShader = SWIM + sh.vertexShader.replace('#include <begin_vertex>', SWIM_VS);
    };
    mat.customProgramCacheKey = () => 'koi-swim';
    return mat;
  }
  function normalise(gltf, fix) {
    // bake every mesh into one group with the koi lying along x, head at +x, length 1, back facing up (+y)
    const g = new THREE.Group(); gltf.scene.updateMatrixWorld(true);
    const R = new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(fix.rx || 0, fix.ry || 0, fix.rz || 0));
    gltf.scene.traverse(o => { if (!o.isMesh) return; const geo = o.geometry.clone(); geo.applyMatrix4(o.matrixWorld); geo.applyMatrix4(R); g.add(new THREE.Mesh(geo, o.material)); });
    const box = new THREE.Box3().setFromObject(g), size = box.getSize(new THREE.Vector3()), c = box.getCenter(new THREE.Vector3());
    const k = 1 / size.x;
    g.children.forEach(m => { m.geometry.translate(-c.x, -c.y, -c.z); m.geometry.scale(k, k, k * 1.22); m.geometry.computeVertexNormals && m.geometry.computeBoundingSphere(); });   // a little plumper, like the photo's koi
    return g;
  }
  const fish = [];
  function spawn(models) {
    const n = small() ? 5 : 7;
    for (let i = 0; i < n; i++) {
      const u = { uPhase: { value: rnd(0, 6.28) }, uAmp: { value: .07 }, uTurn: { value: 0 } };
      const grp = new THREE.Group();
      models[i % models.length].children.forEach(m => {
        const mat = m.material.clone();
        mat.metalness = 0; mat.roughness = .32; mat.envMapIntensity = 1.1; if ('clearcoat' in mat) { mat.clearcoat = .5; mat.clearcoatRoughness = .25; }
        const mesh = new THREE.Mesh(m.geometry, swimify(mat, u));
        mesh.customDepthMaterial = swimify(new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking }), u);
        mesh.castShadow = true; grp.add(mesh);
      });
      const f = { grp, u, x: rnd(.58, .9) * W, z: rnd(.18, .82) * H, y: rnd(.35, .85) * D, ty: rnd(.35, .85) * D, a: rnd(-2.9, -2.3), v: rnd(30, 46),
        turn: 0, wander: rnd(-1, 1), scale: rnd(.84, 1.08), seek: null, react: 0, nib: 0, bank: 0 };
      grp.scale.setScalar(L * f.scale); world.add(grp); fish.push(f);
    }
  }
  function steer(f, dt, now) {
    // koi move slowly and turn in smooth arcs: the turn rate and speed change gradually, the roll stays small
    const len = L * f.scale, hx = f.x + Math.cos(f.a) * len * .45, hz = f.z + Math.sin(f.a) * len * .45;
    let dx, dz, goal, maxW = .75, near = false;
    if (f.seek && now > f.react && (!f.seek.obj || f.seek.obj.alive) && now < f.seek.until) {
      const o = f.seek.obj || f.seek, stop = f.seek.obj ? f.seek.obj.size * .42 * f.seek.obj.scale : 30;
      // aim the head at the item from this koi's own side, so several can crowd it at once
      const ax = o.x + Math.cos(f.seek.side) * stop, az = o.z + Math.sin(f.seek.side) * stop;
      dx = ax - hx; dz = az - hz; const d = Math.hypot(dx, dz);
      near = d < len * .5;
      goal = Math.min(d > len * 1.5 ? 175 : 118, Math.max(near ? 6 : 26, d * 1.1));   // dart when it's far, ease in as it arrives
      if (near) { dx = o.x - hx; dz = o.z - hz; }       // nose in
      maxW = near ? .9 : 1.45;
    } else {
      if (f.seek && now >= f.seek.until) f.seek = null;
      if (f.seek && f.seek.obj && !f.seek.obj.alive) f.seek = null;
      f.wander += rnd(-1, 1) * dt * .9; f.wander = Math.max(-.8, Math.min(.8, f.wander));
      const a = f.a + f.wander * .7; dx = Math.cos(a); dz = Math.sin(a); goal = 38;
      if (Math.random() < dt * .15) f.ty = rnd(.3, .88) * D;
    }
    const n0 = Math.hypot(dx, dz) || 1; dx /= n0; dz /= n0;
    const m = Math.min(W, H) * .1;
    if (f.x < m) dx += (m - f.x) / m * 1.4; if (f.x > W - m) dx -= (f.x - W + m) / m * 1.4;
    if (f.z < m) dz += (m - f.z) / m * 1.4; if (f.z > H - m) dz -= (f.z - H + m) / m * 1.4;
    for (const o of fish) if (o !== f) {
      const ox = f.x - o.x, oz = f.z - o.z, d = Math.hypot(ox, oz), r = len * (near ? .32 : .5);
      if (d < r && d > 0) { dx += ox / d * (r - d) / r * (near ? .5 : 1.1); dz += oz / d * (r - d) / r * (near ? .5 : 1.1); }
    }
    let da = Math.atan2(dz, dx) - f.a; while (da > Math.PI) da -= 2 * Math.PI; while (da < -Math.PI) da += 2 * Math.PI;
    const wWant = Math.max(-maxW, Math.min(maxW, da * 2.2));
    f.turn += Math.max(-2.6 * dt, Math.min(2.6 * dt, wWant - f.turn));     // angular acceleration limit: no snapping
    f.a += f.turn * dt;
    f.v += Math.max(-90 * dt, Math.min(70 * dt, goal - f.v));                // gentle speed changes
    f.x += Math.cos(f.a) * f.v * dt; f.z += Math.sin(f.a) * f.v * dt;
    f.y += (f.ty - f.y) * Math.min(1, dt * .4);
    f.u.uPhase.value += dt * (2.6 + f.v * .045);
    f.u.uAmp.value = .04 + Math.min(f.v, 120) / 120 * .05;
    f.u.uTurn.value = Math.max(-.09, Math.min(.09, -f.turn * .1));
    f.bank += (Math.max(-.17, Math.min(.17, -f.turn * .14)) - f.bank) * Math.min(1, dt * 3);
    f.grp.position.set(f.x, f.y, f.z);
    f.grp.rotation.set(f.bank, -f.a, (f.ty - f.y) / D * .15, 'YXZ');
    if (f.y > D * .75 && Math.random() < dt * .4) splash(hx, hz, 7, .012);    // a koi near the top nudges the surface
    f.head = [hx, hz];
  }

  // ---------------- things that drop in
  const objs = []; let bag = [0], lastItem = -1;
  function nextItem() {   // the next item from the shuffled round; if none of the round has loaded yet, any item that has
    if (!bag.length) {
      bag = ITEMS.map((_, i) => i);
      for (let i = bag.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [bag[i], bag[j]] = [bag[j], bag[i]]; }
      if (bag[0] === lastItem) bag.push(bag.shift());
    }
    const i = bag.findIndex(k => ITEMS[k].parts);
    if (i >= 0) { lastItem = bag.splice(i, 1)[0]; return ITEMS[lastItem]; }
    const ready = ITEMS.filter(x => x.parts); return ready.length ? ready[Math.floor(Math.random() * ready.length)] : null;
  }
  const dropGeo = new THREE.BufferGeometry(); const NDROP = 260;
  const dropPos = new Float32Array(NDROP * 3), dropVel = new Float32Array(NDROP * 3), dropLife = new Float32Array(NDROP);
  dropGeo.setAttribute('position', new THREE.BufferAttribute(dropPos, 3));
  const dot = document.createElement('canvas'); dot.width = dot.height = 32;
  { const g = dot.getContext('2d'), gr = g.createRadialGradient(16, 16, 0, 16, 16, 16); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(.5, 'rgba(235,245,255,.75)'); gr.addColorStop(1, 'rgba(235,245,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 32, 32); }
  const dropPts = new THREE.Points(dropGeo, new THREE.PointsMaterial({ map: new THREE.CanvasTexture(dot), size: 9, sizeAttenuation: true, transparent: true, depthWrite: false }));
  dropPts.layers.set(LAYER_DROPS); dropPts.frustumCulled = false; world.add(dropPts);
  let dropNext = 0;
  function burst(x, z, n, speed) {
    for (let i = 0; i < n; i++) {
      const k = dropNext++ % NDROP, a = rnd(0, 6.283), s = rnd(.25, 1) * speed;
      dropPos[k * 3] = x; dropPos[k * 3 + 1] = D + 2; dropPos[k * 3 + 2] = z;
      dropVel[k * 3] = Math.cos(a) * s; dropVel[k * 3 + 1] = rnd(.6, 1.3) * speed * 1.4; dropVel[k * 3 + 2] = Math.sin(a) * s; dropLife[k] = 1;
    }
  }
  function stepDrops(dt) {
    for (let k = 0; k < NDROP; k++) {
      if (dropLife[k] <= 0) { dropPos[k * 3 + 1] = -1e5; continue; }
      dropVel[k * 3 + 1] -= 2600 * dt;
      dropPos[k * 3] += dropVel[k * 3] * dt; dropPos[k * 3 + 1] += dropVel[k * 3 + 1] * dt; dropPos[k * 3 + 2] += dropVel[k * 3 + 2] * dt;
      if (dropPos[k * 3 + 1] < D) { dropLife[k] = 0; if (Math.random() < .35) splash(dropPos[k * 3], dropPos[k * 3 + 2], 4, .02); }
    }
    dropGeo.attributes.position.needsUpdate = true;
  }
  const toFloat = g => {   // quantized models: unpack to floats before baking transforms in
    for (const k in g.attributes) { const at = g.attributes[k]; if (at.array instanceof Float32Array) continue;
      const f = new Float32Array(at.count * at.itemSize); for (let i = 0; i < at.count; i++) for (let c = 0; c < at.itemSize; c++) f[i * at.itemSize + c] = at.getComponent(i, c);
      g.setAttribute(k, new THREE.BufferAttribute(f, at.itemSize)); }
    return g;
  };
  function inflate(img, depth, w, h, curl) {   // a height map lifted into a closed shell: the top, and the same mirrored underneath
    const gw = img.width, gh = img.height, cv = document.createElement('canvas'); cv.width = gw; cv.height = gh;
    const c2 = cv.getContext('2d', { willReadFrequently: true }); c2.drawImage(img, 0, 0); const px = c2.getImageData(0, 0, gw, gh).data;
    const n = gw * gh, pos = new Float32Array(n * 6), uv = new Float32Array(n * 4), idx = [];
    for (let j = 0; j < gh; j++) for (let i = 0; i < gw; i++) {
      const k = j * gw + i, x = (i / (gw - 1) - .5) * w, z = (j / (gh - 1) - .5) * h, y = px[k * 4] / 255 * depth, c = curl * x * x;
      pos.set([x, c + y, z], k * 3); pos.set([x, c - y, z], (n + k) * 3);
      uv.set([i / (gw - 1), 1 - j / (gh - 1)], k * 2); uv.set([i / (gw - 1), 1 - j / (gh - 1)], (n + k) * 2);
    }
    for (let j = 0; j < gh - 1; j++) for (let i = 0; i < gw - 1; i++) {
      const a = j * gw + i, b = a + 1, c = a + gw, d = c + 1;
      if (!px[a * 4] && !px[b * 4] && !px[c * 4] && !px[d * 4]) continue;     // outside the item
      idx.push(a, c, b, b, c, d, n + a, n + b, n + c, n + b, n + d, n + c);
    }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
    g.setIndex(idx); g.computeVertexNormals(); g.computeBoundingSphere(); return g;
  }
  function loadItem(s) {   // fills s.parts ([geometry, material] at longest side 1, centred) and s.half (half its height)
    if (s.glb) return loader.loadAsync(BASE + s.glb).then(gl => {
      const grp = new THREE.Group(); gl.scene.updateMatrixWorld(true);
      const R = new THREE.Matrix4().makeRotationZ(s.lie ? Math.PI / 2 : 0).multiply(new THREE.Matrix4().makeRotationX(s.flat ? -Math.PI / 2 : 0));
      gl.scene.traverse(o => { if (o.isMesh) { const geo = toFloat(o.geometry.clone()); geo.applyMatrix4(o.matrixWorld); geo.applyMatrix4(R); grp.add(new THREE.Mesh(geo, o.material)); } });
      const box = new THREE.Box3().setFromObject(grp), sz = box.getSize(new THREE.Vector3()), c = box.getCenter(new THREE.Vector3()), k = 1 / Math.max(sz.x, sz.z);
      s.parts = grp.children.map(m => { m.geometry.translate(-c.x, -c.y, -c.z); m.geometry.scale(k, k, k); m.geometry.computeBoundingSphere(); return [m.geometry, m.material]; });
      s.half = sz.y * k / 2;
    });
    return Promise.all([loadTex(s.img + '.webp'), new THREE.ImageLoader().loadAsync(BASE + s.img + '-h.png')]).then(([tex, hm]) => {
      const ar = tex.image.width / tex.image.height;
      s.parts = [[inflate(hm, s.depth, Math.min(1, ar), Math.min(1, 1 / ar), s.curl || 0),
        new THREE.MeshStandardMaterial({ map: tex, alphaTest: .5, roughness: s.rough || .6, metalness: 0, envMapIntensity: .45 })]];
      s.half = Math.max(s.depth, .01);
    });
  }
  function drop(x, z) {
    const s = nextItem(); if (!s) return;
    const n = s.shower || 1;
    for (let i = 0; i < n; i++) spawnObj(s, n > 1 && i ? x + rnd(-.32, .32) * L : x, n > 1 && i ? z + rnd(-.24, .24) * L : z, i === 0, n > 1 ? rnd(.28, .5) : .5);
  }
  function spawnObj(s, x, z, lead, h) {
    const mesh = new THREE.Group(), mats = [];
    for (const [geo, m0] of s.parts) {
      const m = m0.clone(); m.transparent = true; if (s.env != null) m.envMapIntensity = s.env; mats.push(m);
      const part = new THREE.Mesh(geo, m); part.castShadow = true; part.layers.set(LAYER_FLOAT); mesh.add(part);
    }
    world.add(mesh);
    const spin = s.flutter ? 0 : s.sail ? 1.6 : 4.5;
    objs.push({ s, mesh, mats, x, z, y: cam.position.y * h, vy: 0, size: s.size * L, scale: 1, under: false,
      q: new THREE.Quaternion().setFromEuler(new THREE.Euler(rnd(-.6, .6), rnd(0, 6.28), rnd(-.6, .6))), w: new THREE.Vector3(rnd(-1, 1), rnd(-.4, .4), rnd(-1, 1)).setLength(spin),
      rot: rnd(0, 6.28), spin: rnd(-3, 3), ph: rnd(0, 6.28), phase: 'fall', t: 0, land: 0, alive: true, vx: 0, vz: 0, bob: 0, hd: 0, v: 0, lead, born: performance.now() });
    while (objs.length > 14) kill(objs[0]);
  }
  function kill(o) { o.alive = false; world.remove(o.mesh); o.mats.forEach(m => m.dispose()); objs.splice(objs.indexOf(o), 1); }
  function call(x, z, obj) {
    const now = performance.now();
    fish.forEach(f => {
      const d = Math.hypot(f.x - x, f.z - z);
      f.seek = { x, z, obj, side: Math.atan2(f.z - z, f.x - x) + rnd(-.5, .5), until: now + rnd(9000, 13000) };
      f.react = now + 120 + d * rnd(.3, .7);
    });
  }
  const tq = new THREE.Quaternion(), te = new THREE.Euler(0, 0, 0, 'YXZ'), tv = new THREE.Vector3();
  function restQ(o) {   // how an item sits once it's down: upright, turned to its heading, rocking a little
    let rx = Math.sin(o.t * 2.1 + o.ph) * .035 + Math.sin(o.t * 7) * .14 * o.bob, rz = Math.cos(o.t * 1.7 + o.ph) * .035 + Math.cos(o.t * 6) * .1 * o.bob;
    if (o.under) { rx *= .25; rz *= .25; }
    if (o.s.sail) { const hl = o.s.sail.heel * Math.min(1, o.v / 60); if (o.s.bow) rz += hl; else rx += hl; }   // heeled by the wind, a roll about the bow axis, so the sail shows from above
    te.set(rx, o.rot, rz); return tq.setFromEuler(te);
  }
  function land(o) {
    const s = o.s; o.y = D; o.phase = s.float ? 'float' : 'sink'; o.land = o.t; o.q0 = o.q.clone(); o.bob = 1;
    const k = s.flutter ? .25 : 1;
    splash(o.x, o.z, o.size * .45, .55 * k); splash(o.x, o.z, o.size * .2, -.25 * k);
    burst(o.x, o.z, Math.round((28 + o.size * .12) * k), (260 + o.size) * (s.flutter ? .5 : 1));
    o.vx = rnd(-14, 14); o.vz = rnd(-14, 14);
    if (s.sail) { o.hd = (o.x < W / 2 ? 0 : Math.PI) + rnd(-.3, .3); o.rot = -o.hd + (s.bow || 0); }
    if (s.drift) { o.hd = Math.atan2(H / 2 - o.z, W / 2 - o.x) + rnd(-.5, .5); o.spin = rnd(-.07, .07); }   // across, through the middle
    if (o.lead) call(o.x, o.z, o);
    if (!s.float) { o.under = true; o.mesh.children.forEach(p => p.layers.set(0)); o.mats.forEach(m => m.color.multiply(new THREE.Color(0xbcd6ff))); }
  }
  function stepObjs(dt, now) {
    for (const o of objs.slice()) {
      const s = o.s; o.t += dt;
      if (o.phase === 'fall') {
        if (s.flutter) {                         // paper: slow, swaying, tilting
          o.vy = Math.max(o.vy - 2400 * dt, -340); o.x += Math.sin(o.t * 4.2 + o.ph) * 70 * dt; o.z += Math.cos(o.t * 3.1 + o.ph) * 40 * dt;
          o.y += o.vy * dt; o.rot += Math.sin(o.t * 2.6 + o.ph) * 2.2 * dt; te.set(Math.sin(o.t * 5 + o.ph) * .45, o.rot, 0); o.q.setFromEuler(te);
        } else {                                 // everything else tumbles on the way down
          o.vy -= 7600 * dt; o.y += o.vy * dt;
          const a = o.w.length(); if (a) o.q.premultiply(tq.setFromAxisAngle(tv.copy(o.w).divideScalar(a), a * dt));
        }
        if (o.y <= D) land(o);
      } else {
        o.bob *= Math.exp(-dt * 1.6);
        if (o.phase === 'float') {
          o.y = D + s.half * o.size * (s.ride ?? .5) + Math.sin(o.t * 7) * 5 * o.bob + Math.sin(o.t * 1.3) * 1.2;
          if (s.sail) {                          // picks up the breeze and heads off across the pool, leaving a wake
            const sl = s.sail, cx = Math.cos(o.hd), cz = Math.sin(o.hd);
            if (o.t - o.land > .6) { o.v = Math.min(sl.speed, o.v + sl.speed * .45 * dt); o.hd += Math.sin(o.t * .45 + o.ph) * .07 * dt; o.rot = -o.hd + (s.bow || 0); }
            o.x += cx * o.v * dt; o.z += cz * o.v * dt;
            const bx = o.x - cx * o.size * .42, bz = o.z - cz * o.size * .42;
            if (o.v > 20 && Math.random() < dt * (sl.spray ? 30 : 14)) splash(bx + rnd(-.18, .18) * o.size * -cz, bz + rnd(-.18, .18) * o.size * cx, sl.spray ? 7 : 5, sl.spray ? .04 : .022);
            if (sl.spray && o.v > 60 && Math.random() < dt * 22) burst(bx, bz, 2, 120 + o.v * .5);    // spray off the foils
            if (o.x < -o.size || o.x > W + o.size || o.z < -o.size || o.z > H + o.size) { kill(o); continue; }
          } else if (s.drift) {                  // a pool float: slowly across, turning
            o.v = Math.min(24, o.v + 8 * dt); o.x += Math.cos(o.hd) * o.v * dt; o.z += Math.sin(o.hd) * o.v * dt; o.rot += o.spin * dt;
            if (o.x < -o.size || o.x > W + o.size || o.z < -o.size || o.z > H + o.size) { kill(o); continue; }
          } else {
            o.vx *= Math.exp(-dt * .25); o.vz *= Math.exp(-dt * .25); o.x += o.vx * dt; o.z += o.vz * dt; o.rot += o.spin * .05 * dt;
            for (const f of fish) {                         // the koi nose at it, and eat it if it's food
              const [hx, hz] = f.head || [f.x, f.z], d = Math.hypot(hx - o.x, hz - o.z);
              if (d < o.size * .55 * o.scale + 14 && f.seek) {
                o.vx += (o.x - hx) / (d || 1) * 12 * dt * 10; o.vz += (o.z - hz) / (d || 1) * 12 * dt * 10;
                if (s.food && now - f.nib > 700) { f.nib = now; o.scale *= .86; splash(o.x, o.z, 6, .05); burst(o.x, o.z, 3, 120); }
              }
            }
            if (o.scale < .32) { splash(o.x, o.z, 10, .08); kill(o); continue; }
          }
        } else {                                 // sinking: down to the floor, air coming up for a moment
          const rest = s.half * o.size * o.scale + 1;
          o.y += (rest - o.y) * Math.min(1, dt * 1.3); o.x += Math.sin(o.t * 2.1) * 3 * dt;
          if (o.t - o.land < 2.6 && Math.random() < dt * 10) splash(o.x + rnd(-.25, .25) * o.size, o.z + rnd(-.25, .25) * o.size, 4, .02);
        }
        const k = Math.min(1, (o.t - o.land) / .8), r = restQ(o);
        if (k < 1) o.q.slerpQuaternions(o.q0, r, 1 - Math.pow(1 - k, 3)); else o.q.copy(r);
      }
      const age = (now - o.born) / 1000, life = s.sail || s.drift ? 60 : 32;
      const op = Math.min(1, Math.max(0, (life - age) / 3)); o.mats.forEach(m => { m.opacity = op; });
      if (age > life) { kill(o); continue; }
      o.mesh.position.set(o.x, o.y, o.z); o.mesh.quaternion.copy(o.q); o.mesh.scale.setScalar(o.size * o.scale);
    }
  }

  // ---------------- layout
  function layout() {
    const r = scene0.getBoundingClientRect(); W = Math.max(1, r.width); H = Math.max(1, r.height);
    D = H * .2; L = Math.max(120, Math.min(W, H * 2.2) * (small() ? .28 : .155));
    renderer.setPixelRatio(lowRes ? 1 : Math.min(devicePixelRatio || 1, small() ? 2 : 1.5)); renderer.setSize(W, H, false);
    const dist = (H / 2) / Math.tan(THREE.MathUtils.degToRad(cam.fov / 2));
    cam.aspect = W / H; cam.position.set(W / 2, dist, H / 2); cam.lookAt(W / 2, 0, H / 2); cam.updateProjectionMatrix();
    if (floor) { floor.geometry.dispose(); floor.geometry = floorGeo(); }
    sun.position.copy(SUN).multiplyScalar(Math.max(W, H) * 2).add(new THREE.Vector3(W / 2, 0, H / 2)); sun.target.position.set(W / 2, 0, H / 2);
    const s = Math.max(W, H) * .62, sc = sun.shadow.camera;
    sc.left = -s; sc.right = s; sc.top = s; sc.bottom = -s; sc.near = 1; sc.far = Math.max(W, H) * 5; sc.updateProjectionMatrix();
    sun.shadow.mapSize.set(small() ? 1024 : 2048, small() ? 1024 : 2048); sun.shadow.map && (sun.shadow.map.dispose(), sun.shadow.map = null);
    const pr = renderer.getPixelRatio();
    rtUnder && rtUnder.dispose();
    rtUnder = new THREE.WebGLRenderTarget(Math.round(W * pr), Math.round(H * pr), { samples: 4, type: THREE.HalfFloatType });
    makeSim();
    shared.aspect.value = W / H;
    fish.forEach(f => { f.x = Math.min(f.x, W - 20); f.z = Math.min(f.z, H - 20); f.grp.scale.setScalar(L * f.scale); });
  }
  let plateFit = [1, 1, 0, 0], plateTex = null;
  function floorGeo() {   // the plate covers the view like object-fit: cover
    const g = new THREE.PlaneGeometry(W, H).rotateX(-Math.PI / 2); g.translate(W / 2, 0, H / 2);
    const pa = plateTex.image.width / plateTex.image.height, va = W / H;
    const rx = va > pa ? 1 : va / pa, ry = va > pa ? pa / va : 1, ox = (1 - rx) * .55, oy = (1 - ry) / 2;
    plateTex.repeat.set(rx, ry); plateTex.offset.set(ox, oy);
    return g;
  }

  // ---------------- input
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2(), water = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), hit = new THREE.Vector3();
  const blocked = e => e.target.closest('a,button,input,nav,.nav,.plate__cta,[data-no-drop]');
  let live = false, touched = false;
  function press(e) {
    if (!live || blocked(e)) return; touched = true;
    const r = canvas.getBoundingClientRect();
    ndc.set((e.clientX - r.left) / r.width * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, cam); water.constant = -D;
    if (ray.ray.intersectPlane(water, hit)) drop(hit.x, hit.z);
  }
  scene0.addEventListener('pointerdown', e => { if (e.pointerType === 'mouse') press(e); });
  scene0.addEventListener('click', e => { if (e.pointerType && e.pointerType !== 'mouse') press(e); });

  // ---------------- frame
  let run = true, last = 0, lowRes = false, q0 = 0, qn = 0, qDone = false;   // q*: the first seconds decide the quality
  const floaters = () => objs.filter(o => !o.under);
  const ghost = (fl, on) => fl.forEach(o => o.mats.forEach(m => { m.colorWrite = !on; m.depthWrite = !on; }));
  function frame(now) {
    if (!run) return; requestAnimationFrame(frame);
    const dt = Math.min(.05, (now - (last || now)) / 1000); last = now;
    if (!qDone && !document.hidden) {                 // slow machine: drop to 1x pixels; very slow: keep the still
      if (!q0) q0 = now; qn++;
      if (now - q0 > 4000) {
        qDone = true; const fps = qn * 1000 / (now - q0);
        if (fps < 25) { run = false; scene0.classList.remove('koi-live'); setTimeout(() => { renderer.dispose(); canvas.remove(); }, 1000); return; }
        if (fps < 45 && !lowRes) { lowRes = true; layout(); }
      }
    }
    shared.time.value = now / 1000;
    fish.forEach(f => steer(f, dt, now)); stepObjs(dt, now); stepDrops(dt);
    simStep(); simStep();
    shared.tH.value = simA.texture; shared.texel.value.set(1 / simW, 1 / simH);
    // 1. under the surface (floating objects write nothing but still cast shadows)
    const fl = floaters(); ghost(fl, true);
    cam.layers.enable(0); cam.layers.enable(LAYER_FLOAT); cam.layers.disable(LAYER_DROPS);
    renderer.shadowMap.needsUpdate = true;
    renderer.setRenderTarget(rtUnder); renderer.setClearColor(0x0b3fb0, 1); renderer.clear(); renderer.render(world, cam);
    // 2. the surface
    surfMat.uniforms.tUnder.value = rtUnder.texture;
    renderer.setRenderTarget(null); renderer.render(surfScene, ortho);
    // 3. on top: floating objects and splash drops
    ghost(fl, false);
    cam.layers.set(LAYER_FLOAT); cam.layers.enable(LAYER_DROPS);
    renderer.autoClear = false; renderer.clearDepth(); renderer.render(world, cam); renderer.autoClear = true;
    cam.layers.set(0);
  }

  // ---------------- load
  Promise.all([
    loadTex(small() ? 'plate-flat-1600.webp' : 'plate-flat.webp'),
    Promise.allSettled(FISH.map(f => loader.loadAsync(BASE + f.src).then(g => normalise(g, f.fix || {})))).then(r => r.filter(x => x.status === 'fulfilled').map(x => x.value)),
  ]).then(([plate, models]) => {
    if (!models.length) throw new Error('no koi models');
    plateTex = plate; plateTex.wrapS = plateTex.wrapT = THREE.ClampToEdgeWrapping;
    floorMat.map = plateTex; floorMat.needsUpdate = true;
    layout();
    floor = new THREE.Mesh(floorGeo(), floorMat); floor.receiveShadow = true; world.add(floor);
    spawn(models);
    addEventListener('resize', layout);
    new IntersectionObserver(es => { const v = es[0].isIntersecting; if (v && !run) { run = true; last = 0; requestAnimationFrame(frame); } else if (!v) run = false; }).observe(scene0);
    document.addEventListener('visibilitychange', () => { if (document.hidden) run = false; else if (!run) { run = true; last = 0; requestAnimationFrame(frame); } });
    requestAnimationFrame(t => { frame(t); live = true; scene0.classList.add('koi-live'); });
    if (/[?&]debug\b/.test(location.search)) window.__koi = { fish, objs, items: ITEMS, get L() { return L; }, get D() { return D; }, drop, pick: i => { bag.unshift(typeof i === 'number' ? i : ITEMS.findIndex(x => (x.glb || x.img).includes(i))); } };
    const first = loadItem(ITEMS[0]);
    ITEMS.slice(1).forEach(s => loadItem(s).catch(e => console.warn('koi pool item:', s.glb || s.img, e)));
    first.then(() => setTimeout(() => { if (!touched && live) drop(W * .3, H * .55); }, 1800)).catch(() => {});
  }).catch(err => { console.warn('koi pool:', err); renderer.dispose(); canvas.remove(); });
}
