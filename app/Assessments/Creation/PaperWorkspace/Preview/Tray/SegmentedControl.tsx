import {
  useState,
} from "react";

import type {
  AppTheme,
} from "@/app/UI/Application/Theme/AppTheme";

import {
  UI_TEXT,
} from "@/app/UI/Application/Typography/Typography";


export type PreviewTraySegmentOption = {
  value:
    string;

  label:
    string;
};


type PreviewTraySegmentedControlProps = {
  value:
    string;

  options:
    PreviewTraySegmentOption[];

  onChange: (
    value:
      string
  ) => void;

  ariaLabel:
    string;

  theme:
    AppTheme;

  height?:
    number;
};


function SegmentButton({
  label,
  selected,
  onClick,
  theme,
  height,
}: {
  label:
    string;

  selected:
    boolean;

  onClick:
    () => void;

  theme:
    AppTheme;

  height:
    number;
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
          "1 1 0",

        minWidth:
          0,

        height,

        padding:
          "0 8px",

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
          "flex",

        alignItems:
          "center",

        justifyContent:
          "center",

        overflow:
          "hidden",

        whiteSpace:
          "nowrap",

        textOverflow:
          "ellipsis",

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


export default function PreviewTraySegmentedControl({
  value,
  options,
  onChange,
  ariaLabel,
  theme,
  height = 32,
}: PreviewTraySegmentedControlProps) {
  const innerHeight =
    Math.max(
      22,
      height - 6
    );

  return (
    <div
      role="radiogroup"
      aria-label={
        ariaLabel
      }
      style={{
        width:
          "100%",

        minWidth:
          0,

        height,

        padding:
          3,

        boxSizing:
          "border-box",

        display:
          "flex",

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
      {options.map(
        (
          option
        ) => (
          <SegmentButton
            key={
              option.value
            }
            label={
              option.label
            }
            selected={
              value ===
              option.value
            }
            onClick={() =>
              onChange(
                option.value
              )
            }
            theme={
              theme
            }
            height={
              innerHeight
            }
          />
        )
      )}
    </div>
  );
}