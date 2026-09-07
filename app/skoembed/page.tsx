import type { Metadata } from 'next';
import { Suspense } from 'react';
import Embed from './Embed';

export const metadata: Metadata = {
  title: 'SKO Structure',
  description: 'One compound from its real atomic coordinates, in chrome, for embedding.',
  robots: { index: false, follow: false },
};

/**
 * /skoembed?c=bpc157&cycle=7&t=white
 * The compound banner's stage alone, filling the viewport, for an iframe on the store.
 */
export default function SkoEmbedPage() {
  return (
    <main style={{ position: 'fixed', inset: 0, background: '#ffffff', overflow: 'hidden' }}>
      <Suspense fallback={null}>
        <Embed />
      </Suspense>
    </main>
  );
}
