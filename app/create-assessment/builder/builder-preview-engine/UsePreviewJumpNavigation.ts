import { useEffect } from "react";
import type { Paper } from "@/shared-types/AssessmentTypes";
import type { PreviewPage } from "../BuilderUtils";

type PendingJumpRef = React.MutableRefObject<{ paper: Paper; draftId: string } | null>;
type PageWrapperRefs = React.RefObject<Array<HTMLDivElement | null>>;

type UsePreviewJumpNavigationArgs = {
  pendingJumpDraftRef: PendingJumpRef;
  previewPages: PreviewPage[];
  viewPaper: Paper;
  pageWrapperRefs: PageWrapperRefs;
};

export function usePreviewJumpNavigation({
  pendingJumpDraftRef,
  previewPages,
  viewPaper,
  pageWrapperRefs,
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
    if (!targetNode) return;

    const frame = window.requestAnimationFrame(() => {
      targetNode.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
      pendingJumpDraftRef.current = null;
    });

    return () => window.cancelAnimationFrame(frame);
  }, [pendingJumpDraftRef, previewPages, viewPaper, pageWrapperRefs]);
}