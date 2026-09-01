import {
  getNational5MathsQuestionSpacingBasePx,
} from "@/app/Courses/National5Maths/Documents/National5MathsQuestionSpacing";

import type {
  Question,
} from "@/app/Assessments/AssessmentTypes";

const DEFAULT_ASSESSMENT_QUESTION_SPACING_BASE_PX =
  48;

const STALE_A8_SPACING_BASE_PX =
  40;

function isA8GeneratedQuestion(
  question: Question
): boolean {
  return Boolean(
    question.questionCode?.startsWith(
      "A8-"
    )
  );
}

function getA7GeneratedSpacingBasePx(
  questionCode: string | undefined
): number | null {
  if (!questionCode?.startsWith("A7-")) {
    return null;
  }

  /*
   * These baselines do two jobs in the Builder: preserve plausible pupil
   * working space and give the optional worked-answer overlay enough room not
   * to collide with the next question. The five-mark context route naturally
   * needs more vertical working than the three-mark fractional route.
   */
  return questionCode.includes("-CONTEXT-AREA-")
    ? 150
    : 104;
}

function hasExplicitSpacingBasePx(
  question: Question
): question is Question & {
  spacingBasePx: number;
} {
  return (
    typeof question.spacingBasePx ===
      "number" &&
    Number.isFinite(
      question.spacingBasePx
    )
  );
}

export function getAssessmentQuestionSpacingBasePx(
  question: Question
): number {
  const isA8 =
    isA8GeneratedQuestion(
      question
    );

  if (
    hasExplicitSpacingBasePx(
      question
    )
  ) {
    if (
      !isA8 ||
      question.spacingBasePx !==
        STALE_A8_SPACING_BASE_PX
    ) {
      return question.spacingBasePx;
    }
  }

  const a7Spacing =
    getA7GeneratedSpacingBasePx(
      question.questionCode
    );

  if (a7Spacing !== null) {
    return a7Spacing;
  }

  if (
    isA8 &&
    question.questionCode
  ) {
    return getNational5MathsQuestionSpacingBasePx(
      question.questionCode
    );
  }

  return question.questionCode
    ? getNational5MathsQuestionSpacingBasePx(
        question.questionCode
      )
    : DEFAULT_ASSESSMENT_QUESTION_SPACING_BASE_PX;
}

export function applyAssessmentQuestionSpacingBase(
  question: Question
): Question {
  const a7Spacing =
    getA7GeneratedSpacingBasePx(
      question.questionCode
    );

  return {
    ...question,

    spacingBasePx:
      a7Spacing ??
      (
        question.questionCode
          ? getNational5MathsQuestionSpacingBasePx(
              question.questionCode
            )
          : DEFAULT_ASSESSMENT_QUESTION_SPACING_BASE_PX
      ),
  };
}

export function ensureAssessmentQuestionSpacingBase(
  question: Question
): Question {
  if (
    hasExplicitSpacingBasePx(
      question
    ) &&
    (
      !isA8GeneratedQuestion(
        question
      ) ||
      question.spacingBasePx !==
        STALE_A8_SPACING_BASE_PX
    )
  ) {
    return question;
  }

  return applyAssessmentQuestionSpacingBase(
    question
  );
}
