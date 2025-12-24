import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Vercelデプロイ用の設定
  output: undefined, // Vercelが自動的に最適化
  // 必要に応じて環境変数の設定など
  
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
  
  // Turbopack設定（Next.js 16ではTurbopackがデフォルト）
  turbopack: {},
  
  // キャッシュ設定（開発時は無効化）
  ...(process.env.NODE_ENV === 'production' ? {} : {
    // 開発環境ではキャッシュを無効化しない（パフォーマンスのため）
  }),
};

export default nextConfig;
