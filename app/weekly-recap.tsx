import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useColorScheme,
  TouchableOpacity,
} from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { darkColors, lightColors } from "../themes/colors";

type WeeklyRecap = {
  weekOf: string;
  totalAnalyses: number;
  focusSkill: string;
  avgConfidence: number;
  createdAt: string;
};

export default function WeeklyRecapScreen() {
  const scheme = useColorScheme();
  const colors = scheme === "dark" ? darkColors : lightColors;

  const [recap, setRecap] = useState<WeeklyRecap | null>(null);

  useEffect(() => {
    loadLatestRecap();
  }, []);

  const loadLatestRecap = async () => {
    const keys = await AsyncStorage.getAllKeys();
    const recapKeys = keys
      .filter((k) => k.startsWith("weekly_recap_"))
      .sort()
      .reverse();

    if (!recapKeys.length) return;

    const raw = await AsyncStorage.getItem(recapKeys[0]);
    if (!raw) return;

    setRecap(JSON.parse(raw));
  };

  if (!recap) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.muted }}>
          No weekly recap available yet.
        </Text>
      </View>
    );
  }

  const confidencePct = Math.round(recap.avgConfidence * 100);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: 120 }}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          Weekly Recap
        </Text>
        <Text style={{ color: colors.muted }}>
          Week of {recap.weekOf}
        </Text>
      </View>

      {/* SUMMARY CARDS */}
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.cardLabel, { color: colors.muted }]}>
          This Week
        </Text>

        <SummaryRow
          label="Analyses"
          value={`${recap.totalAnalyses}`}
          colors={colors}
        />
        <SummaryRow
          label="Focus Skill"
          value={recap.focusSkill}
          colors={colors}
        />
        <SummaryRow
          label="Avg Confidence"
          value={`${confidencePct}%`}
          colors={colors}
        />
      </View>

      {/* AI INSIGHT */}
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.cardLabel, { color: colors.muted }]}>
          AI Insight
        </Text>

        <Text style={{ color: colors.text, lineHeight: 22 }}>
          {confidencePct >= 90
            ? "Elite consistency this week. You’re executing at a high competitive level — keep pushing precision."
            : confidencePct >= 75
            ? "Strong progress overall. Focused reps this week will tighten your technique."
            : "This was a foundation week. Clean reps and consistency will drive your next jump."}
        </Text>
      </View>

      {/* ACTIONS */}
      <TouchableOpacity
        style={[styles.primaryBtn, { backgroundColor: colors.primary }]}
        onPress={() => router.replace("/training")}
      >
        <Text style={styles.primaryBtnText}>Go to Training Plan</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.secondaryBtn, { borderColor: colors.border }]}
        onPress={() => router.replace("/")}
      >
        <Text style={{ color: colors.text, fontWeight: "700" }}>
          Analyze a New Video
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

/* ===============================
   SMALL COMPONENTS
   =============================== */
function SummaryRow({
  label,
  value,
  colors,
}: {
  label: string;
  value: string;
  colors: any;
}) {
  return (
    <View style={styles.row}>
      <Text style={{ color: colors.muted, fontSize: 13 }}>
        {label}
      </Text>
      <Text style={{ color: colors.text, fontWeight: "800", fontSize: 16 }}>
        {value}
      </Text>
    </View>
  );
}

/* ===============================
   STYLES
   =============================== */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
  },

  card: {
    borderRadius: 18,
    padding: 20,
    marginBottom: 18,
  },
  cardLabel: {
    fontSize: 13,
    letterSpacing: 0.6,
    marginBottom: 10,
    textTransform: "uppercase",
    fontWeight: "800",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  primaryBtn: {
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
  },
  primaryBtnText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "900",
  },

  secondaryBtn: {
    marginTop: 12,
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
