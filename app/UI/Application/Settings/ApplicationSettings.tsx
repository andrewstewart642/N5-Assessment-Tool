"use client";

import type {
  ReactNode,
} from "react";

import {
  ThemeProvider,
  useTheme,
} from "@/app/UI/Application/Theme/ThemeProvider";


export function SettingsProvider({
  children,
}: {
  children:
    ReactNode;
}) {
  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  );
}


/*
 * Compatibility hook.
 *
 * This previously merged Theme state with
 * SettingsDrawer state.
 *
 * Global Settings visibility now belongs locally
 * to the Activity Rail, so application settings
 * only need to expose the persistent theme state.
 */

export function useSettings() {
  return useTheme();
}