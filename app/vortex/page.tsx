'use client';

import { useEffect, useRef, useState } from 'react';

// ── COLORS (from your Variant code) ──
const COLORS: Record<string, string> = {
  creative: '#FE6E0E',
  media: '#FF5837',
  startup: '#00C9A7',
  personal: '#FF6B00',
  coding: '#E9E6D4',
  black: '#1F1F1B',
  bg: '#87CEEB',
};

// ── CARD DATA (your real portfolio, flattened for the tube) ──
const CARD_DATA = [
  // ── PERSONAL (bottom of helix) ──
  { type: 'personal', title: 'Cribs.Fun', client: 'Co-Founder', img: '/images/cribs-fun-logo.png', desc: 'Mobile-first real estate price guessing game. React Native with freemium model.', metrics: false, period: 'Jan 2024 – Present', link: 'https://cribs.fun', linkLabel: 'cribs.fun' },
  { type: 'personal', title: 'Morello Sims', client: 'Creator & Developer', img: '/images/morello-sims-logo.svg', desc: 'Full-stack sports simulation platform with 3D visualizations, ML clustering, and real-time data pipelines.', metrics: false, period: 'Jan 2024 – Present', link: 'https://morellosims.com', linkLabel: 'morellosims.com' },
  // ── STARTUP WORK (middle of helix) ──
  { type: 'startup', title: 'Travala', client: 'Dtravel Partnership', img: '/images/travala.png', desc: 'Supported marketing for Travala as part of the Dtravel ecosystem. Binance-backed crypto travel platform.', metrics: true, period: 'Apr 2021 – Apr 2022', link: 'https://www.travala.com/', linkLabel: 'Travala.com' },
  { type: 'startup', title: 'Dtravel', client: 'Head of Digital Growth', img: '/images/Dtravel-logo.jpg', desc: 'Directed digital marketing during Series A. Scaled social following from 7K to 55K+, supporting $8M Series A.', metrics: true, period: 'Apr 2021 – Apr 2022', link: 'https://www.coindesk.com/business/2021/06/16/binance-backed-travala-launches-dtravel-a-decentralized-airbnb', linkLabel: 'Decentralized Airbnb — CoinDesk' },
  { type: 'startup', title: 'NEAR Tasks', client: 'Head of Marketing', img: '/images/near-protocol.png', desc: 'Managed full marketing strategy for AI-powered task marketplace. Grew user base from launch to 12,000 users in 18 months.', metrics: true, period: 'Apr 2022 – Jun 2024', link: 'https://pages.near.org/blog/near-tasks-launches-ai-marketplace-on-near-to-revolutionize-the-future-of-work/', linkLabel: 'NEAR Tasks Launch — NEAR Blog' },
  { type: 'startup', title: 'Devolved AI', client: 'Marketing Manager', img: '/images/DevolvedAI.png', desc: 'Led marketing strategy that scaled AI platform to $100M valuation. Developed comprehensive product positioning and launch strategy.', metrics: true, period: 'Sep 2024 – Jun 2025', link: 'https://www.globenewswire.com/news-release/2024/12/05/2992635/0/en/Devolved-AI-Announces-Strategic-Partnership-with-GDA-Capital-to-Revolutionize-Blockchain-Powered-AI-Solutions.html', linkLabel: 'GDA Capital Partnership — GlobeNewsWire' },
  // ── AGENCY WORK (top of helix) ──
  { type: 'creative', title: 'Hint Water', client: 'Laundry Service', img: '/images/hint-water-logo.png', desc: 'Led copywriting and content planning for the premium flavored water brand.', metrics: false, period: 'May 2017 – Dec 2017', link: 'https://247laundryservice.com/', linkLabel: 'Laundry Service' },
  { type: 'creative', title: 'LG Mobile', client: 'Laundry Service', img: '/images/lglogo.png', desc: 'Campaigns achieving 695 million impressions and 114 million engagements.', metrics: true, period: 'May 2017 – Dec 2017', link: 'https://shortyawards.com/7th/laundry-service', linkLabel: 'Laundry Service — Shorty Awards' },
  { type: 'creative', title: 'BMW', client: 'Laundry Service', img: '/images/bmw.png', desc: 'Social Media AOR for BMW of North America. Created compelling brand narratives.', metrics: false, period: 'May 2017 – Dec 2017', link: 'https://www.mediapost.com/publications/article/293721/biz-dev-laundry-service-named-social-media-aor-fo.html', linkLabel: 'BMW Social AOR — MediaPost' },
  { type: 'creative', title: 'X (Twitter)', client: 'Laundry Service', img: '/images/twitter-x-logo.png', desc: 'Developed social media copy and engagement strategies for corporate channels.', metrics: false, period: 'May 2017 – Dec 2017', link: 'https://247laundryservice.com/', linkLabel: 'Laundry Service' },
  { type: 'media', title: 'NBC / Peacock', client: 'EPK.TV', img: '/images/peacock-logo.png', desc: 'Supported NBCUniversal content distribution ahead of Peacock launch.', metrics: true, period: 'Aug 2018 – Jan 2020', link: 'https://www.epk.tv/', linkLabel: 'EPK.TV Platform' },
  { type: 'media', title: 'Prime Video', client: 'EPK.TV', img: '/images/amazon-prime-video.png', desc: 'Managed content distribution for Amazon originals through dedicated portal.', metrics: true, period: 'Aug 2018 – Jan 2020', link: 'https://www.epk.tv/', linkLabel: 'EPK.TV Platform' },
  { type: 'media', title: 'Universal', client: 'EPK.TV', img: '/images/universal-logo.png', desc: 'Coordinated digital asset distribution for theatrical and home entertainment releases.', metrics: true, period: 'Aug 2018 – Jan 2020', link: 'https://www.epk.tv/', linkLabel: 'EPK.TV Platform' },
  { type: 'media', title: 'Sony Pictures', client: 'EPK.TV', img: '/images/sony-pictures-logo.png', desc: 'Coordinated digital asset distribution for theatrical releases through dedicated studio portal.', metrics: true, period: 'Aug 2018 – Jan 2020', link: 'https://www.epk.tv/', linkLabel: 'EPK.TV Platform' },
  { type: 'media', title: 'Starbucks', client: 'iHeartMedia', img: '/images/starbucks.png', desc: 'Managed programmatic advertising campaigns across digital platforms.', metrics: true, period: 'Jan 2020 – Apr 2021', link: 'https://www.iheart.com/', linkLabel: 'iHeartMedia' },
  { type: 'media', title: 'Toyota', client: 'iHeartMedia', img: '/images/toyota-logo.png', desc: 'Executed paid media strategies across Facebook, Instagram, Twitter, and Snapchat.', metrics: true, period: 'Jan 2020 – Apr 2021', link: 'https://www.iheart.com/', linkLabel: 'iHeartMedia' },
  { type: 'media', title: 'Starz', client: 'iHeartMedia', img: '/images/starz-logo.png', desc: 'Managed paid media campaigns driving subscriber acquisition across digital platforms.', metrics: true, period: 'Jan 2020 – Apr 2021', link: 'https://www.iheart.com/', linkLabel: 'iHeartMedia' },
  { type: 'media', title: 'Netflix', client: 'EPK.TV', img: '/images/netflix.png', desc: 'Managed content partnerships. EPK.TV delivers over 1 million assets annually to 50,000+ media professionals.', metrics: true, period: 'Aug 2018 – Jan 2020', link: 'https://www.epk.tv/', linkLabel: 'EPK.TV Platform' },
  { type: 'media', title: 'Disney+', client: 'EPK.TV', img: '/images/disneyplus.png', desc: 'Managed content partnerships during Disney+ launch. Designated distribution platform for Disney promotional content.', metrics: true, period: 'Aug 2018 – Jan 2020', link: 'https://www.epk.tv/', linkLabel: 'EPK.TV Platform' },
];

