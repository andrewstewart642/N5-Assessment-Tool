"use client";

import Drawer from "../Components/Drawer/Drawer";
import { useTheme } from "../Theme/ThemeProvider";

import AppearanceSettings from "./Appearance/AppearanceSettings";
import { useSettingsDrawer } from "./SettingsDrawerProvider";

export default function SettingsDrawer() {
  const { theme } = useTheme();
  const { isSettingsOpen, closeSettings } = useSettingsDrawer();

  return (
    <Drawer
      open={isSettingsOpen}
      onClose={closeSettings}
      theme={theme}
    >
      <AppearanceSettings />
    </Drawer>
  );
}