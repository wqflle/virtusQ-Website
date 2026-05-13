import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAppColors } from "../lib/useAppColors";

export default function ConsentScreen() {
  const colors = useAppColors();

  const handleChoice = async (value: boolean) => {
    // ✅ FIX: key changed from "ai_data_consent" → "ai_training_consent"
    // to match what index.tsx reads when appending to the analyze request
    await AsyncStorage.setItem("ai_training_consent", value ? "true" : "false");
    router.replace("/(tabs)");
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: 120 }}
      showsVerticalScrollIndicator={false}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <View
          style={[
            styles.iconWrap,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Ionicons name="shield-checkmark" size={28} color={colors.primary} />
        </View>

        <Text style={[styles.title, { color: colors.text }]}>
          Help Improve VirtusQ
        </Text>

        <Text style={[styles.subtitle, { color: colors.muted }]}>
          You can optionally allow anonymised rep data to improve the AI.
        </Text>
      </View>

      {/* CARD */}
      <View
        style={[
          styles.card,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <View style={styles.row}>
          <Ionicons name="analytics" size={18} color={colors.primary} />
          <Text style={[styles.cardTitle, { color: colors.text }]}>
            AI Training
          </Text>
        </View>

        <Text style={[styles.cardText, { color: colors.muted }]}>
          If enabled, some analyzed reps may be stored anonymously to improve
          VirtusQ's skill detection and coaching accuracy.
        </Text>

        {[
          "No personal information stored",
          "Videos stored anonymously",
          "Helps improve AI coaching accuracy",
        ].map((text) => (
          <View key={text} style={styles.bullet}>
            <Ionicons name="checkmark-circle" size={16} color="#22c55e" />
            <Text style={[styles.bulletText, { color: colors.muted }]}>
              {text}
            </Text>
          </View>
        ))}
      </View>

      {/* BUTTONS */}
      <View style={{ marginTop: 24 }}>
        <TouchableOpacity
          onPress={() => handleChoice(true)}
          activeOpacity={0.9}
          style={[styles.primaryButton, { backgroundColor: colors.primary }]}
        >
          <Text style={styles.primaryText}>Allow Anonymous Training Data</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleChoice(false)}
          activeOpacity={0.9}
          style={[
            styles.secondaryButton,
            { borderColor: colors.border, backgroundColor: colors.card },
          ]}
        >
          <Text style={{ color: colors.text, fontWeight: "800" }}>
            Continue Without Sharing
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.footer, { color: colors.muted }]}>
        You can change this anytime in Settings.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 22 },

  header: {
    marginTop:    60,
    marginBottom: 24,
    alignItems:   "center",
  },

  iconWrap: {
    width:          64,
    height:         64,
    borderRadius:   18,
    borderWidth:    1,
    alignItems:     "center",
    justifyContent: "center",
    marginBottom:   16,
  },

  title: {
    fontSize:      28,
    fontWeight:    "900",
    letterSpacing: 0.2,
    textAlign:     "center",
  },

  subtitle: {
    marginTop:  8,
    fontSize:   14,
    textAlign:  "center",
    lineHeight: 20,
  },

  card: {
    borderRadius: 20,
    borderWidth:  1,
    padding:      20,
    marginTop:    10,
  },

  row: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           8,
    marginBottom:  10,
  },

  cardTitle: { fontWeight: "900", fontSize: 16 },

  cardText: { lineHeight: 20, marginBottom: 14 },

  bullet: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           8,
    marginBottom:  8,
  },

  bulletText: { fontSize: 14 },

  primaryButton: {
    paddingVertical: 16,
    borderRadius:    16,
    alignItems:      "center",
  },

  primaryText: {
    color:      "#000",
    fontWeight: "900",
    fontSize:   16,
  },

  secondaryButton: {
    marginTop:       12,
    paddingVertical: 16,
    borderRadius:    16,
    borderWidth:     1,
    alignItems:      "center",
  },

  footer: {
    marginTop: 20,
    textAlign: "center",
    fontSize:  12,
  },
});