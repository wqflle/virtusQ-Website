import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Pressable,
  Modal,
  Platform,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAppColors } from "../../lib/useAppColors";
import { Stack } from "expo-router";
import { getHistoryKey } from "../../lib/userStorage";
import { v4 as uuidv4 } from 'uuid';
import { getTierProgress } from "../../lib/performanceTier";
import { getAverageEliteScore } from "../../lib/performanceStats";

/* ===============================
   ✅ DAILY FOCUS STORAGE
================================ */
import AsyncStorage from "@react-native-async-storage/async-storage";

/* ===============================
   ✅ ENTITLEMENTS (ELITE MICRO INSIGHT)
================================ */
import { useEntitlements } from "../../lib/useEntitlements";

/* =========================================================
   ✅ ELITE SCORING MACHINE (FRONTEND ONLY)
   - Pure UI logic
   - Does NOT affect inference
========================================================= */

function computeeliteScore(params: {
  quality: string;
  qualityConf: number;
  eliteMicro?: any;
}) {
  const { quality, qualityConf, eliteMicro } = params;

  const repCleanliness = Number(eliteMicro?.rep_cleanliness ?? 0);
  const technique =
    Number.isFinite(repCleanliness) && repCleanliness > 0
      ? repCleanliness
      : 50;

  const posture = Number(eliteMicro?.athletic_posture_score ?? 60);

  const platformStability =
    eliteMicro?.platform_stability != null
      ? Number(eliteMicro.platform_stability) * 100
      : null;

  const timing =
    eliteMicro?.timing_consistency != null
      ? Number(eliteMicro.timing_consistency) * 100
      : null;

  const angle =
    eliteMicro?.platform_angle_consistency != null
      ? Number(eliteMicro.platform_angle_consistency) * 100
      : null;

  const contact =
    eliteMicro?.contact_height_consistency != null
      ? Number(eliteMicro.contact_height_consistency) * 100
      : null;

  const consistencyParts = [angle, timing, platformStability, contact].filter(
    (v): v is number => typeof v === "number"
  );

  const consistency =
    consistencyParts.length > 0
      ? consistencyParts.reduce((a, b) => a + b, 0) / consistencyParts.length
      : 0;

  const stability =
    platformStability != null && contact != null
      ? 0.6 * platformStability + 0.4 * contact
      : platformStability ?? contact ?? 0;

  const qualityBoost =
    quality === "good" ? 8 : quality === "situational" ? 0 : -8;

  const overall =
    0.34 * technique +
    0.22 * consistency +
    0.16 * stability +
    0.14 * posture +
    0.10 * qualityConf * 100 +
    qualityBoost;

  return Math.max(0, Math.min(100, Math.round(overall)));
}

function eliteTier(score: number) {
  if (score >= 92) return "WORLD CLASS";
  if (score >= 82) return "PRO";
  if (score >= 65) return "ELITE";
  if (score >= 45) return "SOLID";
  return "DEVELOPING";
}

function resolvedQuality(
  rawQuality: string,
  eliteScore: number,
  skillConf: number
): "good" | "situational" | "bad" {
  if (eliteScore >= 80 && skillConf >= 70) return "good";
  if (eliteScore >= 60 && rawQuality === "bad") return "situational";
  return rawQuality as any;
}

