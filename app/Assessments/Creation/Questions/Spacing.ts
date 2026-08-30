import {
  getNational5MathsQuestionSpacingBasePx,
} from "@/app/Courses/National5Maths/Documents/National5MathsQuestionSpacing";

import type {
  Question,
} from "@/app/Assessments/AssessmentTypes";

const DEFAULT_ASSESSMENT_QUESTION_SPACING_BASE_PX =
  48;

/*
 * Before A8 had family-aware response-space baselines, clean A8 questions
 * were committed with the National 5 document fallback of 40 px. Treat that
 * one value as stale historical workspace state. Other explicit values are
 * intentional preview/state overrides and must be respected (notably the
 * 24 px Compact-mode spacing).
 */
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

  /*
   * Repair only the stale A8 40 px value (or a missing value). Compact mode
   * supplies its own 24 px preview override, which now flows through normally.
   */
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
  return {
    ...question,

    spacingBasePx:
      question.questionCode
        ? getNational5MathsQuestionSpacingBasePx(
            question.questionCode
          )
        : DEFAULT_ASSESSMENT_QUESTION_SPACING_BASE_PX,
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