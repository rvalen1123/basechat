import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone",
  poweredByHeader: false,
  images: {
    domains: ["gmg-chatbase.vercel.app"],
    deviceSizes: [640, 1080, 1920],
    imageSizes: [32, 64, 128],
  },
  experimental: {
    serverMinification: true,
    optimizePackageImports: [
      "lucide-react",
      "sonner",
      "clsx",
      "tailwind-merge",
    ],
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
  headers: async () => [
    {
      source: "/:path*",
      headers: [
        {
          key: "X-Frame-Options",
          value: "DENY",
        },
        {
          key: "X-Content-Type-Options",
          value: "nosniff",
        },
        {
          key: "Referrer-Policy",
          value: "strict-origin-when-cross-origin",
        },
      ],
    },
  ],
};

export default nextConfig;
