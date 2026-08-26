"use client";

import type {
  ReactNode,
} from "react";

import {
  ThemeProvider,
  useTheme,
} from "@/src/UI/Application/Theme/ThemeProvider";

import {
  SettingsDrawerProvider,
  useSettingsDrawer,
} from "@/src/UI/Application/SettingsDrawer/SettingsDrawerProvider";

export function SettingsProvider({
  children,
}: {
  children:
    ReactNode;
}) {
  return (
    <ThemeProvider>
      <SettingsDrawerProvider>
        {children}
      </SettingsDrawerProvider>
    </ThemeProvider>
  );
}

export function useSettings() {
  const theme =
    useTheme();

  const settingsDrawer =
    useSettingsDrawer();

  return {
    ...theme,
    ...settingsDrawer,
  };
}