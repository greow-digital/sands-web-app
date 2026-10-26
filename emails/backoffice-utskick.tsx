import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";
import { company, kontaktperson, telefon, nap } from "../lib/company";

/**
 * Uppföljningsmejl till kunden från backofficet (manuellt eller
 * automatiskt). Texterna ligger i lib/backoffice/floden.ts, här finns bara
 * ramen. Samma färger och avsändare som bekräftelsemejlet
 * (emails/lead-confirmation.tsx), men kortare: ett uppföljningsmejl ska
 * läsas som ett personligt mejl, inte som ett utskick.
 */
export interface BackofficeUtskickProps {
  fornamn: string;
  stycken: string[];
}

const brand = {
  logoUrl: "https://www.sandsab.se/images/logo-sands.jpg",
  primary: "#2B74FC",
  dark: "#060607",
  body: "#4B5563",
  muted: "#6B7280",
  line: "#E5E7EB",
  surface: "#F5F7FA",
  page: "#EEF1F6",
};

const font = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif";

const s = {
  body: { backgroundColor: brand.page, margin: 0, padding: "24px 12px", fontFamily: font },
  container: { backgroundColor: "#FFFFFF", maxWidth: "600px", margin: "0 auto", borderRadius: "12px", overflow: "hidden" as const },
  header: { padding: "24px 32px", borderBottom: `1px solid ${brand.line}` },
  content: { padding: "32px 32px 34px" },
  h1: { color: brand.dark, fontSize: "22px", lineHeight: "30px", fontWeight: 800, margin: "0 0 16px" },
  p: { color: brand.body, fontSize: "16px", lineHeight: "26px", margin: "0 0 18px" },
  signatur: { color: brand.body, fontSize: "14px", lineHeight: "22px", margin: "0 0 2px" },
  link: { color: brand.primary, textDecoration: "underline" },
  footer: { padding: "20px 32px 28px", backgroundColor: brand.surface },
  small: { color: brand.muted, fontSize: "12px", lineHeight: "19px", margin: "0 0 3px" },
};

export default function BackofficeUtskick({ fornamn, stycken }: BackofficeUtskickProps) {
  return (
    <Html lang="sv">
      <Head />
      <Preview>{stycken[0] ?? ""}</Preview>
      <Body style={s.body}>
        <Container style={s.container}>
          <Section style={s.header}>
            <Img src={brand.logoUrl} width={148} height={71} alt="Sands Entreprenad" style={{ display: "block", border: 0 }} />
          </Section>
          <Section style={s.content}>
            <Heading style={s.h1}>Hej{fornamn ? ` ${fornamn}` : ""}</Heading>
            {stycken.map((t) => (
              <Text key={t} style={s.p}>
                {t}
              </Text>
            ))}
            <Hr style={{ borderColor: brand.line, margin: "26px 0 22px" }} />
            <Text style={{ ...s.signatur, margin: "0 0 10px" }}>Med vänlig hälsning,</Text>
            <Text style={{ ...s.signatur, color: brand.dark, fontWeight: 700 }}>{kontaktperson.namn}</Text>
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
            <Text style={s.small}>
              {company.namn} · {telefon.display} · {nap.email}
            </Text>
            <Text style={s.small}>
              Du får det här mejlet för att du skickat in en förfrågan på{" "}
              <Link href="https://www.sandsab.se" style={s.link}>
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

BackofficeUtskick.PreviewProps = {
  fornamn: "Anna",
  stycken: [
    "Jag skickade ett prisförslag på ditt tak för några dagar sedan och ville höra hur du tänker.",
    "Svara på det här mejlet eller ring mig, så tar vi det därifrån.",
  ],
} as BackofficeUtskickProps;
