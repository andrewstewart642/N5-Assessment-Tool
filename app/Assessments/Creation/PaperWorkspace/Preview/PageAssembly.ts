import {
  useMemo,
} from "react";

import type {
  Question,
} from "@/app/Assessments/AssessmentTypes";

import type {
  AssessmentEditQuestionDraft,
} from "../../Questions/DraftTypes";

import {
  buildAssessmentPreviewPages,
  buildAssessmentPreviewQuestionPages,
} from "./Pagination";

import type {
  AssessmentPreviewPage,
  AssessmentPreviewRenderById,
} from "./PageData";

type UseAssessmentPreviewPagesArgs = {
  assignedForView:
    Question[];

  editForView:
    AssessmentEditQuestionDraft;

  newDraftForView:
    Question | null;

  measuredHeights:
    Record<string, number>;

  includeCoverSheet:
    boolean;

  includeFormulaSheet:
    boolean;
};

export function useAssessmentPreviewPages({
  assignedForView,
  editForView,
  newDraftForView,
  measuredHeights,
  includeCoverSheet,
  includeFormulaSheet,
}: UseAssessmentPreviewPagesArgs) {
  const questionPages =
    useMemo(() => {
      return buildAssessmentPreviewQuestionPages({
        assignedForView,

        editForView,

        newDraftForView,

        measuredHeights,
      });
    }, [
      assignedForView,
      editForView,
      newDraftForView,
      measuredHeights,
    ]);

  const renderById =
    useMemo<AssessmentPreviewRenderById>(
      () => {
        const map:
          AssessmentPreviewRenderById =
            new Map();

        assignedForView.forEach(
          (question) => {
            map.set(
              question.id,
              {
                kind:
                  "locked",

                q:
                  question,
              }
            );
          }
        );

        if (
          editForView
        ) {
          map.set(
            editForView
              .original.id,
            {
              kind:
                "edit",

              q:
                editForView
                  .draft,
            }
          );
        }

        if (
          newDraftForView
        ) {
          map.set(
            newDraftForView.id,
            {
              kind:
                "draft",

              q:
                newDraftForView,
            }
          );
        }

        return map;
      },
      [
        assignedForView,
        editForView,
        newDraftForView,
      ]
    );

  const previewPages =
    useMemo<
      AssessmentPreviewPage[]
    >(() => {
      return buildAssessmentPreviewPages({
        includeCoverSheet,

        includeFormulaSheet,

        questionPages,
      });
    }, [
      includeCoverSheet,
      includeFormulaSheet,
      questionPages,
    ]);

  return {
    questionPages,
    renderById,
    previewPages,
  };
}