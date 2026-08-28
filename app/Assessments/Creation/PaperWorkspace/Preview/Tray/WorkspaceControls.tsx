import {
  useState,
} from "react";

import type {
  AppTheme,
} from "@/app/UI/Application/Theme/AppTheme";

import {
  UI_TEXT,
} from "@/app/UI/Application/Typography/Typography";

import PreviewTrayToggleRow from "./ToggleRow";

type ViewWorkspaceControlsProps = {
  theme:
    AppTheme;

  showHud:
    boolean;

  onShowHudChange: (
    next:
      boolean
  ) => void;

  onResetLayout:
    () => void;

  onResetZoom:
    () => void;
};

function ResetButton({
  label,
  onClick,
  theme,
}: {
  label:
    string;

  onClick:
    () => void;

  theme:
    AppTheme;
}) {
  const [
    hovered,
    setHovered,
  ] =
    useState(
      false
    );

  return (
    <button
      type="button"
      onClick={
        onClick
      }
      onMouseEnter={() =>
        setHovered(
          true
        )
      }
      onMouseLeave={() =>
        setHovered(
          false
        )
      }
      style={{
        height:
          30,

        minWidth:
          0,

        padding:
          "0 9px",

        border:
          `1px solid ${theme.borderStandard}`,

        borderRadius:
          5,

        background:
          hovered
            ? theme.controlBgHover
            : theme.controlBg,

        color:
          hovered
            ? theme.textPrimary
            : theme.textSecondary,

        cursor:
          "pointer",

        ...UI_TEXT.buttonTextSmall,

        transition:
          "background 150ms ease, color 150ms ease",
      }}
    >
      {label}
    </button>
  );
}

export default function ViewWorkspaceControls({
  theme,
  showHud,
  onShowHudChange,
  onResetLayout,
  onResetZoom,
}: ViewWorkspaceControlsProps) {
  return (
    <div
      style={{
        display:
          "grid",

        gap:
          7,
      }}
    >
      <div
        style={{
          ...UI_TEXT.sectionLabel,

          color:
            theme.textMuted,
        }}
      >
        Workspace
      </div>

      <PreviewTrayToggleRow
        label="Show HUD"
        helper="Marks, timings and notes"
        checked={
          showHud
        }
        onChange={
          onShowHudChange
        }
        theme={
          theme
        }
      />

      <div
        style={{
          display:
            "grid",

          gridTemplateColumns:
            "1fr 1fr",

          gap:
            6,
        }}
      >
        <ResetButton
          label="Reset layout"
          onClick={
            onResetLayout
          }
          theme={
            theme
          }
        />

        <ResetButton
          label="Reset zoom"
          onClick={
            onResetZoom
          }
          theme={
            theme
          }
        />
      </div>
    </div>
  );
}