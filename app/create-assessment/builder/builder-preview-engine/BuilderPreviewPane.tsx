"use client";

import type { RefObject } from "react";
import BuilderPreviewPageRenderer from "./BuilderPreviewPageRenderer";
import { UI_TEXT } from "@/app/ui/UiTypography";
import type { Theme } from "@/ui/AppTheme";
import type { Paper, Question } from "@/shared-types/AssessmentTypes";
import type { PreviewPage } from "@/app/create-assessment/builder/BuilderUtils";

type EditForView =
  | {
      questionIndex: number;
      original: Question;
      draft: Question;
    }
  | null;

type Props = {
  theme: Theme;
  previewPaneRef: RefObject<HTMLDivElement | null>;
  pageWrapperRefs: RefObject<Array<HTMLDivElement | null>>;
  flashWarning: string | null;
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
  canAssignNewDraft: boolean;
  canSaveEdit: boolean;
  invalidCommitMessage: string;
};

export default function BuilderPreviewPane({
  theme,
  previewPaneRef,
  pageWrapperRefs,
  flashWarning,
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
  canAssignNewDraft,
  canSaveEdit,
  invalidCommitMessage,
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
        padding: "24px 18px 18px",
        background: theme.bgPage,
      }}
    >
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
              border: `1px solid ${theme.borderStandard}`,
              background: theme.accentSoft,
              color: theme.textPrimary,
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
              canAssignNewDraft={canAssignNewDraft}
              canSaveEdit={canSaveEdit}
              invalidCommitMessage={invalidCommitMessage}
              theme={theme}
            />
          ))}
        </div>
      </div>
    </div>
  );
}