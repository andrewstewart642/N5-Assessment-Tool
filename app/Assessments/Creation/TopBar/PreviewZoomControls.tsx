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

type PreviewZoomControlsProps = {
  theme: AppTheme;

  zoomPct: number;

  zoomIn:
    () => void;

  zoomOut:
    () => void;

  currentViewerPage:
    number;

  totalViewerPages:
    number;
};

export default function PreviewZoomControls({
  theme,
  zoomPct,
  zoomIn,
  zoomOut,
  currentViewerPage,
  totalViewerPages,
}: PreviewZoomControlsProps) {
  const [
    zoomOutHovered,
    setZoomOutHovered,
  ] =
    useState(false);

  const [
    zoomInHovered,
    setZoomInHovered,
  ] =
    useState(false);

  return (
    <div
      style={{
        display:
          "flex",

        justifyContent:
          "center",

        alignItems:
          "center",

        minHeight:
          18,

        marginTop:
          2,
      }}
    >
      <div
        style={{
          transform:
            "translateY(8px)",

          display:
            "inline-flex",

          alignItems:
            "center",

          gap:
            10,

          padding:
            "4px 12px",

          borderRadius:
            8,

          background:
            theme.bgElevated,

          opacity:
            0.92,

          border:
            `1px solid ${theme.borderStandard}`,

          boxShadow:
            theme.shadow,
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
            width: 1,

            height:
              14,

            background:
              theme.borderStandard,
          }}
        />

        <button
          type="button"
          onClick={
            zoomOut
          }
          onMouseEnter={() =>
            setZoomOutHovered(
              true
            )
          }
          onMouseLeave={() =>
            setZoomOutHovered(
              false
            )
          }
          style={{
            width:
              16,

            height:
              16,

            border:
              "none",

            background:
              "transparent",

            color:
              theme.textSecondary,

            cursor:
              "pointer",

            fontSize:
              16,

            display:
              "grid",

            placeItems:
              "center",

            transition:
              INTERACTION.transition.smooth,

            transform:
              zoomOutHovered
                ? INTERACTION.lift.subtle.transform
                : "scale(1)",

            boxShadow:
              zoomOutHovered
                ? INTERACTION.lift.subtle.shadow
                : "0 0 0 rgba(0,0,0,0)",
          }}
        >
          −
        </button>

        <div
          style={{
            minWidth:
              42,

            textAlign:
              "center",

            color:
              theme.textPrimary,

            fontSize:
              12,

            fontWeight:
              UI_TYPO.weightSemibold,
          }}
        >
          {zoomPct}%
        </div>

        <button
          type="button"
          onClick={
            zoomIn
          }
          onMouseEnter={() =>
            setZoomInHovered(
              true
            )
          }
          onMouseLeave={() =>
            setZoomInHovered(
              false
            )
          }
          style={{
            width:
              16,

            height:
              16,

            border:
              "none",

            background:
              "transparent",

            color:
              theme.textSecondary,

            cursor:
              "pointer",

            fontSize:
              16,

            display:
              "grid",

            placeItems:
              "center",

            transition:
              INTERACTION.transition.smooth,

            transform:
              zoomInHovered
                ? INTERACTION.lift.subtle.transform
                : "scale(1)",

            boxShadow:
              zoomInHovered
                ? INTERACTION.lift.subtle.shadow
                : "0 0 0 rgba(0,0,0,0)",
          }}
        >
          +
        </button>
      </div>
    </div>
  );
}