import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@ar-menu/ui", "@ar-menu/shared"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "50mb",
    },
  },
};

export default nextConfig;
