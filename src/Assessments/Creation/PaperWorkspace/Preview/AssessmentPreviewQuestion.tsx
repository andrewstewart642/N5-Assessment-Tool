import MeasureBox from "@/app/create-assessment/builder/components/assessment-preview/MeasureBox";

import PaperQuestionDraft from "@/app/create-assessment/builder/components/assessment-preview/PaperQuestionDraft";

import PaperQuestionLocked from "@/app/create-assessment/builder/components/assessment-preview/PaperQuestionLocked";

import WorkedAnswerPreview from "@/app/create-assessment/builder/components/assessment-preview/WorkedAnswerPreview";

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
  globalIndex: number;

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
      <MeasureBox
        id={
          question.id
        }
        onMeasure={
          onMeasure
        }
      >
        <PaperQuestionDraft
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
      </MeasureBox>
    ) : kind ===
      "draft" ? (
      <MeasureBox
        id={
          question.id
        }
        onMeasure={
          onMeasure
        }
      >
        <PaperQuestionDraft
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
      </MeasureBox>
    ) : (
      <MeasureBox
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
          <PaperQuestionLocked
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
      </MeasureBox>
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