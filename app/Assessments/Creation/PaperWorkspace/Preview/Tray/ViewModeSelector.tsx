
import {
  useState,
} from "react";

import type {
  AppTheme,
} from "@/app/UI/Application/Theme/AppTheme";

import {
  UI_TEXT,
} from "@/app/UI/Application/Typography/Typography";

import type {
  AssessmentPreviewViewMode,
} from "../../ViewMode";

type AssessmentViewModeControlProps = {
  value:
    AssessmentPreviewViewMode;

  onChange: (
    mode:
      AssessmentPreviewViewMode
  ) => void;

  theme:
    AppTheme;
};

const VIEW_MODES: Array<{
  value:
    AssessmentPreviewViewMode;

  label:
    string;
}> = [
  {
    value:
      "COMPACT",

    label:
      "Compact",
  },

  {
    value:
      "EXAM",

    label:
      "Exam",
  },

  {
    value:
      "ANSWERS",

    label:
      "Answers",
  },
];

function ViewModeButton({
  label,
  selected,
  onClick,
  theme,
}: {
  label:
    string;

  selected:
    boolean;

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
      role="radio"
      aria-checked={
        selected
      }
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
        flex:
          "0 0 auto",

        height:
          26,

        padding:
          "0 9px",

        border:
          "none",

        borderRadius:
          4,

        background:
          selected
            ? theme.controlSelectedBg
            : hovered
              ? theme.controlBgHover
              : "transparent",

        color:
          selected
            ? theme.textPrimary
            : theme.textSecondary,

        cursor:
          "pointer",

        display:
          "inline-flex",

        alignItems:
          "center",

        justifyContent:
          "center",

        whiteSpace:
          "nowrap",

        ...UI_TEXT.controlText,

        fontWeight:
          selected
            ? 600
            : 500,

        transition:
          "background 150ms ease, color 150ms ease",
      }}
    >
      {label}
    </button>
  );
}

export default function AssessmentViewModeControl({
  value,
  onChange,
  theme,
}: AssessmentViewModeControlProps) {
  return (
    <div
      role="radiogroup"
      aria-label="Preview view mode"
      style={{
        width:
          "fit-content",

        maxWidth:
          "100%",

        minWidth:
          0,

        height:
          32,

        padding:
          3,

        boxSizing:
          "border-box",

        display:
          "inline-flex",

        alignItems:
          "center",

        gap:
          3,

        border:
          `1px solid ${theme.borderStandard}`,

        borderRadius:
          6,

        background:
          theme.controlBg,
      }}
    >
      {VIEW_MODES.map(
        (
          mode
        ) => (
          <ViewModeButton
            key={
              mode.value
            }
            label={
              mode.label
            }
            selected={
              value ===
              mode.value
            }
            onClick={() =>
              onChange(
                mode.value
              )
            }
            theme={
              theme
            }
          />
        )
      )}
    </div>
  );
}