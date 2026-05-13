// lib/performanceStats.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getHistoryKey } from "./userStorage";

type HistoryItem = {
  elite_score?: number;
  result_payload?: {
    elite_score?: number;
  };
};

export async function getAverageEliteScore(): Promise<number> {

  try {
    const key = getHistoryKey();
    if (!key) return 0;

    const raw = await AsyncStorage.getItem(key);
    const items: HistoryItem[] = raw ? JSON.parse(raw) : [];

    const scores = items
      .map((it) => {
        const s = it?.elite_score ?? it?.result_payload?.elite_score ?? 0;
        return Number(s);
      })
      .filter((n) => Number.isFinite(n) && n > 0);

    if (scores.length === 0) return 0;

    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    return Math.max(0, Math.min(100, Math.round(avg)));
  } catch {
    return 0;
  }
}
