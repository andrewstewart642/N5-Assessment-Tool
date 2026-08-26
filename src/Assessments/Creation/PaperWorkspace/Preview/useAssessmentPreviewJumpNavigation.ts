import {
  useEffect,
} from "react";

import type {
  Paper,
} from "@/src/Assessments/AssessmentTypes";

import type {
  AssessmentPreviewPage,
} from "./AssessmentPreviewTypes";

type PendingJumpRef = {
  current:
    | {
        paper: Paper;
        draftId: string;
      }
    | null;
};

type PageWrapperRefs = {
  current:
    Array<
      HTMLDivElement | null
    >;
};

type PreviewPaneRef = {
  current:
    HTMLDivElement | null;
};

type UseAssessmentPreviewJumpNavigationArgs = {
  pendingJumpDraftRef:
    PendingJumpRef;

  previewPages:
    AssessmentPreviewPage[];

  viewPaper:
    Paper;

  pageWrapperRefs:
    PageWrapperRefs;

  previewPaneRef:
    PreviewPaneRef;
};

function scrollPreviewPaneToNode({
  previewPane,
  targetNode,
}: {
  previewPane:
    HTMLDivElement;

  targetNode:
    HTMLDivElement;
}) {
  const previewRect =
    previewPane
      .getBoundingClientRect();

  const targetRect =
    targetNode
      .getBoundingClientRect();

  const currentScrollTop =
    previewPane.scrollTop;

  const targetOffsetWithinPreview =
    targetRect.top -
    previewRect.top;

  previewPane.scrollTo({
    top:
      currentScrollTop +
      targetOffsetWithinPreview -
      18,

    left:
      previewPane.scrollLeft,

    behavior:
      "smooth",
  });
}

export function useAssessmentPreviewJumpNavigation({
  pendingJumpDraftRef,
  previewPages,
  viewPaper,
  pageWrapperRefs,
  previewPaneRef,
}: UseAssessmentPreviewJumpNavigationArgs) {
  useEffect(() => {
    const pending =
      pendingJumpDraftRef.current;

    if (!pending) {
      return;
    }

    if (
      pending.paper !==
      viewPaper
    ) {
      return;
    }

    let targetPreviewIndex =
      -1;

    for (
      let index = 0;
      index <
      previewPages.length;
      index += 1
    ) {
      const page =
        previewPages[
          index
        ];

      if (
        page.kind !==
        "questions"
      ) {
        continue;
      }

      if (
        page.pageQuestions.some(
          (question) =>
            question.id ===
            pending.draftId
        )
      ) {
        targetPreviewIndex =
          index;

        break;
      }
    }

    if (
      targetPreviewIndex <
      0
    ) {
      return;
    }

    const targetNode =
      pageWrapperRefs.current[
        targetPreviewIndex
      ];

    const previewPane =
      previewPaneRef.current;

    if (
      !targetNode ||
      !previewPane
    ) {
      return;
    }

    const frame =
      window.requestAnimationFrame(
        () => {
          scrollPreviewPaneToNode({
            previewPane,
            targetNode,
          });

          pendingJumpDraftRef.current =
            null;
        }
      );

    return () => {
      window.cancelAnimationFrame(
        frame
      );
    };
  }, [
    pendingJumpDraftRef,
    previewPages,
    viewPaper,
    pageWrapperRefs,
    previewPaneRef,
  ]);
}