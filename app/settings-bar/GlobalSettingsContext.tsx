"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { getTheme, type Theme } from "@/ui/AppTheme";
import type { AccentOption } from "@/ui/AccentPalette";
import {
  getSystemPrefersDark,
  resolveThemeMode,
  type ResolvedThemeMode,
  type ThemeModePreference,
} from "@/ui/ThemeMode";
import {
  readStoredCustomThemeColour,
  readStoredThemePreference,
  writeStoredCustomThemeColour,
  writeStoredThemePreference,
} from "./GlobalSettingsStorage";

type SettingsContextValue = {
  themePreference: ThemeModePreference;
  resolvedThemeMode: ResolvedThemeMode;
  customThemeColour: AccentOption;
  theme: Theme;
  isSettingsOpen: boolean;
  setThemePreference: (preference: ThemeModePreference) => void;
  setCustomThemeColour: (colour: AccentOption) => void;
  openSettings: () => void;
  closeSettings: () => void;
  toggleSettings: () => void;
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [themePreference, setThemePreferenceState] =
    useState<ThemeModePreference>("system");
  const [customThemeColour, setCustomThemeColourState] =
    useState<AccentOption>("blue-700");
  const [systemPrefersDark, setSystemPrefersDark] = useState<boolean>(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

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

  function openSettings() {
    setIsSettingsOpen(true);
  }

  function closeSettings() {
    setIsSettingsOpen(false);
  }

  function toggleSettings() {
    setIsSettingsOpen((current) => !current);
  }

  const value = useMemo<SettingsContextValue>(
    () => ({
      themePreference,
      resolvedThemeMode,
      customThemeColour,
      theme,
      isSettingsOpen,
      setThemePreference,
      setCustomThemeColour,
      openSettings,
      closeSettings,
      toggleSettings,
    }),
    [
      themePreference,
      resolvedThemeMode,
      customThemeColour,
      theme,
      isSettingsOpen,
    ]
  );

  return (
    <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
  );
}

export function useSettings(): SettingsContextValue {
  const context = useContext(SettingsContext);

  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider.");
  }

  return context;
}