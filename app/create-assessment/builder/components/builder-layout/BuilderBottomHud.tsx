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
  saveStateLabel?: string;
  isSaving?: boolean;
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
  saveStateLabel,
  isSaving = false,
}: Props) {
  const bottomOffset = showProgressPanel ? hudHeight + 14 : 14;
  const showSaveState =
    typeof saveStateLabel === "string" && saveStateLabel.trim().length > 0;

  return (
    <>
      <div
        style={{
          position: "absolute",
          right: 14,
          bottom: bottomOffset,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: 8,
          zIndex: 10,
        }}
      >
        {showSaveState ? (
          <div
            aria-live="polite"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 10px",
              borderRadius: 999,
              border: `1px solid ${theme.border}`,
              background:
                theme.pageBg === "#eef3f8"
                  ? "rgba(255,255,255,0.88)"
                  : "rgba(11,17,24,0.78)",
              color: (theme as any).textMuted ?? theme.text,
              boxShadow: "0 8px 18px rgba(0,0,0,0.14)",
              pointerEvents: "none",
              fontSize: 12,
              fontWeight: 700,
              lineHeight: 1,
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: 999,
                background: isSaving ? "#facc15" : "#4ade80",
                boxShadow: isSaving
                  ? "0 0 10px rgba(250,204,21,0.35)"
                  : "0 0 10px rgba(74,222,128,0.35)",
                animation: isSaving
                  ? "builder-save-pulse 1s ease-in-out infinite"
                  : "none",
                flexShrink: 0,
              }}
            />
            <span>{saveStateLabel}</span>
          </div>
        ) : null}

        <button
          type="button"
          onClick={routerPushCompile}
          style={{
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

      <style jsx>{`
        @keyframes builder-save-pulse {
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