import SettingsSection from "../SettingsSection";
import { useTheme } from "../../Theme/ThemeProvider";
import type { ThemeModePreference } from "../../Theme/ThemeMode";

const THEME_OPTIONS: Array<{
  value: ThemeModePreference;
  label: string;
  helper: string;
}> = [
  {
    value: "dark",
    label: "Dark",
    helper: "Default VecEd appearance.",
  },
  {
    value: "soft-grey",
    label: "Soft Grey",
    helper: "Softer dark interface.",
  },
  {
    value: "light",
    label: "Light",
    helper: "Use the light interface.",
  },
  {
    value: "system",
    label: "System",
    helper: "Match your device setting.",
  },
  {
    value: "custom",
    label: "Custom",
    helper: "Generate a full theme from a base colour.",
  },
];

export default function ThemeModeControl() {
  const {
    theme,
    themePreference,
    setThemePreference,
  } = useTheme();

  return (
    <SettingsSection
      title="Appearance"
      subtitle="Choose how the app looks."
      theme={theme}
    >
      <div style={{ display: "grid", gap: 10 }}>
        {THEME_OPTIONS.map((option) => {
          const active = themePreference === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => setThemePreference(option.value)}
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
                {option.label}
              </div>

              <div
                style={{
                  fontSize: 13,
                  color: theme.textMuted,
                }}
              >
                {option.helper}
              </div>
            </button>
          );
        })}
      </div>
    </SettingsSection>
  );
}