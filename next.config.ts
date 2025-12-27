import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 画像設定
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.figma.com',
        pathname: '/api/mcp/asset/**',
      },
    ],
  },
  
  // パフォーマンス最適化
  experimental: {
    optimizePackageImports: ['recharts'],
  },
  
  // WordPress統合用のヘッダー設定
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors *;",
          },
          // WordPressからiframeで埋め込むため、X-Frame-OptionsとCSPを設定
        ],
      },
    ];
  },
};

export default nextConfig;
