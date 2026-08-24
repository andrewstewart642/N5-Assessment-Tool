import { getSpacingBasePx } from "@/app/paper-layout/N5-Question-Spacing-px";
import type { Question } from "@/shared-types/AssessmentTypes_TEMP";
import { DEFAULT_QUESTION_SPACING_BASE_PX } from "../builder-definitions/BuilderConstants";

export function getBuilderQuestionSpacingBasePx(
  questionCode?: string | null
): number {
  return questionCode
    ? getSpacingBasePx(questionCode)
    : DEFAULT_QUESTION_SPACING_BASE_PX;
}

export function applyBuilderQuestionSpacingBase(question: Question): Question {
  return {
    ...question,
    spacingBasePx: getBuilderQuestionSpacingBasePx(question.questionCode),
  };
}

export function ensureBuilderQuestionSpacingBase(question: Question): Question {
  if (
    typeof question.spacingBasePx === "number" &&
    Number.isFinite(question.spacingBasePx)
  ) {
    return question;
  }

  return applyBuilderQuestionSpacingBase(question);
}