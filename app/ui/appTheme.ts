import type { Theme } from "@/shared-types/assessmentTypes";

export type AppearancePreference = "dark" | "light" | "system";
export type ResolvedAppearance = "dark" | "light";

export const APPEARANCE_STORAGE_KEY = "n5_assessment_builder_appearance_v1";

export const DARK_THEME: Theme = {
  pageBg: "#0b0f14",
  panelBg: "#0f1620",
  panelBg2: "#0c121a",
  border: "#233040",
  borderSoft: "#1b2633",
  text: "#e6edf5",
  textMuted: "#a9b6c5",
  textDim: "#7f90a4",
  headerBg: "#121c28",
  rowHover: "#101a26",
  controlBg: "#0b1118",
  accent: "#93c5fd",
  accentStrong: "#93c5fd",
  ctaBlueText: "#1e3a8a",
};

export const LIGHT_THEME: Theme = {
  pageBg: "#eef3f8",
  panelBg: "#f7f9fc",
  panelBg2: "#f2f6fa",
  border: "#d5deea",
  borderSoft: "#e3eaf2",
  text: "#162231",
  textMuted: "#506174",
  textDim: "#78879a",
  headerBg: "#ffffff",
  rowHover: "#edf3f9",
  controlBg: "#ffffff",
  accent: "#2563eb",
  accentStrong: "#2563eb",
  ctaBlueText: "#1e3a8a",
};

export function resolveAppearance(
  preference: AppearancePreference,
  systemPrefersDark: boolean
): ResolvedAppearance {
  if (preference === "system") return systemPrefersDark ? "dark" : "light";
  return preference;
}

export function getTheme(
  preference: AppearancePreference,
  systemPrefersDark: boolean
): Theme {
  return resolveAppearance(preference, systemPrefersDark) === "dark"
    ? DARK_THEME
    : LIGHT_THEME;
}