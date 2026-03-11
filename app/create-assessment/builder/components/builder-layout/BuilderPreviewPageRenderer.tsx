"use client";

import SQAPageFrame from "@/app/create-assessment/builder/components/assessment-paper-layout/SQAPageFrame";
import SQAN5FormulaSheet from "@/app/create-assessment/builder/components/assessment-paper-layout/SQAN5FormulaSheet";
import SQAN5CoverPage from "@/app/create-assessment/builder/components/assessment-paper-layout/SQAN5CoverPage";
import PaperQuestionLocked from "@/app/create-assessment/builder/components/assessment-preview/PaperQuestionLocked";
import PaperQuestionDraft from "@/app/create-assessment/builder/components/assessment-preview/PaperQuestionDraft";
import MeasureBox from "@/app/create-assessment/builder/components/assessment-preview/MeasureBox";
import { UI_TEXT } from "@/app/ui/UiTypography";
import { getTheme } from "@/app/ui/AppTheme";
import type { Paper, Question } from "@/shared-types/AssessmentTypes";
import {
  spacingBasePxFor,
  type PreviewPage,
} from "@/app/create-assessment/builder/BuilderUtils";

type Theme = ReturnType<typeof getTheme>;

type EditForView =
  | {
      questionIndex: number;
      original: Question;
      draft: Question;
    }
  | null;

type Props = {
  previewPage: PreviewPage;
  previewIndex: number;
  viewPaper: Paper;
  pageWrapperRefs: React.RefObject<Array<HTMLDivElement | null>>;
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
  theme: Theme;
};

export default function BuilderPreviewPageRenderer({
  previewPage,
  previewIndex,
  viewPaper,
  pageWrapperRefs,
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
  theme,
}: Props) {
  if (previewPage.kind === "cover") {
    return (
      <div
        ref={(el) => {
          pageWrapperRefs.current[previewIndex] = el;
        }}
      >
        <SQAN5CoverPage
          pageNumber={previewPage.pageNumber}
          paper={viewPaper}
          totalMarks={activePaperCoverMarks}
          showDateTime={showCoverDateTime}
          dateText={coverDateTextForView}
          timeText={coverTimeTextForView}
          showScottishCandidateNumberBox={showScottishCandidateNumberBox}
          viewerScale={viewerScale}
          outerPaddingPx={0}
        />
      </div>
    );
  }

  if (previewPage.kind === "formula") {
    return (
      <div
        ref={(el) => {
          pageWrapperRefs.current[previewIndex] = el;
        }}
      >
        <SQAN5FormulaSheet
          pageNumber={previewPage.pageNumber}
          viewerScale={viewerScale}
          outerPaddingPx={0}
        />
      </div>
    );
  }

  if (previewPage.kind === "empty") {
    return (
      <div
        ref={(el) => {
          pageWrapperRefs.current[previewIndex] = el;
        }}
      >
        <SQAPageFrame
          viewerScale={viewerScale}
          outerPaddingPx={0}
          paper={viewPaper}
          pageIndex={0}
          footerPageNumber={previewPage.pageNumber}
          footerLabelMode="sqa-lower"
          isFirstQuestionPage={!includeCoverSheet && !includeFormulaSheet}
        >
          <div
            style={{
              marginTop: 10,
              border: "1px dashed rgba(15,23,42,0.25)",
              borderRadius: 8,
              padding: 14,
              color: "rgba(15,23,42,0.65)",
              ...UI_TEXT.controlTextStrong,
            }}
          >
            No questions added yet for {viewPaper === "P1" ? "Paper 1" : "Paper 2"}.
          </div>
        </SQAPageFrame>
      </div>
    );
  }

  return (
    <div
      ref={(el) => {
        pageWrapperRefs.current[previewIndex] = el;
      }}
    >
      <SQAPageFrame
        viewerScale={viewerScale}
        outerPaddingPx={0}
        paper={viewPaper}
        pageIndex={previewPage.questionPageIndex}
        footerPageNumber={previewPage.pageNumber}
        footerLabelMode="sqa-lower"
        isFirstQuestionPage={previewPage.questionPageIndex === 0}
        showTurnOver
      >
        <div style={{ display: "grid", gap: 2 }}>
          {previewPage.pageQuestions.map((layoutQ, i) => {
            const globalIndex = previewPage.questionStartIndex + i;

            const render = renderById.get(layoutQ.id);
            const kind = render?.kind ?? "locked";
            const q = render?.q ?? layoutQ;

            let gapPx = spacingBasePxFor(q);
            if (kind === "edit" && editForView) {
              gapPx = spacingBasePxFor(editForView.original);
            }

            const content =
              kind === "edit" ? (
                <MeasureBox id={q.id} onMeasure={onMeasure}>
                  <PaperQuestionDraft
                    index={globalIndex}
                    question={q}
                    primaryLabel="Save"
                    secondaryLabel="Remove"
                    onPrimary={saveEdit}
                    onSecondary={removeWhileEditing}
                  />
                </MeasureBox>
              ) : kind === "draft" ? (
                <MeasureBox id={q.id} onMeasure={onMeasure}>
                  <PaperQuestionDraft
                    index={globalIndex}
                    question={q}
                    primaryLabel="Assign"
                    secondaryLabel="Remove"
                    onPrimary={assignNewDraft}
                    onSecondary={removeNewDraft}
                  />
                </MeasureBox>
              ) : (
                <MeasureBox id={q.id} onMeasure={onMeasure}>
                  <div style={{ position: "relative" }}>
                    <PaperQuestionLocked index={globalIndex} question={q} />
                    <button
                      type="button"
                      onClick={() => startEditLockedQuestion(q.id)}
                      style={{
                        position: "absolute",
                        top: 6,
                        right: 86,
                        border: "1px solid rgba(15,23,42,0.25)",
                        background: "rgba(255,255,255,0.70)",
                        color: "rgba(15,23,42,0.75)",
                        borderRadius: 10,
                        padding: "6px 10px",
                        cursor: "pointer",
                        height: 32,
                        ...UI_TEXT.buttonTextSmall,
                      }}
                      title="Edit"
                    >
                      Edit
                    </button>
                  </div>
                </MeasureBox>
              );

            return (
              <div key={`${kind}-${layoutQ.id}`}>
                {content}
                <div aria-hidden="true" style={{ height: gapPx }} />
              </div>
            );
          })}
        </div>
      </SQAPageFrame>
    </div>
  );
}