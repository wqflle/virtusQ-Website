import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Stack, useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAppColors } from "../../lib/useAppColors";

/* =========================================================
   ELITE DETAILS SCREEN
   - Four metric breakdown: technique, posture, stability, consistency
   - Elite score is ALWAYS the average of those four metrics
   - Why-this-is-low explanations
   - Skill-specific session comparison
========================================================= */

type MetricKey = "technique" | "posture" | "stability" | "consistency";

export default function EliteDetailsScreen() {
  const colors = useAppColors();
  const params = useLocalSearchParams<any>();

  const skill         = String(params.skill ?? "").toLowerCase();
  const eliteTierLabel = String(params.eliteTierLabel ?? "—");

  /* -------------------------------
     PARSE ELITE MICRO DATA
  -------------------------------- */
  const eliteMicro = useMemo(() => {
    try {
      return typeof params.elite_micro_insights === "string"
        ? JSON.parse(params.elite_micro_insights)
        : params.elite_micro_insights ?? {};
    } catch {
      return {};
    }
  }, [params.elite_micro_insights]);

  /* -------------------------------
     NORMALIZED METRICS (0–100)
     Each metric derived from backend micro insights.
  -------------------------------- */
  const technique = normalize(
    eliteMicro.rep_cleanliness ??
    eliteMicro.technique ??
    eliteMicro.technique_score
  );

  const posture = normalize(
    eliteMicro.athletic_posture_score ??
    eliteMicro.posture ??
    eliteMicro.posture_score
  );

  const stability = normalize(
    eliteMicro.biomech_clean_score ??
    eliteMicro.platform_stability ??
    eliteMicro.stability,
    true  // force scale ×100 for 0–1 values
  );

  // Consistency = average of technique + posture + stability
  // (mirrors exactly what results.tsx computes)
  const consistencyParts = [technique, posture, stability].filter(
    (v): v is number => typeof v === "number"
  );

  const consistency =
    consistencyParts.length >= 1
      ? Math.round(
          consistencyParts.reduce((a, b) => a + b, 0) / consistencyParts.length
        )
      : null;

  /* -------------------------------
     ELITE SCORE = AVERAGE OF FOUR METRICS
     This is the single source of truth.
     It will always match the breakdown because
     it IS derived from the breakdown.
  -------------------------------- */
  const allFour = [technique, posture, stability, consistency].filter(
    (v): v is number => typeof v === "number"
  );

  const derivedEliteScore =
    allFour.length > 0
      ? Math.round(allFour.reduce((a, b) => a + b, 0) / allFour.length)
      : 0;

  /* -------------------------------
     TIER LABEL (derived from score so it's always in sync)
  -------------------------------- */
  const derivedTierLabel = getTierLabel(derivedEliteScore) ?? eliteTierLabel;

  /* -------------------------------
     METRICS ARRAY FOR RENDER
  -------------------------------- */
  const metrics: Array<{
    key: MetricKey;
    label: string;
    value: number | null;
    why: string;
  }> = [
    {
      key:   "technique",
      label: "Technique",
      value: technique,
      why:   explainWhy("technique", technique),
    },
    {
      key:   "posture",
      label: "Posture",
      value: posture,
      why:   explainWhy("posture", posture),
    },
    {
      key:   "stability",
      label: "Stability",
      value: stability,
      why:   explainWhy("stability", stability),
    },
    {
      key:   "consistency",
      label: "Consistency",
      value: consistency,
      why:   explainWhy("consistency", consistency),
    },
  ];

  /* -------------------------------
     SKILL-SPECIFIC SESSION COMPARISON
  -------------------------------- */
  const [comparison, setComparison] = useState<string | null>(null);

  useEffect(() => {
    if (!skill) return;

    const storageKey = `elite_last_rep_${skill}`;

    (async () => {
      try {
        const prevRaw = await AsyncStorage.getItem(storageKey);

        if (prevRaw) {
          const prev = JSON.parse(prevRaw);
          const diff = derivedEliteScore - Number(prev.eliteScore ?? 0);

          if (Math.abs(diff) >= 3) {
            setComparison(
              diff > 0
                ? `▲ Up ${diff} points vs your last ${skill} rep`
                : `▼ Down ${Math.abs(diff)} points vs your last ${skill} rep`
            );
          } else {
            setComparison(`≈ Similar to your last ${skill} rep`);
          }
        } else {
          setComparison(`This is your first recorded ${skill} rep`);
        }

        await AsyncStorage.setItem(
          storageKey,
          JSON.stringify({ eliteScore: derivedEliteScore, timestamp: Date.now() })
        );
      } catch (e) {
        console.log("Session comparison error:", e);
      }
    })();
  }, [derivedEliteScore, skill]);

  /* =========================================================
     RENDER
  ========================================================= */
  return (
    <>
      <Stack.Screen options={{ title: "Elite Breakdown" }} />

      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={{ paddingBottom: 140 }}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            Elite Score
          </Text>

          <View style={{ flexDirection: "row", alignItems: "baseline", gap: 8 }}>
            <Text style={[styles.score, { color: colors.text }]}>
              {derivedEliteScore}
            </Text>
            <Text style={{ color: colors.muted, fontWeight: "900" }}>
              / 100 · {derivedTierLabel}
            </Text>
          </View>

          {comparison && (
            <Text
              style={{
                color: comparison.startsWith("▲") ? "#22c55e" : comparison.startsWith("▼") ? "#ef4444" : colors.primary,
                marginTop: 8,
                fontWeight: "800",
              }}
            >
              {comparison}
            </Text>
          )}

          <Text style={{ color: colors.muted, marginTop: 10, lineHeight: 20 }}>
            Elite Score measures repeatability and precision — not effort or
            highlight plays. It is the average of the four metrics below.
          </Text>
        </View>

        {/* METRICS */}
        {metrics.map((m) => {
          const color = scoreColor(m.value);
          return (
            <View
              key={m.key}
              style={[
                styles.card,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <View style={styles.row}>
                <Text style={[styles.metricLabel, { color: colors.text }]}>
                  {m.label}
                </Text>
                <Text style={{ color, fontWeight: "900" }}>
                  {m.value != null ? `${m.value} / 100` : "—"}
                </Text>
              </View>

              {/* Score bar */}
              {m.value != null && (
                <View
                  style={[
                    styles.barTrack,
                    { backgroundColor: colors.border, marginTop: 10 },
                  ]}
                >
                  <View
                    style={[
                      styles.barFill,
                      {
                        width: `${m.value}%` as any,
                        backgroundColor: color,
                      },
                    ]}
                  />
                </View>
              )}

              <Text style={{ color: colors.muted, marginTop: 8, lineHeight: 19 }}>
                {m.why}
              </Text>
            </View>
          );
        })}

        {/* HOW TO IMPROVE */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
              borderColor: colors.primary + "55",
              borderLeftWidth: 4,
              borderLeftColor: colors.primary,
            },
          ]}
        >
          <Text
            style={{
              color: colors.primary,
              fontWeight: "900",
              fontSize: 11,
              letterSpacing: 0.8,
              textTransform: "uppercase",
            }}
          >
            How to raise this score
          </Text>
          <Text
            style={{
              color: colors.text,
              marginTop: 10,
              lineHeight: 20,
              fontWeight: "800",
            }}
          >
            Repeat this rep slowly until execution looks identical 10–15 times
            in a row. Elite performance comes from removing variance — not
            adding force.
          </Text>
          <Text style={{ color: colors.muted, marginTop: 8, lineHeight: 19 }}>
            Your lowest metric is where to start. Fix one thing at a time.
          </Text>
        </View>

        {/* BACK BUTTON */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={[
            styles.backBtn,
            { backgroundColor: colors.background, borderColor: colors.border },
          ]}
          activeOpacity={0.85}
        >
          <Ionicons name="arrow-back" size={18} color={colors.text} />
          <Text style={{ color: colors.text, fontWeight: "900" }}>
            Back to Results
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
}

/* =========================================================
   HELPERS
========================================================= */

/**
 * Normalize a raw backend value to a 0–100 integer.
 * - If value is 0–1: multiply by 100
 * - If value is already 0–100: use as-is
 * - forceScale100: always multiply by 100 (for known 0–1 fields)
 */
function normalize(v: any, forceScale100 = false): number | null {
  if (v == null) return null;
  const n = Number(v);
  if (!Number.isFinite(n)) return null;

  const score = forceScale100
    ? Math.round(n * 100)
    : n <= 1.0
    ? Math.round(n * 100)
    : Math.round(n);

  return Math.max(0, Math.min(100, score));
}

function scoreColor(v: number | null): string {
  if (v == null) return "#888";
  if (v >= 80) return "#22c55e";
  if (v >= 60) return "#facc15";
  return "#ef4444";
}

function getTierLabel(score: number): string {
  if (score >= 92) return "WORLD CLASS";
  if (score >= 82) return "PRO";
  if (score >= 65) return "ELITE";
  if (score >= 45) return "SOLID";
  return "DEVELOPING";
}

function explainWhy(metric: MetricKey, v: number | null): string {
  if (v == null) {
    return "Not enough signal yet — record more clean reps to unlock this metric.";
  }

  if (v >= 80) {
    return "This area is elite-level. Focus on maintaining it under fatigue and game pressure.";
  }

  if (v >= 60) {
    const mid: Record<MetricKey, string> = {
      technique:
        "Execution is mostly clean, but small timing or angle drift appears across frames.",
      posture:
        "Athletic base is present, but depth or trunk angle varies slightly rep to rep.",
      stability:
        "Platform is mostly controlled, but micro-movements reduce repeatability.",
      consistency:
        "Good reps exist, but you cannot yet reproduce them reliably on demand.",
    };
    return mid[metric];
  }

  const low: Record<MetricKey, string> = {
    technique:
      "Rep mechanics change significantly across frames — slow down and lock one repeatable motion before adding pace.",
    posture:
      "Base height and balance shift during contact — set your posture earlier and hold it through the pass.",
    stability:
      "Platform or body moves too much during contact — stabilize first, then worry about speed.",
    consistency:
      "Execution varies too much rep to rep — elite scores require nearly identical mechanics every time.",
  };
  return low[metric];
}

/* =========================================================
   STYLES
========================================================= */
const styles = StyleSheet.create({
  container: { flex: 1, padding: 22 },
  header:    { marginBottom: 22 },
  title:     { fontSize: 30, fontWeight: "900" },
  score:     { fontSize: 38, fontWeight: "900" },

  card: {
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
  },

  row: {
    flexDirection:  "row",
    justifyContent: "space-between",
    alignItems:     "center",
  },

  metricLabel: { fontSize: 16, fontWeight: "900" },

  barTrack: {
    height:       8,
    borderRadius: 999,
    overflow:     "hidden",
  },

  barFill: {
    height:       "100%",
    borderRadius: 999,
  },

  backBtn: {
    marginTop:      6,
    borderWidth:    1,
    borderRadius:   16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection:  "row",
    alignItems:     "center",
    justifyContent: "center",
    gap: 10,
  },
});
