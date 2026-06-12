import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CheckCircle, Phone, Clock, FileText, HardHat, Star } from "lucide-react";

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
      <main className="pt-16 lg:pt-20 bg-white">
        {/* Konverteringsspårning.
            form_submit auto-importeras till Google Ads conversion
            7624071599 ("Submit lead form", PRIMARY) via GA4-länkningen.
            generate_lead syns i GA4 Engagement-rapporter.
            transaction_id sätts av LeadForm vid submit och dedupliceras
            av Google, så refresh på /tack räknas som samma konvertering. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `if(typeof gtag!=='undefined'){var txn,src,variant;try{txn=sessionStorage.getItem('sands_lead_txn');src=sessionStorage.getItem('sands_lead_source')||'unknown';variant=sessionStorage.getItem('sands_lead_variant')||'unknown'}catch(e){src='unknown';variant='unknown'}if(!txn)txn='lead_'+Date.now()+'_'+Math.random().toString(36).slice(2,9);var p={currency:'SEK',value:1500,transaction_id:txn,form_source:src,form_variant:variant};gtag('event','form_submit',p);gtag('event','generate_lead',p);}`,
          }}
        />

        {/* Hero */}
        <section className="py-16 lg:py-24">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8"
              style={{ backgroundColor: "rgba(43,116,252,0.08)" }}
            >
              <CheckCircle
                size={40}
                style={{ color: "var(--color-primary)" }}
              />
            </div>
            <h1
              className="text-[36px] lg:text-[52px] font-extrabold tracking-[-0.03em] mb-5"
              style={{
                fontFamily: "var(--font-heading)",
                color: "var(--color-dark)",
              }}
            >
              Tack för din förfrågan!
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed mb-4 max-w-xl mx-auto">
              Vi har tagit emot dina uppgifter och en av våra projektledare
              återkommer till dig inom 24 timmar med ett prisförslag.
            </p>
            <p className="text-gray-500 mb-10">
              Har du bråttom? Ring oss direkt, vi svarar vardagar 07–17.
            </p>
            <a
              href="tel:08283888"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-white font-semibold text-sm transition-all hover:scale-[1.02]"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              <Phone size={16} />
              Ring 08-28 38 88
            </a>
          </div>
        </section>

        {/* Vad händer nu? */}
        <section
          className="py-16 lg:py-20 border-t border-gray-100"
          style={{ backgroundColor: "#F8F9FB" }}
        >
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <h2
              className="text-[24px] lg:text-[32px] font-extrabold tracking-[-0.02em] mb-10 text-center"
              style={{
                fontFamily: "var(--font-heading)",
                color: "var(--color-dark)",
              }}
            >
              Vad händer nu?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                {
                  icon: Clock,
                  num: "1",
                  title: "Vi ringer dig",
                  text: "Inom 24 timmar kontaktar vi dig för att boka ett kostnadsfritt hembesök på en tid som passar dig.",
                },
                {
                  icon: FileText,
                  num: "2",
                  title: "Hembesök & offert",
                  text: "Vi inspekterar taket på plats och lämnar en detaljerad offert med fast pris, inga förbindelser.",
                },
                {
                  icon: HardHat,
                  num: "3",
                  title: "Arbetet utförs",
                  text: "När du godkänt offerten planerar vi in projektet. Allt genom totalentreprenad enligt ABT-06.",
                },
              ].map((step) => (
                <div key={step.num} className="text-center">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ backgroundColor: "var(--color-primary)" }}
                  >
                    <step.icon size={20} className="text-white" />
                  </div>
                  <h3
                    className="text-lg font-bold mb-2"
                    style={{
                      fontFamily: "var(--font-heading)",
                      color: "var(--color-dark)",
                    }}
                  >
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {step.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust signals */}
        <section className="py-14 border-t border-gray-100">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-center items-center gap-8">
              <div className="flex items-center gap-2">
                <Image
                  src="/images/monier-tatt-tak.jpg"
                  alt="Monier Tätt tak-garanti"
                  width={100}
                  height={140}
                  className="h-12 w-auto rounded-sm"
                />
              </div>
              <div className="flex items-center gap-2">
                <Image
                  src="/images/brabyggare-seal.png"
                  alt="BraByggare"
                  width={100}
                  height={100}
                  className="h-10 w-auto"
                />
              </div>
              <div className="flex items-center gap-2">
                <Image
                  src="/images/kundfavorit-2025.png"
                  alt="Offerta Kundfavorit 2025"
                  width={100}
                  height={100}
                  className="h-10 w-auto"
                />
              </div>
              <div className="flex items-center gap-1.5 text-sm text-gray-600">
                <Star
                  size={16}
                  className="fill-yellow-400 text-yellow-400"
                />
                <strong style={{ color: "var(--color-dark)" }}>4.8</strong>
                <span>av 5, 54 omdömen</span>
              </div>
            </div>
          </div>
        </section>

        {/* Under tiden */}
        <section className="py-14 border-t border-gray-100">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-sm text-gray-500 mb-5">
              Under tiden du väntar, läs mer om oss:
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { href: "/var-process", label: "Vår process" },
                { href: "/priser", label: "Prisguide" },
                { href: "/projekt", label: "Utförda projekt" },
                { href: "/omdomen", label: "Kundomdömen" },
                { href: "/blogg/vad-kostar-takbyte", label: "Vad kostar takbyte?" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 rounded-full border border-gray-200 text-sm font-medium hover:border-[#2B74FC] hover:text-[#2B74FC] transition-colors"
                  style={{ color: "var(--color-dark)" }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
