import { useCallback, useEffect, useRef, useState } from "react";

import { clamp } from "../BuilderUtils";
import {
  HUD_HEIGHT_KEY,
  PANE_RATIO_KEY,
  SHOW_PROGRESS_PANEL_KEY,
} from "../BuilderStorageKeys";

type UseBuilderLayoutArgs = {
  defaultHudHeight: number;
};

const MIN_HUD_HEIGHT = 88;
const MIN_PREVIEW_HEIGHT = 120;
const BUILDER_TOP_BAR_HEIGHT = 65;
const HUD_RESIZE_HANDLE_HEIGHT = 12;

export function useBuilderLayout({
  defaultHudHeight,
}: UseBuilderLayoutArgs) {
  const layoutRef = useRef<HTMLDivElement | null>(null);
  const hudResizeStartRef = useRef<{ startY: number; startHeight: number } | null>(
    null
  );

  const hudDragLatestClientYRef = useRef<number | null>(null);
  const hudDragFrameRef = useRef<number | null>(null);

  const [leftPaneRatio, setLeftPaneRatio] = useState<number>(1 / 2.25);
  const [isDraggingDivider, setIsDraggingDivider] = useState(false);

  const [hudHeight, setHudHeight] = useState<number>(defaultHudHeight);
  const [isDraggingHud, setIsDraggingHud] = useState(false);
  const [showProgressPanel, setShowProgressPanel] = useState(true);

  const getMaxHudHeight = useCallback(() => {
    if (!layoutRef.current) {
      return Math.max(defaultHudHeight, 280);
    }

    const layoutHeight = layoutRef.current.getBoundingClientRect().height;

    const availableHeight =
      layoutHeight -
      BUILDER_TOP_BAR_HEIGHT -
      MIN_PREVIEW_HEIGHT -
      HUD_RESIZE_HANDLE_HEIGHT;

    return Math.max(defaultHudHeight, Math.floor(availableHeight));
  }, [defaultHudHeight]);

  const clampHudHeight = useCallback(
    (value: number) => clamp(value, MIN_HUD_HEIGHT, getMaxHudHeight()),
    [getMaxHudHeight]
  );

  const resetLayout = useCallback(() => {
    setLeftPaneRatio(1 / 2.25);
    setHudHeight(defaultHudHeight);
    setShowProgressPanel(true);

    try {
      window.localStorage.removeItem(PANE_RATIO_KEY);
      window.localStorage.removeItem(HUD_HEIGHT_KEY);
      window.localStorage.removeItem(SHOW_PROGRESS_PANEL_KEY);
    } catch {
      // ignore
    }
  }, [defaultHudHeight]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(PANE_RATIO_KEY);
      if (raw) {
        const parsed = Number(raw);
        if (Number.isFinite(parsed)) setLeftPaneRatio(clamp(parsed, 0.28, 0.62));
      }

      const rawHud = window.localStorage.getItem(HUD_HEIGHT_KEY);
      if (rawHud) {
        const parsedHud = Number(rawHud);
        if (Number.isFinite(parsedHud)) {
          setHudHeight(clampHudHeight(parsedHud));
        }
      }

      const rawShowHud = window.localStorage.getItem(SHOW_PROGRESS_PANEL_KEY);
      if (rawShowHud === "true") setShowProgressPanel(true);
      if (rawShowHud === "false") setShowProgressPanel(false);
    } catch {
      // ignore
    }
  }, [clampHudHeight]);

  useEffect(() => {
    document.body.classList.toggle("dragging-divider", isDraggingDivider);
    document.body.classList.toggle("dragging-hud", isDraggingHud);

    const previousUserSelect = document.body.style.userSelect;
    const previousWebkitUserSelect = document.body.style.webkitUserSelect;
    const previousCursor = document.body.style.cursor;
    const previousOverscrollBehavior = document.body.style.overscrollBehavior;

    if (isDraggingDivider) {
      document.body.style.userSelect = "none";
      document.body.style.webkitUserSelect = "none";
      document.body.style.cursor = "col-resize";
      document.body.style.overscrollBehavior = "none";
    }

    if (isDraggingHud) {
      document.body.style.userSelect = "none";
      document.body.style.webkitUserSelect = "none";
      document.body.style.cursor = "row-resize";
      document.body.style.overscrollBehavior = "none";
    }

    return () => {
      document.body.classList.remove("dragging-divider");
      document.body.classList.remove("dragging-hud");
      document.body.style.userSelect = previousUserSelect;
      document.body.style.webkitUserSelect = previousWebkitUserSelect;
      document.body.style.cursor = previousCursor;
      document.body.style.overscrollBehavior = previousOverscrollBehavior;
    };
  }, [isDraggingDivider, isDraggingHud]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!isDraggingDivider || !layoutRef.current) return;

      e.preventDefault();

      const rect = layoutRef.current.getBoundingClientRect();
      const dividerW = 8;
      const usableW = rect.width - dividerW;
      if (usableW <= 0) return;

      const nextRatio = (e.clientX - rect.left) / usableW;
      setLeftPaneRatio(clamp(nextRatio, 0.28, 0.62));
    };

    const onUp = () => setIsDraggingDivider(false);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [isDraggingDivider]);

  useEffect(() => {
    if (!showProgressPanel) return;

    const flushHudResizeFrame = () => {
      hudDragFrameRef.current = null;

      const start = hudResizeStartRef.current;
      const latestClientY = hudDragLatestClientYRef.current;
      if (!start || latestClientY === null) return;

      const delta = start.startY - latestClientY;
      const nextHeight = clampHudHeight(start.startHeight + delta);
      setHudHeight(nextHeight);
    };

    const requestHudResizeFrame = () => {
      if (hudDragFrameRef.current !== null) return;

      hudDragFrameRef.current = window.requestAnimationFrame(flushHudResizeFrame);
    };

    const onMove = (e: MouseEvent) => {
      const start = hudResizeStartRef.current;
      if (!start) return;

      e.preventDefault();

      hudDragLatestClientYRef.current = e.clientY;
      requestHudResizeFrame();
    };

    const onUp = () => {
      hudResizeStartRef.current = null;
      hudDragLatestClientYRef.current = null;

      if (hudDragFrameRef.current !== null) {
        window.cancelAnimationFrame(hudDragFrameRef.current);
        hudDragFrameRef.current = null;
      }

      setIsDraggingHud(false);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);

      if (hudDragFrameRef.current !== null) {
        window.cancelAnimationFrame(hudDragFrameRef.current);
        hudDragFrameRef.current = null;
      }
    };
  }, [showProgressPanel, clampHudHeight]);

  useEffect(() => {
    const handleResize = () => {
      setHudHeight((current) => clampHudHeight(current));
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [clampHudHeight]);

  return {
    layoutRef,
    hudResizeStartRef,

    leftPaneRatio,
    setLeftPaneRatio,
    isDraggingDivider,
    setIsDraggingDivider,

    hudHeight,
    setHudHeight,
    isDraggingHud,
    setIsDraggingHud,
    showProgressPanel,
    setShowProgressPanel,

    resetLayout,
  };
}