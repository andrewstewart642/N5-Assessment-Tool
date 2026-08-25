import type {
  PointerEventHandler,
} from "react";

import type {
  SkillsTreeScrollMetrics,
} from "./useSkillsTreeOverlayScrollbar";

const OVERLAY_SCROLLBAR_WIDTH =
  5;

const OVERLAY_SCROLLBAR_INSET =
  2;

type SkillsTreeScrollbarProps = {
  scrollMetrics:
    SkillsTreeScrollMetrics;

  trackHovered: boolean;

  thumbHovered: boolean;

  draggingThumb: boolean;

  overlayThumbColor:
    string;

  onTrackMouseEnter:
    () => void;

  onTrackMouseLeave:
    () => void;

  onThumbMouseEnter:
    () => void;

  onThumbMouseLeave:
    () => void;

  onTrackPointerDown:
    PointerEventHandler<HTMLDivElement>;

  onThumbPointerDown:
    PointerEventHandler<HTMLDivElement>;
};

export default function SkillsTreeScrollbar({
  scrollMetrics,

  trackHovered,
  thumbHovered,
  draggingThumb,

  overlayThumbColor,

  onTrackMouseEnter,
  onTrackMouseLeave,

  onThumbMouseEnter,
  onThumbMouseLeave,

  onTrackPointerDown,
  onThumbPointerDown,
}: SkillsTreeScrollbarProps) {
  if (
    !scrollMetrics.isScrollable
  ) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      onMouseEnter={
        onTrackMouseEnter
      }
      onMouseLeave={
        onTrackMouseLeave
      }
      onPointerDown={
        onTrackPointerDown
      }
      style={{
        position:
          "absolute",

        top: 0,

        right:
          OVERLAY_SCROLLBAR_INSET,

        bottom: 0,

        width:
          OVERLAY_SCROLLBAR_WIDTH,

        borderRadius:
          999,

        background:
          trackHovered ||
          draggingThumb
            ? "rgba(15,23,42,0.06)"
            : "transparent",

        transition:
          "background 0.15s ease",

        zIndex: 4,
      }}
    >
      <div
        data-role="skills-tree-scroll-thumb"
        onMouseEnter={
          onThumbMouseEnter
        }
        onMouseLeave={
          onThumbMouseLeave
        }
        onPointerDown={
          onThumbPointerDown
        }
        style={{
          position:
            "absolute",

          top:
            scrollMetrics.thumbTop,

          right: 0,

          width:
            OVERLAY_SCROLLBAR_WIDTH,

          height:
            scrollMetrics.thumbHeight,

          borderRadius:
            999,

          background:
            overlayThumbColor,

          opacity:
            draggingThumb ||
            thumbHovered ||
            trackHovered
              ? 0.82
              : 0.52,

          cursor:
            "grab",

          transition:
            draggingThumb
              ? "none"
              : "background 0.15s ease, opacity 0.15s ease",
        }}
      />
    </div>
  );
}