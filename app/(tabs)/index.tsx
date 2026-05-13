// app/(tabs)/index.tsx
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  Animated,
  Easing,
  AppState,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { router, useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAppColors } from "../../lib/useAppColors";
import { Ionicons } from "@expo/vector-icons";
import { getHistoryKey } from "../../lib/userStorage";
import { recordAnalysis, getUsage } from "../../lib/analysisLimit";
import { useEntitlements } from "../../lib/useEntitlements";

/* ===============================
   ANALYSIS PHASES (CINEMATIC)
================================ */
type Phase = {
  title: string;
  subtitle: string;
  duration: number;
  detail?: string;
};

const ANALYSIS_PHASES: Phase[] = [
  {
    title: "Initializing model",
    subtitle: "Loading movement intelligence",
    duration: 900,
    detail: "Warming up the analysis pipeline",
  },
  {
    title: "Detecting body landmarks",
    subtitle: "Head, shoulders, hips, knees, ankles",
    duration: 1200,
    detail: "Finding keypoints frame-by-frame",
  },
  {
    title: "Analyzing posture",
    subtitle: "Spine alignment and balance center",
    duration: 1400,
    detail: "Checking stability and posture integrity",
  },
  {
    title: "Evaluating joint mechanics",
    subtitle: "Elbows, wrists, knees, and ankles",
    duration: 1400,
    detail: "Looking for efficiency + safe angles",
  },
  {
    title: "Assessing platform angle",
    subtitle: "Angle consistency and control",
    duration: 1200,
    detail: "Estimating platform direction + drift",
  },
  {
    title: "Comparing to elite patterns",
    subtitle: "Benchmarking against high-level athletes",
    duration: 1600,
    detail: "Measuring similarity to reference patterns",
  },
  {
    title: "Identifying inefficiencies",
    subtitle: "Where energy is being lost",
    duration: 1200,
    detail: "Spotting timing + coordination leaks",
  },
  {
    title: "Generating corrections",
    subtitle: "Prioritizing the highest-impact fix",
    duration: 1400,
    detail: "Picking the #1 fix for fastest improvement",
  },
  {
    title: "Scoring consistency",
    subtitle: "How repeatable the movement is",
    duration: 1100,
    detail: "Estimating repeatability + variance",
  },
  {
    title: "Finalizing feedback",
    subtitle: "Preparing actionable insights",
    duration: 1200,
    detail: "Packaging results and recommendations",
  },
];

/* ===============================
   FREE TIER LIMIT
   Changed from 1 → 2 daily analyses
================================ */
const FREE_DAILY_LIMIT = 3;

const BACKEND_BASE_URL = "https://volleyiq-beta-production.up.railway.app";
const ANALYZE_ENDPOINT = `${BACKEND_BASE_URL}/analyze`;

const TICK_MS            = 100;
const MAX_VISUAL_PROGRESS = 94;
const MIN_LOADER_SHOW_MS  = 650;
const FINALIZE_ANIM_MS    = 320;

/* ===============================
   SKILL OPTIONS
================================ */
type Skill = "passing" | "setting";

const SKILL_OPTIONS: Array<{
  key: Skill;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  description: string;
}> = [
  {
    key:         "passing",
    label:       "Passing",
    icon:        "hand-left-outline",
    description: "Serve receive, freeball pass",
  },
  {
    key:         "setting",
    label:       "Setting",
    icon:        "swap-vertical-outline",
    description: "Front set, back set, jump set",
  },
];

