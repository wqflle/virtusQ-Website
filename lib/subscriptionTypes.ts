export type UserTier = "free" | "pro" | "elite";

export const TIERS = {
  FREE: "free" as UserTier,
  PRO: "pro" as UserTier,
  ELITE: "elite" as UserTier,
};

// Optional helper (VERY useful later)
export const TIER_ORDER: Record<UserTier, number> = {
  free: 0,
  pro: 1,
  elite: 2,
};
