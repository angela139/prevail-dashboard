import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/prevail-dashboard",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
