import type { PeriodValue } from "@/lib/growthship/cogny/types";

function formatChange(change: PeriodValue): { text: string; direction: "up" | "down" | "flat" } {
  if (change.changeRatio === null) return { text: "ingen föregående period", direction: "flat" };
  const pct = Math.round(change.changeRatio * 1000) / 10;
  const direction = pct > 0 ? "up" : pct < 0 ? "down" : "flat";
  const arrow = direction === "up" ? "↑" : direction === "down" ? "↓" : "→";
  return { text: `${arrow} ${pct > 0 ? "+" : ""}${pct}% mot föregående period`, direction };
}

export default function MetricTile({
  label,
  value,
  change,
  format,
}: {
  label: string;
  value: number;
  change?: PeriodValue;
  format?: (n: number) => string;
}) {
  const display = format ? format(value) : value.toLocaleString("sv-SE");
  const changeInfo = change ? formatChange(change) : null;

  return (
    <div className="gs-card" style={{ flex: "1 1 160px" }}>
      <div className="gs-metric-label">{label}</div>
      <div className="gs-metric-value">{display}</div>
      {changeInfo && (
        <div className="gs-metric-change" data-direction={changeInfo.direction}>
          {changeInfo.text}
        </div>
      )}
    </div>
  );
}
