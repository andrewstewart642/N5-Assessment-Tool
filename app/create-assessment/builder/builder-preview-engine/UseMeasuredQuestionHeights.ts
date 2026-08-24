import { useCallback, useEffect } from "react";

import type { Question } from "@/shared-types/AssessmentTypes";
import type { DraftByPaper, EditDraftByPaper } from "../BuilderUtils";

type UseMeasuredQuestionHeightsArgs = {
  questions: Question[];
  draftByPaper: DraftByPaper;
  editDraftByPaper: EditDraftByPaper;
  setMeasuredHeights: React.Dispatch<React.SetStateAction<Record<string, number>>>;
};

export function useMeasuredQuestionHeights({
  questions,
  draftByPaper,
  editDraftByPaper,
  setMeasuredHeights,
}: UseMeasuredQuestionHeightsArgs) {
  const onMeasure = useCallback(
    (id: string, heightPx: number) => {
      if (!Number.isFinite(heightPx) || heightPx <= 0) return;

      const rounded = Math.round(heightPx);

      setMeasuredHeights((prev) => {
        const prevHeight = prev[id];

        if (typeof prevHeight !== "number") {
          return { ...prev, [id]: rounded };
        }

        if (Math.abs(prevHeight - rounded) <= 1) {
          return prev;
        }

        return { ...prev, [id]: rounded };
      });
    },
    [setMeasuredHeights]
  );

  useEffect(() => {
    const liveIds = new Set<string>();

    questions.forEach((q) => liveIds.add(q.id));

    if (draftByPaper.P1) liveIds.add(draftByPaper.P1.id);
    if (draftByPaper.P2) liveIds.add(draftByPaper.P2.id);

    if (editDraftByPaper.P1) {
      liveIds.add(editDraftByPaper.P1.original.id);
      liveIds.add(editDraftByPaper.P1.draft.id);
    }

    if (editDraftByPaper.P2) {
      liveIds.add(editDraftByPaper.P2.original.id);
      liveIds.add(editDraftByPaper.P2.draft.id);
    }

    setMeasuredHeights((prev) => {
      let changed = false;
      const next: Record<string, number> = {};

      for (const [id, height] of Object.entries(prev)) {
        if (liveIds.has(id)) {
          next[id] = height;
        } else {
          changed = true;
        }
      }

      return changed ? next : prev;
    });
  }, [questions, draftByPaper, editDraftByPaper, setMeasuredHeights]);

  return {
    onMeasure,
  };
}