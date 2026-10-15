import type { Rating } from "../types";

const WEIGHT: Record<Rating, number> = { High: 3, Medium: 2, Low: 1 };

/**
 * priority = (impact x confidence) / effort, scaled to a 1-9 range.
 * High impact + high confidence + low effort sorts to the top; that is
 * the whole point of the score, so keep the formula this readable.
 */
export function priorityScore(
  impact: Rating,
  confidence: Rating,
  effort: Rating
): number {
  const raw = (WEIGHT[impact] * WEIGHT[confidence]) / WEIGHT[effort];
  return Math.round(raw * 10) / 10;
}
