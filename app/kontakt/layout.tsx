import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/kontakt" },
  title: "Kontakta Sands Entreprenad | Takläggare Stockholm, 08-28 38 88",
  description:
    "Kontakta Sands Entreprenad, vi svarar inom 24 timmar. Ring 08-28 38 88 eller fyll i formuläret.",
};

export default function KontaktLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
