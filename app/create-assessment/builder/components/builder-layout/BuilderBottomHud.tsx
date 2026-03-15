"use client";

import { UI_TEXT } from "@/app/ui/UiTypography";
import { getTheme } from "@/app/ui/AppTheme";
import type { Paper } from "@/shared-types/AssessmentTypes";
import AssessmentProgressHud from "@/app/create-assessment/builder/components/assessment-progress/AssessmentProgressHud";
import type { BuilderNote } from "@/app/create-assessment/builder/builder-logic/BuilderNotes";

type Theme = ReturnType<typeof getTheme>;

type Props = {
  theme: Theme;
  routerPushCompile: () => void;
  showProgressPanel: boolean;
  hudHeight: number;
  hudResizeStartRef: React.MutableRefObject<{ startY: number; startHeight: number } | null>;
  setIsDraggingHud: React.Dispatch<React.SetStateAction<boolean>>;
  viewPaper: Paper;
  p1Marks: number;
  p2Marks: number;
  p1Target: number;
  p2Target: number;
  p1Mins: number;
  p2Mins: number;
  qualityNotes: Array<string | BuilderNote>;
};

export default function BuilderBottomHud({
  theme,
  routerPushCompile,
  showProgressPanel,
  hudHeight,
  hudResizeStartRef,
  setIsDraggingHud,
  viewPaper,
  p1Marks,
  p2Marks,
  p1Target,
  p2Target,
  p1Mins,
  p2Mins,
  qualityNotes,
}: Props) {
  return (
    <>
      <button
        type="button"
        onClick={routerPushCompile}
        style={{
          position: "absolute",
          right: 14,
          bottom: showProgressPanel ? hudHeight + 14 : 14,
          border: `1px solid ${theme.border}`,
          background:
            theme.pageBg === "#eef3f8"
              ? "rgba(255,255,255,0.92)"
              : "rgba(11,17,24,0.92)",
          color: (theme as any).textMuted ?? theme.text,
          borderRadius: 16,
          padding: "10px 14px",
          cursor: "pointer",
          boxShadow: "0 10px 20px rgba(0,0,0,0.18)",
          zIndex: 4,
          ...UI_TEXT.buttonText,
        }}
        title="Compile assessment into printable pages"
      >
        Compile →
      </button>

      {showProgressPanel ? (
        <div
          style={{
            borderTop: `1px solid ${theme.border}`,
            minHeight: 0,
            height: "100%",
            overflow: "hidden",
            position: "relative",
            background:
              theme.pageBg === "#eef3f8"
                ? "rgba(255,255,255,0.72)"
                : "rgba(15,22,32,0.92)",
          }}
        >
          <div
            onMouseDown={(e) => {
              hudResizeStartRef.current = {
                startY: e.clientY,
                startHeight: hudHeight,
              };
              setIsDraggingHud(true);
            }}
            title="Drag to resize notes panel"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 12,
              cursor: "row-resize",
              zIndex: 3,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: 54,
                height: 4,
                borderRadius: 999,
                background:
                  theme.pageBg === "#eef3f8"
                    ? "rgba(80,97,116,0.28)"
                    : "rgba(169,182,197,0.35)",
              }}
            />
          </div>

          <div
            style={{
              position: "absolute",
              inset: "12px 0 0 0",
              minHeight: 0,
              overflow: "hidden",
            }}
          >
            <AssessmentProgressHud
              viewPaper={viewPaper}
              p1Marks={p1Marks}
              p2Marks={p2Marks}
              p1TargetMarks={p1Target}
              p2TargetMarks={p2Target}
              p1TimeMinutes={p1Mins}
              p2TimeMinutes={p2Mins}
              notes={qualityNotes}
              theme={theme}
            />
          </div>
        </div>
      ) : (
        <div style={{ minHeight: 0, overflow: "hidden" }} />
      )}
    </>
  );
}