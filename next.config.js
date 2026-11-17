/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      { source: '/v2', destination: '/v2/index.html' },
      { source: '/v2/work', destination: '/v2/work/index.html' },
      { source: '/v2/info', destination: '/v2/info/index.html' },
    ];
  },
  async redirects() {
    return [
      { source: '/dogclub', destination: '/dogwalk', permanent: true },
      { source: '/dogclub/:path*', destination: '/dogwalk', permanent: true },
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
