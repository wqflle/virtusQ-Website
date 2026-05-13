import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import { useAppColors } from "../lib/useAppColors";;
import { getDailyFocus } from "../lib/dailyFocus";

/* =========================================================
   DAILY FOCUS CARD (AUTHORITATIVE, BACKEND-DRIVEN)
========================================================= */

export default function DailyFocusCard() {
  const colors = useAppColors();
  const [focus, setFocus] = useState<any>(null);

  /* -------------------------------
     LOAD DAILY FOCUS
  -------------------------------- */
  useEffect(() => {
    getDailyFocus().then(setFocus);
  }, []);

  if (!focus) return null;

  /* -------------------------------
     DERIVED COPY (SAFE)
  -------------------------------- */
  const skillLabel = focus.skill
    ? String(focus.skill).toUpperCase()
    : "FOCUS";

  const reasonText =
    focus.reason ??
    "Based on recent analysis trends and consistency scoring.";

  const primaryFix =
    typeof focus.primary_fix === "string"
      ? focus.primary_fix
      : focus.primary_fix?.label ?? null;

  /* -------------------------------
     OPEN SESSION (FIXED ROUTE)
  -------------------------------- */
  const openSession = () => {
    // ✅ ALWAYS route to existing file: app/training/day.tsx
    router.push({
      pathname: "/training/day",
      params: {
        skill: focus.skill,
        focus_key: focus.focus_key,
        session: focus.session,
      },
    });
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <View style={[styles.card, { backgroundColor: colors.card }]}>
      <Text style={[styles.label, { color: colors.muted }]}>
        DAILY FOCUS
      </Text>

      <Text style={[styles.skill, { color: colors.text }]}>
        {skillLabel}
      </Text>

      <Text style={[styles.reason, { color: colors.muted }]}>
        {reasonText}
      </Text>

      {!!primaryFix && (
        <View style={styles.fixBox}>
          <Text style={[styles.fixLabel, { color: colors.muted }]}>
            PRIMARY FIX
          </Text>
          <Text style={[styles.fixText, { color: colors.text }]}>
            {primaryFix}
          </Text>
        </View>
      )}

      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: colors.primary },
        ]}
        onPress={openSession}
      >
        <Text style={styles.buttonText}>
          Open today's session
        </Text>
      </TouchableOpacity>
    </View>
  );
}

/* =========================================================
   STYLES
========================================================= */

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 18,
  },

  label: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.8,
  },

  skill: {
    fontSize: 26,
    fontWeight: "900",
    marginTop: 6,
  },

  reason: {
    marginTop: 6,
    lineHeight: 20,
  },

  fixBox: {
    marginTop: 14,
  },

  fixLabel: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.6,
  },

  fixText: {
    fontWeight: "700",
    marginTop: 4,
    fontSize: 15,
  },

  button: {
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
  },

  buttonText: {
    color: "#000",
    fontWeight: "900",
    fontSize: 16,
  },
});
