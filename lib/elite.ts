// lib/elite.ts

export type RepQuality = "bad" | "situational" | "good";

export const ELITE_ENABLED = true;

/**
 * Maps rep quality to a vertical bias for graphs
 * bad        -> lower on graph
 * situational-> middle
 * good       -> higher
 */
export function mapConfidenceWithQuality(
  confidence01: number,
  quality?: RepQuality
): number {
  const c = Math.max(0, Math.min(1, confidence01));

  if (!quality) return c;

  switch (quality) {
    case "bad":
      return c * 0.45; // force lower
    case "situational":
      return 0.4 + c * 0.3; // middle band
    case "good":
      return 0.65 + c * 0.35; // top band
    default:
      return c;
  }
}

/**
 * Color coding for Elite graphs
 */
export function colorForQuality(
  quality?: RepQuality
) {
  switch (quality) {
    case "bad":
      return "#FF4D4D"; // red
    case "situational":
      return "#F5C977"; // yellow
    case "good":
      return "#2ED573"; // green
    default:
      return "#999";
  }
}

/**
 * Elite-only features toggle
 */
export function eliteOnly<T>(
  isElite: boolean,
  value: T,
  fallback: T
): T {
  return isElite ? value : fallback;
}
