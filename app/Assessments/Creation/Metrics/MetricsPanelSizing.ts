import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from "react";

const METRICS_PANEL_HEIGHT_STORAGE_KEY =
  "assessment_builder_metrics_panel_height_v3";

const FALLBACK_METRICS_PANEL_HEIGHT =
  180;

const MIN_METRICS_PANEL_HEIGHT =
  104;

/**
 * A teacher may deliberately drag Metrics well up into the Skills Tree. Keep
 * only enough of the tree above it for the filter area to remain recoverable;
 * the tree itself continues to scroll within whatever space remains.
 */
const MIN_SKILLS_PANEL_HEIGHT =
  220;

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

export function useMetricsPanelSizing({
  isOpen,
}: {
  isOpen: boolean;
}) {
  const panelRef =
    useRef<HTMLElement | null>(
      null
    );

  const resizeStartRef =
    useRef<{
      startY: number;
      startHeight: number;
    } | null>(null);

  const hasManualHeightRef =
    useRef(false);

  const [
    panelHeight,
    setPanelHeight,
  ] =
    useState(
      FALLBACK_METRICS_PANEL_HEIGHT
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
          FALLBACK_METRICS_PANEL_HEIGHT,
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

  const getNaturalFitHeight =
    useCallback(() => {
      const panel =
        panelRef.current;

      const parent =
        panel?.parentElement;

      const skillsPanel =
        panel
          ?.previousElementSibling as
          HTMLElement | null;

      const skillsScroll =
        skillsPanel
          ?.querySelector<HTMLElement>(
            ".skills-tree-scroll"
          );

      if (
        !parent ||
        !skillsPanel ||
        !skillsScroll
      ) {
        return clampPanelHeight(
          FALLBACK_METRICS_PANEL_HEIGHT
        );
      }

      const parentHeight =
        parent
          .getBoundingClientRect()
          .height;

      const skillsRect =
        skillsPanel
          .getBoundingClientRect();

      const scrollRect =
        skillsScroll
          .getBoundingClientRect();

      const fixedSkillsChrome =
        Math.max(
          0,
          skillsRect.height -
          scrollRect.height
        );

      const scrollStyles =
        window.getComputedStyle(
          skillsScroll
        );

      const bottomPadding =
        Number.parseFloat(
          scrollStyles.paddingBottom
        ) || 0;

      const lastTreeRow =
        skillsScroll
          .lastElementChild as
          HTMLElement | null;

      const naturalTreeContentHeight =
        lastTreeRow
          ? Math.max(
              0,
              lastTreeRow
                .getBoundingClientRect()
                .bottom -
              scrollRect.top +
              skillsScroll.scrollTop +
              bottomPadding
            )
          : bottomPadding;

      const naturalSkillsHeight =
        fixedSkillsChrome +
        naturalTreeContentHeight +
        2;

      return clampPanelHeight(
        parentHeight -
        naturalSkillsHeight
      );
    }, [
      clampPanelHeight,
    ]);

  const fitToUnusedTreeSpace =
    useCallback(() => {
      setPanelHeight(
        getNaturalFitHeight()
      );
    }, [
      getNaturalFitHeight,
    ]);

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
        hasManualHeightRef.current =
          true;

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
    if (
      !isOpen ||
      hasManualHeightRef.current
    ) {
      return;
    }

    const frame =
      window.requestAnimationFrame(
        fitToUnusedTreeSpace
      );

    return () => {
      window.cancelAnimationFrame(
        frame
      );
    };
  }, [
    isOpen,
    fitToUnusedTreeSpace,
  ]);

  useEffect(() => {
    const handleResize = () => {
      if (
        isOpen &&
        !hasManualHeightRef.current
      ) {
        fitToUnusedTreeSpace();
        return;
      }

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
    isOpen,
    clampPanelHeight,
    fitToUnusedTreeSpace,
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
    if (
      !hasManualHeightRef.current
    ) {
      return;
    }

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

        hasManualHeightRef.current =
          true;

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
      hasManualHeightRef.current =
        false;

      try {
        window.localStorage.removeItem(
          METRICS_PANEL_HEIGHT_STORAGE_KEY
        );
      } catch {
        // Workspace preferences are intentionally best-effort.
      }

      fitToUnusedTreeSpace();
    }, [
      fitToUnusedTreeSpace,
    ]);

  return {
    panelRef,
    panelHeight,
    isDragging,
    beginResize,
    resetHeight,
  };
}
