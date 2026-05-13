import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Animated,
  Alert,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";

import { useAppColors } from "../../lib/useAppColors";
import { useEntitlements } from "../../lib/useEntitlements";
import { usePreviewMode } from "../../lib/usePreviewMode";
import { auth } from "../../lib/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DailyFocusCard from "../../components/DailyFocusCard";
import { trainingPreviewPlans } from "../../lib/trainingPreviewData";
import { generateTrainingDay } from "../../lib/generateTrainingDay";
import {
  getWeekCompletionMap,
  clearWeekCompletion,
  getWeeklyTrainingSummary,
} from "../../lib/trainingCompletion";

/* =====================================================
   TYPES + CONSTANTS
===================================================== */
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
type DayKey = (typeof DAYS)[number];
type Availability = "solo" | "training" | "game" | "rest";
type Plan = { title: string; focus: string; preview: string };

const SESSION_META: Record<
  Availability,
  {
    title:    string;
    subtitle: string;
    body:     string;
    badge:    string;
    emoji:    string;
    openable: boolean;
    accent:   "primary" | "muted";
  }
> = {
  solo: {
    title:    "Solo Session",
    subtitle: "AI-guided individual work",
    body:     "Focused technical work tailored from your recent analysis.",
    badge:    "SOLO",
    emoji:    "🎯",
    openable: true,
    accent:   "primary",
  },
  training: {
    title:    "Club Training",
    subtitle: "Team session scheduled",
    body:     "Club training today. Focus on execution and recover well after.",
    badge:    "CLUB",
    emoji:    "🏐",
    openable: false,
    accent:   "muted",
  },
  game: {
    title:    "Game Day",
    subtitle: "Competition day",
    body:     "Game day. Compete freely, trust your work, and recover well after.",
    badge:    "GAME",
    emoji:    "🔥",
    openable: false,
    accent:   "muted",
  },
  rest: {
    title:    "Recovery",
    subtitle: "Rest & reset",
    body:     "Rest day. Prioritise mobility, hydration, and sleep.",
    badge:    "REST",
    emoji:    "🧘‍♂️",
    openable: false,
    accent:   "muted",
  },
};

/* =====================================================
   HELPERS
===================================================== */
function getTodayIndex(): number {
  const js = new Date().getDay();
  return js === 0 ? 6 : js - 1;
}

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

function isValidPlan(p: any): p is Plan {
  return (
    p &&
    typeof p === "object" &&
    typeof p.title   === "string" &&
    typeof p.focus   === "string" &&
    typeof p.preview === "string"
  );
}

function normalizeAvailability(v: any): Availability {
  if (v === "solo")                           return "solo";
  if (v === "training" || v === "club")       return "training";
  if (v === "game"     || v === "gameDay")    return "game";
  if (v === "rest"     || v === "restDay")    return "rest";
  return "solo";
}

