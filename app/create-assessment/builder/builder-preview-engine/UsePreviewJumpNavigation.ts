import { useEffect } from "react";

import type { Paper } from "@/shared-types/AssessmentTypes_TEMP";
import type { PreviewPage } from "../BuilderUtils";

type PendingJumpRef = React.MutableRefObject<{
  paper: Paper;
  draftId: string;
} | null>;

type PageWrapperRefs = React.RefObject<Array<HTMLDivElement | null>>;
type PreviewPaneRef = React.RefObject<HTMLDivElement | null>;

type UsePreviewJumpNavigationArgs = {
  pendingJumpDraftRef: PendingJumpRef;
  previewPages: PreviewPage[];
  viewPaper: Paper;
  pageWrapperRefs: PageWrapperRefs;
  previewPaneRef: PreviewPaneRef;
};

function scrollPreviewPaneToNode({
  previewPane,
  targetNode,
}: {
  previewPane: HTMLDivElement;
  targetNode: HTMLDivElement;
}) {
  const previewRect = previewPane.getBoundingClientRect();
  const targetRect = targetNode.getBoundingClientRect();

  const currentScrollTop = previewPane.scrollTop;
  const targetOffsetWithinPreview = targetRect.top - previewRect.top;

  previewPane.scrollTo({
    top: currentScrollTop + targetOffsetWithinPreview - 18,
    left: previewPane.scrollLeft,
    behavior: "smooth",
  });
}

export function usePreviewJumpNavigation({
  pendingJumpDraftRef,
  previewPages,
  viewPaper,
  pageWrapperRefs,
  previewPaneRef,
}: UsePreviewJumpNavigationArgs) {
  useEffect(() => {
    const pending = pendingJumpDraftRef.current;
    if (!pending) return;
    if (pending.paper !== viewPaper) return;

    let targetPreviewIndex = -1;

    for (let i = 0; i < previewPages.length; i += 1) {
      const page = previewPages[i];
      if (page.kind !== "questions") continue;

      if (page.pageQuestions.some((q) => q.id === pending.draftId)) {
        targetPreviewIndex = i;
        break;
      }
    }

    if (targetPreviewIndex < 0) return;

    const targetNode = pageWrapperRefs.current[targetPreviewIndex];
    const previewPane = previewPaneRef.current;

    if (!targetNode || !previewPane) return;

    const frame = window.requestAnimationFrame(() => {
      scrollPreviewPaneToNode({
        previewPane,
        targetNode,
      });

      pendingJumpDraftRef.current = null;
    });

    return () => window.cancelAnimationFrame(frame);
  }, [
    pendingJumpDraftRef,
    previewPages,
    viewPaper,
    pageWrapperRefs,
    previewPaneRef,
  ]);
}