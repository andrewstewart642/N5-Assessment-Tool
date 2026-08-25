import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";

import type {
  Skill,
} from "@/shared-types/AssessmentTypes";

import type { AppTheme } from "@/src/UI/Application/Theme/AppTheme";

const OVERLAY_SCROLLBAR_MIN_THUMB =
  36;

export type SkillsTreeScrollMetrics = {
  isScrollable: boolean;

  thumbHeight: number;

  thumbTop: number;
};

type UseSkillsTreeOverlayScrollbarArgs = {
  skillsData:
    Record<string, Skill[]>;

  collapsedCategories:
    Record<string, boolean>;

  expandedSkillIds:
    string[];

  theme: AppTheme;
};

export function useSkillsTreeOverlayScrollbar({
  skillsData,
  collapsedCategories,
  expandedSkillIds,
  theme,
}: UseSkillsTreeOverlayScrollbarArgs) {
  const scrollRef =
    useRef<HTMLDivElement | null>(
      null
    );

  const dragStateRef =
    useRef<{
      startY: number;

      startScrollTop:
        number;

      scrollTopMax:
        number;

      travelMax:
        number;
    } | null>(null);

  const [
    scrollMetrics,
    setScrollMetrics,
  ] =
    useState<SkillsTreeScrollMetrics>({
      isScrollable:
        false,

      thumbHeight:
        OVERLAY_SCROLLBAR_MIN_THUMB,

      thumbTop: 0,
    });

  const [
    trackHovered,
    setTrackHovered,
  ] =
    useState(false);

  const [
    thumbHovered,
    setThumbHovered,
  ] =
    useState(false);

  const [
    draggingThumb,
    setDraggingThumb,
  ] =
    useState(false);

  const updateOverlayScrollbar =
    useCallback(() => {
      const element =
        scrollRef.current;

      if (!element) {
        return;
      }

      const {
        scrollHeight,
        clientHeight,
        scrollTop,
      } = element;

      const isScrollable =
        scrollHeight >
        clientHeight + 1;

      if (!isScrollable) {
        setScrollMetrics({
          isScrollable:
            false,

          thumbHeight:
            OVERLAY_SCROLLBAR_MIN_THUMB,

          thumbTop: 0,
        });

        return;
      }

      const ratio =
        clientHeight /
        scrollHeight;

      const thumbHeight =
        Math.max(
          OVERLAY_SCROLLBAR_MIN_THUMB,

          Math.round(
            clientHeight *
              ratio
          )
        );

      const scrollTopMax =
        Math.max(
          1,

          scrollHeight -
            clientHeight
        );

      const travelMax =
        Math.max(
          0,

          clientHeight -
            thumbHeight
        );

      const thumbTop =
        Math.round(
          (
            scrollTop /
            scrollTopMax
          ) * travelMax
        );

      setScrollMetrics({
        isScrollable:
          true,

        thumbHeight,

        thumbTop,
      });
    }, []);

  useLayoutEffect(() => {
    updateOverlayScrollbar();
  }, [
    skillsData,
    collapsedCategories,
    expandedSkillIds,
    updateOverlayScrollbar,
  ]);

  useEffect(() => {
    const element =
      scrollRef.current;

    if (!element) {
      return;
    }

    updateOverlayScrollbar();

    const handleScroll =
      () =>
        updateOverlayScrollbar();

    element.addEventListener(
      "scroll",
      handleScroll,
      {
        passive: true,
      }
    );

    const resizeObserver =
      new ResizeObserver(() => {
        updateOverlayScrollbar();
      });

    resizeObserver.observe(
      element
    );

    const contentObserver =
      new MutationObserver(() => {
        updateOverlayScrollbar();
      });

    contentObserver.observe(
      element,
      {
        childList: true,
        subtree: true,
        attributes: true,
      }
    );

    window.addEventListener(
      "resize",
      updateOverlayScrollbar
    );

    return () => {
      element.removeEventListener(
        "scroll",
        handleScroll
      );

      resizeObserver.disconnect();

      contentObserver.disconnect();

      window.removeEventListener(
        "resize",
        updateOverlayScrollbar
      );
    };
  }, [
    skillsData,
    collapsedCategories,
    expandedSkillIds,
    updateOverlayScrollbar,
  ]);

  useEffect(() => {
    if (!draggingThumb) {
      return;
    }

    function handlePointerMove(
      event: PointerEvent
    ) {
      const element =
        scrollRef.current;

      const dragState =
        dragStateRef.current;

      if (
        !element ||
        !dragState
      ) {
        return;
      }

      const deltaY =
        event.clientY -
        dragState.startY;

      const scrollRatio =
        dragState.travelMax >
        0
          ? deltaY /
            dragState.travelMax
          : 0;

      element.scrollTop =
        dragState.startScrollTop +
        scrollRatio *
          dragState.scrollTopMax;
    }

    function handlePointerUp() {
      setDraggingThumb(
        false
      );

      dragStateRef.current =
        null;
    }

    window.addEventListener(
      "pointermove",
      handlePointerMove
    );

    window.addEventListener(
      "pointerup",
      handlePointerUp
    );

    return () => {
      window.removeEventListener(
        "pointermove",
        handlePointerMove
      );

      window.removeEventListener(
        "pointerup",
        handlePointerUp
      );
    };
  }, [draggingThumb]);

  const overlayThumbColor =
    useMemo(() => {
      if (
        draggingThumb ||
        thumbHovered
      ) {
        return (
          theme.textSecondary
        );
      }

      return theme.textMuted;
    }, [
      draggingThumb,
      thumbHovered,
      theme.textMuted,
      theme.textSecondary,
    ]);

  function handleTrackMouseEnter() {
    setTrackHovered(true);
  }

  function handleTrackMouseLeave() {
    setTrackHovered(false);

    if (!draggingThumb) {
      setThumbHovered(false);
    }
  }

  function handleThumbMouseEnter() {
    setThumbHovered(true);
  }

  function handleThumbMouseLeave() {
    if (!draggingThumb) {
      setThumbHovered(false);
    }
  }

  function handleTrackPointerDown(
    event:
      ReactPointerEvent<HTMLDivElement>
  ) {
    const element =
      scrollRef.current;

    if (!element) {
      return;
    }

    const track =
      event.currentTarget.getBoundingClientRect();

    const clickY =
      event.clientY -
      track.top;

    const clientHeight =
      element.clientHeight;

    const scrollTopMax =
      Math.max(
        0,

        element.scrollHeight -
          clientHeight
      );

    const travelMax =
      Math.max(
        1,

        clientHeight -
          scrollMetrics.thumbHeight
      );

    const nextThumbTop =
      Math.max(
        0,

        Math.min(
          travelMax,

          clickY -
            scrollMetrics.thumbHeight /
              2
        )
      );

    element.scrollTop =
      (
        nextThumbTop /
        travelMax
      ) * scrollTopMax;
  }

  function handleThumbPointerDown(
    event:
      ReactPointerEvent<HTMLDivElement>
  ) {
    const element =
      scrollRef.current;

    if (!element) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    const scrollTopMax =
      Math.max(
        0,

        element.scrollHeight -
          element.clientHeight
      );

    const travelMax =
      Math.max(
        0,

        element.clientHeight -
          scrollMetrics.thumbHeight
      );

    dragStateRef.current = {
      startY:
        event.clientY,

      startScrollTop:
        element.scrollTop,

      scrollTopMax,

      travelMax,
    };

    setDraggingThumb(true);
  }

  return {
    scrollRef,

    scrollMetrics,

    trackHovered,
    thumbHovered,
    draggingThumb,

    overlayThumbColor,

    handleTrackMouseEnter,
    handleTrackMouseLeave,

    handleThumbMouseEnter,
    handleThumbMouseLeave,

    handleTrackPointerDown,
    handleThumbPointerDown,
  };
}