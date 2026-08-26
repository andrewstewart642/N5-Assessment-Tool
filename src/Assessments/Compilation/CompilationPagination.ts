import type {
  Question,
} from "@/shared-types/AssessmentTypes";

import type {
  CompilationPageSizeConfig,
} from "@/src/Assessments/Compilation/CompilationPageSizes";

import {
  getNational5MathsQuestionSpacingBasePx,
} from "@/src/Courses/National5Maths/Documents/National5MathsQuestionSpacing";

/**
 * Fallback heuristic used only when a measured
 * question height is unavailable.
 *
 * Measured heights remain authoritative whenever present.
 */
function estimateQuestionHeightBasePx(
  question: Question
): number {
  const promptLength =
    (question.prompt ?? "").length;

  const answerLength =
    (question.answer ?? "").length;

  const promptLines =
    Math.max(
      1,
      Math.ceil(
        promptLength / 70
      )
    );

  const answerLines =
    answerLength
      ? Math.max(
          1,
          Math.ceil(
            answerLength / 80
          )
        )
      : 0;

  const header = 34;

  const promptBlock =
    20 +
    promptLines * 18;

  const answerBlock =
    answerLines
      ? 18 +
        answerLines * 16
      : 0;

  const metadata = 14;

  return (
    header +
    promptBlock +
    answerBlock +
    metadata
  );
}

function getMeasuredHeightBasePx(
  question: Question
): number | null {
  const measuredHeight =
    (
      question as Question & {
        measuredHeightBasePx?:
          unknown;
      }
    ).measuredHeightBasePx;

  if (
    typeof measuredHeight ===
      "number" &&
    Number.isFinite(
      measuredHeight
    ) &&
    measuredHeight > 0
  ) {
    return measuredHeight;
  }

  return null;
}

/**
 * Returns the working-space requirement beneath
 * a question at the A4 baseline.
 *
 * Persisted question spacing remains authoritative.
 *
 * The National 5 Maths lookup preserves the existing
 * fallback behaviour for questions which predate
 * persisted spacing metadata. Course-definition work
 * can later make this fallback course-resolved.
 */
function getWorkspaceBasePx(
  question: Question
): number {
  if (
    typeof question.spacingBasePx ===
      "number" &&
    Number.isFinite(
      question.spacingBasePx
    ) &&
    question.spacingBasePx >= 0
  ) {
    return question.spacingBasePx;
  }

  if (!question.questionCode) {
    return 48;
  }

  return getNational5MathsQuestionSpacingBasePx(
    question.questionCode
  );
}

/**
 * Pagination treats each question and its working space
 * as one atomic block:
 *
 * block height =
 * question content height + working-space height
 *
 * A block is never intentionally split across pages.
 *
 * If one block is taller than a complete page, it is
 * still placed on that page so pagination cannot enter
 * an infinite loop.
 */
export function paginateCompilationQuestions(
  questions: Question[],
  page:
    CompilationPageSizeConfig
): Question[][] {
  const pages:
    Question[][] = [];

  let current:
    Question[] = [];

  let usedPx = 0;

  /**
   * Small allowance for rounding and page-margin
   * differences.
   */
  const SAFETY_PX = 2;

  for (
    const question
    of questions
  ) {
    const measuredBase =
      getMeasuredHeightBasePx(
        question
      );

    const baseContent =
      measuredBase ??
      estimateQuestionHeightBasePx(
        question
      );

    const baseWorkspace =
      getWorkspaceBasePx(
        question
      );

    const scaledContent =
      baseContent *
      page.scale;

    const scaledWorkspace =
      baseWorkspace *
      page.scale;

    const blockPx =
      Math.max(
        0,
        Math.round(
          scaledContent +
          scaledWorkspace
        )
      );

    if (
      current.length > 0 &&
      usedPx +
        blockPx +
        SAFETY_PX >
        page.contentHeightPx
    ) {
      pages.push(
        current
      );

      current = [];
      usedPx = 0;
    }

    current.push(
      question
    );

    usedPx +=
      blockPx;
  }

  if (
    current.length > 0
  ) {
    pages.push(
      current
    );
  }

  return pages;
}