import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  cacheLife: {
    years: {
      stale: 31536000, // 1 year in seconds
      revalidate: 31536000,
      expire: 31536000,
    },
  },
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
      {
        protocol: "https",
        hostname: "countryflags.io",
        port: "",
        pathname: "/**",
      },
    ],
    // Configure image quality options
    qualities: [75, 90],
    // Optimize remote images for better performance
    formats: ["image/webp", "image/avif"],
    // Aggressive caching for static sports images (1 year)
    minimumCacheTTL: 31536000, // 1 year cache
    // Standard device sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    // Standard image sizes for responsive images
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Enable SVG support for flag images
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
