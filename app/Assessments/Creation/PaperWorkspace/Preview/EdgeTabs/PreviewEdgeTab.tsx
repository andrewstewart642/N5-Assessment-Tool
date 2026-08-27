import type {
  AppTheme,
} from "@/app/UI/Application/Theme/AppTheme";

import {
  UI_TEXT,
} from "@/app/UI/Application/Typography/Typography";

type PreviewEdgeTabProps = {
  label:
    string;

  open:
    boolean;

  onClick:
    () => void;

  theme:
    AppTheme;
};

export const PREVIEW_EDGE_TAB_WIDTH =
  66;

export const PREVIEW_EDGE_TAB_HEIGHT =
  34;

export default function PreviewEdgeTab({
  label,
  open,
  onClick,
  theme,
}: PreviewEdgeTabProps) {
  return (
    <button
      type="button"
      aria-expanded={
        open
      }
      onClick={
        onClick
      }
      style={{
        width:
          PREVIEW_EDGE_TAB_WIDTH,

        height:
          PREVIEW_EDGE_TAB_HEIGHT,

        flexShrink:
          0,

        display:
          "inline-flex",

        alignItems:
          "center",

        justifyContent:
          "center",

        gap:
          7,

        padding:
          "0 8px",

        boxSizing:
          "border-box",

        border:
          `1px solid ${theme.borderStandard}`,

        borderRight:
          "none",

        borderRadius:
          "6px 0 0 6px",

        background:
          open
            ? theme.bgElevated
            : theme.bgSection,

        color:
          open
            ? theme.textPrimary
            : theme.textSecondary,

        cursor:
          "pointer",

        boxShadow:
          open
            ? theme.shadow
            : "none",

        ...UI_TEXT.controlTextStrong,

        transition:
          "background 0.15s ease, color 0.15s ease",
      }}
    >
      <span>
        {label}
      </span>

      <svg
        width="6"
        height="10"
        viewBox="0 0 6 10"
        aria-hidden="true"
        style={{
          display:
            "block",

          flexShrink:
            0,
        }}
      >
        <path
          d={
            open
              ? "M1 1 L5 5 L1 9"
              : "M5 1 L1 5 L5 9"
          }
          fill="none"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}