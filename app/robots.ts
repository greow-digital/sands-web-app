import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // /studio och /projekt-sanity-poc utelämnas här med flit: de
      // noindexas via X-Robots-Tag-header (se next.config.ts). En
      // disallow skulle hindra Google från att läsa noindex-taggen.
      disallow: [
      "/tack",
      "/api/",
      // /_next/static/ (CSS, JS, typsnitt) får inte blockeras: Google
      // behöver filerna för att rendera sidan och bedöma mobilvänlighet.
      // Block favicon URL variants with hashed query strings that leak
      // into Google's index (e.g. /favicon.ico?favicon.09haxzz3xr7d8.ico).
      "/favicon.ico",
      // Block old WordPress multilingual param URLs (?lang=nl, ?lang=da)
      // left over from a previous site. These waste crawl budget.
      "/*?lang=",
    ],
    },
    sitemap: "https://www.sandsab.se/sitemap.xml",
  };
}
