export type ThemeModePreference = "system" | "light" | "dark";
export type ResolvedThemeMode = "light" | "dark";

export const THEME_MODE_STORAGE_KEY = "app-theme-mode";

export function isThemeModePreference(
  value: unknown
): value is ThemeModePreference {
  return value === "system" || value === "light" || value === "dark";
}

export function getSystemPrefersDark(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function resolveThemeMode(
  preference: ThemeModePreference,
  systemPrefersDark: boolean
): ResolvedThemeMode {
  if (preference === "light") return "light";
  if (preference === "dark") return "dark";
  return systemPrefersDark ? "dark" : "light";
}