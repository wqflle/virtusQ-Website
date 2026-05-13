import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { darkColors, lightColors } from "../themes/colors";

const OPTIONS = ["system", "light", "dark"] as const;

export default function ThemeScreen() {
  const system = useColorScheme();
  const colors = system === "dark" ? darkColors : lightColors;

  const setTheme = async (t: string) => {
    const raw = await AsyncStorage.getItem("profile_v1");
    const p = raw ? JSON.parse(raw) : {};
    await AsyncStorage.setItem(
      "profile_v1",
      JSON.stringify({ ...p, theme: t })
    );
    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Theme</Text>

      {OPTIONS.map((o) => (
        <TouchableOpacity
          key={o}
          onPress={() => setTheme(o)}
          style={[styles.option, { borderColor: colors.border }]}
        >
          <Text style={{ color: colors.text, fontWeight: "700" }}>
            {o.toUpperCase()}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  title: { fontSize: 28, fontWeight: "800", marginBottom: 20 },
  option: {
    padding: 16,
    borderWidth: 1,
    borderRadius: 14,
    marginBottom: 12,
  },
});
