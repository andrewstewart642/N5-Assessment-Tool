import { useEffect, useMemo, useState } from "react";

export const APPEARANCE_STORAGE_KEY = "n5-assessment-tool-appearance";

export type AppearancePreference = "light" | "dark";

export type AppTheme = {
  // Core surfaces
  pageBg: string;
  panelBg: string;
  panelBg2: string;
  panelBg3: string;

  // Borders / dividers
  border: string;
  borderStrong: string;

  // Typography
  text: string;
  subtleText: string;
  mutedText: string;
  inverseText: string;

  // Brand / accent
  accent: string;
  accentSoft: string;
  accentStrong: string;

  // Interactive surfaces
  inputBg: string;
  inputBgSoft: string;
  buttonBg: string;
  buttonBgHover: string;
  buttonGhostBg: string;

  // Utility surfaces
  overlay: string;
  shadow: string;

  // Paper preview helpers
  paper: string;
  paperBorder: string;
  paperText: string;
};

export const DARK_THEME: AppTheme = {
  // Core surfaces
  pageBg: "#0b0f14",
  panelBg: "#0f1620",
  panelBg2: "#101a27",
  panelBg3: "#0c121a",

  // Borders / dividers
  border: "rgba(120, 145, 175, 0.18)",
  borderStrong: "rgba(120, 145, 175, 0.34)",

  // Typography
  text: "#f3f7ff",
  subtleText: "rgba(227, 235, 248, 0.78)",
  mutedText: "rgba(227, 235, 248, 0.56)",
  inverseText: "#08111d",

  // Brand / accent
  accent: "#68a8ff",
  accentSoft: "rgba(104, 168, 255, 0.18)",
  accentStrong: "#3e80ef",

  // Interactive surfaces
  inputBg: "rgba(255,255,255,0.055)",
  inputBgSoft: "rgba(255,255,255,0.035)",
  buttonBg: "rgba(255,255,255,0.05)",
  buttonBgHover: "rgba(255,255,255,0.09)",
  buttonGhostBg: "rgba(255,255,255,0.035)",

  // Utility surfaces
  overlay: "rgba(3, 8, 16, 0.72)",
  shadow: "0 20px 60px rgba(0,0,0,0.35)",

  // Paper preview helpers
  paper: "#ffffff",
  paperBorder: "#d9dde4",
  paperText: "#111111",
};

export const LIGHT_THEME: AppTheme = {
  // Core surfaces
  pageBg: "#eef3f8",
  panelBg: "#ffffff",
  panelBg2: "#f8fbff",
  panelBg3: "#f3f7fc",

  // Borders / dividers
  border: "rgba(27, 51, 84, 0.12)",
  borderStrong: "rgba(27, 51, 84, 0.22)",

  // Typography
  text: "#142133",
  subtleText: "rgba(20, 33, 51, 0.76)",
  mutedText: "rgba(20, 33, 51, 0.55)",
  inverseText: "#ffffff",

  // Brand / accent
  accent: "#2f73e0",
  accentSoft: "rgba(47, 115, 224, 0.12)",
  accentStrong: "#1d5fc7",

  // Interactive surfaces
  inputBg: "rgba(20, 33, 51, 0.04)",
  inputBgSoft: "rgba(20, 33, 51, 0.025)",
  buttonBg: "rgba(20, 33, 51, 0.045)",
  buttonBgHover: "rgba(20, 33, 51, 0.08)",
  buttonGhostBg: "rgba(20, 33, 51, 0.03)",

  // Utility surfaces
  overlay: "rgba(13, 21, 33, 0.18)",
  shadow: "0 18px 40px rgba(13, 21, 33, 0.14)",

  // Paper preview helpers
  paper: "#ffffff",
  paperBorder: "#d9dde4",
  paperText: "#111111",
};

export const APP_THEMES: Record<AppearancePreference, AppTheme> = {
  light: LIGHT_THEME,
  dark: DARK_THEME,
};

export function getTheme(appearance: AppearancePreference): AppTheme {
  return APP_THEMES[appearance] ?? DARK_THEME;
}

export function isAppearancePreference(value: unknown): value is AppearancePreference {
  return value === "light" || value === "dark";
}

export function getStoredAppearance(): AppearancePreference {
  if (typeof window === "undefined") {
    return "dark";
  }

  const stored = window.localStorage.getItem(APPEARANCE_STORAGE_KEY);
  if (isAppearancePreference(stored)) {
    return stored;
  }

  return "dark";
}

export function setStoredAppearance(value: AppearancePreference) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(APPEARANCE_STORAGE_KEY, value);
}

export function getInitialAppearance(): AppearancePreference {
  if (typeof window === "undefined") {
    return "dark";
  }

  const stored = window.localStorage.getItem(APPEARANCE_STORAGE_KEY);
  if (isAppearancePreference(stored)) {
    return stored;
  }

  return "dark";
}

export function useAppearancePreference(defaultValue: AppearancePreference = "dark") {
  const [appearance, setAppearance] = useState<AppearancePreference>(defaultValue);

  useEffect(() => {
    setAppearance(getStoredAppearance());
  }, []);

  const theme = useMemo(() => getTheme(appearance), [appearance]);

  const updateAppearance = (next: AppearancePreference) => {
    setAppearance(next);
    setStoredAppearance(next);
  };

  return {
    appearance,
    setAppearance: updateAppearance,
    theme,
  };
}