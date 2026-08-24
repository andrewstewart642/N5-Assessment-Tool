// ui/ThemeMode.ts

export type ThemeModePreference = "system" | "light" | "dark";
export type ResolvedThemeMode = "light" | "dark";

export const THEME_MODE_STORAGE_KEY = "app-theme-mode";

// Validate stored value
export function isThemeModePreference(value: unknown): value is ThemeModePreference {
  return value === "system" || value === "light" || value === "dark";
}

// Get system preference (client-side only)
export function getSystemPrefersDark(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

// Resolve final theme mode
export function resolveThemeMode(
  preference: ThemeModePreference,
  systemPrefersDark: boolean
): ResolvedThemeMode {
  if (preference === "light") return "light";
  if (preference === "dark") return "dark";
  return systemPrefersDark ? "dark" : "light";
}