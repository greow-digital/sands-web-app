import type { Metadata } from "next";
import { Manrope, Inter } from "next/font/google";
import MobileCTA from "@/components/MobileCTA";
import PhoneClickTracker from "@/components/PhoneClickTracker";
import ClickIdCapture from "@/components/ClickIdCapture";
import ThirdPartyScripts from "@/components/ThirdPartyScripts";
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

const BASE_URL = "https://www.sandsab.se";

const HOME_TITLE =
  "Takläggare Stockholm: takbyte fast pris, 30 års garanti | Sands AB";
const HOME_DESC =
  "Erfaren takläggare i Stockholm. Fast pris från 169 000 kr efter ROT, 30 års Monier-garanti. BraByggare 4,8 av 5 med 54 omdömen. Få prisförslag inom 24 h.";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: HOME_TITLE,
  description: HOME_DESC,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "sv_SE",
    url: BASE_URL,
    siteName: "Sands Entreprenad Stockholm AB",
    title: HOME_TITLE,
    description: HOME_DESC,
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Takbyte i Stockholm, Sands Entreprenad",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: HOME_TITLE,
    description: HOME_DESC,
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
        <link rel="preconnect" href="https://cdn.sanity.io" crossOrigin="" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "RoofingContractor",
              name: "Sands Entreprenad Stockholm AB",
              alternateName: ["Sands Entreprenad", "Sands Tak", "Sands AB"],
              url: BASE_URL,
              telephone: "08-28 38 88",
              email: "info@sandsab.se",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Spjutvägen 5A",
                postalCode: "175 61",
                addressLocality: "Järfälla",
                addressRegion: "Stockholms län",
                addressCountry: "SE",
              },
              sameAs: [
                "https://www.instagram.com/sandsentreprenad/",
                "https://www.facebook.com/profile.php?id=100063582700739",
                "https://www.brabyggare.se/hantverkare/25532/",
                "https://www.allabolag.se/foretag/sands-entreprenad-stockholm-ab/solna/byggm%C3%A4stare/2KGIRZRI5YDDT",
                "https://www.hitta.se/verksamhet/sands-entreprenad-stockholm-ab-mptdddlrs",
                "https://www.eniro.se/sands+entreprenad+stockholm+ab+solna/129401425/firma",
                "https://bygg.se/sands-entreprenad-jarfalla-ab/",
              ],
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
                "Takläggare i Stockholm, certifierad Monier Takpartner med upp till 30 års garanti. Takbyte, takomläggning och lägga om tak med fast pris.",
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.8",
                reviewCount: "54",
                bestRating: "5",
              },
            }),
          }}
        />
        {/* dataLayer-shim + config eager (kostar ~0, ingen network) sa
            page_view koas direkt. Sjalva gtag/js (176 KB) laddas pa load+idle
            via ThirdPartyScripts sa det inte blockerar LCP-renderingen, men
            anda fyras for alla sessioner (aven utan interaktion). */}
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','AW-18004063012');`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col antialiased">
        {children}
        <MobileCTA />
        <PhoneClickTracker />
        <ClickIdCapture />
        <ThirdPartyScripts />
      </body>
    </html>
  );
}
