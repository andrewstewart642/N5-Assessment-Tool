import type { Question } from "@/shared-types/AssessmentTypes";
import type { PreviewPage, EditDraftByPaper } from "./BuilderUtils";
import { PAGE_SIZES } from "@/app/paper-layout/Page-Sizes";
import { paginateQuestions } from "@/app/paper-layout/Reflow-Pages";

export function buildBuilderPages(args: {
  assignedForView: Question[];
  editForView: EditDraftByPaper["P1"] | EditDraftByPaper["P2"];
  newDraftForView: Question | null;
  measuredHeights: Record<string, number>;
}) {
  const { assignedForView, editForView, newDraftForView, measuredHeights } = args;

  const pinnedAssigned: Question[] = assignedForView.map((q) => {
    if (editForView && q.id === editForView.original.id) return editForView.original;
    return q;
  });

  const layoutListRaw = newDraftForView ? [...pinnedAssigned, newDraftForView] : pinnedAssigned;

  const layoutList = layoutListRaw.map((q) => {
    const h = measuredHeights[q.id];
    if (typeof h === "number" && Number.isFinite(h) && h > 0) {
      const prev = (q as any).measuredHeightBasePx as number | undefined;
      if (typeof prev === "number" && Math.abs(prev - h) <= 1) return q;
      return { ...q, measuredHeightBasePx: h };
    }
    return q;
  });

  return paginateQuestions(layoutList, PAGE_SIZES.A4);
}

export function buildPreviewPages(args: {
  includeCoverSheet: boolean;
  includeFormulaSheet: boolean;
  builderPages: Question[][];
}): PreviewPage[] {
  const { includeCoverSheet, includeFormulaSheet, builderPages } = args;

  const pages: PreviewPage[] = [];
  let nextPageNumber = 1;

  if (includeCoverSheet) {
    pages.push({ kind: "cover", pageNumber: nextPageNumber });
    nextPageNumber += 1;
  }

  if (includeFormulaSheet) {
    pages.push({ kind: "formula", pageNumber: nextPageNumber });
    nextPageNumber += 1;
  }

  if (builderPages.length === 0) {
    pages.push({ kind: "empty", pageNumber: nextPageNumber });
    return pages;
  }

  let nextQuestionNumber = 1;

  builderPages.forEach((pageQuestions, questionPageIndex) => {
    pages.push({
      kind: "questions",
      pageNumber: nextPageNumber,
      questionPageIndex,
      questionStartIndex: nextQuestionNumber,
      pageQuestions,
    });
    nextPageNumber += 1;
    nextQuestionNumber += pageQuestions.length;
  });

  return pages;
}