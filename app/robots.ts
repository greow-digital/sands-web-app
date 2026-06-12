import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // /studio och /projekt-sanity-poc utelämnas här med flit: de
      // noindexas via X-Robots-Tag-header (se next.config.ts). En
      // disallow skulle hindra Google från att läsa noindex-taggen.
      disallow: ["/tack", "/api/"],
    },
    sitemap: "https://www.sandsab.se/sitemap.xml",
  };
}
