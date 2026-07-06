import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  path: "/kontakt",
  title: "Kontakta oss | Sands Entreprenad Stockholm AB",
  description:
    "Kontakta Sands Entreprenad. Telefon 08-28 38 88, info@sandsab.se. Spjutvägen 5A, 175 61 Järfälla. Vi servar hela Stockholmsregionen.",
});

export default function KontaktLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
