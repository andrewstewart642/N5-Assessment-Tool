import {
  useState,
} from "react";

import type {
  AppTheme,
} from "@/app/UI/Application/Theme/AppTheme";

import {
  UI_TEXT,
} from "@/app/UI/Application/Typography/Typography";

type PreviewTrayToggleRowProps = {
  label:
    string;

  helper?:
    string;

  checked:
    boolean;

  onChange: (
    next:
      boolean
  ) => void;

  theme:
    AppTheme;
};

export default function PreviewTrayToggleRow({
  label,
  helper,
  checked,
  onChange,
  theme,
}: PreviewTrayToggleRowProps) {
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
      role="switch"
      aria-checked={
        checked
      }
      onClick={() =>
        onChange(
          !checked
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
      style={{
        width:
          "100%",

        minHeight:
          helper
            ? 42
            : 36,

        display:
          "grid",

        gridTemplateColumns:
          "minmax(0, 1fr) auto",

        alignItems:
          "center",

        gap:
          10,

        padding:
          helper
            ? "5px 4px"
            : "3px 4px",

        boxSizing:
          "border-box",

        border:
          "none",

        borderRadius:
          5,

        background:
          hovered
            ? theme.controlBgHover
            : "transparent",

        color:
          theme.textPrimary,

        cursor:
          "pointer",

        textAlign:
          "left",

        transition:
          "background 150ms ease",
      }}
    >
      <span
        style={{
          minWidth:
            0,

          display:
            "grid",

          gap:
            2,
        }}
      >
        <span
          style={{
            ...UI_TEXT.controlTextStrong,

            color:
              theme.textSecondary,
          }}
        >
          {label}
        </span>

        {helper ? (
          <span
            style={{
              ...UI_TEXT.helper,

              color:
                theme.textMuted,
            }}
          >
            {helper}
          </span>
        ) : null}
      </span>

      <span
        aria-hidden="true"
        style={{
          width:
            32,

          height:
            18,

          padding:
            2,

          flexShrink:
            0,

          boxSizing:
            "border-box",

          position:
            "relative",

          border:
            `1px solid ${
              checked
                ? theme.controlSelectedBorder
                : theme.borderStandard
            }`,

          borderRadius:
            9,

          background:
            checked
              ? theme.controlSelectedBg
              : theme.controlBg,

          transition:
            "background 150ms ease, border-color 150ms ease",
        }}
      >
        <span
          style={{
            position:
              "absolute",

            top:
              3,

            left:
              checked
                ? 17
                : 3,

            width:
              10,

            height:
              10,

            borderRadius:
              999,

            background:
              checked
                ? theme.accentPrimary
                : theme.textMuted,

            transition:
              "left 160ms cubic-bezier(0.2, 0.8, 0.2, 1), background 150ms ease",
          }}
        />
      </span>
    </button>
  );
}