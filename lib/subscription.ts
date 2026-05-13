import AsyncStorage from "@react-native-async-storage/async-storage";

export type PlanTier = "free" | "pro" | "elite";

const KEY_TIER = "sub_tier_v1";

/**
 * TEMP: local mock tier for development.
 * Later: replace readTier() to call RevenueCat / your backend / StoreKit receipt.
 */
export async function readTier(): Promise<PlanTier> {
  try {
    const raw = await AsyncStorage.getItem(KEY_TIER);
    if (raw === "pro" || raw === "elite" || raw === "free") return raw;
    return "free";
  } catch {
    return "free";
  }
}

export async function writeTier(tier: PlanTier) {
  try {
    await AsyncStorage.setItem(KEY_TIER, tier);
  } catch {}
}

export function isProOrElite(tier: PlanTier) {
  return tier === "pro" || tier === "elite";
}

export function isElite(tier: PlanTier) {
  return tier === "elite";
}

export function tierLabel(tier: PlanTier) {
  if (tier === "elite") return "Elite";
  if (tier === "pro") return "Pro";
  return "Free";
}
