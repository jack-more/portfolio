'use client';

import { useCallback, useState } from 'react';
import styles from './field.module.css';

/* Pixel-art sprites that sprout / leap where you click. Kept crisp with
   shapeRendering=crispEdges so they read as pixels at any scale. */

const FLOWER_COLORS = [
  { petal: '#ff5a5f', center: '#ffd23f' },
  { petal: '#ffd23f', center: '#7a4a12' },
  { petal: '#ff8c42', center: '#e5484d' },
  { petal: '#ff9ec7', center: '#e5484d' },
  { petal: '#ffffff', center: '#ffd23f' },
];

const DOG_COLORS = ['#ffffff', '#e8c9a0', '#c9d1d9', '#20242c'];

let uid = 0;

type Sprite =
  | { id: number; kind: 'flower'; x: number; y: number; scale: number; petal: string; center: string }
  | { id: number; kind: 'dog'; x: number; y: number; scale: number; color: string; flip: number };

function Flower({ petal, center }: { petal: string; center: string }) {
  const g = '#2f8f3a';
  return (
    <svg viewBox="0 0 11 17" className={styles.svg} shapeRendering="crispEdges" aria-hidden="true">
      <rect x="5" y="7" width="1" height="9" fill={g} />
      <rect x="3" y="11" width="2" height="1" fill={g} />
      <rect x="6" y="9" width="2" height="1" fill={g} />
      <rect x="5" y="0" width="1" height="1" fill={petal} />
      <rect x="4" y="1" width="3" height="1" fill={petal} />
      <rect x="3" y="2" width="5" height="1" fill={petal} />
      <rect x="4" y="3" width="3" height="1" fill={petal} />
      <rect x="5" y="4" width="1" height="1" fill={petal} />
      <rect x="5" y="2" width="1" height="1" fill={center} />
    </svg>
  );
}

function Dog({ color }: { color: string }) {
  const k = '#20242c';
  return (
    <svg viewBox="0 0 16 12" className={styles.svgDog} shapeRendering="crispEdges" aria-hidden="true">
      <rect x="3" y="4" width="8" height="3" fill={color} />
      <rect x="10" y="2" width="3" height="3" fill={color} />
      <rect x="12" y="1" width="1" height="2" fill={color} />
      <rect x="13" y="4" width="1" height="1" fill={color} />
      <rect x="1" y="3" width="2" height="1" fill={color} />
      <rect x="3" y="7" width="1" height="3" fill={color} />
      <rect x="5" y="7" width="1" height="2" fill={color} />
      <rect x="9" y="7" width="1" height="2" fill={color} />
      <rect x="10" y="7" width="1" height="3" fill={color} />
      <rect x="11" y="3" width="1" height="1" fill={k} />
    </svg>
  );
}

const rand = (a: number, b: number) => a + Math.random() * (b - a);
const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

export default function DogwalkField() {
  const [sprites, setSprites] = useState<Sprite[]>([]);
  const [poked, setPoked] = useState(false);

  const spawn = useCallback((x: number, y: number) => {
    setPoked(true);
    const add: Sprite[] = [];
    const n = 1 + Math.floor(Math.random() * 2);
    for (let i = 0; i < n; i++) {
      const c = pick(FLOWER_COLORS);
      add.push({ id: ++uid, kind: 'flower', x: x + rand(-22, 22), y: y + rand(-8, 8), scale: rand(0.8, 1.5), petal: c.petal, center: c.center });
    }
    if (Math.random() < 0.6) {
      add.push({ id: ++uid, kind: 'dog', x: x + rand(-16, 16), y, scale: rand(1, 1.8), color: pick(DOG_COLORS), flip: Math.random() < 0.5 ? -1 : 1 });
    }
    setSprites((prev) => {
      const next = [...prev, ...add];
      // Keep the field from growing without bound: cap each kind, dropping oldest.
      const cap = (kind: 'flower' | 'dog', max: number, list: Sprite[]) => {
        const of = list.filter((s) => s.kind === kind);
        if (of.length <= max) return list;
        const stale = new Set(of.slice(0, of.length - max).map((s) => s.id));
        return list.filter((s) => !stale.has(s.id));
      };
      return cap('dog', 10, cap('flower', 48, next));
    });
  }, []);

  const onDown = (e: React.PointerEvent) => {
    const t = e.target as HTMLElement;
    if (t.closest('a,button,input,select,textarea,label')) return;
    spawn(e.clientX, e.clientY);
  };

  return (
    <div className={styles.field} onPointerDown={onDown}>
      {sprites.map((s) => (
        <span
          key={s.id}
          className={s.kind === 'flower' ? styles.flower : styles.dog}
          style={{ left: s.x, top: s.y, ['--s' as string]: s.scale, ['--flip' as string]: s.kind === 'dog' ? s.flip : 1 }}
        >
          {s.kind === 'flower' ? <Flower petal={s.petal} center={s.center} /> : <Dog color={s.color} />}
        </span>
      ))}
      {!poked && <span className={styles.hint}>click anywhere ✲</span>}
    </div>
  );
}
