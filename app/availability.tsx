import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAppColors } from "../lib/useAppColors";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
type Day = typeof DAYS[number];
type AvailabilityType = "training" | "game" | "rest";

const OPTIONS: {
  type: AvailabilityType;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}[] = [
  { type: "training", label: "Training", icon: "fitness", color: "#22c55e" },
  { type: "game", label: "Game Day", icon: "trophy", color: "#facc15" },
  { type: "rest", label: "Rest", icon: "bed", color: "#94a3b8" },
];

export default function AvailabilityScreen() {
  const colors = useAppColors();
  const [availability, setAvailability] = useState<
    Record<Day, AvailabilityType>
  >({
    Mon: "training",
    Tue: "training",
    Wed: "training",
    Thu: "training",
    Fri: "training",
    Sat: "rest",
    Sun: "rest",
  });

  // ===============================
  // LOAD
  // ===============================
  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem("weekly_availability");
      if (raw) setAvailability(JSON.parse(raw));
    })();
  }, []);

  // ===============================
  // SAVE
  // ===============================
  const save = async () => {
    await AsyncStorage.setItem(
      "weekly_availability",
      JSON.stringify(availability)
    );
    router.back();
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: 140 }}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          Availability
        </Text>
        <Text style={{ color: colors.muted, marginTop: 4 }}>
          Tell us how your week looks
        </Text>
      </View>

      {/* DAYS */}
      {DAYS.map((day) => (
        <View
          key={day}
          style={[styles.card, { backgroundColor: colors.card }]}
        >
          <Text style={[styles.dayLabel, { color: colors.text }]}>
            {day}
          </Text>

          <View style={styles.optionsRow}>
            {OPTIONS.map((opt) => {
              const active = availability[day] === opt.type;

              return (
                <TouchableOpacity
                  key={opt.type}
                  onPress={() =>
                    setAvailability((prev) => ({
                      ...prev,
                      [day]: opt.type,
                    }))
                  }
                  style={[
                    styles.option,
                    {
                      backgroundColor: active
                        ? opt.color
                        : colors.background,
                      borderColor: active
                        ? opt.color
                        : colors.border,
                    },
                  ]}
                >
                  <Ionicons
                    name={opt.icon}
                    size={18}
                    color={active ? "#000" : colors.muted}
                  />
                  <Text
                    style={{
                      color: active ? "#000" : colors.text,
                      fontWeight: "700",
                      marginTop: 4,
                      fontSize: 13,
                    }}
                  >
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      ))}

      {/* SAVE */}
      <TouchableOpacity
        style={[
          styles.saveButton,
          { backgroundColor: colors.primary },
        ]}
        onPress={save}
      >
        <Text style={styles.saveText}>Save Availability</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },

  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
  },

  card: {
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
  },

  dayLabel: {
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 12,
  },

  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  option: {
    width: "31%",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1.5,
  },

  saveButton: {
    position: "absolute",
    bottom: 28,
    left: 24,
    right: 24,
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
  },

  saveText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "800",
  },
});
