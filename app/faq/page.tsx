import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Vanliga frågor om takbyte | Sands Entreprenad",
  description:
    "Svar på de vanligaste frågorna om takbyte, priser, ROT-avdrag, garantier och processen hos Sands Entreprenad.",
};

const kategorier = [
  {
    titel: "Process & utförande",
    faq: [
      {
        q: "Hur går en takomläggning till hos Sands?",
        a: "Vi börjar med ett kostnadsfritt hembesök där vi inspekterar taket och går igenom dina behov. Du får sedan en detaljerad offert med fast pris. När du godkänt offerten utför vi arbetet och avslutar med en slutbesiktning tillsammans med dig.",
      },
      {
        q: "Hur lång tid tar en takomläggning?",
        a: "För en normalvilla på 120–160 m² tar ett komplett takbyte vanligtvis 1–2 veckor, beroende på väder och takets skick.",
      },
      {
        q: "Vad ingår i en komplett takomläggning?",
        a: "En komplett takomläggning inkluderar rivning av befintlig beläggning, ny underlagspapp, ny läkt, nytt takmaterial, nytt regnvattensystem, taksäkerhet, ställning, container och bortforsling. Allt ingår i det fasta priset.",
      },
      {
        q: "Vad händer när arbetet är klart?",
        a: "Vi avslutar med en noggrann slutbesiktning tillsammans med dig. Du får ett garantibevis och vi finns tillgängliga om du har frågor efteråt.",
      },
    ],
  },
  {
    titel: "Priser & ekonomi",
    faq: [
      {
        q: "Vad kostar en takomläggning i Stockholm?",
        a: "Priset varierar beroende på material och takets förutsättningar. Som riktlinje: betongtak från ca 1 200 kr/m², tegeltak från ca 1 500 kr/m², plåttak från ca 1 800 kr/m² — alla priser efter ROT-avdrag. Vi ger alltid fast pris efter besiktning.",
      },
      {
        q: "Kan jag använda ROT-avdrag?",
        a: "Ja. ROT-avdraget innebär att du får tillbaka 30% av arbetskostnaden direkt på fakturan. Vi hanterar ansökan åt dig.",
      },
      {
        q: "Vad är totalentreprenad?",
        a: "Totalentreprenad innebär att vi tar hela ansvaret för ditt projekt — från besiktning till färdigt tak. Allt regleras i ett enda kontrakt med fast pris enligt ABT-06.",
      },
    ],
  },
  {
    titel: "Garanti & försäkring",
    faq: [
      {
        q: "Vad innebär garanti vid takomläggning med Monier?",
        a: "Med ett komplett Monier-taksystem omfattas ditt tak av Tätt tak-garanti i upp till 30 år — det innebär att hela taksystemets funktion och täthet garanteras. Exakta garantitider specificeras alltid i offerten.",
      },
      {
        q: "Arbetar ni med Monier taksystem?",
        a: "Ja, vi är certifierad Monier Takpartner. Moniers produkter är väl beprövade och utvecklade för nordiskt klimat, med höga krav på kvalitet och hållbarhet.",
      },
      {
        q: "Har ni försäkringar?",
        a: "Ja, vi är fullförsäkrade med ansvarsförsäkring och allriskförsäkring. Vi har F-skattsedel och all personal är certifierad.",
      },
    ],
  },
  {
    titel: "Material & taktyper",
    faq: [
      {
        q: "Hur vet jag om mitt tak behöver bytas?",
        a: "Tecken på att det kan vara dags är läckage, spruckna eller förskjutna takpannor, rost på plåtdetaljer, fuktproblem på vinden eller att taket närmar sig sin tekniska livslängd (ofta 25–40 år). Vi erbjuder kostnadsfri takkontroll.",
      },
      {
        q: "Behöver jag bygglov för att byta tak?",
        a: "Inte om du behåller samma typ av material och inte förändrar takets utseende. Vid ändringar — kontrollera med din kommun.",
      },
      {
        q: "Kan ni byta eternittak?",
        a: "Ja. Eternittak innehåller asbest och kräver certifierad sanering. Vi samarbetar med certifierade saneringsföretag och hanterar hela processen — från rivning till färdigt tak med garanti.",
      },
      {
        q: "Erbjuder ni takfönster eller takkupor?",
        a: "Ja, vi installerar takfönster och bygger takkupor i samband med takomläggning.",
      },
    ],
  },
];

export default function FaqPage() {
  const allFaq = kategorier.flatMap((k) => k.faq);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: allFaq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <Header />
      <main className="pt-16 lg:pt-20 bg-white">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <PageHero
          eyebrow="FAQ"
          title="Vanliga"
          titleAccent="frågor"
          description="Här hittar du svar på de vanligaste frågorna om takbyte, priser och vår process."
          breadcrumbs={[{ label: "Hem", href: "/" }, { label: "FAQ" }]}
        />

        <section className="py-16 lg:py-24">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
            {kategorier.map((kat) => (
              <div key={kat.titel}>
                <h2
                  className="text-xl lg:text-2xl font-bold mb-6 pb-3 border-b border-gray-100"
                  style={{
                    fontFamily: "var(--font-heading)",
                    color: "var(--color-dark)",
                  }}
                >
                  {kat.titel}
                </h2>
                <div className="divide-y divide-gray-100">
                  {kat.faq.map((f) => (
                    <div key={f.q} className="py-6">
                      <h3
                        className="text-base lg:text-lg font-bold mb-2"
                        style={{
                          fontFamily: "var(--font-heading)",
                          color: "var(--color-dark)",
                        }}
                      >
                        {f.q}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {f.a}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 border-t border-gray-100 text-center">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-gray-600 mb-6">Fick du inte svar på din fråga?</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/kontakt"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-semibold text-sm transition-all hover:scale-[1.02]"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                Kontakta oss <ArrowRight size={14} />
              </Link>
              <a
                href="tel:0828388"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-gray-200 font-semibold text-sm hover:border-[#2B74FC] hover:text-[#2B74FC] transition-colors"
                style={{ color: "var(--color-dark)" }}
              >
                Ring 08-28 38 88
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
