import type { Metadata } from "next";
import { Manrope, Inter } from "next/font/google";
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

export const metadata: Metadata = {
  title: "Takläggare i Stockholm | Fast pris & 30 års garanti | Sands Entreprenad",
  description:
    "Sands Entreprenad utför takbyten och takomläggningar i hela Stockholms län. Certifierad Monier Takpartner. Boka kostnadsfri takbesiktning — fast pris utan förbindelser.",
  openGraph: {
    type: "website",
    locale: "sv_SE",
    url: "https://sandsab.se",
    siteName: "Sands Entreprenad Stockholm AB",
    title: "Takläggare i Stockholm | Fast pris & 30 års garanti | Sands Entreprenad",
    description:
      "Sands Entreprenad utför takbyten och takomläggningar i hela Stockholms län. Certifierad Monier Takpartner.",
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
              "@type": "LocalBusiness",
              name: "Sands Entreprenad Stockholm AB",
              url: "https://sandsab.se",
              telephone: "08-28 38 88",
              email: "info@sandsab.se",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Spjutvägen 5A",
                postalCode: "175 61",
                addressLocality: "Järfälla",
                addressCountry: "SE",
              },
              areaServed: "Stockholms län",
              description:
                "Takläggare i Stockholm — certifierad Monier Takpartner med upp till 30 års garanti.",
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.8",
                reviewCount: "54",
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
      </head>
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
