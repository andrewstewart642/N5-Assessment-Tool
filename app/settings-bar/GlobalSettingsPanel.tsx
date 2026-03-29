"use client";

import { useMemo, useState } from "react";

import { useSettings } from "./GlobalSettingsContext";
import AppTrayHeader from "../ui/settings-bar/AppTrayHeader";
import AppTraySection from "../ui/settings-bar/AppTraySection";
import type { ThemeModePreference } from "@/ui/ThemeMode";
import { ACCENT_MAP, type AccentOption } from "@/ui/AccentPalette";

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

const WORD_COLOUR_ROWS: AccentOption[][] = [
  [
    "word-r1-c1",
    "word-r1-c2",
    "word-r1-c3",
    "word-r1-c4",
    "word-r1-c5",
    "word-r1-c6",
    "word-r1-c7",
  ],
  [
    "word-r2-c1",
    "word-r2-c2",
    "word-r2-c3",
    "word-r2-c4",
    "word-r2-c5",
    "word-r2-c6",
    "word-r2-c7",
    "word-r2-c8",
  ],
  [
    "word-r3-c1",
    "word-r3-c2",
    "word-r3-c3",
    "word-r3-c4",
    "word-r3-c5",
    "word-r3-c6",
    "word-r3-c7",
    "word-r3-c8",
    "word-r3-c9",
  ],
  [
    "word-r4-c1",
    "word-r4-c2",
    "word-r4-c3",
    "word-r4-c4",
    "word-r4-c5",
    "word-r4-c6",
    "word-r4-c7",
    "word-r4-c8",
    "word-r4-c9",
    "word-r4-c10",
  ],
  [
    "word-r5-c1",
    "word-r5-c2",
    "word-r5-c3",
    "word-r5-c4",
    "word-r5-c5",
    "word-r5-c6",
    "word-r5-c7",
    "word-r5-c8",
    "word-r5-c9",
    "word-r5-c10",
    "word-r5-c11",
  ],
  [
    "word-r6-c1",
    "word-r6-c2",
    "word-r6-c3",
    "word-r6-c4",
    "word-r6-c5",
    "word-r6-c6",
    "word-r6-c7",
    "word-r6-c8",
    "word-r6-c9",
    "word-r6-c10",
    "word-r6-c11",
    "word-r6-c12",
  ],
  [
    "word-r7-c1",
    "word-r7-c2",
    "word-r7-c3",
    "word-r7-c4",
    "word-r7-c5",
    "word-r7-c6",
    "word-r7-c7",
    "word-r7-c8",
    "word-r7-c9",
    "word-r7-c10",
    "word-r7-c11",
    "word-r7-c12",
    "word-r7-c13",
  ],
  [
    "word-r8-c1",
    "word-r8-c2",
    "word-r8-c3",
    "word-r8-c4",
    "word-r8-c5",
    "word-r8-c6",
    "word-r8-c7",
    "word-r8-c8",
    "word-r8-c9",
    "word-r8-c10",
    "word-r8-c11",
    "word-r8-c12",
    "word-r8-c13",
  ],
  [
    "word-r9-c1",
    "word-r9-c2",
    "word-r9-c3",
    "word-r9-c4",
    "word-r9-c5",
    "word-r9-c6",
    "word-r9-c7",
    "word-r9-c8",
    "word-r9-c9",
    "word-r9-c10",
    "word-r9-c11",
  ],
  [
    "word-r10-c1",
    "word-r10-c2",
    "word-r10-c3",
    "word-r10-c4",
    "word-r10-c5",
    "word-r10-c6",
    "word-r10-c7",
    "word-r10-c8",
    "word-r10-c9",
    "word-r10-c10",
  ],
  [
    "word-r11-c1",
    "word-r11-c2",
    "word-r11-c3",
    "word-r11-c4",
    "word-r11-c5",
    "word-r11-c6",
    "word-r11-c7",
    "word-r11-c8",
    "word-r11-c9",
  ],
  [
    "word-r12-c1",
    "word-r12-c2",
    "word-r12-c3",
    "word-r12-c4",
    "word-r12-c5",
    "word-r12-c6",
    "word-r12-c7",
    "word-r12-c8",
  ],
  [
    "word-r13-c1",
    "word-r13-c2",
    "word-r13-c3",
    "word-r13-c4",
    "word-r13-c5",
    "word-r13-c6",
    "word-r13-c7",
  ],
];

