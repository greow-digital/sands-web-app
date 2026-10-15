import type { Rating } from "@/lib/growthship/types";

const RATING_TONE: Record<Rating, "high" | "medium" | "low"> = {
  High: "high",
  Medium: "medium",
  Low: "low",
};

export function RatingBadge({ label, value }: { label: string; value: Rating }) {
  return (
    <span className="gs-badge" data-tone={RATING_TONE[value]}>
      {label} {value}
    </span>
  );
}

export function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "high" | "medium" | "low" | "neutral" | "danger";
}) {
  return (
    <span className="gs-badge" data-tone={tone}>
      {children}
    </span>
  );
}
