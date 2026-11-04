/* Poppy field hero, 2.5D. A photo of California poppies rebuilt as a scene: the sky, hills and field are one surface
   lifted to their real depth (from a depth map), and the tall near poppies are a second, cut-out layer standing in front.
   The camera drifts and follows the pointer, so near flowers slide across the far field (true parallax).
   Click or tap and one of Ballast's things (an F50, a 4Runner, Jordans, a Starbucks cup, peptide vials...) falls out
   of the sky, tumbles, rights itself and lands in the field: behind the near poppies, half in the flowers, with a puff
   of petals. Farther drops land higher and smaller because they really are farther away.
   No WebGL2 or reduced motion: the photo stays. World: camera at the origin looking down -z, y up, units ~ metres. */
import * as THREE from 'three';
import { GLTFLoader } from '/hero/vendor/jsm/loaders/GLTFLoader.js';
import { RoomEnvironment } from '/hero/vendor/jsm/environments/RoomEnvironment.js';

const BASE = '/hero/koi/', FIELD = '/hero/field/';
const IMG = { w: 2400, h: 1339 }, FOV = 40;
const FAR = 90, EYE = .35, HORIZON = .745;               // sky distance; camera height above the field (m); the horizon row
// near poppies: their distance from the depth map, kept in front of the nearest ground anyone can drop on
const flowerDist = d => Math.min(3.3, Math.max(1.5, 1.7 / Math.max(.3, d)));
const ITEMS = [
  { glb: 'item-4runner.glb', size: .9 },
  { img: 'obj-basketball', size: .3, sphere: true, rough: .75 },
  { glb: 'item-jordan.glb', size: .45 },
  { glb: 'item-cup.glb', size: .3 },
  { img: 'obj-bill', size: .4, depth: .004, curl: .1, rough: .9, shower: 6 },
  { glb: 'item-lgg2.glb', size: .3, env: .2 },
  { glb: 'item-coffee.glb', size: .32 },
  { img: 'obj-donut', size: .3, depth: .146, rough: .5 },
  { glb: 'item-m3.glb', size: .95 },
  { glb: 'item-hint.glb', size: .32 },
  { glb: 'item-samba.glb', size: .45 },
  { glb: 'item-vial.glb', size: .22, shower: 3 },
  { img: 'obj-dalgona', size: .28, depth: .022, rough: .5 },
  { img: 'obj-baseball', size: .2, sphere: true, rough: .65 },
];

const scene0 = document.getElementById('scene');
const still = scene0 && scene0.querySelector('.scene__bg');
const idle = (fn, t = 1500) => ('requestIdleCallback' in window ? requestIdleCallback(fn, { timeout: t }) : setTimeout(fn, 200));
if (scene0 && still && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const go = () => idle(boot, 2000);
  if (document.readyState === 'complete') go(); else addEventListener('load', go, { once: true });
}

