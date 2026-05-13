import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Switch,
  Linking,
  ScrollView,
  TextInput,
  Platform,
  Animated,
  Easing,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, Stack } from "expo-router";

import { signOut } from "firebase/auth";

import { ThemeContext } from "../../lib/themeContext";

import { useAppColors } from "../../lib/useAppColors";
import { useEntitlements } from "../../lib/useEntitlements";
import { auth } from "../../lib/auth";

/* =====================================================
   TYPES
===================================================== */

type ThemeMode =
  | "system"
  | "light"
  | "dark"
  // Pro/Elite themes (extra)
  | "midnight"
  | "amethyst"
  | "obsidian"
  | "aura"
  | "nebula";

type Colors = {
  background: string;
  card: string;
  text: string;
  muted: string;
  border: string;
  primary: string;
};

/* =====================================================
   LINKS / CONSTANTS
===================================================== */

const SUPPORT_EMAIL = "virtusqsup@gmail.com"; // if you create this email
const PRIVACY_URL = "https://virtusq.com/privacy";
const TERMS_URL = "https://virtusq.com/terms";
const WEBSITE_URL = "https://virtusq.com";
const BILLING_URL = "https://virtusq.com/pricing"; // or wherever billing lives


const STORAGE_KEYS = {
  theme: "app_theme",
  weeklyRecap: "weekly_recap_enabled",
  analytics: "analytics_enabled",
  aiTrainingConsent: "ai_training_consent",
  hasOnboarded: "has_onboarded",
  tutorialCompleted: "tutorial_completed_v1",

  // training
  trainingProfile: "training_profile_v1",
  trainingAvailability: "training_availability",

  // analysis
  analysisHistory: "analysis_history",

  // optional future toggles
  haptics: "haptics_enabled",
  reduceMotion: "reduce_motion",
  autoSync: "auto_sync_enabled",
  aiSafety: "ai_safety_mode",
  offlineMode: "offline_mode_enabled",
  debugMode: "debug_mode_enabled",

  // pro/elite toggles (new)
  microInsights: "elite_micro_insights_enabled",
  failureExplanations: "elite_failure_explanations_enabled",
  performanceMode: "pro_performance_mode",
  advancedThemes: "elite_themes_enabled",
} as const;

/* =====================================================
   ELITE THEMES (LOCAL PALETTES)
   - No other file required
   - We only override colors when theme matches these modes
===================================================== */

const THEME_PRESETS: Record<
  ThemeMode,
  { label: string; tier: "free" | "pro" | "elite"; palette?: Partial<Colors> }
> = {
  system: { label: "System", tier: "free" },
  light: { label: "Light", tier: "free" },
  dark: { label: "Dark", tier: "free" },

  midnight: {
    label: "Midnight ",
    tier: "pro",
    palette: {
      background: "#070A12",
      card: "#0C1020",
      text: "#EAF0FF",
      muted: "#7B86A6",
      border: "#161D33",
      primary: "#7AA2FF",
    },
  },

  amethyst: {
    label: "Amethyst",
    tier: "elite",
    palette: {
      background: "#070513",
      card: "#100A24",
      text: "#F2ECFF",
      muted: "#9C8FBF",
      border: "#241A44",
      primary: "#B48CFF",
    },
  },

  obsidian: {
    label: "Obsidian Gold",
    tier: "elite",
    palette: {
      background: "#050505",
      card: "#0B0B0B",
      text: "#F5F2E8",
      muted: "#9E9480",
      border: "#191919",
      primary: "#F5C977",
    },
  },

  aura: {
    label: "Aura",
    tier: "elite",
    palette: {
      background: "#061014",
      card: "#0A1D24",
      text: "#E8FAFF",
      muted: "#7CA6B5",
      border: "#14333D",
      primary: "#5FF2C2",
    },
  },

  nebula: {
    label: "Nebula",
    tier: "elite",
    palette: {
      background: "#060812",
      card: "#0B0F26",
      text: "#EEF0FF",
      muted: "#8D96C6",
      border: "#1A1F3C",
      primary: "#FF6BD6",
    },
  },
};

/* =====================================================
   HELPERS
===================================================== */

function safeOpen(url: string) {
  Linking.openURL(url).catch(() => {
    Alert.alert("Couldn’t open link", "Please try again later.");
  });
}

function tierLabel(isElite: boolean, isPro: boolean) {
  if (isElite) return "ELITE";
  if (isPro) return "PRO";
  return "FREE";
}




/* =====================================================
   SCREEN
===================================================== */

