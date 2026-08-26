"use client";

import {
  useEffect,
  useLayoutEffect,
} from "react";

export function useBuilderWorkspaceDocumentLock() {
  useLayoutEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const previousScrollRestoration =
      window.history.scrollRestoration;

    const previousHtmlOverflow =
      document.documentElement.style.overflow;

    const previousBodyOverflow =
      document.body.style.overflow;

    const previousBodyHeight =
      document.body.style.height;

    window.history.scrollRestoration = "manual";

    const forceTop = () => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "auto",
      });

      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    forceTop();

    const frame =
      window.requestAnimationFrame(() => {
        forceTop();

        document.documentElement.style.overflow =
          "hidden";

        document.body.style.overflow =
          "hidden";

        document.body.style.height =
          "100dvh";
      });

    const timeoutOne =
      window.setTimeout(forceTop, 50);

    const timeoutTwo =
      window.setTimeout(forceTop, 150);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timeoutOne);
      window.clearTimeout(timeoutTwo);

      window.history.scrollRestoration =
        previousScrollRestoration;

      document.documentElement.style.overflow =
        previousHtmlOverflow;

      document.body.style.overflow =
        previousBodyOverflow;

      document.body.style.height =
        previousBodyHeight;
    };
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    const previousHtmlOverflow =
      html.style.overflow;

    const previousHtmlHeight =
      html.style.height;

    const previousHtmlOverscroll =
      html.style.overscrollBehavior;

    const previousBodyOverflow =
      body.style.overflow;

    const previousBodyHeight =
      body.style.height;

    const previousBodyOverscroll =
      body.style.overscrollBehavior;

    html.style.overflow = "hidden";
    html.style.height = "100%";
    html.style.overscrollBehavior = "none";

    body.style.overflow = "hidden";
    body.style.height = "100%";
    body.style.overscrollBehavior = "none";

    return () => {
      html.style.overflow =
        previousHtmlOverflow;

      html.style.height =
        previousHtmlHeight;

      html.style.overscrollBehavior =
        previousHtmlOverscroll;

      body.style.overflow =
        previousBodyOverflow;

      body.style.height =
        previousBodyHeight;

      body.style.overscrollBehavior =
        previousBodyOverscroll;
    };
  }, []);
}