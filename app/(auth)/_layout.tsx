import { Stack } from "expo-router";
import { useAppColors } from "../../lib/useAppColors";

export default function AuthLayout() {
  const colors = useAppColors();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTitleStyle: {
          color: colors.text,
          fontWeight: "900",
          fontSize: 18,
        },
        headerTintColor: colors.text,
        headerShadowVisible: false,
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen
        name="login"
        options={{
          title: "Log in",
        }}
      />

      <Stack.Screen
        name="signup"
        options={{
          title: "Create account",
        }}
      />
    </Stack>
  );
}