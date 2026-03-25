"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  ThemeModePreference,
  ResolvedThemeMode,
  THEME_MODE_STORAGE_KEY,
  isThemeModePreference,
  getSystemPrefersDark,
  resolveThemeMode,
} from "./ThemeMode";
import { getTheme, AppTheme } from "./AppTheme";

type ThemeContextType = {
  theme: AppTheme;
  mode: ThemeModePreference;
  resolvedMode: ResolvedThemeMode;
  setMode: (mode: ThemeModePreference) => void;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeModePreference>("system");
  const [resolvedMode, setResolvedMode] =
    useState<ResolvedThemeMode>("light");

  // Load saved preference
  useEffect(() => {
    const stored = localStorage.getItem(THEME_MODE_STORAGE_KEY);
    if (isThemeModePreference(stored)) {
      setModeState(stored);
    }
  }, []);

  // Resolve mode
  useEffect(() => {
    const systemPrefersDark = getSystemPrefersDark();
    const resolved = resolveThemeMode(mode, systemPrefersDark);
    setResolvedMode(resolved);
  }, [mode]);

  // Persist preference
  const setMode = (newMode: ThemeModePreference) => {
    setModeState(newMode);
    localStorage.setItem(THEME_MODE_STORAGE_KEY, newMode);
  };

  const theme = getTheme(resolvedMode);

  return (
    <ThemeContext.Provider
      value={{ theme, mode, resolvedMode, setMode }}
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