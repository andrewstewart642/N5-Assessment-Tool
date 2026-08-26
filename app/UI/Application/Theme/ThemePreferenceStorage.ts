import {
  THEME_MODE_STORAGE_KEY,
  isThemeModePreference,
  type ThemeModePreference,
} from "./ThemeMode";

import {
  isAccentOption,
  type AccentOption,
} from "../Colours/AccentPalette";

export const CUSTOM_THEME_COLOUR_STORAGE_KEY = "app-custom-theme-colour";

export function readStoredThemePreference(): ThemeModePreference {
  if (typeof window === "undefined") return "dark";

  const raw = window.localStorage.getItem(THEME_MODE_STORAGE_KEY);
  return isThemeModePreference(raw) ? raw : "dark";
}

export function writeStoredThemePreference(
  preference: ThemeModePreference
): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(THEME_MODE_STORAGE_KEY, preference);
}

export function readStoredCustomThemeColour(): AccentOption {
  if (typeof window === "undefined") return "blue-700";

  const raw = window.localStorage.getItem(CUSTOM_THEME_COLOUR_STORAGE_KEY);
  return isAccentOption(raw) ? raw : "blue-700";
}

export function writeStoredCustomThemeColour(
  colour: AccentOption
): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CUSTOM_THEME_COLOUR_STORAGE_KEY, colour);
}