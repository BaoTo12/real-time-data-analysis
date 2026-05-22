import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow the backend URL to be configured via env (server-side only)
  env: {
    BACKEND_URL: process.env.BACKEND_URL ?? "http://localhost:8183",
  },
  // Add CORS headers to all API proxy routes
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "http://localhost:3000" },
          { key: "Access-Control-Allow-Methods", value: "GET,POST,OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type" },
        ],
      },
    ];
  },
};

export default nextConfig;
