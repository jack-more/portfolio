'use client';

import { useSearchParams } from 'next/navigation';
import StructureViewer from '../components/molecule/StructureViewer';

export default function Embed() {
  const q = useSearchParams();
  const c = q.get('c') ?? 'bpc157';
  const cycle = Number(q.get('cycle') ?? '0') || 0;
  const t = q.get('t') === 'pigment' ? 'sko' : 'sko-white';
  const zoom = Number(q.get('z') ?? '1.3') || 1.3;
  const ox = Number(q.get('ox') ?? '0') || 0;
  return (
    <div style={{ position: 'absolute', inset: 0, background: t === 'sko' ? '#0130C0' : '#ffffff' }}>
      <StructureViewer theme={t} embed initial={c} cycle={cycle} zoom={zoom} offsetX={ox} />
    </div>
  );
}
