import { NextConfig } from "next";

const config: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i3hmtlzhqt.ufs.sh",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "utfs.io",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "uploadthing.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "flagcdn.com",
        port: "",
        pathname: "/**",
      },
    ],
    // Optimize image transformations - use only WebP to reduce transformations
    formats: ["image/webp"],
    // Cache images for 31 days to reduce transformations
    minimumCacheTTL: 2678400, // 31 days cache
    // Reduce device sizes to minimize transformations
    deviceSizes: [640, 1080, 1920],
    // Reduce image sizes to minimize transformations
    imageSizes: [64, 128, 256],
    // Use only one quality setting to reduce transformations
    qualities: [75],
    // Disable image optimization for better caching
    unoptimized: false,
    // Add more aggressive caching
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default config;
