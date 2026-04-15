import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['avatars.steamstatic.com'],
  },
  serverExternalPackages: ['better-sqlite3'],
};

export default nextConfig;
