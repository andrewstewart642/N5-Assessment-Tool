import type {
  RefObject,
} from "react";

import {
  National5MathsCourseDocuments,
} from "@/app/Courses/National5Maths/Documents/CourseDocuments";

import type {
  Paper,
} from "@/app/Assessments/AssessmentTypes";

import type {
  AssessmentEditQuestionDraft,
} from "../../Questions/AssessmentQuestionDraftTypes";

import AssessmentPreviewQuestion from "./AssessmentPreviewQuestion";

import type {
  AssessmentPreviewPage,
  AssessmentPreviewRenderById,
} from "./AssessmentPreviewTypes";

const National5MathsQuestionPage =
  National5MathsCourseDocuments.QuestionPage;

type QuestionPreviewPage =
  Extract<
    AssessmentPreviewPage,
    {
      kind:
        "questions";
    }
  >;

type AssessmentPreviewQuestionPageProps = {
  previewPage:
    QuestionPreviewPage;

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

export default function AssessmentPreviewQuestionPage({
  previewPage,
  previewIndex,
  viewPaper,
  pageWrapperRefs,
  viewerScale,
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
}: AssessmentPreviewQuestionPageProps) {
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
          previewPage.questionPageIndex ===
          0
        }
        viewerScale={
          viewerScale
        }
        outerPaddingPx={
          0
        }
        showTurnOver
      >
        <div
          style={{
            display:
              "grid",

            gap:
              2,
          }}
        >
          {previewPage.pageQuestions.map(
            (
              layoutQuestion,
              index
            ) => {
              const globalIndex =
                previewPage.questionStartIndex +
                index;

              const render =
                renderById.get(
                  layoutQuestion.id
                );

              const kind =
                render?.kind ??
                "locked";

              return (
                <AssessmentPreviewQuestion
                  key={`${kind}-${layoutQuestion.id}`}
                  globalIndex={
                    globalIndex
                  }
                  layoutQuestion={
                    layoutQuestion
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
          )}
        </div>
      </National5MathsQuestionPage>
    </div>
  );
}