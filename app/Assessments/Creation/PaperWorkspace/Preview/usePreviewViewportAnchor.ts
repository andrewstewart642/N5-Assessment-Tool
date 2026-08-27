import {
  useCallback,
  useEffect,
  useRef,
  type RefObject,
} from "react";

type PreviewViewportAnchor = {
  pageIndex: number;
  pageRatio: number;
};

type UsePreviewViewportAnchorArgs = {
  previewPaneRef:
    RefObject<HTMLDivElement | null>;

  pageWrapperRefs:
    RefObject<
      Array<HTMLDivElement | null>
    >;
};

function clamp(
  value: number,
  minimum: number,
  maximum: number
) {
  return Math.max(
    minimum,
    Math.min(
      maximum,
      value
    )
  );
}

export function usePreviewViewportAnchor({
  previewPaneRef,
  pageWrapperRefs,
}: UsePreviewViewportAnchorArgs) {
  const frameRefs =
    useRef<number[]>([]);

  const timeoutRefs =
    useRef<
      Array<
        ReturnType<typeof setTimeout>
      >
    >([]);

  const clearScheduled =
    useCallback(() => {
      frameRefs.current.forEach(
        (frame) => {
          window.cancelAnimationFrame(
            frame
          );
        }
      );

      frameRefs.current =
        [];

      timeoutRefs.current.forEach(
        (timeout) => {
          clearTimeout(
            timeout
          );
        }
      );

      timeoutRefs.current =
        [];
    }, []);

  useEffect(() => {
    return () => {
      clearScheduled();
    };
  }, [
    clearScheduled,
  ]);

  const captureAnchor =
    useCallback(
      (): PreviewViewportAnchor | null => {
        const container =
          previewPaneRef.current;

        if (!container) {
          return null;
        }

        const containerRect =
          container.getBoundingClientRect();

        const viewportCentre =
          containerRect.top +
          containerRect.height / 2;

        let bestIndex =
          -1;

        let bestDistance =
          Number.POSITIVE_INFINITY;

        let bestRatio =
          0;

        pageWrapperRefs.current.forEach(
          (
            node,
            index
          ) => {
            if (!node) {
              return;
            }

            const rect =
              node.getBoundingClientRect();

            if (
              rect.height <= 0
            ) {
              return;
            }

            const pageCentre =
              rect.top +
              rect.height / 2;

            const inside =
              viewportCentre >=
                rect.top &&
              viewportCentre <=
                rect.bottom;

            const distance =
              inside
                ? 0
                : Math.abs(
                    viewportCentre -
                      pageCentre
                  );

            if (
              distance >
              bestDistance
            ) {
              return;
            }

            bestDistance =
              distance;

            bestIndex =
              index;

            bestRatio =
              clamp(
                (
                  viewportCentre -
                  rect.top
                ) /
                  rect.height,
                0,
                1
              );
          }
        );

        if (
          bestIndex < 0
        ) {
          return null;
        }

        return {
          pageIndex:
            bestIndex,

          pageRatio:
            bestRatio,
        };
      },
      [
        previewPaneRef,
        pageWrapperRefs,
      ]
    );

  const restoreAnchor =
    useCallback(
      (
        anchor:
          PreviewViewportAnchor
      ) => {
        const container =
          previewPaneRef.current;

        if (!container) {
          return;
        }

        const nodes =
          pageWrapperRefs.current;

        if (
          nodes.length === 0
        ) {
          return;
        }

        const preferredIndex =
          clamp(
            anchor.pageIndex,
            0,
            nodes.length - 1
          );

        let node =
          nodes[
            preferredIndex
          ];

        if (!node) {
          for (
            let offset = 1;
            offset <
            nodes.length;
            offset += 1
          ) {
            const previous =
              preferredIndex -
              offset;

            const next =
              preferredIndex +
              offset;

            if (
              previous >= 0 &&
              nodes[previous]
            ) {
              node =
                nodes[
                  previous
                ];

              break;
            }

            if (
              next <
                nodes.length &&
              nodes[next]
            ) {
              node =
                nodes[
                  next
                ];

              break;
            }
          }
        }

        if (!node) {
          return;
        }

        const containerRect =
          container.getBoundingClientRect();

        const pageRect =
          node.getBoundingClientRect();

        if (
          pageRect.height <= 0
        ) {
          return;
        }

        const currentViewportCentre =
          containerRect.top +
          containerRect.height / 2;

        const desiredViewportCentre =
          pageRect.top +
          pageRect.height *
            anchor.pageRatio;

        const delta =
          desiredViewportCentre -
          currentViewportCentre;

        if (
          Math.abs(delta) >
          0.5
        ) {
          container.scrollTop +=
            delta;
        }
      },
      [
        previewPaneRef,
        pageWrapperRefs,
      ]
    );

  const preserveViewport =
    useCallback(
      (
        action:
          () => void
      ) => {
        clearScheduled();

        const anchor =
          captureAnchor();

        action();

        if (!anchor) {
          return;
        }

        const firstFrame =
          window.requestAnimationFrame(
            () => {
              const secondFrame =
                window.requestAnimationFrame(
                  () => {
                    restoreAnchor(
                      anchor
                    );
                  }
                );

              frameRefs.current.push(
                secondFrame
              );
            }
          );

        frameRefs.current.push(
          firstFrame
        );

        timeoutRefs.current.push(
          setTimeout(
            () => {
              restoreAnchor(
                anchor
              );
            },
            80
          )
        );

        timeoutRefs.current.push(
          setTimeout(
            () => {
              restoreAnchor(
                anchor
              );
            },
            180
          )
        );
      },
      [
        captureAnchor,
        clearScheduled,
        restoreAnchor,
      ]
    );

  return {
    preserveViewport,
  };
}