
import type {
  Question,
} from "@/app/Assessments/AssessmentTypes";

import type {
  PaperPart,
} from "@/app/Assessments/Questions/Content/PaperParts";

import {
  UI_TYPO,
} from "@/app/UI/Application/Typography/Typography";

import PaperContent from "@/app/UI/Documents/Components/PaperContent";

import {
  DRAFT_CONTROLS_GAP_PX,
  DRAFT_CONTROLS_HEIGHT_PX,
  QUESTION_COLUMN_GAP_PX,
  QUESTION_EDIT_BUTTON_RIGHT_PX,
  QUESTION_MARKS_COLUMN_PX,
  QUESTION_NUMBER_COLUMN_PX,
  QUESTION_TEXT_COLUMN_LEFT_PX,
} from "@/app/Assessments/Questions/Preview/QuestionPreviewLayout";

type QuestionDraftPreviewProps = {
  index:
    number;

  question:
    Question;

  primaryLabel:
    string;

  secondaryLabel:
    string;

  onPrimary:
    () => void;

  onSecondary:
    () => void;

  primaryDisabled?:
    boolean;

  primaryDisabledReason?:
    string;
};

function getQuestionMarks(
  question: Question
): number {
  if (
    typeof question.marks ===
      "number" &&
    Number.isFinite(
      question.marks
    )
  ) {
    return question.marks;
  }

  if (
    typeof question.targetMarks ===
      "number" &&
    Number.isFinite(
      question.targetMarks
    )
  ) {
    return question.targetMarks;
  }

  return 0;
}

function isPaperParts(
  value: unknown
): value is PaperPart[] {
  return (
    Array.isArray(
      value
    ) &&
    value.every(
      (
        part
      ) =>
        part &&
        typeof part ===
          "object" &&
        "kind" in
          (
            part as object
          )
    )
  );
}

