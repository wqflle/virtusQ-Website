import AsyncStorage from "@react-native-async-storage/async-storage";

// ===============================
// FREE TIER LIMIT
// Change this one value to update the limit everywhere.
// Must match FREE_DAILY_LIMIT in app/(tabs)/index.tsx
// ===============================
const FREE_DAILY_LIMIT = 3;

function getToday() {
  return new Date().toISOString().split("T")[0]; // YYYY-MM-DD
}

function getKey(uid: string) {
  return `analysis_usage_${uid}`;
}

// ✅ GET USAGE
export async function getUsage(uid: string): Promise<number> {
  const key = getKey(uid);
  const raw = await AsyncStorage.getItem(key);
  if (!raw) return 0;

  const data = JSON.parse(raw);
  const today = getToday();

  if (data.date !== today) {
    return 0; // reset automatically each day
  }

  return data.count ?? 0;
}

// ✅ CAN ANALYZE
// Uses FREE_DAILY_LIMIT so it always stays in sync with the UI
export async function canAnalyze(uid: string, tier: string): Promise<boolean> {
  if (tier !== "free") return true;
  const used = await getUsage(uid);
  return used < FREE_DAILY_LIMIT;
}

// ✅ RECORD
export async function recordAnalysis(uid: string): Promise<void> {
  const key = getKey(uid);
  const today = getToday();
  const raw = await AsyncStorage.getItem(key);

  if (!raw) {
    await AsyncStorage.setItem(
      key,
      JSON.stringify({ date: today, count: 1 })
    );
    return;
  }

  const data = JSON.parse(raw);

  if (data.date !== today) {
    await AsyncStorage.setItem(
      key,
      JSON.stringify({ date: today, count: 1 })
    );
    return;
  }

  const newCount = (data.count ?? 0) + 1;
  await AsyncStorage.setItem(
    key,
    JSON.stringify({ date: today, count: newCount })
  );
}