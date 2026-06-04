import type { Metadata } from "next";
import { Manrope, Inter } from "next/font/google";
import MobileCTA from "@/components/MobileCTA";
import PhoneClickTracker from "@/components/PhoneClickTracker";
import ClickIdCapture from "@/components/ClickIdCapture";
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
  "Erfaren takläggare i Stockholm. Fast pris från 169 000 kr efter ROT, 30 års Monier-garanti. BraByggare 4.8★ med 54 omdömen. Få prisförslag inom 24 h.";

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
                addressLocality: "Stockholm",
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
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=AW-18004063012"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','AW-18004063012');`,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(h,o,t,j,a,r){h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};h._hjSettings={hjid:3307551,hjsv:6};a=o.getElementsByTagName('head')[0];r=o.createElement('script');r.async=1;r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;a.appendChild(r);})(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col antialiased">
        {children}
        <MobileCTA />
        <PhoneClickTracker />
        <ClickIdCapture />
      </body>
    </html>
  );
}
