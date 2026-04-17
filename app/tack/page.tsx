import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CheckCircle, Phone } from "lucide-react";

export const metadata: Metadata = {
  alternates: { canonical: "/tack" },
  title: "Tack för din förfrågan | Sands Entreprenad",
  description: "Vi har tagit emot din förfrågan och återkommer inom 24h.",
  robots: "noindex",
};

export default function TackPage() {
  return (
    <>
      <Header />
      <main className="pt-16 lg:pt-20 bg-white min-h-[calc(100vh-80px)] flex items-center">
        {/* Konverteringsspårning */}
        <script
          dangerouslySetInnerHTML={{
            __html: `if(typeof gtag!=='undefined'){gtag('event','conversion',{send_to:'AW-18004063012/lead'});}`,
          }}
        />
        <div className="max-w-xl mx-auto px-4 py-20 text-center">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ backgroundColor: "rgba(43,116,252,0.08)" }}
          >
            <CheckCircle
              size={32}
              style={{ color: "var(--color-primary)" }}
            />
          </div>
          <h1
            className="text-[32px] lg:text-[44px] font-extrabold tracking-[-0.03em] mb-4"
            style={{
              fontFamily: "var(--font-heading)",
              color: "var(--color-dark)",
            }}
          >
            Tack! Vi återkommer snart.
          </h1>
          <p className="text-gray-600 mb-10 leading-relaxed">
            Vi har tagit emot din förfrågan och återkommer normalt sett inom 24
            timmar med ett prisförslag. Har du bråttom? Ring oss direkt.
          </p>
          <a
            href="tel:0828388"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-white font-semibold text-sm mb-4"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            <Phone size={16} />
            08-28 38 88
          </a>
          <div>
            <Link
              href="/"
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              ← Tillbaka till startsidan
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
