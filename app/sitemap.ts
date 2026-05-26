import { MetadataRoute } from "next";
import { tjanster } from "@/lib/tjanster";
import { omraden } from "@/lib/omraden";
import { projekt } from "@/lib/projekt";
import { artiklar } from "@/lib/blogg";

const BASE = "https://www.sandsab.se";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    { url: BASE, priority: 1.0 },
    { url: `${BASE}/tjanster`, priority: 0.9 },
    { url: `${BASE}/omraden`, priority: 0.9 },
    { url: `${BASE}/basta-taklaggare-stockholm`, priority: 0.9 },
    { url: `${BASE}/priser`, priority: 0.8 },
    { url: `${BASE}/var-process`, priority: 0.7 },
    { url: `${BASE}/projekt`, priority: 0.7 },
    { url: `${BASE}/omdomen`, priority: 0.7 },
    { url: `${BASE}/om-oss`, priority: 0.6 },
    { url: `${BASE}/faq`, priority: 0.6 },
    { url: `${BASE}/kontakt`, priority: 0.6 },
    { url: `${BASE}/blogg`, priority: 0.5 },
    { url: `${BASE}/offert`, priority: 0.5 },
  ].map((p) => ({
    ...p,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
  }));

  const tjänsteSidor = tjanster.map((t) => ({
    url: `${BASE}/tjanster/${t.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.85,
  }));

  const områdesSidor = omraden.map((o) => ({
    url: `${BASE}/omraden/${o.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const projektSidor = projekt.map((p) => ({
    url: `${BASE}/projekt/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));

  const bloggSidor = artiklar.map((a) => ({
    url: `${BASE}/blogg/${a.slug}`,
    lastModified: new Date(),
    changeFrequency: "yearly" as const,
    priority: 0.5,
  }));

  return [
    ...staticPages,
    ...tjänsteSidor,
    ...områdesSidor,
    ...projektSidor,
    ...bloggSidor,
  ];
}