/* =========================================================
   RESULTS SCREEN
========================================================= */
export default function ResultsScreen() {
  const colors = useAppColors();
  const params = useLocalSearchParams<any>();

  const payload = useMemo(() => {
    if (!params?.payload) return null;
    try {
      return JSON.parse(params.payload);
    } catch (e) {
      console.warn("Failed to parse payload", e);
      return null;
    }
  }, [params?.payload]);

  const repId = payload?.rep_id ?? params.rep_id ?? null;
  const isFromHistory = params?.fromHistory === "true";
  const hasSavedRef = useRef(false);

  /* -------------------------------
     ENTITLEMENTS
  -------------------------------- */
  const ent: any = useEntitlements?.() as any;
  const isElite = Boolean(ent?.isElite);
  const isPro = Boolean(ent?.isPro);
  const canAccessEliteInsight = isElite;

  /* -------------------------------
     EXPLAINER STATE
  -------------------------------- */
  const [openExplainer, setOpenExplainer] = useState<
    "skill" | "skill_conf" | "quality" | null
  >(null);

  const [avgEliteScore, setAvgEliteScore] = useState(0);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [feedbackChoice, setFeedbackChoice] = useState<null | boolean>(null);

  useEffect(() => {
    (async () => {
      const avg = await getAverageEliteScore();
      setAvgEliteScore(avg);
    })();
  }, []);

  /* -------------------------------
     ROUTE PARAMS
  -------------------------------- */
  const skill = params.skill ?? payload?.skill ?? "";
  const quality = params.quality ?? payload?.quality ?? "";
  const skill_confidence = params.skill_confidence ?? payload?.skill_confidence ?? 0;
  const quality_confidence = params.quality_confidence ?? payload?.quality_confidence ?? 0;
  const primary_fix = params.primary_fix ?? payload?.primary_fix ?? "";

  const parsedEliteMicro = useMemo(() => {
    const source = payload?.elite_micro_insights;
    if (!source) return undefined;
    try {
      return typeof source === "string" ? JSON.parse(source) : source;
    } catch (e) {
      console.warn("Failed to parse elite_micro_insights", e);
      return undefined;
    }
  }, [payload]);

  console.log("RAW elite_micro_insights:", payload?.elite_micro_insights ?? params?.elite_micro_insights);
  console.log("PARSED elite_micro:", parsedEliteMicro);
  console.log("PAYLOAD KEYS:", Object.keys(payload || {}));

  // Defensive parsing — backend sends a single confidence value (0–1)
  const backendConf01 = useMemo(() => {
    const raw = payload?.confidence ?? params.confidence ?? 0;
    const n = Number(raw);
    return Number.isFinite(n) ? n : 0;
  }, [payload?.confidence, params.confidence]);

  const skillConf01 = backendConf01;
  const qualityConf01 = backendConf01;
  const skillConf = Math.round(skillConf01 * 100);
  const qualityConf = Math.round(qualityConf01 * 100);

  /* -------------------------------
     COLORS / FLAGS
  -------------------------------- */
  const rawQualityValue = String(quality || "").toLowerCase();
  const skillValue = String(skill || "");
  const hasRealAnalysis =
    skillValue &&
    skillValue.trim().length > 0 &&
    skillValue.toLowerCase() !== "unknown";

  /* =========================================================
     COMPUTED VALUES — ORDER MATTERS:
     1. eliteBreakdown
     2. eliteScore  (depends on eliteBreakdown)
     3. resolvedQualityValue  (depends on eliteScore)
     4. reconciledQuality  (depends on resolvedQualityValue + eliteScore)
     5. eliteTierLabel  (depends on eliteScore)
  ========================================================= */

  // 1. eliteBreakdown
  const eliteBreakdown = useMemo(() => {
    if (!parsedEliteMicro || typeof parsedEliteMicro !== "object") return null;

    const technique = Math.round(
      Number(
        parsedEliteMicro.rep_cleanliness ??
        parsedEliteMicro.technique ??
        parsedEliteMicro.technique_score ??
        0
      )
    );

    const posture = Math.round(
      Number(
        parsedEliteMicro.athletic_posture_score ??
        parsedEliteMicro.posture ??
        parsedEliteMicro.posture_score ??
        0
      )
    );

    const stability = Math.round(
      Number(
        parsedEliteMicro.biomech_clean_score ??
        parsedEliteMicro.platform_stability ??
        parsedEliteMicro.stability ??
        0
      ) * 100
    );

    const consistencyParts = [technique, posture, stability].filter((v) =>
      Number.isFinite(v)
    );

    const consistency =
      consistencyParts.length > 0
        ? Math.round(
            consistencyParts.reduce((a, b) => a + b, 0) / consistencyParts.length
          )
        : 0;

    return { technique, posture, stability, consistency };
  }, [parsedEliteMicro]);

  // 2. eliteScore — derived from breakdown so they always match
  const eliteScore = useMemo(() => {
    if (!eliteBreakdown)
      return Number(params.elite_score ?? payload?.elite_score ?? 0);
    const { technique, posture, stability, consistency } = eliteBreakdown;
    const raw = Math.round(
      0.40 * technique +
      0.25 * consistency +
      0.20 * stability +
      0.15 * posture
    );
    return Math.max(0, Math.min(100, raw));
  }, [eliteBreakdown, params.elite_score, payload?.elite_score]);

  // 3. resolvedQualityValue
  const resolvedQualityValue = useMemo(
    () => resolvedQuality(rawQualityValue, eliteScore, skillConf),
    [rawQualityValue, eliteScore, skillConf]
  );

  // 4. reconciledQuality — ensures quality badge never contradicts elite score
  const reconciledQuality = useMemo(() => {
    if (eliteScore >= 75) return "good";
    if (eliteScore >= 50) {
      if (resolvedQualityValue === "bad") return "situational";
      return resolvedQualityValue;
    }
    return resolvedQualityValue;
  }, [eliteScore, resolvedQualityValue]);

  // 5. eliteTierLabel
  const eliteTierLabel = useMemo(() => eliteTier(eliteScore), [eliteScore]);

  /* -------------------------------
     PERFORMANCE TIER (based on avg)
  -------------------------------- */
  const { tier, progress, percentToNext } = useMemo(
    () => getTierProgress(avgEliteScore),
    [avgEliteScore]
  );

  const nextTierMin = (() => {
    const tiers = [
      { min: 0, max: 25 },
      { min: 26, max: 30 },
      { min: 31, max: 50 },
      { min: 51, max: 60 },
      { min: 61, max: 70 },
      { min: 71, max: 80 },
      { min: 81, max: 100 },
    ];
    const currentIndex = tiers.findIndex(
      (t) => avgEliteScore >= t.min && avgEliteScore <= t.max
    );
    const next = tiers[currentIndex + 1];
    return next ? next.min : null;
  })();

  const pointsToNextTier =
    nextTierMin !== null ? Math.max(0, nextTierMin - avgEliteScore) : 0;

  /* -------------------------------
     DERIVED UI VALUES
     All use reconciledQuality so badge,
     color, and logic stay consistent
  -------------------------------- */
  const qualityColor =
    reconciledQuality === "good"
      ? "#22c55e"
      : reconciledQuality === "situational"
      ? "#facc15"
      : "#ef4444";

  const isEliteRep = reconciledQuality === "good" && eliteScore >= 85;

  /* -------------------------------
     FEEDBACK
  -------------------------------- */
  const sendFeedback = async (isCorrect: boolean) => {
    if (feedbackSent || !repId) return;
    try {
      const form = new FormData();
      form.append("rep_id", String(repId));
      form.append("skill", skillValue);
      form.append("quality", reconciledQuality);
      form.append("correct", String(isCorrect));
      await fetch("https://volleyiq-beta-production.up.railway.app/feedback", {
        method: "POST",
        body: form,
      });
      setFeedbackChoice(isCorrect);
      setFeedbackSent(true);
      console.log("✅ feedback sent");
    } catch (e) {
      console.log("feedback failed", e);
    }
  };

  /* -------------------------------
     SAVE TO HISTORY
  -------------------------------- */
  const saveAnalysisToHistory = useCallback(async () => {
    try {
      const key = getHistoryKey();
      if (!key) return;
      const raw = await AsyncStorage.getItem(key);
      const prev = raw ? JSON.parse(raw) : [];
      const item = {
        id: uuidv4(),
        skill: String(skillValue),
        quality: reconciledQuality,
        skill_confidence: skillConf01,
        quality_confidence: qualityConf01,
        primary_fix: String(primary_fix ?? ""),
        created_at: new Date().toISOString(),
        result_payload: {
          skill: skillValue,
          quality: reconciledQuality,
          skill_confidence: skillConf01,
          quality_confidence: qualityConf01,
          confidence: skillConf01,
          elite_score: eliteScore,
          primary_fix,
          elite_micro_insights: parsedEliteMicro,
        },
      };
      const next = [item, ...prev];
      await AsyncStorage.setItem(key, JSON.stringify(next));
      console.log("✅ History saved:", next.length);
    } catch (e) {
      console.error("❌ Failed to save history", e);
    }
  }, [
    skillValue,
    reconciledQuality,
    skillConf01,
    qualityConf01,
    primary_fix,
    eliteScore,
    parsedEliteMicro,
    payload,
  ]);

  /* ===============================
     ✅ DAILY FOCUS SAVE
  ================================ */
  const saveDailyFocusIfNeeded = useCallback(async () => {
    try {
      const today = new Date().toISOString().slice(0, 10);
      const storedDate = await AsyncStorage.getItem("daily_focus_date");
      if (storedDate === today) return;
      const reason =
        reconciledQuality === "bad"
          ? "This was the most limiting factor in your technique today."
          : reconciledQuality === "situational"
          ? "Improving this will stabilize your performance under pressure."
          : "Refining this will help you maintain elite consistency.";
      await AsyncStorage.multiSet([
        ["daily_focus_date", today],
        ["daily_focus_skill", String(skillValue)],
        ["daily_focus_text", String(primary_fix ?? "")],
        ["daily_focus_reason", reason],
      ]);
    } catch (e) {
      console.log("Daily focus save failed", e);
    }
  }, [primary_fix, reconciledQuality, skillValue]);

  /* -------------------------------
     BAR ANIMATIONS
  -------------------------------- */
  const skillAnim = useRef(new Animated.Value(0)).current;
  const qualityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (skillConf === 0 && qualityConf === 0) return;
    Animated.parallel([
      Animated.timing(skillAnim, {
        toValue: skillConf,
        duration: 900,
        useNativeDriver: false,
      }),
      Animated.timing(qualityAnim, {
        toValue: qualityConf,
        duration: 900,
        useNativeDriver: false,
      }),
    ]).start();
  }, [skillConf, qualityConf]);

  useEffect(() => {
    saveDailyFocusIfNeeded();
  }, [saveDailyFocusIfNeeded]);

  const skillWidth = skillAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  const qualityWidth = qualityAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  useEffect(() => {
    if (hasSavedRef.current) return;
    if (isFromHistory) return;
    if (!hasRealAnalysis) return;
    hasSavedRef.current = true;
    saveAnalysisToHistory();
  }, [isFromHistory, hasRealAnalysis, saveAnalysisToHistory]);

  /* =========================================================
     ✅ ELITE MICRO INSIGHT
  ========================================================= */
  const eliteInsight = useMemo(() => {
    if (!canAccessEliteInsight) return null;

    const q = reconciledQuality;
    const conf = skillConf;
    const s = skillValue ? String(skillValue).toUpperCase() : "THIS SKILL";

    const passAngle = Number(parsedEliteMicro?.pass_angle);
    const platformAngle = Number(parsedEliteMicro?.platform_angle);
    const contactOffset = Number(parsedEliteMicro?.contact_offset);

    const hasPassAngle = Number.isFinite(passAngle);
    const hasPlatformAngle = Number.isFinite(platformAngle);
    const hasContactOffset = Number.isFinite(contactOffset);

    if (hasPassAngle || hasPlatformAngle || hasContactOffset) {
      if (hasPassAngle && Math.abs(passAngle) >= 18) {
        return `${s}: your pass angle is drifting — square your shoulders earlier and keep the platform stable through contact.`;
      }
      if (hasPlatformAngle && Math.abs(platformAngle) >= 16) {
        return `${s}: your platform angle is too steep — flatten it slightly to control height and reduce overpassing.`;
      }
      if (hasContactOffset && Math.abs(contactOffset) >= 0.22) {
        return `${s}: contact is off-center — shift your feet earlier so the ball meets the midline, not the edge of the platform.`;
      }
      return `${s}: alignment looks close — keep the same setup, then lock the platform through follow-through for cleaner consistency.`;
    }

    if (q === "good") {
      if (conf >= 88) {
        return `Excellent ${s} — keep this exact rhythm and replicate it under pressure (same stance, same contact).`;
      }
      if (conf >= 75) {
        return `Strong ${s} — the base is clean. Now aim for identical tempo every rep to remove randomness.`;
      }
      return `Good ${s} — you're doing the right things. Tighten one detail: ${String(primary_fix ?? "keep the setup consistent")}.`;
    }

    if (q === "situational") {
      if (conf < 55) {
        return `${s} is inconsistent — slow the rep down and rebuild control: stable base → early platform → clean contact.`;
      }
      if (conf < 70) {
        return `${s} is close — your miss comes from timing. Hold posture a fraction longer before contact.`;
      }
      return `${s} is decent but not repeatable — focus one lever: ${String(primary_fix ?? "stabilize before contact")}.`;
    }

    if (conf < 40) {
      return `Reset ${s}: prioritize fundamentals — balanced base, early positioning, then contact (don't rush).`;
    }
    return `${s} needs control — reduce speed and nail clean form first: ${String(primary_fix ?? "stable posture and platform")}.`;
  }, [
    canAccessEliteInsight,
    reconciledQuality,
    skillConf,
    skillValue,
    primary_fix,
    parsedEliteMicro,
  ]);

  /* =========================================================
     RENDER
  ========================================================= */
  return (
    <>
      <Stack.Screen
        options={{
          title: skillValue ? skillValue.toUpperCase() : "Analysis Results",
          headerBackTitleVisible: false,
        }}
      />

      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={{ paddingBottom: 170 }}
        showsVerticalScrollIndicator={false}
      >
        {/* TOP BAR */}
        <View style={styles.topBar}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <View
              style={[
                styles.pill,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <Ionicons name="checkmark-circle" size={16} color={colors.text} />
              <Text style={{ color: colors.text, fontWeight: "900", fontSize: 12 }}>
                Saved
              </Text>
            </View>

            {isElite && (
              <View
                style={[
                  styles.pill,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.primary + "55",
                  },
                ]}
              >
                <Ionicons name="trophy" size={16} color={colors.primary} />
                <Text style={{ color: colors.text, fontWeight: "900", fontSize: 12 }}>
                  Elite
                </Text>
              </View>
            )}
            {!isElite && isPro && (
              <View
                style={[
                  styles.pill,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
              >
                <Ionicons name="sparkles" size={16} color={colors.text} />
                <Text style={{ color: colors.text, fontWeight: "900", fontSize: 12 }}>
                  Pro
                </Text>
              </View>
            )}
          </View>

          <TouchableOpacity
            onPress={() => router.replace("/")}
            activeOpacity={0.85}
            style={[
              styles.iconBtn,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Ionicons name="close" size={18} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* HEADER */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            Analysis Complete
          </Text>
          <Text style={{ color: colors.muted, marginTop: 4 }}>
            This rep has been saved to your history
          </Text>
          <Text style={{ color: colors.muted, marginTop: 8, lineHeight: 18 }}>
            Keep reps consistent — small improvements stack fast.
          </Text>
        </View>

        {/* SKILL SUMMARY */}
        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <View style={styles.row}>
            <Text style={[styles.cardLabel, { color: colors.muted }]}>
              Skill Detected
            </Text>
            <TouchableOpacity
              onPress={() => setOpenExplainer("skill")}
              activeOpacity={0.85}
            >
              <Ionicons name="help-circle-outline" size={18} color={colors.muted} />
            </TouchableOpacity>
          </View>

          <Text
            style={[styles.skillText, { color: colors.text }]}
            numberOfLines={1}
          >
            {skillValue ? skillValue.toUpperCase() : "—"}
          </Text>

          <View style={styles.badgeRow}>
            <View
              style={[
                styles.badge,
                {
                  backgroundColor: qualityColor,
                  shadowColor: qualityColor,
                },
              ]}
            >
              {/* ✅ Uses reconciledQuality */}
              <Text style={styles.badgeText}>
                {reconciledQuality ? reconciledQuality.toUpperCase() : "—"}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => setOpenExplainer("quality")}
              activeOpacity={0.85}
            >
              <Ionicons name="help-circle-outline" size={16} color={colors.muted} />
            </TouchableOpacity>

            <View
              style={[
                styles.miniChip,
                { backgroundColor: colors.background, borderColor: colors.border },
              ]}
            >
              <Ionicons name="analytics" size={14} color={colors.muted} />
              <Text style={{ color: colors.muted, fontWeight: "900", fontSize: 12 }}>
                {skillConf}% skill
              </Text>
            </View>
          </View>
        </View>

        {/* ELITE SCORE */}
        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.cardLabel, { color: colors.muted }]}>
            Elite Score
          </Text>

          {isElite ? (
            <>
              <View style={{ flexDirection: "row", alignItems: "baseline", gap: 8 }}>
                <Text
                  style={{ fontSize: 36, fontWeight: "900", color: colors.text }}
                >
                  {eliteScore}
                </Text>
                <Text style={{ color: colors.muted, fontWeight: "900" }}>
                  / 100 — {eliteTierLabel}
                </Text>
              </View>
              <Text style={{ color: colors.muted, marginTop: 6 }}>
                Composite score based on posture, timing, stability, and rep cleanliness.
              </Text>
            </>
          ) : (
            <View
              style={[
                styles.eliteLocked,
                { borderColor: colors.border, backgroundColor: colors.card },
              ]}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <Ionicons name="lock-closed" size={18} color={colors.muted} />
                <Text style={{ color: colors.text, fontWeight: "900" }}>
                  Elite Score
                </Text>
              </View>
              <Text style={{ color: colors.muted, marginTop: 8, lineHeight: 19 }}>
                Upgrade to unlock biomechanical scoring and detailed breakdown.
              </Text>
              <TouchableOpacity
                onPress={() => router.push("/upgrade")}
                activeOpacity={0.9}
                style={[
                  styles.smallCta,
                  { backgroundColor: colors.background, borderColor: colors.border },
                ]}
              >
                <Text style={{ color: colors.text, fontWeight: "900" }}>
                  Unlock Elite
                </Text>
                <Ionicons name="chevron-forward" size={16} color={colors.muted} />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* ELITE BREAKDOWN */}
        {isElite && eliteBreakdown && (
          <View
            style={[
              styles.card,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.cardLabel, { color: colors.muted }]}>
              Elite Breakdown
            </Text>

            {[
              { label: "Technique", value: eliteBreakdown.technique },
              { label: "Posture", value: eliteBreakdown.posture },
              { label: "Stability", value: eliteBreakdown.stability },
              { label: "Consistency", value: eliteBreakdown.consistency },
            ].map((item) => (
              <View
                key={item.label}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: 12,
                }}
              >
                <Text
                  style={{ color: colors.text, fontWeight: "800", fontSize: 14 }}
                >
                  {item.label}
                </Text>
                <Text
                  style={{ color: colors.muted, fontWeight: "900", fontSize: 14 }}
                >
                  {Number.isFinite(item.value) ? `${item.value} / 100` : "—"}
                </Text>
              </View>
            ))}

            <Text
              style={{ color: colors.muted, marginTop: 12, fontSize: 13, lineHeight: 18 }}
            >
              Breakdown explains which factors influenced your Elite Score most.
            </Text>
          </View>
        )}

        {/* ELITE MICRO INSIGHT */}
        {eliteInsight && (
          <View
            style={[
              styles.eliteInsight,
              {
                borderColor: colors.primary + "55",
                backgroundColor: colors.card,
              },
            ]}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <View
                style={[
                  styles.eliteIconWrap,
                  { backgroundColor: colors.background, borderColor: colors.border },
                ]}
              >
                <Ionicons name="sparkles" size={18} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.eliteInsightLabel, { color: colors.primary }]}>
                  ELITE COACHING INSIGHT
                </Text>
                <Text style={[styles.eliteInsightText, { color: colors.text }]}>
                  {eliteInsight}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* ELITE LOCKED TEASER */}
        {!eliteInsight && (
          <View
            style={[
              styles.eliteLocked,
              { borderColor: colors.border, backgroundColor: colors.card },
            ]}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <Ionicons name="lock-closed" size={18} color={colors.muted} />
              <Text style={{ color: colors.text, fontWeight: "900" }}>
                Elite Coaching Insight
              </Text>
            </View>
            <Text style={{ color: colors.muted, marginTop: 8, lineHeight: 19 }}>
              Upgrade to Elite to get a precise, coach-style correction after every rep.
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/upgrade")}
              activeOpacity={0.9}
              style={[
                styles.smallCta,
                { backgroundColor: colors.background, borderColor: colors.border },
              ]}
            >
              <Text style={{ color: colors.text, fontWeight: "900" }}>Unlock Elite</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.muted} />
            </TouchableOpacity>
          </View>
        )}

        {/* CONFIDENCE */}
        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <View style={styles.row}>
            <Text style={[styles.cardLabel, { color: colors.muted }]}>
              Confidence Scores
            </Text>
            <TouchableOpacity
              onPress={() => setOpenExplainer("skill_conf")}
              activeOpacity={0.85}
            >
              <Ionicons name="help-circle-outline" size={18} color={colors.muted} />
            </TouchableOpacity>
          </View>

          <View style={styles.confidenceBlock}>
            <View style={styles.confRow}>
              <Text style={{ color: colors.text, fontWeight: "900" }}>
                Skill Detection
              </Text>
              <Text style={{ color: colors.muted, fontWeight: "900" }}>
                {skillConf}%
              </Text>
            </View>
            <View style={[styles.track, { backgroundColor: colors.border }]}>
              <Animated.View
                style={[styles.fill, { width: skillWidth, backgroundColor: colors.text }]}
              />
            </View>
            <Text style={{ color: colors.muted }}>{skillConf}% confidence</Text>
          </View>

          <View style={styles.confidenceBlock}>
            <View style={styles.confRow}>
              <Text style={{ color: colors.text, fontWeight: "900" }}>
                Quality Assessment
              </Text>
              <Text style={{ color: colors.muted, fontWeight: "900" }}>
                {qualityConf}%
              </Text>
            </View>
            <View style={[styles.track, { backgroundColor: colors.border }]}>
              <Animated.View
                style={[styles.fill, { width: qualityWidth, backgroundColor: qualityColor }]}
              />
            </View>
            <Text style={{ color: colors.muted }}>{qualityConf}% confidence</Text>
          </View>
        </View>

        {/* PRIMARY FOCUS */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
              borderLeftWidth: 4,
              borderLeftColor: colors.primary,
              borderColor: colors.border,
            },
          ]}
        >
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" }}>
            <Text style={[styles.cardLabel, { color: colors.muted }]}>
              Today's Focus
            </Text>
            <View
              style={[
                styles.miniChip,
                { backgroundColor: colors.background, borderColor: colors.border },
              ]}
            >
              <Ionicons name="bulb-outline" size={14} color={colors.muted} />
              <Text style={{ color: colors.muted, fontWeight: "900", fontSize: 12 }}>
                Primary Fix
              </Text>
            </View>
          </View>
          <Text style={[styles.focusText, { color: colors.text, marginTop: 10 }]}>
            {String(primary_fix ?? "")}
          </Text>
          <Text style={{ color: colors.muted, marginTop: 10, lineHeight: 19 }}>
            Aim to nail this one lever for 10–15 clean reps before adding speed.
          </Text>
        </View>

        {/* PERFORMANCE LEVEL */}
        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.cardLabel, { color: colors.muted }]}>
            Performance Level
          </Text>

          {isPro || isElite ? (
            <>
              <View style={{ flexDirection: "row", alignItems: "baseline", gap: 8 }}>
                <Text
                  style={{ fontSize: 28, fontWeight: "900", color: tier.color }}
                >
                  {tier.emoji} {tier.label}
                </Text>
              </View>
              <View
                style={{
                  height: 10,
                  borderRadius: 999,
                  backgroundColor: colors.border,
                  marginTop: 14,
                  overflow: "hidden",
                }}
              >
                <View
                  style={{
                    height: "100%",
                    width: `${progress * 100}%`,
                    backgroundColor: tier.color,
                    borderRadius: 999,
                  }}
                />
              </View>
              {pointsToNextTier > 0 ? (
                <Text style={{ color: colors.muted, marginTop: 8 }}>
                  +{pointsToNextTier} pts to next tier
                </Text>
              ) : (
                <Text style={{ color: colors.muted, marginTop: 8 }}>
                  Maximum tier reached
                </Text>
              )}
            </>
          ) : (
            <View
              style={[
                styles.eliteLocked,
                { borderColor: colors.border, backgroundColor: colors.card },
              ]}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <Ionicons name="lock-closed" size={18} color={colors.muted} />
                <Text style={{ color: colors.text, fontWeight: "900" }}>
                  Performance Level
                </Text>
              </View>
              <Text style={{ color: colors.muted, marginTop: 8, lineHeight: 19 }}>
                Upgrade to track ranking and progression.
              </Text>
              <TouchableOpacity
                onPress={() => router.push("/upgrade")}
                activeOpacity={0.9}
                style={[
                  styles.smallCta,
                  { backgroundColor: colors.background, borderColor: colors.border },
                ]}
              >
                <Text style={{ color: colors.text, fontWeight: "900" }}>
                  Unlock Pro
                </Text>
                <Ionicons name="chevron-forward" size={16} color={colors.muted} />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* PRAISE — only shows for genuinely elite reps */}
        {isEliteRep && (
          <View
            style={[
              styles.card,
              {
                backgroundColor: colors.card,
                borderLeftWidth: 4,
                borderLeftColor: "#22c55e",
                borderColor: colors.border,
              },
            ]}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <View
                style={[
                  styles.praiseIcon,
                  { backgroundColor: colors.background, borderColor: colors.border },
                ]}
              >
                <Ionicons name="checkmark" size={18} color="#22c55e" />
              </View>
              <Text
                style={{
                  color: colors.text,
                  fontSize: 16,
                  fontWeight: "900",
                  flex: 1,
                  lineHeight: 20,
                }}
              >
                Elite rep — maintain this standard under pressure.
              </Text>
            </View>
            <Text style={{ color: colors.muted, marginTop: 10, lineHeight: 19 }}>
              Don't chase volume. Chase identical execution.
            </Text>
          </View>
        )}

        {/* FEEDBACK */}
        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.cardLabel, { color: colors.muted }]}>
            Was this analysis correct?
          </Text>
          <View style={{ flexDirection: "row", gap: 10, marginTop: 12 }}>
            <TouchableOpacity
              style={[
                styles.feedbackBtn,
                {
                  borderColor: "#22c55e",
                  backgroundColor:
                    feedbackSent && feedbackChoice === true
                      ? "#22c55e22"
                      : "transparent",
                },
              ]}
              onPress={() => sendFeedback(true)}
              disabled={feedbackSent}
            >
              <Ionicons
                name={
                  feedbackSent && feedbackChoice === true ? "checkmark" : "thumbs-up"
                }
                size={18}
                color="#22c55e"
              />
              <Text style={{ color: colors.text, fontWeight: "900" }}>
                {feedbackSent && feedbackChoice === true ? "Sent" : "Correct"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.feedbackBtn,
                {
                  borderColor: "#ef4444",
                  backgroundColor:
                    feedbackSent && feedbackChoice === false
                      ? "#ef444422"
                      : "transparent",
                },
              ]}
              onPress={() => sendFeedback(false)}
              disabled={feedbackSent}
            >
              <Ionicons
                name={
                  feedbackSent && feedbackChoice === false
                    ? "arrow-forward"
                    : "thumbs-down"
                }
                size={18}
                color="#ef4444"
              />
              <Text style={{ color: colors.text, fontWeight: "900" }}>
                {feedbackSent && feedbackChoice === false ? "Sent" : "Incorrect"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ACTIONS */}
        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.actionButton,
              {
                backgroundColor: colors.primary,
                shadowColor: colors.primary,
              },
            ]}
            activeOpacity={0.9}
            onPress={() => {
              if (!isPro && !isElite) {
                router.push("/upgrade");
                return;
              }
              router.push({
                pathname: "/results/next-action",
                params: {
                  skill: skillValue,
                  quality: reconciledQuality, // ✅ uses reconciledQuality
                  primary_fix,
                  skill_confidence,
                },
              });
            }}
          >
            <Text style={styles.actionText}>Go to Training Focus</Text>
            <Ionicons name="chevron-forward" size={18} color="#000" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.secondaryButton,
              { borderColor: colors.border, backgroundColor: colors.background },
            ]}
            activeOpacity={0.9}
            onPress={() => router.replace("/")}
          >
            <Text style={{ color: colors.text, fontWeight: "900" }}>
              Analyze Another Rep
            </Text>
            <Ionicons name="repeat" size={18} color={colors.muted} />
          </TouchableOpacity>

          <Text style={{ color: colors.muted, marginTop: 12, lineHeight: 18 }}>
            Tip: Better lighting + steady camera improves analysis accuracy.
          </Text>
        </View>
      </ScrollView>

      {/* EXPLAINER MODAL */}
      <ExplainerModal
        open={openExplainer}
        onClose={() => setOpenExplainer(null)}
        colors={colors}
      />
    </>
  );
}

