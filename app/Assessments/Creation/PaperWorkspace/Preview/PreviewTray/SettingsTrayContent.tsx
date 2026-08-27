import type {
  AppTheme,
} from "@/app/UI/Application/Theme/AppTheme";

import {
  UI_TEXT,
} from "@/app/UI/Application/Typography/Typography";

import PreviewTrayToggleRow from "./PreviewTrayToggleRow";

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
            9,

          borderTop:
            `1px solid ${theme.borderStandard}`,

          ...UI_TEXT.helper,

          color:
            theme.textMuted,
        }}
      >
        These options change the compiled paper.
      </div>
    </div>
  );
}