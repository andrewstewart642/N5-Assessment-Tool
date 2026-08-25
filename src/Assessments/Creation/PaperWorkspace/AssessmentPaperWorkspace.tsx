import type {
  ComponentProps,
} from "react";

import BuilderTopBar from "@/app/create-assessment/builder/components/builder-layout/BuilderTopBar";

import BuilderBottomHud from "@/app/create-assessment/builder/components/builder-layout/BuilderBottomHud";

import BuilderPreviewPane from "@/app/create-assessment/builder/builder-preview-engine/BuilderPreviewPane";

import type { AppTheme } from "@/src/UI/Application/Theme/AppTheme";

import {
  UI_TYPO,
} from "@/src/UI/Application/Typography/Typography";

type BuilderTopBarProps =
  ComponentProps<
    typeof BuilderTopBar
  >;

type BuilderPreviewPaneProps =
  ComponentProps<
    typeof BuilderPreviewPane
  >;

type BuilderBottomHudProps =
  ComponentProps<
    typeof BuilderBottomHud
  >;

type AssessmentPaperWorkspaceProps = {
  theme: AppTheme;

  viewerHudRow: string;

  showPreviewAnswers: boolean;

  topBarProps:
    Omit<
      BuilderTopBarProps,
      "theme"
    >;

  previewProps:
    Omit<
      BuilderPreviewPaneProps,
      | "theme"
      | "showWorkedAnswers"
    >;

  hudProps:
    Omit<
      BuilderBottomHudProps,
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

        display: "grid",

        gridTemplateRows:
          `65px minmax(0, 1fr) ${viewerHudRow}`,

        minHeight: 0,

        height: "100%",

        overflow: "hidden",

        position:
          "relative",

        fontFamily:
          UI_TYPO.family,
      }}
    >
      <BuilderTopBar
        {...topBarProps}
        theme={theme}
      />

      <BuilderPreviewPane
        {...previewProps}
        theme={theme}
        showWorkedAnswers={
          showPreviewAnswers
        }
      />

      <BuilderBottomHud
        {...hudProps}
        theme={theme}
      />
    </section>
  );
}