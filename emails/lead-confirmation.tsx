import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";
import { company, nap, telefon } from "../lib/company";

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
 * Texten är Samuels (Sands), 30 okt 2026. Mejlet skickas i företagets namn
 * och inte i en persons, så det står i vi-form och signeras av bolaget.
 * Löftena (samma vardag, sms eller mejl om vi inte når dig, prisförslag
 * inom 72 timmar efter besöket) är Sands egna. Ändra dem inte utan att
 * Sands bekräftat det.
 */
const INTRO = `Vi har tagit emot din förfrågan och tackar för ditt intresse för ${company.namn}. Vi återkommer till dig så snart som möjligt.`;

const STEG = [
  {
    titel: "Vi kontaktar dig",
    text: "Vi kontaktar dig i första hand via telefon, vanligtvis samma vardag, för att få en bättre bild av ditt tak och boka in en tid för takkontroll. Om vi inte når dig per telefon följer vi upp med sms eller mejl.",
  },
  {
    titel: "Kostnadsfri takkontroll",
    text: "Vi besöker din fastighet och genomför en noggrann kontroll av takets skick. Därefter går vi tillsammans igenom vår bedömning och eventuella behov av åtgärder. Besöket är helt kostnadsfritt och utan förpliktelser.",
  },
  {
    titel: "Fast prisförslag inom 72 timmar",
    text: "Inom 72 timmar efter besöket får du en tydlig offert med fast pris, specificerade åtgärder och eventuellt ROT-avdrag inräknat.",
  },
];

// Uppgifterna från formuläret skickas fortfarande med från /api/lead, men
// visas inte i Samuels version av mejlet.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function LeadConfirmation(_props: LeadConfirmationProps) {
  return (
    <Html lang="sv">
      <Head />
      <Preview>
        Vi har tagit emot din förfrågan och återkommer så snart som möjligt.
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
            <Heading style={s.h1}>Tack för din förfrågan!</Heading>
            <Text style={s.p}>{INTRO}</Text>

            <Text style={s.h2}>Så här går processen till</Text>

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
                Har du inte hört från oss?
              </Text>
              <Text style={{ ...s.stepText, margin: "0 0 10px" }}>
                Vi försöker alltid nå dig via telefon i första hand och följer
                upp med sms eller mejl om vi inte får svar.
              </Text>
              <Text style={{ ...s.stepText, margin: 0 }}>
                Du är även välkommen att kontakta oss direkt på{" "}
                <Link href={telefon.href} style={s.link}>
                  {telefon.display}
                </Link>{" "}
                om du har frågor eller önskar komma i kontakt med oss.
              </Text>
            </Section>

            <Text style={s.p}>
              Vi ser fram emot att hjälpa dig med ditt takprojekt.
            </Text>

            <Text style={{ ...s.signatur, margin: "0 0 10px" }}>
              Med vänliga hälsningar,
            </Text>
            <Text
              style={{ ...s.signatur, color: brand.dark, fontWeight: 700 }}
            >
              {company.namn}
            </Text>
            <Text style={s.signatur}>
              Telefon:{" "}
              <Link href={telefon.href} style={s.link}>
                {telefon.display}
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
