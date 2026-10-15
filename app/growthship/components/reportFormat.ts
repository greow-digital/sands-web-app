const sek0 = new Intl.NumberFormat("sv-SE", { style: "currency", currency: "SEK", maximumFractionDigits: 0 });
const sek2 = new Intl.NumberFormat("sv-SE", { style: "currency", currency: "SEK", minimumFractionDigits: 2, maximumFractionDigits: 2 });
const int = new Intl.NumberFormat("sv-SE");

export const fInt = (v: number) => int.format(Math.round(v));
export const fSek = (v: number) => sek0.format(v);
export const fSek2 = (v: number) => sek2.format(v);
export const fPct = (v: number) => `${(v * 100).toFixed(1)}%`;
export const fPct2 = (v: number) => `${(v * 100).toFixed(2)}%`;
export const fPos = (v: number) => v.toFixed(1);
export const fConv = (v: number) => (Number.isInteger(v) ? String(v) : v.toFixed(1));
export const fChg = (v: number) => `${v >= 0 ? "+" : ""}${(v * 100).toFixed(0)}%`;
export const fCompact = (v: number) =>
  Math.abs(v) >= 10000 ? new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(v) : fInt(v);

export const show = (fmt: (n: number) => string) => (v: number | null) => (v == null || Number.isNaN(v) ? "-" : fmt(v));

export function dayLabel(iso: string): string {
  const d = new Date(iso + "T00:00:00Z");
  return d.toLocaleDateString("sv-SE", { month: "short", day: "numeric", timeZone: "UTC" });
}

export function dayLabelLong(iso: string): string {
  const d = new Date(iso + "T00:00:00Z");
  return d.toLocaleDateString("sv-SE", { weekday: "short", month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
}

interface MetricFormat {
  fmt: (n: number) => string;
  better: 1 | 0 | -1;
}

export const METRICS: Record<string, MetricFormat> = {
  leads: { fmt: fInt, better: 1 },
  sessions: { fmt: fInt, better: 1 },
  ads_cost: { fmt: fSek, better: 0 },
  ads_conversions: { fmt: fConv, better: 1 },
  ads_cpa: { fmt: fSek, better: -1 },
  ads_clicks: { fmt: fInt, better: 1 },
  ads_cpc: { fmt: fSek2, better: -1 },
  organic_clicks: { fmt: fInt, better: 1 },
  organic_impressions: { fmt: fInt, better: 1 },
  organic_ctr: { fmt: fPct2, better: 1 },
  organic_position: { fmt: fPos, better: -1 },
};
