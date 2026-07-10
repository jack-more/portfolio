'use client';

import { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { companies } from '../data/portfolioData';
import { Company, Client } from '../data/portfolioTypes';

// ── Colors matching Variant aesthetic ──
const COLORS: Record<string, string> = {
  creative: '#FE6E0E',
  media: '#FF5837',
  startup: '#00C9A7',
  personal: '#FF6B00',
  bg: '#9FB1C1',
  dark: '#1F1F1B',
};

// ── Build flat card data from portfolio ──
interface CardData {
  type: string;
  title: string;
  subtitle: string;
  color: string;
  company: Company;
  client: Client | null;
  img: string;
}

function buildCardData(): CardData[] {
  const cards: CardData[] = [];
  for (const company of companies) {
    // Add the company card
    cards.push({
      type: company.category,
      title: company.name,
      subtitle: `${company.role} // ${company.period}`,
      color: company.color,
      company,
      client: null,
      img: company.logo,
    });
    // Add each client as a separate card
    for (const client of company.clients) {
      cards.push({
        type: company.category,
        title: client.name,
        subtitle: `${client.role} @ ${company.name}`,
        color: company.color,
        company,
        client,
        img: client.logo,
      });
    }
  }
  return cards;
}

const CARD_DATA = buildCardData();

// ── Helix parameters (matching Variant) ──
const RADIUS = 6;
const HEIGHT_STEP = 1.8;
const ANGLE_STEP = Math.PI / 3.5;

interface VortexSceneProps {
  onCardClick: (company: Company, client: Client | null) => void;
}

export default function VortexScene({ onCardClick }: VortexSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    vortexGroup: THREE.Group;
    cards: THREE.Mesh[];
    raycaster: THREE.Raycaster;
    mouse: THREE.Vector2;
    isDragging: boolean;
    previousMousePosition: { x: number; y: number };
    targetRotationY: number;
    currentRotationY: number;
    scrollPos: number;
    targetScrollPos: number;
    animId: number;
  } | null>(null);
  const onCardClickRef = useRef(onCardClick);
  onCardClickRef.current = onCardClick;

  const handleResize = useCallback(() => {
    const s = sceneRef.current;
    if (!s || !containerRef.current) return;
    const w = containerRef.current.clientWidth;
    const h = containerRef.current.clientHeight;
    s.camera.aspect = w / h;
    s.camera.updateProjectionMatrix();
    s.renderer.setSize(w, h);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    // ── Scene ──
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(COLORS.bg);
    scene.fog = new THREE.Fog(COLORS.bg, 10, 40);

    // ── Camera ──
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 22);
    camera.lookAt(0, 0, 0);

    // ── Renderer ──
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // ── Lights ──
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(10, 20, 10);
    scene.add(dirLight);

    // ── Vortex Group ──
    const vortexGroup = new THREE.Group();
    scene.add(vortexGroup);

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const state = {
      scene,
      camera,
      renderer,
      vortexGroup,
      cards: [] as THREE.Mesh[],
      raycaster,
      mouse,
      isDragging: false,
      previousMousePosition: { x: 0, y: 0 },
      targetRotationY: 0,
      currentRotationY: 0,
      scrollPos: 0,
      targetScrollPos: 0,
      animId: 0,
    };
    sceneRef.current = state;

    // ── Create vortex cards ──
    createVortex(state);
    createWireframe(state);

    // ── Event Handlers ──
    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      state.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      state.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (state.isDragging) {
        const deltaX = e.clientX - state.previousMousePosition.x;
        const deltaY = e.clientY - state.previousMousePosition.y;
        state.targetRotationY += deltaX * 0.005;
        state.targetScrollPos += deltaY * 0.05;
        state.previousMousePosition = { x: e.clientX, y: e.clientY };
      }
    };

    const onMouseDown = (e: MouseEvent) => {
      state.isDragging = true;
      state.previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      state.isDragging = false;
      state.raycaster.setFromCamera(state.mouse, state.camera);
      const intersects = state.raycaster.intersectObjects(state.cards);
      if (intersects.length > 0) {
        const data = intersects[0].object.userData as CardData;
        onCardClickRef.current(data.company, data.client);
      }
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      state.targetScrollPos += e.deltaY * 0.01;
      state.targetRotationY += e.deltaY * 0.001;
    };

    // ── Attach events ──
    window.addEventListener('resize', handleResize);
    container.addEventListener('mousemove', onMouseMove);
    container.addEventListener('mousedown', onMouseDown);
    container.addEventListener('mouseup', onMouseUp);
    container.addEventListener('wheel', onWheel, { passive: false });

    // ── Animate ──
    function animate() {
      state.animId = requestAnimationFrame(animate);

      state.currentRotationY += (state.targetRotationY - state.currentRotationY) * 0.05;
      state.vortexGroup.rotation.y = state.currentRotationY;

      state.scrollPos += (state.targetScrollPos - state.scrollPos) * 0.05;
      const maxScroll = 15;
      if (state.scrollPos > maxScroll) state.targetScrollPos = maxScroll;
      if (state.scrollPos < -maxScroll) state.targetScrollPos = -maxScroll;
      state.vortexGroup.position.y = state.scrollPos;

      if (!state.isDragging) {
        state.targetRotationY += 0.0005;
      }

      renderer.render(scene, camera);
    }
    animate();

    // ── Cleanup ──
    return () => {
      cancelAnimationFrame(state.animId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', onMouseMove);
      container.removeEventListener('mousedown', onMouseDown);
      container.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('wheel', onWheel);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [handleResize]);

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
}

// ── Create card meshes on helix ──
function createVortex(state: {
  vortexGroup: THREE.Group;
  cards: THREE.Mesh[];
}) {
  const textureLoader = new THREE.TextureLoader();
  const cardGeo = new THREE.PlaneGeometry(3, 2.2);

  CARD_DATA.forEach((data, i) => {
    const borderColor = data.color || '#ffffff';

    // Create canvas texture for the card face
    const canvas = document.createElement('canvas');
    const W = 512, H = 376;
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d')!;

    // Light card background
    ctx.fillStyle = '#f5f3ea';
    roundRect(ctx, 0, 0, W, H, 10);
    ctx.fill();

    // Color accent strip on left
    ctx.fillStyle = borderColor;
    ctx.fillRect(0, 0, 8, H);

    // Title text
    ctx.fillStyle = '#1F1F1B';
    ctx.font = 'bold 26px Inter, Helvetica Neue, Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(data.title, W / 2 + 4, H - 60, W - 40);

    // Subtitle
    ctx.fillStyle = '#666666';
    ctx.font = '13px monospace';
    ctx.fillText(data.subtitle, W / 2 + 4, H - 34, W - 40);

    // Category badge
    ctx.fillStyle = borderColor;
    roundRect(ctx, W - 100, 12, 88, 22, 4);
    ctx.fill();
    ctx.fillStyle = '#1F1F1B';
    ctx.font = 'bold 10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(data.type.toUpperCase(), W - 56, 27);

    // Border
    ctx.strokeStyle = 'rgba(31,31,27,0.2)';
    ctx.lineWidth = 1.5;
    roundRect(ctx, 0.5, 0.5, W - 1, H - 1, 10);
    ctx.stroke();

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;

    const material = new THREE.MeshBasicMaterial({
      map: tex,
      side: THREE.DoubleSide,
    });
    const card = new THREE.Mesh(cardGeo, material);

    // Helix position
    const angle = i * ANGLE_STEP;
    const y = i * HEIGHT_STEP - (CARD_DATA.length * HEIGHT_STEP) / 2;
    const x = Math.cos(angle) * RADIUS;
    const z = Math.sin(angle) * RADIUS;
    card.position.set(x, y, z);

    // Face center
    card.lookAt(0, y, 0);
    card.rotateY(Math.PI);

    // Slight random tilt for organic feel
    card.rotateX((Math.random() - 0.5) * 0.15);
    card.rotateZ((Math.random() - 0.5) * 0.15);

    // Colored border plane behind card
    const borderGeo = new THREE.PlaneGeometry(3.15, 2.35);
    const borderMat = new THREE.MeshBasicMaterial({
      color: borderColor,
      side: THREE.BackSide,
    });
    const border = new THREE.Mesh(borderGeo, borderMat);
    border.position.z = -0.05;
    card.add(border);

    card.userData = data;
    state.vortexGroup.add(card);
    state.cards.push(card);

    // Load logo async and draw on card
    if (data.img) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const maxW = 180, maxH = 120;
        const scale = Math.min(maxW / img.width, maxH / img.height, 1);
        const drawW = img.width * scale;
        const drawH = img.height * scale;
        const dx = (W - drawW) / 2 + 4;
        const dy = (220 - drawH) / 2 + 20;
        ctx.drawImage(img, dx, dy, drawW, drawH);
        tex.needsUpdate = true;
      };
      img.src = data.img;
    }
  });
}

