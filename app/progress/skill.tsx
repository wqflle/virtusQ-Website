import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  Platform,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, router, useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Svg, { Polyline, Circle } from "react-native-svg";

import { useAppColors } from "../../lib/useAppColors";
import { useEntitlements } from "../../lib/useEntitlements";
import { auth } from "../../lib/auth";

/* =====================================================
   TYPES
===================================================== */
type RepQuality = "bad" | "situational" | "good";

type Point = {
  c01: number; // normalized 0..1 score (higher = better)
  created_at: string;
  quality?: RepQuality;
};

type HistoryItem = {
  id: string;
  skill: string;
  quality: RepQuality;
  skill_confidence: number;
  elite_score?: number;
  result_payload?: any;
  created_at: string;
};

/* =====================================================
   HELPERS
===================================================== */
const clamp01 = (n: number) =>
  Math.max(0, Math.min(1, Number.isFinite(n) ? n : 0));

const clamp = (n: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, Number.isFinite(n) ? n : lo));

function formatSkillTitle(raw: string) {
  const s = String(raw || "").trim();
  if (!s) return "Skill Progress";
  return s.toUpperCase();
}

function isValidISO(iso: any) {
  const d = new Date(String(iso));
  return !Number.isNaN(d.getTime());
}

function getQualityColor(q: RepQuality | undefined, colors: any) {
  if (q === "good") return colors.primary;
  if (q === "situational") return "#F5B942"; // amber
  if (q === "bad") return "#E5533D"; // red
  return colors.text; // fallback
}

/* -------------------------------
   ELITE SCORE EXTRACTION
-------------------------------- */
function geteliteScoreFromHistory(h: HistoryItem): number {
  const elite =
    Number(h.elite_score) ||
    Number(h.result_payload?.elite_score) ||
    0;
  return clamp(elite, 0, 100);
}

