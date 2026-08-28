import type {
  RefObject,
} from "react";

import {
  National5MathsCourseDocuments,
} from "@/app/Courses/National5Maths/Documents/CourseDocuments";

import type {
  Paper,
} from "@/app/Assessments/AssessmentTypes";

import {
  UI_TEXT,
} from "@/app/UI/Application/Typography/Typography";

import type {
  AssessmentEditQuestionDraft,
} from "../../Questions/DraftTypes";

import AssessmentPreviewQuestionPage from "./QuestionPage";

import type {
  AssessmentPreviewPage,
  AssessmentPreviewRenderById,
} from "./PageData";

const National5MathsCoverPage =
  National5MathsCourseDocuments.CoverPage;

const National5MathsFormulaSheet =
  National5MathsCourseDocuments.FormulaSheet;

const National5MathsQuestionPage =
  National5MathsCourseDocuments.QuestionPage;

type AssessmentPreviewPageRendererProps = {
  previewPage:
    AssessmentPreviewPage;

  previewIndex:
    number;

  viewPaper:
    Paper;

  pageWrapperRefs:
    RefObject<
      Array<
        HTMLDivElement | null
      >
    >;

  viewerScale:
    number;

  activePaperCoverMarks:
    number;

  showCoverDateTime:
    boolean;

  coverDateTextForView:
    string;

  coverTimeTextForView:
    string;

  printSubjectName:
    string;

  printQualificationBadge:
    string;

  printQualificationLabelLines:
    string[];

  paperPrintTitle:
    string;

  paperCoverInstructionText:
    string;

  showNoCalculatorIcon:
    boolean;

  showScottishCandidateNumberBox:
    boolean;

  includeCoverSheet:
    boolean;

  includeFormulaSheet:
    boolean;

  renderById:
    AssessmentPreviewRenderById;

  editForView:
    AssessmentEditQuestionDraft;

  onMeasure: (
    id: string,
    heightPx: number
  ) => void;

  saveEdit:
    () => void;

  removeWhileEditing:
    () => void;

  assignNewDraft:
    () => void;

  removeNewDraft:
    () => void;

  startEditLockedQuestion: (
    questionId: string
  ) => void;

  canAssignNewDraft:
    boolean;

  canSaveEdit:
    boolean;

  invalidCommitMessage:
    string;

  showWorkedAnswers:
    boolean;

  onPreferredAnswerMethodChange: (
    questionId: string,
    methodFamilyId: string
  ) => void;
};

export default function AssessmentPreviewPageRenderer({
  previewPage,
  previewIndex,
  viewPaper,
  pageWrapperRefs,
  viewerScale,
  activePaperCoverMarks,
  showCoverDateTime,
  coverDateTextForView,
  coverTimeTextForView,
  printSubjectName,
  printQualificationBadge,
  printQualificationLabelLines,
  paperPrintTitle,
  paperCoverInstructionText,
  showNoCalculatorIcon,
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
  showWorkedAnswers,
  onPreferredAnswerMethodChange,
}: AssessmentPreviewPageRendererProps) {
  if (
    previewPage.kind ===
    "cover"
  ) {
    return (
      <div
        ref={(
          element
        ) => {
          pageWrapperRefs.current[
            previewIndex
          ] =
            element;
        }}
      >
        <National5MathsCoverPage
          pageNumber={
            previewPage.pageNumber
          }
          paper={
            viewPaper
          }
          totalMarks={
            activePaperCoverMarks
          }
          showDateTime={
            showCoverDateTime
          }
          dateText={
            coverDateTextForView
          }
          timeText={
            coverTimeTextForView
          }
          subjectName={
            printSubjectName
          }
          qualificationBadge={
            printQualificationBadge
          }
          qualificationLabelLines={
            printQualificationLabelLines
          }
          paperTitle={
            paperPrintTitle
          }
          coverInstructionText={
            paperCoverInstructionText
          }
          showNoCalculatorIcon={
            showNoCalculatorIcon
          }
          showScottishCandidateNumberBox={
            showScottishCandidateNumberBox
          }
          viewerScale={
            viewerScale
          }
          outerPaddingPx={
            0
          }
        />
      </div>
    );
  }

  if (
    previewPage.kind ===
    "formula"
  ) {
    return (
      <div
        ref={(
          element
        ) => {
          pageWrapperRefs.current[
            previewIndex
          ] =
            element;
        }}
      >
        <National5MathsFormulaSheet
          pageNumber={
            previewPage.pageNumber
          }
          viewerScale={
            viewerScale
          }
          outerPaddingPx={
            0
          }
        />
      </div>
    );
  }

  if (
    previewPage.kind ===
    "empty"
  ) {
    return (
      <div
        ref={(
          element
        ) => {
          pageWrapperRefs.current[
            previewIndex
          ] =
            element;
        }}
      >
        <National5MathsQuestionPage
          paper={
            viewPaper
          }
          pageNumber={
            previewPage.pageNumber
          }
          isFirstQuestionPage={
            !includeCoverSheet &&
            !includeFormulaSheet
          }
          viewerScale={
            viewerScale
          }
          outerPaddingPx={
            0
          }
          showTurnOver={
            false
          }
        >
          <div
            style={{
              marginTop:
                10,

              border:
                "1px dashed rgba(15,23,42,0.25)",

              borderRadius:
                8,

              padding:
                14,

              color:
                "rgba(15,23,42,0.65)",

              ...UI_TEXT.controlTextStrong,
            }}
          >
            No questions added yet for{" "}
            {paperPrintTitle}.
          </div>
        </National5MathsQuestionPage>
      </div>
    );
  }

  return (
    <AssessmentPreviewQuestionPage
      previewPage={
        previewPage
      }
      previewIndex={
        previewIndex
      }
      viewPaper={
        viewPaper
      }
      pageWrapperRefs={
        pageWrapperRefs
      }
      viewerScale={
        viewerScale
      }
      renderById={
        renderById
      }
      editForView={
        editForView
      }
      onMeasure={
        onMeasure
      }
      saveEdit={
        saveEdit
      }
      removeWhileEditing={
        removeWhileEditing
      }
      assignNewDraft={
        assignNewDraft
      }
      removeNewDraft={
        removeNewDraft
      }
      startEditLockedQuestion={
        startEditLockedQuestion
      }
      canAssignNewDraft={
        canAssignNewDraft
      }
      canSaveEdit={
        canSaveEdit
      }
      invalidCommitMessage={
        invalidCommitMessage
      }
      showWorkedAnswers={
        showWorkedAnswers
      }
      onPreferredAnswerMethodChange={
        onPreferredAnswerMethodChange
      }
    />
  );
}