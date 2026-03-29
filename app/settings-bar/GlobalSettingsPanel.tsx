"use client";

import { useMemo, useState } from "react";

import { useSettings } from "./GlobalSettingsContext";
import AppTrayHeader from "../ui/settings-bar/AppTrayHeader";
import AppTraySection from "../ui/settings-bar/AppTraySection";
import type { ThemeModePreference } from "@/ui/ThemeMode";
import {
  ACCENT_OPTIONS,
  ACCENT_MAP,
  type AccentOption,
} from "@/ui/AccentPalette";

const THEME_OPTIONS: Array<{
  value: ThemeModePreference;
  label: string;
  helper: string;
}> = [
  { value: "system", label: "System", helper: "Match your device setting." },
  { value: "light", label: "Light", helper: "Use the light interface." },
  { value: "soft-grey", label: "Soft Grey", helper: "Lower contrast UI." },
  { value: "dark", label: "Dark", helper: "Use dark interface." },
  {
    value: "custom",
    label: "Custom",
    helper: "Generate a full theme from a base colour.",
  },
];

const COLOUR_ROWS: AccentOption[][] = [
  [
    "navy-900",
    "navy-800",
    "blue-800",
    "blue-700",
    "blue-600",
    "indigo-700",
    "indigo-800",
  ],
  [
    "teal-800",
    "teal-700",
    "cyan-600",
    "sky-500",
    "blue-500",
    "indigo-500",
    "violet-500",
    "purple-600",
  ],
  [
    "green-800",
    "green-700",
    "emerald-600",
    "mint-500",
    "cyan-400",
    "sky-300",
    "blue-300",
    "indigo-300",
    "purple-300",
    "magenta-500",
  ],
  [
    "lime-800",
    "lime-700",
    "green-500",
    "lime-400",
    "green-300",
    "mint-300",
    "aqua-200",
    "lavender-200",
    "pink-300",
    "magenta-700",
  ],
  [
    "green-900",
    "green-600",
    "lime-500",
    "yellow-green-400",
    "lime-300",
    "cream-100",
    "blush-100",
    "pink-200",
    "pink-500",
    "purple-800",
  ],
  [
    "olive-900",
    "olive-700",
    "yellow-500",
    "yellow-300",
    "cream-50",
    "peach-100",
    "peach-200",
    "salmon-300",
    "rose-500",
    "plum-700",
  ],
  [
    "brown-700",
    "mustard-600",
    "amber-500",
    "orange-400",
    "orange-300",
    "peach-300",
    "coral-300",
    "rose-400",
    "red-500",
    "berry-700",
  ],
  [
    "brown-800",
    "amber-700",
    "orange-600",
    "orange-500",
    "deep-orange-500",
    "red-400",
    "red-500-strong",
    "crimson-600",
    "crimson-700",
    "red-800",
  ],
];

const NEUTRAL_ROW: AccentOption[] = [
  "white",
  "grey-100",
  "grey-200",
  "grey-300",
  "grey-400",
  "grey-500",
  "grey-600",
  "grey-700",
  "grey-800",
  "black",
];

function HexSwatch({
  colour,
  label,
  active,
  onClick,
  theme,
  size = 34,
}: {
  colour: string;
  label: string;
  active: boolean;
  onClick: () => void;
  theme: ReturnType<typeof useSettings>["theme"];
  size?: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      style={{
        width: size,
        height: size,
        background: colour,
        clipPath:
          "polygon(25% 6.7%, 75% 6.7%, 100% 50%, 75% 93.3%, 25% 93.3%, 0% 50%)",
        border: active
          ? `3px solid ${theme.textPrimary}`
          : `1px solid ${theme.borderStandard}`,
        boxShadow: active ? theme.shadowStrong : "none",
        transform: active ? "scale(1.08)" : "scale(1)",
        transition:
          "transform 120ms ease, box-shadow 120ms ease, border-color 120ms ease",
        cursor: "pointer",
        flex: "0 0 auto",
      }}
    />
  );
}

