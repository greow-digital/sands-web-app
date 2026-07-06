import type { Metadata } from "next";

const BASE_URL = "https://www.sandsab.se";
const SITE_NAME = "Sands Entreprenad Stockholm AB";
const DEFAULT_OG_IMAGE = "/og-image.jpg";

/**
 * Builds full Next.js metadata (title + description + canonical +
 * Open Graph + Twitter) from a single source string. OG/Twitter
 * mirror the title/description verbatim per the SEO playbook.
 */
export function pageMeta(opts: {
  path: string;
  title: string;
  description: string;
  image?: string;
}): Metadata {
  const { path, title, description } = opts;
  const image = opts.image ?? DEFAULT_OG_IMAGE;
  const url = `${BASE_URL}${path}`;

  return {
    alternates: { canonical: url },
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      locale: "sv_SE",
      url,
      siteName: SITE_NAME,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}
