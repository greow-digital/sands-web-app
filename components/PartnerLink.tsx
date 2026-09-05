"use client";

import { ExternalLink } from "lucide-react";

type GtagFn = (event: string, name: string, params: object) => void;

/**
 * Utgående länk till ett samarbetsbolag, med GA4-event 'partner_link_click'.
 *
 * Länkarna är redaktionella rekommendationer, inte köpta placeringar, så de
 * ska INTE ha rel="nofollow" eller rel="sponsored".
 */
export default function PartnerLink({
  href,
  partner,
  location,
  children,
}: {
  href: string;
  /** GA4-parameter, t.ex. "svensk_takinspektion". */
  partner: string;
  /** GA4-parameter, var på sajten klicket skedde. */
  location: string;
  children: React.ReactNode;
}) {
  function fire() {
    if (typeof window === "undefined" || !("gtag" in window)) return;
    (window as unknown as { gtag: GtagFn }).gtag("event", "partner_link_click", {
      event_category: "engagement",
      partner,
      location,
    });
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      onClick={fire}
      className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2B74FC] hover:underline"
    >
      {children}
      <ExternalLink size={13} className="shrink-0" />
    </a>
  );
}
