import { useEffect, useMemo, useState } from "react";

export const APPEARANCE_STORAGE_KEY = "n5-assessment-tool-appearance";

export type AppearancePreference = "light" | "dark" | "system";

export type Theme = {
  pageBg: string;
  panelBg: string;
  panelBg2: string;
  panelBg3: string;
  headerBg: string;

  border: string;
  borderSoft: string;
  borderStrong: string;
  viewerChromeBorder: string;

  text: string;
  subtleText: string;
  mutedText: string;
  textMuted: string;
  textDim: string;
  inverseText: string;

  accent: string;
  accentSoft: string;
  accentStrong: string;

  inputBg: string;
  inputBgSoft: string;
  buttonBg: string;
  buttonBgHover: string;
  buttonGhostBg: string;

  rowHover: string;
  controlBg: string;
  ctaBlueText: string;

  overlay: string;
  shadow: string;

  paper: string;
  paperBorder: string;
  paperText: string;
};

export type AppTheme = Theme;

const DARK_THEME: Theme = {
  pageBg: "#0b0f14",
  panelBg: "#0f1620",
  panelBg2: "#101a27",
  panelBg3: "#0c121a",
  headerBg: "#0b1220",

  border: "rgba(120,145,175,0.18)",
  borderSoft: "rgba(120,145,175,0.10)",
  borderStrong: "rgba(120,145,175,0.34)",
  viewerChromeBorder: "rgba(227,235,248,0.06)",

  text: "#f3f7ff",
  subtleText: "rgba(227,235,248,0.78)",
  mutedText: "rgba(227,235,248,0.56)",
  textMuted: "rgba(227,235,248,0.68)",
  textDim: "rgba(227,235,248,0.42)",
  inverseText: "#08111d",

  accent: "#68a8ff",
  accentSoft: "rgba(104,168,255,0.18)",
  accentStrong: "#3e80ef",

  inputBg: "rgba(255,255,255,0.055)",
  inputBgSoft: "rgba(255,255,255,0.035)",
  buttonBg: "rgba(255,255,255,0.05)",
  buttonBgHover: "rgba(255,255,255,0.09)",
  buttonGhostBg: "rgba(255,255,255,0.035)",

  rowHover: "rgba(255,255,255,0.035)",
  controlBg: "rgba(255,255,255,0.04)",
  ctaBlueText: "#7db4ff",

  overlay: "rgba(3,8,16,0.72)",
  shadow: "0 20px 60px rgba(0,0,0,0.35)",

  paper: "#ffffff",
  paperBorder: "#d9dde4",
  paperText: "#111111",
};

const LIGHT_THEME: Theme = {
  pageBg: "#d9dde2",
  panelBg: "#e2e5e9",
  panelBg2: "#dde1e6",
  panelBg3: "#d7dce2",
  headerBg: "#e3e6ea",

  border: "rgba(27,51,84,0.18)",
  borderSoft: "rgba(27,51,84,0.11)",
  borderStrong: "rgba(27,51,84,0.30)",
  viewerChromeBorder: "rgba(20,33,51,0.11)",

  text: "#122033",
  subtleText: "rgba(18,32,51,0.78)",
  mutedText: "rgba(18,32,51,0.58)",
  textMuted: "rgba(18,32,51,0.68)",
  textDim: "rgba(18,32,51,0.44)",
  inverseText: "#ffffff",

  accent: "#2f73e0",
  accentSoft: "rgba(47,115,224,0.10)",
  accentStrong: "#1d5fc7",

  inputBg: "rgba(18,32,51,0.06)",
  inputBgSoft: "rgba(18,32,51,0.04)",
  buttonBg: "rgba(18,32,51,0.065)",
  buttonBgHover: "rgba(18,32,51,0.095)",
  buttonGhostBg: "rgba(18,32,51,0.045)",

  rowHover: "rgba(18,32,51,0.045)",
  controlBg: "rgba(18,32,51,0.045)",
  ctaBlueText: "#2f73e0",

  overlay: "rgba(13,21,33,0.18)",
  shadow: "0 4px 10px rgba(13,21,33,0.045)",

  paper: "#ffffff",
  paperBorder: "#d9dde4",
  paperText: "#111111",
};

export const APP_THEMES: Record<Exclude<AppearancePreference, "system">, Theme> = {
  light: LIGHT_THEME,
  dark: DARK_THEME,
};

export function resolveAppearance(
  appearance: AppearancePreference,
  systemPrefersDark: boolean,
): "light" | "dark" {
  if (appearance === "system") {
    return systemPrefersDark ? "dark" : "light";
  }
  return appearance;
}

export function getTheme(
  appearance: AppearancePreference,
  systemPrefersDark = true,
): Theme {
  const resolved = resolveAppearance(appearance, systemPrefersDark);
  return APP_THEMES[resolved];
}

export function isAppearancePreference(value: unknown): value is AppearancePreference {
  return value === "light" || value === "dark" || value === "system";
}

export function getStoredAppearance(): AppearancePreference {
  if (typeof window === "undefined") return "system";
  const stored = window.localStorage.getItem(APPEARANCE_STORAGE_KEY);
  return isAppearancePreference(stored) ? stored : "system";
}

export function setStoredAppearance(value: AppearancePreference) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(APPEARANCE_STORAGE_KEY, value);
}

export function getInitialAppearance(): AppearancePreference {
  if (typeof window === "undefined") return "system";
  const stored = window.localStorage.getItem(APPEARANCE_STORAGE_KEY);
  return isAppearancePreference(stored) ? stored : "system";
}

export function useAppearancePreference(
  defaultValue: AppearancePreference = "system",
  systemPrefersDark = true,
) {
  const [appearance, setAppearanceState] = useState<AppearancePreference>(defaultValue);

  useEffect(() => {
    setAppearanceState(getStoredAppearance());
  }, []);

  const theme = useMemo(
    () => getTheme(appearance, systemPrefersDark),
    [appearance, systemPrefersDark],
  );

  const setAppearance = (next: AppearancePreference) => {
    setAppearanceState(next);
    setStoredAppearance(next);
  };

  return {
    appearance,
    setAppearance,
    theme,
  };
}