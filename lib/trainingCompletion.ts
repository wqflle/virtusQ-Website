import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from "./auth";

/* =========================================================
   USER-SCOPED KEY HELPERS
========================================================= */

function uidOrThrow() {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("No authenticated user");
  return uid;
}

function userKey(base: string) {
  return `${base}:${uidOrThrow()}`;
}

/* =========================================================
   BASE KEYS (VERSIONED)
========================================================= */

const KEY_PREFIX = "training_completed_v1";
const STREAK_KEY = "training_streak_v1";
const LAST_COMPLETION_KEY = "training_last_completion_v1";

/* =========================================================
   DATE HELPERS
========================================================= */

function pad2(n: number) {
  return n < 10 ? `0${n}` : `${n}`;
}

function toISODate(d: Date) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

// Week start = Sunday (local)
function getWeekStartSunday(d: Date) {
  const copy = new Date(d);
  const day = copy.getDay(); // 0=Sun
  copy.setHours(0, 0, 0, 0);
  copy.setDate(copy.getDate() - day);
  return copy;
}

function getWeekKey(now = new Date()) {
  const weekStart = getWeekStartSunday(now);
  return userKey(`${KEY_PREFIX}_${toISODate(weekStart)}`);
}

/* =========================================================
   COMPLETION MAP
========================================================= */

export type CompletionMap = Record<string, boolean>;

export async function getWeekCompletionMap(): Promise<CompletionMap> {
  try {
    const key = getWeekKey();
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export async function setDayCompleted(dayKey: string, completed: boolean) {
  const key = getWeekKey();
  const map = await getWeekCompletionMap();
  map[dayKey] = completed;
  await AsyncStorage.setItem(key, JSON.stringify(map));

  if (completed) {
    await recordCompletionEvent();
  }
}

export async function toggleDayCompleted(dayKey: string) {
  const map = await getWeekCompletionMap();
  const next = !map[dayKey];
  await setDayCompleted(dayKey, next);
  return next;
}

export async function clearWeekCompletion() {
  try {
    const key = getWeekKey();
    await AsyncStorage.removeItem(key);
  } catch {}
}

/* =========================================================
   SOLO SESSION HELPERS
========================================================= */

export function countCompletedSoloSessions(
  availabilityMap: Record<string, string>,
  completionMap: CompletionMap
): number {
  return Object.keys(availabilityMap).reduce((sum, day) => {
    const isSolo = availabilityMap[day] === "solo";
    const completed = completionMap[day] === true;
    return sum + (isSolo && completed ? 1 : 0);
  }, 0);
}

export function countPlannedSoloSessions(
  availabilityMap: Record<string, string>
): number {
  return Object.values(availabilityMap).filter((v) => v === "solo").length;
}

/* =========================================================
   🔥 STREAK LOGIC (USER-SCOPED)
========================================================= */

async function recordCompletionEvent() {
  const today = toISODate(new Date());

  const lastKey = userKey(LAST_COMPLETION_KEY);
  const streakKey = userKey(STREAK_KEY);

  const lastDateRaw = await AsyncStorage.getItem(lastKey);
  const streakRaw = await AsyncStorage.getItem(streakKey);

  let streak = streakRaw ? Number(streakRaw) : 0;

  if (lastDateRaw) {
    const last = new Date(lastDateRaw);
    const diff =
      (new Date(today).getTime() - last.getTime()) /
      (1000 * 60 * 60 * 24);

    if (diff === 1) streak += 1;
    else if (diff > 1) streak = 1;
  } else {
    streak = 1;
  }

  await AsyncStorage.setItem(streakKey, String(streak));
  await AsyncStorage.setItem(lastKey, today);
}

export async function getCurrentStreak(): Promise<number> {
  try {
    const raw = await AsyncStorage.getItem(userKey(STREAK_KEY));
    return raw ? Number(raw) : 0;
  } catch {
    return 0;
  }
}

export async function resetStreak() {
  try {
    await AsyncStorage.multiRemove([
      userKey(STREAK_KEY),
      userKey(LAST_COMPLETION_KEY),
    ]);
  } catch {}
}

/* =========================================================
   MISSED SESSION DETECTION
========================================================= */

export async function didMissYesterdaySoloSession(
  availabilityMap: Record<string, string>
): Promise<boolean> {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const dayKey = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
    yesterday.getDay()
  ];

  if (availabilityMap[dayKey] !== "solo") return false;

  const completionMap = await getWeekCompletionMap();
  return completionMap[dayKey] !== true;
}

/* =========================================================
   WEEKLY SUMMARY (AUTHORITATIVE)
========================================================= */

export type WeeklyTrainingSummary = {
  plannedSolo: number;
  completedSolo: number;
  progressPct: number;
  streak: number;
  missedYesterday: boolean;
  overachieved: boolean;
};

export async function getWeeklyTrainingSummary(
  availabilityMap: Record<string, string>
): Promise<WeeklyTrainingSummary> {
  const completionMap = await getWeekCompletionMap();

  const plannedSolo = countPlannedSoloSessions(availabilityMap);
  const completedSolo = countCompletedSoloSessions(
    availabilityMap,
    completionMap
  );

  const streak = await getCurrentStreak();
  const missedYesterday = await didMissYesterdaySoloSession(availabilityMap);

  const progressPct =
    plannedSolo > 0
      ? Math.round((completedSolo / plannedSolo) * 100)
      : 0;

  return {
    plannedSolo,
    completedSolo,
    progressPct,
    streak,
    missedYesterday,
    overachieved: completedSolo > plannedSolo,
  };
}