function getTagsForType(type: string): string[] {
  const map: Record<string, string[]> = {
    creative: ['Art Direction', 'Copywriting', 'Brand Strategy'],
    media: ['Paid Social', 'Analytics', 'Campaign Mgmt'],
    startup: ['Growth', 'Go-to-Market', 'Product Launch'],
    personal: ['Full Stack', 'WebGL', 'Data Science'],
  };
  return map[type] || ['General'];
}

// ── ORGANIC FLOWER SYSTEM ──
const FLOWER_PALETTES = [
  { petals: '#FF6B8A', center: '#FFD54F', stem: '#4A8B3F', highlight: '#FFB3C6' },
  { petals: '#FF8A65', center: '#FFF176', stem: '#5A8F3E', highlight: '#FFCCBC' },
  { petals: '#B388FF', center: '#FFE082', stem: '#3D7A3A', highlight: '#D1C4E9' },
  { petals: '#64FFDA', center: '#FFF9C4', stem: '#4CAF50', highlight: '#B2DFDB' },
  { petals: '#FF80AB', center: '#FFCC02', stem: '#388E3C', highlight: '#F8BBD0' },
  { petals: '#82B1FF', center: '#FFF59D', stem: '#43A047', highlight: '#BBDEFB' },
  { petals: '#FFAB91', center: '#FFE0B2', stem: '#558B2F', highlight: '#FFE0B2' },
];

interface Flower {
  x: number;
  y: number;
  startTime: number;
  palette: typeof FLOWER_PALETTES[0];
  petalCount: number;
  size: number;
  baseRotation: number;
  variety: number;
  swayPhase: number;
  stemCurve: number;
}

function hexToRgb(hex: string) {
  return { r: parseInt(hex.slice(1, 3), 16), g: parseInt(hex.slice(3, 5), 16), b: parseInt(hex.slice(5, 7), 16) };
}
function rgbToHex(r: number, g: number, b: number) {
  return '#' + [r, g, b].map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
}
function lightenColor(hex: string, amt: number) {
  const { r, g, b } = hexToRgb(hex); const f = amt / 100;
  return rgbToHex(r + (255 - r) * f, g + (255 - g) * f, b + (255 - b) * f);
}
function darkenColor(hex: string, amt: number) {
  const { r, g, b } = hexToRgb(hex); const f = 1 - amt / 100;
  return rgbToHex(r * f, g * f, b * f);
}

