import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from "react";

const METRICS_PANEL_HEIGHT_STORAGE_KEY =
  "assessment_builder_metrics_panel_height_v1";

const DEFAULT_METRICS_PANEL_HEIGHT =
  150;

const MIN_METRICS_PANEL_HEIGHT =
  104;

/**
 * Keep enough vertical room above Metrics for the Skills Tree controls and
 * navigation to remain genuinely usable while the lower explorer is open.
 */
const MIN_SKILLS_PANEL_HEIGHT =
  330;

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

export function useMetricsPanelSizing() {
  const panelRef =
    useRef<HTMLElement | null>(
      null
    );

  const resizeStartRef =
    useRef<{
      startY: number;
      startHeight: number;
    } | null>(null);

  const [
    panelHeight,
    setPanelHeight,
  ] =
    useState(
      DEFAULT_METRICS_PANEL_HEIGHT
    );

  const [
    isDragging,
    setIsDragging,
  ] =
    useState(false);

  const getMaximumHeight =
    useCallback(() => {
      const parent =
        panelRef.current
          ?.parentElement;

      if (!parent) {
        return Math.max(
          DEFAULT_METRICS_PANEL_HEIGHT,
          MIN_METRICS_PANEL_HEIGHT
        );
      }

      const parentHeight =
        parent
          .getBoundingClientRect()
          .height;

      return Math.max(
        MIN_METRICS_PANEL_HEIGHT,
        Math.floor(
          parentHeight -
          MIN_SKILLS_PANEL_HEIGHT
        )
      );
    }, []);

  const clampPanelHeight =
    useCallback(
      (value: number) =>
        clampNumber(
          value,
          MIN_METRICS_PANEL_HEIGHT,
          getMaximumHeight()
        ),
      [
        getMaximumHeight,
      ]
    );

  useEffect(() => {
    try {
      const raw =
        window.localStorage.getItem(
          METRICS_PANEL_HEIGHT_STORAGE_KEY
        );

      if (!raw) {
        return;
      }

      const parsed =
        Number(raw);

      if (
        Number.isFinite(parsed)
      ) {
        setPanelHeight(
          clampPanelHeight(
            parsed
          )
        );
      }
    } catch {
      // Workspace preferences must never prevent Metrics from rendering.
    }
  }, [
    clampPanelHeight,
  ]);

  useEffect(() => {
    const handleResize = () => {
      setPanelHeight(
        (current) =>
          clampPanelHeight(
            current
          )
      );
    };

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
  }, [
    clampPanelHeight,
  ]);

  useEffect(() => {
    if (!isDragging) {
      return;
    }

    const previousUserSelect =
      document.body.style.userSelect;

    const previousCursor =
      document.body.style.cursor;

    document.body.style.userSelect =
      "none";

    document.body.style.cursor =
      "row-resize";

    const handleMouseMove = (
      event: MouseEvent
    ) => {
      const start =
        resizeStartRef.current;

      if (!start) {
        return;
      }

      event.preventDefault();

      const delta =
        start.startY -
        event.clientY;

      setPanelHeight(
        clampPanelHeight(
          start.startHeight +
          delta
        )
      );
    };

    const handleMouseUp = () => {
      resizeStartRef.current =
        null;

      setIsDragging(false);
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

      document.body.style.userSelect =
        previousUserSelect;

      document.body.style.cursor =
        previousCursor;
    };
  }, [
    isDragging,
    clampPanelHeight,
  ]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        METRICS_PANEL_HEIGHT_STORAGE_KEY,
        String(panelHeight)
      );
    } catch {
      // Workspace preferences are intentionally best-effort.
    }
  }, [
    panelHeight,
  ]);

  const beginResize =
    useCallback(
      (
        event:
          ReactMouseEvent<HTMLDivElement>
      ) => {
        event.preventDefault();

        resizeStartRef.current = {
          startY:
            event.clientY,
          startHeight:
            panelHeight,
        };

        setIsDragging(true);
      },
      [
        panelHeight,
      ]
    );

  const resetHeight =
    useCallback(() => {
      setPanelHeight(
        clampPanelHeight(
          DEFAULT_METRICS_PANEL_HEIGHT
        )
      );
    }, [
      clampPanelHeight,
    ]);

  return {
    panelRef,
    panelHeight,
    isDragging,
    beginResize,
    resetHeight,
  };
}
