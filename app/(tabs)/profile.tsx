import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Animated,
  Easing,
  StyleSheet as RNStyleSheet,
  Dimensions,
  Platform,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BlurView } from "expo-blur";

import { useAppColors } from "../../lib/useAppColors";
import { useEntitlements } from "../../lib/useEntitlements";
import { getTierProgress } from "../../lib/performanceTier";

import { getProfileKey, getHistoryKey } from "../../lib/userStorage";
import { auth } from "../../lib/auth";


/* =========================================================
   PROFILE SCREEN (SERIES A READY) — SINGLE FILE
   Keeps:
   - Profile Identity (Elite gold glow)
   - Quick Actions
   - Athlete Snapshot (Avg Elite Score)
   - Skill Breakdown (LOCKED for Free: blur + lock + Upgrade Now)
   - Streaks (confetti on new best streak)
   - Achievements
========================================================= */

type AnalysisItem = {
  skill: string;
  skill_confidence: number; // 0..1
  primary_fix?: string;
  created_at: string;
  result_payload?: {
    elite_score?: number;
  };
};

type Profile = {
  name?: string;
  avatar?: string; // uri
  position?: string;
};

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

/* -------------------------------
   Small utilities
-------------------------------- */
function clamp01(n: number) {
  const x = Number.isFinite(n) ? n : 0;
  return Math.max(0, Math.min(1, x));
}
function safeInt(n: any, fallback = 0) {
  const x = Number(n);
  return Number.isFinite(x) ? Math.round(x) : fallback;
}
function safeDateLabel(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

/* =========================================================
   Animated number hook (stat counters)
========================================================= */
function useAnimatedNumber(target: number, duration = 900) {
  const [display, setDisplay] = useState<number>(safeInt(target));
  const anim = useRef(new Animated.Value(0)).current;
  const lastTarget = useRef<number>(safeInt(target));

  useEffect(() => {
    const nextTarget = safeInt(target);

    // If first run, snap
    if (lastTarget.current === undefined) {
      lastTarget.current = nextTarget;
      setDisplay(nextTarget);
      return;
    }

    const from = safeInt(lastTarget.current);
    const to = nextTarget;

    anim.stopAnimation();
    anim.setValue(0);

    const id = anim.addListener(({ value }) => {
      const v = Math.round(from + (to - from) * value);
      setDisplay(v);
    });

    Animated.timing(anim, {
      toValue: 1,
      duration,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) lastTarget.current = to;
      anim.removeListener(id);
    });

    return () => {
      anim.removeListener(id);
    };
  }, [target, duration, anim]);

  return display;
}

/* =========================================================
   Elite gold border glow (no extra libs)
========================================================= */
function EliteGoldGlowCard({
  children,
  colors,
}: {
  children: React.ReactNode;
  colors: any;
}) {
  // Subtle breathing glow
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1400,
          easing: Easing.out(Easing.quad),
          useNativeDriver: false,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 1400,
          easing: Easing.in(Easing.quad),
          useNativeDriver: false,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  const glowOpacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.22, 0.45],
  });

  return (
    <View style={{ marginBottom: 16 }}>
      {/* Glow layer */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.eliteGlow,
          {
            opacity: glowOpacity as any,
            shadowColor: "#F5C977",
          },
        ]}
      />
      {/* Card */}
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.card,
            borderColor: "#F5C977",
          },
        ]}
      >
        {children}
      </View>
    </View>
  );
}

/* =========================================================
   Confetti (no extra libs)
   - Trigger when best streak hits new high
========================================================= */
type ConfettiParticle = {
  id: string;
  x: number;
  delay: number;
  duration: number;
  size: number;
  glyph: string;
  drift: number;
  spin: number;
};

