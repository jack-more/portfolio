// Ambient 3D runner for Ballast Notes: an original self-playing endless runner down an LA street at sunset.
// The runner (white BALLAST.LA tee, green shorts) dodges, jumps and slides on its own; scrolling the article speeds it up.
import * as THREE from '/hero/vendor/three.module.min.js';

export function runner(box, hud) {
  const canvas = document.createElement('canvas'); box.prepend(canvas);
  const R = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'low-power' });
  R.setPixelRatio(Math.min(devicePixelRatio || 1, 1.6));
  R.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene();
  const SKY = new THREE.Color('#F7A04A');
  scene.fog = new THREE.Fog(SKY, 18, 70);
  const cam = new THREE.PerspectiveCamera(58, 1, .1, 120);

  // sky: vertical gradient dome + sun
  const skyMat = new THREE.ShaderMaterial({ side: THREE.BackSide, depthWrite: false, fog: false,
    uniforms: {}, vertexShader: 'varying vec3 p;void main(){p=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
    fragmentShader: 'varying vec3 p;void main(){float h=normalize(p).y;vec3 top=vec3(.04,.36,.96),mid=vec3(.98,.55,.25),low=vec3(1.,.75,.35);vec3 c=h>0.08?mix(mid,top,smoothstep(.08,.55,h)):mix(low,mid,smoothstep(-.05,.08,h));gl_FragColor=vec4(c,1.);}' });
  scene.add(new THREE.Mesh(new THREE.SphereGeometry(100, 24, 16), skyMat));
  const sun = new THREE.Mesh(new THREE.CircleGeometry(9, 48), new THREE.MeshBasicMaterial({ color: '#FFD27A', fog: false }));
  sun.position.set(0, 7, -95); scene.add(sun);
  const halo = new THREE.Mesh(new THREE.CircleGeometry(16, 48), new THREE.MeshBasicMaterial({ color: '#F86608', transparent: true, opacity: .35, fog: false }));
  halo.position.set(0, 7, -96); scene.add(halo);

  scene.add(new THREE.HemisphereLight('#FFE3C0', '#3A3F7A', 1.6));
  const sunL = new THREE.DirectionalLight('#FFD9A8', 2.2); sunL.position.set(-4, 8, -10); scene.add(sunL);
  const fill = new THREE.DirectionalLight('#9DB8FF', .7); fill.position.set(4, 5, 8); scene.add(fill);

  // road
  const road = new THREE.Mesh(new THREE.PlaneGeometry(9, 200), new THREE.MeshStandardMaterial({ color: '#23263A', roughness: .9 }));
  road.rotation.x = -Math.PI / 2; road.position.z = -80; scene.add(road);
  const side = new THREE.MeshStandardMaterial({ color: '#E9D8BE', roughness: 1 });
  [-1, 1].forEach(s => { const m = new THREE.Mesh(new THREE.PlaneGeometry(30, 200), side); m.rotation.x = -Math.PI / 2; m.position.set(s * 19.5, -.01, -80); scene.add(m); });
  const curbM = new THREE.MeshStandardMaterial({ color: '#0076B6' });
  [-4.6, 4.6].forEach(x => { const c = new THREE.Mesh(new THREE.BoxGeometry(.25, .25, 200), curbM); c.position.set(x, .12, -80); scene.add(c); });

  const LANE = 2.6, lanes = [-LANE, 0, LANE];
  // moving things: dashes, palms, buildings, obstacles, coins
  const movers = [];
  const dashM = new THREE.MeshBasicMaterial({ color: '#F3F4FA' });
  for (let i = 0; i < 30; i++) for (const x of [-LANE / 2, LANE / 2]) { const d = new THREE.Mesh(new THREE.PlaneGeometry(.12, 1.6), dashM); d.rotation.x = -Math.PI / 2; d.position.set(x, .01, -i * 4); scene.add(d); movers.push({ o: d, loop: 120 }); }
  const trunkM = new THREE.MeshStandardMaterial({ color: '#8A5A3A', roughness: 1 }), leafM = new THREE.MeshStandardMaterial({ color: '#1F6B3A', roughness: 1, side: THREE.DoubleSide });
  function palm() {
    const g = new THREE.Group(), h = 6 + Math.random() * 3;
    const t = new THREE.Mesh(new THREE.CylinderGeometry(.13, .22, h, 6), trunkM); t.position.y = h / 2; t.rotation.z = (Math.random() - .5) * .15; g.add(t);
    for (let i = 0; i < 7; i++) { const l = new THREE.Mesh(new THREE.ConeGeometry(.35, 3, 4, 1, true), leafM); l.position.y = h; l.rotation.z = Math.PI / 2 - .5; l.rotation.y = i / 7 * Math.PI * 2; l.translateY(-1.3); g.add(l); }
    return g;
  }
  const bCols = ['#F3F4FA', '#FFC27A', '#7FA7FF', '#F7B98A', '#E6EEFF'];
  for (let i = 0; i < 16; i++) for (const s of [-1, 1]) {
    const p = palm(); p.position.set(s * (6.2 + Math.random()), 0, -i * 8 - Math.random() * 4); scene.add(p); movers.push({ o: p, loop: 128 });
  }
  for (let i = 0; i < 12; i++) for (const s of [-1, 1]) {
    const w = 4 + Math.random() * 4, h = 2.5 + Math.random() * 5;
    const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, 5), new THREE.MeshStandardMaterial({ color: bCols[(i + (s > 0 ? 2 : 0)) % bCols.length], roughness: .9 }));
    b.position.set(s * (12 + w / 2 + Math.random() * 2), h / 2, -i * 10 - 3); scene.add(b); movers.push({ o: b, loop: 120 });
  }

  // runner
  const P = new THREE.Group(); scene.add(P);
  const skin = new THREE.MeshStandardMaterial({ color: '#E7B48F', roughness: .7 });
  const tee = new THREE.MeshStandardMaterial({ color: '#F3F1EA', roughness: .8 });
  const shorts = new THREE.MeshStandardMaterial({ color: '#2F7A3E', roughness: .8 });
  const shoe = new THREE.MeshStandardMaterial({ color: '#0076B6', roughness: .5 });
  const hair = new THREE.MeshStandardMaterial({ color: '#2A1E16', roughness: .9 });
  const torso = new THREE.Mesh(new THREE.CapsuleGeometry(.32, .55, 4, 10), tee); torso.position.y = 1.35; P.add(torso);
  const head = new THREE.Mesh(new THREE.SphereGeometry(.27, 16, 12), skin); head.position.y = 2.05; P.add(head);
  const hairM = new THREE.Mesh(new THREE.SphereGeometry(.285, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2), hair); hairM.position.y = 2.08; P.add(hairM);
  const hips = new THREE.Mesh(new THREE.CapsuleGeometry(.3, .12, 4, 10), shorts); hips.position.y = .95; P.add(hips);
  function limb(len, r, mat, endMat) {
    const piv = new THREE.Group(); const m = new THREE.Mesh(new THREE.CapsuleGeometry(r, len, 4, 8), mat); m.position.y = -len / 2 - r; piv.add(m);
    if (endMat) { const e = new THREE.Mesh(new THREE.BoxGeometry(r * 2.4, r * 1.6, r * 4), endMat); e.position.set(0, -len - r * 1.6, r); piv.add(e); }
    return piv;
  }
  const legL = limb(.62, .12, skin, shoe), legR = limb(.62, .12, skin, shoe); legL.position.set(-.16, .92, 0); legR.position.set(.16, .92, 0); P.add(legL, legR);
  const armL = limb(.48, .09, skin), armR = limb(.48, .09, skin); armL.position.set(-.42, 1.62, 0); armR.position.set(.42, 1.62, 0); P.add(armL, armR);
  const shadow = new THREE.Mesh(new THREE.CircleGeometry(.5, 20), new THREE.MeshBasicMaterial({ color: '#000', transparent: true, opacity: .3 }));
  shadow.rotation.x = -Math.PI / 2; shadow.position.y = .02; scene.add(shadow);

  // obstacles and coins
  const barM = [new THREE.MeshStandardMaterial({ color: '#F86608' }), new THREE.MeshStandardMaterial({ color: '#F3F4FA' })];
  const phoneM = new THREE.MeshStandardMaterial({ color: '#0A0D18', roughness: .4 }), screenM = new THREE.MeshBasicMaterial({ color: '#0076B6' });
  const coinM = new THREE.MeshStandardMaterial({ color: '#FFC23A', metalness: .35, roughness: .3, emissive: '#C46A00', emissiveIntensity: .55 });
  const pool = [];
  function make(kind) {
    let o;
    if (kind === 'bar') {               // low barrier: jump it
      o = new THREE.Group();
      for (let i = 0; i < 5; i++) { const s = new THREE.Mesh(new THREE.BoxGeometry(.44, .5, .3), barM[i % 2]); s.position.set(-.9 + i * .45, .55, 0); o.add(s); }
      [-1, 1].forEach(x => { const l = new THREE.Mesh(new THREE.BoxGeometry(.12, .55, .12), barM[1]); l.position.set(x * 1, .27, 0); o.add(l); });
    } else if (kind === 'phone') {      // giant phone: change lanes
      o = new THREE.Group();
      const b = new THREE.Mesh(new THREE.BoxGeometry(1.7, 3.1, .25), phoneM); b.position.y = 1.55; o.add(b);
      const s = new THREE.Mesh(new THREE.PlaneGeometry(1.45, 2.7), screenM); s.position.set(0, 1.55, .13); o.add(s);
      const h = new THREE.Mesh(new THREE.TorusGeometry(.32, .09, 8, 18), new THREE.MeshBasicMaterial({ color: '#F86608' })); h.position.set(0, 1.7, .15); o.add(h);
    } else {                            // coin
      const cg = new THREE.CylinderGeometry(.36, .36, .09, 28); cg.rotateX(Math.PI / 2); o = new THREE.Mesh(cg, coinM); o.position.y = .9;
    }
    o.userData.kind = kind; scene.add(o); return o;
  }
  let ahead = -20;
  function spawnRow(z) {
    const r = Math.random(), L = Math.floor(Math.random() * 3);
    if (r < .35) add('phone', L, z);
    else if (r < .6) add('bar', L, z);
    else { for (let k = 0; k < 5; k++) add('coin', L, z - k * 1.4); }
    if (Math.random() < .35) { const L2 = (L + 1 + Math.floor(Math.random() * 2)) % 3; for (let k = 0; k < 4; k++) add('coin', L2, z - k * 1.4); }
  }
  function add(kind, L, z) {
    let o = pool.find(p => !p.visible && p.userData.kind === kind); if (!o) o = make(kind);
    o.visible = true; o.position.x = lanes[L]; o.position.z = z; o.userData.lane = L; o.userData.hit = false;
    if (kind === 'coin') o.position.y = .9; if (!pool.includes(o)) pool.push(o);
  }
  for (let z = -14; z > -70; z -= 9) spawnRow(z); ahead = -70;

  // sparkles
  const sparks = []; const sparkM = new THREE.MeshBasicMaterial({ color: '#FFE7A3' });
  function burst(p) { for (let i = 0; i < 8; i++) { const s = new THREE.Mesh(new THREE.SphereGeometry(.06, 6, 4), sparkM); s.position.copy(p); s.userData.v = new THREE.Vector3((Math.random() - .5) * 4, Math.random() * 4, (Math.random() - .5) * 2); s.userData.life = .5; scene.add(s); sparks.push(s); } }

  // state
  let lane = 1, x = 0, y = 0, vy = 0, slide = 0, t = 0, speed = 9, boost = 0, coins = 0, dist = 0, last = 0, running = false;
  const reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
  let lastY = scrollY; addEventListener('scroll', () => { boost = Math.min(10, boost + Math.abs(scrollY - lastY) / 60); lastY = scrollY; }, { passive: true });

  function size() { const r = box.getBoundingClientRect(); R.setSize(r.width, r.height, false); cam.aspect = r.width / r.height; cam.updateProjectionMatrix(); }
  addEventListener('resize', size); size();

  function threat(L, near, far) { return pool.find(o => o.visible && o.userData.lane === L && o.userData.kind !== 'coin' && o.position.z < -near && o.position.z > -far); }
  function frame(now) {
    if (!running) return; requestAnimationFrame(frame);
    const dt = Math.min(.05, (now - (last || now)) / 1000); last = now; t += dt;
    boost *= Math.pow(.25, dt); const v = speed + boost; dist += v * dt;
    // world moves toward the camera
    for (const m of movers) { m.o.position.z += v * dt; if (m.o.position.z > 8) m.o.position.z -= m.loop; }
    for (const o of pool) if (o.visible) { o.position.z += v * dt; if (o.userData.kind === 'coin') o.rotation.y += dt * 4; if (o.position.z > 6) o.visible = false; }
    ahead += v * dt; while (ahead > -62) { spawnRow(ahead - 9); ahead -= 9; }
    // autopilot
    const th = threat(lane, 1, 9);
    if (th) {
      if (th.userData.kind === 'bar' && y === 0 && th.position.z > -3.6) { vy = 7.2; }
      else if (th.userData.kind === 'phone') {
        const opts = [lane - 1, lane + 1].filter(L => L >= 0 && L <= 2 && !threat(L, -1, 9));
        if (opts.length) lane = opts.sort((a, b) => coinIn(b) - coinIn(a))[0];
      }
    } else { const c = [lane - 1, lane + 1].filter(L => L >= 0 && L <= 2 && !threat(L, -1, 10)).sort((a, b) => coinIn(b) - coinIn(a))[0]; if (c !== undefined && coinIn(c) > coinIn(lane) + 1) lane = c; }
    x += (lanes[lane] - x) * Math.min(1, dt * 10);
    vy -= 22 * dt; y = Math.max(0, y + vy * dt); if (y === 0) vy = 0;
    P.position.set(x, y, 0); P.rotation.z = (x - lanes[lane]) * .08;
    shadow.position.set(x, .02, 0); shadow.scale.setScalar(1 - Math.min(.6, y * .25));
    // run cycle
    const ph = t * (8 + v * .55), air = y > 0;
    legL.rotation.x = air ? -.6 : Math.sin(ph) * .9; legR.rotation.x = air ? .4 : -Math.sin(ph) * .9;
    armL.rotation.x = -Math.sin(ph) * .8; armR.rotation.x = Math.sin(ph) * .8;
    torso.position.y = 1.35 + (air ? 0 : Math.abs(Math.sin(ph)) * .06); head.position.y = torso.position.y + .7; hairM.position.y = head.position.y + .03;
    // collect coins
    for (const o of pool) if (o.visible && o.userData.kind === 'coin' && Math.abs(o.position.z) < .6 && Math.abs(o.position.x - x) < .8) { o.visible = false; coins++; burst(o.position); }
    for (let i = sparks.length - 1; i >= 0; i--) { const s = sparks[i]; s.userData.life -= dt; s.userData.v.y -= 9 * dt; s.position.addScaledVector(s.userData.v, dt); if (s.userData.life <= 0) { scene.remove(s); sparks.splice(i, 1); } }
    // camera follows with a little sway
    cam.position.set(x * .55 + Math.sin(t * .7) * .15, 3.4 + y * .25, 5.6); cam.lookAt(x * .4, 1.4, -6);
    cam.fov = 58 + Math.min(10, boost * 1.2); cam.updateProjectionMatrix();
    R.render(scene, cam);
    if (hud) { hud.coins.textContent = coins; hud.dist.textContent = Math.round(dist) + 'm'; }
  }
  function coinIn(L) { return pool.filter(o => o.visible && o.userData.kind === 'coin' && o.userData.lane === L && o.position.z < 0 && o.position.z > -12).length; }
  return {
    start() { if (reduce || running) return; size(); running = true; last = 0; requestAnimationFrame(frame); },
    stop() { running = false; }
  };
}
