// app/lib/dailyFocus.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

/* ===============================
   TYPES
================================ */
export type DailyFocus = {
  skill: string;
  confidence: number;
  primary_fix: string;
};

type HistoryItem = {
  skill: string;
  skill_confidence: number;
  primary_fix?: string;
  created_at: string;
};

/* ===============================
   HELPERS
================================ */
function todayKey() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/* ===============================
   DAILY FOCUS (SINGLE SOURCE)
================================ */
export async function getDailyFocus(): Promise<DailyFocus | null> {
  const cacheKey = `daily_focus_${todayKey()}`;

  // ✅ Use cached focus for the day (prevents mismatches)
  const cached = await AsyncStorage.getItem(cacheKey);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {
      // fall through if corrupted
    }
  }

  // Load analysis history
  const raw = await AsyncStorage.getItem("analysis_history");
  const history: HistoryItem[] = raw ? JSON.parse(raw) : [];

  if (!Array.isArray(history) || history.length === 0) {
    return null;
  }

  // Group by skill
  const bySkill: Record<string, HistoryItem[]> = {};
  for (const h of history) {
    if (!h.skill) continue;
    if (!bySkill[h.skill]) bySkill[h.skill] = [];
    bySkill[h.skill].push(h);
  }

  // Find weakest skill (lowest avg confidence)
  let weakestSkill = "";
  let lowestAvg = Infinity;

  Object.entries(bySkill).forEach(([skill, items]) => {
    const avg =
      items.reduce((sum, i) => sum + i.skill_confidence, 0) / items.length;

    if (avg < lowestAvg) {
      lowestAvg = avg;
      weakestSkill = skill;
    }
  });

  if (!weakestSkill) return null;

  // Latest analysis for that skill
  const latest = bySkill[weakestSkill]
    .slice()
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() -
        new Date(a.created_at).getTime()
    )[0];

  const focus: DailyFocus = {
    skill: weakestSkill,
    confidence: Math.round(lowestAvg * 100),
    primary_fix: latest?.primary_fix ?? "",
  };

  // Cache for the day
  await AsyncStorage.setItem(cacheKey, JSON.stringify(focus));

  return focus;
}
