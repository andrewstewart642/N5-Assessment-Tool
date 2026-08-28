import {
  useState,
} from "react";

import type {
  AppTheme,
} from "@/app/UI/Application/Theme/AppTheme";

import {
  UI_TYPO,
} from "@/app/UI/Application/Typography/Typography";

type PreviewZoomControlsProps = {
  theme:
    AppTheme;

  zoomPct:
    number;

  zoomIn:
    () => void;

  zoomOut:
    () => void;

  currentViewerPage:
    number;

  totalViewerPages:
    number;

  opacity:
    number;

  onActivity:
    () => void;
};

function ZoomButton({
  label,
  onClick,
  theme,
}: {
  label:
    "−" | "+";

  onClick:
    () => void;

  theme:
    AppTheme;
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
        width:
          18,

        height:
          18,

        padding:
          0,

        border:
          "none",

        borderRadius:
          4,

        background:
          hovered
            ? theme.controlBgHover
            : "transparent",

        color:
          theme.textSecondary,

        cursor:
          "pointer",

        display:
          "grid",

        placeItems:
          "center",

        fontFamily:
          UI_TYPO.family,

        fontSize:
          14,

        lineHeight:
          1,

        transition:
          "background 0.12s ease, color 0.12s ease",
      }}
    >
      {label}
    </button>
  );
}

export default function PreviewZoomControls({
  theme,
  zoomPct,
  zoomIn,
  zoomOut,
  currentViewerPage,
  totalViewerPages,
  opacity,
  onActivity,
}: PreviewZoomControlsProps) {
  const [
    hovered,
    setHovered,
  ] =
    useState(false);

  return (
    <div
      onMouseEnter={() => {
        setHovered(
          true
        );

        onActivity();
      }}
      onMouseLeave={() =>
        setHovered(
          false
        )
      }
      onPointerDown={
        onActivity
      }
      style={{
        display:
          "inline-flex",

        alignItems:
          "center",

        gap:
          10,

        padding:
          "4px 12px",

        borderRadius:
          6,

        border:
          `1px solid ${theme.borderStandard}`,

        background:
          theme.bgElevated,

        color:
          theme.textPrimary,

        boxShadow:
          theme.shadow,

        opacity:
          hovered
            ? 0.98
            : opacity,

        transition:
          "opacity 1.2s ease",
      }}
    >
      <div
        style={{
          minWidth:
            34,

          textAlign:
            "center",

          color:
            theme.textMuted,

          fontFamily:
            UI_TYPO.family,

          fontSize:
            12,

          fontWeight:
            UI_TYPO.weightMedium,
        }}
      >
        {currentViewerPage}/
        {totalViewerPages}
      </div>

      <div
        style={{
          width:
            1,

          height:
            14,

          background:
            theme.borderStandard,
        }}
      />

      <ZoomButton
        label="−"
        theme={
          theme
        }
        onClick={() => {
          onActivity();
          zoomOut();
        }}
      />

      <div
        style={{
          minWidth:
            42,

          textAlign:
            "center",

          color:
            theme.textPrimary,

          fontFamily:
            UI_TYPO.family,

          fontSize:
            12,

          fontWeight:
            UI_TYPO.weightSemibold,
        }}
      >
        {zoomPct}%
      </div>

      <ZoomButton
        label="+"
        theme={
          theme
        }
        onClick={() => {
          onActivity();
          zoomIn();
        }}
      />
    </div>
  );
}