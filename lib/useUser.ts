import { useState } from "react";
import { UserTier, TIERS } from "./subscriptionTypes";

/**
 * TEMP USER STATE
 * ----------------
 * This will later be replaced by:
 * - Backend auth
 * - Stripe / RevenueCat
 * - Database lookup
 */
export function useUser() {
  // 🔴 TEMP: change this to FREE / PRO / ELITE to test UI
  const [tier] = useState<UserTier>(TIERS.ELITE);

  return {
    id: "demo-user",
    tier,
  };
}

