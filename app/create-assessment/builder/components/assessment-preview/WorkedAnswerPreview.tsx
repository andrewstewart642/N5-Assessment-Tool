"use client";

import type {
  Question,
} from "@/shared-types/AssessmentTypes";

import PaperContent from "@/app/create-assessment/builder/components/assessment-preview/PaperContent";

import {
  UI_TYPO,
} from "@/app/ui/UiTypography";

import {
  QUESTION_COL_GAP_PX,
  QUESTION_MARKS_COL_PX,
  QUESTION_NUMBER_COL_PX,
} from "../../builder-definitions/BuilderConstants";

function splitAtFirstEquals(
  value: string
): {
  left: string;
  right: string;
} | null {
  const marker = " = ";
  const index = value.indexOf(marker);

  if (index < 0) {
    return null;
  }

  return {
    left: value.slice(0, index),
    right: value.slice(
      index + marker.length
    ),
  };
}

type Props = {
  question: Question;

  onMethodChange: (
    questionId: string,
    methodFamilyId: string
  ) => void;
};

export default function WorkedAnswerPreview({
  question,
  onMethodChange,
}: Props) {
  const answerSet =
    question.workedAnswers;

  if (
    !answerSet ||
    answerSet.methods.length === 0
  ) {
    return null;
  }

  const preferredMethod =
    question.preferredAnswerMethodFamilyId;

  const selectedMethod =
    answerSet.methods.find(
      (method) =>
        method.methodFamilyId ===
        preferredMethod
    ) ??
    answerSet.methods.find(
      (method) =>
        method.methodFamilyId ===
        answerSet.defaultMethodFamilyId
    ) ??
    answerSet.methods[0];

  const selectedIndex =
    answerSet.methods.findIndex(
      (method) =>
        method.methodFamilyId ===
        selectedMethod.methodFamilyId
    );

  const canCycle =
    answerSet.methods.length > 1;

  const cycleMethod = () => {
    if (!canCycle) {
      return;
    }

    const nextIndex =
      (selectedIndex + 1) %
      answerSet.methods.length;

    const nextMethod =
      answerSet.methods[nextIndex];

    onMethodChange(
      question.id,
      nextMethod.methodFamilyId
    );
  };

  return (
    <div
      style={{
        position: "absolute",

        top: 12,

        left:
          QUESTION_NUMBER_COL_PX +
          QUESTION_COL_GAP_PX,

        right:
          QUESTION_MARKS_COL_PX +
          QUESTION_COL_GAP_PX,

        fontFamily:
          UI_TYPO.family,

        color:
          "rgba(15, 23, 42, 0.56)",
      }}
    >
      {canCycle ? (
        <button
          type="button"
          aria-label="Cycle answer method"
          onClick={cycleMethod}
          style={{
            position: "absolute",

            top: 0,
            right: 0,

            height: 24,

            padding: "0 7px",

            border:
              "1px solid rgba(15,23,42,0.18)",

            borderRadius: 7,

            background:
              "rgba(255,255,255,0.78)",

            color:
              "rgba(15,23,42,0.58)",

            cursor: "pointer",

            fontFamily:
              UI_TYPO.family,

            fontSize: 10,

            fontWeight:
              UI_TYPO.weightSemibold,

            lineHeight: 1,

            whiteSpace: "nowrap",
          }}
        >
          Method ↻
        </button>
      ) : null}

      <div
        style={{
          display: "grid",

          gap: 7,

          paddingRight:
            canCycle
              ? 76
              : 0,

          fontSize: 13,

          fontWeight:
            UI_TYPO.weightMedium,

          lineHeight: 1.45,
        }}
      >
        <div
  style={{
    display: "table",
    borderCollapse: "separate",
    borderSpacing: "0 7px",
  }}
>
  {selectedMethod.lines.map(
    (line) => {
      const firstPart =
        line.parts[0];

      const equation =
        line.parts.length === 1 &&
        firstPart?.kind === "text"
          ? splitAtFirstEquals(
              firstPart.value
            )
          : null;

      if (equation) {
        return (
          <div
            key={line.id}
            style={{
              display: "table-row",
            }}
          >
            <div
              style={{
                display: "table-cell",
                textAlign: "right",
                whiteSpace: "nowrap",
                verticalAlign: "baseline",
              }}
            >
              {equation.left}
            </div>

            <div
              style={{
                display: "table-cell",
                paddingLeft: 5,
                paddingRight: 5,
                textAlign: "center",
                whiteSpace: "nowrap",
                verticalAlign: "baseline",
              }}
            >
              =
            </div>

            <div
              style={{
                display: "table-cell",
                whiteSpace: "nowrap",
                verticalAlign: "baseline",
              }}
            >
              {equation.right}
            </div>
          </div>
        );
      }

      return (
        <div
          key={line.id}
          style={{
            display: "table-row",
          }}
        >
          <div
            style={{
              display: "table-cell",
            }}
          >
            <PaperContent
              parts={line.parts}
            />
          </div>
        </div>
      );
    }
  )}
</div>
      </div>
    </div>
  );
}