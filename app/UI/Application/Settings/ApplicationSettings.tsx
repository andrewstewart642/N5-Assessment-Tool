"use client";

import type {
  ReactNode,
} from "react";

import {
  ThemeProvider,
  useTheme,
} from "@/app/UI/Application/Theme/ThemeProvider";

import {
  SettingsDrawerProvider,
  useSettingsDrawer,
} from "@/app/UI/Application/SettingsDrawer/SettingsDrawerProvider";

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