function CustomThemePaletteDialog({
  open,
  selectedColour,
  onSelect,
  onClose,
  theme,
}: {
  open: boolean;
  selectedColour: AccentOption;
  onSelect: (colour: AccentOption) => void;
  onClose: () => void;
  theme: ReturnType<typeof useSettings>["theme"];
}) {
  const selectedLabel = useMemo(() => {
    return (
      ACCENT_OPTIONS.find((option) => option.id === selectedColour)?.label ??
      "Unknown"
    );
  }, [selectedColour]);

  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: theme.modalOverlay,
        display: "grid",
        placeItems: "center",
        padding: 24,
        zIndex: 2000,
      }}
      onClick={onClose}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 860,
          borderRadius: 24,
          border: `1px solid ${theme.borderStandard}`,
          background: theme.bgSurface,
          boxShadow: theme.shadowStrong,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "18px 20px",
            borderBottom: `1px solid ${theme.borderStandard}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          <div style={{ display: "grid", gap: 4 }}>
            <div
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: theme.textPrimary,
              }}
            >
              Custom theme colour
            </div>
            <div
              style={{
                fontSize: 13,
                color: theme.textMuted,
                lineHeight: 1.45,
                maxWidth: 560,
              }}
            >
              Choose a curated base colour. The app will generate a full theme
              from it rather than simply changing a single accent.
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              border: `1px solid ${theme.borderStandard}`,
              background: theme.controlBg,
              color: theme.textPrimary,
              cursor: "pointer",
              fontSize: 18,
              lineHeight: 1,
            }}
            aria-label="Close custom theme picker"
            title="Close"
          >
            ×
          </button>
        </div>

        <div
          style={{
            padding: 24,
            display: "grid",
            gap: 24,
          }}
        >
          <div
            style={{
              display: "grid",
              gap: 0,
              justifyItems: "center",
            }}
          >
            {COLOUR_ROWS.map((row, rowIndex) => (
              <div
                key={row.join("-")}
                style={{
                  display: "flex",
                  gap: 2,
                  justifyContent: "center",
                  marginTop: rowIndex === 0 ? 0 : -6,
                  marginLeft: row.length === 7 ? 54 : row.length === 8 ? 36 : 0,
                }}
              >
                {row.map((optionId) => (
                  <HexSwatch
                    key={optionId}
                    colour={ACCENT_MAP[optionId]}
                    label={
                      ACCENT_OPTIONS.find((option) => option.id === optionId)
                        ?.label ?? optionId
                    }
                    active={optionId === selectedColour}
                    onClick={() => onSelect(optionId)}
                    theme={theme}
                    size={38}
                  />
                ))}
              </div>
            ))}
          </div>

          <div
            style={{
              display: "flex",
              gap: 2,
              justifyContent: "center",
              marginTop: -4,
              flexWrap: "nowrap",
            }}
          >
            {NEUTRAL_ROW.map((optionId) => (
              <HexSwatch
                key={optionId}
                colour={ACCENT_MAP[optionId]}
                label={
                  ACCENT_OPTIONS.find((option) => option.id === optionId)
                    ?.label ?? optionId
                }
                active={optionId === selectedColour}
                onClick={() => onSelect(optionId)}
                theme={theme}
                size={34}
              />
            ))}
          </div>

          <div
            style={{
              display: "grid",
              gap: 10,
            }}
          >
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: 0.35,
                textTransform: "uppercase",
                color: theme.textMuted,
              }}
            >
              Current selection
            </div>

            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 14px",
                borderRadius: 16,
                border: `1px solid ${theme.borderStandard}`,
                background: theme.bgElevated,
                justifySelf: "start",
              }}
            >
              <span
                style={{
                  width: 24,
                  height: 24,
                  background: ACCENT_MAP[selectedColour],
                  clipPath:
                    "polygon(25% 6.7%, 75% 6.7%, 100% 50%, 75% 93.3%, 25% 93.3%, 0% 50%)",
                  border: `2px solid ${theme.paper}`,
                  boxShadow: theme.shadow,
                }}
              />

              <span
                style={{
                  fontSize: 14,
                  color: theme.textSecondary,
                }}
              >
                Base colour:{" "}
                <strong style={{ color: theme.textPrimary }}>
                  {selectedLabel}
                </strong>
              </span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{
                height: 42,
                padding: "0 16px",
                borderRadius: 12,
                border: `1px solid ${theme.borderStandard}`,
                background: theme.bgElevated,
                color: theme.textPrimary,
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GlobalSettingsPanel() {
  const {
    theme,
    closeSettings,
    themePreference,
    setThemePreference,
    customThemeColour,
    setCustomThemeColour,
  } = useSettings();

  const [openPalette, setOpenPalette] = useState(false);

  const selectedLabel = useMemo(() => {
    return (
      ACCENT_OPTIONS.find((o) => o.id === customThemeColour)?.label ??
      "Unknown"
    );
  }, [customThemeColour]);

  return (
    <>
      <AppTrayHeader
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
        <AppTraySection
          title="Appearance"
          subtitle="Choose how the app looks."
          theme={theme}
        >
          <div style={{ display: "grid", gap: 10 }}>
            {THEME_OPTIONS.map((opt) => {
              const active = themePreference === opt.value;

              return (
                <button
                  key={opt.value}
                  onClick={() => setThemePreference(opt.value)}
                  style={{
                    padding: 14,
                    borderRadius: 14,
                    border: `1px solid ${
                      active
                        ? theme.controlSelectedBorder
                        : theme.borderStandard
                    }`,
                    background: active
                      ? theme.controlSelectedBg
                      : theme.bgSurface,
                    textAlign: "left",
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      fontWeight: 700,
                      color: theme.textPrimary,
                    }}
                  >
                    {opt.label}
                  </div>

                  <div
                    style={{
                      fontSize: 13,
                      color: theme.textMuted,
                    }}
                  >
                    {opt.helper}
                  </div>
                </button>
              );
            })}
          </div>
        </AppTraySection>

        <AppTraySection
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
                  width: 20,
                  height: 20,
                  background: ACCENT_MAP[customThemeColour],
                  clipPath:
                    "polygon(25% 6.7%, 75% 6.7%, 100% 50%, 75% 93.3%, 25% 93.3%, 0% 50%)",
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
        </AppTraySection>
      </div>

      <CustomThemePaletteDialog
        open={openPalette}
        selectedColour={customThemeColour}
        onSelect={setCustomThemeColour}
        onClose={() => setOpenPalette(false)}
        theme={theme}
      />
    </>
  );
}