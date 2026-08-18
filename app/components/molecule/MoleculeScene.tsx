'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Molecule, styleFor } from './sdf';

/**
 * Plain three.js, deliberately.
 *
 * The r3f <Canvas> in this project mounts its DOM wrapper but never fires
 * onCreated — the WebGL state is never built, so nothing ever draws. Rather
 * than fight that, this follows the same imperative pattern as
 * app/components/vortex/VortexScene.tsx, which is known to work here.
 */

/**
 * One world unit = one angstrom. Structures are NOT normalized to a common
 * frame size — a 4813 Da tirzepatide really is an order of magnitude bigger
 * than a 340 Da GHK, and normalizing that away shrinks big peptides until
 * their atoms are specks. The camera pulls back to fit instead, and the HUD
 * reports the scale so the size difference is readable rather than lost.
 */
/** Ball-and-stick: spheres at a fraction of van der Waals so bonds stay visible. */
const BALL_SCALE = 0.23;
const STICK_RADIUS = 0.19;

const UP = new THREE.Vector3(0, 1, 0);

export interface ScaleInfo {
  /** Longest dimension of the current structure, in angstroms. */
  span: number;
  /** Screen pixels per angstrom at the current camera distance. */
  pxPerAngstrom: number;
}

export interface MoleculeSceneProps {
  molecule: Molecule;
  onHoverAtom: (atomIndex: number | null) => void;
  onScale?: (info: ScaleInfo) => void;
  spin?: boolean;
  showHydrogen?: boolean;
  /** Hold the camera at a fixed distance so structures are directly comparable. */
  lockScale?: boolean;
}

const FOV = 38;
/**
 * Margin so the structure never touches the frame edge. Fitting the bounding
 * sphere (not the projected silhouette) keeps the framing stable while the
 * camera orbits, at the cost of looking small down the long axis — so keep the
 * padding tight.
 */
const FIT_PADDING = 1.08;
/**
 * Camera reference for true-scale mode: the largest structure in the catalog
 * (Thymosin α-1, 52.4 Å radius) plus headroom. Holding the camera here across
 * every structure is what makes 5-Amino-1MQ actually look 12× smaller than
 * tirzepatide instead of merely saying so.
 */
const REFERENCE_EXTENT = 54;

/** Camera distance at which a molecule of the given radius fills the view. */
function fitDistance(extent: number) {
  return (extent / Math.tan((FOV * Math.PI) / 360)) * FIT_PADDING;
}

/**
 * Soft studio environment built from a canvas gradient. Gives the spheres
 * something to reflect without fetching an HDR from a CDN.
 */
function makeEnvironment(): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  const g = ctx.createLinearGradient(0, 0, 0, 256);
  // High contrast top-to-bottom. A flat environment lights every part of a
  // sphere equally, which is exactly what makes a render look pasted-on.
  g.addColorStop(0.0, '#ffffff'); // hot top — drives the specular
  g.addColorStop(0.22, '#b9cdec');
  g.addColorStop(0.46, '#33405a'); // fast falloff through the horizon
  g.addColorStop(0.72, '#0d1526');
  g.addColorStop(1.0, '#20386e'); // brand-blue bounce from below
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 256);

  const tex = new THREE.CanvasTexture(canvas);
  tex.mapping = THREE.EquirectangularReflectionMapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

interface Built {
  group: THREE.Group;
  meshes: THREE.InstancedMesh[];
  /** Per mesh, instance index -> atom index (-1 for bond geometry). */
  atomIndexFor: number[][];
  dispose: () => void;
}

/**
 * Build one InstancedMesh of spheres and one of bond-halves per element.
 * Bonds are split at the midpoint so each half takes its own atom's colour —
 * the blue on the heteroatoms bleeds into the cage instead of stopping at
 * the sphere.
 */
