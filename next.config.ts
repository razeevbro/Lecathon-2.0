import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com", pathname: "/**" },
    ],
  },
  allowedDevOrigins: ["10.20.21.208", "192.168.1.8", "192.168.1.109"],
};

export default nextConfig;
