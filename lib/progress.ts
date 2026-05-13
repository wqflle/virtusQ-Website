import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "weekly_progress";

const todayKey = () => new Date().toISOString().slice(0, 10);

export async function completeTodaySession() {
  const raw = await AsyncStorage.getItem(KEY);
  const progress = raw ? JSON.parse(raw) : {};

  progress[todayKey()] = true;

  await AsyncStorage.setItem(KEY, JSON.stringify(progress));
}

export async function isTodayCompleted() {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return false;

  const progress = JSON.parse(raw);
  return !!progress[todayKey()];
}

export async function getWeeklyProgress() {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return 0;

  const progress = JSON.parse(raw);

  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay()); // Sunday

  return Object.keys(progress).filter((date) => {
    const d = new Date(date);
    return d >= weekStart && d <= now;
  }).length;
}
