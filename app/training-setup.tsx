import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Animated,
  Easing,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useAppColors } from "../lib/useAppColors";
import { Stack } from "expo-router";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
type Day = (typeof DAYS)[number];
type Availability = "solo" | "training" | "game" | "rest";

type TrainingProfileV2 = {
  availability: Record<Day, Availability>;
  minutesPerSession: number;
  focusSkills: Array<"passing" | "setting">;
  updatedAt: string;
};

const TYPE_META: Record<
  Availability,
  {
    label: string;
    icon: any;
    description: string;
    badge: string;
  }
> = {
  solo: {
    label: "Solo",
    icon: "flash-outline",
    description: "AI-guided individual work",
    badge: "SOLO",
  },
  training: {
    label: "Club",
    icon: "people-outline",
    description: "Team training day",
    badge: "CLUB",
  },
  game: {
    label: "Game",
    icon: "trophy-outline",
    description: "Competition day",
    badge: "GAME",
  },
  rest: {
    label: "Rest",
    icon: "moon-outline",
    description: "Recovery & reset",
    badge: "REST",
  },
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function normalizeAvailability(v: any): Availability {
  if (v === "solo") return "solo";
  if (v === "training" || v === "club") return "training";
  if (v === "game" || v === "gameDay") return "game";
  if (v === "rest" || v === "restDay") return "rest";
  return "rest";
}

function makeDefaultAvailability(): Record<Day, Availability> {
  return {
    Mon: "rest",
    Tue: "rest",
    Wed: "rest",
    Thu: "rest",
    Fri: "rest",
    Sat: "rest",
    Sun: "rest",
  };
}

/* =========================================================
   TRAINING SETUP (STRAVA-LEVEL)
========================================================= */
export default function TrainingSetup() {
  const colors = useAppColors();

  // core state
  const [availability, setAvailability] = useState<Record<Day, Availability>>(
    makeDefaultAvailability()
  );

  // advanced knobs (ready for future)
  const [minutesPerSession, setMinutesPerSession] = useState<number>(45);
  const [focusSkills, setFocusSkills] = useState<Array<"passing" | "setting">>([
    "passing",
    "setting",
  ]);

  // interaction state
  const [selectedDay, setSelectedDay] = useState<Day>("Mon");
  const [selectedType, setSelectedType] = useState<Availability>("solo");

  // subtle entrance motion
  const fadeIn = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeIn, {
        toValue: 1,
        duration: 420,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(slideUp, {
        toValue: 0,
        duration: 420,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  /* ===============================
     LOAD
  ================================ */
  useEffect(() => {
    (async () => {
      // Prefer v2 profile, fallback to old keys if needed
      try {
        const rawV2 = await AsyncStorage.getItem("training_profile_v2");
        if (rawV2) {
          const parsed: TrainingProfileV2 = JSON.parse(rawV2);
          const nextAvail = parsed?.availability ?? makeDefaultAvailability();

          // Normalize in case old values exist
          const normalized: Record<Day, Availability> = {} as any;
          for (const d of DAYS) normalized[d] = normalizeAvailability(nextAvail[d]);
          setAvailability(normalized);

          setMinutesPerSession(parsed?.minutesPerSession ?? 45);
          setFocusSkills(parsed?.focusSkills ?? ["passing", "setting"]);
          // Pick a sensible starting selection
          setSelectedDay("Mon");
          setSelectedType(normalizeAvailability(normalized["Mon"] ?? "solo"));
          return;
        }
      } catch {}

      // fallback: if someone saved training_availability only
      try {
        const raw = await AsyncStorage.getItem("training_availability");
        if (raw) {
          const parsed = JSON.parse(raw) ?? {};
          const normalized: Record<Day, Availability> = makeDefaultAvailability();
          for (const d of DAYS) normalized[d] = normalizeAvailability(parsed?.[d]);
          setAvailability(normalized);
          setSelectedType(normalizeAvailability(normalized["Mon"] ?? "solo"));
        }
      } catch {}
    })();
  }, []);

  /* ===============================
     DERIVED
  ================================ */
  const counts = useMemo(() => {
    const c = { solo: 0, training: 0, game: 0, rest: 0 };
    for (const d of DAYS) {
      const v = availability[d] ?? "rest";
      c[v]++;
    }
    return c;
  }, [availability]);

  const hasAtLeastOneTrainingDay = useMemo(() => {
    return counts.solo + counts.training + counts.game > 0;
  }, [counts]);

  const weeklyLabel = useMemo(() => {
    const totalWork = counts.solo + counts.training + counts.game;
    if (totalWork === 0) return "No training selected";
    if (totalWork <= 2) return "Light week";
    if (totalWork <= 4) return "Balanced week";
    return "High volume week";
  }, [counts]);

  const selectedDayType = availability[selectedDay] ?? "rest";

  /* ===============================
     ACTIONS
  ================================ */
  const applyTypeToSelectedDay = useCallback((type: Availability) => {
    setAvailability((prev) => ({ ...prev, [selectedDay]: type }));
  }, [selectedDay]);

  const onPickType = useCallback((type: Availability) => {
    setSelectedType(type);
    applyTypeToSelectedDay(type);
  }, [applyTypeToSelectedDay]);

  const onPickDay = useCallback((day: Day) => {
    setSelectedDay(day);
    setSelectedType(availability[day] ?? "rest");
  }, [availability]);

  const toggleSkill = useCallback((skill: "passing" | "setting") => {
    setFocusSkills((prev) => {
      const has = prev.includes(skill);
      if (has && prev.length === 1) return prev;
      return has ? prev.filter((s) => s !== skill) : [...prev, skill];
    });
  }, []);

  const save = useCallback(async () => {
    if (!hasAtLeastOneTrainingDay) {
      Alert.alert(
        "Add at least one training day",
        "Pick at least one Solo, Club, or Game day so the AI can generate your week."
      );
      return;
    }

    const payload: TrainingProfileV2 = {
      availability,
      minutesPerSession,
      focusSkills,
      updatedAt: new Date().toISOString(),
    };

    await AsyncStorage.multiSet([
      ["training_profile_v2", JSON.stringify(payload)],
      // ✅ training screen reads this
      ["training_availability", JSON.stringify(availability)],
    ]);

    router.replace("/training");
  }, [availability, minutesPerSession, focusSkills, hasAtLeastOneTrainingDay]);

  /* ===============================
     UI
  ================================ */
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Subtle top glow (Strava-ish) */}
      <View
        pointerEvents="none"
        style={[
          styles.topGlow,
          {
            backgroundColor: colors.primary,
            opacity: 0.08,
          },
        ]}
      />

      <Animated.ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20, paddingBottom: 140 }}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
      >
        <Animated.View
          style={{
            opacity: fadeIn,
            transform: [{ translateY: slideUp }],
          }}
        >
          {/* Header */}
          <View style={styles.headerRow}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => router.back()}
              style={[styles.backBtn, { borderColor: colors.border, backgroundColor: colors.card }]}
            >
              <Ionicons name="chevron-back" size={18} color={colors.text} />
            </TouchableOpacity>

            <View style={{ flex: 1 }}>
              <Text style={[styles.h1, { color: colors.text }]}>Availability</Text>
              <Text style={[styles.sub, { color: colors.muted }]}>
                Build a real week. The AI adapts your sessions automatically.
              </Text>
            </View>
          </View>

          {/* Hero summary */}
          <View style={[styles.hero, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
              <View style={{ flex: 1 }}>
                <Text style={{ color: colors.muted, fontWeight: "900", letterSpacing: 0.8, fontSize: 12 }}>
                  THIS WEEK
                </Text>

                <Text style={{ color: colors.text, fontWeight: "900", fontSize: 20, marginTop: 6 }}>
                  {weeklyLabel}
                </Text>

                <Text style={{ color: colors.muted, marginTop: 6, lineHeight: 18 }}>
                  Solo sessions become AI plans. Club & Game days adjust your load and recovery.
                </Text>
              </View>

              <View style={[styles.pillStat, { backgroundColor: colors.background, borderColor: colors.border }]}>
                <Ionicons name="calendar-outline" size={16} color={colors.muted} />
                <Text style={{ color: colors.text, fontWeight: "900" }}>
                  {counts.solo + counts.training + counts.game}/7
                </Text>
              </View>
            </View>

            {/* Breakdown chips */}
            <View style={{ flexDirection: "row", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
              <MiniChip label={`Solo ${counts.solo}`} icon="flash-outline" colors={colors} />
              <MiniChip label={`Club ${counts.training}`} icon="people-outline" colors={colors} />
              <MiniChip label={`Game ${counts.game}`} icon="trophy-outline" colors={colors} />
              <MiniChip label={`Rest ${counts.rest}`} icon="moon-outline" colors={colors} />
            </View>
          </View>

          {/* Week designer */}
          <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <SectionHeader
              title="Week Designer"
              subtitle="Tap a day, then assign its type. Fast & clean."
              icon="sparkles-outline"
              colors={colors}
            />

            {/* Day Row */}
            <View style={{ marginTop: 12 }}>
              <View style={styles.daysRow}>
                {DAYS.map((d) => {
                  const active = d === selectedDay;
                  const type = availability[d] ?? "rest";

                  return (
                    <DayPill
                      key={d}
                      day={d}
                      type={type}
                      active={active}
                      colors={colors}
                      onPress={() => onPickDay(d)}
                    />
                  );
                })}
              </View>

              {/* Selected day detail */}
              <View
                style={[
                  styles.selectedDayCard,
                  { borderColor: colors.border, backgroundColor: colors.background },
                ]}
              >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                  <View style={[styles.badge, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <Text style={{ color: colors.text, fontWeight: "900" }}>{selectedDay}</Text>
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={{ color: colors.text, fontWeight: "900", fontSize: 16 }}>
                      {TYPE_META[selectedDayType].badge} • {TYPE_META[selectedDayType].description}
                    </Text>
                    <Text style={{ color: colors.muted, marginTop: 3 }}>
                      Choose the type below to set {selectedDay}.
                    </Text>
                  </View>

                  <Ionicons name={TYPE_META[selectedDayType].icon} size={18} color={colors.muted} />
                </View>

                {/* Type selector */}
                <View style={{ marginTop: 12 }}>
                  <TypeSelector
                    selected={selectedType}
                    onPick={onPickType}
                    colors={colors}
                  />
                </View>
              </View>
            </View>
          </View>

          {/* Solo settings */}
          <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <SectionHeader
              title="Solo Session Settings"
              subtitle="Tight sessions. Clean reps. High signal."
              icon="flash-outline"
              colors={colors}
            />

            {/* Minutes */}
            <View style={[styles.inlineCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <Text style={{ color: colors.muted, fontWeight: "900", letterSpacing: 0.8, fontSize: 12 }}>
                SESSION LENGTH
              </Text>

              <View style={{ flexDirection: "row", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
                {[30, 45, 60, 75].map((m) => (
                  <SelectPill
                    key={m}
                    label={`${m}m`}
                    selected={minutesPerSession === m}
                    onPress={() => setMinutesPerSession(m)}
                    colors={colors}
                  />
                ))}
              </View>

              <Text style={{ color: colors.muted, marginTop: 10 }}>
                Recommendation: {counts.solo >= 4 ? "30–45m" : "45–60m"} for best weekly consistency.
              </Text>
            </View>

            {/* Skills */}
            <View style={[styles.inlineCard, { backgroundColor: colors.background, borderColor: colors.border, marginTop: 12 }]}>
              <Text style={{ color: colors.muted, fontWeight: "900", letterSpacing: 0.8, fontSize: 12 }}>
                FOCUS SKILLS
              </Text>

              <View style={{ flexDirection: "row", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
                <SelectPill
                  label="Passing"
                  selected={focusSkills.includes("passing")}
                  onPress={() => toggleSkill("passing")}
                  colors={colors}
                />
                <SelectPill
                  label="Setting"
                  selected={focusSkills.includes("setting")}
                  onPress={() => toggleSkill("setting")}
                  colors={colors}
                />
              </View>

              <Text style={{ color: colors.muted, marginTop: 10 }}>
                The AI will bias your Solo sessions toward selected skills.
              </Text>
            </View>
          </View>

          {/* AI promise card */}
          <View style={[styles.aiCard, { borderColor: colors.border }]}>
            <BlurView
              intensity={Platform.OS === "ios" ? 25 : 12}
              tint="dark"
              style={StyleSheet.absoluteFill}
            />
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <View style={[styles.aiIcon, { backgroundColor: colors.primary }]}>
                <Ionicons name="sparkles" size={16} color="#000" />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={{ color: "#fff", fontWeight: "900" }}>
                  Your plan will auto-adjust
                </Text>
                <Text style={{ color: "#cfcfcf", marginTop: 3, lineHeight: 18 }}>
                  Missed days? Volume shifts. Club heavy? Solo intensity drops. Game week? Recovery increases.
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>
      </Animated.ScrollView>

      {/* Sticky bottom CTA */}
      <View style={[styles.bottomBar, { borderTopColor: colors.border }]}>
        <View style={{ flex: 1 }}>
          <Text style={{ color: colors.text, fontWeight: "900" }}>
            {hasAtLeastOneTrainingDay ? "Ready to generate" : "Pick at least 1 training day"}
          </Text>
          <Text style={{ color: colors.muted, marginTop: 2 }}>
            {hasAtLeastOneTrainingDay
              ? `Solo: ${counts.solo} • Club: ${counts.training} • Game: ${counts.game}`
              : "Set Solo / Club / Game on the week designer"}
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.9}
          onPress={save}
          style={[
            styles.cta,
            {
              backgroundColor: hasAtLeastOneTrainingDay ? colors.primary : colors.border,
            },
          ]}
          disabled={!hasAtLeastOneTrainingDay}
        >
          <Ionicons name="sparkles-outline" size={18} color="#000" />
          <Text style={styles.ctaText}>Generate</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* =========================================================
   COMPONENTS
========================================================= */

function SectionHeader({
  title,
  subtitle,
  icon,
  colors,
}: {
  title: string;
  subtitle: string;
  icon: any;
  colors: any;
}) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
      <View style={[styles.sectionIcon, { backgroundColor: colors.background, borderColor: colors.border }]}>
        <Ionicons name={icon} size={18} color={colors.muted} />
      </View>

      <View style={{ flex: 1 }}>
        <Text style={{ color: colors.text, fontSize: 18, fontWeight: "900" }}>{title}</Text>
        <Text style={{ color: colors.muted, marginTop: 3 }}>{subtitle}</Text>
      </View>
    </View>
  );
}

function MiniChip({ label, icon, colors }: { label: string; icon: any; colors: any }) {
  return (
    <View style={[styles.miniChip, { backgroundColor: colors.background, borderColor: colors.border }]}>
      <Ionicons name={icon} size={14} color={colors.muted} />
      <Text style={{ color: colors.text, fontWeight: "900", fontSize: 12 }}>{label}</Text>
    </View>
  );
}

function SelectPill({
  label,
  selected,
  onPress,
  colors,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  colors: any;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={[
        styles.selectPill,
        {
          backgroundColor: selected ? colors.primary : "transparent",
          borderColor: selected ? colors.primary : colors.border,
        },
      ]}
    >
      <Text style={{ color: selected ? "#000" : colors.text, fontWeight: "900" }}>{label}</Text>
    </TouchableOpacity>
  );
}

function DayPill({
  day,
  type,
  active,
  onPress,
  colors,
}: {
  day: Day;
  type: Availability;
  active: boolean;
  onPress: () => void;
  colors: any;
}) {
  const meta = TYPE_META[type];

  const accent = useMemo(() => {
    if (type === "solo") return colors.primary;
    if (type === "training") return "#4ade80";
    if (type === "game") return "#f97316";
    return colors.border;
  }, [type, colors.primary, colors.border]);

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={[
        styles.dayPill,
        {
          backgroundColor: active ? colors.card : "transparent",
          borderColor: active ? colors.primary : colors.border,
        },
      ]}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <View style={[styles.dot, { backgroundColor: accent }]} />
        <Text style={{ color: colors.text, fontWeight: "900" }}>{day}</Text>
      </View>

      <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 6 }}>
        <Ionicons name={meta.icon} size={14} color={colors.muted} />
        <Text style={{ color: colors.muted, fontWeight: "900", fontSize: 12 }}>
          {meta.badge}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

function TypeSelector({
  selected,
  onPick,
  colors,
}: {
  selected: Availability;
  onPick: (t: Availability) => void;
  colors: any;
}) {
  const items: Availability[] = ["solo", "training", "game", "rest"];

  return (
    <View style={[styles.typeSelector, { backgroundColor: colors.card, borderColor: colors.border }]}>
      {items.map((t) => {
        const meta = TYPE_META[t];
        const active = selected === t;

        const accent =
          t === "solo" ? colors.primary :
          t === "training" ? "#4ade80" :
          t === "game" ? "#f97316" :
          colors.border;

        return (
          <TouchableOpacity
            key={t}
            activeOpacity={0.9}
            onPress={() => onPick(t)}
            style={[
              styles.typeBtn,
              {
                backgroundColor: active ? accent : "transparent",
                borderColor: active ? accent : "transparent",
              },
            ]}
          >
            <Ionicons name={meta.icon} size={16} color={active ? "#000" : colors.muted} />
            <Text style={{ color: active ? "#000" : colors.text, fontWeight: "900" }}>
              {meta.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

/* =========================================================
   STYLES
========================================================= */

const styles = StyleSheet.create({
  topGlow: {
    position: "absolute",
    top: -120,
    left: -60,
    right: -60,
    height: 220,
    borderBottomLeftRadius: 200,
    borderBottomRightRadius: 200,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: Platform.select({ ios: 8, android: 6, default: 8 }),
    marginBottom: 14,
  },

  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  h1: {
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: 0.2,
  },

  sub: {
    marginTop: 4,
    lineHeight: 18,
  },

  hero: {
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
  },

  pillStat: {
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  miniChip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  sectionCard: {
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    marginTop: 14,
  },

  sectionIcon: {
    width: 40,
    height: 40,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  daysRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  dayPill: {
    width: "31%",
    minWidth: 96,
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
  },

  dot: {
    width: 10,
    height: 10,
    borderRadius: 999,
  },

  selectedDayCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    marginTop: 14,
  },

  badge: {
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },

  typeSelector: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 8,
    flexDirection: "row",
    gap: 8,
  },

  typeBtn: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
  },

  inlineCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    marginTop: 12,
  },

  selectPill: {
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },

  aiCard: {
    marginTop: 14,
    borderRadius: 22,
    overflow: "hidden",
    borderWidth: 1,
    padding: 16,
    backgroundColor: "#111",
  },

  aiIcon: {
    width: 36,
    height: 36,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  bottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.select({ ios: 28, android: 16, default: 16 }),
    borderTopWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "rgba(0,0,0,0.75)",
  },

  cta: {
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  ctaText: {
    fontWeight: "900",
    color: "#000",
    fontSize: 16,
  },
});
