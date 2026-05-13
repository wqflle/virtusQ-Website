import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  TouchableOpacity,
  Platform,
  Alert,
} from "react-native";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAppColors } from "../../lib/useAppColors";;
import { generateTrainingDay } from "../../lib/generateTrainingDay";
import { Stack } from "expo-router";

/* ✅ IMPORTANT: use the SAME completion store as Training tab */
import {
  getWeekCompletionMap,
  setDayCompleted,
} from "../../lib/trainingCompletion";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
type DayKey = (typeof DAYS)[number];

type Availability = "training" | "game" | "rest" | null;

type TrainingDay = {
  title: string;
  focus: string;
  preview: string;
  drills: { name: string; description: string; reps?: string }[];
};

const STORAGE_KEY = "training_availability"; // { Mon: "game", Tue: "training", ... }
const EMOJIS = ["🎉", "🔥", "🏐", "💥", "⚡️", "⭐️", "🚀", "🥳"];

/* =========================================================
   ✅ LEGACY WEEKLY PROGRESS (DATE-BASED)
   ---------------------------------------------------------
   You had a date-key completion system here (weekly_progress_v1).
   That system DOES NOT match your Training tab logic, so the bar
   wouldn’t move.

   We keep these helpers here to avoid "trimming", but we do NOT
   use them anymore. Your authoritative completion is now:

     trainingCompletion.ts (week-keyed + dayKey keys)

========================================================= */

const WEEKLY_PROGRESS_KEY = "weekly_progress_v1"; // legacy
const WEEKLY_TARGET = 5; // legacy

