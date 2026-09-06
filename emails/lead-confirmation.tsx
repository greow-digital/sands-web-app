import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";
import {
  company,
  garanti,
  granskning,
  kontaktperson,
  nap,
  telefon,
} from "../lib/company";

/**
 * Bekräftelsemejl till kunden efter inskickat formulär.
 *
 * Internmejlet till Sands ligger kvar i Apps Script, som skickar det när
 * raden läggs till i kalkylbladet. Lägg inte till ett internmejl här,
 * då får Sands dubbla notiser på varje lead.
 *
 * Mejlklienter kan inte CSS-variabler, externa stylesheets eller SVG.
 * Därför är allt inline, färgerna är hårdkodade kopior av globals.css,
 * och loggan är JPG. Ändras varumärkesfärgerna måste de ändras här också.
 *
 * Trygghetsraderna är hämtade ordagrant från formuleringar som redan
 * står publikt på sajten (/om-oss, /tjanster, /tjanster/taklaggning).
 * Skriv aldrig in ett nytt påstående om certifiering, försäkring eller
 * garanti utan att Sands bekräftat det, det är deras ansvar.
 */
export interface LeadConfirmationProps {
  name: string;
  email?: string;
  phone?: string;
  /** Taktyp, när formuläret frågat efter den. */
  roofType?: string;
  /** Ort eller område. */
  area?: string;
  message?: string;
}

const brand = {
  namn: "Sands Entreprenad",
  siteUrl: "https://www.sandsab.se",
  /** Måste vara en publik absolut URL. SVG renderas inte i Outlook/Gmail. */
  logoUrl: "https://www.sandsab.se/images/logo-sands.jpg",
  primary: "#2B74FC",
  dark: "#060607",
  body: "#4B5563",
  muted: "#6B7280",
  line: "#E5E7EB",
  surface: "#F5F7FA",
  page: "#EEF1F6",
};

const font =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif";

const s = {
  body: {
    backgroundColor: brand.page,
    margin: 0,
    padding: "24px 12px",
    fontFamily: font,
  },
  container: {
    backgroundColor: "#FFFFFF",
    maxWidth: "600px",
    margin: "0 auto",
    borderRadius: "12px",
    overflow: "hidden" as const,
  },
  header: {
    padding: "24px 32px",
    borderBottom: `1px solid ${brand.line}`,
  },
  content: { padding: "32px 32px 34px" },
  h1: {
    color: brand.dark,
    fontSize: "26px",
    lineHeight: "34px",
    fontWeight: 800,
    margin: "0 0 16px",
    letterSpacing: "-0.4px",
  },
  h2: {
    color: brand.dark,
    fontSize: "15px",
    lineHeight: "22px",
    fontWeight: 700,
    margin: "0 0 16px",
  },
  p: {
    color: brand.body,
    fontSize: "16px",
    lineHeight: "26px",
    margin: "0 0 20px",
  },
  summary: {
    backgroundColor: brand.surface,
    borderRadius: "10px",
    padding: "20px 24px 8px",
    margin: "0 0 28px",
  },
  label: {
    color: brand.muted,
    fontSize: "11px",
    lineHeight: "16px",
    textTransform: "uppercase" as const,
    letterSpacing: "0.7px",
    fontWeight: 700,
    margin: "0 0 2px",
  },
  value: {
    color: brand.dark,
    fontSize: "15px",
    lineHeight: "22px",
    margin: "0 0 14px",
  },
  stepNum: {
    color: "#FFFFFF",
    backgroundColor: brand.primary,
    borderRadius: "50%",
    width: "28px",
    height: "28px",
    fontSize: "14px",
    lineHeight: "28px",
    fontWeight: 700,
    textAlign: "center" as const,
    margin: 0,
  },
  stepTitle: {
    color: brand.dark,
    fontSize: "15px",
    lineHeight: "22px",
    fontWeight: 700,
    margin: "3px 0 2px",
  },
  stepText: {
    color: brand.body,
    fontSize: "14px",
    lineHeight: "22px",
    margin: "0 0 20px",
  },
  callout: {
    backgroundColor: brand.surface,
    borderLeft: `3px solid ${brand.primary}`,
    borderRadius: "0 8px 8px 0",
    padding: "16px 20px",
    margin: "8px 0 28px",
  },
  trust: {
    color: brand.body,
    fontSize: "14px",
    lineHeight: "22px",
    margin: "0 0 8px",
  },
  footer: { padding: "24px 32px 32px", backgroundColor: brand.surface },
  small: {
    color: brand.muted,
    fontSize: "12px",
    lineHeight: "19px",
    margin: "0 0 3px",
  },
  link: { color: brand.primary, textDecoration: "underline" },
  hej: {
    color: brand.dark,
    fontSize: "17px",
    lineHeight: "26px",
    fontWeight: 700,
    margin: "0 0 10px",
  },
  // Outlook på Windows ignorerar border-radius och visar bilden fyrkantig.
  // Det är acceptabelt, ett porträtt fungerar i båda formerna.
  foto: {
    borderRadius: "50%",
    display: "block",
    border: 0,
  },
  signatur: {
    color: brand.body,
    fontSize: "14px",
    lineHeight: "22px",
    margin: "0 0 2px",
  },
  granskning: {
    color: brand.muted,
    fontSize: "13px",
    lineHeight: "21px",
    margin: "14px 0 0",
  },
};

