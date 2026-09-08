'use client';

import { useSearchParams } from 'next/navigation';
import StructureViewer from '../components/molecule/StructureViewer';

export default function Embed() {
  const q = useSearchParams();
  const c = q.get('c') ?? 'bpc157';
  const cycle = Number(q.get('cycle') ?? '0') || 0;
  const tq = q.get('t');
  const t = tq === 'pigment' ? 'sko' : tq === 'snow' ? 'sko-snow' : 'sko-white';
  const zoom = Number(q.get('z') ?? '1.3') || 1.3;
  const ox = Number(q.get('ox') ?? '0') || 0;
  const spin = q.get('spin') !== '0';
  const label = q.get('label') !== '0';
  const wheel = q.get('wheel') === '1';
  const finish = q.get('m') === 'frost' ? 'frost' : 'chrome';
  return (
    <div style={{ position: 'absolute', inset: 0, background: t === 'sko' ? '#0130C0' : t === 'sko-snow' ? 'url(/sko/scene.jpg) center 60% / cover no-repeat #1b4fd0' : '#ffffff' }}>
      <StructureViewer theme={t} embed initial={c} cycle={cycle} zoom={zoom} offsetX={ox} autoSpin={spin} showLabel={label} wheelZoom={wheel} finish={finish} />
    </div>
  );
}