export default function SettingsScreen() {
 
 const showMyPrivacyData = () => {
  const user = auth.currentUser;


  if (!user) {
    Alert.alert("Not logged in", "No user is currently signed in.");
    return;
  }

  const providers = user.providerData
    .map(p => p.providerId)
    .join(", ");

  const message = [
    `User ID:\n${user.uid}`,
    `\nEmail:\n${user.email ?? "—"}`,
    `\nEmail verified:\n${user.emailVerified ? "Yes" : "No"}`,
    `\nAuth provider(s):\n${providers || "—"}`,
    `\nAccount created:\n${new Date(user.metadata.creationTime ?? "").toLocaleString()}`,
    `\nLast sign-in:\n${new Date(user.metadata.lastSignInTime ?? "").toLocaleString()}`,
    `\nSubscription tier:\n${plan}`,
  ].join("\n");

  Alert.alert(
    "Your Privacy Data",
    message,
    [{ text: "OK" }],
    { cancelable: true }
  );
};

 const handleSignOut = () => {
  Alert.alert(
    "Sign out",
    "Are you sure you want to sign out?",
    [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign out",
        style: "destructive",
        onPress: async () => {
          try {
            await signOut(auth);

            // 🔒 HARD RESET ROUTE
            router.replace("/login");
          } catch (e) {
            console.error("Sign out failed", e);
          }
        },
      },
    ]
  );
};
const handleDeleteAccount = () => {
  Alert.alert(
    "Delete Account",
    "This will permanently delete your account and all data. This cannot be undone.",
    [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            const user = auth.currentUser;

            if (!user) {
              Alert.alert("Error", "No user found.");
              return;
            }

            // 🔥 delete Firebase user
            await user.delete();

            // 🔥 clear local storage
            await AsyncStorage.clear();

            // 🔥 go back to auth
            router.replace("/(auth)/login");

          } catch (e: any) {
            console.log("Delete failed", e);

            // ⚠️ common Firebase issue
            if (e.code === "auth/requires-recent-login") {
              Alert.alert(
                "Re-auth required",
                "Please log in again before deleting your account."
              );
            } else {
              Alert.alert("Error", "Could not delete account.");
            }
          }
        },
      },
    ]
  );
};


  // 🌍 GLOBAL THEME CONTEXT (KEEP EXISTING LOGIC)
  // NOTE: we cast to any so we can store extra ThemeMode values without changing ThemeContext typing
  const { theme, setTheme } = useContext(ThemeContext)

  // Entitlements
  const ent = useEntitlements() as any;
  const isElite = !!ent?.isElite;
  const isPro = !!ent?.isPro;
  const plan = tierLabel(isElite, isPro);

  // existing toggles (KEEP)
  const [weeklyRecap, setWeeklyRecap] = useState(true);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  const [aiTrainingConsent, setAiTrainingConsent] = useState(false);
  // new toggles (ADD — safe defaults, no breaking)
  const [hapticsEnabled, setHapticsEnabled] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true);
  const [aiSafetyMode, setAiSafetyMode] = useState(true);
  const [offlineModeEnabled, setOfflineModeEnabled] = useState(false);
  const [debugModeEnabled, setDebugModeEnabled] = useState(false);

  // Pro/Elite toggles
  const [microInsightsEnabled, setMicroInsightsEnabled] = useState(true);
  const [failureExplanationsEnabled, setFailureExplanationsEnabled] = useState(true);
  const [performanceModeEnabled, setPerformanceModeEnabled] = useState(false);

  // quality-of-life
  const [search, setSearch] = useState("");

  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    account: true,
    appearance: true,
    training: true,
    ai: true,
    pro: true,
    elite: true,
    notifications: true,
    privacy: true,
    support: true,
    data: true,
    about: true,
    advanced: false,
  });

  const toggleExpand = (k: string) => setExpanded((p) => ({ ...p, [k]: !p[k] }));

  // Upgrade card (tap locked setting)
  const [upgradeCard, setUpgradeCard] = useState<{
    visible: boolean;
    title: string;
    subtitle: string;
    tier: "pro" | "elite";
  }>({
    visible: false,
    title: "",
    subtitle: "",
    tier: "pro",
  });

  const showUpgrade = (tier: "pro" | "elite", title: string, subtitle: string) => {
    setUpgradeCard({ visible: true, title, subtitle, tier });
  };

  const hideUpgrade = () => setUpgradeCard((p) => ({ ...p, visible: false }));

  // Smooth card pop
  const upgradeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!upgradeCard.visible) return;
    upgradeAnim.setValue(0);
    Animated.timing(upgradeAnim, {
      toValue: 1,
      duration: 260,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [upgradeCard.visible, upgradeAnim]);

  // colors (base)
const colors = useAppColors();
    




  const q = search.trim().toLowerCase();
  const maybe = (label: string) => q.length === 0 || label.toLowerCase().includes(q);

  /* ===============================
     LOAD SETTINGS (KEEP + ADD)
  ================================ */
  useEffect(() => {
    (async () => {
      try {
        const recap = await AsyncStorage.getItem(STORAGE_KEYS.weeklyRecap);
        if (recap !== null) setWeeklyRecap(recap === "true");

        const analytics = await AsyncStorage.getItem(STORAGE_KEYS.analytics);
        if (analytics !== null) setAnalyticsEnabled(analytics === "true");

        const consent = await AsyncStorage.getItem(STORAGE_KEYS.aiTrainingConsent);
        if (consent !== null) setAiTrainingConsent(consent === "true");

        const haptics = await AsyncStorage.getItem(STORAGE_KEYS.haptics);
        if (haptics !== null) setHapticsEnabled(haptics === "true");

        const rm = await AsyncStorage.getItem(STORAGE_KEYS.reduceMotion);
        if (rm !== null) setReduceMotion(rm === "true");

        const sync = await AsyncStorage.getItem(STORAGE_KEYS.autoSync);
        if (sync !== null) setAutoSyncEnabled(sync === "true");

        const safety = await AsyncStorage.getItem(STORAGE_KEYS.aiSafety);
        if (safety !== null) setAiSafetyMode(safety === "true");

        const offline = await AsyncStorage.getItem(STORAGE_KEYS.offlineMode);
        if (offline !== null) setOfflineModeEnabled(offline === "true");

        const dbg = await AsyncStorage.getItem(STORAGE_KEYS.debugMode);
        if (dbg !== null) setDebugModeEnabled(dbg === "true");

        const mi = await AsyncStorage.getItem(STORAGE_KEYS.microInsights);
        if (mi !== null) setMicroInsightsEnabled(mi === "true");

        const fe = await AsyncStorage.getItem(STORAGE_KEYS.failureExplanations);
        if (fe !== null) setFailureExplanationsEnabled(fe === "true");

        const pm = await AsyncStorage.getItem(STORAGE_KEYS.performanceMode);
        if (pm !== null) setPerformanceModeEnabled(pm === "true");
      } catch {
        // keep defaults
      }
    })();
  }, []);

  /* ===============================
     UPDATE THEME (KEEP LOGIC)
  ================================ */
  const updateTheme = async (mode: ThemeMode) => {
    setTheme(mode);
    await AsyncStorage.setItem(STORAGE_KEYS.theme, mode);
  };

  /* ===============================
     REPLAY TUTORIAL (KEEP)
  ================================ */
  const replayTutorial = async () => {
    await AsyncStorage.removeItem(STORAGE_KEYS.hasOnboarded);
    await AsyncStorage.removeItem(STORAGE_KEYS.tutorialCompleted);

    Alert.alert("Tutorial ready", "Opening the tutorial now.", [
      { text: "Open tutorial", onPress: () => router.replace("/onboarding/tutorial") },
    ]);
  };

  /* ===============================
     RESET TRAINING ONLY (KEEP)
  ================================ */
  const resetTraining = async () => {
    Alert.alert("Reset training plan?", "This will reset your availability and training plan but keep analysis history.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Reset",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.removeItem(STORAGE_KEYS.trainingProfile);
          await AsyncStorage.removeItem(STORAGE_KEYS.trainingAvailability);
          Alert.alert("Training reset", "Your training plan was reset.");
          router.replace("/training");
        },
      },
    ]);
  };

  /* ===============================
     RESET ALL DATA (KEEP)
  ================================ */
  const resetAllData = async () => {
    Alert.alert("Reset all data?", "This will permanently delete all analyses, history, and training data.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Reset",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.clear();
          Alert.alert("Data cleared", "All app data has been removed.");
          router.replace("/");
        },
      },
    ]);
  };

  /* ===============================
     EXTRA POWER FEATURES (KEEP)
  ================================ */
  const clearCacheOnly = async () => {
    const cacheKeys = ["weekly_recap_cache", "weekly_recap_last_generated", "analysis_cache_v1", "training_generated_cache_v1"];
    await AsyncStorage.multiRemove(cacheKeys);
    Alert.alert("Cache cleared", "Temporary cache was cleared.");
  };

  const exportMyData = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const pairs = await AsyncStorage.multiGet(keys);
      const obj: Record<string, string | null> = {};
      pairs.forEach(([k, v]) => (obj[k] = v));
      const preview = JSON.stringify(obj, null, 2).slice(0, 900);

      Alert.alert(
        "Export (preview)",
        preview.length < 50 ? "No data found yet." : preview + "\n\n(Preview only. Add Share later if you want.)"
      );
    } catch {
      Alert.alert("Export failed", "Could not read storage.");
    }
  };

  const openSystemSettings = async () => {
    try {
      await Linking.openSettings();
    } catch {
      Alert.alert("Not supported", "Could not open system settings.");
    }
  };

  const contactSupport = () => {
    const subject = encodeURIComponent("Support Request");
    const body = encodeURIComponent(
      "Describe the issue and what you were doing when it happened.\n\nDevice:\nApp version:\nSteps to reproduce:\n"
    );
    safeOpen(`mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`);
  };

  /* =====================================================
     UI
  ===================================================== */

  const themeModes: ThemeMode[] = useMemo(() => {
    // always show all modes, but lock the pro/elite ones
    return ["system", "light", "dark", "midnight", "amethyst", "obsidian", "aura", "nebula"];
  }, []);

  return (
      <>
     
    <View style={{ flex: 1, backgroundColor: colors.background }}>
     <ScrollView
  style={[styles.container, { backgroundColor: colors.background }]}
  contentContainerStyle={{ paddingBottom: 120 }}
  keyboardShouldPersistTaps="handled"
  showsVerticalScrollIndicator={false}
>
     
  {/* PLAN BADGE */}
  <View style={{ marginBottom: 18 }}>
    <View
      style={[
        styles.planPill,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <Text style={{ color: colors.muted, fontWeight: "900", letterSpacing: 0.6 }}>
        PLAN
      </Text>
      <Text style={{ color: colors.text, fontWeight: "900" }}>{plan}</Text>
      {!isElite && (
        <TouchableOpacity
          onPress={() => router.push("/upgrade")}
          activeOpacity={0.9}
          style={[styles.planCta, { backgroundColor: colors.primary }]}
        >
          <Text style={{ fontWeight: "900", color: "#000" }}>Upgrade</Text>
        </TouchableOpacity>
      )}
    </View>
  </View>
      

        {/* SEARCH */}
        <View style={[styles.searchWrap, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={{ color: colors.muted, fontWeight: "800" }}>Search</Text>
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Theme, tutorial, training, privacy..."
            placeholderTextColor={colors.muted}
            style={[styles.searchInput, { color: colors.text }]}
          />
        </View>

        {/* ACCOUNT */}
        <Section
          title="Account"
          colors={colors}
          expanded={expanded.account}
          onToggle={() => toggleExpand("account")}
          hidden={!maybe("account")}
        >
          <SettingButton label="Edit Profile" onPress={() => router.push("/edit-profile")} colors={colors} hidden={!maybe("edit profile")} />
<SettingButton
  label="Privacy & Data"
  onPress={() => router.push("/settings/privacy")}

  colors={colors}
/>



          <SettingButton
            label="Manage Subscription"
            onPress={() => {
              // link somewhere real later; for now, go to upgrade page
              router.push("/upgrade");
            }}
            colors={colors}
            hidden={!maybe("subscription")}
          />

          <SettingButton
            label="Billing & Receipts"
            onPress={() => safeOpen(BILLING_URL)}
            colors={colors}
            hidden={!maybe("billing")}
          />

          <SettingButton
            label="Restore Purchases"
            onPress={() => Alert.alert("Restore purchases", "Hook this up to your IAP restore call.")}
            colors={colors}
            hidden={!maybe("restore")}
          />

          <SettingButton

  label="Sign Out"
  onPress={handleSignOut}
  colors={colors}
  hidden={!maybe("sign out")}
  danger
/>
<SettingButton
  label="Delete Account"
  danger
  onPress={handleDeleteAccount}
  colors={colors}
/>


          
        </Section>

        {/* APPEARANCE */}
        <Section
          title="Appearance"
          colors={colors}
          expanded={expanded.appearance}
          onToggle={() => toggleExpand("appearance")}
          hidden={!maybe("appearance")}
        >
          <Text style={{ color: colors.muted, lineHeight: 18, marginBottom: 6 }}>
            Choose how the app looks. Some themes are premium.
          </Text>

          {themeModes.map((mode) => {
            const preset = THEME_PRESETS[mode];
            const locked =
              preset.tier === "pro"
                ? !(isPro || isElite)
                : preset.tier === "elite"
                ? !isElite
                : false;

            return (
              <SettingButton
                key={mode}
                label={preset.label}
                selected={theme === mode}
                onPress={() => {
                  if (locked) {
                    showUpgrade(
                      preset.tier === "pro" ? "pro" : "elite",
                      `${preset.label} is locked`,
                      preset.tier === "pro"
                        ? "Upgrade to Pro to unlock premium themes."
                        : "Upgrade to Elite to unlock exclusive themes."
                    );
                    return;
                  }
                  updateTheme(mode);
                }}
                colors={colors}
                hidden={!maybe(preset.label)}
                rightTag={locked ? (preset.tier === "elite" ? "ELITE" : "PRO") : undefined}
              />
            );
          })}

          <ToggleRow
            label="Reduce Motion"
            value={reduceMotion}
            onChange={async (v) => {
              setReduceMotion(v);
              await AsyncStorage.setItem(STORAGE_KEYS.reduceMotion, String(v));
            }}
            colors={colors}
            hidden={!maybe("reduce motion")}
            description="Disables some animations for a calmer UI."
          />

          <ToggleRow
            label="Haptics"
            value={hapticsEnabled}
            onChange={async (v) => {
              setHapticsEnabled(v);
              await AsyncStorage.setItem(STORAGE_KEYS.haptics, String(v));
            }}
            colors={colors}
            hidden={!maybe("haptics")}
            description="Small vibration feedback on key actions (if you add it)."
          />
        </Section>

        {/* TRAINING */}
        <Section
          title="Training"
          colors={colors}
          expanded={expanded.training}
          onToggle={() => toggleExpand("training")}
          hidden={!maybe("training")}
        >
          <SettingButton label="Training Availability" onPress={() => router.push("/training-setup")} colors={colors} hidden={!maybe("availability")} />

          <ToggleRow
            label="Offline Mode"
            value={offlineModeEnabled}
            onChange={async (v) => {
              setOfflineModeEnabled(v);
              await AsyncStorage.setItem(STORAGE_KEYS.offlineMode, String(v));
            }}
            colors={colors}
            hidden={!maybe("offline")}
            description="Stops network calls (useful while testing)."
          />

          <SettingButton label="Reset Training Plan" danger onPress={resetTraining} colors={colors} hidden={!maybe("reset training")} />
        </Section>

        {/* AI */}
        <Section title="AI" colors={colors} expanded={expanded.ai} onToggle={() => toggleExpand("ai")} hidden={!maybe("ai")}>
          <ToggleRow
            label="AI Safety Mode"
            value={aiSafetyMode}
            onChange={async (v) => {
              setAiSafetyMode(v);
              await AsyncStorage.setItem(STORAGE_KEYS.aiSafety, String(v));
            }}
            colors={colors}
            hidden={!maybe("safety")}
            description="Extra conservative outputs (recommended)."
          />

          <ToggleRow
            label="Auto Sync"
            value={autoSyncEnabled}
            onChange={async (v) => {
              setAutoSyncEnabled(v);
              await AsyncStorage.setItem(STORAGE_KEYS.autoSync, String(v));
            }}
            colors={colors}
            hidden={!maybe("sync")}
            description="Automatically sync plans and history when you add backend."
          />

          <SettingButton
            label="Re-run AI calibration"
            onPress={() => Alert.alert("Coming soon", "When you have a backend, you can recalibrate preferences here.")}
            colors={colors}
            hidden={!maybe("calibration")}
          />
        </Section>

        {/* PRO SETTINGS */}
        <Section title="Pro" colors={colors} expanded={expanded.pro} onToggle={() => toggleExpand("pro")} hidden={!maybe("pro")}>
          <Text style={{ color: colors.muted, lineHeight: 18, marginBottom: 6 }}>
            Pro unlocks performance features and advanced customization.
          </Text>

          <ToggleRow
            label="Performance Mode"
            value={performanceModeEnabled}
            onChange={async (v) => {
              if (!(isPro || isElite)) {
                showUpgrade("pro", "Performance Mode is Pro", "Upgrade to Pro to enable performance optimizations.");
                return;
              }
              setPerformanceModeEnabled(v);
              await AsyncStorage.setItem(STORAGE_KEYS.performanceMode, String(v));
            }}
            colors={colors}
            hidden={!maybe("performance")}
            description="Optimizes animations and loads for smoother navigation."
            locked={!(isPro || isElite)}
            onLockedPress={() => showUpgrade("pro", "Performance Mode is Pro", "Upgrade to Pro to enable performance optimizations.")}
          />

          <SettingButton
            label="Advanced Analysis Controls"
            onPress={() => {
              if (!(isPro || isElite)) {
                showUpgrade("pro", "Advanced controls are Pro", "Upgrade to Pro for deeper control over analysis outputs.");
                return;
              }
              Alert.alert("Route placeholder", "Link this to /settings/analysis-controls later.");
            }}
            colors={colors}
            hidden={!maybe("analysis controls")}
            rightTag={!(isPro || isElite) ? "PRO" : undefined}
          />
        </Section>

        {/* ELITE SETTINGS */}
        <Section title="Elite" colors={colors} expanded={expanded.elite} onToggle={() => toggleExpand("elite")} hidden={!maybe("elite")}>
          <Text style={{ color: colors.muted, lineHeight: 18, marginBottom: 6 }}>
            Elite unlocks micro-insights, failure explanations, and advanced pattern detection.
          </Text>

          <ToggleRow
            label="Micro Insights"
            value={microInsightsEnabled}
            onChange={async (v) => {
              if (!isElite) {
                showUpgrade("elite", "Micro Insights is Elite", "Upgrade to Elite to unlock micro-level coaching insights.");
                return;
              }
              setMicroInsightsEnabled(v);
              await AsyncStorage.setItem(STORAGE_KEYS.microInsights, String(v));
            }}
            colors={colors}
            hidden={!maybe("micro")}
            description="Adds subtle elite-only coaching notes across your app."
            locked={!isElite}
            onLockedPress={() => showUpgrade("elite", "Micro Insights is Elite", "Upgrade to Elite to unlock micro-level coaching insights.")}
          />

          <ToggleRow
            label="Failure Explanations"
            value={failureExplanationsEnabled}
            onChange={async (v) => {
              if (!isElite) {
                showUpgrade("elite", "Failure Explanations is Elite", "Upgrade to Elite for detailed breakdowns of what went wrong.");
                return;
              }
              setFailureExplanationsEnabled(v);
              await AsyncStorage.setItem(STORAGE_KEYS.failureExplanations, String(v));
            }}
            colors={colors}
            hidden={!maybe("failure")}
            description="Explains why a rep failed and what to do next."
            locked={!isElite}
            onLockedPress={() =>
              showUpgrade("elite", "Failure Explanations is Elite", "Upgrade to Elite for detailed breakdowns of what went wrong.")
            }
          />

          <SettingButton
            label="Elite Theme Pack (toggle)"
            onPress={async () => {
              if (!isElite) {
                showUpgrade("elite", "Elite Theme Pack is Elite", "Upgrade to Elite to unlock exclusive themes.");
                return;
              }
              Alert.alert("Already enabled", "Elite themes are available in Appearance.");
              await AsyncStorage.setItem(STORAGE_KEYS.advancedThemes, "true");
            }}
            colors={colors}
            hidden={!maybe("theme pack")}
            rightTag={!isElite ? "ELITE" : undefined}
          />

          <SettingButton
            label="Elite Insights Preview"
            onPress={() => {
              if (!isElite) {
                showUpgrade("elite", "Elite Insights Preview is Elite", "Upgrade to Elite to see premium insights on Profile/Progress.");
                return;
              }
              Alert.alert("Elite enabled", "Micro insights will appear across Profile + Progress when available.");
            }}
            colors={colors}
            hidden={!maybe("preview")}
            rightTag={!isElite ? "ELITE" : undefined}
          />
        </Section>

        {/* NOTIFICATIONS */}
        <Section
          title="Notifications"
          colors={colors}
          expanded={expanded.notifications}
          onToggle={() => toggleExpand("notifications")}
          hidden={!maybe("notification")}
        >
          <ToggleRow
            label="Weekly Recap"
            value={weeklyRecap}
            onChange={async (v) => {
              setWeeklyRecap(v);
              await AsyncStorage.setItem(STORAGE_KEYS.weeklyRecap, String(v));
            }}
            colors={colors}
            hidden={!maybe("weekly recap")}
            description="Weekly summary of progress and focus."
          />

          <SettingButton label="Open System Notification Settings" onPress={openSystemSettings} colors={colors} hidden={!maybe("system")} />
        </Section>

        {/* PRIVACY */}
        <Section title="Privacy" colors={colors} expanded={expanded.privacy} onToggle={() => toggleExpand("privacy")} hidden={!maybe("privacy")}>
          <ToggleRow
            label="Usage Analytics"
            value={analyticsEnabled}
            onChange={async (v) => {
              setAnalyticsEnabled(v);
              await AsyncStorage.setItem(STORAGE_KEYS.analytics, String(v));
            }}
            colors={colors}
            hidden={!maybe("analytics")}
            description="Helps improve the app by tracking anonymous usage."
          />
          <ToggleRow
              label="Help Improve AI"
              value={aiTrainingConsent}
              onChange={async (v) => {
                setAiTrainingConsent(v);
                await AsyncStorage.setItem(STORAGE_KEYS.aiTrainingConsent, String(v));
              }}
              colors={colors}
              description="Allow your videos to be used anonymously to improve AI accuracy."
            />
          <SettingButton label="Privacy Policy" onPress={() => safeOpen(PRIVACY_URL)} colors={colors} hidden={!maybe("policy")} />
          <SettingButton label="Terms of Service" onPress={() => safeOpen(TERMS_URL)} colors={colors} hidden={!maybe("terms")} />
        </Section>

        {/* SUPPORT */}
        <Section title="Support" colors={colors} expanded={expanded.support} onToggle={() => toggleExpand("support")} hidden={!maybe("support")}>
          <SettingButton label="Replay Tutorial" onPress={replayTutorial} colors={colors} hidden={!maybe("tutorial")} />
          <SettingButton label="Contact Support" onPress={contactSupport} colors={colors} hidden={!maybe("contact")} />
          <SettingButton label="Visit Website" onPress={() => safeOpen(WEBSITE_URL)} colors={colors} hidden={!maybe("website")} />

          <SettingButton
            label="Report a Bug (quick)"
            onPress={() => Alert.alert("Bug report", "Tip: include the screen + what you tapped + what you expected.")}
            colors={colors}
            hidden={!maybe("bug")}
          />
        </Section>

        {/* DATA */}
        <Section title="Data & Safety" colors={colors} expanded={expanded.data} onToggle={() => toggleExpand("data")} hidden={!maybe("data")}>
          <SettingButton label="Export My Data (preview)" onPress={exportMyData} colors={colors} hidden={!maybe("export")} />
          <SettingButton label="Clear Cache Only" onPress={clearCacheOnly} colors={colors} hidden={!maybe("cache")} />
          <SettingButton label="Reset All Data" danger onPress={resetAllData} colors={colors} hidden={!maybe("reset all")} />
        </Section>

        {/* ADVANCED */}
        <Section title="Advanced" colors={colors} expanded={expanded.advanced} onToggle={() => toggleExpand("advanced")} hidden={!maybe("advanced")}>
          <ToggleRow
            label="Debug Mode"
            value={debugModeEnabled}
            onChange={async (v) => {
              setDebugModeEnabled(v);
              await AsyncStorage.setItem(STORAGE_KEYS.debugMode, String(v));
            }}
            colors={colors}
            hidden={!maybe("debug")}
            description="Shows extra info in the UI while building."
          />

          <SettingButton
            label="Show Storage Keys (for debugging)"
            onPress={async () => {
              try {
                const keys = await AsyncStorage.getAllKeys();
                const msg =
                  keys.length === 0
                    ? "No keys stored yet."
                    : keys.sort().slice(0, 80).join("\n") + (keys.length > 80 ? `\n… +${keys.length - 80} more` : "");
                Alert.alert("AsyncStorage Keys", msg);
              } catch {
                Alert.alert("Error", "Could not read keys.");
              }
            }}
            colors={colors}
            hidden={!maybe("keys")}
          />

          <SettingButton label="Go to Onboarding (dev)" onPress={() => router.push("/onboarding/tutorial")} colors={colors} hidden={!maybe("onboarding")} />
        </Section>

        {/* ABOUT */}
        <Section title="About" colors={colors} expanded={expanded.about} onToggle={() => toggleExpand("about")} hidden={!maybe("about")}>
          <Text style={{ color: colors.muted, lineHeight: 20 }}>
            Version 1.0.0{"\n"}
            Platform: {Platform.OS}
            {"\n"}
            Build: production{"\n"}
            Built for athletes chasing mastery.
          </Text>
        </Section>

        <View style={{ height: 18 }} />
      </ScrollView>

      {/* UPGRADE CARD OVERLAY (for locked taps) */}
      {upgradeCard.visible && (
        <TouchableOpacity activeOpacity={1} onPress={hideUpgrade} style={StyleSheet.absoluteFill}>
          <View style={[styles.overlayDim, { backgroundColor: "rgba(0,0,0,0.55)" }]} />

          <Animated.View
            style={[
              styles.upgradeSheet,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                transform: [
                  {
                    translateY: upgradeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [24, 0],
                    }),
                  },
                  {
                    scale: upgradeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.98, 1],
                    }),
                  },
                ],
                opacity: upgradeAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 1] }),
              },
            ]}
          >
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <Text style={{ color: colors.text, fontWeight: "900", fontSize: 16 }}>
                {upgradeCard.title}
              </Text>
              <TouchableOpacity onPress={hideUpgrade} activeOpacity={0.9} style={[styles.closeBtn, { borderColor: colors.border }]}>
                <Text style={{ color: colors.muted, fontWeight: "900" }}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={{ color: colors.muted, marginTop: 10, lineHeight: 20 }}>{upgradeCard.subtitle}</Text>

            <TouchableOpacity
              onPress={() => {
                hideUpgrade();
                router.push("/upgrade");
              }}
              activeOpacity={0.9}
              style={[styles.primaryCta, { backgroundColor: colors.primary }]}
            >
              <Text style={{ color: "#000", fontWeight: "900", fontSize: 16 }}>
                Upgrade to {upgradeCard.tier === "elite" ? "Elite" : "Pro"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={hideUpgrade} activeOpacity={0.9} style={[styles.secondaryCta, { borderColor: colors.border }]}>
              <Text style={{ color: colors.text, fontWeight: "900" }}>Not now</Text>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
       )}
    </View>
  </>
);
}

