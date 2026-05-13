import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  SectionList,
  Alert,
  Animated,
  Easing,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, Stack, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";

import { useAppColors } from "../../lib/useAppColors";
import { getHistoryKey } from "../../lib/userStorage";
import { useEntitlements } from "../../lib/useEntitlements";

type HistoryItem = {
  id?: string;

  skill: string;
  quality: "good" | "situational" | "bad" | string;
  skill_confidence: number; // 0..1
  quality_confidence: number; // 0..1
  primary_fix?: string;
  created_at: string;

  // optional full payload for “exact same results later”
  result_payload?: any;

  // optional extras (safe)
  elite_score?: number;
  eliteScore?: number;
};

const SKILL_ORDER = ["passing", "setting", "attacking", "serving", "blocking"] as const;

/* =========================================================
   HELPERS
========================================================= */

function clamp01(n: any) {
  const x = Number.isFinite(Number(n)) ? Number(n) : 0;
  return Math.max(0, Math.min(1, x));
}

function pct(n01: any) {
  return Math.round(clamp01(n01) * 100);
}

function safeNum(n: any, fallback = 0) {
  const x = Number(n);
  return Number.isFinite(x) ? x : fallback;
}

function toLocalDayKey(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatHeaderDay(date: Date) {
  return date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function formatTime(date: Date) {
  return date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

function qualityMeta(q: string) {
  const key = String(q ?? "").toLowerCase();
  if (key === "good") {
    return { label: "GOOD", icon: "checkmark-circle" as const, tone: "good" as const };
  }
  if (key === "situational") {
    return { label: "SITUATIONAL", icon: "alert-circle" as const, tone: "mid" as const };
  }
  return { label: "NEEDS WORK", icon: "close-circle" as const, tone: "bad" as const };
}

type PlanTier = "free" | "pro" | "elite";
function resolveTier(ent: any): PlanTier {
  const isElite = !!ent?.isElite;
  const isPro = !!ent?.isPro;
  if (isElite) return "elite";
  if (isPro) return "pro";
  return "free";
}

function stableItemId(h: HistoryItem, idx: number) {
  const base = `${String(h.created_at ?? "")}_${String(h.skill ?? "")}_${idx}`;
  return base.replace(/\s+/g, "_");
}

function safeDateFromISO(iso: string) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d;
}

function extracteliteScore(h: HistoryItem): number | null {
  const n = safeNum((h as any).eliteScore ?? (h as any).elite_score, NaN);
  if (!Number.isFinite(n)) return null;
  const v = Math.round(n);
  return Math.max(0, Math.min(100, v));
}

/* =========================================================
   ANIMATED NUMBER HOOK
========================================================= */

function useAnimatedNumber(target: number, duration = 650) {
  const v = useRef(new Animated.Value(0)).current;
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const id = v.addListener(({ value }) => setDisplay(Math.round(value)));

    Animated.timing(v, {
      toValue: Number.isFinite(target) ? target : 0,
      duration,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();

    return () => {
      v.removeListener(id);
    };
  }, [target, duration, v]);

  return display;
}

/* =========================================================
   INSIGHTS ENGINE
========================================================= */

type MLInsights = {
  total: number;
  last14Count: number;
  avg14: number;
  streak: number;

  good: number;
  situational: number;
  bad: number;

  consistencyScore: number; // 0..100 (unique days in last 14)
  bestTimeWindow: string; // “6 PM – 8 PM”
  sessionsPerWeek: number;
  trend14: number; // -100..100

  eliteAvg: number; // average elite score last 14 (if available)
  eliteSamples14: number;

  stabilityIndex: number; // 0..100 variance based
  plateauRisk: "low" | "medium" | "high";
  anomalyCount14: number;
  momentum: number; // 0..100

  skillMix: { skill: string; count: number }[];
};

function computeInsights(itemsNewestFirst: HistoryItem[]): MLInsights {
  const now = new Date();
  const nowMs = now.getTime();
  const dayMs = 24 * 60 * 60 * 1000;

  const cutoff14 = nowMs - 14 * dayMs;
  const cutoff7 = nowMs - 7 * dayMs;

  const safeCreated = (h: HistoryItem) => safeDateFromISO(h.created_at);

  const total = itemsNewestFirst.length;

  const last14 = itemsNewestFirst.filter((h) => {
    const d = safeCreated(h);
    return d ? d.getTime() >= cutoff14 : false;
  });

  const last7 = itemsNewestFirst.filter((h) => {
    const d = safeCreated(h);
    return d ? d.getTime() >= cutoff7 : false;
  });

  // streak: consecutive local days with >=1 analysis (across ALL items, not just last14)
  const daySet = new Set<string>();
  itemsNewestFirst.forEach((h) => {
    const d = safeCreated(h);
    if (!d) return;
    daySet.add(toLocalDayKey(d));
  });

  let streak = 0;
  for (let i = 0; i < 365; i++) {
    const d = new Date(nowMs - i * dayMs);
    const key = toLocalDayKey(d);
    if (daySet.has(key)) streak++;
    else break;
  }

  // quality breakdown
  let good = 0,
    situational = 0,
    bad = 0;
  itemsNewestFirst.forEach((h) => {
    const q = String(h.quality ?? "").toLowerCase();
    if (q === "good") good++;
    else if (q === "situational") situational++;
    else bad++;
  });

  const avg14 = last14.length
    ? Math.round(
        (last14.reduce((s, h) => s + clamp01(h.skill_confidence), 0) / last14.length) * 100
      )
    : 0;

  // skill mix
  const counts: Record<string, number> = {};
  itemsNewestFirst.forEach((h) => {
    const s = String(h.skill ?? "").toLowerCase().trim();
    if (!s) return;
    counts[s] = (counts[s] || 0) + 1;
  });
  const skillMix = Object.keys(counts)
    .map((k) => ({ skill: k, count: counts[k] || 0 }))
    .sort((a, b) => (b.count || 0) - (a.count || 0))
    .slice(0, 6);

  // sessions/week
  const sessionsPerWeek = last7.length;

  // best time window (most frequent hour in last14)
  const hourBuckets: Record<number, number> = {};
  last14.forEach((h) => {
    const d = safeCreated(h);
    if (!d) return;
    const hr = d.getHours();
    hourBuckets[hr] = (hourBuckets[hr] || 0) + 1;
  });

  const bestHour =
    Object.keys(hourBuckets).length > 0
      ? Number(
          Object.keys(hourBuckets).sort(
            (a, b) => (hourBuckets[Number(b)] || 0) - (hourBuckets[Number(a)] || 0)
          )[0]
        )
      : null;

  const formatHr = (h: number) => {
    const hr = ((h % 24) + 24) % 24;
    const hr12 = hr % 12 === 0 ? 12 : hr % 12;
    const suffix = hr < 12 ? "AM" : "PM";
    return `${hr12} ${suffix}`;
  };

  const bestTimeWindow =
    bestHour === null ? "—" : `${formatHr(bestHour)} – ${formatHr(bestHour + 2)}`;

  // trend14: compare first half vs second half (chronological)
  const last14Chrono = [...last14].sort((a, b) => {
    const ta = safeCreated(a)?.getTime() ?? 0;
    const tb = safeCreated(b)?.getTime() ?? 0;
    return ta - tb;
  });

  const mid = Math.floor(last14Chrono.length / 2);
  const aPart = last14Chrono.slice(0, Math.max(1, mid));
  const bPart = last14Chrono.slice(Math.max(1, mid));

  const avgA = aPart.length ? aPart.reduce((s, h) => s + clamp01(h.skill_confidence), 0) / aPart.length : 0;
  const avgB = bPart.length ? bPart.reduce((s, h) => s + clamp01(h.skill_confidence), 0) / bPart.length : 0;
  const trend14 = Math.round((avgB - avgA) * 100);

  // consistencyScore: unique days in last14
  const uniqueDays14 = new Set<string>();
  last14.forEach((h) => {
    const d = safeCreated(h);
    if (!d) return;
    uniqueDays14.add(toLocalDayKey(d));
  });
  const consistencyScore = Math.round((Math.min(14, uniqueDays14.size) / 14) * 100);

  // Elite average score if present
  const eliteVals = last14
    .map((h) => extracteliteScore(h))
    .filter((v): v is number => typeof v === "number");
  const eliteSamples14 = eliteVals.length;
  const eliteAvg = eliteSamples14 ? Math.round(eliteVals.reduce((a, b) => a + b, 0) / eliteSamples14) : 0;

  // stabilityIndex: variance of confidence last14
  const confs = last14Chrono.map((h) => clamp01(h.skill_confidence));
  const mean = confs.length ? confs.reduce((s, x) => s + x, 0) / confs.length : 0;
  const variance = confs.length ? confs.reduce((s, x) => s + Math.pow(x - mean, 2), 0) / confs.length : 0;
  const stabilityIndex = Math.max(0, Math.min(100, Math.round(100 - (variance / 0.25) * 100)));

  // anomalies: swings > 30 pts between consecutive (chronological)
  let anomalyCount14 = 0;
  for (let i = 1; i < last14Chrono.length; i++) {
    const prev = pct(last14Chrono[i - 1].skill_confidence);
    const curr = pct(last14Chrono[i].skill_confidence);
    if (Math.abs(curr - prev) >= 30) anomalyCount14++;
  }

  // plateau risk
  let plateauRisk: "low" | "medium" | "high" = "low";
  if (last14Chrono.length >= 8) {
    if (Math.abs(trend14) <= 2) plateauRisk = "high";
    else if (Math.abs(trend14) <= 6) plateauRisk = "medium";
  }

  // momentum (blend)
  const momentum = Math.max(
    0,
    Math.min(100, Math.round(consistencyScore * 0.55 + (trend14 + 20) * 0.45))
  );

  return {
    total,
    last14Count: last14.length,
    avg14,
    streak,
    good,
    situational,
    bad,
    consistencyScore,
    bestTimeWindow,
    sessionsPerWeek,
    trend14,
    eliteAvg,
    eliteSamples14,
    stabilityIndex,
    plateauRisk,
    anomalyCount14,
    momentum,
    skillMix,
  };
}

/* =========================================================
   LOCK OVERLAY
========================================================= */

function LockedOverlay({
  colors,
  title,
  subtitle,
  tierLabel,
}: {
  colors: any;
  title: string;
  subtitle: string;
  tierLabel: "PRO" | "ELITE";
}) {
  return (
    <View style={styles.lockWrap} pointerEvents="box-none">
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <BlurView intensity={65} tint="dark" style={StyleSheet.absoluteFill} />
        <View style={[StyleSheet.absoluteFill, { backgroundColor: "rgba(0,0,0,0.35)" }]} />
      </View>

      <View style={[styles.lockCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <View style={[styles.lockIcon, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <Ionicons name="lock-closed" size={16} color={colors.text} />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={{ color: colors.text, fontWeight: "900", fontSize: 14 }}>{title}</Text>
            <Text style={{ color: colors.muted, marginTop: 4, lineHeight: 18 }}>{subtitle}</Text>
          </View>

          <View style={[styles.tierPill, { borderColor: colors.border, backgroundColor: colors.background }]}>
            <Text style={{ color: colors.muted, fontWeight: "900", fontSize: 12 }}>{tierLabel}</Text>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => router.push("/upgrade")}
          style={[styles.upgradeBtn, { backgroundColor: colors.primary }]}
        >
          <Text style={{ color: "#000", fontWeight: "900" }}>Upgrade</Text>
          <Ionicons name="chevron-forward" size={16} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* =========================================================
   INSIGHTS CARDS
========================================================= */

function ProInsightsCard({
  colors,
  insights,
  locked,
}: {
  colors: any;
  insights: MLInsights;
  locked: boolean;
}) {
  return (
    <View style={[styles.insightsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.insightsHeader}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <View style={[styles.badgeIcon, { backgroundColor: colors.primary }]}>
            <Ionicons name="flash-outline" size={18} color="#000" />
          </View>
          <View>
            <Text style={{ color: colors.text, fontWeight: "900", fontSize: 16 }}>Pro Insights</Text>
            <Text style={{ color: colors.muted, marginTop: 2 }}>Consistency + trend + rhythm.</Text>
          </View>
        </View>

        <View style={[styles.tierPill, { borderColor: colors.border, backgroundColor: colors.background }]}>
          <Text style={{ color: colors.muted, fontWeight: "900", fontSize: 12 }}>PRO</Text>
        </View>
      </View>

      <View style={[styles.grid, { borderTopColor: colors.border }]}>
        <GridStat colors={colors} label="Consistency" value={`${insights.consistencyScore}%`} />
        <GridStat
          colors={colors}
          label="Trend (14d)"
          value={
            insights.trend14 === 0
              ? "—"
              : `${insights.trend14 > 0 ? "▲" : "▼"} ${Math.abs(insights.trend14)}%`
          }
        />
        <GridStat colors={colors} label="Best window" value={insights.bestTimeWindow} />
        <GridStat colors={colors} label="Sessions/week" value={String(insights.sessionsPerWeek)} />
      </View>

      <View style={[styles.mixWrap, { borderTopColor: colors.border }]}>
        <Text style={{ color: colors.muted, fontWeight: "900", letterSpacing: 0.4, fontSize: 12 }}>
          SKILL MIX
        </Text>

        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 10 }}>
          {insights.skillMix.length === 0 ? (
            <Text style={{ color: colors.muted }}>—</Text>
          ) : (
            insights.skillMix.map((s) => (
              <View
                key={s.skill}
                style={[styles.mixChip, { backgroundColor: colors.background, borderColor: colors.border }]}
              >
                <Text style={{ color: colors.text, fontWeight: "900", fontSize: 12 }}>
                  {String(s.skill).toUpperCase()}
                </Text>
                <Text style={{ color: colors.muted, fontWeight: "900", fontSize: 12 }}>· {s.count}</Text>
              </View>
            ))
          )}
        </View>
      </View>

      {locked && (
        <LockedOverlay
          colors={colors}
          tierLabel="PRO"
          title="Pro Insights locked"
          subtitle="Upgrade to unlock consistency scoring, trend detection, and training rhythm."
        />
      )}
    </View>
  );
}

function EliteInsightsCard({
  colors,
  insights,
  locked,
}: {
  colors: any;
  insights: MLInsights;
  locked: boolean;
}) {
  const riskColor =
    insights.plateauRisk === "high" ? "#ef4444" : insights.plateauRisk === "medium" ? "#facc15" : "#22c55e";

  return (
    <View style={[styles.insightsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.insightsHeader}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <View style={[styles.badgeIcon, { backgroundColor: colors.background, borderColor: colors.border, borderWidth: 1 }]}>
            <Ionicons name="sparkles-outline" size={18} color={colors.text} />
          </View>
          <View>
            <Text style={{ color: colors.text, fontWeight: "900", fontSize: 16 }}>Elite Intelligence</Text>
            <Text style={{ color: colors.muted, marginTop: 2 }}>Stability + momentum + plateau risk.</Text>
          </View>
        </View>

        <View style={[styles.tierPill, { borderColor: colors.border, backgroundColor: colors.background }]}>
          <Text style={{ color: colors.muted, fontWeight: "900", fontSize: 12 }}>ELITE</Text>
        </View>
      </View>

      <View style={[styles.grid, { borderTopColor: colors.border }]}>
        <GridStat colors={colors} label="Stability index" value={`${insights.stabilityIndex}%`} />
        <GridStat colors={colors} label="Momentum" value={`${insights.momentum}%`} />
        <GridStat colors={colors} label="Anomalies (14d)" value={String(insights.anomalyCount14)} />
        <View style={{ flex: 1, minWidth: "48%", marginBottom: 14 }}>
          <Text style={{ color: colors.muted, fontSize: 12, fontWeight: "900", letterSpacing: 0.4 }}>
            PLATEAU RISK
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginTop: 8 }}>
            <View style={{ width: 10, height: 10, borderRadius: 999, backgroundColor: riskColor }} />
            <Text style={{ color: colors.text, fontSize: 20, fontWeight: "900" }}>
              {insights.plateauRisk.toUpperCase()}
            </Text>
          </View>
        </View>
      </View>

      {locked && (
        <LockedOverlay
          colors={colors}
          tierLabel="ELITE"
          title="Elite Intelligence locked"
          subtitle="Upgrade to unlock stability analytics, anomaly detection, and plateau alerts."
        />
      )}
    </View>
  );
}

function GridStat({ colors, label, value }: { colors: any; label: string; value: string }) {
  return (
    <View style={{ flex: 1, minWidth: "48%", marginBottom: 14 }}>
      <Text style={{ color: colors.muted, fontSize: 12, fontWeight: "900", letterSpacing: 0.4 }}>
        {label.toUpperCase()}
      </Text>
      <Text style={{ color: colors.text, fontSize: 22, fontWeight: "900", marginTop: 6 }}>{value}</Text>
    </View>
  );
}

/* =========================================================
   SCREEN
========================================================= */

export default function HistoryScreen() {
  const colors = useAppColors();

  const ent = useEntitlements() as any;
  const tier = resolveTier(ent);
  const isPro = tier === "pro" || tier === "elite";
  const isElite = tier === "elite";

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [activeSkill, setActiveSkill] = useState<string>("all");

  const loadHistory = useCallback(async () => {
    try {
      const key = getHistoryKey();
      if (!key) {
        setHistory([]);
        return;
      }
      const raw = await AsyncStorage.getItem(key);
      const parsed = raw ? JSON.parse(raw) : [];
      const arr: HistoryItem[] = Array.isArray(parsed) ? parsed : [];

      // normalize ids + sort newest first
      const normalized = arr.map((h, idx) => ({
        ...h,
        id: String(h?.id ?? stableItemId(h, idx)),
      }));

      normalized.sort((a, b) => {
        const ta = safeDateFromISO(a.created_at)?.getTime() ?? 0;
        const tb = safeDateFromISO(b.created_at)?.getTime() ?? 0;
        return tb - ta;
      });

      setHistory(normalized);
    } catch (e) {
      console.error("Failed to load history", e);
      setHistory([]);
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [loadHistory])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadHistory();
    setRefreshing(false);
  }, [loadHistory]);

  const clearHistory = useCallback(() => {
    Alert.alert("Clear history?", "This removes saved analyses from this device. This can’t be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Clear",
        style: "destructive",
        onPress: async () => {
          const key = getHistoryKey();
          if (key) await AsyncStorage.removeItem(key);
          setHistory([]);
        },
      },
    ]);
  }, []);

  const skillChips = useMemo(() => {
    const skills = new Set<string>();
    history.forEach((h) => {
      const s = String(h?.skill ?? "").toLowerCase().trim();
      if (s) skills.add(s);
    });

    const sorted = Array.from(skills).sort((a, b) => {
      const ai = SKILL_ORDER.indexOf(a as any);
      const bi = SKILL_ORDER.indexOf(b as any);
      if (ai === -1 && bi === -1) return a.localeCompare(b);
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    });

    return ["all", ...sorted];
  }, [history]);

  const filtered = useMemo(() => {
    if (activeSkill === "all") return history;
    return history.filter((h) => String(h.skill).toLowerCase() === activeSkill);
  }, [history, activeSkill]);

  const insights = useMemo(() => computeInsights(filtered), [filtered]);

  // Animated header numbers (clean & safe)
  const animTotal = useAnimatedNumber(insights.total);
  const animStreak = useAnimatedNumber(insights.streak);
  const animAvg14 = useAnimatedNumber(insights.avg14);
  const animEliteAvg = useAnimatedNumber(insights.eliteAvg);

  // Sections grouped by day
  const sections = useMemo(() => {
    const map = new Map<string, { title: string; date: Date; data: HistoryItem[] }>();

    for (const item of filtered) {
      const d = safeDateFromISO(item.created_at) ?? new Date(0);
      const key = toLocalDayKey(d);

      if (!map.has(key)) {
        map.set(key, { title: formatHeaderDay(d), date: d, data: [] });
      }
      map.get(key)!.data.push(item);
    }

    for (const v of map.values()) {
      v.data.sort((a, b) => {
        const ta = safeDateFromISO(a.created_at)?.getTime() ?? 0;
        const tb = safeDateFromISO(b.created_at)?.getTime() ?? 0;
        return tb - ta;
      });
    }

    return Array.from(map.values()).sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [filtered]);

  const openResult = useCallback((h: HistoryItem) => {
    // Prefer full payload; fallback to the minimal history item so results screen can still show something.
    const payload =
      h?.result_payload ??
      {
        skill: h.skill,
        quality: h.quality,
        skill_confidence: h.skill_confidence,
        quality_confidence: h.quality_confidence,
        primary_fix: h.primary_fix,
        created_at: h.created_at,
        eliteScore: extracteliteScore(h),
      };

    router.push({
      pathname: "/results",
      params: {
        payload: JSON.stringify(payload),
        fromHistory: "true",
      },
    });
  }, []);

  /* ===============================
     EMPTY STATE
  ================================ */
  if (history.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Stack.Screen options={{ title: "History" }} />

        <View style={{ marginBottom: 18 }}>
          <Text style={[styles.h1, { color: colors.text }]}>History</Text>
          <Text style={{ color: colors.muted, marginTop: 6 }}>
            Your analyses will show up here automatically.
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={{ color: colors.text, fontSize: 18, fontWeight: "900" }}>No analyses yet</Text>
          <Text style={{ color: colors.muted, marginTop: 10, lineHeight: 22 }}>
            Run your first analysis to start tracking progress, streaks, and trends.
          </Text>

          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => router.replace("/")}
            style={[styles.primaryBtn, { backgroundColor: colors.primary }]}
          >
            <Text style={styles.primaryBtnText}>Analyze a video</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  /* ===============================
     MAIN
  ================================ */
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          title: "History",
          headerRight: () => (
            <TouchableOpacity
              onPress={clearHistory}
              style={{ paddingHorizontal: 14, paddingVertical: 6 }}
              hitSlop={10}
            >
              <Ionicons name="trash-outline" size={20} color={colors.text} />
            </TouchableOpacity>
          ),
        }}
      />

      <SectionList
        sections={sections}
        keyExtractor={(item) => String(item.id)}
        stickySectionHeadersEnabled={false}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={{ paddingBottom: 24 }}
        ListHeaderComponent={
          <>
            {/* HERO HEADER */}
            <View style={[styles.hero, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.h1, { color: colors.text }]}>History</Text>
                  <Text style={{ color: colors.muted, marginTop: 6, lineHeight: 18 }}>
                    Your analysis timeline, progress signals, and performance intelligence.
                  </Text>
                </View>

                <View style={[styles.tierPill, { borderColor: colors.border, backgroundColor: colors.background }]}>
                  <Text style={{ color: colors.muted, fontWeight: "900", fontSize: 12 }}>
                    {tier.toUpperCase()}
                  </Text>
                </View>
              </View>

              <View style={[styles.heroRow, { borderTopColor: colors.border }]}>
                <HeroStat colors={colors} label="Total analyses" value={String(animTotal)} />
                <HeroStat
                  colors={colors}
                  label="Streak"
                  value={`${animStreak} day${animStreak === 1 ? "" : "s"}`}
                />
              </View>

              <View style={[styles.heroRow, { borderTopColor: colors.border }]}>
                <HeroStat colors={colors} label="Avg confidence (14d)" value={`${animAvg14}%`} />
                <HeroStat
                  colors={colors}
                  label="Avg elite score (14d)"
                  value={insights.eliteSamples14 > 0 ? `${animEliteAvg}/100` : "—"}
                />
              </View>

              <View style={{ marginTop: 12, flexDirection: "row", gap: 10, flexWrap: "wrap" }}>
                <MiniPill
                  colors={colors}
                  icon="checkmark-circle"
                  label={`Good ${insights.good}`}
                  tone="good"
                />
                <MiniPill
                  colors={colors}
                  icon="alert-circle"
                  label={`Situational ${insights.situational}`}
                  tone="mid"
                />
                <MiniPill
                  colors={colors}
                  icon="close-circle"
                  label={`Needs work ${insights.bad}`}
                  tone="bad"
                />
              </View>
            </View>

            {/* PRO / ELITE INSIGHTS */}
            <ProInsightsCard colors={colors} insights={insights} locked={!isPro} />
            <EliteInsightsCard colors={colors} insights={insights} locked={!isElite} />

            {/* FILTERS */}
            <View style={{ marginTop: 6, marginBottom: 10 }}>
              <Text style={{ color: colors.muted, fontWeight: "900", letterSpacing: 0.7, fontSize: 12 }}>
                FILTER
              </Text>

              <View style={styles.chipsRow}>
                {skillChips.map((chip) => {
                  const active = chip === activeSkill;
                  return (
                    <TouchableOpacity
                      key={chip}
                      onPress={() => setActiveSkill(chip)}
                      activeOpacity={0.9}
                      style={[
                        styles.chip,
                        {
                          backgroundColor: active ? colors.primary : colors.card,
                          borderColor: colors.border,
                        },
                      ]}
                    >
                      <Text style={{ color: active ? "#000" : colors.muted, fontWeight: "900", fontSize: 12 }}>
                        {chip === "all" ? "ALL" : chip.toUpperCase()}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </>
        }
        renderSectionHeader={({ section }) => (
          <View style={{ paddingTop: 10, paddingBottom: 10 }}>
            <Text style={{ color: colors.muted, fontWeight: "900", letterSpacing: 0.7, fontSize: 12 }}>
              {section.title.toUpperCase()}
            </Text>
          </View>
        )}
        renderItem={({ item }) => {
          const qm = qualityMeta(item.quality);
          const created = safeDateFromISO(item.created_at);
          const time = created ? formatTime(created) : "";

          const badgeBg =
            qm.tone === "good"
              ? "rgba(34,197,94,0.18)"
              : qm.tone === "mid"
              ? "rgba(250,204,21,0.18)"
              : "rgba(239,68,68,0.18)";

          const badgeText =
            qm.tone === "good" ? "#22c55e" : qm.tone === "mid" ? "#facc15" : "#ef4444";

          const elite = extracteliteScore(item);

          return (
            <TouchableOpacity
              activeOpacity={0.92}
              onPress={() => openResult(item)}
              style={[styles.itemCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 12 }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: colors.text, fontWeight: "900", fontSize: 16 }}>
                    {String(item.skill || "Unknown").toUpperCase()}
                  </Text>

                  <Text style={{ color: colors.muted, marginTop: 6 }}>
                    {time ? `${time} · ` : ""}
                    Confidence{" "}
                    <Text style={{ color: colors.text, fontWeight: "900" }}>{pct(item.skill_confidence)}%</Text>
                    {elite != null ? (
                      <>
                        {" "}
                        · Elite{" "}
                        <Text style={{ color: colors.text, fontWeight: "900" }}>{elite}/100</Text>
                      </>
                    ) : null}
                  </Text>

                  {!!String(item.primary_fix || "").trim() && (
                    <View style={[styles.fixRow, { backgroundColor: colors.background, borderColor: colors.border }]}>
                      <Ionicons name="bulb-outline" size={16} color={colors.muted} />
                      <Text style={{ color: colors.text, fontWeight: "800", flex: 1 }} numberOfLines={2}>
                        {String(item.primary_fix)}
                      </Text>
                    </View>
                  )}
                </View>

                <View style={[styles.badge, { backgroundColor: badgeBg, borderColor: colors.border }]}>
                  <Ionicons name={qm.icon} size={16} color={badgeText} />
                  <Text style={{ color: badgeText, fontWeight: "900", fontSize: 12 }}>{qm.label}</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
        ListFooterComponent={<View style={{ height: 10 }} />}
      />
    </View>
  );
}

/* =========================================================
   SMALL UI COMPONENTS
========================================================= */

function HeroStat({ colors, label, value }: { colors: any; label: string; value: string }) {
  return (
    <View style={{ flex: 1 }}>
      <Text style={{ color: colors.muted, fontWeight: "900", letterSpacing: 0.4, fontSize: 12 }}>
        {label.toUpperCase()}
      </Text>
      <Text style={{ color: colors.text, fontSize: 22, fontWeight: "900", marginTop: 6 }}>{value}</Text>
    </View>
  );
}

function MiniPill({
  colors,
  icon,
  label,
  tone,
}: {
  colors: any;
  icon: any;
  label: string;
  tone: "good" | "mid" | "bad";
}) {
  const bg =
    tone === "good"
      ? "rgba(34,197,94,0.16)"
      : tone === "mid"
      ? "rgba(250,204,21,0.16)"
      : "rgba(239,68,68,0.16)";
  const fg = tone === "good" ? "#22c55e" : tone === "mid" ? "#facc15" : "#ef4444";

  return (
    <View style={[styles.miniPill, { backgroundColor: bg, borderColor: "rgba(255,255,255,0.06)" }]}>
      <Ionicons name={icon} size={14} color={fg} />
      <Text style={{ color: fg, fontWeight: "900", fontSize: 12 }}>{label}</Text>
    </View>
  );
}

/* =========================================================
   STYLES
========================================================= */

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },

  h1: { fontSize: 28, fontWeight: "900" },

  card: {
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
  },

  primaryBtn: {
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
  },
  primaryBtnText: { color: "#000", fontSize: 16, fontWeight: "900" },

  hero: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
    marginBottom: 14,
  },
  heroRow: {
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    gap: 12,
  },

  tierPill: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 10,
  },
  chip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },

  itemCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },

  badge: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    alignSelf: "flex-start",
  },

  fixRow: {
    marginTop: 12,
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },

  miniPill: {
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  /* Insights cards */
  insightsCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
    marginBottom: 14,
    overflow: "hidden",
  },
  insightsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  badgeIcon: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  grid: {
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  mixWrap: {
    marginTop: 10,
    paddingTop: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  mixChip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  /* Lock overlay */
  lockWrap: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    padding: 14,
  },
  lockCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
  },
  lockIcon: {
    width: 34,
    height: 34,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  upgradeBtn: {
    marginTop: 14,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
});
