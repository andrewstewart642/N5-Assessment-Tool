"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  type ThemeModePreference,
  type ResolvedThemeMode,
  THEME_MODE_STORAGE_KEY,
  isThemeModePreference,
  getSystemPrefersDark,
  resolveThemeMode,
} from "./ThemeMode";
import { getTheme, type Theme } from "./AppTheme";
import {
  isAccentOption,
  type AccentOption,
} from "./AccentPalette";

const CUSTOM_THEME_COLOUR_STORAGE_KEY = "app-custom-theme-colour";

type ThemeContextType = {
  theme: Theme;
  mode: ThemeModePreference;
  resolvedMode: ResolvedThemeMode;
  customColour: AccentOption;
  setMode: (mode: ThemeModePreference) => void;
  setCustomColour: (colour: AccentOption) => void;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

function readStoredCustomColour(): AccentOption {
  if (typeof window === "undefined") return "blue-700";

  const raw = window.localStorage.getItem(CUSTOM_THEME_COLOUR_STORAGE_KEY);
  return isAccentOption(raw) ? raw : "blue-700";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeModePreference>("system");
  const [resolvedMode, setResolvedMode] =
    useState<ResolvedThemeMode>("light");
  const [customColour, setCustomColourState] =
    useState<AccentOption>("blue-700");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedMode = window.localStorage.getItem(THEME_MODE_STORAGE_KEY);
    if (isThemeModePreference(storedMode)) {
      setModeState(storedMode);
    }

    setCustomColourState(readStoredCustomColour());
  }, []);

  useEffect(() => {
    const systemPrefersDark = getSystemPrefersDark();
    const resolved = resolveThemeMode(mode, systemPrefersDark);
    setResolvedMode(resolved);
  }, [mode]);

  const setMode = (newMode: ThemeModePreference) => {
    setModeState(newMode);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(THEME_MODE_STORAGE_KEY, newMode);
    }
  };

  const setCustomColour = (colour: AccentOption) => {
    setCustomColourState(colour);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(CUSTOM_THEME_COLOUR_STORAGE_KEY, colour);
    }
  };

  const theme = getTheme({
    mode: resolvedMode,
    customColour,
  });

  return (
    <ThemeContext.Provider
      value={{
        theme,
        mode,
        resolvedMode,
        customColour,
        setMode,
        setCustomColour,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}