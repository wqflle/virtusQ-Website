export type Tier = {
  label: string;
  emoji: string;
  min: number;
  max: number;
  color: string;
};


const TIERS: Tier[] = [
  { label: "Bronze",   emoji: "🥉", min: 0,  max: 25,  color: "#CD7F32" },
  { label: "Silver",   emoji: "🥈", min: 26, max: 30,  color: "#C0C0C0" },
  { label: "Gold",     emoji: "🥇", min: 31, max: 50,  color: "#FFD700" },
  { label: "Platinum", emoji: "💠", min: 51, max: 60,  color: "#00E5FF" },
  { label: "Diamond",  emoji: "💎", min: 61, max: 70,  color: "#4FC3F7" },
  { label: "Elite",    emoji: "🏆", min: 71, max: 80,  color: "#F5C977" },
  { label: "Champion", emoji: "👑", min: 81, max: 100, color: "#7C3AED" },
];

export function getTierProgress(score: number) {
  const s = Math.max(0, Math.min(100, Math.round(score)));

  const current =
    TIERS.find((t) => s >= t.min && s <= t.max) ??
    TIERS[0];

  const currentIndex = TIERS.indexOf(current);
  const nextTier = TIERS[currentIndex + 1] ?? null;

  // 🔥 Progress toward NEXT tier
  const progress = nextTier
    ? (s - current.min) / (nextTier.min - current.min)
    : 1; // Champion = full

  const percentToNext = nextTier
    ? Math.round(progress * 100)
    : 100;

  return {
    tier: {
      label: current.label,
      emoji: current.emoji,
      color: current.color,
      nextLabel: nextTier ? nextTier.label : null,
    },
    progress: Math.max(0, Math.min(1, progress)),
    percentToNext,
  };
}
