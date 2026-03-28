"use client";

import { useSettings } from "./GlobalSettingsContext";
import AppTrayHeader from "../ui/settings-bar/AppTrayHeader";
import AppTraySection from "../ui/settings-bar/AppTraySection";

type ThemePreference = "system" | "light" | "dark";

const OPTIONS: Array<{
  value: ThemePreference;
  label: string;
  helper: string;
}> = [
  {
    value: "system",
    label: "System",
    helper: "Match your device setting.",
  },
  {
    value: "light",
    label: "Light",
    helper: "Use the light interface everywhere.",
  },
  {
    value: "dark",
    label: "Dark",
    helper: "Use the dark interface everywhere.",
  },
];

export default function GlobalSettingsPanel() {
  const {
    theme,
    closeSettings,
    themePreference,
    setThemePreference,
    resolvedThemeMode,
  } = useSettings();

  return (
    <>
      <style jsx>{`
        .settings-scroll {
          overflow-y: auto;
          overflow-x: hidden;
          scrollbar-width: thin;
          scrollbar-color: transparent transparent;
        }

        .settings-scroll:hover {
          scrollbar-color: rgba(104, 168, 255, 0.45) transparent;
        }

        .settings-scroll::-webkit-scrollbar {
          width: 8px;
        }

        .settings-scroll::-webkit-scrollbar-track {
          background: transparent;
        }

        .settings-scroll::-webkit-scrollbar-thumb {
          background: transparent;
          border-radius: 999px;
        }

        .settings-scroll:hover::-webkit-scrollbar-thumb {
          background: rgba(104, 168, 255, 0.45);
        }
      `}</style>

      <AppTrayHeader
        title="Settings"
        subtitle="Global app settings"
        onClose={closeSettings}
        theme={theme}
      />

      <div
        className="settings-scroll"
        style={{
          flex: 1,
          minHeight: 0,
          padding: 18,
          display: "grid",
          gap: 18,
          alignContent: "start",
        }}
      >
        <AppTraySection
          title="Appearance"
          subtitle="Choose how the app looks across the rest of the tool."
          theme={theme}
        >
          <div
            style={{
              fontSize: 13,
              color: theme.subtleText,
              marginBottom: 14,
            }}
          >
            Current resolved mode:{" "}
            <strong style={{ color: theme.text }}>{resolvedThemeMode}</strong>
          </div>

          <div style={{ display: "grid", gap: 10 }}>
            {OPTIONS.map((option) => {
              const active = themePreference === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setThemePreference(option.value)}
                  style={{
                    width: "100%",
                    padding: "14px 16px",
                    borderRadius: 16,
                    border: `1px solid ${
                      active ? theme.accent : theme.border
                    }`,
                    background: active
                      ? theme.accentSoft
                      : theme.buttonGhostBg,
                    textAlign: "left",
                    cursor: "pointer",
                    display: "grid",
                    gap: 6,
                  }}
                >
                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: theme.text,
                    }}
                  >
                    {option.label}
                  </div>

                  <div
                    style={{
                      fontSize: 13,
                      color: theme.subtleText,
                    }}
                  >
                    {option.helper}
                  </div>
                </button>
              );
            })}
          </div>
        </AppTraySection>
      </div>
    </>
  );
}