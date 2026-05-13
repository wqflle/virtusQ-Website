// themes.tsx

export type ThemeColors = {
  background: string;
  card: string;
  text: string;
  muted: string;
  border: string;
  primary: string;
};

/* ======================================================
   FREE THEMES (SYSTEM / LIGHT / DARK)
====================================================== */

/**
 * LIGHT — maximum readability, neutral contrast
 */
export const lightColors: ThemeColors = {
  background: "#FFFFFF",
  card: "#F6F7F9",
  text: "#0E1117",        // near-black (not pure black)
  muted: "#6B7280",       // readable gray
  border: "#E5E7EB",
  primary: "#FFFFFF",
};

/**
 * DARK — clean, not crushed blacks
 */
export const darkColors: ThemeColors = {
  background: "#0B0C10",
  card: "#12141A",
  text: "#F5F7FA",        // soft white
  muted: "#9CA3AF",
  border: "#1F2937",
  primary: "#E5E7EB",
};

/* ======================================================
   PRO THEME
====================================================== */

/**
 * MIDNIGHT (Pro)
 * Dark blue-black, high contrast text
 */
export const midnightColors: ThemeColors = {
  background: "#0A0F1C",
  card: "#121A2E",
  text: "#EEF2FF",        // very light blue-white
  muted: "#9AA4C1",
  border: "#1E2A4A",
  primary: "#7AA2FF",
};

/* ======================================================
   ELITE THEMES (ALL CONTRAST-SAFE)
====================================================== */

/**
 * AMETHYST (Elite)
 * Purple without sacrificing readability
 */
export const amethystColors: ThemeColors = {
  background: "#0E0A16",
  card: "#19112A",
  text: "#F4F1FF",        // off-white, not purple
  muted: "#B3A7D6",
  border: "#2A1F4A",
  primary: "#B48CFF",
};

/**
 * OBSIDIAN GOLD (Elite)
 * Black + gold without eye strain
 */
export const obsidianColors: ThemeColors = {
  background: "#0B0B0B",
  card: "#141414",
  text: "#FAFAFA",
  muted: "#B5A889",
  border: "#222222",

  primary: "#F5C977",     // gold
  onPrimary: "#0B0B0B",   // 👈 REQUIRED (dark text on gold)
};


/**
 * AURA (Elite)
 * Teal/cyan energy, very readable
 */
export const auraColors: ThemeColors = {
  background: "#081418",
  card: "#10252C",
  text: "#ECFDFB",
  muted: "#8CB7B3",
  border: "#1E3A40",
  primary: "#4EEBC0",
};

/**
 * NEBULA (Elite)
 * Pink accent, neutral readable text
 */
export const nebulaColors: ThemeColors = {
  background: "#0C0E1A",
  card: "#151936",
  text: "#F1F3FF",
  muted: "#A6ACD6",
  border: "#24295A",
  primary: "#FF6BD6",
};

/* ======================================================
   THEME MAP
   (Used by ThemeContext + Settings)
====================================================== */

export const THEMES = {
  system: null, // resolved dynamically
  light: lightColors,
  dark: darkColors,

  // pro
  midnight: midnightColors,

  // elite
  amethyst: amethystColors,
  obsidian: obsidianColors,
  aura: auraColors,
  nebula: nebulaColors,
} as const;
