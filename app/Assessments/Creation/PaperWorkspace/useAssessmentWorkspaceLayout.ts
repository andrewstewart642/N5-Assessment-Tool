"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  ASSESSMENT_CREATION_STORAGE_KEY_PAIRS,
} from "../Persistence/AssessmentCreationStorageKeys";

import {
  ASSESSMENT_WORKSPACE_DEFAULT_HUD_HEIGHT,
  ASSESSMENT_WORKSPACE_DEFAULT_LEFT_PANE_RATIO,
  ASSESSMENT_WORKSPACE_DIVIDER_WIDTH_PX,
  ASSESSMENT_WORKSPACE_HUD_RESIZE_HANDLE_HEIGHT,
  ASSESSMENT_WORKSPACE_MAX_LEFT_PANE_RATIO,
  ASSESSMENT_WORKSPACE_MIN_HUD_HEIGHT,
  ASSESSMENT_WORKSPACE_MIN_LEFT_PANE_RATIO,
  ASSESSMENT_WORKSPACE_MIN_PREVIEW_HEIGHT,
  ASSESSMENT_WORKSPACE_TOP_BAR_HEIGHT,
} from "./AssessmentWorkspaceLayout";

function clampNumber(
  value: number,
  minimum: number,
  maximum: number
): number {
  return Math.min(
    maximum,
    Math.max(
      minimum,
      value
    )
  );
}