function boot() {
  const canvas = document.createElement('canvas');
  canvas.className = 'scene__koi'; canvas.setAttribute('aria-hidden', 'true');
  still.after(canvas);
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true }); } catch (e) { canvas.remove(); return; }
  if (!renderer.capabilities.isWebGL2) { renderer.dispose(); canvas.remove(); return; }
  canvas.addEventListener('webglcontextlost', e => { e.preventDefault(); canvas.remove(); scene0.classList.remove('koi-live'); });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const small = () => innerWidth < 900, rnd = (a, b) => a + Math.random() * (b - a);

  const world = new THREE.Scene();
  const A = IMG.w / IMG.h, S = 2 * Math.tan(THREE.MathUtils.degToRad(FOV / 2));
  const cam = new THREE.PerspectiveCamera(FOV, A, .1, 400);
  world.add(new THREE.HemisphereLight(0xd6e6ff, 0xff9a3c, 1.6));          // blue sky above, orange field bouncing up
  const sun = new THREE.DirectionalLight(0xfff1dc, 2.4); sun.position.set(-.6, 1, .5); world.add(sun);
  const pmrem = new THREE.PMREMGenerator(renderer);
  world.environment = pmrem.fromScene(new RoomEnvironment(), .04).texture;
  // the photo was shot looking slightly up: tilt the camera so the horizon row is level and the field is the plane y = -EYE
  const PITCH = Math.atan((HORIZON - .5) * S), TILT = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), PITCH);
  cam.quaternion.copy(TILT);
  const ray = (u, v) => new THREE.Vector3((u - .5) * A * S, (.5 - v) * S, -1);   // camera space, through photo point (u, v) at z = -1
  const groundDist = v => { const dy = (v - HORIZON) * S; return dy > EYE / FAR ? Math.min(FAR, EYE / dy) : FAR; };
  const at = (u, v, t) => ray(u, v).multiplyScalar(t).applyQuaternion(TILT);   // world point at distance t along that ray

  // ---------------- the field: depth maps -> two meshes that line up exactly with the photo from the camera
  const readGray = img => { const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
    const x = c.getContext('2d', { willReadFrequently: true }); x.drawImage(img, 0, 0); const p = x.getImageData(0, 0, c.width, c.height).data;
    const a = new Float32Array(c.width * c.height); for (let i = 0; i < a.length; i++) a[i] = p[i * 4] / 255; return { w: c.width, h: c.height, a }; };
  const sample = (D, u, v) => { const x = Math.min(D.w - 1.001, Math.max(0, u * (D.w - 1))), y = Math.min(D.h - 1.001, Math.max(0, v * (D.h - 1)));
    const i = Math.floor(x), j = Math.floor(y), fx = x - i, fy = y - j, a = D.a, w = D.w;
    return (a[j * w + i] * (1 - fx) + a[j * w + i + 1] * fx) * (1 - fy) + (a[(j + 1) * w + i] * (1 - fx) + a[(j + 1) * w + i + 1] * fx) * fy; };
  function surface(T, v0, nx, ny) {   // a grid over the photo from row v0 down, each vertex pushed out along its ray to distance T(u, v)
    const g = new THREE.PlaneGeometry(1, 1, nx, ny), P = g.attributes.position, UV = g.attributes.uv;
    for (let i = 0; i < P.count; i++) {
      const u = UV.getX(i), v = v0 + (1 - UV.getY(i)) * (1 - v0);
      const p = at(u, v, T(u, v));
      P.setXYZ(i, p.x, p.y, p.z); UV.setXY(i, u, 1 - v);
    }
    g.computeBoundingSphere(); return g;
  }
  let backD = null;
  // ---------------- items (same models as before; loaded one at a time while the page is idle)
  const loader = new GLTFLoader();
  const TEX = ['map', 'normalMap', 'roughnessMap', 'metalnessMap', 'aoMap', 'emissiveMap'];
  function shrink(mat, max) {
    TEX.forEach(k => {
      const t = mat[k], im = t && t.image; if (!im || !im.width || im.width <= max || t.userData.shrunk) return;
      const s = max / Math.max(im.width, im.height), cv = document.createElement('canvas');
      cv.width = Math.round(im.width * s); cv.height = Math.round(im.height * s); cv.getContext('2d').drawImage(im, 0, 0, cv.width, cv.height);
      im.close && im.close(); t.image = cv; t.userData.shrunk = true; t.needsUpdate = true;
    });
  }
  const loadTex = src => new Promise((ok, no) => new THREE.TextureLoader().load(BASE + src, t => { t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; ok(t); }, undefined, no));
  const toFloat = g => {
    for (const k in g.attributes) { const at = g.attributes[k]; if (at.array instanceof Float32Array) continue;
      const f = new Float32Array(at.count * at.itemSize); for (let i = 0; i < at.count; i++) for (let c = 0; c < at.itemSize; c++) f[i * at.itemSize + c] = at.getComponent(i, c);
      g.setAttribute(k, new THREE.BufferAttribute(f, at.itemSize)); }
    return g;
  };
  function inflate(img, depth, w, h, curl) {   // a height map lifted into a closed shell
    const gw = img.width, gh = img.height, cv = document.createElement('canvas'); cv.width = gw; cv.height = gh;
    const c2 = cv.getContext('2d', { willReadFrequently: true }); c2.drawImage(img, 0, 0); const px = c2.getImageData(0, 0, gw, gh).data;
    const n = gw * gh, pos = new Float32Array(n * 6), uv = new Float32Array(n * 4), idx = [];
    for (let j = 0; j < gh; j++) for (let i = 0; i < gw; i++) {
      const k = j * gw + i, x = (i / (gw - 1) - .5) * w, z = (j / (gh - 1) - .5) * h, y = px[k * 4] / 255 * depth, c = curl * x * x;
      pos.set([x, c + y, z], k * 3); pos.set([x, c - y, z], (n + k) * 3);
      uv.set([i / (gw - 1), 1 - j / (gh - 1)], k * 2); uv.set([i / (gw - 1), 1 - j / (gh - 1)], (n + k) * 2);
    }
    const inside = (i, j) => i >= 0 && j >= 0 && i < gw - 1 && j < gh - 1 && (px[(j * gw + i) * 4] || px[(j * gw + i + 1) * 4] || px[((j + 1) * gw + i) * 4] || px[((j + 1) * gw + i + 1) * 4]);
    const wall = (p, q) => idx.push(p, q, n + p, q, n + q, n + p);
    for (let j = 0; j < gh - 1; j++) for (let i = 0; i < gw - 1; i++) {
      if (!inside(i, j)) continue;
      const a = j * gw + i, b = a + 1, c = a + gw, d = c + 1;
      idx.push(a, c, b, b, c, d, n + a, n + b, n + c, n + b, n + d, n + c);
      if (!inside(i, j - 1)) wall(b, a); if (!inside(i, j + 1)) wall(c, d);
      if (!inside(i - 1, j)) wall(a, c); if (!inside(i + 1, j)) wall(d, b);
    }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
    g.setIndex(idx); g.computeVertexNormals(); g.computeBoundingSphere(); return g;
  }
  function loadRaw(s) {   // fills s.parts ([geometry, material], longest side 1, centred) and s.half (half its height)
    if (s.glb) return loader.loadAsync(BASE + s.glb).then(gl => {
      const grp = new THREE.Group(); gl.scene.updateMatrixWorld(true);
      const R = new THREE.Matrix4().makeRotationX(s.flat ? -Math.PI / 2 : 0);
      gl.scene.traverse(o => { if (o.isMesh) { const geo = toFloat(o.geometry.clone()); geo.applyMatrix4(o.matrixWorld); geo.applyMatrix4(R); grp.add(new THREE.Mesh(geo, o.material)); } });
      const box = new THREE.Box3().setFromObject(grp), sz = box.getSize(new THREE.Vector3()), c = box.getCenter(new THREE.Vector3()), k = 1 / Math.max(sz.x, sz.y, sz.z);
      s.parts = grp.children.map(m => { shrink(m.material, small() ? 256 : 512); m.geometry.translate(-c.x, -c.y, -c.z); m.geometry.scale(k, k, k); m.geometry.computeBoundingSphere(); return [m.geometry, m.material]; });
      s.half = sz.y * k / 2;
    });
    if (s.sphere) return loadTex(s.img + '.webp').then(tex => {
      const geo = new THREE.SphereGeometry(.5, 48, 32), P = geo.attributes.position, uv = geo.attributes.uv;
      for (let i = 0; i < P.count; i++) uv.setXY(i, P.getX(i) + .5, .5 - P.getZ(i));
      s.parts = [[geo, new THREE.MeshStandardMaterial({ map: tex, roughness: s.rough || .6, metalness: 0 })]]; s.half = .5; s.ball = true;
    });
    return Promise.all([loadTex(s.img + '.webp'), new THREE.ImageLoader().loadAsync(BASE + s.img + '-h.png')]).then(([tex, hm]) => {
      const ar = tex.image.width / tex.image.height;
      s.parts = [[inflate(hm, s.depth, Math.min(1, ar), Math.min(1, 1 / ar), s.curl || 0),
        new THREE.MeshStandardMaterial({ map: tex, alphaTest: .5, side: THREE.DoubleSide, roughness: s.rough || .6, metalness: 0 })]];
      s.half = Math.max(s.depth, .01); s.card = true;
    });
  }
  const upload = s => (s.parts || []).forEach(([, m]) => TEX.forEach(k => m[k] && renderer.initTexture(m[k])));
  const load = s => loadRaw(s).then(() => upload(s));

  let bag = [];
  function nextItem() {
    if (!bag.length) { bag = ITEMS.map((_, i) => i).sort(() => Math.random() - .5); }
    const i = bag.findIndex(k => ITEMS[k].parts);
    if (i >= 0) return ITEMS[bag.splice(i, 1)[0]];
    const ready = ITEMS.filter(x => x.parts); return ready.length ? ready[Math.floor(Math.random() * ready.length)] : null;
  }

  // ---------------- view: crop the photo exactly like the still image (cover, 150% tall, pinned to the bottom)
  let W = 1, H = 1, FOCAL = 1, vy0 = 0, vh = 1, vx0 = 0, vw = 1, floorV = 1;
  function layout() {
    const r = scene0.getBoundingClientRect(); W = Math.max(1, r.width); H = Math.max(1, r.height);
    const b = still.getBoundingClientRect(), bt = b.top - r.top, bw = b.width, bh = b.height;   // the photo's box (set by the page)
    const k = Math.max(bw / IMG.w, bh / IMG.h);                       // object-fit: cover, pinned to the box's bottom
    vw = W / k; vh = H / k; vx0 = (IMG.w - vw) / 2; vy0 = -(bt + (bh - IMG.h * k)) / k;
    cam.aspect = A; cam.setViewOffset(IMG.w, IMG.h, vx0, vy0, vw, vh); cam.updateProjectionMatrix();
    FOCAL = H / (S * vh / IMG.h);                                   // screen px per world unit at distance 1
    const plate = scene0.querySelector('.plate');
    const floorPx = plate ? plate.getBoundingClientRect().top - r.top - 6 : H;   // the lowest screen row things may land on
    floorV = (vy0 + floorPx / H * vh) / IMG.h;
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5)); renderer.setSize(W, H, false);
  }
  const toUV = (px, py) => [(vx0 + px / W * vw) / IMG.w, (vy0 + py / H * vh) / IMG.h];
  const horizonV = HORIZON;

  // ---------------- drops
  const objs = [];
  function drop(px, py) {
    const s = nextItem(); if (!s || !backD) return;
    const n = s.shower || 1;
    for (let i = 0; i < n; i++) spawn(s, i ? px + rnd(-.1, .1) * W : px, py, i * rnd(.08, .2));
  }
  function spawn(s, px, py, delay) {
    // clicks higher on the screen land farther away: pick a row in the field between the horizon and the dark band
    const t = Math.min(1, Math.max(0, 1 - py / H));
    const f = Math.min(.95, Math.max(.04, t * 1.15 - .12 + rnd(-.08, .08)));     // 0 nearest, 1 at the horizon
    const [u] = toUV(px, py);
    const v = floorV + (horizonV + .012 - floorV) * Math.pow(f, .75);
    const G = at(u, v, groundDist(v));
    const size = s.size * 1.15 * rnd(.92, 1.08);
    const mesh = new THREE.Group(), mats = [];
    for (const [geo, m0] of s.parts) { const m = m0.clone(); if (s.env != null) m.envMapIntensity = s.env; mats.push(m); mesh.add(new THREE.Mesh(geo, m)); }
    const rest = new THREE.Quaternion().setFromEuler(s.ball ? new THREE.Euler(1.45, 0, rnd(-3.1, 3.1), 'XYZ')
      : new THREE.Euler(s.card ? 1.2 : rnd(.05, .2), s.tip ? rnd(-.5, .5) : rnd(-1, 1), s.tip ? s.tip * (Math.random() < .5 ? 1 : -1) : rnd(-.08, .08), 'YXZ'));
    const spin = new THREE.Quaternion().setFromEuler(new THREE.Euler(rnd(-3, 3), rnd(-3, 3), rnd(-3, 3)));
    const topY = at(u, vy0 / IMG.h, -G.z / Math.cos(PITCH)).y;           // the top of the view at that distance
    const o = { s, mesh, mats, G, size, rest, spin, w: new THREE.Vector3(rnd(-4, 4), rnd(-4, 4), rnd(-4, 4)),
      y: Math.max(topY, G.y) + size * 1.2, vy: 0, g: 3.2 * Math.max(2, -G.z), born: performance.now() + delay * 1000, landed: 0, bounces: 0,
      sink: 0, sinkTo: s.card ? .15 : s.ball ? .3 : .22, alive: true };
    mesh.visible = false; mesh.scale.setScalar(size); world.add(mesh); objs.push(o);
    while (objs.length > (small() ? 12 : 20)) kill(objs.find(x => x.landed) || objs[0]);
  }
  function kill(o) { o.alive = false; world.remove(o.mesh); o.mats.forEach(m => m.dispose()); objs.splice(objs.indexOf(o), 1); }

  // petals: a little puff of orange where something lands
  const NP = 400, pPos = new Float32Array(NP * 3), pVel = new Float32Array(NP * 3), pLife = new Float32Array(NP);
  const pGeo = new THREE.BufferGeometry(); pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  const dot = document.createElement('canvas'); dot.width = dot.height = 32;
  { const c = dot.getContext('2d'), g = c.createRadialGradient(16, 16, 0, 16, 16, 16); g.addColorStop(0, '#fff'); g.addColorStop(.55, 'rgba(255,255,255,.9)'); g.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = g; c.beginPath(); c.ellipse(16, 16, 15, 10, .5, 0, 7); c.fill(); }
  const pMat = new THREE.PointsMaterial({ color: 0xff8f1f, map: new THREE.CanvasTexture(dot), size: .09, sizeAttenuation: true, transparent: true, depthWrite: false });
  const petals = new THREE.Points(pGeo, pMat); petals.frustumCulled = false; world.add(petals);
  let pNext = 0;
  function puff(P, k) {
    for (let i = 0; i < 26; i++) {
      const j = pNext = (pNext + 1) % NP, a = rnd(.2, Math.PI - .2), sp = rnd(1, 3) * k, b = rnd(0, 6.28);
      pPos.set([P.x + rnd(-.3, .3) * k, P.y, P.z + rnd(-.3, .3) * k], j * 3);
      pVel.set([Math.cos(a) * sp * Math.cos(b), Math.sin(a) * sp, Math.cos(a) * sp * Math.sin(b)], j * 3); pLife[j] = rnd(.6, 1.1);
    }
  }
  function stepPetals(dt) {
    for (let j = 0; j < NP; j++) {
      if (pLife[j] <= 0) { pPos[j * 3 + 1] = -999; continue; }
      pLife[j] -= dt; pVel[j * 3 + 1] -= 7 * dt;
      for (let c = 0; c < 3; c++) pPos[j * 3 + c] += pVel[j * 3 + c] * dt;
    }
    pGeo.attributes.position.needsUpdate = true;
  }

  const q = new THREE.Quaternion(), tmp = new THREE.Quaternion(), axis = new THREE.Vector3();
  function step(dt, now) {
    for (const o of objs.slice()) {
      if (now < o.born) continue;
      o.mesh.visible = true;
      const half = o.s.half * o.size, ground = o.G.y + half;
      if (!o.landed) {
        o.vy -= o.g * dt; o.y += o.vy * dt;
        const right = 1 - Math.min(1, Math.max(0, o.y - ground) / (o.g * .25));   // right itself over the last stretch
        axis.copy(o.w).normalize(); o.spin.multiply(tmp.setFromAxisAngle(axis, o.w.length() * dt * (1 - right)));
        o.mesh.quaternion.copy(q.copy(o.spin).slerp(o.rest, right * right * (3 - 2 * right)));
        if (o.y <= ground) {
          o.y = ground;
          if (o.bounces < 1 && o.vy < -o.g * .25) { o.vy = -o.vy * .2; o.bounces++; puff(o.G, Math.max(.15, o.size * .5)); }
          else { o.landed = now; o.vy = 0; o.mesh.quaternion.copy(o.rest); if (!o.bounces) puff(o.G, Math.max(.15, o.size * .5)); }
        }
      } else if (o.sink < o.sinkTo) o.sink = Math.min(o.sinkTo, o.sink + dt * .8);
      o.mesh.position.set(o.G.x, o.y - o.sink * half * 2, o.G.z);
      const age = o.landed ? (now - o.landed) / 1000 : 0;
      if (age > 45) { const f = Math.min(1, (age - 45) / 2); o.mats.forEach(m => { m.transparent = true; m.opacity = 1 - f; }); if (f >= 1) kill(o); }
    }
  }

  // ---------------- camera: a slow drift, plus the pointer
  const look = { x: 0, y: 0, tx: 0, ty: 0 };
  scene0.addEventListener('pointermove', e => { if (e.pointerType !== 'mouse') return; const r = scene0.getBoundingClientRect();
    look.tx = (e.clientX - r.left) / r.width * 2 - 1; look.ty = (e.clientY - r.top) / r.height * 2 - 1; });
  scene0.addEventListener('pointerleave', () => { look.tx = look.ty = 0; });
  function moveCam(now, dt) {
    look.x += (look.tx - look.x) * Math.min(1, dt * 2.5); look.y += (look.ty - look.y) * Math.min(1, dt * 2.5);
    const t = now / 1000, px = 22 / FOCAL * 2;                         // the nearest flowers slide about 22 px
    cam.position.set((look.x + Math.sin(t * .23) * .35) * px, (-look.y * .5 + Math.sin(t * .31 + 1) * .2) * px, 0);
  }

  // ---------------- loop
  let raf = 0, last = 0, onScreen = true, live = false;
  function frame(now) {
    raf = 0; if (!onScreen || document.hidden) { last = 0; return; }
    const dt = Math.min(.04, (now - (last || now)) / 1000); last = now;
    moveCam(now, dt); step(dt, now); stepPetals(dt);
    renderer.render(world, cam);
    raf = requestAnimationFrame(frame);
  }
  const wake = () => { if (!raf && live && onScreen && !document.hidden) raf = requestAnimationFrame(frame); };
  new IntersectionObserver(es => { onScreen = es[0].isIntersecting; wake(); }).observe(scene0);
  document.addEventListener('visibilitychange', wake);

  // ---------------- input
  const blocked = e => e.target.closest('a,button,input,nav,.nav,.plate,[data-no-drop]');
  let touched = false;
  function press(e) { if (!live || blocked(e)) return; touched = true; const r = canvas.getBoundingClientRect(); drop(e.clientX - r.left, e.clientY - r.top); }
  scene0.addEventListener('pointerdown', e => { if (e.pointerType === 'mouse') press(e); });
  scene0.addEventListener('click', e => { if (e.pointerType && e.pointerType !== 'mouse') press(e); });

  // ---------------- start: build the field, then bring in the items one at a time
  const tl = new THREE.TextureLoader(), il = new THREE.ImageLoader();
  const tex = src => tl.loadAsync(FIELD + src).then(t => { t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t; });
  Promise.all([tex('back.webp'), tex('front.webp'), il.loadAsync(FIELD + 'back-depth.png'), il.loadAsync(FIELD + 'front-depth.png')])
    .then(([bT, fT, bD, fD]) => {
      backD = readGray(bD); const frontD = readGray(fD);
      const CARPET = .06, backT = (u, v) => Math.min(FAR, groundDist(v) * (EYE - CARPET) / EYE), frontT = (u, v) => Math.min(flowerDist(sample(frontD, u, v)), backT(u, v) * .9);   // always just in front of the ground behind it
      const back = new THREE.Mesh(surface(backT, 0, 200, 140), new THREE.MeshBasicMaterial({ map: bT, toneMapped: false }));
      const front = new THREE.Mesh(surface(frontT, .5, 220, 64), new THREE.MeshBasicMaterial({ map: fT, alphaTest: .45, toneMapped: false }));
      world.add(back, front);
      layout(); addEventListener('resize', layout); document.fonts && document.fonts.ready.then(layout);
      return renderer.compileAsync(world, cam).catch(() => {});
    })
    .then(() => {
      live = true; scene0.classList.add('koi-live'); wake();
      const order = ITEMS.slice();
      load(order.shift()).then(() => {
        const auto = [[.66, .5, 900], [.84, .38, 5200], [.46, .62, 9800]];
        auto.forEach(([fx, fy, t]) => setTimeout(() => { if (!touched) drop(W * fx, H * fy); }, t));
      }).catch(() => {});
      const pump = () => { const s = order.shift(); if (!s) return;
        const twin = ITEMS.find(x => x !== s && x.parts && x.glb && x.glb === s.glb);
        (twin ? Promise.resolve().then(() => { s.parts = twin.parts; s.half = twin.half; }) : load(s))
          .catch(e => console.warn('field item:', s.glb || s.img, e)).then(() => idle(pump, 3000)); };
      idle(pump, 3000);
    })
    .catch(e => { console.warn('field:', e); renderer.dispose(); canvas.remove(); });
  if (/[?&]debug\b/.test(location.search)) window.__field = { objs, items: ITEMS, drop, cam, horizonV, get floorV() { return floorV; }, depthAt: (u, v) => sample(backD, u, v), scr: o => { const p = o.mesh.position.clone().project(cam); return [Math.round((p.x + 1) / 2 * W), Math.round((1 - p.y) / 2 * H), +(-o.G.z).toFixed(2), Math.round(o.size * FOCAL / -o.G.z)]; }, gd: groundDist,
    pick: n => { bag = [ITEMS.findIndex(x => (x.glb || x.img).includes(n))]; } };
}
