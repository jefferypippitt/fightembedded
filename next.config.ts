import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
    // Increase cache time to reduce transformations
    minimumCacheTTL: 31536000, // 1 year cache
    // Reduce device sizes to minimize transformations
    deviceSizes: [640, 1080],
    // Reduce image sizes to minimize transformations
    imageSizes: [64, 128],
    // Use only one quality setting to reduce transformations
    qualities: [75],
    // Enable SVG optimization but be conservative
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
