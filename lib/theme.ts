import AsyncStorage from "@react-native-async-storage/async-storage";
import { Appearance } from "react-native";

export type ThemePref = "system" | "light" | "dark";

export async function getResolvedTheme(): Promise<"light" | "dark"> {
  const pref = (await AsyncStorage.getItem("theme_preference")) as ThemePref | null;

  if (pref === "light" || pref === "dark") return pref;
  return Appearance.getColorScheme() ?? "light";
}
