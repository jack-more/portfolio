import type { Metadata } from 'next';
import StructureViewer from '../components/molecule/StructureViewer';

export const metadata: Metadata = {
  title: 'SKO Structures',
  description: 'The SKO catalogue as chrome: every compound from its real atomic coordinates, in the edition-three brand system.',
  robots: { index: false, follow: false },
};

/**
 * The compound banner in SKO edition three: chrome molecule on Pigment, with
 * the white ground beneath it. Same viewer, same coordinates, different skin.
 */
export default function SkoBannerPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#0130C0' }}>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Syncopate:wght@700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;700&display=swap"
      />
      <StructureViewer theme="sko" />
      <div style={{ background: '#ffffff' }}>
        <StructureViewer theme="sko-white" />
      </div>
    </main>
  );
}
