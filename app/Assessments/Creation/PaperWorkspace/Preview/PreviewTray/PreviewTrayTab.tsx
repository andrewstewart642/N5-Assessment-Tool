"use client";

import {
  useState,
} from "react";

import type {
  AppTheme,
} from "@/app/UI/Application/Theme/AppTheme";

import {
  UI_TEXT,
} from "@/app/UI/Application/Typography/Typography";

type PreviewTrayTabProps = {
  label:
    string;

  height:
    number;

  active:
    boolean;

  open:
    boolean;

  onClick:
    () => void;

  theme:
    AppTheme;
};

export const PREVIEW_TRAY_TAB_WIDTH =
  32;

const ACTIVE_OPACITY =
  1;

const INACTIVE_OPACITY =
  0.62;

const INACTIVE_HOVER_OPACITY =
  0.82;

export default function PreviewTrayTab({
  label,
  height,
  active,
  open,
  onClick,
  theme,
}: PreviewTrayTabProps) {
  const [
    hovered,
    setHovered,
  ] =
    useState(
      false
    );

  const opacity =
    active
      ? ACTIVE_OPACITY
      : hovered
        ? INACTIVE_HOVER_OPACITY
        : INACTIVE_OPACITY;

  return (
    <button
      type="button"
      aria-expanded={
        open
      }
      aria-pressed={
        active
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
        width:
          PREVIEW_TRAY_TAB_WIDTH,

        height,

        flexShrink:
          0,

        padding:
          0,

        boxSizing:
          "border-box",

        border:
          `1px solid ${theme.borderStandard}`,

        borderRight:
          "none",

        borderRadius:
          "6px 0 0 6px",

        background:
          active
            ? theme.bgElevated
            : theme.bgSection,

        color:
          active
            ? theme.textPrimary
            : theme.textSecondary,

        opacity,

        cursor:
          "pointer",

        position:
          "relative",

        overflow:
          "hidden",

        /*
         * The tray itself owns the shadow.
         * The tabs should feel physically
         * attached to that tray.
         */
        boxShadow:
          "none",

        transition: [
          "opacity 150ms ease",
          "background 150ms ease",
          "color 150ms ease",
        ].join(", "),
      }}
    >
      {/*
       * Active divider indicator.
       */}
      {active ? (
        <span
          aria-hidden="true"
          style={{
            position:
              "absolute",

            left:
              0,

            top:
              6,

            bottom:
              6,

            width:
              2,

            borderRadius:
              2,

            background:
              theme.accentPrimary,
          }}
        />
      ) : null}

      {/*
       * Absolutely centre the rotated word.
       *
       * Previously the rotated span was still
       * participating in normal layout before
       * rotation, which is what could make the
       * longer "Settings" label look offset or
       * clipped.
       *
       * The label now has one fixed centre point
       * regardless of its text length.
       */}
      <span
        style={{
          ...UI_TEXT.controlTextStrong,

          position:
            "absolute",

          left:
            "50%",

          top:
            "50%",

          transform:
            "translate(-50%, -50%) rotate(-90deg)",

          transformOrigin:
            "center",

          whiteSpace:
            "nowrap",

          lineHeight:
            1,

          userSelect:
            "none",

          pointerEvents:
            "none",
        }}
      >
        {label}
      </span>
    </button>
  );
}