import type { Metadata } from "next";
import { Manrope, Inter } from "next/font/google";
import MobileCTA from "@/components/MobileCTA";
import PhoneClickTracker from "@/components/PhoneClickTracker";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600"],
  display: "swap",
});

const BASE_URL = "https://offert.sandsentreprenad.se";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: "Takbyte Stockholm – Fast pris på att lägga om tak | Sands",
  description:
    "Lägga om tak eller byta tak i Stockholm? Fast pris från 1 200 kr/m², kostnadsfri takkontroll och 30 års garanti. Tegel, plåt, papp, betong, eternit.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "sv_SE",
    url: BASE_URL,
    siteName: "Sands Entreprenad Stockholm AB",
    title: "Takbyte Stockholm – Fast pris på att lägga om tak | Sands",
    description:
      "Lägga om tak eller byta tak i Stockholm? Fast pris från 1 200 kr/m², kostnadsfri takkontroll och 30 års garanti.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Takbyte i Stockholm — Sands Entreprenad",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Takbyte Stockholm – Fast pris på att lägga om tak | Sands",
    description:
      "Lägga om tak eller byta tak i Stockholm? Fast pris från 1 200 kr/m², kostnadsfri takkontroll och 30 års garanti.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv" className={`${manrope.variable} ${inter.variable} h-full`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "RoofingContractor",
              name: "Sands Entreprenad Stockholm AB",
              url: BASE_URL,
              telephone: "08-28 38 88",
              email: "info@sandsab.se",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Spjutvägen 5A",
                postalCode: "175 61",
                addressLocality: "Stockholm",
                addressRegion: "Stockholms län",
                addressCountry: "SE",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: 59.3991,
                longitude: 17.8414,
              },
              areaServed: {
                "@type": "State",
                name: "Stockholms län",
              },
              priceRange: "från 1 200 kr/m²",
              description:
                "Takläggare i Stockholm — certifierad Monier Takpartner med upp till 30 års garanti. Takbyte, takomläggning och lägga om tak med fast pris.",
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.8",
                reviewCount: "54",
                bestRating: "5",
              },
            }),
          }}
        />
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=AW-18004063012"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','AW-18004063012');`,
          }}
        />
        <meta name="google-site-verification" content="cHYKcdLI2nZeK7Bh_2l5In9jEL3Rz1Z7P78sK2M4qh4" />
      </head>
      <body className="min-h-full flex flex-col antialiased">
        {children}
        <MobileCTA />
        <PhoneClickTracker />
      </body>
    </html>
  );
}