export default function AnalyzeScreen() {
  const colors = useAppColors();
  const [uid, setUid] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    AsyncStorage.getItem("activeUid").then(setUid);
  }, []);

  /* ─── State ─── */
  const [loading, setLoading]           = useState(false);
  const [videoUri, setVideoUri]         = useState<string | null>(null);
  const [phaseIndex, setPhaseIndex]     = useState(0);
  const [progress, setProgress]         = useState(0);
  const [error, setError]               = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft]   = useState<number | null>(null);
  const [dailyUsed, setDailyUsed]       = useState(0);
  const [permissionDenied, setPermissionDenied] = useState(false);

  /* ─── Skill selector state ─── */
  const [skillSelectorOpen, setSkillSelectorOpen] = useState(false);
  const [selectedSkill, setSelectedSkill]         = useState<Skill | null>(null);

  // Dropdown animation
  const dropdownHeight = useRef(new Animated.Value(0)).current;
  const dropdownOpacity = useRef(new Animated.Value(0)).current;
  const chevronRotation = useRef(new Animated.Value(0)).current;

  const ent  = useEntitlements();
  const tier = ent.tier;

  useEffect(() => {
    if (tier !== "free") setDailyUsed(0);
  }, [tier]);

  /* ─── Refs ─── */
  const inFlightRef      = useRef(false);
  const startedAtRef     = useRef<number | null>(null);
  const visualTimerRef   = useRef<ReturnType<typeof setInterval> | null>(null);
  const abortRef         = useRef<AbortController | null>(null);
  const appStateRef      = useRef(AppState.currentState);

  /* ─── Animations ─── */
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const totalVisualDuration = useMemo(
    () => ANALYSIS_PHASES.reduce((s, p) => s + p.duration, 0),
    []
  );

  const currentPhase = ANALYSIS_PHASES[Math.min(phaseIndex, ANALYSIS_PHASES.length - 1)];

  const nowMs                     = () => Date.now();
  const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));
  const sleep = (ms: number)      => new Promise((r) => setTimeout(r, ms));

  /* ─── Skill selector open/close ─── */
  const openSkillSelector = useCallback(() => {
    setSkillSelectorOpen(true);
    Animated.parallel([
      Animated.spring(dropdownHeight, {
        toValue: 1,
        friction: 8,
        tension: 60,
        useNativeDriver: false,
      }),
      Animated.timing(dropdownOpacity, {
        toValue: 1,
        duration: 220,
        useNativeDriver: false,
      }),
      Animated.timing(chevronRotation, {
        toValue: 1,
        duration: 220,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }, [dropdownHeight, dropdownOpacity, chevronRotation]);

  const closeSkillSelector = useCallback(() => {
    Animated.parallel([
      Animated.timing(dropdownHeight, {
        toValue: 0,
        duration: 180,
        easing: Easing.in(Easing.ease),
        useNativeDriver: false,
      }),
      Animated.timing(dropdownOpacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: false,
      }),
      Animated.timing(chevronRotation, {
        toValue: 0,
        duration: 180,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start(() => setSkillSelectorOpen(false));
  }, [dropdownHeight, dropdownOpacity, chevronRotation]);

  const toggleSkillSelector = useCallback(() => {
    if (skillSelectorOpen) {
      closeSkillSelector();
    } else {
      openSkillSelector();
    }
  }, [skillSelectorOpen, openSkillSelector, closeSkillSelector]);

  const handleSkillSelect = useCallback(
    (skill: Skill) => {
      setSelectedSkill(skill);
      closeSkillSelector();
    },
    [closeSkillSelector]
  );

  const chevronDeg = chevronRotation.interpolate({
    inputRange:  [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const dropdownMaxHeight = dropdownHeight.interpolate({
    inputRange:  [0, 1],
    outputRange: [0, 160],
  });

  /* ─── Reset helpers ─── */
  const resetCosmeticState = useCallback(() => {
    setPhaseIndex(0);
    setProgress(0);
    setSecondsLeft(null);
    setError(null);
    setPermissionDenied(false);
  }, []);

  const hardResetAll = useCallback(() => {
    try { abortRef.current?.abort(); } catch {}
    abortRef.current    = null;
    inFlightRef.current = false;
    startedAtRef.current = null;
    if (visualTimerRef.current) {
      clearInterval(visualTimerRef.current);
      visualTimerRef.current = null;
    }
    setLoading(false);
    setVideoUri(null);
    resetCosmeticState();
  }, [resetCosmeticState]);

  useFocusEffect(
    useCallback(() => {
      const loadUsage = async () => {
        const id = await AsyncStorage.getItem("activeUid");
        setUid(id);
        if (id) {
          const usage = await getUsage(id);
          setDailyUsed(usage);
        }
      };
      loadUsage();
      if (!inFlightRef.current) resetCosmeticState();
      return () => {};
    }, [resetCosmeticState])
  );

  /* ─── Loader animations ─── */
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1, duration: 520, useNativeDriver: true,
    }).start();

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.045, duration: 1200,
          easing: Easing.inOut(Easing.ease), useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1, duration: 1200,
          easing: Easing.inOut(Easing.ease), useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [fadeAnim, pulseAnim]);

  useEffect(() => {
    const sub = AppState.addEventListener("change", (next) => {
      appStateRef.current = next;
    });
    return () => sub.remove();
  }, []);

  /* ─── Visual timeline ─── */
  const startVisualTimeline = useCallback(() => {
    if (visualTimerRef.current) {
      clearInterval(visualTimerRef.current);
      visualTimerRef.current = null;
    }

    let elapsed = 0;
    setPhaseIndex(0);
    setProgress(0);
    setSecondsLeft(Math.ceil(totalVisualDuration / 1000));

    visualTimerRef.current = setInterval(() => {
      if (appStateRef.current !== "active") return;
      elapsed += TICK_MS;

      const pct = clamp(
        (elapsed / totalVisualDuration) * MAX_VISUAL_PROGRESS,
        0,
        MAX_VISUAL_PROGRESS
      );
      setProgress(pct);
      setSecondsLeft(Math.max(1, Math.ceil((totalVisualDuration - elapsed) / 1000)));

      let acc = 0;
      for (let i = 0; i < ANALYSIS_PHASES.length; i++) {
        acc += ANALYSIS_PHASES[i].duration;
        if (elapsed <= acc) { setPhaseIndex(i); break; }
      }
    }, TICK_MS);
  }, [totalVisualDuration]);

  const stopVisualTimeline = useCallback(() => {
    if (visualTimerRef.current) {
      clearInterval(visualTimerRef.current);
      visualTimerRef.current = null;
    }
  }, []);

  /* ─── Finalize to 100% ─── */
  const finalizeTo100 = useCallback(async () => {
    stopVisualTimeline();
    setPhaseIndex(ANALYSIS_PHASES.length - 1);
    setSecondsLeft(1);

    const start    = nowMs();
    const startPct = progress;

    return new Promise<void>((resolve) => {
      const id = setInterval(() => {
        const t     = nowMs() - start;
        const k     = clamp(t / FINALIZE_ANIM_MS, 0, 1);
        const eased = 1 - Math.pow(1 - k, 3);
        setProgress(startPct + (100 - startPct) * eased);
        if (k >= 1) { setProgress(100); clearInterval(id); resolve(); }
      }, 16);
    });
  }, [progress, stopVisualTimeline]);

  /* ─── Permissions ─── */
  const requestLibraryPermission = useCallback(async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setPermissionDenied(true);
      setError("Photo library permission is required to select a video.");
      return false;
    }
    return true;
  }, []);

  /* ─── Pick video + analyze ─── */
  const pickVideoForSkill = useCallback(
    async (skill: Skill) => {
      // Free tier limit check — now FREE_DAILY_LIMIT (2)
      if (tier === "free" && dailyUsed >= FREE_DAILY_LIMIT) {
        router.push("/upgrade");
        return;
      }
      if (inFlightRef.current) return;

      setError(null);
      setPermissionDenied(false);

      const ok = await requestLibraryPermission();
      if (!ok) return;

      const picker = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        quality: 1,
      });

      if (picker.canceled) return;

      const asset = picker.assets?.[0];
      if (!asset?.uri) {
        setError("Could not read the selected video. Try another clip.");
        return;
      }

      inFlightRef.current  = true;
      startedAtRef.current = nowMs();
      setVideoUri(asset.uri);
      setLoading(true);
      startVisualTimeline();

      try { abortRef.current?.abort(); } catch {}
      const controller  = new AbortController();
      abortRef.current  = controller;

      const formData = new FormData();
      formData.append("file", {
        uri:  asset.uri,
        name: "video.mp4",
        type: "video/mp4",
      } as any);

      // Pass forced_skill to backend
      formData.append("forced_skill", skill);

      const consent = await AsyncStorage.getItem("ai_training_consent");
      formData.append("consent", consent ?? "false");

      try {
        const minDelay = (async () => {
          const started = startedAtRef.current ?? nowMs();
          const elapsed = nowMs() - started;
          if (elapsed < MIN_LOADER_SHOW_MS) await sleep(MIN_LOADER_SHOW_MS - elapsed);
        })();

        const req = fetch(ANALYZE_ENDPOINT, {
          method: "POST",
          body:   formData,
          signal: controller.signal,
        });

        const [response] = await Promise.all([req, minDelay]);

        if (!response.ok) throw new Error(`Server error (${response.status}).`);

        const json   = await response.json();
        const result = json?.result ?? json;

        await finalizeTo100();

        if (uid) await recordAnalysis(uid);
        if (tier === "free") setDailyUsed((prev) => prev + 1);

        inFlightRef.current = false;
        abortRef.current    = null;
        setLoading(false);

        router.push({
          pathname: "/results",
          params:   { payload: JSON.stringify(result) },
        });
      } catch (e: any) {
        const aborted =
          typeof e?.name === "string" && e.name.toLowerCase().includes("abort");

        stopVisualTimeline();
        inFlightRef.current = false;
        abortRef.current    = null;
        setLoading(false);

        if (!aborted) {
          setError("Analysis failed. Check your connection and try again.");
        }
      }
    },
    [
      finalizeTo100,
      requestLibraryPermission,
      startVisualTimeline,
      stopVisualTimeline,
      tier,
      dailyUsed,
      uid,
    ]
  );

  useEffect(() => {
    return () => {
      try { abortRef.current?.abort(); } catch {}
      if (visualTimerRef.current) clearInterval(visualTimerRef.current);
    };
  }, []);

  /* ─── Auth guard ─── */
  if (uid === undefined) return null;
  if (!uid) { router.replace("/(auth)/login"); return null; }
  if (ent.loading) return <View style={{ flex: 1, backgroundColor: colors.background }} />;

  /* ═══════════════════════════════════════
     LOADING SCREEN
  ═══════════════════════════════════════ */
  if (loading && videoUri) {
    const phase = currentPhase;
    return (
      <View style={[styles.loadingRoot, { backgroundColor: colors.background }]}>
        <Image source={{ uri: videoUri }} style={styles.background} blurRadius={30} />

        <Animated.View
          style={[
            styles.loadingCard,
            {
              backgroundColor: colors.card,
              borderColor:     colors.border,
              opacity:         fadeAnim,
              transform:       [{ scale: pulseAnim }],
            },
          ]}
        >
          <View style={styles.thumbRow}>
            {[0, 1, 2].map((i) => (
              <Image
                key={i}
                source={{ uri: videoUri }}
                style={[styles.thumb, { opacity: 0.62 - i * 0.14, borderColor: colors.border }]}
              />
            ))}
          </View>

          <View style={styles.spinnerRow}>
            <ActivityIndicator size="large" color={colors.primary} />
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={[styles.phaseTitle, { color: colors.text }]} numberOfLines={1}>
                {phase.title}
              </Text>
              <Text style={[styles.phaseSubtitle, { color: colors.muted }]} numberOfLines={2}>
                {phase.subtitle}
              </Text>
            </View>
          </View>

          {!!phase.detail && (
            <View style={[styles.detailPill, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <Ionicons name="sparkles-outline" size={14} color={colors.muted} />
              <Text style={{ color: colors.muted, fontSize: 12, fontWeight: "800" }}>
                {phase.detail}
              </Text>
            </View>
          )}

          <View style={[styles.progressTrack, { backgroundColor: colors.border }]}>
            <View
              style={[
                styles.progressFill,
                { width: `${Math.round(progress)}%`, backgroundColor: colors.primary },
              ]}
            />
          </View>

          <View style={styles.footerRow}>
            <Text style={{ color: colors.muted, fontWeight: "800" }}>
              {progress >= 99 ? "Finalizing…" : `≈ ${Math.ceil(secondsLeft ?? 1)}s remaining`}
            </Text>
            <View style={styles.pctPill}>
              <Text style={{ color: colors.text, fontWeight: "900" }}>
                {Math.min(99, Math.round(progress))}%
              </Text>
            </View>
          </View>

          <Text style={[styles.disclaimer, { color: colors.muted }]}>
            Confidence reflects consistency — not perfection.
          </Text>

          <TouchableOpacity
            onPress={hardResetAll}
            activeOpacity={0.9}
            style={[styles.cancelBtn, { borderColor: colors.border, backgroundColor: colors.background }]}
          >
            <Ionicons name="close" size={18} color={colors.text} />
            <Text style={{ color: colors.text, fontWeight: "900" }}>Cancel</Text>
          </TouchableOpacity>

          <View style={[styles.hintBox, { borderColor: colors.border }]}>
            <Ionicons
              name={Platform.OS === "ios" ? "phone-portrait-outline" : "logo-android"}
              size={16}
              color={colors.muted}
            />
            <Text style={{ color: colors.muted, fontSize: 12, lineHeight: 18 }}>
              Stay in frame for 2–10 seconds for best result.
            </Text>
          </View>
        </Animated.View>
      </View>
    );
  }

  /* ═══════════════════════════════════════
     MAIN SCREEN
  ═══════════════════════════════════════ */
  const atLimit = tier === "free" && dailyUsed >= FREE_DAILY_LIMIT;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Analyze Technique</Text>
        <Text style={{ color: colors.muted, marginTop: 6 }}>
          Upload a short clip for AI feedback
        </Text>
      </View>

      {/* Upload card */}
      <View style={[styles.uploadCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Ionicons name="videocam-outline" size={44} color={colors.primary} />

        <Text style={[styles.cardTitle, { color: colors.text }]}>Choose a video</Text>

        {/* Usage pill */}
        {tier !== "free" ? (
          <View style={[styles.limitPill, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <Ionicons name="infinite-outline" size={14} color={colors.primary} />
            <Text style={{ color: colors.primary, fontWeight: "900" }}>Unlimited analyses 🚀</Text>
          </View>
        ) : (
          <View style={[styles.limitPill, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <Ionicons name="analytics-outline" size={14} color={colors.muted} />
            <Text style={{ color: colors.text, fontWeight: "900" }}>
              {Math.min(dailyUsed, FREE_DAILY_LIMIT)}/{FREE_DAILY_LIMIT} free analyses used today
            </Text>
          </View>
        )}

        <Text style={{ color: colors.muted, textAlign: "center", lineHeight: 20 }}>
          Side or front view • 2–10 seconds{"\n"}Full body visible
        </Text>

        {/* ─── SKILL SELECTOR BUTTON ─── */}
        <TouchableOpacity
          onPress={atLimit ? () => router.push("/upgrade") : toggleSkillSelector}
          activeOpacity={0.88}
          style={[
            styles.skillButton,
            {
              backgroundColor: atLimit ? colors.border : colors.primary,
              borderColor:     atLimit ? colors.border : colors.primary,
            },
          ]}
        >
          <View style={{ flex: 1, alignItems: "center" }}>
            <Text style={styles.buttonText}>
              {selectedSkill
                ? `Analysing: ${selectedSkill.charAt(0).toUpperCase() + selectedSkill.slice(1)}`
                : "Select Video"}
            </Text>
          </View>
          {!atLimit && (
            <Animated.View style={{ transform: [{ rotate: chevronDeg }] }}>
              <Ionicons name="chevron-down" size={18} color="#000" />
            </Animated.View>
          )}
        </TouchableOpacity>

        {/* ─── ANIMATED DROPDOWN ─── */}
        <Animated.View
          style={[
            styles.dropdownContainer,
            {
              maxHeight:        dropdownMaxHeight,
              opacity:          dropdownOpacity,
              borderColor:      colors.border,
              backgroundColor:  colors.card,
              // hide from layout when closed
              overflow: "hidden",
            },
          ]}
          pointerEvents={skillSelectorOpen ? "auto" : "none"}
        >
          {SKILL_OPTIONS.map((option, index) => (
            <TouchableOpacity
              key={option.key}
              onPress={() => {
                handleSkillSelect(option.key);
                // After skill selected, immediately open camera roll
                pickVideoForSkill(option.key);
              }}
              activeOpacity={0.82}
              style={[
                styles.skillOption,
                {
                  borderBottomWidth: index < SKILL_OPTIONS.length - 1 ? 1 : 0,
                  borderBottomColor: colors.border,
                },
              ]}
            >
              <View
                style={[
                  styles.skillOptionIcon,
                  { backgroundColor: colors.primary + "18", borderColor: colors.primary + "44" },
                ]}
              >
                <Ionicons name={option.icon} size={20} color={colors.primary} />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={{ color: colors.text, fontWeight: "900", fontSize: 15 }}>
                  {option.label}
                </Text>
                <Text style={{ color: colors.muted, fontSize: 12, marginTop: 2 }}>
                  {option.description}
                </Text>
              </View>

              <Ionicons name="chevron-forward" size={16} color={colors.muted} />
            </TouchableOpacity>
          ))}
        </Animated.View>

        {/* Errors */}
        {!!error && (
          <View style={[styles.errorBox, { borderColor: "#ef4444" }]}>
            <Ionicons name="alert-circle-outline" size={18} color="#ef4444" />
            <Text style={{ color: "#ef4444", fontWeight: "800", flex: 1, marginLeft: 8 }}>
              {error}
            </Text>
          </View>
        )}

        {permissionDenied && (
          <Text style={{ color: colors.muted, marginTop: 10, textAlign: "center" }}>
            Enable Photos permission in Settings to select a clip.
          </Text>
        )}

        {/* Tips */}
        <View style={[styles.tipsBox, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <Text style={{ color: colors.text, fontWeight: "900", marginBottom: 8 }}>
            Quick tips for better accuracy
          </Text>
          <TipRow colors={colors} icon="resize-outline"  text="Show full body (head-to-feet) in frame" />
          <TipRow colors={colors} icon="sunny-outline"   text="Good lighting, avoid heavy shadows" />
          <TipRow colors={colors} icon="time-outline"    text="Keep clips short: 2–10 seconds" />
        </View>
      </View>
    </View>
  );
}

function TipRow({
  colors,
  icon,
  text,
}: {
  colors: any;
  icon: keyof typeof Ionicons.glyphMap;
  text: string;
}) {
  return (
    <View style={styles.tipRow}>
      <Ionicons name={icon} size={16} color={colors.muted} />
      <Text style={{ color: colors.muted, marginLeft: 10, lineHeight: 18, flex: 1 }}>
        {text}
      </Text>
    </View>
  );
}

/* ═══════════════════════════════════════
   STYLES
═══════════════════════════════════════ */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },

  header: { marginBottom: 22 },

  title: { fontSize: 28, fontWeight: "900" },

  uploadCard: {
    borderRadius: 22,
    padding: 28,
    alignItems: "center",
    gap: 14,
    borderWidth: 1,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "900",
    marginTop: 6,
  },

  limitPill: {
    flexDirection:    "row",
    alignItems:       "center",
    gap:              8,
    borderRadius:     999,
    borderWidth:      1,
    paddingVertical:  6,
    paddingHorizontal: 10,
    marginTop:        6,
  },

  /* ─── Skill selector button ─── */
  skillButton: {
    marginTop:        12,
    paddingVertical:  14,
    paddingHorizontal: 20,
    borderRadius:     14,
    flexDirection:    "row",
    alignItems:       "center",
    justifyContent:   "center",
    width:            "100%",
    gap:              8,
  },

  buttonText: {
    fontSize:   16,
    fontWeight: "900",
    color:      "#000",
  },

  /* ─── Animated dropdown ─── */
  dropdownContainer: {
    width:        "100%",
    borderRadius: 16,
    borderWidth:  1,
    overflow:     "hidden",
    marginTop:    -4, // tuck up slightly under button
  },

  skillOption: {
    flexDirection:    "row",
    alignItems:       "center",
    paddingVertical:  14,
    paddingHorizontal: 16,
    gap:              14,
  },

  skillOptionIcon: {
    width:        42,
    height:       42,
    borderRadius: 12,
    borderWidth:  1,
    alignItems:   "center",
    justifyContent: "center",
  },

  /* ─── Tips ─── */
  tipsBox: {
    width:        "100%",
    marginTop:    10,
    borderRadius: 16,
    padding:      14,
    borderWidth:  1,
  },

  tipRow: {
    flexDirection: "row",
    alignItems:    "center",
    marginTop:     8,
  },

  errorBox: {
    width:         "100%",
    marginTop:     6,
    borderWidth:   1,
    borderRadius:  14,
    padding:       12,
    flexDirection: "row",
    alignItems:    "center",
  },

  /* ─── Loading screen ─── */
  loadingRoot: {
    flex:           1,
    justifyContent: "center",
    alignItems:     "center",
  },

  background: {
    position: "absolute",
    width:    "100%",
    height:   "100%",
  },

  loadingCard: {
    width:        "90%",
    padding:      24,
    borderRadius: 24,
    alignItems:   "center",
    borderWidth:  1,
  },

  thumbRow: {
    flexDirection: "row",
    gap:           10,
    marginBottom:  16,
  },

  thumb: {
    width:        52,
    height:       70,
    borderRadius: 10,
    borderWidth:  1,
  },

  spinnerRow: {
    flexDirection: "row",
    alignItems:    "center",
    width:         "100%",
    marginTop:     4,
  },

  phaseTitle: {
    fontSize:   18,
    fontWeight: "900",
  },

  phaseSubtitle: {
    fontSize:   13,
    marginTop:  4,
    lineHeight: 18,
  },

  detailPill: {
    marginTop:         12,
    paddingVertical:   8,
    paddingHorizontal: 10,
    borderRadius:      999,
    borderWidth:       1,
    flexDirection:     "row",
    alignItems:        "center",
    gap:               8,
  },

  progressTrack: {
    width:        "100%",
    height:       7,
    borderRadius: 7,
    marginTop:    16,
    overflow:     "hidden",
  },

  progressFill: {
    height:       "100%",
    borderRadius: 7,
  },

  footerRow: {
    width:          "100%",
    marginTop:      12,
    flexDirection:  "row",
    alignItems:     "center",
    justifyContent: "space-between",
  },

  pctPill: {
    paddingVertical:   6,
    paddingHorizontal: 10,
    borderRadius:      999,
    backgroundColor:   "rgba(255,255,255,0.06)",
  },

  disclaimer: {
    fontSize:  12,
    marginTop: 12,
    opacity:   0.85,
    textAlign: "center",
  },

  cancelBtn: {
    marginTop:         14,
    width:             "100%",
    borderRadius:      16,
    paddingVertical:   12,
    borderWidth:       1,
    flexDirection:     "row",
    gap:               10,
    alignItems:        "center",
    justifyContent:    "center",
  },

  hintBox: {
    width:        "100%",
    marginTop:    12,
    borderRadius: 16,
    padding:      12,
    borderWidth:  1,
    flexDirection: "row",
    gap:           10,
    alignItems:   "center",
  },
});