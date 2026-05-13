import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Animated,
  Platform,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import Svg, { Polyline, Circle, Line, Text as SvgText } from "react-native-svg";
import { router } from "expo-router";

import { useAppColors } from "../../lib/useAppColors";
import { useEntitlements } from "../../lib/useEntitlements";
import { usePreviewMode } from "../../lib/usePreviewMode";
import DailyFocusCard from "../../components/DailyFocusCard";
import { elitePreviewHistory } from "../../lib/elitePreviewData";
import { auth } from "../../lib/auth";
import { getHistoryKey } from "../../lib/userStorage";

/* =====================================================
   TYPES
===================================================== */
type RepQuality = "bad" | "situational" | "good";

type HistoryItem = {
  id: string;
  skill: string;
  quality: RepQuality;
  skill_confidence: number;
  elite_score?: number;
  result_payload?: any;
  created_at: string;
};

const SKILLS = ["passing", "setting", "attacking", "serving", "blocking"] as const;
type SkillKey = (typeof SKILLS)[number];

const GRAPH_SKILLS: SkillKey[] = ["passing", "setting"];

/* =====================================================
   HELPERS
===================================================== */
const clamp01 = (n: number) => Math.max(0, Math.min(1, Number.isFinite(n) ? n : 0));

function toLocalDayKey(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "invalid";
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

function formatSkillName(skill: string) {
  return skill.toUpperCase();
}

function getEliteScoreFromItem(item: HistoryItem): number {
  return Number(item?.elite_score ?? item?.result_payload?.elite_score ?? 0);
}

/* =====================================================
   GRAPH
   - Plots elite score (0–100) on Y axis
   - Labelled midline at 50
   - Coloured dots by quality
   - Proper empty state
===================================================== */
function SkillGraph({
  points,
  accent,
  muted,
  reveal,
  textColor,
}: {
  points: { v01: number; iso: string; quality: RepQuality }[];
  accent: string;
  muted: string;
  reveal: Animated.Value;
  textColor: string;
}) {
  const width  = 320;
  const height = 120;
  const padX   = 28;
  const padY   = 12;

  const display = points.slice(-12);

  // Empty state — fewer than 2 points
  if (display.length < 2) {
    const opacity    = reveal.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });
    const translateY = reveal.interpolate({ inputRange: [0, 1], outputRange: [8, 0] });
    return (
      <Animated.View
        style={[
          styles.emptyGraph,
          { opacity, transform: [{ translateY }], borderColor: muted },
        ]}
      >
        <Ionicons name="stats-chart-outline" size={22} color={muted} />
        <Text style={{ color: muted, fontSize: 13, fontWeight: "800", marginTop: 6, textAlign: "center" }}>
          Analyse {display.length === 0 ? "2" : "1"} more rep{display.length === 0 ? "s" : ""} to unlock the graph
        </Text>
      </Animated.View>
    );
  }

  const n   = display.length;
  const pts = display.map((p, i) => {
    const x = padX + (i / Math.max(1, n - 1)) * (width - padX * 2);
    const y = padY + (1 - p.v01) * (height - padY * 2);
    return { x, y };
  });

  const poly = pts.map((p) => `${p.x},${p.y}`).join(" ");

  // Y positions for labels
  const y100 = padY;
  const y50  = padY + 0.5 * (height - padY * 2);
  const y0   = height - padY;

  const opacity    = reveal.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });
  const translateY = reveal.interpolate({ inputRange: [0, 1], outputRange: [10, 0] });

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }], marginTop: 12 }}>
      <Svg width={width} height={height}>
        {/* Y axis labels */}
        <SvgText x={0} y={y100 + 4} fontSize={9} fontWeight="800" fill={muted}>100</SvgText>
        <SvgText x={4}  y={y50  + 4} fontSize={9} fontWeight="800" fill={muted}>50</SvgText>
        <SvgText x={8}  y={y0   + 1} fontSize={9} fontWeight="800" fill={muted}>0</SvgText>

        {/* Baseline */}
        <Line
          x1={padX} y1={y0}
          x2={width - padX} y2={y0}
          stroke={muted} strokeWidth={1}
        />

        {/* Midline at 50 — dashed */}
        <Line
          x1={padX} y1={y50}
          x2={width - padX} y2={y50}
          stroke={muted} strokeWidth={1}
          strokeDasharray="4 6"
        />

        {/* Trend line */}
        <Polyline
          points={poly}
          fill="none"
          stroke={accent}
          strokeWidth={2.5}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Dots coloured by quality */}
        {pts.map((p, i) => {
          const q = display[i].quality;
          const color =
            q === "good"        ? accent    :
            q === "situational" ? "#F5B942" :
                                  "#E5533D";
          return (
            <Circle
              key={`dot-${i}`}
              cx={p.x}
              cy={p.y}
              r={3.8}
              fill={color}
            />
          );
        })}
      </Svg>

      {/* Dot legend */}
      <View style={styles.graphLegend}>
        {[
          { color: accent,    label: "Good" },
          { color: "#F5B942", label: "Situational" },
          { color: "#E5533D", label: "Needs work" },
        ].map(({ color, label }) => (
          <View key={label} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: color }]} />
            <Text style={{ color: muted, fontSize: 11, fontWeight: "800" }}>{label}</Text>
          </View>
        ))}
      </View>
    </Animated.View>
  );
}

