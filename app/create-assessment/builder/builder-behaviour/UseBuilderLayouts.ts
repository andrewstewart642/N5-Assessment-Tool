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

export function useBuilderLayout({
  defaultHudHeight,
}: UseBuilderLayoutArgs) {
  const layoutRef = useRef<HTMLDivElement | null>(null);
  const hudResizeStartRef = useRef<{ startY: number; startHeight: number } | null>(null);

  const [leftPaneRatio, setLeftPaneRatio] = useState<number>(1 / 2.25);
  const [isDraggingDivider, setIsDraggingDivider] = useState(false);

  const [hudHeight, setHudHeight] = useState<number>(defaultHudHeight);
  const [isDraggingHud, setIsDraggingHud] = useState(false);
  const [showProgressPanel, setShowProgressPanel] = useState(true);

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
          setHudHeight(clamp(parsedHud, defaultHudHeight, 280));
        }
      }

      const rawShowHud = window.localStorage.getItem(SHOW_PROGRESS_PANEL_KEY);
      if (rawShowHud === "true") setShowProgressPanel(true);
      if (rawShowHud === "false") setShowProgressPanel(false);
    } catch {
      // ignore
    }
  }, [defaultHudHeight]);

  useEffect(() => {
    document.body.classList.toggle("dragging-divider", isDraggingDivider);
    document.body.classList.toggle("dragging-hud", isDraggingHud);

    return () => {
      document.body.classList.remove("dragging-divider");
      document.body.classList.remove("dragging-hud");
    };
  }, [isDraggingDivider, isDraggingHud]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!isDraggingDivider || !layoutRef.current) return;

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
    const onMove = (e: MouseEvent) => {
      if (!showProgressPanel) return;

      const start = hudResizeStartRef.current;
      if (!start) return;

      const delta = start.startY - e.clientY;
      setHudHeight(clamp(start.startHeight + delta, 88, 280));
    };

    const onUp = () => {
      hudResizeStartRef.current = null;
      setIsDraggingHud(false);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [showProgressPanel]);

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