import QuestionMeasureBox from "../../Questions/Preview/QuestionMeasureBox";

import QuestionDraftPreview from "../../Questions/Preview/QuestionDraftPreview";

import QuestionLockedPreview from "@/src/Assessments/Questions/Preview/QuestionLockedPreview";

import WorkedAnswerPreview from "../../Questions/Preview/WorkedAnswerPreview";

import type {
  Question,
} from "@/shared-types/AssessmentTypes";

import {
  UI_TEXT,
} from "@/src/UI/Application/Typography/Typography";

import type {
  AssessmentEditQuestionDraft,
} from "../../Questions/AssessmentQuestionDraftTypes";

import {
  getAssessmentQuestionSpacingBasePx,
} from "../../Questions/AssessmentQuestionSpacing";

import type {
  AssessmentPreviewRenderById,
} from "./AssessmentPreviewTypes";

type AssessmentPreviewQuestionProps = {
  globalIndex:
    number;

  layoutQuestion:
    Question;

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

export default function AssessmentPreviewQuestion({
  globalIndex,
  layoutQuestion,
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
}: AssessmentPreviewQuestionProps) {
  const render =
    renderById.get(
      layoutQuestion.id
    );

  const kind =
    render?.kind ??
    "locked";

  const question =
    render?.q ??
    layoutQuestion;

  let gapPx =
    getAssessmentQuestionSpacingBasePx(
      question
    );

  if (
    kind === "edit" &&
    editForView
  ) {
    gapPx =
      getAssessmentQuestionSpacingBasePx(
        editForView.original
      );
  }

  const content =
    kind === "edit" ? (
      <QuestionMeasureBox
        id={
          question.id
        }
        onMeasure={
          onMeasure
        }
      >
        <QuestionDraftPreview
          index={
            globalIndex
          }
          question={
            question
          }
          primaryLabel="Save"
          secondaryLabel="Remove"
          onPrimary={
            saveEdit
          }
          onSecondary={
            removeWhileEditing
          }
          primaryDisabled={
            !canSaveEdit
          }
          primaryDisabledReason={
            invalidCommitMessage
          }
        />
      </QuestionMeasureBox>
    ) : kind ===
      "draft" ? (
      <QuestionMeasureBox
        id={
          question.id
        }
        onMeasure={
          onMeasure
        }
      >
        <QuestionDraftPreview
          index={
            globalIndex
          }
          question={
            question
          }
          primaryLabel="Assign"
          secondaryLabel="Remove"
          onPrimary={
            assignNewDraft
          }
          onSecondary={
            removeNewDraft
          }
          primaryDisabled={
            !canAssignNewDraft
          }
          primaryDisabledReason={
            invalidCommitMessage
          }
        />
      </QuestionMeasureBox>
    ) : (
      <QuestionMeasureBox
        id={
          question.id
        }
        onMeasure={
          onMeasure
        }
      >
        <div
          style={{
            position:
              "relative",
          }}
        >
          <QuestionLockedPreview
            index={
              globalIndex
            }
            question={
              question
            }
          />

          <button
            type="button"
            onClick={() =>
              startEditLockedQuestion(
                question.id
              )
            }
            style={{
              position:
                "absolute",

              top:
                6,

              right:
                86,

              border:
                "1px solid rgba(15,23,42,0.25)",

              background:
                "rgba(255,255,255,0.70)",

              color:
                "rgba(15,23,42,0.75)",

              borderRadius:
                10,

              padding:
                "6px 10px",

              cursor:
                "pointer",

              height:
                32,

              ...UI_TEXT.buttonTextSmall,
            }}
            title="Edit"
          >
            Edit
          </button>
        </div>
      </QuestionMeasureBox>
    );

  return (
    <div
      data-preview-question-id={
        question.id
      }
    >
      {content}

      <div
        style={{
          height:
            gapPx,

          position:
            "relative",
        }}
      >
        {showWorkedAnswers ? (
          <WorkedAnswerPreview
            question={
              question
            }
            onMethodChange={
              onPreferredAnswerMethodChange
            }
          />
        ) : null}
      </div>
    </div>
  );
}