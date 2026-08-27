import type {
  AppTheme,
} from "@/app/UI/Application/Theme/AppTheme";

import {
  UI_TEXT,
} from "@/app/UI/Application/Typography/Typography";

import type {
  AssessmentPreviewViewMode,
} from "../../PreviewViewMode";

import AssessmentViewModeControl from "./AssessmentViewModeControl";

import ViewWorkspaceControls from "./ViewWorkspaceControls";

type ViewTrayContentProps = {
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
};

const VIEW_MODE_DETAILS: Record<
  AssessmentPreviewViewMode,
  {
    title:
      string;

    description:
      string;
  }
> = {
  COMPACT: {
    title:
      "Compact",

    description:
      "Removes answer space to create a compact question paper — ideal when pupils work on separate paper and for viewing more questions at once.",
  },

  EXAM: {
    title:
      "Exam",

    description:
      "Adds working space appropriate to each question and presents the paper in a formal exam-style layout.",
  },

  ANSWERS: {
    title:
      "Answers",

    description:
      "Uses the exam layout with worked solutions and alternative methods — useful while building the paper or as a guide when marking.",
  },
};

export default function ViewTrayContent({
  theme,
  previewViewMode,
  onPreviewViewModeChange,
  showHud,
  onShowHudChange,
  onResetLayout,
  onResetZoom,
}: ViewTrayContentProps) {
  const details =
    VIEW_MODE_DETAILS[
      previewViewMode
    ];

  return (
    <div
      style={{
        width:
          "100%",

        minWidth:
          0,

        display:
          "flex",

        flexDirection:
          "column",

        gap:
          10,

        boxSizing:
          "border-box",
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

      <div
        style={{
          flex:
            "0 0 auto",

          borderTop:
            `1px solid ${theme.borderStandard}`,

          paddingTop:
            9,
        }}
      >
        <div
          style={{
            ...UI_TEXT.controlTextStrong,

            color:
              theme.textSecondary,

            marginBottom:
              4,
          }}
        >
          {details.title}
        </div>

        <div
          style={{
            ...UI_TEXT.helper,

            color:
              theme.textMuted,
          }}
        >
          {details.description}
        </div>
      </div>

      <div
        style={{
          flex:
            "0 0 auto",

          borderTop:
            `1px solid ${theme.borderStandard}`,

          paddingTop:
            9,
        }}
      >
        <ViewWorkspaceControls
          theme={
            theme
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
      </div>
    </div>
  );
}