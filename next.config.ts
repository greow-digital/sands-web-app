import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.sandsab.se",
      },
      {
        protocol: "https",
        hostname: "sandsab.se",
      },
    ],
    formats: ["image/webp"],
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "offert.sandsentreprenad.se" }],
        destination: "https://www.sandsab.se/:path*",
        permanent: true,
      },
      {
        source: "/omraden/norrt%C3%A4lje",
        destination: "/omraden/norrtalje",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
