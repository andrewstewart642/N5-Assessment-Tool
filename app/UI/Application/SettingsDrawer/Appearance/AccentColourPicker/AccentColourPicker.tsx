"use client";

import { useMemo } from "react";

import ColourSwatch from "./ColourSwatch";
import type { Theme } from "../../../Theme/AppTheme";
import {
  ACCENT_MAP,
  type AccentOption,
} from "../../../Colours/AccentPalette";
import ColourHoneycomb from "./ColourHoneycomb";
import NeutralColourPalette from "./NeutralColourPalette";
import {
  getAccentLabel,
  WHITE_ACCENT_OPTION,
} from "./AccentColourOptions";

export default function AccentColourPicker({
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
  theme: Theme;
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
          <ColourHoneycomb
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

            <NeutralColourPalette
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
                      selectedColour === WHITE_ACCENT_OPTION
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