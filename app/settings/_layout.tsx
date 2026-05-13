import { Stack } from "expo-router";
import { useAppColors } from "../../lib/useAppColors";;

export default function SettingsLayout() {
  const colors = useAppColors();

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: colors.card },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: "900" },
        headerBackTitleVisible: false,
      }}
    />
  );
}
