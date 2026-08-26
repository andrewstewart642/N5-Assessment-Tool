import {
  useState,
} from "react";

import {
  INTERACTION,
} from "@/app/UI/Application/Motion/InteractionTokens";

import type {
  AppTheme,
} from "@/app/UI/Application/Theme/AppTheme";

import {
  UI_TYPO,
} from "@/app/UI/Application/Typography/Typography";

type AssessmentMetaFieldProps = {
  label: string;

  value: string;

  onChange: (
    value: string
  ) => void;

  onFocus?:
    () => void;

  onBlur?:
    () => void;

  width?: number;

  theme: AppTheme;
};

const CONTROL_HEIGHT =
  32;

const LABEL_GAP =
  4;

const CONTROL_RADIUS =
  10;

function getLabelStyle(
  theme: AppTheme
): React.CSSProperties {
  return {
    fontSize: 12,

    fontWeight:
      UI_TYPO.weightMedium,

    color:
      theme.textMuted,

    lineHeight: 1.2,

    whiteSpace:
      "nowrap",
  };
}

function getInputShellStyle(
  hovered: boolean,
  focused: boolean
): React.CSSProperties {
  const active =
    hovered ||
    focused;

  return {
    width:
      "100%",

    borderRadius:
      CONTROL_RADIUS,

    transform:
      active
        ? INTERACTION.lift.subtle.transform
        : "scale(1)",

    boxShadow:
      active
        ? INTERACTION.lift.subtle.shadow
        : "0 0 0 rgba(0,0,0,0)",

    transition:
      INTERACTION.transition.smooth,
  };
}

function getInputStyle(
  theme: AppTheme,
  hovered: boolean,
  focused: boolean
): React.CSSProperties {
  const active =
    hovered ||
    focused;

  return {
    height:
      CONTROL_HEIGHT,

    borderRadius:
      CONTROL_RADIUS,

    border:
      `1px solid ${
        active
          ? theme.controlSelectedBorder
          : theme.borderStandard
      }`,

    background:
      active
        ? theme.controlBgHover
        : theme.bgElevated,

    color:
      theme.textPrimary,

    padding:
      "0 10px",

    fontSize: 13,

    fontFamily:
      UI_TYPO.family,

    fontWeight:
      UI_TYPO.weightSemibold,

    minWidth: 0,

    width:
      "100%",

    boxSizing:
      "border-box",

    outline:
      "none",

    boxShadow:
      active
        ? "inset 0 1px 0 rgba(255,255,255,0.06)"
        : "inset 0 1px 0 rgba(255,255,255,0.04)",

    transition:
      INTERACTION.transition.smooth,
  };
}

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

  return (
    <label
      style={{
        display:
          "grid",

        gap:
          LABEL_GAP,

        minWidth: 0,

        width:
          width ??
          "auto",

        fontFamily:
          UI_TYPO.family,
      }}
    >
      <span
        style={
          getLabelStyle(
            theme
          )
        }
      >
        {label}
      </span>

      <div
        style={
          getInputShellStyle(
            hovered,
            focused
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
      >
        <input
          type="text"
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
          style={
            getInputStyle(
              theme,
              hovered,
              focused
            )
          }
        />
      </div>
    </label>
  );
}