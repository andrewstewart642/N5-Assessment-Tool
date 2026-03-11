"use client";

import BuilderPreviewPageRenderer from "@/app/create-assessment/builder/components/builder-layout/BuilderPreviewPageRenderer";
import { UI_TEXT, UI_TYPO } from "@/app/ui/UiTypography";
import { getTheme } from "@/app/ui/AppTheme";
import type { Paper, Question } from "@/shared-types/AssessmentTypes";
import type { PreviewPage } from "@/app/create-assessment/builder/BuilderUtils";

type Theme = ReturnType<typeof getTheme>;

type EditForView =
  | {
      questionIndex: number;
      original: Question;
      draft: Question;
    }
  | null;

type Props = {
  theme: Theme;
  previewPaneRef: React.RefObject<HTMLDivElement | null>;
  pageWrapperRefs: React.RefObject<Array<HTMLDivElement | null>>;
  flashWarning: string | null;
  currentViewerPage: number;
  totalViewerPages: number;
  zoomPct: number;
  zoomIn: () => void;
  zoomOut: () => void;
  previewPages: PreviewPage[];
  viewPaper: Paper;
  viewerScale: number;
  activePaperCoverMarks: number;
  showCoverDateTime: boolean;
  coverDateTextForView: string;
  coverTimeTextForView: string;
  showScottishCandidateNumberBox: boolean;
  includeCoverSheet: boolean;
  includeFormulaSheet: boolean;
  renderById: Map<string, { kind: "locked" | "edit" | "draft"; q: Question }>;
  editForView: EditForView;
  onMeasure: (id: string, heightPx: number) => void;
  saveEdit: () => void;
  removeWhileEditing: () => void;
  assignNewDraft: () => void;
  removeNewDraft: () => void;
  startEditLockedQuestion: (questionId: string) => void;
};

