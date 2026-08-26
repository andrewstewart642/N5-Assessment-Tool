"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import type {
  Paper,
} from "@/app/Assessments/AssessmentTypes";

import {
  A4_PAGE_WIDTH_PX,
} from "@/app/UI/Documents/Layout/DocumentUnits";

import type {
  AssessmentPreviewPage,
} from "./AssessmentPreviewTypes";

type PreviewPaneRef = {
  current:
    HTMLDivElement | null;
};

type PageWrapperRefs = {
  current:
    Array<
      HTMLDivElement | null
    >;
};

type UseAssessmentPreviewViewportArgs = {
  previewPaneRef:
    PreviewPaneRef;

  pageWrapperRefs:
    PageWrapperRefs;

  previewPages:
    AssessmentPreviewPage[];

  showProgressPanel:
    boolean;

  includeCoverSheet:
    boolean;

  includeFormulaSheet:
    boolean;

  viewPaper:
    Paper;
};

function clampNumber(
  value: number,
  minimum: number,
  maximum: number
): number {
  return Math.max(
    minimum,
    Math.min(
      maximum,
      value
    )
  );
}

export function useAssessmentPreviewViewport({
  previewPaneRef,
  pageWrapperRefs,
  previewPages,
  showProgressPanel,
  includeCoverSheet,
  includeFormulaSheet,
  viewPaper,
}: UseAssessmentPreviewViewportArgs) {
  const [
    fitWidthScale,
    setFitWidthScale,
  ] =
    useState<number>(
      1
    );

  const [
    zoomPct,
    setZoomPct,
  ] =
    useState<number>(
      100
    );

  const [
    currentViewerPage,
    setCurrentViewerPage,
  ] =
    useState<number>(
      1
    );

  const pageCheckFrameRef =
    useRef<number | null>(
      null
    );

  const viewerScale =
    useMemo(() => {
      return (
        fitWidthScale *
        (
          zoomPct /
          100
        )
      );
    }, [
      fitWidthScale,
      zoomPct,
    ]);

  const totalViewerPages =
    Math.max(
      previewPages.length,
      1
    );

  const runPageDetection =
    useCallback(() => {
      const container =
        previewPaneRef.current;

      if (!container) {
        return;
      }

      if (
        previewPages.length ===
        0
      ) {
        setCurrentViewerPage(
          (previous) =>
            previous === 1
              ? previous
              : 1
        );

        return;
      }

      const containerRect =
        container
          .getBoundingClientRect();

      let bestPage =
        1;

      let bestVisible =
        -1;

      pageWrapperRefs.current.forEach(
        (
          node,
          index
        ) => {
          if (!node) {
            return;
          }

          const rect =
            node
              .getBoundingClientRect();

          const visibleTop =
            Math.max(
              rect.top,
              containerRect.top
            );

          const visibleBottom =
            Math.min(
              rect.bottom,
              containerRect.bottom
            );

          const visible =
            Math.max(
              0,
              visibleBottom -
              visibleTop
            );

          if (
            visible >
            bestVisible
          ) {
            bestVisible =
              visible;

            bestPage =
              index + 1;
          }
        }
      );

      setCurrentViewerPage(
        (previous) =>
          previous ===
          bestPage
            ? previous
            : bestPage
      );
    }, [
      previewPaneRef,
      pageWrapperRefs,
      previewPages.length,
    ]);

  const schedulePageDetection =
    useCallback(() => {
      if (
        pageCheckFrameRef.current !==
        null
      ) {
        window.cancelAnimationFrame(
          pageCheckFrameRef.current
        );
      }

      pageCheckFrameRef.current =
        window.requestAnimationFrame(
          () => {
            pageCheckFrameRef.current =
              null;

            runPageDetection();
          }
        );
    }, [
      runPageDetection,
    ]);

  useEffect(() => {
    const element =
      previewPaneRef.current;

    if (!element) {
      return;
    }

    const calculateFitWidth =
      () => {
        const width =
          element.clientWidth;

        const horizontalPaddingAllowance =
          40;

        const nextScale =
          clampNumber(
            (
              width -
              horizontalPaddingAllowance
            ) /
              A4_PAGE_WIDTH_PX,

            0.45,
            1.35
          );

        setFitWidthScale(
          (previous) =>
            Math.abs(
              previous -
              nextScale
            ) < 0.01
              ? previous
              : nextScale
        );
      };

    calculateFitWidth();

    const resizeObserver =
      new ResizeObserver(
        () => {
          calculateFitWidth();
        }
      );

    resizeObserver.observe(
      element
    );

    return () => {
      resizeObserver.disconnect();
    };
  }, [
    previewPaneRef,
  ]);

  useEffect(() => {
    const element =
      previewPaneRef.current;

    if (!element) {
      return;
    }

    const handleWheel =
      (
        event:
          WheelEvent
      ) => {
        if (
          !event.ctrlKey
        ) {
          return;
        }

        event.preventDefault();

        setZoomPct(
          (previous) =>
            clampNumber(
              previous +
                (
                  event.deltaY <
                  0
                    ? 5
                    : -5
                ),

              50,
              160
            )
        );
      };

    element.addEventListener(
      "wheel",
      handleWheel,
      {
        passive:
          false,
      }
    );

    return () => {
      element.removeEventListener(
        "wheel",
        handleWheel
      );
    };
  }, [
    previewPaneRef,
  ]);

  useEffect(() => {
    const container =
      previewPaneRef.current;

    if (!container) {
      return;
    }

    const handleScroll =
      () => {
        schedulePageDetection();
      };

    const handleResize =
      () => {
        schedulePageDetection();
      };

    const resizeObserver =
      new ResizeObserver(
        () => {
          schedulePageDetection();
        }
      );

    container.addEventListener(
      "scroll",
      handleScroll
    );

    window.addEventListener(
      "resize",
      handleResize
    );

    resizeObserver.observe(
      container
    );

    schedulePageDetection();

    return () => {
      container.removeEventListener(
        "scroll",
        handleScroll
      );

      window.removeEventListener(
        "resize",
        handleResize
      );

      resizeObserver.disconnect();

      if (
        pageCheckFrameRef.current !==
        null
      ) {
        window.cancelAnimationFrame(
          pageCheckFrameRef.current
        );

        pageCheckFrameRef.current =
          null;
      }
    };
  }, [
    previewPaneRef,
    schedulePageDetection,
  ]);

  useEffect(() => {
    schedulePageDetection();
  }, [
    previewPages.length,
    viewerScale,
    viewPaper,
    showProgressPanel,
    includeCoverSheet,
    includeFormulaSheet,
    schedulePageDetection,
  ]);

  const zoomIn =
    () => {
      setZoomPct(
        (previous) =>
          clampNumber(
            previous + 5,
            50,
            160
          )
      );
    };

  const zoomOut =
    () => {
      setZoomPct(
        (previous) =>
          clampNumber(
            previous - 5,
            50,
            160
          )
      );
    };

  const resetZoom =
    () => {
      setZoomPct(
        100
      );
    };

  return {
    fitWidthScale,
    zoomPct,
    currentViewerPage,
    viewerScale,
    totalViewerPages,

    zoomIn,
    zoomOut,
    resetZoom,
  };
}