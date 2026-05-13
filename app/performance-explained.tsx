import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAppColors } from "../lib/useAppColors";
import { Stack } from "expo-router";
export default function PerformanceExplained() {
  const colors = useAppColors();

  const tiers = [
    { emoji: "🥉", name: "Bronze", range: "0–25", color: "#CD7F32" },
    { emoji: "🥈", name: "Silver", range: "26–30", color: "#C0C0C0" },
    { emoji: "🥇", name: "Gold", range: "31–50", color: "#FFD700" },
    { emoji: "💠", name: "Platinum", range: "51–60", color: "#00E5FF" },
    { emoji: "💎", name: "Diamond", range: "61–70", color: "#4FC3F7" },
    { emoji: "🏆", name: "Elite", range: "71–80", color: "#F5C977" },
    { emoji: "👑", name: "Champion", range: "81–100", color: "#7C3AED" },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: 80 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={26} color={colors.text} />
        </TouchableOpacity>

        <Text style={[styles.title, { color: colors.text }]}>
          Performance System
        </Text>

        <View style={{ width: 26 }} />
      </View>

      {/* Intro */}
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          What is Performance Level?
        </Text>

        <Text style={[styles.body, { color: colors.muted }]}>
          Your Performance Level represents your latest elite score tier.
          It updates automatically after every analysis.
        </Text>

        <Text style={[styles.body, { color: colors.muted, marginTop: 8 }]}>
          The higher your level, the more technically consistent, stable,
          and biomechanically efficient your reps are.
        </Text>
      </View>

      {/* Tier Breakdown */}
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Tier Breakdown
        </Text>

        {tiers.map((tier) => (
          <View
            key={tier.name}
            style={[
              styles.tierRow,
              {
                backgroundColor: colors.background,
                borderColor: colors.border,
              },
            ]}
          >
            <View
              style={[
                styles.tierBadge,
                { backgroundColor: tier.color },
              ]}
            >
              <Text style={styles.tierEmoji}>{tier.emoji}</Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.text, fontWeight: "900" }}>
                {tier.name}
              </Text>
              <Text style={{ color: colors.muted, marginTop: 2 }}>
                Score Range: {tier.range}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* How to Progress */}
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          How to Level Up
        </Text>

        <Text style={[styles.body, { color: colors.muted }]}>
          • Improve consistency across reps
        </Text>

        <Text style={[styles.body, { color: colors.muted }]}>
          • Reduce unnecessary movement and jitter
        </Text>

        <Text style={[styles.body, { color: colors.muted }]}>
          • Maintain stable posture at contact
        </Text>

        <Text style={[styles.body, { color: colors.muted }]}>
          • Follow your primary technical fixes
        </Text>

        <Text style={[styles.body, { color: colors.muted, marginTop: 12 }]}>
          Performance increases when your mechanics become repeatable,
          efficient, and controlled under pressure.
        </Text>
      </View>

      {/* Motivation */}
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Long-Term Growth
        </Text>

        <Text style={[styles.body, { color: colors.muted }]}>
          Champion-level athletes don’t reach 90+ by accident.
          They build consistent mechanics over time.
        </Text>

        <Text style={[styles.body, { color: colors.muted, marginTop: 8 }]}>
          Track your progress weekly and focus on incremental improvement.
          Even a +3 increase compounds massively over a season.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },

  title: {
    fontSize: 22,
    fontWeight: "900",
  },

  card: {
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,
    borderWidth: 1,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 12,
  },

  body: {
    fontSize: 14,
    lineHeight: 22,
  },

  tierRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    marginTop: 10,
    gap: 12,
  },

  tierBadge: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  tierEmoji: {
    fontSize: 18,
  },
});