function buildMolecule(mol: Molecule, showHydrogen: boolean): Built {
  const visible = (i: number) =>
    showHydrogen || mol.atoms[i]?.element.toUpperCase() !== 'H';

  const spheres = new Map<string, THREE.Matrix4[]>();
  const sphereAtom = new Map<string, number[]>();
  const sticks = new Map<string, THREE.Matrix4[]>();

  const push = (map: Map<string, THREE.Matrix4[]>, key: string, m: THREE.Matrix4) => {
    const arr = map.get(key);
    if (arr) arr.push(m);
    else map.set(key, [m]);
  };

  mol.atoms.forEach((atom, i) => {
    if (!visible(i)) return;
    const key = atom.element.toUpperCase();
    const r = styleFor(atom.element).radius * BALL_SCALE;
    const m = new THREE.Matrix4().makeScale(r, r, r).setPosition(atom.x, atom.y, atom.z);
    push(spheres, key, m);
    const idx = sphereAtom.get(key);
    if (idx) idx.push(i);
    else sphereAtom.set(key, [i]);
  });

  const a = new THREE.Vector3();
  const b = new THREE.Vector3();
  const dir = new THREE.Vector3();
  const mid = new THREE.Vector3();
  const perp = new THREE.Vector3();
  const quat = new THREE.Quaternion();

  for (const bond of mol.bonds) {
    const A = mol.atoms[bond.a];
    const B = mol.atoms[bond.b];
    if (!A || !B) continue;
    if (!visible(bond.a) || !visible(bond.b)) continue;

    a.set(A.x, A.y, A.z);
    b.set(B.x, B.y, B.z);
    dir.subVectors(b, a);
    const len = dir.length();
    if (len === 0) continue;
    dir.divideScalar(len);
    quat.setFromUnitVectors(UP, dir);
    mid.addVectors(a, b).multiplyScalar(0.5);

    // Multi-bond rendering: offset parallel sticks perpendicular to the axis.
    const rungs = Math.min(Math.max(bond.order, 1), 3);
    const gap = STICK_RADIUS * 1.6;
    perp.set(1, 0, 0);
    if (Math.abs(dir.x) > 0.9) perp.set(0, 0, 1);
    perp.crossVectors(dir, perp).normalize();
    const thickness = rungs > 1 ? STICK_RADIUS * 0.5 : STICK_RADIUS;

    for (let k = 0; k < rungs; k++) {
      const offset = rungs === 1 ? 0 : (k - (rungs - 1) / 2) * gap;
      for (const [from, atomIdx] of [[a, bond.a], [b, bond.b]] as const) {
        const half = new THREE.Vector3()
          .addVectors(from as THREE.Vector3, mid)
          .multiplyScalar(0.5)
          .addScaledVector(perp, offset);
        const m = new THREE.Matrix4().compose(
          half,
          quat,
          new THREE.Vector3(thickness, len / 2, thickness),
        );
        push(sticks, mol.atoms[atomIdx].element.toUpperCase(), m);
      }
    }
  }

  // No scale factor: coordinates are already in angstroms and stay that way.
  const group = new THREE.Group();

  const sphereGeo = new THREE.SphereGeometry(1, 32, 32);
  const stickGeo = new THREE.CylinderGeometry(1, 1, 1, 16, 1, true);
  const meshes: THREE.InstancedMesh[] = [];
  const atomIndexFor: number[][] = [];
  const materials: THREE.Material[] = [];

  const elements = new Set([...spheres.keys(), ...sticks.keys()]);
  for (const el of elements) {
    const style = styleFor(el);
    const color = new THREE.Color(style.color);

    const sphereList = spheres.get(el);
    if (sphereList?.length) {
      const mat = new THREE.MeshPhysicalMaterial({
        color,
        metalness: style.metalness,
        roughness: style.roughness,
        emissive: color,
        emissiveIntensity: style.emissive,
        // Tight clearcoat highlight: a small, sharp spec is what tells the eye
        // a shaded circle is actually a sphere.
        clearcoat: 0.9,
        clearcoatRoughness: 0.12,
        envMapIntensity: 1.25,
      });
      materials.push(mat);
      const mesh = new THREE.InstancedMesh(sphereGeo, mat, sphereList.length);
      sphereList.forEach((m, i) => mesh.setMatrixAt(i, m));
      mesh.instanceMatrix.needsUpdate = true;
      mesh.computeBoundingSphere();
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      group.add(mesh);
      meshes.push(mesh);
      atomIndexFor.push(sphereAtom.get(el) ?? []);
    }

    const stickList = sticks.get(el);
    if (stickList?.length) {
      const mat = new THREE.MeshPhysicalMaterial({
        color,
        metalness: 0.05,
        roughness: 0.42,
        emissive: color,
        emissiveIntensity: style.emissive * 0.3,
        envMapIntensity: 0.9,
      });
      materials.push(mat);
      const mesh = new THREE.InstancedMesh(stickGeo, mat, stickList.length);
      stickList.forEach((m, i) => mesh.setMatrixAt(i, m));
      mesh.instanceMatrix.needsUpdate = true;
      mesh.computeBoundingSphere();
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      group.add(mesh);
      // Bonds are not hover targets.
      meshes.push(mesh);
      atomIndexFor.push(stickList.map(() => -1));
    }
  }

  return {
    group,
    meshes,
    atomIndexFor,
    dispose: () => {
      sphereGeo.dispose();
      stickGeo.dispose();
      materials.forEach((m) => m.dispose());
    },
  };
}

