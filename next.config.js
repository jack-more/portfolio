/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      { source: '/dogclub', destination: '/dogwalk', permanent: true },
      { source: '/dogclub/:path*', destination: '/dogwalk', permanent: true },
      // Note: Next matches `source` case-insensitively, so a /skotracking →
      // /SKOtracking rule also matches /SKOtracking itself and loops forever.
      // Only non-identical spellings are safe to redirect.
      { source: '/sko-tracking', destination: '/SKOtracking', permanent: false },
    ];
  },
  async headers() {
    // /march clipper transcodes to MP4 in-browser (ffmpeg.wasm), which needs
    // SharedArrayBuffer → cross-origin isolation. credentialless keeps the
    // YouTube embed and same-origin images working.
    return [
      {
        source: '/march',
        headers: [
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          { key: 'Cross-Origin-Embedder-Policy', value: 'credentialless' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