/* =====================================================
   SCREEN
===================================================== */
export default function ProgressScreen() {
  const colors = useAppColors();

  const ent              = useEntitlements() as any;
  const isElite          = !!ent?.isElite;
  const isPro            = !!ent?.isPro;
  const canAccessProgress = isElite || isPro;

  const preview                                = usePreviewMode() as any;
  const previewHydrated: boolean               = preview?.hydrated ?? true;
  const isPreview: boolean                     = !!preview?.isPreview;
  const [pendingPreviewEnable, setPendingPreviewEnable] = useState(false);

  /* ─── Data ─── */
  const [history, setHistory]     = useState<HistoryItem[]>([]);
  const effectiveHistory: HistoryItem[] = isPreview ? elitePreviewHistory : history;
  const [refreshing, setRefreshing] = useState(false);

  /* ─── One-time open animation ─── */
  const reveal = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(reveal, {
      toValue:  1,
      duration: 540,
      useNativeDriver: true,
    }).start();
  }, [reveal]);

  /* ─── Load history ─── */
  const loadHistory = useCallback(async () => {
    try {
      const uid = auth.currentUser?.uid;
      if (!uid) { setHistory([]); return; }

      // Use the same key as results.tsx via getHistoryKey()
      // getHistoryKey() internally uses the active uid
      const key = getHistoryKey();
      if (!key) { setHistory([]); return; }

      const raw    = await AsyncStorage.getItem(key);
      const parsed = raw ? JSON.parse(raw) : [];
      setHistory(Array.isArray(parsed) ? parsed : []);
    } catch {
      setHistory([]);
    }
  }, []);

  useEffect(() => { loadHistory(); }, [loadHistory]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadHistory();
    setRefreshing(false);
  }, [loadHistory]);

  /* ─── Preview helpers ─── */
  const enablePreviewNow = useCallback(() => {
    if (!previewHydrated) { setPendingPreviewEnable(true); return; }
    preview?.enablePreview?.();
  }, [preview, previewHydrated]);

  const disablePreviewNow = useCallback(() => {
    setPendingPreviewEnable(false);
    if (!previewHydrated) return;
    preview?.disablePreview?.();
  }, [preview, previewHydrated]);

  useEffect(() => {
    if (!previewHydrated || !pendingPreviewEnable) return;
    preview?.enablePreview?.();
    setPendingPreviewEnable(false);
  }, [previewHydrated, pendingPreviewEnable, preview]);

  /* =====================================================
     DERIVED DATA
  ===================================================== */
  const totalAnalyses = effectiveHistory.length;

  /* ─── Personal best elite score ─── */
  const personalBest = useMemo(() => {
    if (!effectiveHistory.length) return null;
    const scores = effectiveHistory
      .map(getEliteScoreFromItem)
      .filter((n) => Number.isFinite(n) && n > 0);
    if (!scores.length) return null;
    return Math.max(...scores);
  }, [effectiveHistory]);

  /* ─── Personal best skill ─── */
  const personalBestSkill = useMemo(() => {
    if (!personalBest) return null;
    const match = effectiveHistory.find(
      (h) => getEliteScoreFromItem(h) === personalBest
    );
    return match ? String(match.skill || "").toLowerCase() : null;
  }, [effectiveHistory, personalBest]);

  /* ─── By-skill aggregation ─── */
  const bySkill = useMemo(() => {
    const map: Record<
      SkillKey,
      {
        total:       number;
        avgPct:      number;
        bestScore:   number | null;
        items:       HistoryItem[];
        graphPoints: { v01: number; iso: string; quality: RepQuality }[];
      }
    > = {
      passing:   { total: 0, avgPct: 0, bestScore: null, items: [], graphPoints: [] },
      setting:   { total: 0, avgPct: 0, bestScore: null, items: [], graphPoints: [] },
      attacking: { total: 0, avgPct: 0, bestScore: null, items: [], graphPoints: [] },
      serving:   { total: 0, avgPct: 0, bestScore: null, items: [], graphPoints: [] },
      blocking:  { total: 0, avgPct: 0, bestScore: null, items: [], graphPoints: [] },
    };

    const sorted = [...effectiveHistory].sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

    for (const h of sorted) {
      const k = String(h.skill || "").toLowerCase() as SkillKey;
      if (!map[k]) continue;

      map[k].items.push(h);

      const elite = getEliteScoreFromItem(h);
      const v01   = clamp01(elite / 100);

      map[k].graphPoints.push({ v01, iso: h.created_at, quality: h.quality });
    }

    (Object.keys(map) as SkillKey[]).forEach((k) => {
      const items = map[k].items;
      map[k].total   = items.length;
      map[k].avgPct  = items.length > 0
        ? Math.round(
            (items.reduce((s, r) => s + clamp01(r.skill_confidence), 0) / items.length) * 100
          )
        : 0;

      // Per-skill personal best
      const scores = items.map(getEliteScoreFromItem).filter((n) => n > 0);
      map[k].bestScore = scores.length ? Math.max(...scores) : null;
    });

    return map;
  }, [effectiveHistory]);

  /* ─── Elite trend insight ─── */
  const eliteProgressInsight = useMemo(() => {
    if (!isElite) return null;

    const skills = Object.entries(bySkill)
      .filter(([_, v]) => v.graphPoints.length >= 8)
      .sort((a, b) => b[1].graphPoints.length - a[1].graphPoints.length);

    if (!skills.length) return null;

    const [skill, data] = skills[0];
    const pts           = data.graphPoints.map((p) => p.v01);
    if (pts.length < 8) return null;

    const recent   = pts.slice(-5);
    const previous = pts.slice(-10, -5);

    const avgRecent = recent.reduce((a, b) => a + b, 0)   / recent.length;
    const avgPrev   = previous.reduce((a, b) => a + b, 0) / previous.length;
    const delta     = avgRecent - avgPrev;

    if (delta > 0.05) {
      return `Momentum in ${formatSkillName(skill)} is trending upward — stay consistent and don't rush reps.`;
    }
    if (delta < -0.05) {
      return `Recent ${formatSkillName(skill)} reps dipped slightly — slow the tempo and refocus on clean execution.`;
    }
    return `Your ${formatSkillName(skill)} performance is stable — small technical refinements will unlock the next jump.`;
  }, [bySkill, isElite]);

  /* ─── Streak ─── */
  const streakData = useMemo(() => {
    if (!effectiveHistory.length) return { current: 0, best: 0, activeDays: 0 };

    const dayKeys = effectiveHistory
      .map((h) => toLocalDayKey(h.created_at))
      .filter((k) => k !== "invalid");

    const unique = Array.from(new Set(dayKeys));
    const times  = unique
      .map((k) => {
        const [y, m, d] = k.split("-").map(Number);
        const dt = new Date(y, m, d);
        dt.setHours(0, 0, 0, 0);
        return dt.getTime();
      })
      .sort((a, b) => a - b);

    if (!times.length) return { current: 0, best: 0, activeDays: 0 };

    let best = 1, run = 1;
    for (let i = 1; i < times.length; i++) {
      const diffDays = (times[i] - times[i - 1]) / 86400000;
      if (diffDays <= 1.1) { run += 1; best = Math.max(best, run); }
      else run = 1;
    }

    let current = 1;
    for (let i = times.length - 1; i > 0; i--) {
      const diffDays = (times[i] - times[i - 1]) / 86400000;
      if (diffDays <= 1.1) current += 1;
      else break;
    }

    return { current, best, activeDays: unique.length };
  }, [effectiveHistory]);

  /* ─── Top insight ─── */
  const topInsight = useMemo(() => {
    const skillsWithData = (Object.keys(bySkill) as SkillKey[]).filter(
      (k) => bySkill[k].total > 0
    );

    if (!skillsWithData.length) {
      return {
        title: "Start analyzing",
        body:  "Analyze your first clip to unlock trends, streaks, and premium insights.",
        icon:  "sparkles-outline" as const,
      };
    }

    let worst: SkillKey = skillsWithData[0];
    for (const k of skillsWithData) {
      if (bySkill[k].avgPct < bySkill[worst].avgPct) worst = k;
    }

    const pct = bySkill[worst].avgPct;
    return {
      title: `Focus: ${formatSkillName(worst)}`,
      body:
        pct < 65
          ? "Keep it simple: calm posture, clean contact, and repeatable tempo. Quality over volume."
          : "You're close — push for consistency under pressure. Track small gains daily.",
      icon: "flash-outline" as const,
    };
  }, [bySkill]);

  /* ─── Lock logic ─── */
  const isLocked = !canAccessProgress && !isPreview && !pendingPreviewEnable;

  if (ent.loading) {
    return <View style={{ flex: 1, backgroundColor: colors.background }} />;
  }

  /* =====================================================
     UI
  ===================================================== */
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 22, paddingBottom: 160 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        scrollEnabled={!isLocked}
        showsVerticalScrollIndicator={false}
      >
        {/* TOP BAR */}
        <View style={styles.topBar}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            {isPreview && (
              <TouchableOpacity
                onPress={disablePreviewNow}
                activeOpacity={0.9}
                style={[styles.pill, { backgroundColor: colors.card, borderColor: colors.border }]}
              >
                <Ionicons name="close" size={16} color={colors.text} />
                <Text style={{ color: colors.text, fontWeight: "900", fontSize: 12 }}>
                  Exit Preview
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            onPress={onRefresh}
            activeOpacity={0.9}
            style={[styles.iconBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <Ionicons name="refresh" size={18} color={colors.text} />
          </TouchableOpacity>
        </View>

        <DailyFocusCard />

        {/* HEADER */}
        <View style={{ marginTop: 14, marginBottom: 14 }}>
          <Text style={[styles.h1, { color: colors.text }]}>Progress</Text>
          <Text style={{ color: colors.muted, marginTop: 4 }}>
            Premium trends · streaks · skill momentum
          </Text>

          {isPreview && (
            <View
              style={[
                styles.previewBanner,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <Ionicons name="eye-outline" size={16} color={colors.muted} />
              <Text style={{ color: colors.muted, fontWeight: "800" }}>
                Preview mode — demo data, not your real clips.
              </Text>
            </View>
          )}
        </View>

        {/* ─── STATS ROW ─── */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.cardTopRow}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Your Stats</Text>
            <View style={[styles.badge, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <Ionicons name="flame" size={14} color={colors.text} />
              <Text style={{ color: colors.text, fontWeight: "900", fontSize: 12 }}>
                Consistency
              </Text>
            </View>
          </View>

          <View style={{ flexDirection: "row", gap: 10, marginTop: 12 }}>
            {/* Current streak */}
            <View style={[styles.metricBox, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <Text style={[styles.metricValue, { color: colors.text }]}>
                {streakData.current}
              </Text>
              <Text style={{ color: colors.muted, fontWeight: "800", fontSize: 11 }}>Streak</Text>
            </View>

            {/* Best streak */}
            <View style={[styles.metricBox, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <Text style={[styles.metricValue, { color: colors.text }]}>
                {streakData.best}
              </Text>
              <Text style={{ color: colors.muted, fontWeight: "800", fontSize: 11 }}>Best</Text>
            </View>

            {/* Total */}
            <View style={[styles.metricBox, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <Text style={[styles.metricValue, { color: colors.text }]}>
                {totalAnalyses}
              </Text>
              <Text style={{ color: colors.muted, fontWeight: "800", fontSize: 11 }}>Total</Text>
            </View>
          </View>

          {/* Personal best row — only shows when data exists */}
          {personalBest !== null && (
            <View
              style={[
                styles.personalBestRow,
                { backgroundColor: colors.background, borderColor: colors.border },
              ]}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <Ionicons name="trophy-outline" size={16} color={colors.primary} />
                <Text style={{ color: colors.text, fontWeight: "900" }}>
                  Personal Best
                </Text>
              </View>

              <View style={{ flexDirection: "row", alignItems: "baseline", gap: 6 }}>
                <Text style={{ color: colors.primary, fontWeight: "900", fontSize: 22 }}>
                  {personalBest}
                </Text>
                <Text style={{ color: colors.muted, fontWeight: "800" }}>
                  / 100{personalBestSkill ? ` · ${formatSkillName(personalBestSkill)}` : ""}
                </Text>
              </View>
            </View>
          )}

          <Text style={{ color: colors.muted, marginTop: 12, lineHeight: 18 }}>
            Streak counts days where you analysed at least one clip.
          </Text>
        </View>

        {/* ─── SKILL MOMENTUM ─── */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.cardTopRow}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Skill Momentum</Text>
            <Text style={{ color: colors.muted, fontWeight: "800" }}>
              {GRAPH_SKILLS.length} live · {SKILLS.length - GRAPH_SKILLS.length} soon
            </Text>
          </View>

          {GRAPH_SKILLS.map((skill) => {
            const { total, avgPct, bestScore, graphPoints } = bySkill[skill];

            return (
              <View
                key={skill}
                style={[
                  styles.skillCard,
                  { backgroundColor: colors.background, borderColor: colors.border },
                ]}
              >
                {/* Skill header */}
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" }}>
                  <Text style={{ color: colors.text, fontWeight: "900", fontSize: 14, letterSpacing: 0.4 }}>
                    {formatSkillName(skill)}
                  </Text>
                  <Text style={{ color: colors.muted, fontWeight: "900" }}>
                    {total} rep{total !== 1 ? "s" : ""}
                  </Text>
                </View>

                {/* Mini stat row */}
                <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
                  <View style={[styles.miniStat, { borderColor: colors.border }]}>
                    <Text style={{ color: colors.text, fontWeight: "900", fontSize: 13 }}>
                      {avgPct}%
                    </Text>
                    <Text style={{ color: colors.muted, fontSize: 11, fontWeight: "800" }}>
                      Avg conf
                    </Text>
                  </View>

                  {bestScore !== null && (
                    <View style={[styles.miniStat, { borderColor: colors.border }]}>
                      <Text style={{ color: colors.primary, fontWeight: "900", fontSize: 13 }}>
                        {bestScore}
                      </Text>
                      <Text style={{ color: colors.muted, fontSize: 11, fontWeight: "800" }}>
                        Best score
                      </Text>
                    </View>
                  )}
                </View>

                <SkillGraph
                  points={graphPoints}
                  accent={colors.primary}
                  muted={colors.muted}
                  reveal={reveal}
                  textColor={colors.text}
                />

                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => {
                    if (!canAccessProgress) {
                      Alert.alert(
                        "Unlock full skill insights 💎",
                        "Upgrade to access detailed breakdowns, performance trends, and AI-powered coaching insights."
                      );
                      return;
                    }
                    router.push({ pathname: "/progress/skill", params: { skill } });
                  }}
                  style={[
                    styles.smallCta,
                    { borderColor: colors.border, backgroundColor: colors.card },
                  ]}
                >
                  <Text style={{ color: colors.text, fontWeight: "900" }}>View details</Text>
                  <Ionicons name="chevron-forward" size={16} color={colors.muted} />
                </TouchableOpacity>
              </View>
            );
          })}

          {/* Elite trend insight */}
          {isElite && eliteProgressInsight && (
            <View
              style={[
                styles.eliteInsight,
                { borderColor: colors.primary + "55" },
              ]}
            >
              <Text style={[styles.eliteInsightLabel, { color: colors.primary }]}>
                ELITE INSIGHT
              </Text>
              <Text style={[styles.eliteInsightText, { color: colors.text }]}>
                {eliteProgressInsight}
              </Text>
            </View>
          )}

          {/* Coming soon pills */}
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 14 }}>
            {(SKILLS.filter((s) => !GRAPH_SKILLS.includes(s)) as SkillKey[]).map((s) => (
              <View
                key={s}
                style={[
                  styles.comingSoonPill,
                  { backgroundColor: colors.background, borderColor: colors.border },
                ]}
              >
                <Text style={{ color: colors.muted, fontWeight: "900", fontSize: 12 }}>
                  {formatSkillName(s)} · Soon
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* ─── INSIGHT CARD ─── */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.cardTopRow}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <Ionicons name={topInsight.icon} size={18} color={colors.text} />
              <Text style={[styles.cardTitle, { color: colors.text }]}>Insight</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <Text style={{ color: colors.text, fontWeight: "900", fontSize: 12 }}>AI</Text>
            </View>
          </View>

          <Text style={{ color: colors.text, fontWeight: "900", fontSize: 16, marginTop: 10 }}>
            {topInsight.title}
          </Text>
          <Text style={{ color: colors.muted, marginTop: 8, lineHeight: 19 }}>
            {topInsight.body}
          </Text>

          {/* FIX: hide upgrade CTA for Elite users — they already have everything */}
          {!isElite && (
            <TouchableOpacity
              onPress={() => router.push("/upgrade")}
              activeOpacity={0.9}
              style={[
                styles.smallCta,
                { borderColor: colors.border, backgroundColor: colors.background },
              ]}
            >
              <Text style={{ color: colors.text, fontWeight: "900" }}>Unlock more insights</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.muted} />
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {/* 🔒 LOCK OVERLAY */}
      {isLocked && (
        <View style={StyleSheet.absoluteFill}>
          <BlurView intensity={92} tint="dark" style={StyleSheet.absoluteFill} />

          <View style={styles.lockWrap}>
            <Ionicons name="lock-closed" size={52} color="#fff" />

            <Text style={styles.lockTitle}>Progress Locked</Text>
            <Text style={styles.lockBody}>
              Upgrade to Pro or Elite to unlock graphs, streaks, and skill momentum.
            </Text>

            <TouchableOpacity
              onPress={() => router.push("/upgrade")}
              activeOpacity={0.9}
              style={[styles.primaryBtn, { backgroundColor: colors.primary }]}
            >
              <Text style={styles.primaryBtnText}>Upgrade</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={enablePreviewNow}
              activeOpacity={0.9}
              style={styles.secondaryBtn}
            >
              <Text style={styles.secondaryBtnText}>Preview Progress</Text>
            </TouchableOpacity>

            <Text style={{ color: "#aaa", marginTop: 12, fontSize: 12, textAlign: "center" }}>
              Preview uses demo data — your real progress unlocks with Pro or Elite.
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

/* =====================================================
   STYLES
===================================================== */
const styles = StyleSheet.create({
  topBar: {
    marginTop:     Platform.select({ ios: 6, android: 10, default: 10 }),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems:    "center",
  },

  h1: {
    fontSize:      32,
    fontWeight:    "900",
    letterSpacing: 0.2,
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
    gap:               8,
  },

  previewBanner: {
    marginTop:   12,
    borderWidth: 1,
    borderRadius: 14,
    padding:     12,
    flexDirection: "row",
    alignItems:  "center",
    gap:         10,
  },

  card: {
    borderWidth:  1,
    borderRadius: 20,
    padding:      16,
    marginBottom: 14,
  },

  cardTopRow: {
    flexDirection:  "row",
    justifyContent: "space-between",
    alignItems:     "baseline",
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
    gap:               8,
  },

  metricBox: {
    flex:           1,
    borderWidth:    1,
    borderRadius:   18,
    padding:        14,
    alignItems:     "center",
  },

  metricValue: {
    fontSize:   26,
    fontWeight: "900",
  },

  /* Personal best row */
  personalBestRow: {
    marginTop:         12,
    borderWidth:       1,
    borderRadius:      16,
    padding:           14,
    flexDirection:     "row",
    justifyContent:    "space-between",
    alignItems:        "center",
  },

  skillCard: {
    borderWidth:  1,
    borderRadius: 18,
    padding:      14,
    marginTop:    14,
    overflow:     "hidden",
  },

  /* Mini stat boxes inside skill card */
  miniStat: {
    borderWidth:       1,
    borderRadius:      12,
    paddingVertical:   8,
    paddingHorizontal: 12,
    alignItems:        "center",
  },

  smallCta: {
    marginTop:         12,
    borderWidth:       1,
    borderRadius:      16,
    paddingVertical:   12,
    paddingHorizontal: 14,
    flexDirection:     "row",
    justifyContent:    "space-between",
    alignItems:        "center",
  },

  comingSoonPill: {
    borderWidth:       1,
    borderRadius:      999,
    paddingVertical:   10,
    paddingHorizontal: 12,
  },

  /* Graph */
  emptyGraph: {
    marginTop:      12,
    borderWidth:    1,
    borderRadius:   14,
    borderStyle:    "dashed",
    padding:        20,
    alignItems:     "center",
    justifyContent: "center",
  },

  graphLegend: {
    flexDirection:  "row",
    gap:            14,
    marginTop:      8,
    justifyContent: "center",
  },

  legendItem: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           5,
  },

  legendDot: {
    width:        7,
    height:       7,
    borderRadius: 999,
  },

  /* Elite insight */
  eliteInsight: {
    marginTop:    14,
    padding:      14,
    borderRadius: 16,
    borderWidth:  1,
  },

  eliteInsightLabel: {
    fontSize:      11,
    fontWeight:    "900",
    letterSpacing: 0.6,
    marginBottom:  6,
  },

  eliteInsightText: {
    fontSize:   14,
    lineHeight: 20,
    fontWeight: "700",
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
  },

  primaryBtn: {
    paddingVertical:   14,
    paddingHorizontal: 34,
    borderRadius:      16,
    width:             "100%",
    alignItems:        "center",
  },

  primaryBtnText: {
    color:      "#000",
    fontSize:   16,
    fontWeight: "900",
  },

  secondaryBtn: {
    marginTop:         12,
    paddingVertical:   14,
    paddingHorizontal: 34,
    borderRadius:      16,
    width:             "100%",
    alignItems:        "center",
    borderWidth:       1,
    borderColor:       "#fff",
    backgroundColor:   "transparent",
  },

  secondaryBtnText: {
    color:      "#fff",
    fontSize:   16,
    fontWeight: "900",
  },
});