function easeOutCubic(t: number) { return 1 - Math.pow(1 - t, 3); }
function easeOutBack(t: number) {
  const c1 = 1.70158; const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

function drawPetal(
  ctx: CanvasRenderingContext2D, cx: number, cy: number, angle: number,
  length: number, width: number, color: string, highlight: string, alpha: number, variety: number,
) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(angle);
  ctx.globalAlpha = alpha;
  const grad = ctx.createRadialGradient(0, -length * 0.2, 0, 0, -length * 0.4, length * 0.9);
  grad.addColorStop(0, lightenColor(highlight, 20));
  grad.addColorStop(0.5, color);
  grad.addColorStop(1, darkenColor(color, 15));
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  if (variety === 0) {
    ctx.bezierCurveTo(-width * 0.6, -length * 0.25, -width * 0.55, -length * 0.75, 0, -length);
    ctx.bezierCurveTo(width * 0.55, -length * 0.75, width * 0.6, -length * 0.25, 0, 0);
  } else if (variety === 1) {
    ctx.bezierCurveTo(-width * 0.4, -length * 0.3, -width * 0.2, -length * 0.85, 0, -length);
    ctx.bezierCurveTo(width * 0.2, -length * 0.85, width * 0.4, -length * 0.3, 0, 0);
  } else {
    ctx.bezierCurveTo(-width * 0.7, -length * 0.15, -width * 0.65, -length * 0.6, -width * 0.1, -length * 0.95);
    ctx.quadraticCurveTo(0, -length * 1.05, width * 0.1, -length * 0.95);
    ctx.bezierCurveTo(width * 0.65, -length * 0.6, width * 0.7, -length * 0.15, 0, 0);
  }
  ctx.fill();
  ctx.strokeStyle = darkenColor(color, 10);
  ctx.globalAlpha = alpha * 0.15;
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  ctx.moveTo(0, -2);
  ctx.quadraticCurveTo(0, -length * 0.5, 0, -length * 0.85);
  ctx.stroke();
  ctx.restore();
}

