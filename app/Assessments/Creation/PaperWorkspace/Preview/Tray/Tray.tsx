import {
  useEffect,
  useRef,
  useState,
} from "react";

import type {
  Paper,
} from "@/app/Assessments/AssessmentTypes";

import type {
  AssessmentPaperStringMap,
} from "@/app/Assessments/Creation/Papers/PaperSpecificValues";

import type {
  AppTheme,
} from "@/app/UI/Application/Theme/AppTheme";

import type {
  AssessmentPreviewViewMode,
} from "../../ViewMode";

import type {
  PaperSittingOption,
} from "./ScheduleEditor";

import PreviewTrayTab, {
  PREVIEW_TRAY_TAB_WIDTH,
} from "./Tab";

import SettingsTrayContent from "./SettingsTab";

import ViewTrayContent from "./ViewTab";


type PreviewTraySection =
  | "settings"
  | "view";


type AssessmentPreviewTrayProps = {
  theme:
    AppTheme;

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


const TRAY_PANEL_WIDTH =
  300;

const TRAY_PANEL_HEIGHT =
  344;

const SETTINGS_TAB_HEIGHT =
  82;

const VIEW_TAB_HEIGHT =
  62;

const TAB_GAP =
  3;


export default function AssessmentPreviewTray({
  theme,

  previewViewMode,
  onPreviewViewModeChange,

  showHud,
  onShowHudChange,

  onResetLayout,
  onResetZoom,

  includeCoverSheet,
  onIncludeCoverSheetChange,

  includeFormulaSheet,
  onIncludeFormulaSheetChange,

  showCoverDateTime,
  onShowCoverDateTimeChange,

  showCandidateNumber,
  onShowCandidateNumberChange,

  paperOptions,

  coverDateByPaper,
  startTimeByPaper,
  endTimeByPaper,

  onCoverDateChange,
  onStartTimeChange,
  onEndTimeChange,
}: AssessmentPreviewTrayProps) {
  const [
    open,
    setOpen,
  ] =
    useState(
      false
    );

  const [
    activeSection,
    setActiveSection,
  ] =
    useState<PreviewTraySection>(
      "view"
    );

  const trayRef =
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
        !trayRef.current
      ) {
        return;
      }

      if (
        trayRef.current.contains(
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


  function handleTabClick(
    section:
      PreviewTraySection
  ) {
    if (
      !open
    ) {
      setActiveSection(
        section
      );

      setOpen(
        true
      );

      return;
    }

    if (
      activeSection ===
      section
    ) {
      setOpen(
        false
      );

      return;
    }

    setActiveSection(
      section
    );
  }


  return (
    <div
      ref={
        trayRef
      }
      style={{
        width:
          TRAY_PANEL_WIDTH +
          PREVIEW_TRAY_TAB_WIDTH,

        height:
          TRAY_PANEL_HEIGHT,

        display:
          "flex",

        alignItems:
          "flex-start",

        transform:
          open
            ? "translateX(0)"
            : `translateX(${TRAY_PANEL_WIDTH}px)`,

        transition:
          "transform 260ms cubic-bezier(0.2, 0.8, 0.2, 1)",

        willChange:
          "transform",
      }}
    >
      <div
        style={{
          width:
            PREVIEW_TRAY_TAB_WIDTH,

          flexShrink:
            0,

          display:
            "flex",

          flexDirection:
            "column",

          gap:
            TAB_GAP,

          position:
            "relative",

          zIndex:
            2,

          marginRight:
            -1,
        }}
      >
        <PreviewTrayTab
          label="Settings"
          height={
            SETTINGS_TAB_HEIGHT
          }
          active={
            activeSection ===
            "settings"
          }
          open={
            open
          }
          onClick={() =>
            handleTabClick(
              "settings"
            )
          }
          theme={
            theme
          }
        />

        <PreviewTrayTab
          label="View"
          height={
            VIEW_TAB_HEIGHT
          }
          active={
            activeSection ===
            "view"
          }
          open={
            open
          }
          onClick={() =>
            handleTabClick(
              "view"
            )
          }
          theme={
            theme
          }
        />
      </div>

      <div
        style={{
          width:
            TRAY_PANEL_WIDTH,

          height:
            TRAY_PANEL_HEIGHT,

          flexShrink:
            0,

          boxSizing:
            "border-box",

          border:
            `1px solid ${theme.borderStandard}`,

          borderRadius:
            "6px 0 0 6px",

          background:
            theme.bgElevated,

          boxShadow:
            theme.shadow,

          overflow:
            "hidden",
        }}
      >
        <div
          style={{
            width:
              "100%",

            height:
              "100%",

            padding:
              11,

            boxSizing:
              "border-box",

            overflowY:
              "auto",

            overflowX:
              "hidden",

            scrollbarWidth:
              "thin",

            scrollbarColor:
              `${theme.textMuted} transparent`,

            scrollBehavior:
              "smooth",
          }}
        >
          {activeSection ===
          "view" ? (
            <ViewTrayContent
              theme={
                theme
              }

              previewViewMode={
                previewViewMode
              }

              onPreviewViewModeChange={
                onPreviewViewModeChange
              }

              showHud={
                showHud
              }

              onShowHudChange={
                onShowHudChange
              }

              onResetLayout={
                onResetLayout
              }

              onResetZoom={
                onResetZoom
              }
            />
          ) : (
            <SettingsTrayContent
              theme={
                theme
              }

              includeCoverSheet={
                includeCoverSheet
              }

              onIncludeCoverSheetChange={
                onIncludeCoverSheetChange
              }

              includeFormulaSheet={
                includeFormulaSheet
              }

              onIncludeFormulaSheetChange={
                onIncludeFormulaSheetChange
              }

              showCoverDateTime={
                showCoverDateTime
              }

              onShowCoverDateTimeChange={
                onShowCoverDateTimeChange
              }

              showCandidateNumber={
                showCandidateNumber
              }

              onShowCandidateNumberChange={
                onShowCandidateNumberChange
              }

              paperOptions={
                paperOptions
              }

              coverDateByPaper={
                coverDateByPaper
              }

              startTimeByPaper={
                startTimeByPaper
              }

              endTimeByPaper={
                endTimeByPaper
              }

              onCoverDateChange={
                onCoverDateChange
              }

              onStartTimeChange={
                onStartTimeChange
              }

              onEndTimeChange={
                onEndTimeChange
              }
            />
          )}
        </div>
      </div>
    </div>
  );
}