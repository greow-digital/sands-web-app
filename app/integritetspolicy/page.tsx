import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  path: "/integritetspolicy",
  title: "Integritetspolicy | Sands Entreprenad Stockholm AB",
  description:
    "Så hanterar Sands Entreprenad Stockholm AB dina personuppgifter enligt GDPR. Vi delar aldrig dina uppgifter med tredje part.",
});

const SEKTIONER: { rubrik: string; text: string[] }[] = [
  {
    rubrik: "Personuppgiftsansvarig",
    text: [
      "Sands Entreprenad Stockholm AB (org.nr 559063-8135), Spjutvägen 5A, 175 61 Järfälla, är personuppgiftsansvarig för de uppgifter du lämnar till oss. Du når oss på info@sandsab.se eller 08-28 38 88.",
    ],
  },
  {
    rubrik: "Vilka uppgifter vi samlar in",
    text: [
      "När du fyller i ett formulär på sandsab.se (offertförfrågan, prisuppskattning eller kontaktförfrågan) sparar vi de uppgifter du lämnar, till exempel namn, telefonnummer, e-postadress och information om ditt tak. Vi sparar också teknisk information som behövs för att mäta och förbättra webbplatsen.",
    ],
  },
  {
    rubrik: "Varför vi behandlar uppgifterna",
    text: [
      "Vi använder uppgifterna för att kunna återkomma med ett prisförslag, boka en kostnadsfri takkontroll och fullfölja eventuellt uppdrag. Den lagliga grunden är att fullgöra avtal eller att vidta åtgärder på din begäran innan ett avtal ingås, samt vårt berättigade intresse av att besvara din förfrågan.",
    ],
  },
  {
    rubrik: "Vi delar aldrig dina uppgifter med tredje part",
    text: [
      "Vi säljer eller delar aldrig dina personuppgifter med tredje part för deras egen marknadsföring. Uppgifterna kan behandlas av de leverantörer som driftar vår webbplats och våra system, och då endast på vårt uppdrag och enligt personuppgiftsbiträdesavtal.",
    ],
  },
  {
    rubrik: "Hur länge vi sparar uppgifterna",
    text: [
      "Vi sparar dina uppgifter så länge det behövs för att hantera din förfrågan eller ditt uppdrag, och därefter så länge vi är skyldiga enligt lag (till exempel bokföringslagen).",
    ],
  },
  {
    rubrik: "Dina rättigheter",
    text: [
      "Du har rätt att begära ett utdrag av de uppgifter vi har om dig, att få felaktiga uppgifter rättade och att i vissa fall få dem raderade. Kontakta oss på info@sandsab.se. Du har även rätt att lämna klagomål till Integritetsskyddsmyndigheten (IMY).",
    ],
  },
  {
    rubrik: "Cookies och mätning",
    text: [
      "Webbplatsen använder cookies och mätverktyg för att förstå hur sidan används och för att mäta resultatet av vår marknadsföring. Du kan blockera cookies i din webbläsare.",
    ],
  },
];

export default function IntegritetspolicyPage() {
  return (
    <>
      <Header />
      <main className="pt-16 lg:pt-20 bg-white">
        <PageHero
          title="Integritetspolicy"
          breadcrumbs={[
            { label: "Hem", href: "/" },
            { label: "Integritetspolicy" },
          ]}
        />
        <section className="py-14 lg:py-20">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-[15px] text-gray-600 leading-[1.75] mb-10">
              Din integritet är viktig för oss. Här beskriver vi hur Sands
              Entreprenad Stockholm AB hanterar dina personuppgifter när du
              använder sandsab.se och våra tjänster.
            </p>
            {SEKTIONER.map((s) => (
              <div key={s.rubrik} className="mb-8">
                <h2
                  className="text-[20px] lg:text-[24px] font-bold tracking-[-0.01em] mb-3"
                  style={{
                    fontFamily: "var(--font-heading)",
                    color: "var(--color-dark)",
                  }}
                >
                  {s.rubrik}
                </h2>
                {s.text.map((p, i) => (
                  <p
                    key={i}
                    className="text-[15px] text-gray-600 leading-[1.75] mb-3"
                  >
                    {p}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