function drawFlowers(ctx: CanvasRenderingContext2D, flowers: Flower[], now: number, mx: number, my: number) {
  flowers.forEach(f => {
    const elapsed = (now - f.startTime) / 1000;
    const stemDur = 0.8, bloomDur = 0.6;
    const stemP = Math.min(elapsed / stemDur, 1);
    const rawBloom = Math.max(0, (elapsed - stemDur) / bloomDur);
    const bloomP = Math.min(easeOutBack(Math.min(rawBloom, 1)), 1.15);
    const sway = rawBloom >= 1 ? Math.sin(now * 0.001 + f.swayPhase) * 0.03 : 0;
    const dx = mx - f.x, dy = my - f.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const mouseInf = Math.max(0, 1 - dist / 300) * 0.04;
    const mouseAng = Math.atan2(dx, -dy);
    const stemTop = f.y, stemBottom = ctx.canvas.height;
    const stemLen = stemBottom - stemTop;
    const curTop = stemBottom - stemLen * easeOutCubic(stemP);
    // Curved stem
    ctx.save();
    ctx.strokeStyle = f.palette.stem;
    ctx.globalAlpha = 0.7;
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(f.x, stemBottom);
    ctx.quadraticCurveTo(f.x + f.stemCurve * 30, stemBottom - stemLen * 0.5, f.x + sway * 50, curTop);
    ctx.stroke();
    // Leaves
    if (stemP > 0.4) {
      const lY = stemBottom - stemLen * 0.35;
      const lS = 6 * Math.min((stemP - 0.4) / 0.3, 1);
      ctx.fillStyle = f.palette.stem;
      ctx.globalAlpha = 0.55;
      ctx.beginPath(); ctx.ellipse(f.x - 5, lY, lS, lS * 0.4, -Math.PI / 4, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(f.x + 5, lY - 15, lS * 0.8, lS * 0.35, Math.PI / 4, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
    // Bloom
    if (rawBloom > 0) {
      const bSize = f.size * Math.min(bloomP, 1);
      const bAlpha = Math.min(rawBloom * 2, 0.9);
      const fx = f.x + sway * 50, fy = curTop;
      // Shadow
      ctx.save(); ctx.globalAlpha = bAlpha * 0.08; ctx.fillStyle = '#000';
      ctx.beginPath(); ctx.ellipse(fx + 2, fy + 3, bSize * 0.7, bSize * 0.2, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      const rot = f.baseRotation + sway + mouseAng * mouseInf;
      // Outer petals
      for (let p = 0; p < f.petalCount; p++) {
        drawPetal(ctx, fx, fy, rot + (p / f.petalCount) * Math.PI * 2,
          bSize * 0.95, bSize * (f.variety === 1 ? 0.28 : 0.4),
          darkenColor(f.palette.petals, 8), f.palette.highlight, bAlpha * 0.7, f.variety);
      }
      // Inner petals
      for (let p = 0; p < f.petalCount; p++) {
        drawPetal(ctx, fx, fy, rot + ((p + 0.5) / f.petalCount) * Math.PI * 2,
          bSize * 0.7, bSize * (f.variety === 1 ? 0.22 : 0.32),
          f.palette.petals, f.palette.highlight, bAlpha * 0.85, f.variety);
      }
      // Center
      ctx.save(); ctx.globalAlpha = bAlpha;
      const cg = ctx.createRadialGradient(fx, fy, 0, fx, fy, bSize * 0.2);
      cg.addColorStop(0, lightenColor(f.palette.center, 20));
      cg.addColorStop(0.6, f.palette.center);
      cg.addColorStop(1, darkenColor(f.palette.center, 20));
      ctx.fillStyle = cg;
      ctx.beginPath(); ctx.arc(fx, fy, bSize * 0.18, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = darkenColor(f.palette.center, 30); ctx.globalAlpha = bAlpha * 0.4;
      for (let d = 0; d < 5; d++) {
        const da = (d / 5) * Math.PI * 2 + f.baseRotation, dr = bSize * 0.09;
        ctx.beginPath(); ctx.arc(fx + Math.cos(da) * dr, fy + Math.sin(da) * dr, 1.5, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();
    }
  });
}

export default function VortexPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const flowerCanvasRef = useRef<HTMLCanvasElement>(null);
  const flowersRef = useRef<Flower[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const threeRef = useRef<any>(null);
  const [modalData, setModalData] = useState<any>(null);

  // ── Organic Flower overlay ──
  useEffect(() => {
    const canvas = flowerCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    function onMouseMoveFlower(e: MouseEvent) {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    }
    window.addEventListener('mousemove', onMouseMoveFlower);

    // Pre-spawn 5 flowers already bloomed
    const now = performance.now();
    const preSpawns = [
      { x: window.innerWidth * 0.06, y: window.innerHeight * 0.55 },
      { x: window.innerWidth * 0.9, y: window.innerHeight * 0.3 },
      { x: window.innerWidth * 0.74, y: window.innerHeight * 0.72 },
      { x: window.innerWidth * 0.13, y: window.innerHeight * 0.2 },
      { x: window.innerWidth * 0.52, y: window.innerHeight * 0.88 },
    ];
    preSpawns.forEach((pos, idx) => {
      const palette = FLOWER_PALETTES[idx % FLOWER_PALETTES.length];
      flowersRef.current.push({
        x: pos.x, y: pos.y,
        startTime: now - 5000 - idx * 500,
        palette,
        petalCount: [5, 6, 7, 8][idx % 4],
        size: 28 + Math.random() * 18,
        baseRotation: Math.random() * Math.PI * 2,
        variety: idx % 3,
        swayPhase: Math.random() * Math.PI * 2,
        stemCurve: (Math.random() - 0.5) * 2,
      });
    });

    let flowerAnimId: number;
    function animateFlowers() {
      flowerAnimId = requestAnimationFrame(animateFlowers);
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      drawFlowers(ctx!, flowersRef.current, performance.now(), mouseRef.current.x, mouseRef.current.y);
      const now = performance.now();
      flowersRef.current = flowersRef.current.filter(f => (now - f.startTime) < 45000);
    }
    animateFlowers();

    return () => {
      cancelAnimationFrame(flowerAnimId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMoveFlower);
    };
  }, []);

  // ── Three.js init (your exact Variant code) ──
  useEffect(() => {
    let THREE: any;
    let animId: number;

    async function init() {
      THREE = await import('three');
      if (!containerRef.current) return;

      const scene = new THREE.Scene();
      // No scene.background — let renderer be transparent so flower canvas shows behind
      scene.fog = new THREE.Fog(COLORS.bg, 10, 40);

      const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.set(0, 0, 22);
      camera.lookAt(0, 0, 0);

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setClearColor(0x000000, 0); // transparent background
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      containerRef.current.appendChild(renderer.domElement);

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambientLight);
      const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
      dirLight.position.set(10, 20, 10);
      scene.add(dirLight);

      const vortexGroup = new THREE.Group();
      scene.add(vortexGroup);

      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();
      const cards: any[] = [];

      let isDragging = false;
      let previousMousePosition = { x: 0, y: 0 };
      let targetRotationY = 0;
      let currentRotationY = 0;
      let scrollPos = 0;
      let targetScrollPos = 0;

      // ── Create vortex (your exact code) ──
      const textureLoader = new THREE.TextureLoader();
      const cardGeometry = new THREE.PlaneGeometry(4, 2.9);
      const radius = 6;
      const heightStep = 1.2;
      const angleStep = Math.PI / 3.5;

      // Helper: create a flipped-UV geometry for the back face
      function makeBackGeometry(w: number, h: number) {
        const geo = new THREE.PlaneGeometry(w, h);
        const uv = geo.attributes.uv;
        for (let j = 0; j < uv.count; j++) {
          uv.setX(j, 1 - uv.getX(j)); // mirror UVs horizontally
        }
        uv.needsUpdate = true;
        return geo;
      }
      const backCardGeo = makeBackGeometry(4, 2.9);

      CARD_DATA.forEach((data, i) => {
        const borderColor = COLORS[data.type] || '#ffffff';

        textureLoader.load(data.img, (texture: any) => {
          texture.minFilter = THREE.LinearFilter;
          // Front face
          const frontMat = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.FrontSide,
          });
          const card = new THREE.Mesh(cardGeometry, frontMat);

          const angle = i * angleStep;
          const y = (i * heightStep) - (CARD_DATA.length * heightStep / 2);
          const x = Math.cos(angle) * radius;
          const z = Math.sin(angle) * radius;
          card.position.set(x, y, z);

          card.lookAt(0, y, 0);
          card.rotateY(Math.PI);
          card.rotateX((Math.random() - 0.5) * 0.2);
          card.rotateZ((Math.random() - 0.5) * 0.2);

          // Back face — rotated 180° so FrontSide faces backward, UV-flipped to un-mirror
          const backMat = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.FrontSide,
          });
          const backCard = new THREE.Mesh(backCardGeo, backMat);
          backCard.rotation.y = Math.PI;
          backCard.position.z = -0.02;
          backCard.userData = { ...data, id: i };
          card.add(backCard);

          // Colored border FRAME (hollow — no longer blocks back face)
          const borderShape = new THREE.Shape();
          borderShape.moveTo(-2.05, -1.5);
          borderShape.lineTo( 2.05, -1.5);
          borderShape.lineTo( 2.05,  1.5);
          borderShape.lineTo(-2.05,  1.5);
          borderShape.closePath();
          const holePath = new THREE.Path();
          holePath.moveTo(-2.0, -1.45);
          holePath.lineTo( 2.0, -1.45);
          holePath.lineTo( 2.0,  1.45);
          holePath.lineTo(-2.0,  1.45);
          holePath.closePath();
          borderShape.holes.push(holePath);
          const borderGeo = new THREE.ShapeGeometry(borderShape);
          const borderMat = new THREE.MeshBasicMaterial({ color: borderColor, side: THREE.DoubleSide });
          const border = new THREE.Mesh(borderGeo, borderMat);
          border.position.z = -0.05;
          card.add(border);

          card.userData = { ...data, id: i };
          vortexGroup.add(card);
          cards.push(card);
        });
      });

      // ── Create wireframe (your exact code) ──
      const points: any[] = [];
      for (let i = 0; i < CARD_DATA.length; i++) {
        const angle = i * angleStep;
        const y = (i * heightStep) - (CARD_DATA.length * heightStep / 2);
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        points.push(new THREE.Vector3(x, y, z));
      }
      const spiralGeo = new THREE.BufferGeometry().setFromPoints(points);
      const lineMat = new THREE.LineBasicMaterial({ color: 0x1F1F1B, opacity: 0.3, transparent: true });
      vortexGroup.add(new THREE.Line(spiralGeo, lineMat));

      const itemsPerRotation = Math.floor((Math.PI * 2) / angleStep);
      const vertPoints: any[] = [];
      for (let i = 0; i < CARD_DATA.length - itemsPerRotation; i++) {
        if (points[i] && points[i + itemsPerRotation]) {
          vertPoints.push(points[i], points[i + itemsPerRotation]);
        }
      }
      const vGeo = new THREE.BufferGeometry().setFromPoints(vertPoints);
      vortexGroup.add(new THREE.LineSegments(vGeo, lineMat));

      const axisPoints = [new THREE.Vector3(0, -30, 0), new THREE.Vector3(0, 30, 0)];
      const axisGeo = new THREE.BufferGeometry().setFromPoints(axisPoints);
      vortexGroup.add(new THREE.Line(axisGeo, new THREE.LineBasicMaterial({ color: 0x1F1F1B, opacity: 0.1, transparent: true })));


      // ── Grass floor at bottom of helix ──
      const floorY = -(CARD_DATA.length * heightStep / 2) - 2.5;
      const grassCanvas = document.createElement('canvas');
      grassCanvas.width = 512;
      grassCanvas.height = 512;
      const gCtx = grassCanvas.getContext('2d')!;
      // Base grass color
      gCtx.fillStyle = '#5a8f3e';
      gCtx.fillRect(0, 0, 512, 512);
      // Grass blades / patches
      for (let gi = 0; gi < 3000; gi++) {
        const gx = Math.random() * 512;
        const gy = Math.random() * 512;
        const hue = 75 + Math.random() * 45;
        const light = 25 + Math.random() * 35;
        gCtx.fillStyle = `hsl(${hue}, 55%, ${light}%)`;
        gCtx.fillRect(gx, gy, 1 + Math.random() * 3, 4 + Math.random() * 8);
      }
      // Yellow/brown dirt patches
      for (let gi = 0; gi < 200; gi++) {
        const gx = Math.random() * 512;
        const gy = Math.random() * 512;
        gCtx.fillStyle = `hsl(${40 + Math.random() * 20}, 40%, ${35 + Math.random() * 20}%)`;
        gCtx.fillRect(gx, gy, 3 + Math.random() * 8, 2 + Math.random() * 5);
      }
      const grassTexture = new THREE.CanvasTexture(grassCanvas);
      grassTexture.wrapS = THREE.RepeatWrapping;
      grassTexture.wrapT = THREE.RepeatWrapping;
      grassTexture.repeat.set(6, 6);
      const floorGeo = new THREE.CircleGeometry(18, 64);
      const floorMat = new THREE.MeshLambertMaterial({ map: grassTexture, side: THREE.DoubleSide });
      const floor = new THREE.Mesh(floorGeo, floorMat);
      floor.rotation.x = -Math.PI / 2;
      floor.position.y = floorY;
      vortexGroup.add(floor);

      // ── Events (your exact code) ──
      function onMouseMove(e: MouseEvent) {
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        if (isDragging) {
          targetRotationY += (e.clientX - previousMousePosition.x) * 0.005;
          targetScrollPos += (e.clientY - previousMousePosition.y) * 0.05;
          previousMousePosition = { x: e.clientX, y: e.clientY };
        }
      }
      function onMouseDown(e: MouseEvent) {
        isDragging = true;
        previousMousePosition = { x: e.clientX, y: e.clientY };
      }
      function onMouseUp(e: MouseEvent) {
        const dragDist = Math.abs(e.clientX - previousMousePosition.x) + Math.abs(e.clientY - previousMousePosition.y);
        isDragging = false;
        if (dragDist > 5) return; // was a drag, not a click
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(cards, true);
        if (intersects.length > 0) {
          let obj = intersects[0].object;
          while (obj && !obj.userData?.title) {
            obj = obj.parent;
          }
          if (obj?.userData?.title) {
            setModalData(obj.userData);
            return;
          }
        }
        // No card hit — spawn a flower
        const palette = FLOWER_PALETTES[Math.floor(Math.random() * FLOWER_PALETTES.length)];
        flowersRef.current.push({
          x: e.clientX, y: e.clientY,
          startTime: performance.now(),
          palette,
          petalCount: [5, 6, 7, 8][Math.floor(Math.random() * 4)],
          size: 30 + Math.random() * 20,
          baseRotation: Math.random() * Math.PI * 2,
          variety: Math.floor(Math.random() * 3),
          swayPhase: Math.random() * Math.PI * 2,
          stemCurve: (Math.random() - 0.5) * 2,
        });
      }
      function onWheel(e: WheelEvent) {
        e.preventDefault();
        targetScrollPos += e.deltaY * 0.008;
        targetRotationY += e.deltaY * 0.003;
      }
      function onResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mousedown', onMouseDown);
      document.addEventListener('mouseup', onMouseUp);
      document.addEventListener('wheel', onWheel, { passive: false });
      window.addEventListener('resize', onResize);

      // ── Animate (your exact code) ──
      function animate() {
        animId = requestAnimationFrame(animate);
        currentRotationY += (targetRotationY - currentRotationY) * 0.05;
        vortexGroup.rotation.y = currentRotationY;
        scrollPos += (targetScrollPos - scrollPos) * 0.05;
        if (scrollPos > 10) targetScrollPos = 10;
        if (scrollPos < -10) targetScrollPos = -10;
        vortexGroup.position.y = scrollPos;
        if (!isDragging) targetRotationY += 0.0015;
        renderer.render(scene, camera);
      }
      animate();

      threeRef.current = {
        cleanup: () => {
          cancelAnimationFrame(animId);
          document.removeEventListener('mousemove', onMouseMove);
          document.removeEventListener('mousedown', onMouseDown);
          document.removeEventListener('mouseup', onMouseUp);
          document.removeEventListener('wheel', onWheel);
          window.removeEventListener('resize', onResize);
          renderer.dispose();
          if (containerRef.current?.contains(renderer.domElement)) {
            containerRef.current.removeChild(renderer.domElement);
          }
        },
      };
    }

    init();
    return () => threeRef.current?.cleanup?.();
  }, []);

  function closeModal() {
    setModalData(null);
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500;600&display=swap');
        html, body { margin: 0; padding: 0; overflow: hidden; font-family: 'Space Mono', monospace; background-color: #87CEEB; color: #1F1F1B; height: 100%; }
        #__next { height: 100%; }
        .vortex-canvas { width: 100vw; height: 100vh; position: fixed; top: 0; left: 0; z-index: 1; }
        .vortex-ui { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 10; pointer-events: none; padding: 2rem; display: flex; flex-direction: column; justify-content: space-between; }
        .vortex-bio { display: flex; flex-direction: column; align-items: flex-start; gap: 0.8rem; max-width: 26rem; }
        .vortex-bio-img { width: 156px; height: 156px; border-radius: 50%; object-fit: cover; border: 4px solid #1F1F1B; flex-shrink: 0; align-self: center; }
        .vortex-bio-text h1 { font-family: 'Inter', sans-serif; font-size: 2.2rem; font-weight: 900; letter-spacing: -0.04em; margin: 0 0 0.5rem 0; color: #1F1F1B; }
        .vortex-bio-text h1 .hl { background: linear-gradient(transparent 55%, #FFFB26 55%); }
        .vortex-bio-text p { font-family: 'Space Mono', monospace; font-size: 0.72rem; line-height: 1.65; margin: 0 0 0.45rem 0; color: #1F1F1B; font-weight: 700; }
        .vortex-bio-text p:last-of-type { margin-bottom: 0; }
        .vortex-bio-text .hl-green { background: linear-gradient(transparent 55%, #8BFF81 55%); }
        .vortex-bio-text .hl-red { background: linear-gradient(transparent 55%, #FF5837 55%); padding: 0 2px; }
        .vortex-bio-text .hl-yellow { background: linear-gradient(transparent 55%, #FFFB26 55%); }
        .vortex-bio-text .hl-tan { background: linear-gradient(transparent 55%, #E9E6D4 55%); }
        .vortex-bio-text .co { pointer-events: auto; cursor: default; padding: 0 1px; transition: background 0.25s ease; }
        .vortex-bio-text .co-y:hover { background: linear-gradient(transparent 55%, #FFFB26 55%); }
        .vortex-bio-text .co-g:hover { background: linear-gradient(transparent 55%, #8BFF81 55%); }
        .vortex-bio-text .co-r:hover { background: linear-gradient(transparent 55%, #FF5837 55%); }
        .vortex-bio-text .co-t:hover { background: linear-gradient(transparent 55%, #E9E6D4 55%); }
        .vortex-bio-link { display: inline-flex; align-items: center; gap: 0.35rem; margin-top: 0.6rem; font-family: 'Space Mono', monospace; font-size: 0.68rem; font-weight: 700; color: #1F1F1B; text-decoration: none; text-transform: uppercase; letter-spacing: 0.1em; pointer-events: auto; transition: color 0.2s; }
        .vortex-bio-link:hover { color: #FF5837; }
        @media (max-width: 768px) {
          .vortex-bio { align-items: center; text-align: center; max-width: 22rem; }
          .vortex-bio-img { width: 120px; height: 120px; }
          .vortex-bio-text h1 { font-size: 1.6rem; }
        }
        .vortex-modal-bg { position: fixed; inset: 0; background: rgba(0,0,0,0.4); backdrop-filter: blur(4px); z-index: 40; display: flex; align-items: center; justify-content: center; padding: 1rem; }
        .vortex-modal { background: #E9E6D4; width: 100%; max-width: 56rem; max-height: 90vh; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); border: 2px solid #1F1F1B; position: relative; }
        .vortex-modal-close { position: absolute; top: 1rem; right: 1rem; z-index: 50; background: #1F1F1B; color: white; width: 2.5rem; height: 2.5rem; display: flex; align-items: center; justify-content: center; border: none; cursor: pointer; transition: background 0.2s; }
        .vortex-modal-close:hover { background: #FF5837; }
        .vortex-modal-body { display: flex; }
        .vortex-modal-img { width: 50%; min-height: 300px; background: #ddd; border-right: 2px solid #1F1F1B; display: flex; align-items: center; justify-content: center; padding: 2rem; }
        .vortex-modal-img img { max-width: 80%; max-height: 200px; object-fit: contain; }
        .vortex-modal-details { width: 50%; display: flex; flex-direction: column; background: #f8f6e9; }
        .vortex-modal-inner { padding: 2rem; overflow-y: auto; flex-grow: 1; }
        .vortex-modal-inner::-webkit-scrollbar { width: 4px; }
        .vortex-modal-inner::-webkit-scrollbar-thumb { background: #1F1F1B; }
        .vortex-modal-footer { padding: 1rem 2rem; background: #1F1F1B; color: #E9E6D4; font-size: 0.7rem; display: flex; justify-content: space-between; }
        .vortex-badge { position: absolute; top: 1rem; left: 1rem; padding: 0.25rem 0.75rem; font-size: 0.65rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; border: 1px solid #1F1F1B; background: white; }
        .vortex-tags { margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid rgba(31,31,27,0.2); display: flex; flex-wrap: wrap; gap: 0.5rem; }
        .vortex-tag { padding: 0.2rem 0.5rem; background: rgba(31,31,27,0.1); font-size: 0.6rem; font-weight: 700; text-transform: uppercase; }
        .vortex-link { display: inline-flex; align-items: center; gap: 0.4rem; margin-top: 1.25rem; padding: 0.5rem 1rem; background: #1F1F1B; color: #E9E6D4; font-family: 'Space Mono', monospace; font-size: 0.7rem; font-weight: 700; text-decoration: none; text-transform: uppercase; letter-spacing: 0.05em; transition: background 0.2s; border: none; cursor: pointer; }
        .vortex-link:hover { background: #FF5837; }
        @media (max-width: 768px) {
          .vortex-modal-body { flex-direction: column; }
          .vortex-modal-img { width: 100%; min-height: 180px; border-right: none; border-bottom: 2px solid #1F1F1B; }
          .vortex-modal-details { width: 100%; }
        }
      `}</style>

      {/* Canvas container */}
      <div ref={containerRef} className="vortex-canvas" />

      {/* ASCII Flower overlay */}
      <canvas ref={flowerCanvasRef} style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }} />

      {/* UI Overlay */}
      <div className="vortex-ui">
        <div className="vortex-bio">
          <img src="/images/headshot-jack.jpg" alt="Jack Morello" className="vortex-bio-img" />
          <div className="vortex-bio-text">
            <h1><span className="hl">Jack Morello</span></h1>
            <p><span className="hl-yellow">Agency Work:</span> I ran paid social for <span className="co co-y">Starbucks</span>, <span className="co co-g">Toyota</span>, and <span className="co co-r">Starzplay</span> at <span className="co co-y">iHeartMedia</span>, and managed digital campaigns for <span className="co co-g">Disney</span>, <span className="co co-r">Amazon</span>, <span className="co co-y">Sony</span>, <span className="co co-g">NBC</span>, and <span className="co co-r">Netflix</span> at <span className="co co-y">EPK.TV</span>.</p>
            <p><span className="hl-red">Start-Up Work:</span> Led marketing at <span className="co co-g">Dtravel</span>, <span className="co co-r">NEAR Tasks</span>, and <span className="co co-y">Devolved AI</span>. <span className="hl-red">Scaled two past $100M.</span> <span className="hl-green">Cut acquisition costs 60%</span> at NEAR by tearing apart the funnel and rebuilding it.</p>
            <p><span className="hl-green">Personal:</span> Currently building <span className="co co-r">CRIBS.FUN</span> — a real estate price guessing game that <span className="hl-green">ranks #1 in SEO</span> for its category.</p>
            <p><span className="hl-tan">Former college baseball pitcher.</span> Hanging with my dog George. <span className="co co-y">Lakers</span>, <span className="co co-g">Dodgers</span>, <span className="co co-r">Eagles</span>.</p>
            <a href="https://www.linkedin.com/in/jackmorello/" target="_blank" rel="noopener noreferrer" className="vortex-bio-link">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              LinkedIn
            </a>
          </div>
        </div>
        <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>
          <p>SCROLL TO ROTATE // CLICK TO EXPAND</p>
          <p style={{ marginTop: '0.25rem' }}>JACK MORELLO — PORTFOLIO</p>
        </div>
      </div>

      {/* Modal */}
      {modalData && (
        <div className="vortex-modal-bg" onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
          <div className="vortex-modal">
            <button className="vortex-modal-close" onClick={closeModal}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
            <div className="vortex-modal-body">
              <div className="vortex-modal-img" style={{ position: 'relative' }}>
                <img src={modalData.img} alt={modalData.title} />
                <span className="vortex-badge" style={{ color: COLORS[modalData.type] === '#E9E6D4' ? '#1F1F1B' : COLORS[modalData.type] }}>
                  {modalData.type}
                </span>
              </div>
              <div className="vortex-modal-details">
                <div className="vortex-modal-inner">
                  <div style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(31,31,27,0.2)' }}>
                    <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>{modalData.title}</h2>
                    <p style={{ fontSize: '0.8rem', color: '#666' }}>{modalData.client} // {modalData.period}</p>
                  </div>
                  {modalData.metrics && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                      <div style={{ textAlign: 'center', padding: '0.5rem', background: 'white', border: '1px solid #1F1F1B' }}>
                        <div style={{ fontSize: '0.65rem', color: '#999', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Impact</div>
                        <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>High</div>
                      </div>
                      <div style={{ textAlign: 'center', padding: '0.5rem', background: 'white', border: '1px solid #1F1F1B' }}>
                        <div style={{ fontSize: '0.65rem', color: '#999', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Scale</div>
                        <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>Global</div>
                      </div>
                      <div style={{ textAlign: 'center', padding: '0.5rem', background: 'white', border: '1px solid #1F1F1B' }}>
                        <div style={{ fontSize: '0.65rem', color: '#999', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Type</div>
                        <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{modalData.type}</div>
                      </div>
                    </div>
                  )}
                  <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', lineHeight: 1.7 }}>
                    <p>{modalData.desc}</p>
                  </div>
                  <div className="vortex-tags">
                    {getTagsForType(modalData.type).map((tag, i) => (
                      <span key={i} className="vortex-tag">{tag}</span>
                    ))}
                  </div>
                  {modalData.link && (
                    <a href={modalData.link} target="_blank" rel="noopener noreferrer" className="vortex-link">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                      {modalData.linkLabel || 'View Project'}
                    </a>
                  )}
                </div>
                <div className="vortex-modal-footer">
                  <span>ID: #{String(modalData.id).padStart(3, '0')}</span>
                  <span>STATUS: ARCHIVED</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
