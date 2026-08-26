"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { getTheme, type Theme } from "./AppTheme";
import type { AccentOption } from "../Colours/AccentPalette";
import {
  getSystemPrefersDark,
  resolveThemeMode,
  type ResolvedThemeMode,
  type ThemeModePreference,
} from "./ThemeMode";
import {
  readStoredCustomThemeColour,
  readStoredThemePreference,
  writeStoredCustomThemeColour,
  writeStoredThemePreference,
} from "./ThemePreferenceStorage";

type ThemeContextValue = {
  themePreference: ThemeModePreference;
  resolvedThemeMode: ResolvedThemeMode;
  customThemeColour: AccentOption;
  theme: Theme;
  setThemePreference: (preference: ThemeModePreference) => void;
  setCustomThemeColour: (colour: AccentOption) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themePreference, setThemePreferenceState] =
    useState<ThemeModePreference>("dark");

  const [customThemeColour, setCustomThemeColourState] =
    useState<AccentOption>("blue-700");

  const [systemPrefersDark, setSystemPrefersDark] = useState<boolean>(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    function syncFromEnvironment() {
      setSystemPrefersDark(mediaQuery.matches);
      setThemePreferenceState(readStoredThemePreference());
      setCustomThemeColourState(readStoredCustomThemeColour());
    }

    syncFromEnvironment();

    function handleStorage() {
      syncFromEnvironment();
    }

    window.addEventListener("storage", handleStorage);

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", syncFromEnvironment);

      return () => {
        window.removeEventListener("storage", handleStorage);
        mediaQuery.removeEventListener("change", syncFromEnvironment);
      };
    }

    mediaQuery.addListener(syncFromEnvironment);

    return () => {
      window.removeEventListener("storage", handleStorage);
      mediaQuery.removeListener(syncFromEnvironment);
    };
  }, []);

  const resolvedThemeMode = useMemo<ResolvedThemeMode>(() => {
    return resolveThemeMode(themePreference, systemPrefersDark);
  }, [themePreference, systemPrefersDark]);

  const theme = useMemo<Theme>(() => {
    return getTheme({
      mode: resolvedThemeMode,
      customColour: customThemeColour,
    });
  }, [resolvedThemeMode, customThemeColour]);

  useEffect(() => {
    if (typeof document === "undefined") return;

    document.documentElement.dataset.themeMode = resolvedThemeMode;

    document.documentElement.style.setProperty(
      "--app-scrollbar-track",
      theme.bgSurface
    );

    document.documentElement.style.setProperty(
      "--app-scrollbar-thumb",
      theme.borderStandard
    );

    document.documentElement.style.setProperty(
      "--app-scrollbar-thumb-hover",
      theme.textMuted
    );

    document.body.style.background = theme.bgPage;
    document.body.style.color = theme.textPrimary;
  }, [resolvedThemeMode, theme]);

  function setThemePreference(preference: ThemeModePreference) {
    setThemePreferenceState(preference);
    writeStoredThemePreference(preference);
  }

  function setCustomThemeColour(colour: AccentOption) {
    setCustomThemeColourState(colour);
    writeStoredCustomThemeColour(colour);
  }

  const value = useMemo<ThemeContextValue>(
    () => ({
      themePreference,
      resolvedThemeMode,
      customThemeColour,
      theme,
      setThemePreference,
      setCustomThemeColour,
    }),
    [
      themePreference,
      resolvedThemeMode,
      customThemeColour,
      theme,
    ]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider.");
  }

  return context;
}