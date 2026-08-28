import type {
  ComponentProps,
} from "react";

import type {
  Paper,
} from "@/app/Assessments/AssessmentTypes";

import type {
  AssessmentPaperStringMap,
} from "@/app/Assessments/Creation/Papers/AssessmentPaperValueMaps";

import type {
  AppTheme,
} from "@/app/UI/Application/Theme/AppTheme";

import {
  UI_TYPO,
} from "@/app/UI/Application/Typography/Typography";

import type {
  AssessmentSaveStatus,
} from "../Persistence/SaveStatus";

import AssessmentHUDBar from "../HUDBar/AssessmentHUDBar";

import AssessmentTopBar from "../TopBar/TopBar";

import {
  TOP_BAR_HEIGHT,
} from "../TopBar/Dimensions";

import type {
  AssessmentPreviewViewMode,
} from "./PreviewViewMode";

import {
  ASSESSMENT_WORKSPACE_HUD_RESIZE_HANDLE_HEIGHT,
} from "./AssessmentWorkspaceLayout";

import AssessmentPreviewPane from "./Preview/AssessmentPreviewPane";

import AssessmentPreviewTray from "./Preview/PreviewTray/AssessmentPreviewTray";

import type {
  PaperSittingOption,
} from "./Preview/PreviewTray/PaperSittingControls";

import AssessmentSaveStatusPill from "./Preview/AssessmentSaveStatusPill";

import PreviewZoomControls from "./Preview/PreviewZoomControls";

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

  showHud:
    boolean;

  onShowHudChange: (
    next:
      boolean
  ) => void;

  onResetLayout:
    () => void;

  onResetZoom:
    () => void;
};


type SettingsControlsProps = {
  includeCoverSheet:
    boolean;

  onIncludeCoverSheetChange: (
    next:
      boolean
  ) => void;

  includeFormulaSheet:
    boolean;

  onIncludeFormulaSheetChange: (
    next:
      boolean
  ) => void;

  showCoverDateTime:
    boolean;

  onShowCoverDateTimeChange: (
    next:
      boolean
  ) => void;

  showCandidateNumber:
    boolean;

  onShowCandidateNumberChange: (
    next:
      boolean
  ) => void;


  paperOptions:
    PaperSittingOption[];

  coverDateByPaper:
    AssessmentPaperStringMap;

  startTimeByPaper:
    AssessmentPaperStringMap;

  endTimeByPaper:
    AssessmentPaperStringMap;

  onCoverDateChange: (
    paper:
      Paper,

    next:
      string
  ) => void;

  onStartTimeChange: (
    paper:
      Paper,

    next:
      string
  ) => void;

  onEndTimeChange: (
    paper:
      Paper,

    next:
      string
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

  settingsControlsProps:
    SettingsControlsProps;

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

const PREVIEW_TRAY_TOP_GAP =
  8;

const PREVIEW_TRAY_TOP =
  TOP_BAR_HEIGHT +
  PREVIEW_TRAY_TOP_GAP;

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
  settingsControlsProps,
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
              PREVIEW_TRAY_TOP,

            right:
              -1,

            zIndex:
              30,

            pointerEvents:
              "auto",
          }}
        >
          <AssessmentPreviewTray
            theme={
              theme
            }

            previewViewMode={
              viewControlsProps.previewViewMode
            }

            onPreviewViewModeChange={
              changePreviewViewMode
            }

            showHud={
              viewControlsProps.showHud
            }

            onShowHudChange={
              viewControlsProps.onShowHudChange
            }

            onResetLayout={
              viewControlsProps.onResetLayout
            }

            onResetZoom={
              viewControlsProps.onResetZoom
            }

            includeCoverSheet={
              settingsControlsProps.includeCoverSheet
            }

            onIncludeCoverSheetChange={
              settingsControlsProps.onIncludeCoverSheetChange
            }

            includeFormulaSheet={
              settingsControlsProps.includeFormulaSheet
            }

            onIncludeFormulaSheetChange={
              settingsControlsProps.onIncludeFormulaSheetChange
            }

            showCoverDateTime={
              settingsControlsProps.showCoverDateTime
            }

            onShowCoverDateTimeChange={
              settingsControlsProps.onShowCoverDateTimeChange
            }

            showCandidateNumber={
              settingsControlsProps.showCandidateNumber
            }

            onShowCandidateNumberChange={
              settingsControlsProps.onShowCandidateNumberChange
            }

            paperOptions={
              settingsControlsProps.paperOptions
            }

            coverDateByPaper={
              settingsControlsProps.coverDateByPaper
            }

            startTimeByPaper={
              settingsControlsProps.startTimeByPaper
            }

            endTimeByPaper={
              settingsControlsProps.endTimeByPaper
            }

            onCoverDateChange={
              settingsControlsProps.onCoverDateChange
            }

            onStartTimeChange={
              settingsControlsProps.onStartTimeChange
            }

            onEndTimeChange={
              settingsControlsProps.onEndTimeChange
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