const WORD_NEUTRAL_TOP: AccentOption[] = [
  "word-neutral-t1",
  "word-neutral-t2",
  "word-neutral-t3",
  "word-neutral-t4",
  "word-neutral-t5",
  "word-neutral-t6",
  "word-neutral-t7",
];

const WORD_NEUTRAL_BOTTOM: AccentOption[] = [
  "word-neutral-b1",
  "word-neutral-b2",
  "word-neutral-b3",
  "word-neutral-b4",
  "word-neutral-b5",
  "word-neutral-b6",
  "word-neutral-b7",
];

const WORD_NEUTRAL_WHITE: AccentOption = "word-neutral-white";
const WORD_NEUTRAL_BLACK: AccentOption = "word-neutral-black";

type HoneycombCell = {
  id: AccentOption;
  row: number;
  col: number;
};

function getAccentLabel(id: AccentOption): string {
  if (id === WORD_NEUTRAL_WHITE) return "White";
  if (id === WORD_NEUTRAL_BLACK) return "Black";
  if (id.startsWith("word-neutral")) return "Grey";
  if (id.startsWith("word-r")) return "Word colour";
  return id;
}

function buildHoneycombCells(rows: AccentOption[][]): HoneycombCell[] {
  return rows.flatMap((row, rowIndex) =>
    row.map((id, colIndex) => ({
      id,
      row: rowIndex,
      col: colIndex,
    }))
  );
}

function HexSwatch({
  colour,
  label,
  active,
  onClick,
  theme,
  width,
  height,
  innerBorder = false,
}: {
  colour: string;
  label: string;
  active: boolean;
  onClick: () => void;
  theme: ReturnType<typeof useSettings>["theme"];
  width: number;
  height: number;
  innerBorder?: boolean;
}) {
  return (
    <>
      <button
        type="button"
        onClick={onClick}
        aria-label={label}
        title={label}
        className="theme-hex-swatch"
        style={{
          width,
          height,
          padding: 0,
          border: "none",
          background: "transparent",
          cursor: "pointer",
          display: "grid",
          placeItems: "center",
          position: "relative",
          zIndex: active ? 3 : 1,
        }}
      >
        <span
          style={{
            width,
            height,
            display: "block",
            background: colour,
            clipPath:
              "polygon(50% 0%, 93.3% 25%, 93.3% 75%, 50% 100%, 6.7% 75%, 6.7% 25%)",
            border: active
              ? `2px solid ${theme.textPrimary}`
              : innerBorder
                ? `1px solid ${theme.borderStandard}`
                : `1px solid rgba(255,255,255,0.15)`,
            outline: active ? `2px solid ${theme.paper}` : "none",
            outlineOffset: active ? "-4px" : 0,
            boxShadow: active
              ? theme.shadowStrong
              : "0 1px 2px rgba(0,0,0,0.06)",
            transform: active ? "scale(1.02)" : "scale(1)",
            transition:
              "transform 140ms ease, box-shadow 140ms ease, border-color 140ms ease, outline 140ms ease, filter 140ms ease",
          }}
        />
      </button>

      <style jsx>{`
        .theme-hex-swatch:hover {
          z-index: 4;
        }

        .theme-hex-swatch:hover span {
          transform: scale(1.05);
          box-shadow: 0 7px 14px rgba(0, 0, 0, 0.2);
          filter: brightness(1.04);
          border-color: ${theme.textPrimary};
        }

        .theme-hex-swatch:focus-visible {
          outline: 2px solid ${theme.accentPrimary};
          outline-offset: 3px;
          border-radius: 10px;
        }
      `}</style>
    </>
  );
}

