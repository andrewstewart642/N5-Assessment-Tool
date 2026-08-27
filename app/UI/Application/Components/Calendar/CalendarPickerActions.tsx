import {
  useState,
} from "react";

import type {
  AppTheme,
} from "@/app/UI/Application/Theme/AppTheme";

import {
  UI_TEXT,
} from "@/app/UI/Application/Typography/Typography";

type CalendarPickerActionsProps = {
  theme:
    AppTheme;

  onCancel:
    () => void;

  onApply:
    () => void;
};

function CalendarActionButton({
  label,
  primary,
  theme,
  onClick,
}: {
  label:
    string;

  primary:
    boolean;

  theme:
    AppTheme;

  onClick:
    () => void;
}) {
  const [
    hovered,
    setHovered,
  ] =
    useState(false);

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
          28,

        minWidth:
          64,

        padding:
          "0 10px",

        borderRadius:
          5,

        border:
          `1px solid ${
            primary
              ? theme.controlSelectedBorder
              : theme.borderStandard
          }`,

        background:
          primary
            ? theme.controlSelectedBg
            : hovered
              ? theme.controlBgHover
              : theme.controlBg,

        color:
          primary
            ? theme.textPrimary
            : theme.textSecondary,

        cursor:
          "pointer",

        ...UI_TEXT.buttonTextSmall,

        transition:
          "background 0.15s ease, border-color 0.15s ease",
      }}
    >
      {label}
    </button>
  );
}

export default function CalendarPickerActions({
  theme,
  onCancel,
  onApply,
}: CalendarPickerActionsProps) {
  return (
    <div
      style={{
        display:
          "flex",

        justifyContent:
          "space-between",

        gap:
          8,

        marginTop:
          8,

        paddingTop:
          8,

        borderTop:
          `1px solid ${theme.borderStandard}`,
      }}
    >
      <CalendarActionButton
        label="Cancel"
        primary={
          false
        }
        theme={
          theme
        }
        onClick={
          onCancel
        }
      />

      <CalendarActionButton
        label="OK"
        primary
        theme={
          theme
        }
        onClick={
          onApply
        }
      />
    </div>
  );
}