export default function BuilderPreviewPane({
  theme,
  previewPaneRef,
  pageWrapperRefs,
  flashWarning,
  currentViewerPage,
  totalViewerPages,
  zoomPct,
  zoomIn,
  zoomOut,
  previewPages,
  viewPaper,
  viewerScale,
  activePaperCoverMarks,
  showCoverDateTime,
  coverDateTextForView,
  coverTimeTextForView,
  showScottishCandidateNumberBox,
  includeCoverSheet,
  includeFormulaSheet,
  renderById,
  editForView,
  onMeasure,
  saveEdit,
  removeWhileEditing,
  assignNewDraft,
  removeNewDraft,
  startEditLockedQuestion,
}: Props) {
  return (
    <div
      ref={previewPaneRef}
      className="hover-scroll"
      style={{
        position: "relative",
        minHeight: 0,
        overflowY: "auto",
        overflowX: "auto",
        padding: "18px 18px 18px",
        background: theme.pageBg === "#eef3f8" ? "#e9eff6" : theme.panelBg2,
      }}
    >
      <div
        style={{
          position: "sticky",
          top: 8,
          zIndex: 6,
          width: "100%",
          height: 0,
          display: "flex",
          justifyContent: "center",
          pointerEvents: "none",
          overflow: "visible",
        }}
      >
        <div
          style={{
            position: "relative",
            width: 188,
            height: 42,
            background: "rgba(188, 194, 203, 0.88)",
            border: "1px solid rgba(255,255,255,0.22)",
            borderRadius: 14,
            boxShadow: "0 12px 24px rgba(0,0,0,0.18)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            pointerEvents: "auto",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 6,
              top: "50%",
              transform: "translateY(-50%)",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <div
              style={{
                width: 28,
                textAlign: "center",
                color: "rgba(70,70,70,0.65)",
                fontSize: 12,
                fontFamily: UI_TYPO.family,
                fontWeight: UI_TYPO.weightMedium,
                lineHeight: 1,
              }}
              title={`Page ${currentViewerPage} of ${totalViewerPages}`}
            >
              {currentViewerPage}/{totalViewerPages}
            </div>

            <div
              style={{
                width: 1,
                height: 18,
                background: "rgba(90,90,90,0.30)",
              }}
            />
          </div>

          <div
            style={{
              position: "absolute",
              left: "58%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              display: "grid",
              gridTemplateColumns: "24px 54px 24px",
              alignItems: "center",
              justifyItems: "center",
              columnGap: 6,
              height: 24,
            }}
          >
            <button
              type="button"
              onClick={zoomOut}
              style={{
                width: 24,
                height: 24,
                border: "none",
                borderRadius: 6,
                background: "transparent",
                color: "rgba(70,70,70,0.94)",
                cursor: "pointer",
                fontFamily: UI_TYPO.family,
                fontWeight: UI_TYPO.weightMedium,
                fontSize: 20,
                lineHeight: "24px",
                display: "grid",
                placeItems: "center",
                padding: 0,
              }}
              title="Zoom out"
            >
              −
            </button>

            <div
              style={{
                width: 54,
                textAlign: "center",
                color: "rgba(70,70,70,0.95)",
                fontSize: 15,
                fontFamily: UI_TYPO.family,
                fontWeight: UI_TYPO.weightSemibold,
                lineHeight: "24px",
              }}
              title="Current zoom"
            >
              {zoomPct}%
            </div>

            <button
              type="button"
              onClick={zoomIn}
              style={{
                width: 24,
                height: 24,
                border: "none",
                borderRadius: 6,
                background: "transparent",
                color: "rgba(70,70,70,0.94)",
                cursor: "pointer",
                fontFamily: UI_TYPO.family,
                fontWeight: UI_TYPO.weightMedium,
                fontSize: 20,
                lineHeight: "24px",
                display: "grid",
                placeItems: "center",
                padding: 0,
              }}
              title="Zoom in"
            >
              +
            </button>
          </div>
        </div>
      </div>

      <div
        style={{
          width: "max-content",
          minWidth: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
        }}
      >
        {flashWarning ? (
          <div
            style={{
              width: "min(100%, 760px)",
              border: `1px solid ${theme.border}`,
              background: theme.pageBg === "#eef3f8" ? "#fff4e5" : "#241a0b",
              color: theme.pageBg === "#eef3f8" ? "#9a5b00" : "#ffd7a3",
              borderRadius: 12,
              padding: "10px 12px",
              ...UI_TEXT.controlTextStrong,
            }}
          >
            {flashWarning}
          </div>
        ) : null}

        <div
          style={{
            width: "max-content",
            minWidth: "100%",
            display: "grid",
            justifyItems: "center",
            gap: 18,
          }}
        >
          {previewPages.map((previewPage, previewIndex) => (
            <BuilderPreviewPageRenderer
              key={`${viewPaper}-${previewPage.kind}-${previewPage.pageNumber}-${previewIndex}`}
              previewPage={previewPage}
              previewIndex={previewIndex}
              viewPaper={viewPaper}
              pageWrapperRefs={pageWrapperRefs}
              viewerScale={viewerScale}
              activePaperCoverMarks={activePaperCoverMarks}
              showCoverDateTime={showCoverDateTime}
              coverDateTextForView={coverDateTextForView}
              coverTimeTextForView={coverTimeTextForView}
              showScottishCandidateNumberBox={showScottishCandidateNumberBox}
              includeCoverSheet={includeCoverSheet}
              includeFormulaSheet={includeFormulaSheet}
              renderById={renderById}
              editForView={editForView}
              onMeasure={onMeasure}
              saveEdit={saveEdit}
              removeWhileEditing={removeWhileEditing}
              assignNewDraft={assignNewDraft}
              removeNewDraft={removeNewDraft}
              startEditLockedQuestion={startEditLockedQuestion}
              theme={theme}
            />
          ))}
        </div>
      </div>
    </div>
  );
}