function ConfettiBurst({
  runKey,
  colors,
  onDone,
}: {
  runKey: number;
  colors: any;
  onDone?: () => void;
}) {
  const [particles, setParticles] = useState<ConfettiParticle[]>([]);
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!runKey) return;

    const glyphs = ["✨", "🏐", "🔥", "⭐️", "💛"];
    const n = 26;

    const next: ConfettiParticle[] = Array.from({ length: n }).map((_, i) => {
      const x = Math.random() * (SCREEN_W - 30) + 15;
      return {
        id: `${runKey}-${i}`,
        x,
        delay: Math.random() * 140,
        duration: 900 + Math.random() * 700,
        size: 14 + Math.random() * 12,
        glyph: glyphs[Math.floor(Math.random() * glyphs.length)],
        drift: (Math.random() - 0.5) * 120,
        spin: (Math.random() - 0.5) * 2.8,
      };
    });

    setParticles(next);
    anim.stopAnimation();
    anim.setValue(0);

    Animated.timing(anim, {
      toValue: 1,
      duration: 1600,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      setParticles([]);
      onDone?.();
    });
  }, [runKey, anim, onDone]);

  if (!particles.length) return null;

  return (
    <View pointerEvents="none" style={RNStyleSheet.absoluteFill}>
      {particles.map((p) => {
        const translateY = anim.interpolate({
          inputRange: [0, 1],
          outputRange: [-40, SCREEN_H * 0.7],
        });

        const translateX = anim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, p.drift],
        });

        const rotate = anim.interpolate({
          inputRange: [0, 1],
          outputRange: ["0rad", `${p.spin}rad`],
        });

        const opacity = anim.interpolate({
          inputRange: [0, 0.75, 1],
          outputRange: [1, 1, 0],
        });

        return (
          <Animated.Text
            key={p.id}
            style={{
              position: "absolute",
              left: p.x,
              top: 0,
              fontSize: p.size,
              opacity,
              transform: [{ translateY }, { translateX }, { rotate }],
              textShadowColor: "#000",
              textShadowRadius: 8,
              color: colors.text,
            }}
          >
            {p.glyph}
          </Animated.Text>
        );
      })}
    </View>
  );
}

