import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { clamp, A4_W_PX, type PreviewPage } from "../BuilderUtils";

type UsePreviewViewportArgs = {
  previewPaneRef: React.RefObject<HTMLDivElement | null>;
  pageWrapperRefs: React.RefObject<Array<HTMLDivElement | null>>;
  previewPages: PreviewPage[];
  showProgressPanel: boolean;
  includeCoverSheet: boolean;
  includeFormulaSheet: boolean;
  viewPaper: "P1" | "P2";
};

export function usePreviewViewport({
  previewPaneRef,
  pageWrapperRefs,
  previewPages,
  showProgressPanel,
  includeCoverSheet,
  includeFormulaSheet,
  viewPaper,
}: UsePreviewViewportArgs) {
  const [fitWidthScale, setFitWidthScale] = useState<number>(1);
  const [zoomPct, setZoomPct] = useState<number>(90);
  const [currentViewerPage, setCurrentViewerPage] = useState<number>(1);

  const pageCheckFrameRef = useRef<number | null>(null);

  const viewerScale = useMemo(() => {
    return fitWidthScale * (zoomPct / 100);
  }, [fitWidthScale, zoomPct]);

  const totalViewerPages = Math.max(previewPages.length, 1);

  const runPageDetection = useCallback(() => {
    const container = previewPaneRef.current;
    if (!container) return;

    if (previewPages.length === 0) {
      setCurrentViewerPage((prev) => (prev === 1 ? prev : 1));
      return;
    }

    const containerRect = container.getBoundingClientRect();
    let bestPage = 1;
    let bestVisible = -1;

    pageWrapperRefs.current.forEach((node, idx) => {
      if (!node) return;

      const rect = node.getBoundingClientRect();
      const visibleTop = Math.max(rect.top, containerRect.top);
      const visibleBottom = Math.min(rect.bottom, containerRect.bottom);
      const visible = Math.max(0, visibleBottom - visibleTop);

      if (visible > bestVisible) {
        bestVisible = visible;
        bestPage = idx + 1;
      }
    });

    setCurrentViewerPage((prev) => (prev === bestPage ? prev : bestPage));
  }, [previewPaneRef, pageWrapperRefs, previewPages.length]);

  const schedulePageDetection = useCallback(() => {
    if (pageCheckFrameRef.current !== null) {
      window.cancelAnimationFrame(pageCheckFrameRef.current);
    }

    pageCheckFrameRef.current = window.requestAnimationFrame(() => {
      pageCheckFrameRef.current = null;
      runPageDetection();
    });
  }, [runPageDetection]);

  useEffect(() => {
    const el = previewPaneRef.current;
    if (!el) return;

    const calcFitWidth = () => {
      const width = el.clientWidth;
      const horizontalPaddingAllowance = 40;
      const nextScale = clamp(
        (width - horizontalPaddingAllowance) / A4_W_PX,
        0.45,
        1.35
      );

      setFitWidthScale((prev) =>
        Math.abs(prev - nextScale) < 0.01 ? prev : nextScale
      );
    };

    calcFitWidth();

    const resizeObserver = new ResizeObserver(() => {
      calcFitWidth();
    });

    resizeObserver.observe(el);

    return () => {
      resizeObserver.disconnect();
    };
  }, [previewPaneRef]);

  useEffect(() => {
    const el = previewPaneRef.current;
    if (!el) return;

    const handleWheel = (event: WheelEvent) => {
      if (!event.ctrlKey) return;

      event.preventDefault();
      setZoomPct((prev) => clamp(prev + (event.deltaY < 0 ? 5 : -5), 50, 160));
    };

    el.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      el.removeEventListener("wheel", handleWheel);
    };
  }, [previewPaneRef]);

  useEffect(() => {
    const container = previewPaneRef.current;
    if (!container) return;

    const handleScroll = () => {
      schedulePageDetection();
    };

    const handleResize = () => {
      schedulePageDetection();
    };

    const resizeObserver = new ResizeObserver(() => {
      schedulePageDetection();
    });

    container.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    resizeObserver.observe(container);

    schedulePageDetection();

    return () => {
      container.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      resizeObserver.disconnect();

      if (pageCheckFrameRef.current !== null) {
        window.cancelAnimationFrame(pageCheckFrameRef.current);
        pageCheckFrameRef.current = null;
      }
    };
  }, [previewPaneRef, schedulePageDetection]);

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

  const zoomIn = () => {
    setZoomPct((prev) => clamp(prev + 5, 50, 160));
  };

  const zoomOut = () => {
    setZoomPct((prev) => clamp(prev - 5, 50, 160));
  };

  const resetZoom = () => {
    setZoomPct(100);
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