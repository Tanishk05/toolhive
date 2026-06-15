import type { MetadataRoute } from "next";
import { siteConfig } from "@/constants/site-config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/*",
          "/api/*",
          "/sign-in",
          "/sign-up",
          "/account",
          "/account/*",
          "/design-system",
          "/design-system/*",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/*",
          "/api/*",
          "/sign-in",
          "/sign-up",
          "/account",
          "/account/*",
          "/design-system",
          "/design-system/*",
        ],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
