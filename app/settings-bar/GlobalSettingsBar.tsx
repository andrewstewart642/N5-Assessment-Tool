"use client";

import { useSettings } from "@/app/settings-bar/GlobalSettingsContext";
import AppSideTray from "@/app/ui/settings-bar/AppSideTray";
import SettingsPanel from "@/app/settings-bar/GlobalSettingsPanel";

export default function SettingsBar() {
  const { isSettingsOpen, closeSettings, theme } = useSettings();

  return (
    <AppSideTray
      open={isSettingsOpen}
      onClose={closeSettings}
      theme={theme}
    >
      <SettingsPanel />
    </AppSideTray>
  );
}