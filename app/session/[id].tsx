import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAppColors } from "../../lib/useAppColors";;

type Session = {
  id: string;
  startedAt: string;
  avgConfidence: number;
  focusSkill: string;
  analyses: {
    skill: string;
    skill_confidence: number;
    quality?: "good" | "situational" | "bad";
    created_at: string;
  }[];
};

export default function SessionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useAppColors();

  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem("analysis_history");
      if (!raw) return;

      const history = JSON.parse(raw);

      // Rebuild sessions exactly like ProgressScreen
      const { buildSessions } = await import("../../lib/sessions");
      const sessions = buildSessions(history);

      const found = sessions.find((s: Session) => s.id === id);
      setSession(found ?? null);
    })();
  }, [id]);

  if (!session) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: colors.background },
        ]}
      >
        <Text style={{ color: colors.muted }}>
          Session not found
        </Text>
      </View>
    );
  }

  const date = new Date(session.startedAt).toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  return (
    <>
      <Stack.Screen options={{ title: "Session" }} />

      <ScrollView
        style={[
          styles.container,
          { backgroundColor: colors.background },
        ]}
      >
        {/* HEADER */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.title, { color: colors.text }]}>
            {date}
          </Text>
          <Text style={{ color: colors.muted, marginTop: 4 }}>
            Focus: {session.focusSkill} • Avg{" "}
            {session.avgConfidence}%
          </Text>
        </View>

        {/* REPS */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionLabel, { color: colors.muted }]}>
            Reps
          </Text>

          {session.analyses.map((a, idx) => {
            const qualityColor =
              a.quality === "good"
                ? "#22c55e"
                : a.quality === "bad"
                ? "#ef4444"
                : "#facc15";

            return (
              <View
                key={idx}
                style={[
                  styles.repRow,
                  { borderBottomColor: colors.border },
                ]}
              >
                <View>
                  <Text
                    style={{
                      color: colors.text,
                      fontWeight: "700",
                    }}
                  >
                    {a.skill.toUpperCase()}
                  </Text>
                  <Text style={{ color: colors.muted }}>
                    {Math.round(a.skill_confidence * 100)}%
                    confidence
                  </Text>
                </View>

                <Text
                  style={{
                    color: qualityColor,
                    fontWeight: "800",
                  }}
                >
                  {a.quality?.toUpperCase() ?? "—"}
                </Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  card: {
    borderRadius: 18,
    padding: 20,
    marginBottom: 18,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
  },
  sectionLabel: {
    fontSize: 12,
    letterSpacing: 0.6,
    marginBottom: 12,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  repRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
