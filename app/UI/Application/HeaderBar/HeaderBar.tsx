"use client";

import { usePathname } from "next/navigation";

import { useSettingsDrawer } from "../SettingsDrawer/SettingsDrawerProvider";
import { useTheme } from "../Theme/ThemeProvider";

import Logo from "./Logo";
import Navigation from "./Navigation";
import SettingsButton from "./SettingsButton";

export default function HeaderBar() {
  const pathname = usePathname();
  const { theme } = useTheme();
  const { openSettings } = useSettingsDrawer();

  function handleOpenSettings() {
    // Temporary compatibility behaviour.
    // Builder settings will receive its own access during the
    // Assessment Creation migration.
    if (pathname.startsWith("/create-assessment/builder")) {
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("open-builder-settings"));
      }

      return;
    }

    openSettings();
  }

  return (
    <header
      style={{
        height: 44,
        borderBottom: `1px solid ${theme.borderStandard}`,
        background: theme.bgSurface,
        display: "grid",
        gridTemplateColumns: "180px 1fr auto",
        alignItems: "center",
        gap: 12,
        padding: "0 12px",
        boxSizing: "border-box",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <Logo />

      <Navigation />

      <SettingsButton onClick={handleOpenSettings} />
    </header>
  );
}