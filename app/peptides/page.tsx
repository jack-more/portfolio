import type { Metadata } from 'next';
import StructureViewer from '../components/molecule/StructureViewer';

export const metadata: Metadata = {
  title: 'Structure Scan',
  robots: { index: false, follow: false },
};

export default function PeptidesPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#f3f5f7' }}>
      {/* Full-bleed banner at the top of the page. */}
      <StructureViewer />

      {/* Placeholder for whatever the page carries below the banner — present
          so the banner can be judged in context rather than in isolation. */}
      <div
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: '56px 24px 96px',
          fontFamily: 'Inter, system-ui, sans-serif',
          color: '#181e25',
        }}
      >
        <h1 style={{ fontFamily: 'Manrope, Inter, sans-serif', fontSize: 30, margin: '0 0 12px' }}>
          Page content sits here
        </h1>
        <p style={{ color: '#5b6673', lineHeight: 1.7, maxWidth: '62ch', margin: 0 }}>
          The module above is the banner. Structures are rendered from published
          atomic coordinates and verified against PubChem for both molecular
          formula and bond geometry before they ship.
        </p>
      </div>
    </main>
  );
}