export function useAssessmentWorkspaceLayout() {
  const layoutRef =
    useRef<HTMLDivElement | null>(
      null
    );

  const hudResizeStartRef =
    useRef<{
      startY: number;
      startHeight: number;
    } | null>(null);

  const hudDragLatestClientYRef =
    useRef<number | null>(
      null
    );

  const hudDragFrameRef =
    useRef<number | null>(
      null
    );

  const [
    leftPaneRatio,
    setLeftPaneRatio,
  ] = useState<number>(
    ASSESSMENT_WORKSPACE_DEFAULT_LEFT_PANE_RATIO
  );

  const [
    isDraggingDivider,
    setIsDraggingDivider,
  ] = useState(false);

  const [
    hudHeight,
    setHudHeight,
  ] = useState<number>(
    ASSESSMENT_WORKSPACE_DEFAULT_HUD_HEIGHT
  );

  const [
    isDraggingHud,
    setIsDraggingHud,
  ] = useState(false);

  const [
    showProgressPanel,
    setShowProgressPanel,
  ] = useState(true);

  const getMaxHudHeight =
    useCallback(() => {
      if (!layoutRef.current) {
        return Math.max(
          ASSESSMENT_WORKSPACE_DEFAULT_HUD_HEIGHT,
          280
        );
      }

      const layoutHeight =
        layoutRef.current
          .getBoundingClientRect()
          .height;

      const availableHeight =
        layoutHeight -
        ASSESSMENT_WORKSPACE_TOP_BAR_HEIGHT -
        ASSESSMENT_WORKSPACE_MIN_PREVIEW_HEIGHT -
        ASSESSMENT_WORKSPACE_HUD_RESIZE_HANDLE_HEIGHT;

      return Math.max(
        ASSESSMENT_WORKSPACE_DEFAULT_HUD_HEIGHT,
        Math.floor(
          availableHeight
        )
      );
    }, []);

  const clampHudHeight =
    useCallback(
      (
        value: number
      ) => {
        return clampNumber(
          value,
          ASSESSMENT_WORKSPACE_MIN_HUD_HEIGHT,
          getMaxHudHeight()
        );
      },
      [getMaxHudHeight]
    );

  const resetLayout =
    useCallback(() => {
      setLeftPaneRatio(
        ASSESSMENT_WORKSPACE_DEFAULT_LEFT_PANE_RATIO
      );

      setHudHeight(
        ASSESSMENT_WORKSPACE_DEFAULT_HUD_HEIGHT
      );

      setShowProgressPanel(
        true
      );

      try {
        window.localStorage.removeItem(
          ASSESSMENT_CREATION_STORAGE_KEY_PAIRS
            .paneRatio.current
        );

        window.localStorage.removeItem(
          ASSESSMENT_CREATION_STORAGE_KEY_PAIRS
            .hudHeight.current
        );

        window.localStorage.removeItem(
          ASSESSMENT_CREATION_STORAGE_KEY_PAIRS
            .showProgressPanel.current
        );
      } catch {
        // Preserve historical behaviour:
        // storage failures do not block the workspace.
      }
    }, []);

  useEffect(() => {
    try {
      const rawPaneRatio =
        window.localStorage.getItem(
          ASSESSMENT_CREATION_STORAGE_KEY_PAIRS
            .paneRatio.current
        );

      if (rawPaneRatio) {
        const parsed =
          Number(
            rawPaneRatio
          );

        if (
          Number.isFinite(
            parsed
          )
        ) {
          setLeftPaneRatio(
            clampNumber(
              parsed,
              ASSESSMENT_WORKSPACE_MIN_LEFT_PANE_RATIO,
              ASSESSMENT_WORKSPACE_MAX_LEFT_PANE_RATIO
            )
          );
        }
      }

      const rawHudHeight =
        window.localStorage.getItem(
          ASSESSMENT_CREATION_STORAGE_KEY_PAIRS
            .hudHeight.current
        );

      if (rawHudHeight) {
        const parsedHudHeight =
          Number(
            rawHudHeight
          );

        if (
          Number.isFinite(
            parsedHudHeight
          )
        ) {
          setHudHeight(
            clampHudHeight(
              parsedHudHeight
            )
          );
        }
      }

      const rawShowProgressPanel =
        window.localStorage.getItem(
          ASSESSMENT_CREATION_STORAGE_KEY_PAIRS
            .showProgressPanel.current
        );

      if (
        rawShowProgressPanel ===
        "true"
      ) {
        setShowProgressPanel(
          true
        );
      }

      if (
        rawShowProgressPanel ===
        "false"
      ) {
        setShowProgressPanel(
          false
        );
      }
    } catch {
      // Preserve historical behaviour:
      // storage failures do not block the workspace.
    }
  }, [clampHudHeight]);

  useEffect(() => {
    document.body.classList.toggle(
      "dragging-divider",
      isDraggingDivider
    );

    document.body.classList.toggle(
      "dragging-hud",
      isDraggingHud
    );

    const previousUserSelect =
      document.body.style.userSelect;

    const previousWebkitUserSelect =
      document.body.style
        .webkitUserSelect;

    const previousCursor =
      document.body.style.cursor;

    const previousOverscrollBehavior =
      document.body.style
        .overscrollBehavior;

    if (isDraggingDivider) {
      document.body.style.userSelect =
        "none";

      document.body.style.webkitUserSelect =
        "none";

      document.body.style.cursor =
        "col-resize";

      document.body.style.overscrollBehavior =
        "none";
    }

    if (isDraggingHud) {
      document.body.style.userSelect =
        "none";

      document.body.style.webkitUserSelect =
        "none";

      document.body.style.cursor =
        "row-resize";

      document.body.style.overscrollBehavior =
        "none";
    }

    return () => {
      document.body.classList.remove(
        "dragging-divider"
      );

      document.body.classList.remove(
        "dragging-hud"
      );

      document.body.style.userSelect =
        previousUserSelect;

      document.body.style.webkitUserSelect =
        previousWebkitUserSelect;

      document.body.style.cursor =
        previousCursor;

      document.body.style.overscrollBehavior =
        previousOverscrollBehavior;
    };
  }, [
    isDraggingDivider,
    isDraggingHud,
  ]);

  useEffect(() => {
    const handleMouseMove = (
      event: MouseEvent
    ) => {
      if (
        !isDraggingDivider ||
        !layoutRef.current
      ) {
        return;
      }

      event.preventDefault();

      const rect =
        layoutRef.current
          .getBoundingClientRect();

      const usableWidth =
        rect.width -
        ASSESSMENT_WORKSPACE_DIVIDER_WIDTH_PX;

      if (
        usableWidth <= 0
      ) {
        return;
      }

      const nextRatio =
        (
          event.clientX -
          rect.left
        ) /
        usableWidth;

      setLeftPaneRatio(
        clampNumber(
          nextRatio,
          ASSESSMENT_WORKSPACE_MIN_LEFT_PANE_RATIO,
          ASSESSMENT_WORKSPACE_MAX_LEFT_PANE_RATIO
        )
      );
    };

    const handleMouseUp = () => {
      setIsDraggingDivider(
        false
      );
    };

    window.addEventListener(
      "mousemove",
      handleMouseMove
    );

    window.addEventListener(
      "mouseup",
      handleMouseUp
    );

    return () => {
      window.removeEventListener(
        "mousemove",
        handleMouseMove
      );

      window.removeEventListener(
        "mouseup",
        handleMouseUp
      );
    };
  }, [isDraggingDivider]);

  useEffect(() => {
    if (!showProgressPanel) {
      return;
    }

    const flushHudResizeFrame =
      () => {
        hudDragFrameRef.current =
          null;

        const start =
          hudResizeStartRef.current;

        const latestClientY =
          hudDragLatestClientYRef.current;

        if (
          !start ||
          latestClientY === null
        ) {
          return;
        }

        const delta =
          start.startY -
          latestClientY;

        const nextHeight =
          clampHudHeight(
            start.startHeight +
              delta
          );

        setHudHeight(
          nextHeight
        );
      };

    const requestHudResizeFrame =
      () => {
        if (
          hudDragFrameRef.current !==
          null
        ) {
          return;
        }

        hudDragFrameRef.current =
          window.requestAnimationFrame(
            flushHudResizeFrame
          );
      };

    const handleMouseMove = (
      event: MouseEvent
    ) => {
      const start =
        hudResizeStartRef.current;

      if (!start) {
        return;
      }

      event.preventDefault();

      hudDragLatestClientYRef.current =
        event.clientY;

      requestHudResizeFrame();
    };

    const handleMouseUp = () => {
      hudResizeStartRef.current =
        null;

      hudDragLatestClientYRef.current =
        null;

      if (
        hudDragFrameRef.current !==
        null
      ) {
        window.cancelAnimationFrame(
          hudDragFrameRef.current
        );

        hudDragFrameRef.current =
          null;
      }

      setIsDraggingHud(
        false
      );
    };

    window.addEventListener(
      "mousemove",
      handleMouseMove
    );

    window.addEventListener(
      "mouseup",
      handleMouseUp
    );

    return () => {
      window.removeEventListener(
        "mousemove",
        handleMouseMove
      );

      window.removeEventListener(
        "mouseup",
        handleMouseUp
      );

      if (
        hudDragFrameRef.current !==
        null
      ) {
        window.cancelAnimationFrame(
          hudDragFrameRef.current
        );

        hudDragFrameRef.current =
          null;
      }
    };
  }, [
    showProgressPanel,
    clampHudHeight,
  ]);

  useEffect(() => {
    const handleResize = () => {
      setHudHeight(
        (current) =>
          clampHudHeight(
            current
          )
      );
    };

    handleResize();

    window.addEventListener(
      "resize",
      handleResize
    );

    return () => {
      window.removeEventListener(
        "resize",
        handleResize
      );
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