import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/tack", "/api/"],
    },
    sitemap: "https://sandsab.se/sitemap.xml",
  };
}
