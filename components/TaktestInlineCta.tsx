import Link from "next/link";
import { ClipboardCheck, ArrowRight } from "lucide-react";

// Kompakt inline-uppmaning till /taktest. Återanvänds på blogg, priser,
// tjänste- och områdessidor. Server-komponent (ingen interaktivitet).
export default function TaktestInlineCta({
  heading = "Osäker på om taket behöver bytas?",
  text = "Gör vårt kostnadsfria taktest på en minut, så får du en personlig bedömning av takets skick direkt.",
  className = "",
}: {
  heading?: string;
  text?: string;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-[#2B74FC]/15 bg-[rgba(43,116,252,0.05)] p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center gap-5 ${className}`}
    >
      <div
        className="hidden sm:flex w-12 h-12 rounded-xl shrink-0 items-center justify-center"
        style={{ backgroundColor: "rgba(43,116,252,0.1)", color: "var(--color-primary)" }}
      >
        <ClipboardCheck size={22} />
      </div>
      <div className="flex-1">
        <p
          className="text-base font-bold mb-1"
          style={{ color: "var(--color-dark)" }}
        >
          {heading}
        </p>
        <p className="text-sm text-gray-600 leading-relaxed">{text}</p>
      </div>
      <Link
        href="/taktest"
        className="inline-flex items-center gap-2 shrink-0 self-start sm:self-center px-6 py-3 rounded-full text-white font-semibold text-sm transition-all hover:scale-[1.02]"
        style={{ backgroundColor: "var(--color-primary)" }}
      >
        Gör taktestet <ArrowRight size={15} />
      </Link>
    </div>
  );
}
