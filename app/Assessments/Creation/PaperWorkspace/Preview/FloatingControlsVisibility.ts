import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";

type UsePreviewChromeVisibilityArgs = {
  previewPaneRef:
    RefObject<
      HTMLDivElement | null
    >;

  zoomPct:
    number;

  currentViewerPage:
    number;

  idleMs?:
    number;
};

export function usePreviewChromeVisibility({
  previewPaneRef,
  zoomPct,
  currentViewerPage,
  idleMs = 7000,
}: UsePreviewChromeVisibilityArgs) {
  const [
    active,
    setActive,
  ] =
    useState(
      true
    );

  const timeoutRef =
    useRef<
      ReturnType<
        typeof setTimeout
      > | null
    >(
      null
    );

  const notifyActivity =
    useCallback(() => {
      setActive(
        true
      );

      if (
        timeoutRef.current
      ) {
        clearTimeout(
          timeoutRef.current
        );
      }

      timeoutRef.current =
        setTimeout(
          () => {
            setActive(
              false
            );
          },
          idleMs
        );
    }, [
      idleMs,
    ]);

  useEffect(() => {
    notifyActivity();

    return () => {
      if (
        timeoutRef.current
      ) {
        clearTimeout(
          timeoutRef.current
        );
      }
    };
  }, [
    notifyActivity,
  ]);

  useEffect(() => {
    const element =
      previewPaneRef.current;

    if (
      !element
    ) {
      return;
    }

    const handleActivity =
      () => {
        notifyActivity();
      };

    element.addEventListener(
      "scroll",
      handleActivity,
      {
        passive:
          true,
      }
    );

    element.addEventListener(
      "wheel",
      handleActivity,
      {
        passive:
          true,
      }
    );

    element.addEventListener(
      "touchmove",
      handleActivity,
      {
        passive:
          true,
      }
    );

    const resizeObserver =
      new ResizeObserver(
        handleActivity
      );

    resizeObserver.observe(
      element
    );

    return () => {
      element.removeEventListener(
        "scroll",
        handleActivity
      );

      element.removeEventListener(
        "wheel",
        handleActivity
      );

      element.removeEventListener(
        "touchmove",
        handleActivity
      );

      resizeObserver.disconnect();
    };
  }, [
    previewPaneRef,
    notifyActivity,
  ]);

  useEffect(() => {
    notifyActivity();
  }, [
    zoomPct,
    currentViewerPage,
    notifyActivity,
  ]);

  return {
    opacity:
      active
        ? 0.98
        : 0.28,

    notifyActivity,
  };
}