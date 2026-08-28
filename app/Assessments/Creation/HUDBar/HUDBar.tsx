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

import type {
  AssessmentQualityNote,
} from "../Analysis/AssessmentQualityNotes";

import AssessmentCompileButton from "./CompileButton";

import AssessmentProgressPanel, {
  type AssessmentProgressPanelPaperRow,
} from "./ProgressPanel";


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
      startY:
        number;

      startHeight:
        number;
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

const COMPILE_RIGHT_OFFSET =
  10;

const COMPILE_BOTTOM_OFFSET =
  10;


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
      ? hudHeight +
        COMPILE_BOTTOM_OFFSET
      : COMPILE_BOTTOM_OFFSET;


  return (
    <>
      <div
        style={{
          position:
            "absolute",

          right:
            COMPILE_RIGHT_OFFSET,

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
        <AssessmentCompileButton
          theme={
            theme
          }
          onClick={
            routerPushCompile
          }
        />
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