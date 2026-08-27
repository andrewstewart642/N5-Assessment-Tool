import type {
  Question,
} from "@/app/Assessments/AssessmentTypes";

import type {
  CourseId,
} from "@/app/Courses/CourseTypes";

import {
  getNational5MathsQuestionSpacingBasePx,
} from "@/app/Courses/National5Maths/Documents/National5MathsQuestionSpacing";


export const ASSESSMENT_COMPILATION_A4_CONTENT_HEIGHT_PX =
  980;


const DEFAULT_QUESTION_SPACING_BASE_PX =
  48;


const PAGINATION_SAFETY_PX =
  2;


function estimateQuestionHeightBasePx(
  question:
    Question
): number {
  const promptLength =
    (
      question.prompt ??
      ""
    ).length;

  const answerLength =
    (
      question.answer ??
      ""
    ).length;

  const promptLines =
    Math.max(
      1,
      Math.ceil(
        promptLength /
        70
      )
    );

  const answerLines =
    answerLength
      ? Math.max(
          1,
          Math.ceil(
            answerLength /
            80
          )
        )
      : 0;

  const headerHeight =
    34;

  const promptHeight =
    20 +
    promptLines * 18;

  const answerHeight =
    answerLines
      ? 18 +
        answerLines * 16
      : 0;

  const metadataHeight =
    14;

  return (
    headerHeight +
    promptHeight +
    answerHeight +
    metadataHeight
  );
}


function getMeasuredQuestionHeightBasePx(
  question:
    Question
): number | null {
  const measuredHeight =
    (
      question as Question & {
        measuredHeightBasePx?:
          unknown;
      }
    ).measuredHeightBasePx;

  if (
    typeof measuredHeight !==
      "number" ||
    !Number.isFinite(
      measuredHeight
    ) ||
    measuredHeight <=
      0
  ) {
    return null;
  }

  return measuredHeight;
}


export function getAssessmentCompilationQuestionSpacingBasePx(
  question:
    Question,

  courseId:
    CourseId
): number {
  const persistedSpacing =
    question.spacingBasePx;

  if (
    typeof persistedSpacing ===
      "number" &&
    Number.isFinite(
      persistedSpacing
    ) &&
    persistedSpacing >=
      0
  ) {
    return persistedSpacing;
  }


  /*
   * Historical N5 Maths questions may predate
   * persisted spacing metadata.
   */

  if (
    courseId ===
      "N5_MATH" &&
    question.questionCode
  ) {
    return getNational5MathsQuestionSpacingBasePx(
      question.questionCode
    );
  }


  return DEFAULT_QUESTION_SPACING_BASE_PX;
}


export function paginateAssessmentCompilationQuestions({
  questions,
  courseId,
  contentHeightPx =
    ASSESSMENT_COMPILATION_A4_CONTENT_HEIGHT_PX,
  scale =
    1,
}: {
  questions:
    Question[];

  courseId:
    CourseId;

  contentHeightPx?:
    number;

  scale?:
    number;
}): Question[][] {
  const pages:
    Question[][] = [];

  let currentPage:
    Question[] = [];

  let usedHeight =
    0;


  for (
    const question
    of questions
  ) {
    const contentHeight =
      getMeasuredQuestionHeightBasePx(
        question
      ) ??
      estimateQuestionHeightBasePx(
        question
      );

    const workspaceHeight =
      getAssessmentCompilationQuestionSpacingBasePx(
        question,
        courseId
      );

    const blockHeight =
      Math.max(
        0,
        Math.round(
          (
            contentHeight +
            workspaceHeight
          ) *
            scale
        )
      );


    if (
      currentPage.length >
        0 &&
      usedHeight +
        blockHeight +
        PAGINATION_SAFETY_PX >
        contentHeightPx
    ) {
      pages.push(
        currentPage
      );

      currentPage =
        [];

      usedHeight =
        0;
    }


    currentPage.push(
      question
    );

    usedHeight +=
      blockHeight;
  }


  if (
    currentPage.length >
    0
  ) {
    pages.push(
      currentPage
    );
  }


  return pages;
}