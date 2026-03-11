import { useMemo } from "react";

import type { Question } from "@/shared-types/AssessmentTypes";
import { buildBuilderPages, buildPreviewPages } from "./BuildPreviewPages";
import type { PreviewPage } from "../BuilderUtils";

type EditForView =
  | {
      questionIndex: number;
      original: Question;
      draft: Question;
    }
  | null;

type UsePreviewPagesArgs = {
  assignedForView: Question[];
  editForView: EditForView;
  newDraftForView: Question | null;
  measuredHeights: Record<string, number>;
  includeCoverSheet: boolean;
  includeFormulaSheet: boolean;
};

export function usePreviewPages({
  assignedForView,
  editForView,
  newDraftForView,
  measuredHeights,
  includeCoverSheet,
  includeFormulaSheet,
}: UsePreviewPagesArgs) {
  const builderPages = useMemo(() => {
    return buildBuilderPages({
      assignedForView,
      editForView,
      newDraftForView,
      measuredHeights,
    });
  }, [assignedForView, editForView, newDraftForView, measuredHeights]);

  const renderById = useMemo(() => {
    const map = new Map<string, { kind: "locked" | "edit" | "draft"; q: Question }>();

    assignedForView.forEach((q) => map.set(q.id, { kind: "locked", q }));

    if (editForView) {
      map.set(editForView.original.id, { kind: "edit", q: editForView.draft });
    }

    if (newDraftForView) {
      map.set(newDraftForView.id, { kind: "draft", q: newDraftForView });
    }

    return map;
  }, [assignedForView, editForView, newDraftForView]);

  const previewPages = useMemo<PreviewPage[]>(() => {
    return buildPreviewPages({
      includeCoverSheet,
      includeFormulaSheet,
      builderPages,
    });
  }, [includeCoverSheet, includeFormulaSheet, builderPages]);

  return {
    builderPages,
    renderById,
    previewPages,
  };
}