/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      { source: '/dogclub', destination: '/dogwalk', permanent: true },
      { source: '/dogclub/:path*', destination: '/dogwalk', permanent: true },
    ];
  },
};

module.exports = nextConfig;