export default function MoleculeScene({
  molecule,
  onHoverAtom,
  onScale,
  spin = true,
  showHydrogen = false,
  lockScale = false,
}: MoleculeSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const spinRef = useRef(spin);
  spinRef.current = spin;
  const onHoverRef = useRef(onHoverAtom);
  onHoverRef.current = onHoverAtom;
  const onScaleRef = useRef(onScale);
  onScaleRef.current = onScale;

  // Persist camera orientation across structure changes so switching molecules
  // does not snap the view back to front-on. `distance` is refit per structure;
  // `fit` is the reference the zoom limits are expressed against.
  const orbitRef = useRef({
    theta: 0,
    phi: Math.PI / 2,
    distance: fitDistance(6),
    fit: fitDistance(6),
  });
  const spanRef = useRef(molecule.span);
  const extentRef = useRef(molecule.extent);

  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    root: THREE.Group;
    env: THREE.Texture;
    key: THREE.DirectionalLight;
    fog: THREE.Fog;
  } | null>(null);

  // ── Init: renderer, scene, lights. Runs once. ──
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#04091a');
    // Depth cue: atoms further from the camera fade toward the background, so
    // the structure reads as a volume instead of a flat decal. Bounds are
    // recomputed per frame from the camera distance.
    const fog = new THREE.Fog('#04091a', 1, 100);
    scene.fog = fog;

    const env = makeEnvironment();
    scene.environment = env;

    // far plane generous: an extended 700-atom peptide spans hundreds of angstroms.
    const camera = new THREE.PerspectiveCamera(FOV, 1, 0.5, 5000);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.4;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    // Atoms shadowing each other is the single biggest cue that this is a 3D
    // object; without it the spheres read as flat circles.
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';

    // Low ambient, hard key. Flatness comes from lifting the shadows until
    // every face is lit the same; the ratio between key and fill is what
    // creates form.
    scene.add(new THREE.AmbientLight(0xffffff, 0.34));

    // Hemisphere gives a sky/ground gradient across each sphere rather than a
    // single flat fill value.
    scene.add(new THREE.HemisphereLight(0xcfe2ff, 0x0a1430, 1.1));

    const key = new THREE.DirectionalLight(0xf4f8ff, 5.6);
    key.position.set(-5, 7, 5);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    // Self-shadowing on tightly packed spheres acnes badly without these.
    key.shadow.bias = -0.0006;
    key.shadow.normalBias = 0.06;
    scene.add(key);

    // Cool rim from behind to cut the silhouette off the background.
    const rim = new THREE.DirectionalLight(0x5a8cff, 3.2);
    rim.position.set(7, -1, -7);
    scene.add(rim);

    // Weak bounce so the shadow side is not pure black.
    const bounce = new THREE.DirectionalLight(0x2c4a86, 0.9);
    bounce.position.set(2, -6, 3);
    scene.add(bounce);

    const root = new THREE.Group();
    scene.add(root);

    sceneRef.current = { scene, camera, renderer, root, env, key, fog };

    // ── Sizing ──
    const resize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (!w || !h) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    // ── Interaction ──
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let dragging = false;
    let last = { x: 0, y: 0 };
    let hoverTarget: number | null = null;

    const onPointerDown = (e: PointerEvent) => {
      dragging = true;
      last = { x: e.clientX, y: e.clientY };
      container.setPointerCapture(e.pointerId);
      container.style.cursor = 'grabbing';
    };
    // Bound on window, not the container: a pointerup that lands outside the
    // canvas would otherwise leave the drag latched, and every later mouse move
    // would keep rotating the structure.
    const onPointerUp = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      if (container.hasPointerCapture(e.pointerId)) container.releasePointerCapture(e.pointerId);
      container.style.cursor = 'grab';
    };
    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (dragging) {
        const o = orbitRef.current;
        o.theta -= (e.clientX - last.x) * 0.006;
        o.phi -= (e.clientY - last.y) * 0.006;
        // Keep off the poles so the view never flips.
        o.phi = Math.max(0.15, Math.min(Math.PI - 0.15, o.phi));
        last = { x: e.clientX, y: e.clientY };
      }
    };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const o = orbitRef.current;
      // Zoom limits are relative to the structure's own fit distance, so the
      // same gesture feels identical on a tripeptide and on tirzepatide.
      o.distance = Math.max(
        o.fit * 0.3,
        Math.min(o.fit * 2.5, o.distance * (1 + e.deltaY * 0.0012)),
      );
    };
    const onLeave = () => {
      if (hoverTarget !== null) {
        hoverTarget = null;
        onHoverRef.current(null);
      }
    };

    container.style.cursor = 'grab';
    container.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
    container.addEventListener('pointermove', onPointerMove);
    container.addEventListener('pointerleave', onLeave);
    container.addEventListener('wheel', onWheel, { passive: false });

    // ── Loop ──
    let raf = 0;
    let lastPxPerA = 0;
    let lastSpan = -1;
    const clock = new THREE.Clock();
    const animate = () => {
      raf = requestAnimationFrame(animate);
      const dt = clock.getDelta();

      if (spinRef.current && !dragging) orbitRef.current.theta += dt * 0.16;

      const { theta, phi, distance } = orbitRef.current;
      camera.position.set(
        distance * Math.sin(phi) * Math.sin(theta),
        distance * Math.cos(phi),
        distance * Math.sin(phi) * Math.cos(theta),
      );
      camera.lookAt(0, 0, 0);

      // Depth cue tracks the camera: the near face stays clear, the far side
      // sinks into the background.
      // Gentle: the far side should sink, not disappear. Tied to extent rather
      // than span so an elongated peptide is not fogged along its whole length.
      const reach = extentRef.current;
      fog.near = Math.max(0.1, distance - reach * 0.9);
      fog.far = distance + reach * 6.5;

      // Report the on-screen scale. Visible height in angstroms at this
      // distance maps directly to pixels, which is what a scale bar needs.
      const visibleA = 2 * distance * Math.tan((FOV * Math.PI) / 360);
      const pxPerA = container.clientHeight / visibleA;
      // Also fire when the structure changes, not only when the zoom moves —
      // two compounds can share a camera distance but differ in span.
      if (
        Math.abs(pxPerA - lastPxPerA) > lastPxPerA * 0.02 ||
        spanRef.current !== lastSpan
      ) {
        lastPxPerA = pxPerA;
        lastSpan = spanRef.current;
        onScaleRef.current?.({ span: spanRef.current, pxPerAngstrom: pxPerA });
      }

      // Hover probe against sphere meshes only.
      if (!dragging) {
        raycaster.setFromCamera(pointer, camera);
        const hits = raycaster.intersectObjects(root.children, false);
        let found: number | null = null;
        for (const hit of hits) {
          const mesh = hit.object as THREE.InstancedMesh;
          const map = mesh.userData.atomIndexFor as number[] | undefined;
          if (map && hit.instanceId != null) {
            const idx = map[hit.instanceId];
            if (idx != null && idx >= 0) { found = idx; break; }
          }
        }
        if (found !== hoverTarget) {
          hoverTarget = found;
          onHoverRef.current(found);
        }
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      container.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('pointerleave', onLeave);
      container.removeEventListener('wheel', onWheel);
      env.dispose();
      renderer.dispose();
      // Release the GPU context explicitly; browsers cap live contexts and a
      // leaked one leaves the next mount with a blank canvas.
      renderer.forceContextLoss();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      sceneRef.current = null;
    };
  }, []);

  // ── Swap geometry when the structure or hydrogen visibility changes ──
  useEffect(() => {
    const s = sceneRef.current;
    if (!s) return;

    const built = buildMolecule(molecule, showHydrogen);
    built.meshes.forEach((mesh, i) => {
      mesh.userData.atomIndexFor = built.atomIndexFor[i];
    });
    s.root.add(built.group);
    spanRef.current = molecule.span;
    extentRef.current = molecule.extent;

    return () => {
      s.root.remove(built.group);
      built.dispose();
    };
  }, [molecule, showHydrogen]);

  // Camera framing. Separate from geometry so toggling scale mode re-frames
  // without rebuilding every instanced mesh.
  useEffect(() => {
    const fit = fitDistance(lockScale ? REFERENCE_EXTENT : molecule.extent);
    orbitRef.current.fit = fit;
    orbitRef.current.distance = fit;

    // Fit the shadow frustum to this structure. Sized to the whole catalog it
    // would waste almost all of the 2048px map on empty space and the contact
    // shadows would turn to mush.
    const s = sceneRef.current;
    if (!s) return;
    const r = molecule.extent * 1.2;
    const cam = s.key.shadow.camera as THREE.OrthographicCamera;
    cam.left = -r; cam.right = r; cam.top = r; cam.bottom = -r;
    cam.near = 0.5;
    cam.far = r * 6;
    cam.updateProjectionMatrix();
    // Keep the light's throw proportional to the molecule, so a 4 Å compound
    // and a 52 Å peptide get the same shadow character.
    s.key.position.set(-0.62, 0.87, 0.62).multiplyScalar(r * 2.6);
  }, [molecule, lockScale]);

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
}
