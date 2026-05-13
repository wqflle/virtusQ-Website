// lib/themeContext.tsx
import React, { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const THEME_KEY = "app_theme_preference";

type Theme =
  | "system"
  | "light"
  | "dark"
  | "midnight"
  | "amethyst"
  | "obsidian"
  | "aura"
  | "nebula";

export const ThemeContext = createContext<{
  theme: Theme;
  setTheme: (t: Theme) => void;
}>({
  theme: "system",
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("system");
  const [ready, setReady] = useState(false);

  // 🔹 LOAD SAVED THEME ON APP START
  useEffect(() => {
    const loadTheme = async () => {
      const stored = await AsyncStorage.getItem(THEME_KEY);
      if (stored) {
        setThemeState(stored as Theme);
      }
      setReady(true);
    };

    loadTheme();
  }, []);

  // 🔹 SAVE THEME WHENEVER IT CHANGES
  const setTheme = async (nextTheme: Theme) => {
    setThemeState(nextTheme);
    await AsyncStorage.setItem(THEME_KEY, nextTheme);
  };

  // 🔹 PREVENT FLASHING BACK TO SYSTEM
  if (!ready) return null;

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
