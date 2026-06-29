import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  turbopack: {},
  // Allow iframe embedding for browser app
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        ],
      },
    ];
  },
};

export default nextConfig;