/* =========================================================
   Locked Premium Block (blur + lock + Upgrade Now)
========================================================= */
function LockedPremium({
  locked,
  colors,
  title,
  subtitle,
  children,
}: {
  locked: boolean;
  colors: any;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <View style={{ position: "relative" }}>
      <View style={{ opacity: locked ? 0.55 : 1 }}>{children}</View>

      {locked && (
        <>
          <View
            pointerEvents="none"
            style={[
              RNStyleSheet.absoluteFill,
              { borderRadius: 18, overflow: "hidden" },
            ]}
          >
            <BlurView intensity={70} tint="dark" style={RNStyleSheet.absoluteFill} />
          </View>

          <View style={styles.lockOverlay} pointerEvents="none">
            <View style={styles.lockIconWrap}>
              <Ionicons name="lock-closed" size={18} color="#fff" />
            </View>
            <Text style={styles.lockTitle}>{title}</Text>
            <Text style={styles.lockSubtitle}>{subtitle}</Text>
          </View>

          <TouchableOpacity
            onPress={() => router.push("/upgrade")}
            activeOpacity={0.92}
            style={[styles.upgradeBtn, { backgroundColor: colors.primary }]}
          >
            <Text style={styles.upgradeBtnText}>Upgrade Now</Text>
            <Ionicons name="chevron-forward" size={16} color="#000" />
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

/* =========================================================
   Screen
========================================================= */
export default function ProfileScreen() {
  const colors = useAppColors();
  const ent = useEntitlements() as any;

 const isElite = !!ent?.isElite;
const isPro = !!ent?.isPro && !isElite; // prevent double logic
const isFree = !isElite && !isPro;

const canAccessPerformance = isElite || isPro;
const canAccessEliteScore = isElite;


  const [profile, setProfile] = useState<Profile>({});
  const [history, setHistory] = useState<AnalysisItem[]>([]);


  /* =========================
     Load / Save (hardened)
  ========================= */
const loadData = useCallback(async () => {
  // ✅ ALWAYS load streak first



  const pKey = getProfileKey();
  const hKey = getHistoryKey();

  const rawProfile = pKey ? await AsyncStorage.getItem(pKey) : null;
  if (rawProfile) {
    try {
      setProfile(JSON.parse(rawProfile) ?? {});
    } catch {
      setProfile({});
    }
  } else {
    setProfile({});
  }

  const rawHistory = hKey ? await AsyncStorage.getItem(hKey) : null;
  if (rawHistory) {
    try {
      setHistory(JSON.parse(rawHistory) ?? []);
    } catch {
      setHistory([]);
    }
  } else {
    setHistory([]);
  }
}, []);



  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const saveProfile = useCallback(
    async (next: Profile) => {
      setProfile(next);
      const key = getProfileKey();
      if (!key) return;
      // ✅ ensures avatar/name/position persist reliably
      await AsyncStorage.setItem(key, JSON.stringify(next));
    },
    [setProfile]
  );

  /* =========================
     Derivations
  ========================= */
  const totalAnalyses = history.length;

  const avgeliteScore = useMemo(() => {
    if (!history.length) return 0;
    const vals = history
      .map((h) => Number(h?.result_payload?.elite_score ?? 0))
      .filter((n) => Number.isFinite(n) && n > 0);

    if (!vals.length) return 0;
    return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
  }, [history]);
const latestScore = useMemo(() => {
  if (!history.length) return 0;

  const newest = [...history].sort(
    (a, b) =>
      new Date(b.created_at).getTime() -
      new Date(a.created_at).getTime()
  )[0];

  return newest?.result_payload?.elite_score ?? 0;
}, [history]);


const { tier, progress, percentToNext } = useMemo(
  () => getTierProgress(avgeliteScore),
  [avgeliteScore]
);




  const avgeliteScoreAnimated = useAnimatedNumber(avgeliteScore, 900);
  const totalAnalysesAnimated = useAnimatedNumber(totalAnalyses, 850);

  const lastAnalysisDate = useMemo(() => {
    if (!history.length) return null;
    const newest = [...history].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )[0];
    return newest?.created_at ?? null;
  }, [history]);

  const skillBreakdown = useMemo(() => {
    const map: Record<string, number[]> = {};
    history.forEach((h) => {
      const s = String(h.skill || "").toLowerCase();
      const elite = Number(h?.result_payload?.elite_score ?? 0);
      if (!s || !Number.isFinite(elite) || elite <= 0) return;
      if (!map[s]) map[s] = [];
      map[s].push(elite);
    });

    const rows = Object.entries(map).map(([skill, scores]) => ({
      skill,
      avg: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
      count: scores.length,
    }));

    const order = ["passing", "setting", "attacking", "serving", "blocking"];
    rows.sort((a, b) => {
      const ai = order.indexOf(a.skill);
      const bi = order.indexOf(b.skill);
      if (ai === -1 && bi === -1) return a.skill.localeCompare(b.skill);
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    });

    return rows;
  }, [history]);

  const achievements = useMemo(() => {
    const out: { title: string; subtitle: string; icon: any; earned: boolean }[] = [];

    out.push({
      title: "First Rep Logged",
      subtitle: "Analyze your first clip",
      icon: "sparkles-outline",
      earned: totalAnalyses >= 1,
    });

    out.push({
      title: "Consistency Builder",
      subtitle: "7 analyses completed",
      icon: "barbell-outline",
      earned: totalAnalyses >= 7,
    });


    out.push({
      title: "Elite Avg",
      subtitle: "70+ average elite score",
      icon: "trophy-outline",
      earned: avgeliteScore >= 70 && totalAnalyses >= 5,
    });

    out.push({
      title: isElite ? "Elite Member" : isPro ? "Pro Member" : "Free Member",
      subtitle: isElite
        ? "Top-tier access unlocked"
        : isPro
        ? "Premium insights unlocked"
        : "Welcome to VolleyIQ",
      icon: isElite ? "trophy-outline" : isPro ? "sparkles-outline" : "person-outline",
      earned: true,
    });

    return out;
}, [totalAnalyses, avgeliteScore, isElite, isPro]);


  const initials =
    profile.name
      ?.split(" ")
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ?? "👤";

  /* =========================
     Confetti trigger: new best streak
  ========================= */


  /* =========================
     Actions
  ========================= */
  const goAnalyze = () => router.replace("/");
  const goTraining = () => router.push("/training");
  const goProgress = () => router.push("/progress");
  const goHistory = () => router.push("/history");
  const goSettings = () => router.push("/settings");
  const goEditProfile = () => router.push("/edit-profile");

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Confetti overlay */}


      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={{ paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
      >


        {/* Header */}
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.title, { color: colors.text }]}>Profile</Text>
            <Text style={{ color: colors.muted, marginTop: 4 }}>
              Athlete dashboard · performance snapshot
            </Text>

            <View style={{ flexDirection: "row", gap: 10, marginTop: 10, alignItems: "center" }}>
              <View
                style={[
                  styles.tierBadge,
                  {
                    backgroundColor: isElite ? "#F5C977" : isPro ? colors.primary : colors.card,
                    borderColor: isElite ? "#F5C977" : colors.border,
                  },
                ]}
              >
                <Ionicons
                  name={isElite ? "trophy" : isPro ? "sparkles" : "person"}
                  size={14}
                  color="#000"
                />
                <Text style={{ color: "#000", fontWeight: "900", fontSize: 12 }}>
                  {isElite ? "ELITE" : isPro ? "PRO" : "FREE"}
                </Text>
              </View>

              {isFree && (

                <TouchableOpacity
                  onPress={() => router.push("/upgrade")}
                  activeOpacity={0.92}
                  style={[
                    styles.miniUpgrade,
                    { backgroundColor: colors.card, borderColor: colors.border },
                  ]}
                >
                  <Ionicons name="sparkles" size={14} color={colors.text} />
                  <Text style={{ color: colors.text, fontWeight: "900", fontSize: 12 }}>
                    Upgrade
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          <TouchableOpacity
            onPress={goSettings}
            activeOpacity={0.9}
            style={[styles.iconBtn, { borderColor: colors.border }]}
          >
            <Ionicons name="settings-outline" size={20} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Identity (Elite glow) */}
        {isElite ? (
          <EliteGoldGlowCard colors={colors}>
            <IdentityCard
              colors={colors}
              profile={profile}
              initials={initials}
                avgeliteScore={canAccessEliteScore ? avgeliteScoreAnimated : null}
              onEdit={goEditProfile}
            />
          </EliteGoldGlowCard>
        ) : (
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <IdentityCard
              colors={colors}
              profile={profile}
              initials={initials}
                avgeliteScore={canAccessEliteScore ? avgeliteScoreAnimated : null}
              onEdit={goEditProfile}
            />
          </View>
        )}

        {/* Quick Actions */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionLabel, { color: colors.muted }]}>Quick Actions</Text>

          <View style={styles.quickRow}>
            <QuickAction label="Analyze" icon="add" colors={colors} onPress={goAnalyze} />
            <QuickAction label="Training" icon="fitness-outline" colors={colors} onPress={goTraining} />
            <QuickAction label="Progress" icon="stats-chart-outline" colors={colors} onPress={goProgress} />
            <QuickAction label="History" icon="time-outline" colors={colors} onPress={goHistory} />
          </View>
        </View>

        {/* Athlete Snapshot */}
{/* Athlete Snapshot */}
<View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
  <View style={styles.sectionHeaderRow}>
    <Text style={[styles.sectionLabel, { color: colors.muted }]}>Athlete Snapshot</Text>

    <View style={[styles.pill, { backgroundColor: colors.background, borderColor: colors.border }]}>
      <Ionicons name="analytics" size={14} color={colors.muted} />
      <Text style={{ color: colors.muted, fontWeight: "900" }}>Live</Text>
    </View>
  </View>

  {/* ✅ bring back the snapshot grid */}
  <View style={styles.snapGrid}>
    <SnapStat label="Analyses" value={`${totalAnalysesAnimated}`} colors={colors} />
    <SnapStat label="Last Rep" value={lastAnalysisDate ? safeDateLabel(lastAnalysisDate) : "—"} colors={colors} />
    <SnapStat label="Performance" value={tier.label} colors={colors} />
    <SnapStat label="Latest" value={`${latestScore}/100`} colors={colors} />
  </View>

  {/* ✅ Elite-only */}
  <LockedPremium
    locked={!canAccessEliteScore}
    colors={colors}
    title="Elite Score is Elite-only"
    subtitle="Upgrade to unlock biomechanical scoring and advanced metrics."
  >
    <View style={[styles.miniCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
      <Text style={{ color: colors.muted, fontSize: 11, fontWeight: "900", letterSpacing: 0.5 }}>
        AVERAGE ELITE SCORE
      </Text>
      <Text style={{ color: colors.text, fontSize: 22, fontWeight: "900", marginTop: 6 }}>
        {avgeliteScoreAnimated}/100
      </Text>
      <Text style={{ color: colors.muted, marginTop: 6, lineHeight: 20 }}>
        This is your average elite score across all recorded reps.
      </Text>
    </View>
  </LockedPremium>

  {/* ✅ Pro+ */}
  <LockedPremium
    locked={false}
    colors={colors}
    title="Performance Level is Pro+"
    subtitle="Upgrade to track your tier progression and ranking."
  >
    <View style={[styles.miniCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <Text style={{ color: colors.muted, fontSize: 11, fontWeight: "900", letterSpacing: 0.5 }}>
          PERFORMANCE LEVEL
        </Text>


<TouchableOpacity
  onPress={() => router.push("/performance-explained")}
  style={{
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.card,
  }}
  activeOpacity={0.8}
>
  <Text style={{ color: colors.text, fontWeight: "900", fontSize: 13 }}>?</Text>
</TouchableOpacity>

      </View>

      <Text style={{ color: tier.color, fontWeight: "900", marginTop: 8 }}>
        {tier.emoji} {tier.label}
      </Text>

      <View style={{ height: 10, borderRadius: 999, backgroundColor: colors.border, marginTop: 12, overflow: "hidden" }}>
        <View style={{ height: "100%", width: `${Math.max(4, progress * 100)}%`, backgroundColor: tier.color, borderRadius: 999 }} />
      </View>

      <Text style={{ color: colors.muted, marginTop: 8 }}>
        {tier.nextLabel ? `${percentToNext}% to ${tier.nextLabel}` : "Max tier achieved"}
      </Text>
    </View>
  </LockedPremium>
</View>



     


        {/* Skill Breakdown (LOCKED for Free) */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionLabel, { color: colors.muted }]}>Skill Breakdown</Text>

          <LockedPremium
            locked={isFree}

            colors={colors}
            title="Skill breakdown is premium"
            subtitle="Unlock strengths, weak points, and elite trends per skill."
          >
            <View style={{ minHeight: 160, justifyContent: "center" }}>
              {!skillBreakdown.length ? (
                <Text style={{ color: colors.muted, lineHeight: 22 }}>
                  Analyze a few clips to unlock your breakdown — it will rank skills by average elite score.
                </Text>
              ) : (
                <View style={{ marginTop: 4 }}>
                  {skillBreakdown.map((s) => {
                    const barColor =
                      s.avg >= 80 ? colors.primary : s.avg >= 60 ? "#facc15" : "#ef4444";

                    return (
                      <View key={s.skill} style={{ marginTop: 14 }}>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" }}>
                          <View>
                            <Text style={{ color: colors.text, fontWeight: "900" }}>
                              {s.skill.toUpperCase()}
                            </Text>
                            <Text style={{ color: colors.muted, marginTop: 2, fontSize: 12 }}>
                              {s.count} reps · avg elite
                            </Text>
                          </View>
                          <Text style={{ color: colors.text, fontWeight: "900" }}>
                            {s.avg}/100
                          </Text>
                        </View>

                        <View
                          style={{
                            height: 10,
                            borderRadius: 999,
                            backgroundColor: colors.border,
                            marginTop: 10,
                            overflow: "hidden",
                          }}
                        >
                          <View
                            style={{
                              height: "100%",
                              width: `${Math.max(6, Math.min(100, s.avg))}%`,
                              backgroundColor: barColor,
                              borderRadius: 999,
                            }}
                          />
                        </View>
                      </View>
                    );
                  })}
                </View>
              )}
            </View>
          </LockedPremium>
        </View>

        {/* Streaks (confetti on new best) */}
        

        {/* Achievements */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionLabel, { color: colors.muted }]}>Achievements</Text>

          <View style={{ marginTop: 6 }}>
            {achievements.map((a) => (
              <View
                key={a.title}
                style={[
                  styles.achievementRow,
                  {
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                    opacity: a.earned ? 1 : 0.55,
                  },
                ]}
              >
                <View style={[styles.achievementIcon, { backgroundColor: a.earned ? colors.primary : colors.border }]}>
                  <Ionicons name={a.icon} size={18} color={a.earned ? "#000" : colors.muted} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: colors.text, fontWeight: "900" }}>{a.title}</Text>
                  <Text style={{ color: colors.muted, marginTop: 2 }}>{a.subtitle}</Text>
                </View>
                {a.earned && <Ionicons name="checkmark-circle" size={18} color={colors.primary} />}
              </View>
            ))}
          </View>
        </View>

        {/* Footer hint */}
        <Text style={{ color: colors.muted, textAlign: "center", marginTop: 6, lineHeight: 18 }}>
          Tip: Better lighting + steady camera improves analysis accuracy.
        </Text>
      </ScrollView>
    </View>
  );
}

/* =========================================================
   Components
========================================================= */

function IdentityCard({
  colors,
  profile,
  initials,
  avgeliteScore,
  onEdit,
}: {
  colors: any;
  profile: Profile;
  initials: string;
  avgeliteScore: number | null;

  onEdit: () => void;
}) {
  return (
    <View style={styles.profileRow}>
      <View style={[styles.avatar, { backgroundColor: colors.border }]}>
        {profile.avatar ? (
          <Image source={{ uri: profile.avatar }} style={styles.avatarImage} />
        ) : (
          <Text style={[styles.initials, { color: colors.text }]}>{initials}</Text>
        )}
      </View>

      <View style={{ flex: 1 }}>
        <Text style={[styles.name, { color: colors.text }]}>
          {profile.name || "Athlete"}
        </Text>
     <Text style={{ color: colors.muted, marginTop: 4 }}>
  {profile.position || "Volleyball Athlete"}
  {avgeliteScore !== null && ` · ${avgeliteScore}/100 Avg Elite`}
</Text>

      </View>

      <TouchableOpacity
        onPress={onEdit}
        activeOpacity={0.9}
        style={[styles.iconBtn, { borderColor: colors.border }]}
      >
        <Ionicons name="pencil" size={18} color={colors.text} />
      </TouchableOpacity>
    </View>
  );
}

function QuickAction({
  label,
  icon,
  onPress,
  colors,
}: {
  label: string;
  icon: any;
  onPress: () => void;
  colors: any;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.92}
      style={[styles.quickBtn, { backgroundColor: colors.background, borderColor: colors.border }]}
    >
      <View style={[styles.quickIcon, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Ionicons name={icon} size={18} color={colors.text} />
      </View>
      <Text style={{ color: colors.text, fontWeight: "900", marginTop: 8, fontSize: 12 }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function SnapStat({ label, value, colors }: { label: string; value: string; colors: any }) {
  return (
    <View style={[styles.snapCell, { backgroundColor: colors.background, borderColor: colors.border }]}>
      <Text style={{ color: colors.muted, fontSize: 11, fontWeight: "900", letterSpacing: 0.4 }}>
        {label.toUpperCase()}
      </Text>
      <Text style={{ color: colors.text, fontSize: 16, fontWeight: "900", marginTop: 6 }}>
        {value}
      </Text>
    </View>
  );
}

/* =========================================================
   Styles
========================================================= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 18,
  },

  title: { fontSize: 30, fontWeight: "900" },

  card: {
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
  },

  eliteGlow: {
    position: "absolute",
    left: 10,
    right: 10,
    top: 10,
    bottom: 10,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: "#F5C977",
    shadowOpacity: 1,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 0 },
    elevation: Platform.select({ android: 16, default: 0 }),
  },

  sectionLabel: {
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0.7,
    marginBottom: 10,
    textTransform: "uppercase",
  },

  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  avatar: {
    width: 74,
    height: 74,
    borderRadius: 37,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  avatarImage: { width: "100%", height: "100%" },

  initials: { fontSize: 24, fontWeight: "900" },

  name: { fontSize: 20, fontWeight: "900" },

  quickRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },

  quickBtn: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
  },

  quickIcon: {
    width: 36,
    height: 36,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },

  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },

  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },

  snapGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 8,
    gap: 10,
  },

  snapCell: {
    width: "48%",
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
  },

  miniCard: {
    marginTop: 14,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
  },

  tierBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },

  miniUpgrade: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },

  lockOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 34,
    alignItems: "center",
    paddingHorizontal: 18,
  },

  lockIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.45)",
    marginBottom: 10,
  },

  lockTitle: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "900",
    textAlign: "center",
  },

  lockSubtitle: {
    color: "#cfcfcf",
    fontSize: 12,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 6,
    lineHeight: 18,
  },

  upgradeBtn: {
    marginTop: 14,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },

  upgradeBtnText: {
    color: "#000",
    fontWeight: "900",
    fontSize: 15,
  },

  streakRow: {
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
  },

  achievementRow: {
    marginTop: 10,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  achievementIcon: {
    width: 36,
    height: 36,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
});
