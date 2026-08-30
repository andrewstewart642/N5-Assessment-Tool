import {
  getNational5MathsQuestionSpacingBasePx,
} from "@/app/Courses/National5Maths/Documents/National5MathsQuestionSpacing";

import type {
  Question,
} from "@/app/Assessments/AssessmentTypes";

const DEFAULT_ASSESSMENT_QUESTION_SPACING_BASE_PX =
  48;

function isA8GeneratedQuestion(
  question: Question
): boolean {
  return Boolean(
    question.questionCode?.startsWith(
      "A8-"
    )
  );
}

export function getAssessmentQuestionSpacingBasePx(
  question: Question
): number {
  /*
   * A8 originally entered the Builder while its unique instance ids still fell
   * through to the generic 40 px National 5 spacing fallback. Some already
   * assigned/drafted A8 questions therefore carry that stale spacingBasePx.
   * Resolve A8 from its stable family-bearing questionCode first so existing
   * questions repair themselves as soon as the workspace re-renders.
   */
  if (
    isA8GeneratedQuestion(
      question
    ) &&
    question.questionCode
  ) {
    return getNational5MathsQuestionSpacingBasePx(
      question.questionCode
    );
  }

  const spacingBasePx =
    question.spacingBasePx;

  if (
    typeof spacingBasePx ===
      "number" &&
    Number.isFinite(
      spacingBasePx
    )
  ) {
    return spacingBasePx;
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
    isA8GeneratedQuestion(
      question
    )
  ) {
    return applyAssessmentQuestionSpacingBase(
      question
    );
  }

  if (
    typeof question.spacingBasePx ===
      "number" &&
    Number.isFinite(
      question.spacingBasePx
    )
  ) {
    return question;
  }

  return applyAssessmentQuestionSpacingBase(
    question
  );
}
