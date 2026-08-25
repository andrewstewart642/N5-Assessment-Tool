import type {
  ComponentProps,
} from "react";

import type {
  AppTheme,
} from "@/src/UI/Application/Theme/AppTheme";

import {
  UI_TYPO,
} from "@/src/UI/Application/Typography/Typography";

import AssessmentHUDBar from "../HUDBar/AssessmentHUDBar";

import AssessmentTopBar from "../TopBar/AssessmentTopBar";

import AssessmentPreviewPane from "./Preview/AssessmentPreviewPane";

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

type AssessmentPaperWorkspaceProps = {
  theme:
    AppTheme;

  viewerHudRow:
    string;

  showPreviewAnswers:
    boolean;

  topBarProps:
    Omit<
      AssessmentTopBarProps,
      "theme"
    >;

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

export default function AssessmentPaperWorkspace({
  theme,
  viewerHudRow,
  showPreviewAnswers,
  topBarProps,
  previewProps,
  hudProps,
}: AssessmentPaperWorkspaceProps) {
  return (
    <section
      data-preview-answers={
        showPreviewAnswers
          ? "shown"
          : "hidden"
      }
      style={{
        background:
          theme.bgSurface,

        display:
          "grid",

        gridTemplateRows:
          `65px minmax(0, 1fr) ${viewerHudRow}`,

        minHeight:
          0,

        height:
          "100%",

        overflow:
          "hidden",

        position:
          "relative",

        fontFamily:
          UI_TYPO.family,
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

      <AssessmentHUDBar
        {...hudProps}
        theme={
          theme
        }
      />
    </section>
  );
}