/* ===============================
   SMALL COMPONENTS
=============================== */

function Section({
  title,
  colors,
  children,
  expanded,
  onToggle,
  hidden,
}: {
  title: string;
  colors: Colors;
  children: React.ReactNode;
  expanded: boolean;
  onToggle: () => void;
  hidden?: boolean;
}) {
  if (hidden) return null;

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <TouchableOpacity onPress={onToggle} activeOpacity={0.9} style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.muted }]}>{title.toUpperCase()}</Text>
        <Text style={{ color: colors.muted, fontWeight: "900" }}>{expanded ? "−" : "+"}</Text>
      </TouchableOpacity>

      {expanded ? <View style={{ marginTop: 10 }}>{children}</View> : null}
    </View>
  );
}

function SettingButton({
  label,
  onPress,
  colors,
  danger,
  selected,
  hidden,
  rightTag,
}: {
  label: string;
  onPress: () => void;
  colors: Colors;
  danger?: boolean;
  selected?: boolean;
  hidden?: boolean;
  rightTag?: string;
}) {
  if (hidden) return null;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.settingRow,
        selected && {
          backgroundColor: colors.primary,
          borderRadius: 12,
        },
      ]}
      activeOpacity={0.9}
    >
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <Text
          style={{
            color: selected ? "#000" : danger ? "#ef4444" : colors.text,
            fontWeight: "700",
            fontSize: 16,
          }}
        >
          {label}
        </Text>

        {!!rightTag && (
          <View style={[styles.tagPill, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <Text style={{ color: colors.muted, fontWeight: "900", fontSize: 12 }}>{rightTag}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

function ToggleRow({
  label,
  value,
  onChange,
  colors,
  hidden,
  description,
  locked,
  onLockedPress,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
  colors: Colors;
  hidden?: boolean;
  description?: string;
  locked?: boolean;
  onLockedPress?: () => void;
}) {
  if (hidden) return null;

  return (
    <TouchableOpacity
      activeOpacity={locked ? 0.9 : 1}
      onPress={() => {
        if (locked && onLockedPress) onLockedPress();
      }}
      style={{ paddingVertical: 10 }}
    >
      <View style={styles.row}>
        <View style={{ flex: 1, paddingRight: 10 }}>
          <Text style={{ color: colors.text, fontWeight: "700" }}>{label}</Text>
          {!!description && <Text style={{ color: colors.muted, marginTop: 6, lineHeight: 18 }}>{description}</Text>}
        </View>

        <Switch
          value={value}
          onValueChange={(v) => {
            if (locked) {
              if (onLockedPress) onLockedPress();
              return;
            }
            onChange(v);
          }}
        />
      </View>
    </TouchableOpacity>
  );
}

/* ===============================
   STYLES
=============================== */

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  header: { marginBottom: 18 },

  title: { fontSize: 28, fontWeight: "900" },

  planPill: {
    marginTop: 14,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  planCta: {
    marginLeft: "auto",
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },

  searchWrap: {
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    marginBottom: 14,
  },

  searchInput: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: "700",
    paddingVertical: 10,
  },

  card: {
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  sectionTitle: {
    fontSize: 12,
    letterSpacing: 0.6,
    fontWeight: "900",
  },

  settingRow: {
    paddingVertical: 14,
    paddingHorizontal: 6,
  },

  tagPill: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  overlayDim: {
    ...StyleSheet.absoluteFillObject,
  },

  upgradeSheet: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 18,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
  },

  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  primaryCta: {
    marginTop: 14,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
  },

  secondaryCta: {
    marginTop: 10,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
  },
});