/* -------------------------------
   STATS (no Math.std in JS)
-------------------------------- */
function mean(arr: number[]) {
  if (!arr.length) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function stdDev(arr: number[]) {
  if (arr.length < 2) return 0;
  const m = mean(arr);
  const v = arr.reduce((s, x) => s + (x - m) * (x - m), 0) / (arr.length - 1);
  return Math.sqrt(Math.max(0, v));
}

function median(arr: number[]) {
  if (!arr.length) return 0;
  const a = [...arr].sort((x, y) => x - y);
  const mid = Math.floor(a.length / 2);
  return a.length % 2 ? a[mid] : (a[mid - 1] + a[mid]) / 2;
}

/* -------------------------------
   TREND / PREDICTION (keep existing logic)
   - Old slope: first -> last
   - Added regression slope (more stable)
-------------------------------- */
// slope (% per rep) from first -> last (existing)
function computeSlopePctPerRep(data01: number[]) {
  const n = data01.length;
  if (n < 2) return 0;
  const first = data01[0];
  const last = data01[n - 1];
  const slope01 = (last - first) / Math.max(1, n - 1);
  return Math.round(slope01 * 1000) / 10; // 0.1% precision
}

// prediction % using slope (existing)
function computePredictionPct(data01: number[], slopePctPerRep: number) {
  if (!data01.length) return 0;
  const last = data01[data01.length - 1];
  const slope01 = slopePctPerRep / 100;
  const pred01 = clamp01(last + slope01 * 5);
  return Math.round(pred01 * 100);
}

/*
  Regression slope (adds stability; does NOT remove old logic)
  Returns slope in % per rep (same unit as computeSlopePctPerRep).
*/
function computeSlopePctPerRepRegression(data01: number[]) {
  const n = data01.length;
  if (n < 2) return 0;

  // x = 0..n-1, y = data01
  let sumX = 0;
  let sumY = 0;
  let sumXX = 0;
  let sumXY = 0;

  for (let i = 0; i < n; i++) {
    const x = i;
    const y = data01[i];
    sumX += x;
    sumY += y;
    sumXX += x * x;
    sumXY += x * y;
  }

  const denom = n * sumXX - sumX * sumX;
  if (Math.abs(denom) < 1e-9) return 0;

  const slope01 = (n * sumXY - sumX * sumY) / denom; // per rep (01 scale)
  return Math.round(slope01 * 1000) / 10; // 0.1% precision
}

/*
  Slightly improved prediction: use regression slope if possible, and dampen
  extreme slopes to avoid silly "rocket" predictions.
  Still uses existing computePredictionPct under the hood.
*/
function computePredictionPctSmart(data01: number[]) {
  if (!data01.length) return 0;

  const slopeOld = computeSlopePctPerRep(data01);
  const slopeReg = computeSlopePctPerRepRegression(data01);

  // blend (keep compatibility, but smoother)
  const blended = data01.length >= 6 ? 0.35 * slopeOld + 0.65 * slopeReg : slopeOld;

  // dampen extreme jumps (avoid UI looking fake)
  const dampened = clamp(blended, -2.5, 2.5);

  return computePredictionPct(data01, dampened);
}

/* -------------------------------
   MOMENTUM LABELS (as discussed)
-------------------------------- */
function getMomentumLabel(slopePctPerRep: number) {
  if (slopePctPerRep > 0.4) return "Strong momentum";
  if (slopePctPerRep > 0.1) return "Improving";
  if (slopePctPerRep < -0.4) return "Declining — Refocus";
  if (slopePctPerRep < -0.1) return "Slight Dip";
  return "Stable";
}

function getMomentumEmoji(slopePctPerRep: number) {
  if (slopePctPerRep > 0.4) return "🔥";
  if (slopePctPerRep > 0.1) return "📈";
  if (slopePctPerRep < -0.4) return "⚠️";
  if (slopePctPerRep < -0.1) return "📉";
  return "🟰";
}

/* -------------------------------
   PERFORMANCE TIERS (as discussed)
-------------------------------- */
type TierKey = "Elite" | "Advanced" | "Competitive" | "Developing" | "Foundational";

function tierFromAvgElite(avgElite: number): TierKey {
  if (avgElite >= 90) return "Elite";
  if (avgElite >= 80) return "Advanced";
  if (avgElite >= 70) return "Competitive";
  if (avgElite >= 60) return "Developing";
  return "Foundational";
}

function tierHint(tier: TierKey) {
  if (tier === "Elite") return "Maintain tempo + pressure reps.";
  if (tier === "Advanced") return "Consistency under fatigue = next jump.";
  if (tier === "Competitive") return "Clean execution + repeatable contact.";
  if (tier === "Developing") return "Simplify mechanics, stabilize posture.";
  return "Start with calm reps and clean contact.";
}

/* -------------------------------
   ELITE-ONLY ANALYTICS
-------------------------------- */
/*
  Volatility: std dev of elite scores (0..1 scale).
  Consistency score: 100 - volatility * 200 (clamped).
  This matches what we discussed, but safely implemented.
*/
function computeVolatility01(data01: number[]) {
  return stdDev(data01); // since data01 is already 0..1, stddev is also 0..~0.5
}

function computeConsistencyScore(data01: number[]) {
  const vol = computeVolatility01(data01);
  const score = 100 - Math.round(vol * 200);
  return clamp(score, 0, 100);
}

/*
  Optional: pull micro insights out of result_payload if present.
  We’ll compute a median across last N reps.
*/
function extractEliteMicroFromHistory(h: HistoryItem): Record<string, number> | null {
  const m = h.result_payload?.elite_micro_insights;
  if (!m || typeof m !== "object") return null;

  const out: Record<string, number> = {};
  for (const k of Object.keys(m)) {
    const v = Number(m[k]);
    if (Number.isFinite(v)) out[k] = v;
  }
  return Object.keys(out).length ? out : null;
}

function medianMicroInsights(micros: Record<string, number>[]) {
  const keys = new Set<string>();
  micros.forEach((m) => Object.keys(m).forEach((k) => keys.add(k)));

  const out: Record<string, number> = {};
  keys.forEach((k) => {
    const vals = micros.map((m) => m[k]).filter((v) => Number.isFinite(v));
    if (vals.length) out[k] = Math.round(median(vals) * 10) / 10;
  });

  return out;
}

function formatKeyLabel(k: string) {
  return String(k)
    .replaceAll("_", " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/* =====================================================
   SCREEN
===================================================== */
export default function SkillProgressScreen() {
  const colors = useAppColors();
  const params = useLocalSearchParams<any>();

  // Entitlements (Pro vs Elite)
  const ent = useEntitlements() as any;
  const isElite = !!ent?.isElite;
  const isPro = !!ent?.isPro;
  const canSeeAdvanced = isElite; // Elite-only analytics
  const canSeeProgress = isElite || isPro; // Your app already locks out free users elsewhere

  const skillParamRaw = String(params.skill || "");
  const skillKeyLower = skillParamRaw.trim().toLowerCase();
  const title = formatSkillTitle(skillParamRaw);

  // Optional params (if you ever decide to pass them in)
  const predPctParam = Number(params.predPct ?? NaN);
  const slopeParam = Number(params.slope ?? NaN);

  const pointsFromParams: Point[] = useMemo(() => {
    try {
      if (params.points == null) return [];
      const raw = String(params.points || "[]");
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }, [params.points]);

  const [pointsFromStorage, setPointsFromStorage] = useState<Point[]>([]);
  const [loading, setLoading] = useState(false);

  // Store extra Elite-only meta derived from history payloads
  const [eliteMicro, setEliteMicro] = useState<Record<string, number> | null>(null);

  const loadFromStorage = useCallback(async () => {
    try {
      setLoading(true);
      const uid = auth.currentUser?.uid;
      if (!uid) {
        setPointsFromStorage([]);
        setEliteMicro(null);
        return;
      }

      let raw = await AsyncStorage.getItem(`analysis_history:${uid}`);
      if (!raw) raw = await AsyncStorage.getItem("analysis_history");

      const parsed = raw ? JSON.parse(raw) : [];
      const arr: HistoryItem[] = Array.isArray(parsed) ? parsed : [];

      // Filter to this skill
      const relevant = arr
        .filter((h) => String(h.skill || "").trim().toLowerCase() === skillKeyLower)
        .filter((h) => isValidISO(h.created_at))
        .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

      // Build graph points from elite score
      const filtered = relevant.map((h) => {
        const elite = geteliteScoreFromHistory(h);
        return {
          c01: clamp01(elite / 100),
          created_at: String(h.created_at),
          quality: h.quality,
        };
      });

      setPointsFromStorage(filtered);

      // Elite-only: compute median micro insights over last 14 relevant reps
      if (canSeeAdvanced) {
        const lastWindow = relevant.slice(-14);
        const micros = lastWindow
          .map((h) => extractEliteMicroFromHistory(h))
          .filter(Boolean) as Record<string, number>[];

        setEliteMicro(micros.length ? medianMicroInsights(micros) : null);
      } else {
        setEliteMicro(null);
      }
    } catch {
      setPointsFromStorage([]);
      setEliteMicro(null);
    } finally {
      setLoading(false);
    }
  }, [skillKeyLower, canSeeAdvanced]);

  // Load on first mount if no params points
  useEffect(() => {
    if (!pointsFromParams.length) loadFromStorage();
  }, [pointsFromParams.length, loadFromStorage]);

  // ALSO refresh whenever user navigates back to this screen
  useFocusEffect(
    useCallback(() => {
      if (!pointsFromParams.length) loadFromStorage();
    }, [pointsFromParams.length, loadFromStorage])
  );

  // Prefer params if present
  const pointsAll: Point[] = pointsFromParams.length ? pointsFromParams : pointsFromStorage;

  // ✅ EXACTLY the last 14 reps (rolling window)
  const pointsWindow: Point[] = useMemo(() => {
    const cleaned = pointsAll
      .filter((p) => isValidISO(p.created_at))
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

    return cleaned.slice(-14);
  }, [pointsAll]);

  const data = useMemo(
    () =>
      pointsWindow.map((p) => ({
        c01: clamp01(p.c01 ?? 0),
        created_at: String(p.created_at),
        quality: p.quality as RepQuality | undefined,
      })),
    [pointsWindow]
  );

  const data01 = useMemo(() => data.map((d) => d.c01), [data]);

  // Keep existing slope logic, but optionally improved
  const slopePct = useMemo(() => {
    if (Number.isFinite(slopeParam)) return slopeParam;
    return computeSlopePctPerRep(data01);
  }, [slopeParam, data01]);

  // Smarter prediction (keeps existing param override)
  const predPct = useMemo(() => {
    if (Number.isFinite(predPctParam)) return predPctParam;
    return computePredictionPctSmart(data01);
  }, [predPctParam, data01]);

  // Added metrics
  const avgElite = useMemo(() => {
    if (!data01.length) return 0;
    return Math.round(mean(data01) * 100);
  }, [data01]);

  const tier = useMemo(() => tierFromAvgElite(avgElite), [avgElite]);

  const volatility01 = useMemo(() => computeVolatility01(data01), [data01]);
  const volatilityPct = useMemo(() => Math.round(volatility01 * 1000) / 10, [volatility01]); // 0.1% precision
  const consistencyScore = useMemo(() => computeConsistencyScore(data01), [data01]);

  const momentumLabel = useMemo(() => getMomentumLabel(slopePct), [slopePct]);
  const momentumEmoji = useMemo(() => getMomentumEmoji(slopePct), [slopePct]);

  /* -------------------------------
     Animations
  -------------------------------- */
  const reveal = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    reveal.setValue(0);
    Animated.timing(reveal, {
      toValue: 1,
      duration: 520,
      useNativeDriver: true,
    }).start();
  }, [reveal, data01.length, skillKeyLower]);

  const opacity = reveal.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });
  const translateY = reveal.interpolate({
    inputRange: [0, 1],
    outputRange: [10, 0],
  });

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: 120 }}
      showsVerticalScrollIndicator={false}
    >
      {/* TOP ROW */}
      <View style={styles.topRow}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => router.back()}
          style={[
            styles.backBtn,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={{ color: colors.text, fontWeight: "900" }}>Back</Text>
        </TouchableOpacity>

        {/* Tier Badge (Pro + Elite) */}
        {canSeeProgress && (
          <View
            style={[
              styles.tierBadge,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Text style={{ color: colors.muted, fontWeight: "900", fontSize: 11 }}>
              TIER
            </Text>
            <Text style={{ color: colors.text, fontWeight: "900" }}>{tier}</Text>
          </View>
        )}
      </View>

      {/* TITLE */}
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>

      {/* META */}
      <Text style={{ color: colors.muted, marginTop: 6, lineHeight: 18 }}>
        Last 14 reps · Prediction:{" "}
        <Text style={{ color: colors.text, fontWeight: "900" }}>{predPct}%</Text>
        {"  "}·{"  "}Trend:{" "}
        <Text style={{ color: colors.text, fontWeight: "900" }}>
          {slopePct === 0 ? "—" : `${slopePct > 0 ? "▲" : "▼"} ${Math.abs(slopePct)}%/rep`}
        </Text>
      </Text>

      {/* Momentum language (Pro + Elite) */}
 {canSeeProgress && (
  <View
    style={[
      styles.momentumRow,
      { backgroundColor: colors.card, borderColor: colors.border },
    ]}
  >
    <View style={{ flex: 1, paddingRight: 8 }}>
      <Text
        style={{ color: colors.text, fontWeight: "900" }}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {momentumEmoji} {momentumLabel}
      </Text>
    </View>

    <Text
      style={{ color: colors.muted, fontWeight: "900" }}
      numberOfLines={1}
    >
      Avg Elite:{" "}
      <Text style={{ color: colors.text }}>{avgElite}/100</Text>
    </Text>
  </View>
)}


      {/* GRAPH CARD */}
      <Animated.View
        style={[
          styles.card,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            opacity,
            transform: [{ translateY }],
          },
        ]}
      >
        <View style={styles.cardHeaderRow}>
          <Text style={[styles.cardLabel, { color: colors.muted }]}>
  ELITE TREND
</Text>


          {/* Tier hint (Pro + Elite) */}
          {canSeeProgress && (
            <View style={[styles.hintPill, { borderColor: colors.border }]}>
              <Text
  style={{ color: colors.muted, fontWeight: "900", fontSize: 11 }}
  numberOfLines={1}
  ellipsizeMode="tail"
>
  {tierHint(tier)}
</Text>

            </View>
          )}
        </View>

        {loading && !data.length ? (
          <Text style={{ color: colors.muted, marginTop: 12 }}>Loading…</Text>
        ) : (
          <BigGraph points={data} colors={colors} />
        )}



       

        {/* Metrics row (Pro + Elite) */}
        {canSeeProgress && (
          <View style={[styles.metricsRow, { borderColor: colors.border }]}>
            <View style={[styles.metricBox, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <Text style={[styles.metricValue, { color: colors.text }]}>{avgElite}</Text>
              <Text style={{ color: colors.muted, fontWeight: "900" }}>Avg Elite</Text>
            </View>

            <View style={[styles.metricBox, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <Text style={[styles.metricValue, { color: colors.text }]}>{predPct}</Text>
              <Text style={{ color: colors.muted, fontWeight: "900" }}>Predicted</Text>
            </View>

            <View style={[styles.metricBox, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <Text style={[styles.metricValue, { color: colors.text }]}>
                {slopePct === 0 ? "—" : `${slopePct > 0 ? "+" : "-"}${Math.abs(slopePct)}`}
              </Text>
              <Text style={{ color: colors.muted, fontWeight: "900" }}>%/rep</Text>
            </View>
          </View>
        )}
      </Animated.View>

      {/* ELITE-ONLY: Advanced Analytics */}
      {canSeeAdvanced && (
        <Animated.View
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              opacity,
              transform: [{ translateY }],
            },
          ]}
        >
          <View style={styles.cardHeaderRow}>
            <Text style={[styles.cardLabel, { color: colors.muted }]}>ELITE ANALYTICS</Text>
            <View style={[styles.elitePill, { borderColor: colors.primary + "55" }]}>
              <Text style={{ color: colors.primary, fontWeight: "900", fontSize: 11 }}>
                ELITE
              </Text>
            </View>
          </View>

          <View style={styles.eliteGrid}>
            <View style={[styles.metricBox, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <Text style={[styles.metricValue, { color: colors.text }]}>{consistencyScore}</Text>
             <Text
  style={{ color: colors.muted, fontWeight: "900", textAlign: "center" }}
  numberOfLines={1}
  adjustsFontSizeToFit
>
  Consistency
</Text>

            </View>

            <View style={[styles.metricBox, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <Text style={[styles.metricValue, { color: colors.text }]}>{volatilityPct}</Text>
              <Text style={{ color: colors.muted, fontWeight: "900" }}>Volatility</Text>
            </View>

            <View style={[styles.metricBox, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <Text
  style={[
    styles.metricValue,
    { color: colors.text, fontSize: tier.length > 10 ? 16 : 20 }
  ]}
  numberOfLines={1}
  adjustsFontSizeToFit
>
  {tier}
</Text>

              <Text style={{ color: colors.muted, fontWeight: "900" }}>Tier</Text>
            </View>
          </View>

          <Text style={{ color: colors.muted, marginTop: 12, lineHeight: 20 }}>
            Consistency reflects how stable your Elite Score is across reps. Volatility is the “noise” factor — lower is better.
          </Text>

          {/* Micro insights (optional, only if payload provides) */}
          <View style={{ marginTop: 14 }}>
            <Text style={{ color: colors.text, fontWeight: "900", marginBottom: 6 }}>
              Micro Insights
            </Text>

            {!eliteMicro ? (
              <Text style={{ color: colors.muted, lineHeight: 20 }}>
                No micro-insight data found yet. (This appears once your inference is saving elite_micro_insights into history.)
              </Text>
            ) : (
              <View style={styles.microList}>
                {Object.keys(eliteMicro).map((k) => (
                  <View
                    key={k}
                    style={[
                      styles.microRow,
                      { backgroundColor: colors.background, borderColor: colors.border },
                    ]}
                  >
                    <Text style={{ color: colors.text, fontWeight: "900" }}>
                      {formatKeyLabel(k)}
                    </Text>
                    <Text style={{ color: colors.muted, fontWeight: "900" }}>
                      {eliteMicro[k]}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </Animated.View>
      )}

      {/* NOTES */}
      <Animated.View
        style={[
          styles.card,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            opacity,
            transform: [{ translateY }],
          },
        ]}
      >
        <Text style={[styles.cardLabel, { color: colors.muted }]}>NOTES</Text>

        <Text style={{ color: colors.text, marginTop: 10, lineHeight: 22 }}>
          If your Elite Score line is flat or trending down, simplify your reps:
          slower tempo, cleaner contact, fewer variables. Consistency beats complexity.
        </Text>

        {canSeeProgress && (
          <Text style={{ color: colors.muted, marginTop: 10, lineHeight: 20 }}>
            Tip: Chase stability first (consistency), then increase speed. Smooth reps scale better than rushed reps.
          </Text>
        )}

        {!data.length && (
          <Text style={{ color: colors.muted, marginTop: 10, lineHeight: 20 }}>
            No data yet — analyze a couple clips and this screen will fill in.
          </Text>
        )}
      </Animated.View>
    </ScrollView>
  );
}

/* =====================================================
   GRAPH
   Requirements:
   ✅ Shows last 14 reps (data already sliced)
   ✅ Right edge ALWAYS clean: newest rep at width - pad
   ✅ Left edge fades/clips only
   ✅ Dots + segments colored by rep quality
   ✅ Dot radius adapts with count (even though max is 14, we keep it flexible)
===================================================== */
function BigGraph({
  points,
  colors,
}: {
  points: { c01: number; created_at: string; quality?: RepQuality }[];
  colors: any;
}) {
  const { width: screenW } = Dimensions.get("window");
  const width = Math.min(360, Math.max(300, screenW - 48));
  const height = 170;
  const pad = 8;
const yAxisWidth = 28; // space reserved for Y labels

  const labelX = 6;
const labelStyle = {
  position: "absolute" as const,
  left: labelX,
  fontSize: 11,
  fontWeight: "900" as const,
  color: colors.muted,
};

  const rightGap = 14;

  if (!points || points.length < 2) {
    return (
      <Text style={{ color: colors.muted, marginTop: 12 }}>
        Not enough data yet
      </Text>
    );
  }

  const n = points.length;

  // Even though window is 14, keep nice scaling:
  // 2..14 => 5.0 down to 3.2
  const r = Math.max(3.2, 5.0 - (Math.min(14, n) - 2) * (1.8 / 12));

  const pts = points.map((p, i) => {
    // ✅ keeps right edge perfect
   const usableWidth = width - pad - rightGap - yAxisWidth;
const x =
  pad +
  yAxisWidth +
  (i / Math.max(1, n - 1)) * (usableWidth - pad);

    const y = pad + (1 - clamp01(p.c01)) * (height - pad * 2);
    return { x, y };
  });

  // Segment polylines, colored by the "newer rep" quality
  const segments: React.ReactNode[] = [];
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1];
    const b = pts[i];
    const q = points[i]?.quality;
    const stroke = getQualityColor(q, colors);

    segments.push(
      <Polyline
        key={`seg-${i}`}
        points={`${a.x},${a.y} ${b.x},${b.y}`}
        fill="none"
        stroke={stroke}
        strokeWidth={3}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    );
  }

  // Left-edge fade zone (ONLY left side fades)
  const fadeStart = pad + 18;
  const fadeEnd = pad;

return (
  <View style={{ marginTop: 14, position: "relative" }}>

      <Svg width={width} height={height}>
        {/* baseline */}
        <Polyline
          points={`${pad + yAxisWidth},${height - pad} ${width - pad},${height - pad}`}

          fill="none"
          stroke={colors.border}
          strokeWidth={1}
        />
        {/* midline */}
        <Polyline
          points={`${pad},${height * 0.5} ${width - pad},${height * 0.5}`}
          fill="none"
          stroke={colors.border}
          strokeWidth={1}
          strokeDasharray="4 6"
        />

        {/* segments */}
        {segments}

        {/* dots */}
        {pts.map((p, i) => {
          const q = points[i]?.quality;
          const fill = getQualityColor(q, colors);

          // ✅ Fade ONLY on the left edge
          let opacity = 1;
          if (p.x < fadeStart) {
            opacity = clamp01((p.x - fadeEnd) / (fadeStart - fadeEnd));
          }

          return (
            <Circle
              key={`dot-${i}`}
              cx={p.x}
              cy={p.y}
              r={r}
              fill={fill}
              opacity={opacity}
            />
          );
        })}
      </Svg>

{/* Y Axis Labels */}
<Text style={[labelStyle, { top: pad - 4 }]}>100</Text>

<Text
  style={[
    labelStyle,
    { top: height * 0.5 - 6 },
  ]}
>
  50
</Text>

<Text
  style={[
    labelStyle,
    { top: height - pad - 12 },
  ]}
>
  0
</Text>
   
    </View>
  );
}

/* =====================================================
   STYLES
===================================================== */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },

topRow: {
  marginTop: Platform.select({ ios: 14, android: 18, default: 16 }),

    marginBottom: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },


  backBtn: {
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },

  tierBadge: {
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },

  title: {
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: 0.2,
    marginTop: 6,
  },

  momentumRow: {
    marginTop: 18,
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  card: {
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    marginTop: 16,
    overflow: "hidden",
  },

  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 10,
  },

  cardLabel: {
    fontWeight: "900",
    letterSpacing: 0.4,
    fontSize: 12,
  },

hintPill: {
  borderWidth: 1,
  borderRadius: 999,
  paddingVertical: 6,
  paddingHorizontal: 10,
  maxWidth: "60%",
  flexShrink: 1,
},


  legendRow: {
    marginTop: 12,
    flexDirection: "row",
    gap: 14,
  },

  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
  },

  metricsRow: {
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    flexDirection: "row",
    gap: 12,
  },

  metricBox: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  metricValue: {
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 4,
  },

  elitePill: {
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },

  eliteGrid: {
    marginTop: 12,
    flexDirection: "row",
    gap: 12,
  },

  microList: {
    marginTop: 6,
    gap: 10,
  },

  microRow: {
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
