"use client";

import DrawerHeader from "../../Components/Drawer/DrawerHeader";
import { useSettingsDrawer } from "../SettingsDrawerProvider";
import { useTheme } from "../../Theme/ThemeProvider";

import AccentColourControl from "./AccentColourControl";
import ThemeModeControl from "./ThemeModeControl";

export default function AppearanceSettings() {
  const { theme } = useTheme();
  const { closeSettings } = useSettingsDrawer();

  return (
    <>
      <DrawerHeader
        title="Settings"
        subtitle="Global app settings"
        onClose={closeSettings}
        theme={theme}
      />

      <div
        style={{
          padding: 18,
          display: "grid",
          gap: 18,
        }}
      >
        <ThemeModeControl />
        <AccentColourControl />
      </div>
    </>
  );
}