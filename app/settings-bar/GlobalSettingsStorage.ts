import {
  THEME_MODE_STORAGE_KEY,
  isThemeModePreference,
  type ThemeModePreference,
} from "@/ui/ThemeMode";

export function readStoredThemePreference(): ThemeModePreference {
  if (typeof window === "undefined") return "system";

  const raw = window.localStorage.getItem(THEME_MODE_STORAGE_KEY);
  return isThemeModePreference(raw) ? raw : "system";
}

export function writeStoredThemePreference(
  preference: ThemeModePreference
): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(THEME_MODE_STORAGE_KEY, preference);
}