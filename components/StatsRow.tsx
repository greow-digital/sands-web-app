interface StatsRowProps {
  /** "light" = vita siffror (mörk bakgrund), "dark" = mörk text */
  theme?: "light" | "dark";
  className?: string;
}

const STATS = [
  { num: "500+", label: "Nöjda kunder" },
  { num: "2 500+", label: "Takläggningar" },
  { num: "30 år", label: "Monier garanti" },
] as const;

export default function StatsRow({
  theme = "light",
  className = "",
}: StatsRowProps) {
  const numCls = theme === "light" ? "text-white" : "text-[color:var(--color-dark)]";
  const labelCls = theme === "light" ? "text-gray-300" : "text-gray-500";

  return (
    <div
      className={`grid grid-cols-3 gap-4 sm:gap-8 max-w-xl ${className}`}
    >
      {STATS.map((s) => (
        <div key={s.label}>
          <div
            className={`text-[34px] sm:text-[42px] lg:text-[52px] font-extrabold leading-none tracking-[-0.03em] mb-2 ${numCls}`}
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {s.num}
          </div>
          <div className={`text-xs sm:text-sm ${labelCls}`}>{s.label}</div>
        </div>
      ))}
    </div>
  );
}
