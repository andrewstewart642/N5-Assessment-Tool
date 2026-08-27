import type {
  ComponentProps,
} from "react";

import type {
  AppTheme,
} from "@/app/UI/Application/Theme/AppTheme";

import {
  UI_TYPO,
} from "@/app/UI/Application/Typography/Typography";

import type {
  AssessmentSaveStatus,
} from "../Persistence/AssessmentSaveStatus";

import AssessmentHUDBar from "../HUDBar/AssessmentHUDBar";

import AssessmentTopBar from "../TopBar/AssessmentTopBar";

import {
  TOP_BAR_HEIGHT,
} from "../TopBar/AssessmentTopBarTokens";

import type {
  AssessmentPreviewViewMode,
} from "./PreviewViewMode";

import {
  ASSESSMENT_WORKSPACE_HUD_RESIZE_HANDLE_HEIGHT,
} from "./AssessmentWorkspaceLayout";

import AssessmentPreviewPane from "./Preview/AssessmentPreviewPane";

import AssessmentSaveStatusPill from "./Preview/AssessmentSaveStatusPill";

import PreviewZoomControls from "./Preview/PreviewZoomControls";

import AssessmentViewDock from "./Preview/ViewControls/AssessmentViewDock";

import {
  usePreviewChromeVisibility,
} from "./Preview/usePreviewChromeVisibility";

import {
  usePreviewViewportAnchor,
} from "./Preview/usePreviewViewportAnchor";

type AssessmentTopBarProps =
  ComponentProps<
    typeof AssessmentTopBar
  >;

type AssessmentPreviewPaneProps =
  ComponentProps<
    typeof AssessmentPreviewPane
  >;

type AssessmentHUDBarProps =
  ComponentProps<
    typeof AssessmentHUDBar
  >;

type PreviewChromeProps = {
  zoomPct:
    number;

  zoomIn:
    () => void;

  zoomOut:
    () => void;

  currentViewerPage:
    number;

  totalViewerPages:
    number;
};

type ViewControlsProps = {
  previewViewMode:
    AssessmentPreviewViewMode;

  onPreviewViewModeChange: (
    mode:
      AssessmentPreviewViewMode
  ) => void;
};

type AssessmentPaperWorkspaceProps = {
  theme:
    AppTheme;

  viewerHudRow:
    string;

  showPreviewAnswers:
    boolean;

  saveStatus:
    AssessmentSaveStatus;

  topBarProps:
    Omit<
      AssessmentTopBarProps,
      "theme"
    >;

  previewChromeProps:
    PreviewChromeProps;

  viewControlsProps:
    ViewControlsProps;

  previewProps:
    Omit<
      AssessmentPreviewPaneProps,
      | "theme"
      | "showWorkedAnswers"
    >;

  hudProps:
    Omit<
      AssessmentHUDBarProps,
      "theme"
    >;
};

const PANE_OUTER_GUTTER =
  4;

const PANE_RADIUS =
  6;

const PREVIEW_ZOOM_TOP_GAP =
  8;

/*
 * Future right-edge Settings tab:
 *
 * TOP_BAR_HEIGHT + 8px
 *
 * View deliberately begins beneath that
 * reserved slot so we never need to move
 * it when Settings is introduced.
 */
const PREVIEW_EDGE_FIRST_TAB_TOP_GAP =
  8;

const PREVIEW_EDGE_RESERVED_SETTINGS_HEIGHT =
  34;

const PREVIEW_EDGE_TAB_GAP =
  8;

const PREVIEW_VIEW_DOCK_TOP =
  TOP_BAR_HEIGHT +
  PREVIEW_EDGE_FIRST_TAB_TOP_GAP +
  PREVIEW_EDGE_RESERVED_SETTINGS_HEIGHT +
  PREVIEW_EDGE_TAB_GAP;

const RESIZE_DOT_SIZE =
  2;

const RESIZE_DOT_GAP =
  3;

