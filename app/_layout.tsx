// app/_layout.tsx

import React, { useEffect, useState, useRef } from "react";
import { TouchableOpacity, Text } from "react-native";
import { Stack, router } from "expo-router";
import 'react-native-get-random-values';

import AsyncStorage from "@react-native-async-storage/async-storage";

import { ThemeProvider } from "../lib/themeContext";
import { initRevenueCat } from "../lib/revenueCat";
import { useAppColors } from "../lib/useAppColors";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/auth";
import Purchases from "react-native-purchases";
import { EntitlementsProvider } from "../lib/EntitlementsProvider";

export default function RootLayout() {
  const [ready, setReady] = useState(false);
  const hasRouted = useRef(false);

  // ✅ Init RevenueCat
  useEffect(() => {
    const init = async () => {
      try {
        await Promise.race([
          initRevenueCat(),
          new Promise(resolve => setTimeout(resolve, 3000))
        ]);
      } catch (e) {
        console.log("RevenueCat init failed", e);
      } finally {
        setReady(true);
      }
    };
    init();
  }, []);

  // ✅ Auth + Routing
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        // NOT LOGGED IN
        if (!user) {
          router.replace("/(auth)/login");
          hasRouted.current = true;
          return;
        }

        // ✅ Always register with RevenueCat immediately for ALL users
        try {
          await Purchases.logIn(user.uid);
          await AsyncStorage.setItem("activeUid", user.uid);
        } catch (e) {
          console.log("RC login error", e);
        }

        // ONBOARDING
        const onboardingKey = `onboarding_done_${user.uid}`;
        const onboardingDone = await AsyncStorage.getItem(onboardingKey);

        if (onboardingDone !== "true") {
          router.replace("/onboarding/tutorial");
          hasRouted.current = true;
          return;
        }

        // CONSENT
        const consent = await AsyncStorage.getItem("ai_data_consent");

        if (consent !== "true") {
          router.replace("/consent");
          hasRouted.current = true;
          return;
        }

        // MAIN APP
        router.replace("/(tabs)");
        hasRouted.current = true;

      } catch (e) {
        console.log("Routing error", e);
      }
    });

    return () => unsubscribe();
  }, []);

  if (!ready) return null;

  return (
    <EntitlementsProvider>
      <ThemeProvider>
        <RootStack />
      </ThemeProvider>
    </EntitlementsProvider>
  );
}

function BackArrow({ color }: { color: string }) {
  return (
    <TouchableOpacity
      onPress={() => router.back()}
      hitSlop={10}
      style={{ paddingHorizontal: 8 }}
    >
      <Text style={{ color, fontSize: 22, fontWeight: "800" }}>
        ←
      </Text>
    </TouchableOpacity>
  );
}

function RootStack() {
  const colors = useAppColors();

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTitleStyle: {
          color: colors.text,
          fontWeight: "900",
        },
        headerTintColor: colors.text,
        headerShadowVisible: false,
        headerBackVisible: false,
        headerBackTitle: "",
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="consent" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="training-setup" options={{ title: "Availability" }} />
      <Stack.Screen
        name="settings"
        options={{
          title: "Settings",
          headerLeft: () => <BackArrow color={colors.text} />,
        }}
      />
      <Stack.Screen
        name="upgrade"
        options={{
          title: "Upgrade",
          headerLeft: () => <BackArrow color={colors.text} />,
        }}
      />
      <Stack.Screen
        name="progress/skill"
        options={{
          title: "Skill Progress",
          headerLeft: () => <BackArrow color={colors.text} />,
        }}
      />
      <Stack.Screen
        name="performance-explained"
        options={{
          title: "Performance Levels",
          headerLeft: () => <BackArrow color={colors.text} />,
        }}
      />
    </Stack>
  );
}