"use client";

import type {
  Dispatch,
  MutableRefObject,
  SetStateAction,
} from "react";

import type {
  Paper,
} from "@/shared-types/AssessmentTypes";

import type {
  AppTheme,
} from "@/src/UI/Application/Theme/AppTheme";

import {
  UI_TEXT,
} from "@/src/UI/Application/Typography/Typography";

import type {
  AssessmentQualityNote,
} from "../Analysis/AssessmentQualityNotes";

import type {
  AssessmentPreviewViewMode,
} from "../PaperWorkspace/PreviewViewMode";

import AssessmentProgressPanel, {
  type AssessmentProgressPanelPaperRow,
} from "./AssessmentProgressPanel";

export type AssessmentHUDBarProps = {
  theme:
    AppTheme;

  routerPushCompile:
    () => void;

  showProgressPanel:
    boolean;

  hudHeight:
    number;

  hudResizeStartRef:
    MutableRefObject<{
      startY: number;
      startHeight: number;
    } | null>;

  setIsDraggingHud:
    Dispatch<
      SetStateAction<boolean>
    >;

  viewPaper:
    Paper;

  paperRows:
    AssessmentProgressPanelPaperRow[];

  qualityNotes:
    Array<
      string |
      AssessmentQualityNote
    >;

  saveStateLabel?:
    string;

  isSaving?:
    boolean;

  previewViewMode:
    AssessmentPreviewViewMode;

  onCyclePreviewViewMode:
    () => void;
};

export default function AssessmentHUDBar({
  theme,
  routerPushCompile,
  showProgressPanel,
  hudHeight,
  hudResizeStartRef,
  setIsDraggingHud,
  viewPaper,
  paperRows,
  qualityNotes,
  saveStateLabel,
  isSaving = false,
  previewViewMode,
  onCyclePreviewViewMode,
}: AssessmentHUDBarProps) {
  const bottomOffset =
    showProgressPanel
      ? hudHeight + 14
      : 14;

  const showSaveState =
    typeof saveStateLabel ===
      "string" &&
    saveStateLabel
      .trim()
      .length > 0;

  return (
    <>
      <div
        style={{
          position:
            "absolute",

          right:
            14,

          bottom:
            bottomOffset,

          display:
            "flex",

          flexDirection:
            "column",

          alignItems:
            "flex-end",

          gap:
            8,

          zIndex:
            10,
        }}
      >
        {showSaveState ? (
          <div
            aria-live="polite"
            style={{
              display:
                "inline-flex",

              alignItems:
                "center",

              gap:
                8,

              padding:
                "6px 10px",

              borderRadius:
                999,

              border:
                `1px solid ${theme.borderStandard}`,

              background:
                theme.bgElevated,

              color:
                theme.textMuted,

              boxShadow:
                theme.shadow,

              pointerEvents:
                "none",

              fontSize:
                12,

              fontWeight:
                700,

              lineHeight:
                1,

              backdropFilter:
                "blur(8px)",

              WebkitBackdropFilter:
                "blur(8px)",
            }}
          >
            <span
              style={{
                width:
                  7,

                height:
                  7,

                borderRadius:
                  999,

                background:
                  isSaving
                    ? theme.accentPrimary
                    : theme.textMuted,

                boxShadow:
                  isSaving
                    ? `0 0 10px ${theme.accentSoft}`
                    : "0 0 10px rgba(148,163,184,0.28)",

                animation:
                  isSaving
                    ? "assessment-save-pulse 1s ease-in-out infinite"
                    : "none",

                flexShrink:
                  0,
              }}
            />

            <span>
              {saveStateLabel}
            </span>
          </div>
        ) : null}

        <button
          type="button"
          onClick={
            routerPushCompile
          }
          style={{
            border:
              `1px solid ${theme.borderStandard}`,

            background:
              theme.bgElevated,

            color:
              theme.textSecondary,

            borderRadius:
              16,

            padding:
              "10px 14px",

            cursor:
              "pointer",

            boxShadow:
              theme.shadow,

            transition:
              "background 0.15s ease, border-color 0.15s ease, color 0.15s ease, transform 0.15s ease",

            ...UI_TEXT.buttonText,
          }}
          title="Compile assessment into printable pages"
        >
          Compile →
        </button>
      </div>

      {showProgressPanel ? (
        <div
          style={{
            borderTop:
              `1px solid ${theme.borderStandard}`,

            minHeight:
              0,

            height:
              "100%",

            overflow:
              "hidden",

            position:
              "relative",

            background:
              theme.bgSurface,
          }}
        >
          <div
            onMouseDown={(
              event
            ) => {
              event.preventDefault();
              event.stopPropagation();

              hudResizeStartRef.current =
                {
                  startY:
                    event.clientY,

                  startHeight:
                    hudHeight,
                };

              setIsDraggingHud(
                true
              );
            }}
            title="Drag to resize notes panel"
            style={{
              position:
                "absolute",

              top:
                0,

              left:
                0,

              right:
                0,

              height:
                12,

              cursor:
                "row-resize",

              zIndex:
                3,

              display:
                "flex",

              justifyContent:
                "center",

              alignItems:
                "center",

              userSelect:
                "none",

              WebkitUserSelect:
                "none",
            }}
          >
            <div
              style={{
                width:
                  54,

                height:
                  4,

                borderRadius:
                  999,

                background:
                  theme.borderStandard,
              }}
            />
          </div>

          <div
            style={{
              position:
                "absolute",

              inset:
                "12px 0 0 0",

              minHeight:
                0,

              overflow:
                "hidden",
            }}
          >
            <AssessmentProgressPanel
              viewPaper={
                viewPaper
              }
              paperRows={
                paperRows
              }
              notes={
                qualityNotes
              }
              theme={
                theme
              }
              previewViewMode={
                previewViewMode
              }
              onCyclePreviewViewMode={
                onCyclePreviewViewMode
              }
            />
          </div>
        </div>
      ) : (
        <div
          style={{
            minHeight:
              0,

            overflow:
              "hidden",
          }}
        />
      )}

      <style jsx>{`
        @keyframes assessment-save-pulse {
          0% {
            transform: scale(1);
            opacity: 0.9;
          }

          50% {
            transform: scale(1.25);
            opacity: 1;
          }

          100% {
            transform: scale(1);
            opacity: 0.9;
          }
        }
      `}</style>
    </>
  );
}