import { ExternalLink } from "lucide-react";

interface SourcesFooterProps {
  /** Vilka källor som faktiskt refereras på sidan. Default = alla. */
  show?: ("rot" | "bygglov" | "taksakerhet" | "monier")[];
}

const SOURCES = {
  rot: {
    label: "ROT-avdrag",
    name: "Skatteverket: Belopp och procent 2026",
    url: "https://www.skatteverket.se/privat/skatter/beloppochprocent/2026.4.1522bf3f19aea8075ba21.html",
  },
  bygglov: {
    label: "Bygglov för takbyte (1 dec 2025)",
    name: "Boverket: Nytt regelverk för bygglov",
    url: "https://www.boverket.se/sv/PBL-kunskapsbanken/nyheter-pa-pbl-kunskapsbanken/nu-galler-nytt-regelverk-for-bygglov/",
  },
  taksakerhet: {
    label: "Taksäkerhet och snörasskydd",
    name: "Boverket: Taksäkerhet (BBR)",
    url: "https://www.boverket.se/sv/PBL-kunskapsbanken/regler-om-byggande/boverkets-byggregler/sakerhet-vid-anvandning/taksakerhet/",
  },
  monier: {
    label: "Monier Tätt tak-garanti",
    name: "BMI Sverige: Garantier",
    url: "https://bmisverige.se/garantier/tatt-tak-garanti",
  },
} as const;

export default function SourcesFooter({
  show = ["rot", "bygglov", "taksakerhet", "monier"],
}: SourcesFooterProps) {
  return (
    <section className="py-12 lg:py-14 border-t border-gray-100 bg-gray-50/60">
      <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8">
        <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-gray-500 mb-3">
          Källor och gällande regler
        </h3>
        <p className="text-xs text-gray-500 leading-relaxed mb-4 max-w-prose">
          Innehållet på denna sida är baserat på officiella källor och senast
          uppdaterat 2026. Reglerna kan ändras, så hör gärna av dig om du vill
          ha aktuell info inför ditt projekt.
        </p>
        <ul className="grid sm:grid-cols-2 gap-3">
          {show.map((key) => {
            const src = SOURCES[key];
            return (
              <li key={key}>
                <a
                  href={src.url}
                  target="_blank"
                  rel="nofollow noopener"
                  className="group flex items-start gap-2 text-xs"
                >
                  <ExternalLink
                    size={12}
                    className="shrink-0 mt-0.5 text-gray-400 group-hover:text-[#2B74FC]"
                  />
                  <span>
                    <span className="block font-semibold text-gray-700 group-hover:text-[#2B74FC]">
                      {src.label}
                    </span>
                    <span className="block text-gray-500">{src.name}</span>
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