// ── Create wireframe connecting card positions ──
function createWireframe(state: { vortexGroup: THREE.Group }) {
  const totalItems = CARD_DATA.length;
  const points: THREE.Vector3[] = [];

  for (let i = 0; i < totalItems; i++) {
    const angle = i * ANGLE_STEP;
    const y = i * HEIGHT_STEP - (totalItems * HEIGHT_STEP) / 2;
    const x = Math.cos(angle) * RADIUS;
    const z = Math.sin(angle) * RADIUS;
    points.push(new THREE.Vector3(x, y, z));
  }

  const lineMat = new THREE.LineBasicMaterial({
    color: 0x1f1f1b,
    opacity: 0.3,
    transparent: true,
  });

  // Spiral line
  const spiralGeo = new THREE.BufferGeometry().setFromPoints(points);
  state.vortexGroup.add(new THREE.Line(spiralGeo, lineMat));

  // Vertical connections
  const itemsPerRotation = Math.floor((Math.PI * 2) / ANGLE_STEP);
  const vertPoints: THREE.Vector3[] = [];
  for (let i = 0; i < totalItems - itemsPerRotation; i++) {
    if (points[i] && points[i + itemsPerRotation]) {
      vertPoints.push(points[i], points[i + itemsPerRotation]);
    }
  }
  const vGeo = new THREE.BufferGeometry().setFromPoints(vertPoints);
  state.vortexGroup.add(new THREE.LineSegments(vGeo, lineMat));

  // Center axis
  const axisGeo = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, -30, 0),
    new THREE.Vector3(0, 30, 0),
  ]);
  const axisMat = new THREE.LineBasicMaterial({
    color: 0x1f1f1b,
    opacity: 0.1,
    transparent: true,
  });
  state.vortexGroup.add(new THREE.Line(axisGeo, axisMat));
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}
