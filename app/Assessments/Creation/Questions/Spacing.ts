import {
  getNational5MathsQuestionSpacingBasePx,
} from "@/app/Courses/National5Maths/Documents/National5MathsQuestionSpacing";

import type {
  Question,
} from "@/app/Assessments/AssessmentTypes";

const DEFAULT_ASSESSMENT_QUESTION_SPACING_BASE_PX =
  48;

export function getAssessmentQuestionSpacingBasePx(
  question: Question
): number {
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