function isoDateKey(d: Date = new Date()) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function startOfWeekMonday(date: Date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

async function readWeeklyProgressMap(): Promise<Record<string, boolean>> {
  try {
    const raw = await AsyncStorage.getItem(WEEKLY_PROGRESS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

async function writeWeeklyProgressMap(map: Record<string, boolean>) {
  try {
    await AsyncStorage.setItem(WEEKLY_PROGRESS_KEY, JSON.stringify(map));
  } catch {
    // ignore
  }
}

async function isDateCompleted(dateKey: string) {
  const map = await readWeeklyProgressMap();
  return !!map[dateKey];
}

async function markDateCompleted(dateKey: string) {
  const map = await readWeeklyProgressMap();
  map[dateKey] = true;
  await writeWeeklyProgressMap(map);
}

async function countCompletedThisWeek(now = new Date()) {
  const map = await readWeeklyProgressMap();
  const start = startOfWeekMonday(now);
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);

  let count = 0;
  for (const k of Object.keys(map)) {
    if (!map[k]) continue;
    const d = new Date(k);
    if (Number.isNaN(d.getTime())) continue;
    if (d >= start && d <= end) count += 1;
  }
  return count;
}

/* =========================================================
   Utils
========================================================= */

function getTodayKey(): DayKey {
  const d = new Date().getDay();
  const idx = d === 0 ? 6 : d - 1;
  return DAYS[idx];
}

function normalizeDayParam(input: unknown): DayKey {
  const raw = Array.isArray(input) ? input[0] : input;
  const s = String(raw ?? "").trim();

  if (!s) return getTodayKey();

  if ((DAYS as readonly string[]).includes(s)) return s as DayKey;

  const lower = s.toLowerCase();

  const mapShort: Record<string, DayKey> = {
    mon: "Mon",
    tue: "Tue",
    tues: "Tue",
    wed: "Wed",
    thu: "Thu",
    thur: "Thu",
    thurs: "Thu",
    fri: "Fri",
    sat: "Sat",
    sun: "Sun",
  };
  if (mapShort[lower]) return mapShort[lower];

  const mapFull: Record<string, DayKey> = {
    monday: "Mon",
    tuesday: "Tue",
    wednesday: "Wed",
    thursday: "Thu",
    friday: "Fri",
    saturday: "Sat",
    sunday: "Sun",
  };
  if (mapFull[lower]) return mapFull[lower];

  return getTodayKey();
}

function normalizeAvailability(value: any): Availability {
  const v = String(value ?? "").toLowerCase();
  if (v === "game") return "game";
  if (v === "training") return "training";
  if (v === "rest") return "rest";
  return null;
}

/* =========================================================
   ✅ FIX: Use generateTrainingDay(day) instead of static plan.
   We keep your UI exactly the same — only the plan source changes.
========================================================= */
function fallbackPlan(day: DayKey): TrainingDay {
  return {
    title: "Session",
    focus: "General",
    preview: `No session details found for ${day}.`,
    drills: [] as { name: string; description: string; reps?: string }[],
  };
}

/* =========================================================
   Screen
========================================================= */

export default function TrainingDayScreen() {
  const colors = useAppColors();
  const params = useLocalSearchParams<{ day?: string | string[] }>();

  const dayKey = useMemo<DayKey>(() => normalizeDayParam(params.day), [params.day]);

  const [availability, setAvailability] = useState<Availability>(null);
  const [ready, setReady] = useState(false);

  // ✅ Dynamic plan state
  const [plan, setPlan] = useState<TrainingDay>(() => fallbackPlan(dayKey));
  const [loadingPlan, setLoadingPlan] = useState(true);

  // ✅ Authoritative weekly completion (dayKey-based)
  const [weeklyDone, setWeeklyDone] = useState(0);
  const [weeklyTarget, setWeeklyTarget] = useState(0);
  const [completedToday, setCompletedToday] = useState(false);
  const [savingComplete, setSavingComplete] = useState(false);

  // ✅ We load the WHOLE availability map so weekly target is correct (solo days)
  const [availabilityMap, setAvailabilityMap] = useState<Record<string, any>>({});

  // 🎊 emoji burst
  const bursts = useRef(Array.from({ length: 10 }).map(() => new Animated.Value(0))).current;
  const spreadX = useRef(
    Array.from({ length: 10 }).map((_, i) => (i % 2 === 0 ? -1 : 1) * (26 + ((i * 11) % 44)))
  ).current;

  // subtle header entrance
  const headerIn = useRef(new Animated.Value(0)).current;

  /* -------------------------------
     Load availability (NO DEFAULTS)
  -------------------------------- */
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        const parsed = raw ? JSON.parse(raw) : {};

        if (!mounted) return;
        setAvailabilityMap(parsed);

        const val =
  parsed?.[dayKey] ??
  parsed?.[String(dayKey).toLowerCase()] ??
  parsed?.[String(dayKey).toUpperCase()] ??
  null;


        if (!mounted) return;
        setAvailability(normalizeAvailability(val));
      } catch {
        if (!mounted) return;
        setAvailabilityMap({});
        setAvailability(null);
      } finally {
        if (!mounted) return;
        setReady(true);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [dayKey]);

  /* -------------------------------
     ✅ Load DYNAMIC plan for this day
  -------------------------------- */
  useEffect(() => {
    let mounted = true;

    (async () => {
      setLoadingPlan(true);
      try {
        const generated = await generateTrainingDay(dayKey);
        if (!mounted) return;

        setPlan({
          title: String(generated?.title ?? "Session"),
          focus: String(generated?.focus ?? "General"),
          preview: String(generated?.preview ?? "Focus on quality today."),
          drills: Array.isArray(generated?.drills) ? generated.drills : [],
        });
      } catch {
        if (!mounted) return;
        setPlan(fallbackPlan(dayKey));
      } finally {
        if (!mounted) return;
        setLoadingPlan(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [dayKey]);

  /* -------------------------------
     Header animation
  -------------------------------- */
  useEffect(() => {
    headerIn.setValue(0);
    Animated.timing(headerIn, {
      toValue: 1,
      duration: 420,
      useNativeDriver: true,
    }).start();
  }, [dayKey]);

  /* -------------------------------
     Emoji burst (ONLY game day)
  -------------------------------- */
  useEffect(() => {
    if (!ready) return;

    bursts.forEach((a) => a.setValue(0));
    if (availability !== "game") return;

    bursts.forEach((anim, i) => {
      Animated.sequence([
        Animated.delay(i * 70),
        Animated.timing(anim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start();
    });
  }, [availability, ready, bursts]);

  /* -------------------------------
     ✅ Authoritative weekly progress + completion state
     - Uses trainingCompletion.ts (dayKey map)
     - Weekly target = number of SOLO days planned
       (days not marked game/training/rest; missing = solo)
  -------------------------------- */
  const refreshProgress = useCallback(async () => {
    const completionMap = await getWeekCompletionMap();

    // Completed state should be per selected dayKey
    setCompletedToday(!!completionMap[dayKey]);

    // Solo target counts days that are "solo" by plan (unset counts as solo)
    const soloDays = DAYS.filter((d) => {
      const raw = availabilityMap?.[d];
      const v = normalizeAvailability(raw);

      // if explicitly set to game/training/rest => not solo
      // if unset/null or "solo" => solo
      if (v === "game" || v === "training" || v === "rest") return false;
      return true;
    });

    const target = soloDays.length;
    const done = soloDays.reduce((sum, d) => sum + (completionMap[d] ? 1 : 0), 0);

    setWeeklyTarget(target);
    setWeeklyDone(done);
  }, [dayKey, availabilityMap]);

  useEffect(() => {
    refreshProgress();
  }, [refreshProgress]);

  useFocusEffect(
    useCallback(() => {
      refreshProgress();
      return () => {};
    }, [refreshProgress])
  );

  /* -------------------------------
     Day copy (single source of truth)
  -------------------------------- */
  const meta = useMemo(() => {
    if (availability === "game") {
      return {
        pill: { text: "GAME DAY", icon: "trophy-outline" as const },
        title: "🏐 Game Day",
        subtitle: "Show up confident and compete.",
        body: [
          "No extra training today — save energy for performance.",
          "After the game: hydrate, refuel, and recover well.",
        ],
        showPlan: false,
        allowComplete: false,
      };
    }

    if (availability === "training") {
      return {
        pill: { text: "CLUB TRAINING", icon: "people-outline" as const },
        title: "🏐 Club Training",
        subtitle: "Team session scheduled today.",
        body: [
          "Let club training be the main workload today.",
          "After training: recover well (mobility, hydration, sleep).",
        ],
        showPlan: false,
        allowComplete: false,
      };
    }

    if (availability === "rest") {
      return {
        pill: { text: "RECOVERY", icon: "leaf-outline" as const },
        title: "🧘 Recovery Day",
        subtitle: "Reset your body and mind.",
        body: [
          "Keep it light: walk, stretch, or easy touch if you want.",
          "Recover well today — consistency beats intensity.",
        ],
        showPlan: false,
        allowComplete: false,
      };
    }

    // Unset = Solo / AI plan day
    return {
      pill: { text: "SOLO SESSION", icon: "flash-outline" as const },
      title: `🔥 Solo Training`,
      subtitle: `${dayKey} · Focus: ${plan.focus}`,
      body: [plan.preview, "Move with intent: quality reps > rushing volume."],
      showPlan: true,
      allowComplete: true,
    };
  }, [availability, dayKey, plan.focus, plan.preview]);

  /* -------------------------------
     Progress bar derived (SOLO ONLY)
  -------------------------------- */
  const weeklyPct = useMemo(() => {
    if (weeklyTarget <= 0) return 0;
    return Math.max(0, Math.min(1, weeklyDone / weeklyTarget));
  }, [weeklyDone, weeklyTarget]);

  const weeklyWidth = useMemo(() => `${Math.round(weeklyPct * 100)}%`, [weeklyPct]);

  /* -------------------------------
     Complete session handler (dayKey-based)
  -------------------------------- */
  const onCompleteSession = useCallback(async () => {
    if (!meta.allowComplete) return;

    if (completedToday) {
      Alert.alert("Already completed", "You’ve already completed this day’s session.");
      return;
    }

    try {
      setSavingComplete(true);

      // ✅ This is the critical fix:
      // mark COMPLETION for the selected dayKey in the same week map the Training tab uses
      await setDayCompleted(dayKey, true);

      await refreshProgress();

      Alert.alert("Session completed ✅", "Great work. This counts toward your weekly progress.");
    } catch {
      Alert.alert("Couldn’t save", "Try again.");
    } finally {
      setSavingComplete(false);
    }
  }, [meta.allowComplete, completedToday, dayKey, refreshProgress]);

  /* -------------------------------
     Render helpers
  -------------------------------- */
  const headerTranslate = headerIn.interpolate({
    inputRange: [0, 1],
    outputRange: [10, 0],
  });

  const headerOpacity = headerIn.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const showWeeklyProgress = meta.allowComplete;

  return (
      <>
  <Stack.Screen
    options={{
      title: "Today's Session",
      headerShown: true,
      headerBackTitleVisible: false,
    }}
  />



    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: 160 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Top nav */}
      <View style={styles.topRow}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.iconBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
          activeOpacity={0.85}
        >
          <Ionicons name="chevron-back" size={18} color={colors.text} />
        </TouchableOpacity>

        <Text style={{ color: colors.muted, fontWeight: "800" }}>{dayKey}</Text>

        <TouchableOpacity
          onPress={() => router.replace("/training")}
          style={[styles.iconBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
          activeOpacity={0.85}
        >
          <Ionicons name="calendar-outline" size={18} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Emoji burst (game only) */}
      {availability === "game" && (
        <View style={styles.burstWrap} pointerEvents="none">
          {bursts.map((anim, i) => {
            const translateY = anim.interpolate({
              inputRange: [0, 1],
              outputRange: [10, -130],
            });
            const opacity = anim.interpolate({
              inputRange: [0, 0.2, 0.7, 1],
              outputRange: [0, 1, 1, 0],
            });
            const scale = anim.interpolate({
              inputRange: [0, 0.25, 1],
              outputRange: [0.85, 1.2, 1],
            });

            return (
              <Animated.Text
                key={i}
                style={{
                  position: "absolute",
                  fontSize: 34,
                  transform: [{ translateY }, { translateX: spreadX[i] }, { scale }],
                  opacity,
                }}
              >
                {EMOJIS[i % EMOJIS.length]}
              </Animated.Text>
            );
          })}
        </View>
      )}

      {/* Header card */}
      <Animated.View
        style={{
          transform: [{ translateY: headerTranslate }],
          opacity: headerOpacity,
        }}
      >
        <View style={[styles.heroCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.heroTop}>
            <View style={[styles.pill, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <Ionicons name={meta.pill.icon as any} size={14} color={colors.muted} />
              <Text style={{ color: colors.muted, fontWeight: "900", fontSize: 11, letterSpacing: 0.6 }}>
                {meta.pill.text}
              </Text>
            </View>

            {availability === null && (
              <View style={[styles.pill, { backgroundColor: colors.background, borderColor: colors.border }]}>
                <Ionicons name="sparkles-outline" size={14} color={colors.muted} />
                <Text style={{ color: colors.muted, fontWeight: "900", fontSize: 11, letterSpacing: 0.6 }}>
                  AI PLAN
                </Text>
              </View>
            )}

            {completedToday && meta.allowComplete && (
              <View style={[styles.pill, { backgroundColor: colors.background, borderColor: colors.border }]}>
                <Ionicons name="checkmark-circle-outline" size={14} color={"#22c55e"} />
                <Text style={{ color: "#22c55e", fontWeight: "900", fontSize: 11, letterSpacing: 0.6 }}>
                  COMPLETED
                </Text>
              </View>
            )}
          </View>

          <Text style={[styles.title, { color: colors.text }]}>{meta.title}</Text>
          <Text style={{ color: colors.muted, marginTop: 6, lineHeight: 20 }}>{meta.subtitle}</Text>

          <View style={{ marginTop: 14 }}>
            {meta.body.map((line, idx) => (
              <View key={idx} style={styles.bulletRow}>
                <Text style={{ color: colors.primary, fontWeight: "900" }}>•</Text>
                <Text style={{ color: colors.text, lineHeight: 22, flex: 1 }}>{line}</Text>
              </View>
            ))}
          </View>

          {/* ✅ Weekly progress (solo only) */}
          {showWeeklyProgress && (
            <>
              <View style={[styles.divider, { backgroundColor: colors.border }]} />
              <Text style={[styles.sectionLabel, { color: colors.muted, marginBottom: 8 }]}>
                WEEKLY PROGRESS
              </Text>

              <View style={[styles.progressTrack, { backgroundColor: colors.border }]}>
                <View style={[styles.progressFill, { width: weeklyWidth, backgroundColor: colors.primary }]} />
              </View>

              <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 8 }}>
                <Text style={{ color: colors.muted, fontWeight: "800" }}>
                  {weeklyDone} / {weeklyTarget} solo sessions
                </Text>
                <Text style={{ color: colors.muted }}>
                  {Math.round(weeklyPct * 100)}%
                </Text>
              </View>
            </>
          )}
        </View>
      </Animated.View>

      {/* Solo plan (only if availability unset) */}
      {meta.showPlan && (
        <>
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.sectionLabel, { color: colors.muted }]}>TODAY’S FOCUS</Text>

            <Text style={{ color: colors.text, fontSize: 18, fontWeight: "900" }}>
              {loadingPlan ? "Loading…" : plan.title}
            </Text>

            <Text style={{ color: colors.muted, marginTop: 6 }}>
              Focus · <Text style={{ color: colors.text, fontWeight: "900" }}>{plan.focus}</Text>
            </Text>

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            <Text style={{ color: colors.text, lineHeight: 22 }}>{plan.preview}</Text>
          </View>

          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.sectionLabel, { color: colors.muted }]}>DRILLS</Text>

            {Array.isArray(plan.drills) && plan.drills.length > 0 ? (
              plan.drills.map((d: any, i: number) => (
                <View key={`${d.name}-${i}`} style={styles.drill}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                    <View style={[styles.dot, { backgroundColor: colors.primary }]} />
                    <Text style={{ color: colors.text, fontWeight: "900", fontSize: 16, flex: 1 }}>
                      {d.name}
                    </Text>
                  </View>

                  <Text style={{ color: colors.muted, marginTop: 6, lineHeight: 20 }}>{d.description}</Text>

                  {!!d.reps && (
                    <View style={styles.repsRow}>
                      <Ionicons name="repeat-outline" size={14} color={colors.muted} />
                      <Text style={{ color: colors.text, fontWeight: "800" }}>{d.reps}</Text>
                    </View>
                  )}
                </View>
              ))
            ) : (
              <Text style={{ color: colors.muted, lineHeight: 22 }}>
                No drills listed for this day yet.
              </Text>
            )}
          </View>

          {/* ✅ Complete session button (solo only) */}
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.sectionLabel, { color: colors.muted }]}>SESSION</Text>

            <Text style={{ color: colors.text, lineHeight: 22 }}>
              When you finish today’s session, tap complete to track weekly progress.
            </Text>

            <TouchableOpacity
              onPress={onCompleteSession}
              disabled={savingComplete || completedToday}
              style={[
                styles.completeBtn,
                {
                  backgroundColor: completedToday ? "#22c55e" : colors.primary,
                  opacity: savingComplete ? 0.75 : 1,
                },
              ]}
              activeOpacity={0.9}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <Ionicons
                  name={completedToday ? "checkmark-circle-outline" : "checkmark-outline"}
                  size={18}
                  color={"#000"}
                />
                <Text style={styles.completeBtnText}>
                  {completedToday ? "Session Completed" : savingComplete ? "Saving..." : "Complete Session"}
                </Text>
              </View>
            </TouchableOpacity>

            {!completedToday && (
              <Text style={{ color: colors.muted, marginTop: 10, fontSize: 12, lineHeight: 18 }}>
                Tip: quality reps matter more than speed. Finish strong.
              </Text>
            )}
          </View>

          {/* Recovery footer */}
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.sectionLabel, { color: colors.muted }]}>RECOVER WELL</Text>
            <Text style={{ color: colors.text, lineHeight: 22 }}>
              Quick checklist: hydrate · light mobility · protein + carbs · sleep.
            </Text>
          </View>
        </>
      )}

      {/* If day is club/game/rest, show a simple recovery card */}
      {!meta.showPlan && (
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionLabel, { color: colors.muted }]}>RECOVERY</Text>
          <Text style={{ color: colors.text, lineHeight: 22 }}>
            {availability === "game"
              ? "After your match: refuel, stretch, and recover well."
              : availability === "training"
              ? "After training: mobility + hydration + good sleep."
              : "Keep it easy today. Recover well and reset for the week."}
          </Text>
        </View>
      )}

      {/* Debug safety (optional) */}
      <View style={{ marginTop: 6 }}>
        <Text style={{ color: colors.muted, fontSize: 11 }}>
          {`Availability: ${availability ?? "unset"} · Using plan key: ${dayKey}`}
        </Text>
      </View>
    </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },

  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  burstWrap: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 90,
    marginBottom: 10,
  },

  heroCard: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 6 },
      },
      android: {
        elevation: 2,
      },
    }),
  },

  heroTop: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 14,
    flexWrap: "wrap",
  },

  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
  },

  title: {
    fontSize: 26,
    fontWeight: "900",
  },

  bulletRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 8,
    alignItems: "flex-start",
  },

  card: {
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    marginBottom: 14,
  },

  sectionLabel: {
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0.8,
    marginBottom: 12,
  },

  divider: {
    height: 1,
    opacity: 0.8,
    marginVertical: 14,
    borderRadius: 999,
  },

  drill: {
    paddingVertical: 12,
    borderRadius: 14,
  },

  dot: {
    width: 10,
    height: 10,
    borderRadius: 999,
  },

  repsRow: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  progressTrack: {
    height: 8,
    borderRadius: 999,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    borderRadius: 999,
  },

  completeBtn: {
    marginTop: 14,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
  },

  completeBtnText: {
    color: "#000",
    fontWeight: "900",
    fontSize: 16,
  },
});
