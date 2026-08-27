import {
  useState,
} from "react";

import type {
  AppTheme,
} from "@/app/UI/Application/Theme/AppTheme";

import {
  UI_TEXT,
} from "@/app/UI/Application/Typography/Typography";

import AssessmentTopBarField from "./AssessmentTopBarField";

import {
  TOP_BAR_CONTROL_HEIGHT,
  TOP_BAR_CONTROL_RADIUS,
} from "./AssessmentTopBarTokens";

type AssessmentMetaFieldProps = {
  label:
    string;

  value:
    string;

  onChange: (
    value: string
  ) => void;

  onFocus?:
    () => void;

  onBlur?:
    () => void;

  width?:
    number;

  theme:
    AppTheme;
};

export default function AssessmentMetaField({
  label,
  value,
  onChange,
  onFocus,
  onBlur,
  width,
  theme,
}: AssessmentMetaFieldProps) {
  const [
    hovered,
    setHovered,
  ] =
    useState(false);

  const [
    focused,
    setFocused,
  ] =
    useState(false);

  const active =
    hovered ||
    focused;

  return (
    <AssessmentTopBarField
      label={
        label
      }
      theme={
        theme
      }
      width={
        width ??
        "100%"
      }
    >
      <input
        type="text"
        aria-label={
          label
        }
        value={
          value
        }
        onChange={(
          event
        ) =>
          onChange(
            event.target.value
          )
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
        onFocus={() => {
          setFocused(
            true
          );

          onFocus?.();
        }}
        onBlur={() => {
          setFocused(
            false
          );

          onBlur?.();
        }}
        style={{
          width:
            "100%",

          height:
            TOP_BAR_CONTROL_HEIGHT,

          minWidth:
            0,

          boxSizing:
            "border-box",

          borderRadius:
            TOP_BAR_CONTROL_RADIUS,

          border:
            `1px solid ${
              active
                ? theme.controlSelectedBorder
                : theme.borderStandard
            }`,

          background:
            active
              ? theme.controlBgHover
              : theme.controlBg,

          color:
            theme.textPrimary,

          padding:
            "0 8px",

          outline:
            "none",

          ...UI_TEXT.controlText,

          transition:
            "background 0.15s ease, border-color 0.15s ease, color 0.15s ease",
        }}
      />
    </AssessmentTopBarField>
  );
}