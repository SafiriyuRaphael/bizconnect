import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Disable ESLint during builds
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/marketplace',
        permanent: true, // 308 Permanent Redirect (SEO-friendly)
      },
    ];
  },
};

export default nextConfig;
