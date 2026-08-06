import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: false,
  images: {
    // Vercels bildoptimering slår återkommande i gratistakets transformations-
    // kvot (5 000/mån) och returnerar då 402 för lokala bilder -> trasiga
    // hero-bilder över hela sajten. Vi serverar därför bilder direkt
    // (ooptimerat). Sanity-bilder var redan ooptimerade via SanityImage.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.sandsab.se",
      },
      {
        protocol: "https",
        hostname: "sandsab.se",
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/w7g9aeqj/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      // Cross-domain consolidation
      {
        source: "/:path*",
        has: [{ type: "host", value: "offert.sandsentreprenad.se" }],
        destination: "https://www.sandsab.se/:path*",
        permanent: true,
      },
      // Non-ASCII slug fix
      {
        source: "/omraden/norrt%C3%A4lje",
        destination: "/omraden/norrtalje",
        permanent: true,
      },
      // Legacy WordPress service pages — specific mappings first
      // våra-tjänster = v%C3%A5ra-tj%C3%A4nster
      // takomläggningar = takoml%C3%A4ggningar
      // takfönster-takkupor = takf%C3%B6nster-takkupor
      // köksrenoveringar = k%C3%B6ksrenoveringar
      // plåttak = pl%C3%A5ttak
      // fasadmålning = fasadm%C3%A5lning
      // övriga-tjänster = %C3%B6vriga-tj%C3%A4nster
      {
        source: "/v%C3%A5ra-tj%C3%A4nster/takoml%C3%A4ggningar/betongtak",
        destination: "/tjanster/betongtak",
        permanent: true,
      },
      {
        source: "/v%C3%A5ra-tj%C3%A4nster/takoml%C3%A4ggningar/tegeltak",
        destination: "/tjanster/tegeltak",
        permanent: true,
      },
      {
        source: "/v%C3%A5ra-tj%C3%A4nster/takoml%C3%A4ggningar/pl%C3%A5ttak",
        destination: "/tjanster/plattak",
        permanent: true,
      },
      {
        source: "/v%C3%A5ra-tj%C3%A4nster/takoml%C3%A4ggningar/papptak",
        destination: "/tjanster/papptak",
        permanent: true,
      },
      {
        source: "/v%C3%A5ra-tj%C3%A4nster/takoml%C3%A4ggningar",
        destination: "/tjanster/taklaggning",
        permanent: true,
      },
      {
        source: "/v%C3%A5ra-tj%C3%A4nster/takf%C3%B6nster-takkupor",
        destination: "/tjanster/takfonsterkupor",
        permanent: true,
      },
      {
        source: "/v%C3%A5ra-tj%C3%A4nster/k%C3%B6ksrenoveringar",
        destination: "/tjanster/koksrenovering",
        permanent: true,
      },
      {
        source: "/v%C3%A5ra-tj%C3%A4nster/badrumsrenoveringar",
        destination: "/tjanster/badrumsrenovering",
        permanent: true,
      },
      {
        source: "/v%C3%A5ra-tj%C3%A4nster/fasadrenovering-fasadm%C3%A5lning",
        destination: "/tjanster/fasadrenovering",
        permanent: true,
      },
      {
        source: "/v%C3%A5ra-tj%C3%A4nster/fasadm%C3%A5lning",
        destination: "/tjanster/fasadrenovering",
        permanent: true,
      },
      {
        source: "/v%C3%A5ra-tj%C3%A4nster/%C3%B6vriga-tj%C3%A4nster",
        destination: "/tjanster",
        permanent: true,
      },
      // Catchall for any remaining /våra-tjänster/* paths
      {
        source: "/v%C3%A5ra-tj%C3%A4nster/:path*",
        destination: "/tjanster",
        permanent: true,
      },
      {
        source: "/v%C3%A5ra-tj%C3%A4nster",
        destination: "/tjanster",
        permanent: true,
      },
      // Legacy WordPress project pages (all paginated variants)
      // slutförda-projekt = slutf%C3%B6rda-projekt
      {
        source: "/slutf%C3%B6rda-projekt/:path*",
        destination: "/projekt",
        permanent: true,
      },
      {
        source: "/slutf%C3%B6rda-projekt",
        destination: "/projekt",
        permanent: true,
      },
      // Renamed contact page
      {
        source: "/kontakta-oss",
        destination: "/kontakt",
        permanent: true,
      },
      // Old sitemap URL
      {
        source: "/sitemap",
        destination: "/sitemap.xml",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // Interna/POC-sidor: noindex via header (crawlbara så Google kan
      // läsa taggen och slänga dem ur indexet). Se app/robots.ts.
      {
        source: "/studio/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      {
        source: "/studio",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      {
        source: "/projekt-sanity-poc/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      {
        source: "/projekt-sanity-poc",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default nextConfig;
