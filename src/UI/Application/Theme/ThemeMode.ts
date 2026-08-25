export type ThemeModePreference =
  | "system"
  | "light"
  | "soft-grey"
  | "dark"
  | "custom";

export type ResolvedThemeMode =
  | "light"
  | "soft-grey"
  | "dark"
  | "custom";

export const THEME_MODE_STORAGE_KEY = "app-theme-mode";

export function isThemeModePreference(
  value: unknown
): value is ThemeModePreference {
  return (
    value === "system" ||
    value === "light" ||
    value === "soft-grey" ||
    value === "dark" ||
    value === "custom"
  );
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
  if (preference === "soft-grey") return "soft-grey";
  if (preference === "dark") return "dark";
  if (preference === "custom") return "custom";
  return systemPrefersDark ? "dark" : "light";
}