/* =========================================================
   EXPLAINER MODAL
========================================================= */
function ExplainerModal({ open, onClose, colors }: any) {
  const scale = useRef(new Animated.Value(0.85)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (open) {
      Animated.parallel([
        Animated.spring(scale, {
          toValue: 1,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scale.setValue(0.85);
      opacity.setValue(0);
    }
  }, [open, opacity, scale]);

  if (!open) return null;

  const copy: Record<string, string> = {
    skill: "Detected by voting across all analyzed frames using pose landmarks.",
    skill_conf:
      "Confidence reflects how consistently the same skill appeared throughout the clip.",
    quality:
      "Quality is assessed using biomechanical heuristics such as posture, balance, and joint alignment.",
  };

  return (
    <Modal transparent animationType="fade">
      <Pressable style={styles.overlay} onPress={onClose}>
        <Animated.View
          style={[
            styles.explainerCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              opacity,
              transform: [{ scale }],
            },
          ]}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                color: colors.text,
                fontSize: 18,
                fontWeight: "900",
                marginBottom: 10,
              }}
            >
              How this is calculated
            </Text>
            <TouchableOpacity onPress={onClose} activeOpacity={0.85}>
              <Ionicons name="close" size={20} color={colors.text} />
            </TouchableOpacity>
          </View>

          <Text style={{ color: colors.muted, lineHeight: 20 }}>
            {copy[open]}
          </Text>

          <View style={{ height: 14 }} />

          <View
            style={[
              styles.modalTip,
              { backgroundColor: colors.background, borderColor: colors.border },
            ]}
          >
            <Ionicons
              name="information-circle-outline"
              size={16}
              color={colors.muted}
            />
            <Text style={{ color: colors.muted, lineHeight: 18, flex: 1 }}>
              For best results: stable camera, full body in frame, and clear lighting.
            </Text>
          </View>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

/* =========================================================
   STYLES
========================================================= */
const styles = StyleSheet.create({
  container: { flex: 1, padding: 22 },

  topBar: {
    marginTop: Platform.select({ ios: 6, android: 10, default: 10 }),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  pill: {
    borderRadius: 999,
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  header: { marginBottom: 18, marginTop: 6 },

  title: {
    fontSize: 30,
    fontWeight: "900",
    letterSpacing: 0.2,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  card: {
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
  },

  cardLabel: {
    fontSize: 12,
    letterSpacing: 0.7,
    textTransform: "uppercase",
    fontWeight: "900",
  },

  skillText: {
    fontSize: 22,
    fontWeight: "900",
    marginTop: 8,
    letterSpacing: 0.4,
  },

  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 12,
    flexWrap: "wrap",
  },

  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },

  badgeText: {
    color: "#000",
    fontWeight: "900",
    fontSize: 12,
    letterSpacing: 0.5,
  },

  miniChip: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  confidenceBlock: { marginTop: 14 },

  confRow: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    marginBottom: 6,
  },

  track: {
    height: 10,
    borderRadius: 999,
    overflow: "hidden",
    marginTop: 2,
    marginBottom: 6,
  },

  fill: { height: "100%", borderRadius: 999 },

  focusText: {
    fontSize: 16,
    fontWeight: "800",
    lineHeight: 22,
  },

  eliteInsight: {
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    marginBottom: 14,
  },

  eliteIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  eliteInsightLabel: {
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0.9,
    marginBottom: 6,
  },

  eliteInsightText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "800",
  },

  eliteLocked: {
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    marginBottom: 14,
  },

  smallCta: {
    marginTop: 12,
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  praiseIcon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  actionButton: {
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 7 },
    elevation: 8,
  },

  actionText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 0.2,
  },

  secondaryButton: {
    marginTop: 12,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  explainerCard: {
    width: "100%",
    maxWidth: 440,
    borderRadius: 22,
    padding: 22,
    borderWidth: 1,
  },

  feedbackBtn: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },

  modalTip: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
});