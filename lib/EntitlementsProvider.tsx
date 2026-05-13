import React, { createContext, useContext, useEffect, useState } from "react";
import Purchases from "react-native-purchases";

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
    const init = async () => {
      try {
        const info = await Purchases.getCustomerInfo();
        update(info);
      } catch (e) {
        console.log("Entitlements load error", e);
        setLoading(false);
      }
    };

    init();

    const listener = Purchases.addCustomerInfoUpdateListener(update);

   return () => {
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