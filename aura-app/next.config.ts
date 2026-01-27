import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' https://*.coinbase.com https://*.base.org https://*.farcaster.xyz https://*.warpcast.com;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;