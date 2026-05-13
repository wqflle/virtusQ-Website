// app/(tabs)/_layout.tsx
import React from "react";
import { Tabs, router } from "expo-router";
import { Pressable, StyleSheet, View, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAppColors } from "../../lib/useAppColors";

export default function TabsLayout() {
  const colors = useAppColors();

  return (
    <Tabs
      screenOptions={{
        /* ================= HEADER ================= */
        headerShown: true,
        headerStyle: { backgroundColor: colors.background },
        headerTitleStyle: {
          color: colors.text,
          fontWeight: "900",
        },
        headerTintColor: colors.text,
        headerShadowVisible: false,

        /* SETTINGS ICON — EVERY TAB */
        headerRight: () => (
          <Pressable
            onPress={() => router.push("/settings")}
            hitSlop={12}
            style={{ paddingRight: 16 }}
          >
            <Ionicons
              name="settings-outline"
              size={22}
              color={colors.text}
            />
          </Pressable>
        ),

        /* ================= TAB BAR ================= */
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          height: Platform.OS === "ios" ? 92 : 68,
          paddingBottom: Platform.OS === "ios" ? 28 : 10,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: { fontWeight: "700" },
      }}
    >
      {/* HISTORY */}
      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="time-outline" size={size} color={color} />
          ),
        }}
      />

      {/* TRAINING */}
      <Tabs.Screen
        name="training"
        options={{
          title: "Training",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart-outline" size={size} color={color} />
          ),
        }}
      />

      {/* ANALYZE — CENTER PLUS */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Analyze",
          tabBarIcon: () => null,
          tabBarItemStyle: { height: 0 },
          tabBarButton: () => (
            <Pressable
              onPress={() => router.replace("/(tabs)")}
              style={styles.plusHitbox}
            >
              <View
                style={[
                  styles.plus,
                  {
                    backgroundColor: colors.primary,
                    shadowColor: "#000",
                  },
                ]}
              >
                <Ionicons name="add" size={36} color="#000" />
              </View>
            </Pressable>
          ),
        }}
      />

      {/* PROGRESS */}
      <Tabs.Screen
        name="progress"
        options={{
          title: "Progress",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="stats-chart-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* PROFILE */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  plusHitbox: {
    position: "absolute",
    top: -22,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  plus: {
    width: 66,
    height: 66,
    borderRadius: 33,
    alignItems: "center",
    justifyContent: "center",
    elevation: 12,
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 6 },
  },
});
