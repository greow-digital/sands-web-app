import Link from "next/link";
import { ClipboardCheck, ArrowRight } from "lucide-react";

// Kompakt inline-uppmaning till kostnadsfri takkontroll, mitt i en artikel.
// Pekar som standard på formuläret på samma sida (#formular), så att
// läsaren inte lämnar artikeln. Server-komponent (ingen interaktivitet).
export default function TakkontrollInlineCta({
  heading = "Vill du veta vad ditt tak behöver?",
  text = "Vid en kostnadsfri takkontroll bedömer vi skicket på taket, och du får fast pris på det som behöver göras.",
  href = "#formular",
  className = "",
}: {
  heading?: string;
  text?: string;
  href?: string;
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
        href={href}
        className="inline-flex items-center gap-2 shrink-0 self-start sm:self-center px-6 py-3 rounded-full text-white font-semibold text-sm transition-all hover:scale-[1.02]"
        style={{ backgroundColor: "var(--color-primary)" }}
      >
        Boka kostnadsfri takkontroll <ArrowRight size={15} />
      </Link>
    </div>
  );
}
