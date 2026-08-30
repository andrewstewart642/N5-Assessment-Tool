import QuestionMeasureBox from "../../Questions/Preview/QuestionHeightMeasurement";

import QuestionDraftPreview from "../../Questions/Preview/DraftQuestion";

import QuestionLockedPreview from "@/app/Assessments/Questions/Preview/QuestionLockedPreview";

import WorkedAnswerPreview from "../../Questions/Preview/WorkedAnswer";

import type {
  Question,
} from "@/app/Assessments/AssessmentTypes";

import {
  UI_TEXT,
} from "@/app/UI/Application/Typography/Typography";

import type {
  AssessmentEditQuestionDraft,
} from "../../Questions/DraftTypes";

import {
  getAssessmentQuestionSpacingBasePx,
} from "../../Questions/Spacing";

import type {
  AssessmentPreviewRenderById,
} from "./PageData";

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

            zIndex:
              1,
          }}
        >
          {/*
           * Locked paper content is display-only in the Builder. Keeping it
           * out of the pointer hit-test guarantees that the floating Edit
           * control remains the interactive surface even when rich prompt
           * parts/graphs introduce their own rendered layers.
           */}
          <div
            style={{
              pointerEvents:
                "none",
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
          </div>

          <button
            type="button"
            data-preview-edit-control="true"
            onPointerDown={(
              event
            ) => {
              event.stopPropagation();
            }}
            onClick={(
              event
            ) => {
              event.preventDefault();
              event.stopPropagation();

              startEditLockedQuestion(
                question.id
              );
            }}
            style={{
              position:
                "absolute",

              top:
                6,

              right:
                86,

              zIndex:
                100,

              pointerEvents:
                "auto",

              touchAction:
                "manipulation",

              border:
                "1px solid rgba(15,23,42,0.25)",

              background:
                "rgba(255,255,255,0.82)",

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
        {showWorkedAnswers &&
        kind !== "edit" ? (
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