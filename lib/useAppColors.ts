// app/lib/useAppColors.ts
import { useColorScheme } from "react-native";
import { useContext, useMemo } from "react";
import { ThemeContext } from "@/lib/themeContext";

import {
  lightColors,
  darkColors,
  midnightColors,
  amethystColors,
  obsidianColors,
  auraColors,
  nebulaColors,
} from "@/themes/colors";

export function useAppColors() {
  const systemScheme = useColorScheme() ?? "light";
  const { theme } = useContext(ThemeContext);

  return useMemo(() => {
    const resolvedTheme = theme === "system" ? systemScheme : theme;

    switch (resolvedTheme) {
      case "dark":
        return darkColors;

      case "midnight":
        return midnightColors;

      case "amethyst":
        return amethystColors;

      case "obsidian":
        return obsidianColors;

      case "aura":
        return auraColors;

      case "nebula":
        return nebulaColors;

      case "light":
      default:
        return lightColors;
    }
  }, [theme, systemScheme]);
}
