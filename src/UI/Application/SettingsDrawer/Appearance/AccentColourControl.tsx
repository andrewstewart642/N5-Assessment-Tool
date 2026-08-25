"use client";

import { useMemo, useState } from "react";

import { useTheme } from "../../Theme/ThemeProvider";
import AccentColourPicker from "./AccentColourPicker/AccentColourPicker";

import {
  getAccentLabel,
  WHITE_ACCENT_OPTION,
} from "./AccentColourPicker/AccentColourOptions";
import type { Theme } from "../../Theme/AppTheme";
import SettingsSection from "../SettingsSection";
import {
  ACCENT_MAP,
} from "../../Colours/AccentPalette";

export default function AccentColourControl() {
  const {
  theme,
  customThemeColour,
  setCustomThemeColour,
} = useTheme();

  const [openPalette, setOpenPalette] = useState(false);

  const selectedLabel = useMemo(
    () => getAccentLabel(customThemeColour),
    [customThemeColour]
  );

  return (
    <>
      
      <div
        style={{
          padding: 18,
          display: "grid",
          gap: 18,
        }}
      >


        <SettingsSection
          title="Custom theme"
          subtitle="Choose your base colour."
          theme={theme}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: 14,
              borderRadius: 14,
              border: `1px solid ${theme.borderStandard}`,
              background: theme.bgSurface,
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 18,
                  height: 21,
                  background: ACCENT_MAP[customThemeColour],
                  clipPath:
                    "polygon(50% 0%, 93.3% 25%, 93.3% 75%, 50% 100%, 6.7% 75%, 6.7% 25%)",
                  border:
                    customThemeColour === WHITE_ACCENT_OPTION
                      ? `1px solid ${theme.borderStandard}`
                      : "none",
                }}
              />

              <div>
                <div style={{ fontWeight: 700, color: theme.textPrimary }}>
                  {selectedLabel}
                </div>
                <div style={{ fontSize: 12, color: theme.textMuted }}>
                  Base colour
                </div>
              </div>
            </div>

            <button
              onClick={() => setOpenPalette(true)}
              style={{
                padding: "8px 12px",
                borderRadius: 10,
                border: `1px solid ${theme.borderStandard}`,
                background: theme.bgElevated,
                color: theme.textPrimary,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Choose colour
            </button>
          </div>
        </SettingsSection>
      </div>

      <AccentColourPicker
        open={openPalette}
        selectedColour={customThemeColour}
        onSelect={setCustomThemeColour}
        onClose={() => setOpenPalette(false)}
        theme={theme}
      />
    </>
  );
}