export default function QuestionDraftPreview({
  index,
  question,
  primaryLabel,
  secondaryLabel,
  onPrimary,
  onSecondary,
  primaryDisabled = false,
  primaryDisabledReason,
}: QuestionDraftPreviewProps) {
  const marks =
    getQuestionMarks(
      question
    );

  const metadata = [
    question.concept,
    `${question.standardFilter}-standard`,
    marks
      ? `${marks} marks`
      : null,
    `Diff ${question.difficulty}`,
  ].filter(
    Boolean
  );

  const promptParts =
    (
      question as Question & {
        promptParts?:
          unknown;
      }
    ).promptParts;

  const answerParts =
    (
      question as Question & {
        answerParts?:
          unknown;
      }
    ).answerParts;

  return (
    <div
      style={{
        position:
          "relative",

        width:
          "100%",

        fontFamily:
          UI_TYPO.family,
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position:
            "absolute",

          top:
            6,

          right:
            QUESTION_EDIT_BUTTON_RIGHT_PX,

          zIndex:
            3,

          fontFamily:
            UI_TYPO.family,

          fontSize:
            11,

          fontWeight:
            UI_TYPO.weightSemibold,

          color:
            "rgba(15,23,42,0.55)",

          background:
            "rgba(255,255,255,0.75)",

          border:
            "1px solid rgba(15,23,42,0.18)",

          borderRadius:
            999,

          padding:
            "5px 9px",

          lineHeight:
            1,

          userSelect:
            "none",

          pointerEvents:
            "none",
        }}
        title="Draft mode"
      >
        Draft
      </div>

      <div
        style={{
          outline:
            "2px solid rgba(147,197,253,0.28)",

          outlineOffset:
            6,

          borderRadius:
            8,

          paddingBottom:
            DRAFT_CONTROLS_HEIGHT_PX +
            DRAFT_CONTROLS_GAP_PX,
        }}
      >
        <div
          style={{
            display:
              "grid",

            gridTemplateColumns:
              `${QUESTION_NUMBER_COLUMN_PX}px 1fr ${QUESTION_MARKS_COLUMN_PX}px`,

            columnGap:
              QUESTION_COLUMN_GAP_PX,

            alignItems:
              "start",
          }}
        >
          <div
            style={{
              fontFamily:
                UI_TYPO.family,

              fontWeight:
                UI_TYPO.weightSemibold,

              fontSize:
                14,

              lineHeight:
                1.25,
            }}
          >
            {index}.
          </div>

          <div
            style={{
              display:
                "grid",

              gap:
                6,

              fontFamily:
                UI_TYPO.family,
            }}
          >
            <div
              style={{
                fontFamily:
                  UI_TYPO.family,

                fontSize:
                  14,

                fontWeight:
                  UI_TYPO.weightMedium,

                lineHeight:
                  1.4,
              }}
            >
              {isPaperParts(
                promptParts
              ) ? (
                <PaperContent
                  parts={
                    promptParts
                  }
                />
              ) : (
                <span>
                  {question.prompt ??
                    `${question.skillCode} — ${question.skillText}`}
                </span>
              )}
            </div>

            <div
              className="builder-question-answer"
              style={{
                fontFamily:
                  UI_TYPO.family,

                fontSize:
                  13,

                fontWeight:
                  UI_TYPO.weightMedium,

                opacity:
                  0.85,

                lineHeight:
                  1.35,
              }}
            >
              Answer:{" "}
              <span
                style={{
                  fontWeight:
                    UI_TYPO.weightSemibold,

                  opacity:
                    1,
                }}
              >
                {isPaperParts(
                  answerParts
                ) ? (
                  <PaperContent
                    parts={
                      answerParts
                    }
                  />
                ) : (
                  <span>
                    {question.answer ??
                      ""}
                  </span>
                )}
              </span>
            </div>

            <div
              style={{
                fontFamily:
                  UI_TYPO.family,

                fontSize:
                  10,

                fontWeight:
                  UI_TYPO.weightMedium,

                opacity:
                  0.55,

                lineHeight:
                  1.3,
              }}
            >
              {metadata.join(
                " • "
              )}
            </div>
          </div>

          <div
            style={{
              textAlign:
                "right",

              fontFamily:
                UI_TYPO.family,

              fontWeight:
                UI_TYPO.weightSemibold,

              fontSize:
                12,

              opacity:
                0.65,

              lineHeight:
                1.2,
            }}
          >
            {marks
              ? `(${marks})`
              : null}
          </div>
        </div>
      </div>

      <div
        style={{
          position:
            "absolute",

          left:
            QUESTION_TEXT_COLUMN_LEFT_PX,

          bottom:
            6,

          display:
            "flex",

          gap:
            8,

          alignItems:
            "center",

          zIndex:
            3,
        }}
      >
        <button
          type="button"
          onClick={
            onPrimary
          }
          disabled={
            primaryDisabled
          }
          aria-disabled={
            primaryDisabled
          }
          style={{
            border:
              primaryDisabled
                ? "1px solid rgba(15,23,42,0.14)"
                : "1px solid rgba(255,255,255,0.18)",

            background:
              primaryDisabled
                ? "rgba(203,213,225,0.75)"
                : "rgba(147,197,253,0.92)",

            color:
              primaryDisabled
                ? "rgba(71,85,105,0.82)"
                : "rgba(30,58,138,0.95)",

            borderRadius:
              10,

            padding:
              "6px 10px",

            cursor:
              primaryDisabled
                ? "not-allowed"
                : "pointer",

            fontFamily:
              UI_TYPO.family,

            fontWeight:
              UI_TYPO.weightSemibold,

            fontSize:
              12,

            height:
              32,

            opacity:
              primaryDisabled
                ? 0.82
                : 1,
          }}
          title={
            primaryDisabled
              ? primaryDisabledReason ??
                primaryLabel
              : primaryLabel
          }
        >
          {primaryLabel}
        </button>

        <button
          type="button"
          onClick={
            onSecondary
          }
          style={{
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

            fontFamily:
              UI_TYPO.family,

            fontWeight:
              UI_TYPO.weightMedium,

            fontSize:
              12,

            height:
              32,
          }}
          title={
            secondaryLabel
          }
        >
          {secondaryLabel}
        </button>
      </div>
    </div>
  );
}