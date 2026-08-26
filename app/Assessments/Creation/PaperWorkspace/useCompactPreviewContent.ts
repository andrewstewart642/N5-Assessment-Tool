
import { useMemo } from "react";

import type {
  Paper,
  Question,
} from "@/app/Assessments/AssessmentTypes";

import type {
  AssessmentEditQuestionDraftByPaper,
} from "../Questions/AssessmentQuestionDraftTypes";

const COMPACT_PREVIEW_SPACING_PX = 24;

type EditDraft =
  AssessmentEditQuestionDraftByPaper[Paper];

type UseCompactPreviewContentArgs = {
  assignedForView: Question[];
  editForView: EditDraft;
  newDraftForView: Question | null;
  suppressPreviewSpacing: boolean;
};

export function useCompactPreviewContent({
  assignedForView,
  editForView,
  newDraftForView,
  suppressPreviewSpacing,
}: UseCompactPreviewContentArgs) {
  const previewAssignedForView =
    useMemo(() => {
      if (!suppressPreviewSpacing) {
        return assignedForView;
      }

      return assignedForView.map(
        (question) => ({
          ...question,
          spacingBasePx:
            COMPACT_PREVIEW_SPACING_PX,
        })
      );
    }, [
      assignedForView,
      suppressPreviewSpacing,
    ]);

  const previewEditForView =
    useMemo(() => {
      if (
        !editForView ||
        !suppressPreviewSpacing
      ) {
        return editForView;
      }

      return {
        ...editForView,

        original: {
          ...editForView.original,
          spacingBasePx:
            COMPACT_PREVIEW_SPACING_PX,
        },

        draft: {
          ...editForView.draft,
          spacingBasePx:
            COMPACT_PREVIEW_SPACING_PX,
        },
      };
    }, [
      editForView,
      suppressPreviewSpacing,
    ]);

  const previewNewDraftForView =
    useMemo(() => {
      if (
        !newDraftForView ||
        !suppressPreviewSpacing
      ) {
        return newDraftForView;
      }

      return {
        ...newDraftForView,
        spacingBasePx:
          COMPACT_PREVIEW_SPACING_PX,
      };
    }, [
      newDraftForView,
      suppressPreviewSpacing,
    ]);

  return {
    previewAssignedForView,
    previewEditForView,
    previewNewDraftForView,
  };
}