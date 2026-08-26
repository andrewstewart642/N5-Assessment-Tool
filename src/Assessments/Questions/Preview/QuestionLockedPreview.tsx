"use client";

import type {
  Question,
} from "@/src/Assessments/AssessmentTypes";

import type {
  PaperPart,
} from "@/src/Assessments/Questions/Content/PaperParts";

import {
  UI_TYPO,
} from "@/src/UI/Application/Typography/Typography";

import PaperContent from "@/src/UI/Documents/Components/PaperContent";

import {
  QUESTION_COLUMN_GAP_PX,
  QUESTION_MARKS_COLUMN_PX,
  QUESTION_NUMBER_COLUMN_PX,
} from "./QuestionPreviewLayout";

type QuestionLockedPreviewProps = {
  index:
    number;

  question:
    Question;
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

export default function QuestionLockedPreview({
  index,
  question,
}: QuestionLockedPreviewProps) {
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

        fontFamily:
          UI_TYPO.family,
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
  );
}