function WordHoneycombPalette({
  selectedColour,
  onSelect,
  theme,
}: {
  selectedColour: AccentOption;
  onSelect: (colour: AccentOption) => void;
  theme: ReturnType<typeof useSettings>["theme"];
}) {
  const cells = useMemo(() => buildHoneycombCells(WORD_COLOUR_ROWS), []);

  const hexWidth = 24;
  const hexHeight = 28;
  const colStep = 20.9;
  const rowStep = 21.2;
  const maxCols = Math.max(...WORD_COLOUR_ROWS.map((row) => row.length));
  const width = (maxCols - 1) * colStep + hexWidth;
  const height = (WORD_COLOUR_ROWS.length - 1) * rowStep + hexHeight;

  return (
    <div
      style={{
        width,
        height,
        position: "relative",
        margin: "0 auto",
      }}
    >
      {cells.map((cell) => {
        const rowLength = WORD_COLOUR_ROWS[cell.row].length;
        const baseLeft = ((maxCols - rowLength) * colStep) / 2;
        const left = baseLeft + cell.col * colStep;
        const top = cell.row * rowStep;

        return (
          <div
            key={`${cell.row}-${cell.col}-${cell.id}`}
            style={{
              position: "absolute",
              left,
              top,
            }}
          >
            <HexSwatch
              colour={ACCENT_MAP[cell.id]}
              label={`${getAccentLabel(cell.id)} ${ACCENT_MAP[cell.id]}`}
              active={cell.id === selectedColour}
              onClick={() => onSelect(cell.id)}
              theme={theme}
              width={hexWidth}
              height={hexHeight}
            />
          </div>
        );
      })}
    </div>
  );
}

