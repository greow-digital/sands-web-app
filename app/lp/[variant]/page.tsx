import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle, Star } from "lucide-react";
import LpFormular from "@/components/LpFormular";
import LpStickyCta from "@/components/LpStickyCta";
import OmdomenInline from "@/components/OmdomenInline";
import TrustBadgesRow from "@/components/TrustBadgesRow";
import { startsidaTestimonials } from "@/lib/testimonials";
import { company, garanti, nap, stats, telefon } from "@/lib/company";
import { FLAGGSKEPP_KVM, FLAGGSKEPP_PRIS, MATERIAL } from "@/lib/material";

/*
  Annonslandningssida för kampanjen Takläggning Stockholm, för A/B-test mot
  startsidan (beslut 19 okt 2026). Noindex och inte i sitemap: sidan finns
  bara för betald trafik.

  Varianten i URL:en styr rubriken så att den speglar sökordet, t.ex.
  /lp/takbyte för annonsgruppen om takbyte. Varje variant byggs statiskt
  vid deploy, okända värden ger 404. Ingen meny och inga utgångar: logga,
  betyg och formulär. Företagsuppgifterna längst ner finns för att Google
  bedömer landningssidans upplevelse bland annat på tydlig avsändare.
*/

type Variant = { sokord: string; h1: string };

const VARIANTER: Record<string, Variant> = {
  taklaggare: { sokord: "takläggare", h1: "Takläggare i Stockholm" },
  takbyte: { sokord: "takbyte", h1: "Takbyte i Stockholm" },
  "byta-tak": { sokord: "byta tak", h1: "Byta tak i Stockholm" },
  "lagga-om-tak": { sokord: "lägga om tak", h1: "Lägga om tak i Stockholm" },
  takomlaggning: { sokord: "takomläggning", h1: "Takomläggning i Stockholm" },
  "nytt-tak": { sokord: "nytt tak", h1: "Nytt tak i Stockholm" },
  takfirma: { sokord: "takfirma", h1: "Takfirma i Stockholm" },
};

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(VARIANTER).map((variant) => ({ variant }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ variant: string }>;
}): Promise<Metadata> {
  const v = VARIANTER[(await params).variant];
  if (!v) return {};
  return {
    title: { absolute: `${v.h1} | Gratis offert | Sands` },
    description:
      "Byta tak eller lägga om tak i Stockholm. Fast pris efter kostnadsfri takkontroll, ROT-avdrag på fakturan och upp till 30 års garanti.",
    robots: { index: false, follow: false },
  };
}

const kr = (n: number) => n.toLocaleString("sv-SE");

const STEG = [
  {
    rubrik: "Gratis offert",
    text: "Fyll i formuläret. Vi hör av oss inom 24 timmar.",
  },
  {
    rubrik: "Kostnadsfri takkontroll",
    text: "Vi går upp på taket och bedömer skicket tillsammans med dig.",
  },
  {
    rubrik: "Fast pris",
    text: "Du får ett skriftligt fast pris med ROT-avdraget inräknat. Säg ja eller nej.",
  },
];

const VARFOR = [
  `Monier-certifierad takläggare med ${garanti.fras}`,
  "15 års hantverksgaranti på utfört arbete",
  "Fast pris i skriftlig offert, ROT-avdraget sköter vi",
  `${stats.tak} utförda tak sedan ${company.grundades}`,
];

const FAQ = [
  {
    q: "Kostar offerten eller takkontrollen något?",
    a: "Nej. Både offerten och takkontrollen är kostnadsfria och utan förpliktelser. Du bestämmer dig först när du har det fasta priset framför dig.",
  },
  {
    q: "Hur snabbt hör ni av er?",
    a: "Inom 24 timmar. Vi ringer eller mejlar och bokar en tid för takkontrollen som passar dig.",
  },
  {
    q: "Kan jag använda ROT-avdrag?",
    a: "Ja. ROT-avdraget är 30 % av arbetskostnaden, högst 50 000 kr per person och år, och dras direkt på fakturan. Vi sköter ansökan åt dig.",
  },
  {
    q: "Hur lång tid tar ett takbyte?",
    a: "För en normalvilla på 120–160 m² tar ett komplett takbyte vanligtvis 1–2 veckor, beroende på väder och takets skick.",
  },
];

