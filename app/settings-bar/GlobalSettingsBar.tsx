"use client";

import { useSettings } from "./GlobalSettingsContext";
import AppSideTray from "../ui/settings-bar/AppSideTray";
import GlobalSettingsPanel from "./GlobalSettingsPanel";

export default function GlobalSettingsBar() {
  const { isSettingsOpen, closeSettings, theme } = useSettings();

  return (
    <AppSideTray open={isSettingsOpen} onClose={closeSettings} theme={theme}>
      <GlobalSettingsPanel />
    </AppSideTray>
  );
}