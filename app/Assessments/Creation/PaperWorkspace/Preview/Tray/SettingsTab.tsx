import type {
  Paper,
} from "@/app/Assessments/AssessmentTypes";

import type {
  AssessmentPaperStringMap,
} from "@/app/Assessments/Creation/Papers/PaperSpecificValues";

import type {
  AppTheme,
} from "@/app/UI/Application/Theme/AppTheme";

import {
  UI_TEXT,
} from "@/app/UI/Application/Typography/Typography";

import PaperSittingControls, {
  type PaperSittingOption,
} from "./ScheduleEditor";

import PreviewTrayToggleRow from "./ToggleRow";


type SettingsTrayContentProps = {
  theme:
    AppTheme;

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


export default function SettingsTrayContent({
  theme,

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
}: SettingsTrayContentProps) {
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
          8,

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
        Paper content
      </div>

      <PreviewTrayToggleRow
        label="Cover sheet"
        checked={
          includeCoverSheet
        }
        onChange={
          onIncludeCoverSheetChange
        }
        theme={
          theme
        }
      />

      <PreviewTrayToggleRow
        label="Formula sheet"
        checked={
          includeFormulaSheet
        }
        onChange={
          onIncludeFormulaSheetChange
        }
        theme={
          theme
        }
      />

      <PreviewTrayToggleRow
        label="Date & time"
        checked={
          showCoverDateTime
        }
        onChange={
          onShowCoverDateTimeChange
        }
        theme={
          theme
        }
      />

      <PreviewTrayToggleRow
        label="Candidate number"
        checked={
          showCandidateNumber
        }
        onChange={
          onShowCandidateNumberChange
        }
        theme={
          theme
        }
      />

      <div
        style={{
          marginTop:
            2,

          paddingTop:
            10,

          borderTop:
            `1px solid ${theme.borderStandard}`,
        }}
      >
        <PaperSittingControls
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

          theme={
            theme
          }
        />
      </div>
    </div>
  );
}