import type { Metadata } from 'next';
import StructureViewer from '../components/molecule/StructureViewer';

export const metadata: Metadata = {
  title: 'Compound Structure Banner',
  description:
    'Interactive 3D structure banner rendering a peptide catalog from published atomic coordinates.',
  // Client work shown for review, not something to surface in search.
  robots: { index: false, follow: false },
};

export default function CompoundBannerPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#f3f5f7' }}>
      {/* Full-bleed banner — this is the deliverable. */}
      <StructureViewer />

      <div
        style={{
          maxWidth: 940,
          margin: '0 auto',
          padding: '56px 24px 110px',
          fontFamily: 'Inter, system-ui, sans-serif',
          color: '#181e25',
        }}
      >
        <h1
          style={{
            fontFamily: 'Manrope, Inter, sans-serif',
            fontSize: 32,
            lineHeight: 1.15,
            margin: '0 0 16px',
            letterSpacing: '-0.02em',
          }}
        >
          Compound structure banner
        </h1>

        <p style={{ color: '#4a5563', lineHeight: 1.75, maxWidth: '64ch', margin: '0 0 28px' }}>
          A banner-format 3D viewer for a peptide catalog. Drag to rotate, scroll to
          zoom, hover an atom for its element and coordinates, and scroll the rail to
          switch compounds. Everything renders in WebGL from real atomic coordinates —
          no illustrations.
        </p>

        <dl
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
            gap: '22px 32px',
            margin: 0,
            paddingTop: 26,
            borderTop: '1px solid #d0d6dc',
          }}
        >
          {[
            ['Structures', '25, each verified against PubChem'],
            ['Coordinates', '19 RDKit ETKDGv3 conformers, 6 PubChem 3D records'],
            ['Verification', 'Molecular formula and bond geometry, gated in CI script'],
            ['Renderer', 'three.js — instanced geometry, shadow-mapped, ~700 atoms'],
          ].map(([term, def]) => (
            <div key={term}>
              <dt
                style={{
                  fontSize: 11,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: '#8a94a2',
                  marginBottom: 6,
                }}
              >
                {term}
              </dt>
              <dd style={{ margin: 0, fontSize: 14.5, lineHeight: 1.55, color: '#2c3542' }}>
                {def}
              </dd>
            </div>
          ))}
        </dl>

        <p
          style={{
            marginTop: 34,
            paddingTop: 20,
            borderTop: '1px solid #d0d6dc',
            color: '#6b7684',
            fontSize: 13,
            lineHeight: 1.7,
            maxWidth: '70ch',
          }}
        >
          Conformers are low-energy computed poses, not experimentally determined
          structures. Bond lengths, angles and stereochemistry are chemically valid;
          the specific fold shown is one plausible conformation.
        </p>
      </div>
    </main>
  );
}