function WordNeutralPalette({
  selectedColour,
  onSelect,
  theme,
}: {
  selectedColour: AccentOption;
  onSelect: (colour: AccentOption) => void;
  theme: ReturnType<typeof useSettings>["theme"];
}) {
  const smallHexWidth = 22;
  const smallHexHeight = 26;
  const largeHexWidth = 30;
  const largeHexHeight = 34;
  const colStep = 18.7;
  const rowStep = 18.5;

  const contentWidth = 290;
  const topLeft = 53;
  const bottomLeft = 43;
  const blackLeft = contentWidth - largeHexWidth;
  const whiteTop = 12;
  const blackTop = 10;

  return (
    <div
      style={{
        width: contentWidth,
        height: 52,
        position: "relative",
        margin: "0 auto",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: whiteTop,
        }}
      >
        <HexSwatch
          colour={ACCENT_MAP[WORD_NEUTRAL_WHITE]}
          label="White"
          active={selectedColour === WORD_NEUTRAL_WHITE}
          onClick={() => onSelect(WORD_NEUTRAL_WHITE)}
          theme={theme}
          width={largeHexWidth}
          height={largeHexHeight}
          innerBorder
        />
      </div>

      {WORD_NEUTRAL_TOP.map((id, index) => (
        <div
          key={id}
          style={{
            position: "absolute",
            left: topLeft + index * colStep,
            top: 0,
          }}
        >
          <HexSwatch
            colour={ACCENT_MAP[id]}
            label={`${getAccentLabel(id)} ${ACCENT_MAP[id]}`}
            active={selectedColour === id}
            onClick={() => onSelect(id)}
            theme={theme}
            width={smallHexWidth}
            height={smallHexHeight}
          />
        </div>
      ))}

      {WORD_NEUTRAL_BOTTOM.map((id, index) => (
        <div
          key={id}
          style={{
            position: "absolute",
            left: bottomLeft + index * colStep,
            top: rowStep,
          }}
        >
          <HexSwatch
            colour={ACCENT_MAP[id]}
            label={`${getAccentLabel(id)} ${ACCENT_MAP[id]}`}
            active={selectedColour === id}
            onClick={() => onSelect(id)}
            theme={theme}
            width={smallHexWidth}
            height={smallHexHeight}
          />
        </div>
      ))}

      <div
        style={{
          position: "absolute",
          left: blackLeft,
          top: blackTop,
        }}
      >
        <HexSwatch
          colour={ACCENT_MAP[WORD_NEUTRAL_BLACK]}
          label="Black"
          active={selectedColour === WORD_NEUTRAL_BLACK}
          onClick={() => onSelect(WORD_NEUTRAL_BLACK)}
          theme={theme}
          width={largeHexWidth}
          height={largeHexHeight}
        />
      </div>
    </div>
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
  const selectedHex = ACCENT_MAP[selectedColour];
  const selectedLabel = useMemo(
    () => getAccentLabel(selectedColour),
    [selectedColour]
  );

  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: theme.modalOverlay,
        display: "grid",
        placeItems: "center",
        padding: 16,
        zIndex: 2000,
      }}
      onClick={onClose}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 404,
          borderRadius: 14,
          border: `1px solid ${theme.borderStandard}`,
          background: theme.bgSurface,
          boxShadow: theme.shadowStrong,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "14px 16px 12px",
            borderBottom: `1px solid ${theme.borderStandard}`,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <div style={{ display: "grid", gap: 6 }}>
            <div
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: theme.textPrimary,
              }}
            >
              Custom theme colour
            </div>
            <div
              style={{
                fontSize: 12.5,
                color: theme.textMuted,
                lineHeight: 1.45,
                maxWidth: 290,
              }}
            >
              Choose a base colour from the palette below. The app will build a
              full theme from it rather than simply changing a single accent.
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              width: 32,
              height: 32,
              borderRadius: 10,
              border: `1px solid ${theme.borderStandard}`,
              background: theme.controlBg,
              color: theme.textPrimary,
              cursor: "pointer",
              fontSize: 19,
              lineHeight: 1,
              display: "grid",
              placeItems: "center",
              flex: "0 0 auto",
            }}
            aria-label="Close custom theme picker"
            title="Close"
          >
            ×
          </button>
        </div>

        <div
          style={{
            padding: "14px 14px 14px",
            display: "grid",
            gap: 14,
          }}
        >
          <WordHoneycombPalette
            selectedColour={selectedColour}
            onSelect={onSelect}
            theme={theme}
          />

          <div
            style={{
              display: "grid",
              gap: 10,
              justifyItems: "center",
            }}
          >
            <div
              style={{
                width: "100%",
                maxWidth: 320,
                borderTop: `1px solid ${theme.borderStandard}`,
              }}
            />

            <WordNeutralPalette
              selectedColour={selectedColour}
              onSelect={onSelect}
              theme={theme}
            />
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "end",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <div
              style={{
                display: "grid",
                gap: 6,
                minWidth: 0,
              }}
            >
              <div
                style={{
                  fontSize: 11.5,
                  fontWeight: 700,
                  letterSpacing: 0.6,
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
                  gap: 10,
                  minHeight: 40,
                  padding: "0 12px",
                  borderRadius: 12,
                  border: `1px solid ${theme.borderStandard}`,
                  background: theme.bgElevated,
                  maxWidth: 250,
                }}
              >
                <span
                  style={{
                    width: 18,
                    height: 21,
                    background: selectedHex,
                    clipPath:
                      "polygon(50% 0%, 93.3% 25%, 93.3% 75%, 50% 100%, 6.7% 75%, 6.7% 25%)",
                    border:
                      selectedColour === WORD_NEUTRAL_WHITE
                        ? `1px solid ${theme.borderStandard}`
                        : `2px solid ${theme.paper}`,
                    boxShadow: theme.shadow,
                    flex: "0 0 auto",
                  }}
                />

                <span
                  style={{
                    fontSize: 13,
                    color: theme.textSecondary,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  Base colour:{" "}
                  <strong style={{ color: theme.textPrimary }}>
                    {selectedLabel}
                  </strong>
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              style={{
                height: 40,
                padding: "0 16px",
                borderRadius: 10,
                border: `1px solid ${theme.borderStandard}`,
                background: theme.controlBg,
                color: theme.textPrimary,
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
                flex: "0 0 auto",
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

  const selectedLabel = useMemo(
    () => getAccentLabel(customThemeColour),
    [customThemeColour]
  );

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
                  width: 18,
                  height: 21,
                  background: ACCENT_MAP[customThemeColour],
                  clipPath:
                    "polygon(50% 0%, 93.3% 25%, 93.3% 75%, 50% 100%, 6.7% 75%, 6.7% 25%)",
                  border:
                    customThemeColour === WORD_NEUTRAL_WHITE
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