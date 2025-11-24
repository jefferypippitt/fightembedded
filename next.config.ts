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
    // More conservative optimization settings to avoid payment limits
    formats: ["image/webp", "image/avif"],
    // Aggressive caching for static sports images (1 year)
    // Images are invalidated when athlete-images cache tag is revalidated
    minimumCacheTTL: 31536000, // 1 year cache
    // Reduce device sizes to minimize transformations
    deviceSizes: [640, 1080],
    // Reduce image sizes to minimize transformations
    imageSizes: [64, 128],
    // Quality settings for image optimization
    qualities: [75, 85],
    // Enable static optimization for better caching
    unoptimized: false,
    // Enable SVG optimization but be conservative
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
