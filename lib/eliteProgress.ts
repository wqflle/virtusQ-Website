import { useEntitlements } from "./useEntitlements";

/**
 * Single source of truth for ALL advanced progress features.
 * Screens must NEVER check tiers directly.
 */
export function useEliteProgress() {
  const {
    isElite,
    isPro,
  } = useEntitlements();

  return {
    // Identity
    isElite,
    isPro,

    // PRO features
    showPredictions: isPro || isElite,
    showTrendSlope: isPro || isElite,

    // ELITE-only features
    showFastestImproving: isElite,
    showAdvancedFocus: isElite,
    showWhyInsights: isElite,

    // Reserved (future ELITE)
    showConsistencyScore: isElite,
    showLongRangeForecasts: isElite,
  };
}