/**
 * Den personliga hälsningen. Säger inte att förfrågan är besvarad, den
 * går ut några sekunder efter inskicket och då har ingen sett den ännu.
 * "Tagit emot" är både sant och lika varmt.
 */
const HALSNING = `Tack för din förfrågan om ditt tak. Jag heter ${kontaktperson.fornamn} och det är jag som tar hand om den. Jag hör av mig inom kort för att boka in ett kostnadsfritt hembesök, då går jag upp på taket och tittar på skicket innan vi pratar pris.`;

/**
 * Så här går det till, speglar processen och löftet på sajten. Steg 1 är
 * skrivet i Simons röst eftersom det är han som står som avsändare, byts
 * personen ut måste texten skrivas om.
 */
const STEG = [
  {
    titel: "Jag hör av mig",
    text: "Jag ringer eller mejlar dig, oftast samma vardag, och ställer några frågor om taket så jag vet vad jag ska titta efter.",
  },
  {
    titel: "Kostnadsfri takkontroll på plats",
    text: "Vi kommer ut, går upp på taket och bedömer skicket. Du får en ärlig bild av vad som behöver göras, och vad som kan vänta. Helt utan förpliktelser.",
  },
  {
    titel: "Fast prisförslag inom 24 timmar",
    text: "Efter besöket får du ett skriftligt förslag med fast pris, tydlig omfattning och ROT-avdraget inräknat. Inga öppna poster som växer under jobbets gång.",
  },
];

/** Redan publicerade påståenden på sajten. Lägg inte till nya här. */
const TRYGGHET = [
  `Certifierad Monier Takpartner, ${garanti.fras} på tätt tak`,
  "F-skattsedel, ansvars- och allriskförsäkring",
  "Vi arbetar enligt ABT-06",
  "BraByggare 4,8 av 5 baserat på 54 omdömen",
];

function Detalj({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <>
      <Text style={s.label}>{label}</Text>
      <Text style={s.value}>{value}</Text>
    </>
  );
}

