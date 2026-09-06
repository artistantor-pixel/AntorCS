import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      // Behance CDN domains for project images
      {
        protocol: 'https',
        hostname: 'mir-s3-cdn-cf.behance.net',
      },
      {
        protocol: 'https',
        hostname: 'mir-cdn.behance.net',
      },
      {
        protocol: 'https',
        hostname: 'www.behance.net',
      },
    ],
  },
};

export default nextConfig;

