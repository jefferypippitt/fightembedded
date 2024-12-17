import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard",
          "/dashboard/*",
          "/api/*",
          "/sign-in",
          "/sign-up",
        ],
      },
    ],
    sitemap: "https://fightembedded.com/sitemap.xml",
  };
}
