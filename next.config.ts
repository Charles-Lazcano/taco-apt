import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    taint: false,
  },
};

export default nextConfig;