export default function AssessmentPaperWorkspace({
  theme,
  viewerHudRow,
  showPreviewAnswers,
  saveStatus,
  topBarProps,
  previewChromeProps,
  viewControlsProps,
  previewProps,
  hudProps,
}: AssessmentPaperWorkspaceProps) {
  const showHud =
    hudProps.showProgressPanel;

  const {
    preserveViewport,
  } =
    usePreviewViewportAnchor({
      previewPaneRef:
        previewProps.previewPaneRef,

      pageWrapperRefs:
        previewProps.pageWrapperRefs,
    });

  const {
    opacity:
      zoomChromeOpacity,

    notifyActivity:
      notifyPreviewActivity,
  } =
    usePreviewChromeVisibility({
      previewPaneRef:
        previewProps.previewPaneRef,

      zoomPct:
        previewChromeProps.zoomPct,

      currentViewerPage:
        previewChromeProps.currentViewerPage,

      idleMs:
        7000,
    });

  function changePreviewViewMode(
    mode:
      AssessmentPreviewViewMode
  ) {
    if (
      mode ===
      viewControlsProps.previewViewMode
    ) {
      return;
    }

    preserveViewport(
      () => {
        viewControlsProps.onPreviewViewModeChange(
          mode
        );
      }
    );
  }

  return (
    <section
      data-preview-answers={
        showPreviewAnswers
          ? "shown"
          : "hidden"
      }
      style={{
        background:
          theme.bgPage,

        display:
          "grid",

        gridTemplateRows:
          `minmax(0, 1fr) ${
            showHud
              ? ASSESSMENT_WORKSPACE_HUD_RESIZE_HANDLE_HEIGHT
              : 0
          }px ${viewerHudRow}`,

        minWidth:
          0,

        minHeight:
          0,

        height:
          "100%",

        padding:
          `${PANE_OUTER_GUTTER}px ${PANE_OUTER_GUTTER}px ${PANE_OUTER_GUTTER}px 0`,

        boxSizing:
          "border-box",

        overflow:
          "hidden",

        position:
          "relative",

        fontFamily:
          UI_TYPO.family,
      }}
    >
      <div
        style={{
          minWidth:
            0,

          minHeight:
            0,

          width:
            "100%",

          height:
            "100%",

          display:
            "grid",

          gridTemplateRows:
            `${TOP_BAR_HEIGHT}px minmax(0, 1fr)`,

          position:
            "relative",

          background:
            theme.bgSurface,

          border:
            `1px solid ${theme.borderStandard}`,

          borderRadius:
            PANE_RADIUS,

          overflow:
            "hidden",

          boxSizing:
            "border-box",
        }}
      >
        <AssessmentTopBar
          {...topBarProps}
          theme={
            theme
          }
        />

        <AssessmentPreviewPane
          {...previewProps}
          theme={
            theme
          }
          showWorkedAnswers={
            showPreviewAnswers
          }
        />

        <div
          style={{
            position:
              "absolute",

            left:
              "50%",

            top:
              TOP_BAR_HEIGHT +
              PREVIEW_ZOOM_TOP_GAP,

            transform:
              "translateX(-50%)",

            zIndex:
              20,

            pointerEvents:
              "auto",
          }}
        >
          <PreviewZoomControls
            theme={
              theme
            }

            zoomPct={
              previewChromeProps.zoomPct
            }

            zoomIn={
              previewChromeProps.zoomIn
            }

            zoomOut={
              previewChromeProps.zoomOut
            }

            currentViewerPage={
              previewChromeProps.currentViewerPage
            }

            totalViewerPages={
              previewChromeProps.totalViewerPages
            }

            opacity={
              zoomChromeOpacity
            }

            onActivity={
              notifyPreviewActivity
            }
          />
        </div>

        <div
          style={{
            position:
              "absolute",

            top:
              PREVIEW_VIEW_DOCK_TOP,

            right:
              -1,

            zIndex:
              30,

            pointerEvents:
              "auto",
          }}
        >
          <AssessmentViewDock
            theme={
              theme
            }

            previewViewMode={
              viewControlsProps.previewViewMode
            }

            onPreviewViewModeChange={
              changePreviewViewMode
            }
          />
        </div>

        <AssessmentSaveStatusPill
          theme={
            theme
          }
          status={
            saveStatus
          }
        />
      </div>

      {showHud ? (
        <div
          onMouseDown={(
            event
          ) => {
            event.preventDefault();
            event.stopPropagation();

            hudProps
              .hudResizeStartRef
              .current = {
              startY:
                event.clientY,

              startHeight:
                hudProps.hudHeight,
            };

            hudProps.setIsDraggingHud(
              true
            );
          }}
          title="Drag to resize notes panel"
          style={{
            minWidth:
              0,

            minHeight:
              0,

            width:
              "100%",

            height:
              ASSESSMENT_WORKSPACE_HUD_RESIZE_HANDLE_HEIGHT,

            display:
              "grid",

            placeItems:
              "center",

            background:
              theme.bgPage,

            cursor:
              "row-resize",

            userSelect:
              "none",

            WebkitUserSelect:
              "none",
          }}
        >
          <div
            aria-hidden="true"
            style={{
              display:
                "grid",

              gridTemplateColumns:
                `repeat(3, ${RESIZE_DOT_SIZE}px)`,

              gap:
                RESIZE_DOT_GAP,

              placeItems:
                "center",

              pointerEvents:
                "none",
            }}
          >
            {[
              0,
              1,
              2,
            ].map(
              (
                dot
              ) => (
                <span
                  key={
                    dot
                  }
                  style={{
                    width:
                      RESIZE_DOT_SIZE,

                    height:
                      RESIZE_DOT_SIZE,

                    borderRadius:
                      999,

                    background:
                      theme.textMuted,

                    opacity:
                      0.48,
                  }}
                />
              )
            )}
          </div>
        </div>
      ) : (
        <div />
      )}

      <AssessmentHUDBar
        {...hudProps}
        theme={
          theme
        }
      />
    </section>
  );
}