export default async function Landningssida({
  params,
}: {
  params: Promise<{ variant: string }>;
}) {
  const v = VARIANTER[(await params).variant];
  if (!v) notFound();

  return (
    <>
      <main className="bg-white pb-20 md:pb-0">
        {/* ── HERO med formulär ─────────────────────── */}
        <section className="relative overflow-hidden">
          <Image
            src="/images/lp/hero.webp"
            alt=""
            fill
            priority
            fetchPriority="high"
            sizes="100vw"
            className="object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(6,6,7,0.78) 0%, rgba(6,6,7,0.70) 45%, rgba(6,6,7,0.82) 100%)",
            }}
          />

          <div className="relative max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-10 lg:pb-16">
            {/* Ingen meny: loggan länkar inte vidare och betyget står bredvid */}
            <div className="flex items-center justify-between mb-6 lg:mb-10">
              <Image
                src="/images/logo-sandsentreprenad.svg"
                alt="Sands Entreprenad"
                width={180}
                height={32}
                className="h-7 w-auto brightness-0 invert"
              />
              <span className="inline-flex items-center gap-1.5 text-sm text-white">
                <Star size={14} className="fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{stats.betyg}</span>
                <span className="text-gray-300">BraByggare</span>
              </span>
            </div>

            <div className="grid lg:grid-cols-[1fr_420px] gap-6 lg:gap-14 items-start">
              <div className="text-white">
                <h1
                  className="text-[32px] sm:text-[44px] lg:text-[56px] font-extrabold leading-[1.05] tracking-[-0.03em]"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {v.h1}
                  <span className="block" style={{ color: "var(--color-primary)" }}>
                    med fast pris
                  </span>
                </h1>
                <p className="text-base sm:text-lg text-gray-200 mt-3 leading-relaxed max-w-xl">
                  Byta tak eller lägga om tak? Kostnadsfri takkontroll, ROT-avdrag
                  på fakturan och {garanti.fras}.
                </p>
                <ul className="hidden lg:block mt-6 space-y-2">
                  {VARFOR.map((t) => (
                    <li key={t} className="flex items-start gap-2 text-gray-100">
                      <CheckCircle size={18} className="shrink-0 mt-0.5" style={{ color: "var(--color-primary)" }} />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>

              <div id="formular" className="scroll-mt-4">
                <LpFormular formId="lp_hero" sokord={v.sokord} />
              </div>
            </div>
          </div>
        </section>

        {/* ── BEVIS ─────────────────────────────── */}
        <section className="py-8 border-b border-gray-100 bg-gray-50">
          <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8">
            <TrustBadgesRow className="sm:justify-center" />
          </div>
        </section>

        {/* ── PRIS ─────────────────────────────── */}
        <section className="py-12 lg:py-16">
          <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-8 lg:gap-14 items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-400 mb-2">
                Vad kostar det?
              </p>
              <h2
                className="text-[28px] lg:text-[36px] font-extrabold tracking-[-0.02em] leading-tight"
                style={{ fontFamily: "var(--font-heading)", color: "var(--color-dark)" }}
              >
                Från {kr(FLAGGSKEPP_PRIS)} kr för en villa på {FLAGGSKEPP_KVM} m²
              </h2>
              <p className="text-gray-600 mt-3 leading-relaxed">
                Betongpannor från {kr(MATERIAL.betong.prisM2)} kr/m², tegel från{" "}
                {kr(MATERIAL.tegel.prisM2)} kr/m² och plåt från {kr(MATERIAL.plat.prisM2)}{" "}
                kr/m², efter ROT-avdrag. Rivning, nytt underlag, takmaterial,
                hängrännor och ställning ingår. Du får ett fast pris efter
                kostnadsfri takkontroll.
              </p>
            </div>

            {/* Riktiga drönarbilder från ett takbyte i Bromma */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { src: "/images/lp/bromma-fore.webp", etikett: "Före" },
                { src: "/images/lp/bromma-efter.webp", etikett: "Efter" },
              ].map((b) => (
                <figure key={b.src} className="relative rounded-2xl overflow-hidden bg-gray-100">
                  <Image
                    src={b.src}
                    alt={`Takbyte i Bromma, ${b.etikett.toLowerCase()} omläggningen, sett från ovan`}
                    width={640}
                    height={480}
                    sizes="(max-width: 1024px) 50vw, 270px"
                    className="w-full h-auto"
                  />
                  <figcaption className="absolute left-2 top-2 rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-semibold text-gray-800">
                    {b.etikett}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* ── OMDÖMEN ─────────────────────────────── */}
        <OmdomenInline
          heading="Det säger våra kunder"
          urval={startsidaTestimonials}
          limit={3}
          background
          utanLank
        />

        {/* ── SÅ GÅR DET TILL + VARFÖR ─────────────── */}
        <section className="py-12 lg:py-16">
          <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-10 lg:gap-14">
            <div>
              <h2
                className="text-[26px] lg:text-[32px] font-extrabold tracking-[-0.02em] mb-6"
                style={{ fontFamily: "var(--font-heading)", color: "var(--color-dark)" }}
              >
                Så går det till
              </h2>
              <ol className="space-y-5">
                {STEG.map((s, i) => (
                  <li key={s.rubrik} className="flex gap-4">
                    <span
                      className="h-8 w-8 shrink-0 rounded-full text-white text-sm font-bold flex items-center justify-center"
                      style={{ backgroundColor: "var(--color-primary)" }}
                    >
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-bold" style={{ color: "var(--color-dark)" }}>{s.rubrik}</p>
                      <p className="text-sm text-gray-600 leading-relaxed">{s.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
            <div>
              <h2
                className="text-[26px] lg:text-[32px] font-extrabold tracking-[-0.02em] mb-6"
                style={{ fontFamily: "var(--font-heading)", color: "var(--color-dark)" }}
              >
                Därför väljer villaägare Sands
              </h2>
              <ul className="space-y-3">
                {VARFOR.map((t) => (
                  <li key={t} className="flex items-start gap-3 text-gray-700">
                    <CheckCircle size={18} className="shrink-0 mt-0.5" style={{ color: "var(--color-primary)" }} />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ── FAQ ─────────────────────────────── */}
        <section className="py-12 lg:py-16 border-t border-gray-100">
          <div className="max-w-[760px] mx-auto px-4 sm:px-6 lg:px-8">
            <h2
              className="text-[26px] lg:text-[32px] font-extrabold tracking-[-0.02em] mb-6"
              style={{ fontFamily: "var(--font-heading)", color: "var(--color-dark)" }}
            >
              Vanliga frågor
            </h2>
            <div className="divide-y divide-gray-200 border-y border-gray-200">
              {FAQ.map((f) => (
                <div key={f.q} className="py-5">
                  <h3 className="font-bold mb-1.5" style={{ color: "var(--color-dark)" }}>{f.q}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FORMULÄR IGEN ─────────────────────── */}
        <section className="py-12 lg:py-16" style={{ backgroundColor: "var(--color-dark)" }}>
          <div className="max-w-[480px] mx-auto px-4 sm:px-6">
            <h2
              className="text-[26px] lg:text-[32px] font-extrabold tracking-[-0.02em] text-white text-center mb-6"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Få en gratis offert på ditt tak
            </h2>
            <div id="formular-botten">
              <LpFormular formId="lp_bottom" sokord={v.sokord} />
            </div>
          </div>
        </section>
      </main>

      {/* Avsändare i stället för sajtens footer: inga länkar ut, men tydligt
          vem som står bakom sidan. */}
      <footer className="bg-white border-t border-gray-100 py-8 pb-28 md:pb-8">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 text-xs text-gray-500 leading-relaxed text-center">
          <p className="font-semibold text-gray-700">{company.namn}</p>
          <p>
            Org.nr {company.orgNr} · {nap.gata}, {nap.postnr} {nap.ort} ·{" "}
            <a href={telefon.href} className="hover:underline">{telefon.display}</a> ·{" "}
            <a href={`mailto:${nap.email}`} className="hover:underline">{nap.email}</a>
          </p>
          <p className="mt-2">
            <Link href="/integritetspolicy" className="hover:underline">Integritetspolicy</Link>
          </p>
        </div>
      </footer>

      <LpStickyCta />
    </>
  );
}
