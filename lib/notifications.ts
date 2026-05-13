// app/lib/notifications.ts
import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CHANNEL_ID = "weekly-recap";
const LATEST_RECAP_KEY = "weekly_recap_latest";

// ===============================
// DATE HELPERS
// ===============================
function pad2(n: number) {
  return n < 10 ? `0${n}` : `${n}`;
}

function toISODate(d: Date) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

// Week start = Sunday (local time)
function getWeekStartSunday(d: Date) {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  copy.setDate(copy.getDate() - copy.getDay());
  return copy;
}

function sevenDaysAgoMs() {
  return Date.now() - 7 * 24 * 60 * 60 * 1000;
}

// ===============================
// NOTIFICATION SETUP
// ===============================
export async function setupNotifications() {
  try {
    const permissions = await Notifications.getPermissionsAsync();
    if (!permissions.granted) {
      await Notifications.requestPermissionsAsync();
    }

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
        name: "Weekly Recap",
        importance: Notifications.AndroidImportance.HIGH,
        sound: "default",
        vibrationPattern: [0, 250, 250, 250],
        lockscreenVisibility:
          Notifications.AndroidNotificationVisibility.PUBLIC,
      });
    }
  } catch (e) {
    console.warn("Notification setup failed:", e);
  }
}

// ===============================
// WEEKLY RECAP GENERATION
// ===============================
export async function maybeGenerateWeeklyRecap() {
  try {
    const today = new Date();
    const weekStart = getWeekStartSunday(today);
    const weekStartISO = toISODate(weekStart);

    const recapKey = `weekly_recap_${weekStartISO}`;
    const existing = await AsyncStorage.getItem(recapKey);

    // Only regenerate on Sunday or if missing
    if (existing && today.getDay() !== 0) return;

    const rawHistory = await AsyncStorage.getItem("analysis_history");
    if (!rawHistory) return;

    let history: any[] = [];
    try {
      history = JSON.parse(rawHistory);
    } catch {
      return;
    }

    const cutoff = sevenDaysAgoMs();
    const lastWeek = history.filter((h) => {
      const ts = new Date(h?.created_at ?? 0).getTime();
      return Number.isFinite(ts) && ts >= cutoff;
    });

    if (!lastWeek.length) return;

    const counts: Record<string, number> = {};
    for (const item of lastWeek) {
      const skill = item?.skill ?? "unknown";
      counts[skill] = (counts[skill] || 0) + 1;
    }

    const focusSkill = Object.keys(counts).sort(
      (a, b) => counts[b] - counts[a]
    )[0];

    const avgConfidence =
      lastWeek.reduce(
        (sum, h) => sum + Number(h?.skill_confidence ?? 0),
        0
      ) / lastWeek.length;

    const recap = {
      weekStart: weekStartISO,
      generatedAt: new Date().toISOString(),
      totalAnalyses: lastWeek.length,
      focusSkill,
      avgConfidence: Number(avgConfidence.toFixed(2)),
    };

    await AsyncStorage.setItem(recapKey, JSON.stringify(recap));
    await AsyncStorage.setItem(LATEST_RECAP_KEY, JSON.stringify(recap));
  } catch (e) {
    console.warn("Weekly recap generation failed:", e);
  }
}

// ===============================
// SCHEDULING (SUNDAY 9AM)
// ===============================
export async function ensureWeeklyRecapScheduled() {
  try {
    const scheduled =
      await Notifications.getAllScheduledNotificationsAsync();

    const alreadyScheduled = scheduled.some(
      (n) => n?.content?.data?.screen === "weekly-recap"
    );

    if (alreadyScheduled) return;

    const trigger: Notifications.CalendarTriggerInput = {
      weekday: 1, // Sunday (Expo: 1–7)
      hour: 9,
      minute: 0,
      repeats: true,
      ...(Platform.OS === "android" ? { channelId: CHANNEL_ID } : {}),
    };

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Your Weekly Volleyball Recap 🏐",
        body: "Tap to see your progress, focus areas, and next steps.",
        data: { screen: "weekly-recap" },
      },
      trigger,
    });
  } catch (e) {
    console.warn("Scheduling weekly recap failed:", e);
  }
}

// ===============================
// TAP HANDLER
// ===============================
export async function handleWeeklyRecapTap(
  response: Notifications.NotificationResponse,
  router: any
) {
  try {
    const screen =
      response?.notification?.request?.content?.data?.screen;

    if (screen !== "weekly-recap") return;

    // Ensure recap exists before navigation
    await maybeGenerateWeeklyRecap();

    router.push("/weekly-recap");
  } catch (e) {
    console.warn("Weekly recap tap handling failed:", e);
  }
}
