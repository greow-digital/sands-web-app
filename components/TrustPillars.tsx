import { CheckCircle } from "lucide-react";

interface TrustPillarsProps {
  variant?: "horizontal" | "vertical";
  /** Visa nyhetsrad om bygglov-regelförändringen */
  highlightBygglov?: boolean;
}

const PILLARS = [
  {
    label: "Fast pris",
    sub: "Bindande offert efter takkontroll",
  },
  {
    label: "30 % ROT-avdrag",
    sub: "Vi sköter ansökan åt dig",
  },
  {
    label: "30 års Monier-garanti",
    sub: "Certifierad Takpartner sedan 2016",
  },
  {
    label: "BraByggare 4.8★",
    sub: "Baserat på 54 omdömen",
  },
] as const;

export default function TrustPillars({
  variant = "horizontal",
  highlightBygglov = false,
}: TrustPillarsProps) {
  if (variant === "vertical") {
    return (
      <ul className="space-y-3">
        {highlightBygglov && (
          <li
            className="flex items-start gap-3 p-3 rounded-xl"
            style={{
              backgroundColor: "rgba(43,116,252,0.08)",
              color: "var(--color-dark)",
            }}
          >
            <span className="shrink-0 text-base mt-0.5">🎉</span>
            <span className="text-sm">
              <strong className="font-bold">Slipp vänta på bygglov.</strong>{" "}
              Sedan 1 dec 2025 krävs inget bygglov för takbyte på en- och
              tvåfamiljshus.
            </span>
          </li>
        )}
        {PILLARS.map((p) => (
          <li
            key={p.label}
            className="flex items-start gap-3 text-sm text-gray-700"
          >
            <CheckCircle
              size={16}
              className="shrink-0 mt-0.5"
              style={{ color: "var(--color-primary)" }}
            />
            <span>
              <strong className="font-semibold text-gray-900">{p.label}.</strong>{" "}
              {p.sub}
            </span>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {PILLARS.map((p) => (
        <div
          key={p.label}
          className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-gray-100"
        >
          <CheckCircle
            size={16}
            className="shrink-0 mt-0.5"
            style={{ color: "var(--color-primary)" }}
          />
          <span className="text-xs">
            <strong className="block font-bold text-gray-900">
              {p.label}
            </strong>
            <span className="text-gray-500">{p.sub}</span>
          </span>
        </div>
      ))}
    </div>
  );
}
