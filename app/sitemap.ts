import { MetadataRoute } from "next";
import { projekt as allaProjekt } from "@/lib/projekt";

const BASE = "https://sandsab.se";

const tjänsteSlugs = [
  "taklaggning",
  "tegeltak",
  "betongtak",
  "plattak",
  "papptak",
  "eternittak",
  "takfonsterkupor",
  "hangrannorstupror",
  "totalentreprenad",
];

const områdesSlugs = [
  "stockholm",
  "taby",
  "nacka",
  "jarfalla",
  "huddinge",
  "sollentuna",
  "danderyd",
  "bromma",
  "tyreso",
  "norrtälje",
  "sodertalje",
  "lidingo",
  "solna",
  "sundbyberg",
  "ekero",
  "haninge",
  "botkyrka",
  "nynashamn",
  "vallentuna",
  "vaxholm",
  "varmdo",
  "osteraker",
  "upplands-vasby",
  "upplands-bro",
  "sigtuna",
  "salem",
  "nykvarn",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    { url: BASE, priority: 1.0 },
    { url: `${BASE}/tjanster`, priority: 0.9 },
    { url: `${BASE}/omraden`, priority: 0.9 },
    { url: `${BASE}/priser`, priority: 0.8 },
    { url: `${BASE}/var-process`, priority: 0.7 },
    { url: `${BASE}/projekt`, priority: 0.7 },
    { url: `${BASE}/omdomen`, priority: 0.7 },
    { url: `${BASE}/om-oss`, priority: 0.6 },
    { url: `${BASE}/faq`, priority: 0.6 },
    { url: `${BASE}/kontakt`, priority: 0.6 },
    { url: `${BASE}/blogg`, priority: 0.5 },
  ].map((p) => ({
    ...p,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
  }));

  const tjänsteSidor = tjänsteSlugs.map((slug) => ({
    url: `${BASE}/tjanster/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.85,
  }));

  const områdesSidor = områdesSlugs.map((slug) => ({
    url: `${BASE}/omraden/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const projektSlugs = allaProjekt.map((p) => p.slug);

  const bloggSlugs = [
    "vad-kostar-takbyte",
    "nar-byta-tak",
    "monier-garanti",
    "eternittak-asbest",
    "rot-avdrag-takbyte",
    "platttak-eller-tegeltag",
  ];

  const projektSidor = projektSlugs.map((slug) => ({
    url: `${BASE}/projekt/${slug}`,
    lastModified: new Date(),
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));

  const bloggSidor = bloggSlugs.map((slug) => ({
    url: `${BASE}/blogg/${slug}`,
    lastModified: new Date(),
    changeFrequency: "yearly" as const,
    priority: 0.5,
  }));

  return [...staticPages, ...tjänsteSidor, ...områdesSidor, ...projektSidor, ...bloggSidor];
}
