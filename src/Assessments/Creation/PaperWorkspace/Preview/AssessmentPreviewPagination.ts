import type {
  Question,
} from "@/src/Assessments/AssessmentTypes";

import type {
  AssessmentEditQuestionDraft,
} from "../../Questions/AssessmentQuestionDraftTypes";

import {
  getAssessmentQuestionSpacingBasePx,
} from "../../Questions/AssessmentQuestionSpacing";

import type {
  AssessmentPreviewPage,
} from "./AssessmentPreviewTypes";

const ASSESSMENT_PREVIEW_A4_CONTENT_HEIGHT_PX =
  980;

const ASSESSMENT_PREVIEW_PAGINATION_SAFETY_PX =
  2;

function estimateQuestionHeightBasePx(
  question: Question
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

function getMeasuredQuestionHeight(
  question: Question
): number | null {
  const measuredHeight =
    (
      question as Question & {
        measuredHeightBasePx?: number;
      }
    ).measuredHeightBasePx;

  if (
    typeof measuredHeight !==
      "number" ||
    !Number.isFinite(
      measuredHeight
    ) ||
    measuredHeight <= 0
  ) {
    return null;
  }

  return measuredHeight;
}

function paginateQuestions(
  questions: Question[]
): Question[][] {
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
      getMeasuredQuestionHeight(
        question
      ) ??
      estimateQuestionHeightBasePx(
        question
      );

    const workspaceHeight =
      getAssessmentQuestionSpacingBasePx(
        question
      );

    const blockHeight =
      Math.max(
        0,
        Math.round(
          contentHeight +
          workspaceHeight
        )
      );

    if (
      currentPage.length >
        0 &&
      usedHeight +
        blockHeight +
        ASSESSMENT_PREVIEW_PAGINATION_SAFETY_PX >
        ASSESSMENT_PREVIEW_A4_CONTENT_HEIGHT_PX
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

export function buildAssessmentPreviewQuestionPages({
  assignedForView,
  editForView,
  newDraftForView,
  measuredHeights,
}: {
  assignedForView: Question[];

  editForView:
    AssessmentEditQuestionDraft;

  newDraftForView:
    Question | null;

  measuredHeights:
    Record<string, number>;
}): Question[][] {
  const pinnedAssigned =
    assignedForView.map(
      (question) => {
        if (
          editForView &&
          question.id ===
            editForView
              .original.id
        ) {
          return editForView
            .original;
        }

        return question;
      }
    );

  const layoutListRaw =
    newDraftForView
      ? [
          ...pinnedAssigned,
          newDraftForView,
        ]
      : pinnedAssigned;

  const layoutList =
    layoutListRaw.map(
      (question) => {
        const measuredHeight =
          measuredHeights[
            question.id
          ];

        if (
          typeof measuredHeight ===
            "number" &&
          Number.isFinite(
            measuredHeight
          ) &&
          measuredHeight > 0
        ) {
          const previousHeight =
            (
              question as Question & {
                measuredHeightBasePx?: number;
              }
            )
              .measuredHeightBasePx;

          if (
            typeof previousHeight ===
              "number" &&
            Math.abs(
              previousHeight -
              measuredHeight
            ) <= 1
          ) {
            return question;
          }

          return {
            ...question,

            measuredHeightBasePx:
              measuredHeight,
          };
        }

        return question;
      }
    );

  return paginateQuestions(
    layoutList
  );
}

export function buildAssessmentPreviewPages({
  includeCoverSheet,
  includeFormulaSheet,
  questionPages,
}: {
  includeCoverSheet: boolean;
  includeFormulaSheet: boolean;
  questionPages: Question[][];
}): AssessmentPreviewPage[] {
  const pages:
    AssessmentPreviewPage[] =
      [];

  let nextPageNumber =
    1;

  if (
    includeCoverSheet
  ) {
    pages.push({
      kind: "cover",
      pageNumber:
        nextPageNumber,
    });

    nextPageNumber +=
      1;
  }

  if (
    includeFormulaSheet
  ) {
    pages.push({
      kind: "formula",
      pageNumber:
        nextPageNumber,
    });

    nextPageNumber +=
      1;
  }

  if (
    questionPages.length ===
    0
  ) {
    pages.push({
      kind: "empty",
      pageNumber:
        nextPageNumber,
    });

    return pages;
  }

  let nextQuestionNumber =
    1;

  questionPages.forEach(
    (
      pageQuestions,
      questionPageIndex
    ) => {
      pages.push({
        kind:
          "questions",

        pageNumber:
          nextPageNumber,

        questionPageIndex,

        questionStartIndex:
          nextQuestionNumber,

        pageQuestions,
      });

      nextPageNumber +=
        1;

      nextQuestionNumber +=
        pageQuestions.length;
    }
  );

  return pages;
}