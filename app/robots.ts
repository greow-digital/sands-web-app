import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/tack", "/api/", "/studio", "/projekt-sanity-poc"],
    },
    sitemap: "https://www.sandsab.se/sitemap.xml",
  };
}
