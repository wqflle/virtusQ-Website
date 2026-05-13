import { useEffect, useState } from "react";
import Purchases, { CustomerInfo } from "react-native-purchases";
import { Platform } from "react-native";
import { revenueCatReady } from "./revenueCat";
export type Tier = "free" | "pro" | "elite";

/**
 * DEV OVERRIDE:
 * Set to "free" | "pro" | "elite" | null
 */
const FORCE_TIER: Tier | null = null;

export function useEntitlements() {
  const [tier, setTier] = useState<Tier>("free");
  const [loading, setLoading] = useState(true);

useEffect(() => {
  if (__DEV__ && FORCE_TIER) {
    setTier(FORCE_TIER);
    setLoading(false);
    return;
  }

  if (Platform.OS === "web") {
    setLoading(false);
    return;
  }

  let cancelled = false;
  let listener: any = null;

  const waitForRC = async () => {
    // ⏳ wait until RevenueCat is ready
    while (!revenueCatReady) {
      await new Promise((res) => setTimeout(res, 100));
      if (cancelled) return;
    }

    const update = (info: CustomerInfo) => {
      const active = info.entitlements.active;

      const hasElite = !!active["VertusQ_elite"];
      const hasPro = !!active["VirtusQ pro"];

      if (hasElite) {
        setTier("elite");
      } else if (hasPro) {
        setTier("pro");
      } else {
        setTier("free");
      }
    };

    try {
      const info = await Purchases.getCustomerInfo();
      if (!cancelled) update(info);
    } catch (e) {
      console.log("CustomerInfo error:", e);
    } finally {
      if (!cancelled) setLoading(false);
    }

    listener = Purchases.addCustomerInfoUpdateListener(update);
  };

  waitForRC();

  return () => {
    cancelled = true;
    listener?.remove?.();
  };
}, []);

  return {
    loading,
    tier,

    isFree: tier === "free",
    isPro: tier === "pro" || tier === "elite",
    isElite: tier === "elite",

    canAccessTraining: tier !== "free",
    canAccessAdvancedTraining: tier === "elite",
    canAccessProgress: tier !== "free",
    canSeePredictions: tier === "elite",
    canSeeAdvancedInsights: tier === "elite",
  };
}