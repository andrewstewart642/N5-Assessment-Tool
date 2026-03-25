"use client";

import { UI_TEXT } from "@/app/ui/UiTypography";
import type { AppTheme } from "@/ui/AppTheme";
import type { Paper } from "@/shared-types/AssessmentTypes";
import AssessmentProgressHud from "@/app/create-assessment/builder/components/assessment-progress/AssessmentProgressHud";
import type { BuilderNote } from "@/app/create-assessment/builder/builder-logic/BuilderNotes";

type Props = {
  theme: AppTheme;
  routerPushCompile: () => void;
  showProgressPanel: boolean;
  hudHeight: number;
  hudResizeStartRef: React.MutableRefObject<{
    startY: number;
    startHeight: number;
  } | null>;
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
              border: `1px solid ${theme.borderSoft}`,
              background: theme.bgElevated,
              color: theme.textMuted,
              boxShadow: theme.cardShadow,
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
                background: isSaving ? theme.warning : theme.success,
                boxShadow: isSaving
                  ? "0 0 10px rgba(245,158,11,0.35)"
                  : "0 0 10px rgba(34,197,94,0.35)",
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
            background: theme.bgElevated,
            color: theme.textSecondary,
            borderRadius: 16,
            padding: "10px 14px",
            cursor: "pointer",
            boxShadow: theme.cardShadow,
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
            borderTop: `1px solid ${theme.borderSoft}`,
            minHeight: 0,
            height: "100%",
            overflow: "hidden",
            position: "relative",
            background: theme.previewChromeBg,
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
                background: theme.borderStrong,
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