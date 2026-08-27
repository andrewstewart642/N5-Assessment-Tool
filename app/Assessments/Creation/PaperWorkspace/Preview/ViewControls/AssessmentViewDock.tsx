

import {
  useEffect,
  useRef,
  useState,
} from "react";

import type {
  AppTheme,
} from "@/app/UI/Application/Theme/AppTheme";

import {
  UI_TEXT,
} from "@/app/UI/Application/Typography/Typography";

import type {
  AssessmentPreviewViewMode,
} from "../../PreviewViewMode";

import PreviewEdgeTab, {
  PREVIEW_EDGE_TAB_WIDTH,
} from "../EdgeTabs/PreviewEdgeTab";

import AssessmentViewModeControl from "./AssessmentViewModeControl";

type AssessmentViewDockProps = {
  theme:
    AppTheme;

  previewViewMode:
    AssessmentPreviewViewMode;

  onPreviewViewModeChange: (
    mode:
      AssessmentPreviewViewMode
  ) => void;
};

const VIEW_PANEL_WIDTH =
  220;

export default function AssessmentViewDock({
  theme,
  previewViewMode,
  onPreviewViewModeChange,
}: AssessmentViewDockProps) {
  const [
    open,
    setOpen,
  ] =
    useState(
      false
    );

  const dockRef =
    useRef<HTMLDivElement | null>(
      null
    );

  useEffect(() => {
    function handlePointerDown(
      event:
        MouseEvent
    ) {
      if (
        !open ||
        !dockRef.current
      ) {
        return;
      }

      if (
        dockRef.current.contains(
          event.target as Node
        )
      ) {
        return;
      }

      setOpen(
        false
      );
    }

    function handleKeyDown(
      event:
        KeyboardEvent
    ) {
      if (
        event.key ===
        "Escape"
      ) {
        setOpen(
          false
        );
      }
    }

    window.addEventListener(
      "mousedown",
      handlePointerDown
    );

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "mousedown",
        handlePointerDown
      );

      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [
    open,
  ]);

  return (
    <div
      ref={
        dockRef
      }
      style={{
        width:
          VIEW_PANEL_WIDTH +
          PREVIEW_EDGE_TAB_WIDTH,

        display:
          "flex",

        alignItems:
          "flex-start",

        transform:
          open
            ? "translateX(0)"
            : `translateX(${VIEW_PANEL_WIDTH}px)`,

        transition:
          "transform 220ms cubic-bezier(0.2, 0.8, 0.2, 1)",

        willChange:
          "transform",
      }}
    >
      <div
        style={{
          width:
            VIEW_PANEL_WIDTH,

          flexShrink:
            0,

          padding:
            10,

          boxSizing:
            "border-box",

          border:
            `1px solid ${theme.borderStandard}`,

          borderRight:
            "none",

          borderRadius:
            "6px 0 0 6px",

          background:
            theme.bgElevated,

          boxShadow:
            theme.shadow,

          display:
            "grid",

          gap:
            8,
        }}
      >
        <div
          style={{
            ...UI_TEXT.sectionLabel,

            color:
              theme.textMuted,
          }}
        >
          Preview mode
        </div>

        <AssessmentViewModeControl
          value={
            previewViewMode
          }
          onChange={
            onPreviewViewModeChange
          }
          theme={
            theme
          }
        />
      </div>

      <PreviewEdgeTab
        label="View"
        open={
          open
        }
        onClick={() =>
          setOpen(
            (
              previous
            ) =>
              !previous
          )
        }
        theme={
          theme
        }
      />
    </div>
  );
}