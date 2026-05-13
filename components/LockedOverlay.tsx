import { View, Text, TouchableOpacity } from "react-native";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { useAppColors } from "../lib/useAppColors";;

type Props = {
  onUpgrade: () => void;
  onPreview: () => void;
};

export function LockedOverlay({ onUpgrade, onPreview }: Props) {
  const colors = useAppColors();

  return (
    <BlurView
      intensity={60}
      tint="dark"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        zIndex: 999,
      }}
    >
      <Ionicons name="lock-closed" size={56} color="#fff" />

      <Text
        style={{
          color: "#fff",
          fontSize: 22,
          fontWeight: "900",
          marginTop: 16,
          textAlign: "center",
        }}
      >
        Pro feature
      </Text>

      <Text
        style={{
          color: "#ccc",
          marginTop: 10,
          textAlign: "center",
          lineHeight: 22,
        }}
      >
        Unlock training plans, progress analytics, and elite insights.
      </Text>

      {/* Upgrade */}
      <TouchableOpacity
        onPress={onUpgrade}
        style={{
          marginTop: 24,
          paddingVertical: 14,
          paddingHorizontal: 28,
          backgroundColor: colors.primary,
          borderRadius: 16,
        }}
      >
        <Text style={{ fontWeight: "900", fontSize: 16 }}>
          Upgrade plan now
        </Text>
      </TouchableOpacity>

      {/* Preview */}
      <TouchableOpacity
        onPress={onPreview}
        style={{
          marginTop: 12,
          paddingVertical: 12,
          paddingHorizontal: 28,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: "#555",
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "900" }}>
          Preview Pro & Elite
        </Text>
      </TouchableOpacity>
    </BlurView>
  );
}