export default function LeadConfirmation({
  name,
  email,
  phone,
  roofType,
  area,
  message,
}: LeadConfirmationProps) {
  const fornamn = (name || "").trim().split(/\s+/)[0] || "";
  const harSammanfattning = Boolean(phone || email || roofType || area || message);

  return (
    <Html lang="sv">
      <Head />
      <Preview>
        {`${kontaktperson.fornamn} hör av sig inom kort för att boka in ett kostnadsfritt hembesök.`}
      </Preview>
      <Body style={s.body}>
        <Container style={s.container}>
          <Section style={s.header}>
            <Img
              src={brand.logoUrl}
              width={148}
              height={71}
              alt={brand.namn}
              style={{ display: "block", border: 0 }}
            />
          </Section>

          <Section style={s.content}>
            <Heading style={s.h1}>
              Hej{fornamn ? ` ${fornamn}` : ""}
            </Heading>

            {/*
              Hälsningen är personlig och står i jag-form eftersom mejlet
              skickas i Simons namn. Fotot visas bara om kontaktperson.fotoUrl
              är satt, annars ligger texten i full bredd. Det är avsiktligt:
              hellre ingen bild än en trasig bildruta hos mottagaren.
            */}
            {kontaktperson.fotoUrl ? (
              <Row style={{ margin: "0 0 20px" }}>
                <Column width={84} valign="top">
                  <Img
                    src={kontaktperson.fotoUrl}
                    width={68}
                    height={68}
                    alt={kontaktperson.namn}
                    style={s.foto}
                  />
                </Column>
                <Column valign="top">
                  <Text style={{ ...s.p, margin: 0 }}>{HALSNING}</Text>
                </Column>
              </Row>
            ) : (
              <Text style={s.p}>{HALSNING}</Text>
            )}

            {harSammanfattning && (
              <Section style={s.summary}>
                <Text style={{ ...s.label, color: brand.dark, fontSize: "12px", margin: "0 0 14px" }}>
                  Det här skickade du in
                </Text>
                <Detalj label="Namn" value={name} />
                <Detalj label="Telefon" value={phone} />
                <Detalj label="E-post" value={email} />
                <Detalj label="Område" value={area} />
                <Detalj label="Taktyp" value={roofType} />
                <Detalj label="Meddelande" value={message} />
              </Section>
            )}

            <Text style={s.h2}>Så här går det till</Text>

            {STEG.map((steg, i) => (
              <Row key={steg.titel}>
                <Column width={44} valign="top">
                  <Text style={s.stepNum}>{i + 1}</Text>
                </Column>
                <Column valign="top">
                  <Text style={s.stepTitle}>{steg.titel}</Text>
                  <Text style={s.stepText}>{steg.text}</Text>
                </Column>
              </Row>
            ))}

            <Section style={s.callout}>
              <Text
                style={{ ...s.stepTitle, margin: "0 0 4px", fontSize: "15px" }}
              >
                Har du bråttom?
              </Text>
              <Text style={{ ...s.stepText, margin: 0 }}>
                Ring mig direkt på{" "}
                <Link href={kontaktperson.telefonHref} style={s.link}>
                  {kontaktperson.telefonDisplay}
                </Link>{" "}
                så tar vi det på en gång. Du kan också svara på det här mejlet,
                det landar hos oss på kontoret och når mig samma dag.
              </Text>
            </Section>

            <Hr style={{ borderColor: brand.line, margin: "0 0 24px" }} />

            <Text style={s.h2}>Bra att veta om oss</Text>
            {TRYGGHET.map((rad) => (
              <Text key={rad} style={s.trust}>
                {rad}
              </Text>
            ))}

            {/*
              Länkad text, aldrig råa URL:er. En lista med fullängdsadresser
              är en tydlig spamsignal, och allabolag-länken är närmare 90
              tecken lång.
            */}
            <Text style={s.granskning}>
              Kontrollera oss gärna hos{" "}
              <Link href={granskning.brabyggare} style={s.link}>
                BraByggare
              </Link>{" "}
              och{" "}
              <Link href={granskning.allabolag} style={s.link}>
                Allabolag
              </Link>
              .
            </Text>

            <Hr style={{ borderColor: brand.line, margin: "26px 0 22px" }} />

            <Text style={{ ...s.signatur, margin: "0 0 10px" }}>
              Med vänlig hälsning,
            </Text>
            <Text
              style={{ ...s.signatur, color: brand.dark, fontWeight: 700 }}
            >
              {kontaktperson.namn}
            </Text>
            <Text style={s.signatur}>{company.namn}</Text>
            <Text style={s.signatur}>
              <Link href={kontaktperson.telefonHref} style={s.link}>
                {kontaktperson.telefonDisplay}
              </Link>{" "}
              ·{" "}
              <Link href={`mailto:${kontaktperson.email}`} style={s.link}>
                {kontaktperson.email}
              </Link>
            </Text>
          </Section>

          <Section style={s.footer}>
            <Text style={{ ...s.small, color: brand.dark, fontWeight: 700, fontSize: "13px" }}>
              {company.namn}
            </Text>
            <Text style={s.small}>
              {nap.gata}, {nap.postnr} {nap.ort}
            </Text>
            <Text style={s.small}>
              {telefon.display} · {nap.email}
            </Text>
            <Text style={s.small}>Org.nr {company.orgNr}</Text>
            <Text style={{ ...s.small, margin: "14px 0 0" }}>
              Du får det här mejlet för att du skickat in en förfrågan på{" "}
              <Link href={brand.siteUrl} style={s.link}>
                sandsab.se
              </Link>
              .
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

LeadConfirmation.PreviewProps = {
  name: "Anna Lindqvist",
  email: "anna.lindqvist@example.se",
  phone: "070-123 45 67",
  area: "Bromma",
  roofType: "Betongpannor",
  message: "Har ett tegeltak från 80-talet som läcker vid skorstenen.",
} as LeadConfirmationProps;
