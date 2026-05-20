import React, { createContext, useContext, useEffect, useState } from "react";
import Purchases from "react-native-purchases";
import { revenueCatReady } from "./revenueCat";

type Tier = "free" | "pro" | "elite";

type EntitlementsContextType = {
  loading: boolean;
  tier: Tier;
  isPro: boolean;
  isElite: boolean;
  canAccessTraining: boolean;
  canAccessProgress: boolean;
};

const EntitlementsContext = createContext<EntitlementsContextType | null>(null);

export function EntitlementsProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [tier, setTier] = useState<Tier>("free");

  const update = (info: any) => {
    const active = info.entitlements.active;
    const hasElite = !!active["VertusQ_elite"];
    const hasPro = !!active["VirtusQ pro"];
    if (hasElite) setTier("elite");
    else if (hasPro) setTier("pro");
    else setTier("free");
    setLoading(false);
  };

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      // ✅ Wait for RevenueCat with a max timeout of 4 seconds
      let waited = 0;
      while (!revenueCatReady && waited < 4000) {
        await new Promise(res => setTimeout(res, 100));
        waited += 100;
        if (cancelled) return;
      }

      try {
        const info = await Purchases.getCustomerInfo();
        if (!cancelled) update(info);
      } catch (e) {
        console.log("Entitlements load error", e);
        if (!cancelled) setLoading(false);
      }
    };

    init();

    const listener = Purchases.addCustomerInfoUpdateListener(update);

    return () => {
      cancelled = true;
      listener?.remove?.();
    };
  }, []);

  return (
    <EntitlementsContext.Provider
      value={{
        loading,
        tier,
        isElite: tier === "elite",
        isPro: tier === "pro" || tier === "elite",
        canAccessTraining: tier !== "free",
        canAccessProgress: tier !== "free",
      }}
    >
      {children}
    </EntitlementsContext.Provider>
  );
}

export function useEntitlements() {
  const ctx = useContext(EntitlementsContext);
  if (!ctx) throw new Error("useEntitlements must be used inside provider");
  return ctx;
}