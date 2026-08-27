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
} from "../../PreviewViewMode";

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
      "EXAM",

    label:
      "Exam",
  },

  {
    value:
      "COMPACT",

    label:
      "Compact",
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
        minWidth:
          0,

        height:
          28,

        padding:
          "0 7px",

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
          "grid",

        placeItems:
          "center",

        whiteSpace:
          "nowrap",

        ...UI_TEXT.controlText,

        fontWeight:
          selected
            ? 600
            : 500,

        transition:
          "background 0.15s ease, color 0.15s ease",
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
      aria-label="Preview view"
      style={{
        width:
          "100%",

        height:
          34,

        padding:
          3,

        boxSizing:
          "border-box",

        display:
          "grid",

        gridTemplateColumns:
          "repeat(3, minmax(0, 1fr))",

        gap:
          2,

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