/* =====================================================
   SCREEN
===================================================== */
export default function TrainingScreen() {
  const colors      = useAppColors();
  const ent         = useEntitlements();
  const previewMode = usePreviewMode() as any;

  const canAccessTraining = ent.canAccessTraining;
  const isElite           = ent.isElite;
  const isPreview         = Boolean(previewMode?.isPreview);

  /* ─── State ─── */
  const todayIndex                          = useMemo(() => getTodayIndex(), []);
  const [selectedDay,    setSelectedDay]    = useState(todayIndex);
  const [refreshing,     setRefreshing]     = useState(false);
  const [completion,     setCompletion]     = useState<Record<string, boolean>>({});
  const [availabilityMap, setAvailabilityMap] = useState<Record<string, Availability>>({});
  const [aiPlans,        setAiPlans]        = useState<Partial<Record<DayKey, Plan>>>({});

  const dayKey: DayKey = DAYS[clamp(selectedDay, 0, 6)];

  /* ─── Refs ─── */
  const daysScrollRef = useRef<ScrollView>(null);
  const pillXRef      = useRef<Record<string, number>>({});

  /* ─── Reveal animation (once on mount) ─── */
  const reveal = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(reveal, {
      toValue:  1,
      duration: 420,
      useNativeDriver: true,
    }).start();
  }, []);

  /* ─── Load data ─── */
  const loadAvailability = useCallback(async () => {
    try {
      const uid = auth.currentUser?.uid;
      let raw: string | null = null;

      if (uid) raw = await AsyncStorage.getItem(`training_availability:${uid}`);
      if (!raw) raw = await AsyncStorage.getItem("training_availability");

      const parsed = raw ? JSON.parse(raw) : {};
      setAvailabilityMap(parsed);
      await getWeeklyTrainingSummary(parsed);
    } catch {
      setAvailabilityMap({});
    }
  }, []);

  const loadCompletion = useCallback(async () => {
    const map = await getWeekCompletionMap();
    setCompletion(map);
  }, []);

  const loadAIPlans = useCallback(async () => {
    const next: Partial<Record<DayKey, Plan>> = {};
    await Promise.all(
      DAYS.map(async (d) => {
        try {
          const plan = await generateTrainingDay(d);
          if (isValidPlan(plan)) next[d] = plan;
        } catch {}
      })
    );
    setAiPlans(next);
  }, []);

  // Initial load — run once
  useEffect(() => {
    loadAvailability();
    loadCompletion();
    loadAIPlans();
  }, []);

  // On focus — only reload fast data, not AI plans (those are slow)
  useFocusEffect(
    useCallback(() => {
      loadAvailability();
      loadCompletion();
    }, [loadAvailability, loadCompletion])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([loadAvailability(), loadCompletion(), loadAIPlans()]);
    setRefreshing(false);
  }, [loadAvailability, loadCompletion, loadAIPlans]);

  /* ─── Auto scroll to today ─── */
  useEffect(() => {
    const id = setTimeout(() => {
      const x = pillXRef.current[DAYS[todayIndex]] ?? todayIndex * 80;
      daysScrollRef.current?.scrollTo({ x: Math.max(0, x - 120), animated: true });
    }, 300);
    return () => clearTimeout(id);
  }, [todayIndex]);

  /* ─── Derived values ─── */
  const availability  = normalizeAvailability(availabilityMap?.[dayKey]);
  const sessionMeta   = SESSION_META[availability];
  const hasSetupWeek  = Object.keys(availabilityMap).length > 0;

  const soloDays = useMemo(
    () => DAYS.filter((d) => normalizeAvailability(availabilityMap?.[d]) === "solo"),
    [availabilityMap]
  );

  const soloCompleted = soloDays.filter((d) => completion?.[d]).length;
  const soloTarget    = soloDays.length;
  const soloPct       = soloTarget > 0 ? Math.round((soloCompleted / soloTarget) * 100) : 0;

  const isDayDone = useCallback(
    (d: DayKey) =>
      normalizeAvailability(availabilityMap?.[d]) === "solo" && Boolean(completion?.[d]),
    [availabilityMap, completion]
  );

  const plan: Plan = useMemo(() => {
    if (isPreview) {
      const p = trainingPreviewPlans?.[dayKey];
      return isValidPlan(p)
        ? p
        : {
            title:   "Preview Training Plan",
            focus:   "AI-driven development",
            preview: "This is preview content. Upgrade to unlock fully personalised sessions.",
          };
    }
    const real = aiPlans?.[dayKey];
    return isValidPlan(real)
      ? real
      : {
          title:   "Generating Session",
          focus:   "Personalizing",
          preview: "Building a session based on your latest performance data.",
        };
  }, [isPreview, dayKey, aiPlans]);

  const eliteInsight = useMemo(() => {
    if (!isElite || isPreview) return null;
    if (soloTarget >= 4 && soloPct < 50)
      return "Consistency dipped this week — shorten sessions and prioritize clean reps today.";
    if (soloPct >= 80 && soloTarget >= 3)
      return "Strong consistency lately — today is a good opportunity to push intensity.";
    if (soloCompleted === 0 && soloTarget > 0)
      return "Haven't logged a solo session yet — start light and build momentum.";
    return "Maintain rhythm today — don't chase volume, chase quality.";
  }, [isElite, isPreview, soloPct, soloTarget, soloCompleted]);

  /* ─── Reset week ─── */
  const onResetWeek = useCallback(() => {
    if (isPreview) {
      Alert.alert("Preview Mode", "Exit preview to manage your real training.");
      return;
    }
    Alert.alert(
      "Reset this week?",
      "This will clear completion checkmarks for the current week.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text:  "Reset",
          style: "destructive",
          onPress: async () => {
            await clearWeekCompletion();
            await loadCompletion();
          },
        },
      ]
    );
  }, [isPreview, loadCompletion]);

  /* ─── Progress bar animation ─── */
  const barAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(barAnim, {
      toValue:  soloPct / 100,
      duration: 700,
      useNativeDriver: false,
    }).start();
  }, [soloPct]);

  const barWidth = barAnim.interpolate({
    inputRange:  [0, 1],
    outputRange: ["0%", "100%"],
  });

  /* =====================================================
     LOADING / LOCK STATES
  ===================================================== */
  if (ent.loading) {
    return <View style={{ flex: 1, backgroundColor: colors.background }} />;
  }

  if (!canAccessTraining && !isPreview) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} />
        <View style={styles.lockWrap}>
          <Ionicons name="lock-closed" size={44} color="#fff" />
          <Text style={styles.lockTitle}>Training Locked</Text>
          <Text style={styles.lockBody}>
            Upgrade to Pro or Elite to unlock AI training plans and weekly structure.
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/upgrade")}
            activeOpacity={0.9}
            style={[styles.lockPrimary, { backgroundColor: colors.primary }]}
          >
            <Text style={styles.lockPrimaryText}>Upgrade Plan</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => previewMode?.enablePreview?.()}
            activeOpacity={0.9}
            style={styles.lockSecondary}
          >
            <Text style={styles.lockSecondaryText}>Preview Training</Text>
          </TouchableOpacity>
          <Text style={styles.lockFooter}>
            Preview shows preset content. Your real data stays locked until upgrade.
          </Text>
        </View>
      </View>
    );
  }

  /* =====================================================
     MAIN UI
  ===================================================== */
  const fadeStyle = {
    opacity:   reveal,
    transform: [{ translateY: reveal.interpolate({ inputRange: [0, 1], outputRange: [6, 0] }) }],
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: 22, paddingBottom: 180 }}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* ─── TOP BAR ─── */}
      <View style={styles.topBar}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          {isPreview && (
            <TouchableOpacity
              onPress={() => previewMode?.disablePreview?.()}
              activeOpacity={0.9}
              style={[styles.pill, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <Ionicons name="eye-off-outline" size={15} color={colors.text} />
              <Text style={{ color: colors.text, fontWeight: "900", fontSize: 12 }}>
                Exit Preview
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          onPress={onResetWeek}
          activeOpacity={0.85}
          style={[styles.iconBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          <Ionicons name="refresh" size={17} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* ─── HEADER ─── */}
      <Animated.View style={[{ marginBottom: 14 }, fadeStyle]}>
        <Text style={[styles.h1, { color: colors.text }]}>Training</Text>
        <Text style={{ color: colors.muted, marginTop: 4 }}>
          Weekly structure · clear focus · measurable consistency
        </Text>
        {isPreview && (
          <View
            style={[
              styles.banner,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Ionicons name="eye-outline" size={15} color={colors.muted} />
            <Text style={{ color: colors.muted, fontWeight: "800", flex: 1 }}>
              Preview mode — demo data, not your real training.
            </Text>
          </View>
        )}
      </Animated.View>

      <DailyFocusCard />

      {/* ─── WEEK OVERVIEW ─── */}
      <Animated.View style={fadeStyle}>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, marginTop: 16 }]}>
          <View style={styles.cardTopRow}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>This Week</Text>
            <View style={[styles.badge, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <Ionicons name="flame" size={13} color={colors.text} />
              <Text style={{ color: colors.text, fontWeight: "900", fontSize: 12 }}>
                Consistency
              </Text>
            </View>
          </View>

          {/* Stats row */}
          <View style={{ flexDirection: "row", gap: 10, marginTop: 14 }}>
            <View style={[styles.miniStat, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <Text style={[styles.miniStatValue, { color: colors.text }]}>
                {soloCompleted}/{soloTarget}
              </Text>
              <Text style={{ color: colors.muted, fontWeight: "800", fontSize: 11 }}>
                Sessions done
              </Text>
            </View>

            <View style={[styles.miniStat, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <Text style={[styles.miniStatValue, { color: colors.primary }]}>
                {soloPct}%
              </Text>
              <Text style={{ color: colors.muted, fontWeight: "800", fontSize: 11 }}>
                Completion
              </Text>
            </View>

            <View style={[styles.miniStat, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <Text style={[styles.miniStatValue, { color: colors.text }]}>
                {soloDays.length}
              </Text>
              <Text style={{ color: colors.muted, fontWeight: "800", fontSize: 11 }}>
                Solo days
              </Text>
            </View>
          </View>

          {/* Progress bar */}
          <View style={[styles.barTrack, { backgroundColor: colors.border, marginTop: 16 }]}>
            <Animated.View
              style={[styles.barFill, { width: barWidth, backgroundColor: colors.primary }]}
            />
          </View>

          <Text style={{ color: colors.muted, marginTop: 8, lineHeight: 18 }}>
            {soloPct >= 80
              ? "Excellent week — keep this standard."
              : soloPct >= 50
              ? "Good progress — stay consistent through the end of the week."
              : soloCompleted === 0
              ? "No solo sessions logged yet — start today."
              : "Keep building — consistency compounds over time."}
          </Text>
        </View>
      </Animated.View>

      {/* ─── ELITE INSIGHT ─── */}
      {eliteInsight && (
        <Animated.View style={fadeStyle}>
          <View
            style={[
              styles.eliteInsight,
              { borderColor: colors.primary + "55", marginTop: 0 },
            ]}
          >
            <Text style={[styles.eliteInsightLabel, { color: colors.primary }]}>
              ELITE INSIGHT
            </Text>
            <Text style={[styles.eliteInsightText, { color: colors.text }]}>
              {eliteInsight}
            </Text>
          </View>
        </Animated.View>
      )}

      {/* ─── SCHEDULE SETUP CARD ─── */}
      <Animated.View style={fadeStyle}>
        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border, marginTop: 14 },
          ]}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Ionicons name="calendar-outline" size={20} color={colors.primary} />
            <Text style={[styles.cardTitle, { color: colors.text }]}>Weekly Schedule</Text>
          </View>

          <Text style={{ color: colors.muted, marginTop: 6, lineHeight: 19 }}>
            {hasSetupWeek
              ? "Your week is set up. Tap to make changes."
              : "You haven't set up your week yet. Set which days are solo, club, game, or rest."}
          </Text>

          <TouchableOpacity
            onPress={() => {
              if (isPreview) {
                Alert.alert("Preview Mode", "Exit preview to edit your real weekly schedule.");
                return;
              }
              router.push("/training-setup");
            }}
            activeOpacity={0.9}
            style={[styles.primaryCta, { backgroundColor: colors.primary, marginTop: 14 }]}
          >
            <Text style={styles.primaryCtaText}>
              {hasSetupWeek ? "Edit Schedule" : "Set Up Week"}
            </Text>
            <Ionicons name="chevron-forward" size={18} color="#000" />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* ─── DAY SELECTOR ─── */}
      <Animated.View style={[{ marginTop: 20 }, fadeStyle]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Schedule</Text>
        <Text style={{ color: colors.muted, marginTop: 2, marginBottom: 12 }}>
          Tap a day to view its session
        </Text>

        <ScrollView
          ref={daysScrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 4 }}
        >
          {DAYS.map((day, i) => {
            const isActive  = i === selectedDay;
            const isToday   = i === todayIndex;
            const isDone    = isDayDone(day);
            const isPast    = i < todayIndex;
            const dayAvail  = normalizeAvailability(availabilityMap?.[day]);

            return (
              <TouchableOpacity
                key={day}
                onLayout={(e) => (pillXRef.current[day] = e.nativeEvent.layout.x)}
                onPress={() => setSelectedDay(i)}
                activeOpacity={0.88}
                style={[
                  styles.dayChip,
                  {
                    backgroundColor: isActive ? colors.primary : colors.card,
                    borderColor:     isActive ? colors.primary : isToday ? colors.primary + "66" : colors.border,
                    opacity:         isPast ? 0.55 : 1,
                  },
                ]}
              >
                <Text
                  style={{
                    color:      isActive ? "#000" : colors.text,
                    fontWeight: "900",
                    fontSize:   13,
                  }}
                >
                  {day}
                </Text>

                {/* Today indicator dot */}
                {isToday && !isActive && (
                  <View
                    style={[
                      styles.todayDot,
                      { backgroundColor: colors.primary },
                    ]}
                  />
                )}

                {/* Completion tick */}
                {isDone && (
                  <Ionicons
                    name="checkmark-circle"
                    size={14}
                    color={isActive ? "#000" : colors.primary}
                    style={{ marginLeft: 4 }}
                  />
                )}

                {/* Availability emoji — small, below the day name */}
                {!isActive && (
                  <Text style={{ fontSize: 10, marginTop: 2 }}>
                    {SESSION_META[dayAvail].emoji}
                  </Text>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Selected day availability strip */}
        <View
          style={[
            styles.availabilityStrip,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <View
              style={[
                styles.availBadge,
                {
                  backgroundColor:
                    sessionMeta.accent === "primary" ? colors.primary : colors.border,
                },
              ]}
            >
              <Text
                style={{
                  fontWeight: "900",
                  fontSize:   12,
                  color: sessionMeta.accent === "primary" ? "#000" : colors.muted,
                }}
              >
                {sessionMeta.badge}
              </Text>
            </View>
            <Text style={{ color: colors.text, fontWeight: "900" }}>
              {sessionMeta.emoji} {sessionMeta.title}
            </Text>
          </View>
          <Text style={{ color: colors.muted, fontWeight: "800" }}>
            {dayKey}{selectedDay === todayIndex ? " · Today" : ""}
          </Text>
        </View>
      </Animated.View>

      {/* ─── SESSION CARD ─── */}
      <Animated.View style={[{ marginTop: 20 }, fadeStyle]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          {selectedDay === todayIndex ? "Today's Session" : `${dayKey}'s Session`}
        </Text>
        <Text style={{ color: colors.muted, marginTop: 2, marginBottom: 12 }}>
          {sessionMeta.subtitle}
        </Text>

        <View style={[styles.sessionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sessionTitle, { color: colors.text }]}>
            {sessionMeta.emoji} {sessionMeta.title}
          </Text>

          <Text style={{ color: colors.muted, marginTop: 8, lineHeight: 20 }}>
            {availability === "solo" ? plan.preview : sessionMeta.body}
          </Text>

          {/* Focus pill — only for solo days with a real plan focus */}
          {availability === "solo" && plan.focus && plan.focus !== "Personalizing" && (
            <View
              style={[
                styles.focusPill,
                { backgroundColor: colors.background, borderColor: colors.border, marginTop: 14 },
              ]}
            >
              <Ionicons name="flash-outline" size={14} color={colors.primary} />
              <Text style={{ color: colors.text, fontWeight: "800", fontSize: 13 }}>
                Focus: {plan.focus}
              </Text>
            </View>
          )}

          {/* Meta row */}
          <View style={[styles.metaRow, { borderTopColor: colors.border }]}>
            <View style={[styles.metaPill, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <Ionicons name="bulb-outline" size={13} color={colors.muted} />
              <Text style={{ color: colors.muted, fontWeight: "900", fontSize: 12 }}>
                {availability === "solo" ? plan.title : sessionMeta.title}
              </Text>
            </View>

            <View style={[styles.metaPill, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <Ionicons name="sparkles-outline" size={13} color={colors.muted} />
              <Text style={{ color: colors.muted, fontWeight: "900", fontSize: 12 }}>
                {availability === "solo"
                  ? isPreview ? "Preview" : "Personalised"
                  : sessionMeta.badge}
              </Text>
            </View>
          </View>

          {/* CTA */}
          {sessionMeta.openable ? (
            <TouchableOpacity
              activeOpacity={0.9}
              style={[styles.primaryCta, { backgroundColor: colors.primary }]}
              onPress={() => {
                if (isPreview) {
                  Alert.alert("Preview Mode", "Upgrade to unlock interactive training sessions.");
                  return;
                }
                router.push({ pathname: "/training/day", params: { day: dayKey } });
              }}
            >
              <Text style={styles.primaryCtaText}>Open Session</Text>
              <Ionicons name="chevron-forward" size={18} color="#000" />
            </TouchableOpacity>
          ) : (
            <View
              style={[
                styles.mutedCta,
                { backgroundColor: colors.background, borderColor: colors.border },
              ]}
            >
              <Ionicons name="information-circle-outline" size={17} color={colors.muted} />
              <Text style={{ color: colors.muted, fontWeight: "800" }}>
                {availability === "training"
                  ? "Club day — follow your team plan."
                  : availability === "game"
                  ? "Game day — compete and recover well."
                  : "Recovery day — rest, hydrate, sleep."}
              </Text>
            </View>
          )}
        </View>
      </Animated.View>

      {/* ─── COACH NOTES ─── */}
      <Animated.View style={[{ marginTop: 20 }, fadeStyle]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Coach Notes</Text>
        <Text style={{ color: colors.muted, marginTop: 2, marginBottom: 12 }}>
          Small details that move the needle
        </Text>

        {[
          {
            title: "Warm-up Standard",
            body:  "5 minutes easy movement + 6–8 quality reps before intensity. Prime your nervous system, don't just sweat.",
            icon:  "flame-outline" as const,
          },
          {
            title: "Quality Over Volume",
            body:  "If your form drops, slow down. Clean reps build skill faster than sloppy grind sets.",
            icon:  "checkmark-circle-outline" as const,
          },
          {
            title: "Recovery Checklist",
            body:  "Hydrate, 20–30g protein post-session, minimum 7h sleep. Training adapts when you recover.",
            icon:  "moon-outline" as const,
          },
        ].map((tip) => (
          <View
            key={tip.title}
            style={[
              styles.tipCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <View
                style={[
                  styles.tipIcon,
                  { backgroundColor: colors.background, borderColor: colors.border },
                ]}
              >
                <Ionicons name={tip.icon} size={17} color={colors.muted} />
              </View>
              <Text style={{ color: colors.text, fontWeight: "900", fontSize: 15 }}>
                {tip.title}
              </Text>
            </View>
            <Text style={{ color: colors.muted, marginTop: 10, lineHeight: 20 }}>
              {tip.body}
            </Text>
          </View>
        ))}
      </Animated.View>
    </ScrollView>
  );
}

/* =====================================================
   STYLES
===================================================== */
const styles = StyleSheet.create({
  topBar: {
    marginTop:      Platform.select({ ios: 6, android: 10, default: 10 }),
    flexDirection:  "row",
    justifyContent: "space-between",
    alignItems:     "center",
    marginBottom:   10,
  },

  iconBtn: {
    width:          44,
    height:         44,
    borderRadius:   16,
    borderWidth:    1,
    alignItems:     "center",
    justifyContent: "center",
  },

  pill: {
    borderRadius:      999,
    borderWidth:       1,
    paddingVertical:   8,
    paddingHorizontal: 12,
    flexDirection:     "row",
    alignItems:        "center",
    gap:               7,
  },

  h1: {
    fontSize:      32,
    fontWeight:    "900",
    letterSpacing: 0.2,
  },

  banner: {
    marginTop:     10,
    borderWidth:   1,
    borderRadius:  14,
    padding:       12,
    flexDirection: "row",
    alignItems:    "center",
    gap:           10,
  },

  sectionTitle: {
    fontSize:   18,
    fontWeight: "900",
  },

  card: {
    borderWidth:  1,
    borderRadius: 20,
    padding:      18,
    marginBottom: 0,
  },

  cardTopRow: {
    flexDirection:  "row",
    justifyContent: "space-between",
    alignItems:     "center",
  },

  cardTitle: {
    fontSize:   16,
    fontWeight: "900",
  },

  badge: {
    borderWidth:       1,
    borderRadius:      999,
    paddingVertical:   6,
    paddingHorizontal: 10,
    flexDirection:     "row",
    alignItems:        "center",
    gap:               6,
  },

  miniStat: {
    flex:           1,
    borderWidth:    1,
    borderRadius:   16,
    padding:        12,
    alignItems:     "center",
  },

  miniStatValue: {
    fontSize:   22,
    fontWeight: "900",
  },

  barTrack: {
    height:       8,
    borderRadius: 999,
    overflow:     "hidden",
  },

  barFill: {
    height:       "100%",
    borderRadius: 999,
  },

  eliteInsight: {
    borderWidth:  1,
    borderRadius: 18,
    padding:      14,
    marginTop:    14,
  },

  eliteInsightLabel: {
    fontSize:      11,
    fontWeight:    "900",
    letterSpacing: 0.6,
    marginBottom:  6,
  },

  eliteInsightText: {
    fontSize:   14,
    fontWeight: "800",
    lineHeight: 20,
  },

  primaryCta: {
    borderRadius:      16,
    paddingVertical:   14,
    paddingHorizontal: 16,
    flexDirection:     "row",
    alignItems:        "center",
    justifyContent:    "space-between",
  },

  primaryCtaText: {
    fontSize:   16,
    fontWeight: "900",
    color:      "#000",
  },

  dayChip: {
    alignItems:        "center",
    paddingVertical:   10,
    paddingHorizontal: 14,
    borderRadius:      18,
    borderWidth:       1,
    marginRight:       10,
    minWidth:          52,
  },

  todayDot: {
    width:        5,
    height:       5,
    borderRadius: 999,
    marginTop:    3,
  },

  availabilityStrip: {
    borderRadius:   16,
    padding:        14,
    borderWidth:    1,
    marginTop:      12,
    flexDirection:  "row",
    justifyContent: "space-between",
    alignItems:     "center",
  },

  availBadge: {
    paddingVertical:   5,
    paddingHorizontal: 10,
    borderRadius:      999,
  },

  sessionCard: {
    borderRadius: 20,
    padding:      18,
    borderWidth:  1,
  },

  sessionTitle: {
    fontSize:   20,
    fontWeight: "900",
  },

  focusPill: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               8,
    borderWidth:       1,
    borderRadius:      12,
    paddingVertical:   9,
    paddingHorizontal: 12,
  },

  metaRow: {
    flexDirection: "row",
    gap:           10,
    marginTop:     14,
    paddingTop:    14,
    borderTopWidth: 1,
    flexWrap:      "wrap",
  },

  metaPill: {
    paddingVertical:   7,
    paddingHorizontal: 10,
    borderRadius:      999,
    borderWidth:       1,
    flexDirection:     "row",
    alignItems:        "center",
    gap:               7,
  },

  mutedCta: {
    marginTop:         14,
    borderRadius:      16,
    paddingVertical:   12,
    paddingHorizontal: 14,
    borderWidth:       1,
    flexDirection:     "row",
    alignItems:        "center",
    gap:               10,
  },

  tipCard: {
    borderRadius: 18,
    padding:      16,
    borderWidth:  1,
    marginBottom: 12,
  },

  tipIcon: {
    width:          40,
    height:         40,
    borderRadius:   14,
    borderWidth:    1,
    alignItems:     "center",
    justifyContent: "center",
  },

  /* Lock overlay */
  lockWrap: {
    flex:           1,
    justifyContent: "center",
    alignItems:     "center",
    padding:        26,
  },

  lockTitle: {
    color:      "#fff",
    fontSize:   24,
    fontWeight: "900",
    marginTop:  14,
    textAlign:  "center",
  },

  lockBody: {
    color:        "#ccc",
    marginTop:    10,
    marginBottom: 22,
    textAlign:    "center",
    lineHeight:   20,
    maxWidth:     320,
  },

  lockPrimary: {
    paddingVertical:   14,
    paddingHorizontal: 32,
    borderRadius:      16,
    width:             "100%",
    alignItems:        "center",
  },

  lockPrimaryText: {
    fontWeight: "900",
    fontSize:   16,
    color:      "#000",
  },

  lockSecondary: {
    marginTop:         14,
    borderWidth:       1,
    borderColor:       "#fff",
    paddingVertical:   12,
    paddingHorizontal: 28,
    borderRadius:      16,
    width:             "100%",
    alignItems:        "center",
  },

  lockSecondaryText: {
    color:      "#fff",
    fontWeight: "900",
    fontSize:   15,
  },

  lockFooter: {
    color:      "#9b9b9b",
    fontSize:   12,
    textAlign:  "center",
    lineHeight: 18,
    marginTop:  14,
    maxWidth:   300,
  },
});