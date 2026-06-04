import { CheckCircle, Clock } from "lucide-react";

interface FormPromiseProps {
  /**
   * "pills": kompakt enradare med tre pills, för hero på startsidan.
   * "checklist": större panel med rubrik + 3 bullets, för in-page-sektioner.
   */
  variant?: "pills" | "checklist";
  /**
   * "light" = text/ikoner anpassade för mörk bakgrund (hero etc).
   * "dark" = för ljus bakgrund. Default = dark.
   */
  theme?: "light" | "dark";
  /** Override placering/extra spacing om behovet finns */
  className?: string;
}

export default function FormPromise({
  variant = "checklist",
  theme = "dark",
  className = "",
}: FormPromiseProps) {
  if (variant === "pills") {
    const textCls =
      theme === "light" ? "text-white/90" : "text-gray-700";
    const iconCls =
      theme === "light" ? "text-white/70" : "text-gray-500";
    const dotCls =
      theme === "light" ? "text-white/40" : "text-gray-300";

    return (
      <div className={`text-center ${className}`}>
        <div
          className={`inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-xs sm:text-sm font-medium ${textCls}`}
        >
          <span className="inline-flex items-center gap-1.5">
            <Clock size={14} className={iconCls} />
            Svarar samma vardag
          </span>
          <span className={dotCls}>·</span>
          <span className="inline-flex items-center gap-1.5">
            <CheckCircle
              size={14}
              style={{ color: "var(--color-primary)" }}
            />
            Kostnadsfritt
          </span>
          <span className={dotCls}>·</span>
          <span className="inline-flex items-center gap-1.5">
            <CheckCircle
              size={14}
              style={{ color: "var(--color-primary)" }}
            />
            Utan förpliktelser
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl border border-gray-100 bg-white p-5 ${className}`}
    >
      <p
        className="text-sm font-bold mb-3"
        style={{ color: "var(--color-dark)" }}
      >
        Få ett fast prisförslag inom 24 h
      </p>
      <ul className="space-y-2">
        {[
          "Kostnadsfri takkontroll på plats",
          "Helt utan förpliktelser",
          "Svarar samma vardag",
        ].map((item) => (
          <li
            key={item}
            className="flex items-start gap-2.5 text-sm text-gray-700"
          >
            <CheckCircle
              size={15}
              className="shrink-0 mt-0.5"
              style={{ color: "var(--color-primary)" }}
            />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
