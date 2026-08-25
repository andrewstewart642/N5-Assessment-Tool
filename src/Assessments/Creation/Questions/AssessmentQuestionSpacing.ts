import type {
  Question,
} from "@/shared-types/AssessmentTypes";

import {
  getBuilderQuestionSpacingBasePx,
} from "@/app/create-assessment/builder/builder-logic/BuilderQuestionSpacing";

export function getAssessmentQuestionSpacingBasePx(
  question: Question
): number {
  const spacingBasePx =
    (question as any)
      .spacingBasePx;

  if (
    typeof spacingBasePx ===
      "number" &&
    Number.isFinite(
      spacingBasePx
    )
  ) {
    return spacingBasePx;
  }

  return getBuilderQuestionSpacingBasePx(
    (question as any)
      .questionCode
  );
}