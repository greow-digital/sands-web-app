import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/tack", "/api/"],
    },
    sitemap: "https://offert.sandsentreprenad.se/sitemap.xml",
  };
}
