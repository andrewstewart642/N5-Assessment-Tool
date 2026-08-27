import type {
  Dispatch,
  MutableRefObject,
  SetStateAction,
} from "react";

import type {
  Paper,
} from "@/app/Assessments/AssessmentTypes";

import type {
  AppTheme,
} from "@/app/UI/Application/Theme/AppTheme";

import {
  UI_TEXT,
} from "@/app/UI/Application/Typography/Typography";

import type {
  AssessmentQualityNote,
} from "../Analysis/AssessmentQualityNotes";

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
};

const HUD_PANE_RADIUS =
  6;

export default function AssessmentHUDBar({
  theme,
  routerPushCompile,
  showProgressPanel,
  hudHeight,
  viewPaper,
  paperRows,
  qualityNotes,
}: AssessmentHUDBarProps) {
  const bottomOffset =
    showProgressPanel
      ? hudHeight + 14
      : 14;

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
            border:
              `1px solid ${theme.borderStandard}`,

            borderRadius:
              HUD_PANE_RADIUS,

            minWidth:
              0,

            minHeight:
              0,

            width:
              "100%",

            height:
              "100%",

            overflow:
              "hidden",

            position:
              "relative",

            background:
              theme.bgSurface,

            boxSizing:
              "border-box",
          }}
        >
          <div
            style={{
              position:
                "absolute",

              inset:
                0,

              minWidth:
                0,

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
    </>
  );
}