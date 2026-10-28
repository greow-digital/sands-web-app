import { Body, Container, Head, Heading, Html, Link, Preview, Section, Text } from "@react-email/components";
import * as React from "react";

/**
 * Daglig sammanfattning till Sands från backofficet: påminnelser som
 * förfaller, nya leads som ingen rört och uppföljningar som skickats eller
 * väntar på ett klick. Internt, så det är medvetet enkelt.
 */
export type SammanfattningRad = { namn: string; detalj: string; href: string };
export type SammanfattningAvsnitt = { rubrik: string; rader: SammanfattningRad[] };

export interface BackofficeSammanfattningProps {
  datum: string;
  avsnitt: SammanfattningAvsnitt[];
  adminUrl: string;
}

const font = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif";

export default function BackofficeSammanfattning({ datum, avsnitt, adminUrl }: BackofficeSammanfattningProps) {
  const antal = avsnitt.reduce((n, a) => n + a.rader.length, 0);
  return (
    <Html lang="sv">
      <Head />
      <Preview>{`${antal} saker att ta hand om i dag`}</Preview>
      <Body style={{ backgroundColor: "#EEF1F6", margin: 0, padding: "24px 12px", fontFamily: font }}>
        <Container style={{ backgroundColor: "#FFFFFF", maxWidth: "600px", margin: "0 auto", borderRadius: "12px", padding: "28px 28px 20px" }}>
          <Heading style={{ color: "#060607", fontSize: "20px", margin: "0 0 4px" }}>Att göra {datum}</Heading>
          <Text style={{ color: "#6B7280", fontSize: "14px", margin: "0 0 20px" }}>
            Från backofficet.{" "}
            <Link href={adminUrl} style={{ color: "#2B74FC" }}>
              Öppna listan
            </Link>
          </Text>
          {avsnitt
            .filter((a) => a.rader.length)
            .map((a) => (
              <Section key={a.rubrik} style={{ margin: "0 0 18px" }}>
                <Text style={{ color: "#060607", fontSize: "15px", fontWeight: 700, margin: "0 0 6px" }}>
                  {a.rubrik} ({a.rader.length})
                </Text>
                {a.rader.map((r) => (
                  <Text key={r.href + a.rubrik} style={{ color: "#4B5563", fontSize: "14px", lineHeight: "21px", margin: "0 0 4px" }}>
                    <Link href={r.href} style={{ color: "#2B74FC", fontWeight: 600 }}>
                      {r.namn}
                    </Link>
                    {r.detalj ? `, ${r.detalj}` : ""}
                  </Text>
                ))}
              </Section>
            ))}
        </Container>
      </Body>
    </Html>
  );
}
