// app/lib/streaks.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

const STREAK_KEY = "analysis_streak_v1";

type StreakData = {
  current: number;
  best: number;
  lastDate: string | null;
};

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function yesterdayISO() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

// Read-only (used by Progress / Profile)
export async function getStreak() {
  const raw = await AsyncStorage.getItem(STREAK_KEY);
  if (!raw) {
    return { current: 0, best: 0 };
  }

  try {
    const parsed: StreakData = JSON.parse(raw);
    return {
      current: parsed.current,
      best: parsed.best,
    };
  } catch {
    return { current: 0, best: 0 };
  }
}

// Call this AFTER a successful analysis
export async function updateStreak() {
  const raw = await AsyncStorage.getItem(STREAK_KEY);

  const today = todayISO();
  const yesterday = yesterdayISO();

  let data: StreakData = {
    current: 0,
    best: 0,
    lastDate: null,
  };

  if (raw) {
    try {
      data = JSON.parse(raw);
    } catch {}
  }

  if (data.lastDate === today) {
    return;
  }

  if (data.lastDate === yesterday) {
    data.current += 1;
  } else {
    data.current = 1;
  }

  data.best = Math.max(data.best, data.current);
  data.lastDate = today;

  await AsyncStorage.setItem(STREAK_KEY, JSON.stringify(data));
}
