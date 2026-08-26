import ClassCoverageSelect from "@/src/Classes/Coverage/ClassCoverageSelect";
import type { SchoolClass } from "@/src/Classes/ClassTypes";

import type { AppTheme } from "@/src/UI/Application/Theme/AppTheme";
import { UI_TYPO } from "@/src/UI/Application/Typography/Typography";

import type { AssessmentLevelId } from "../AssessmentClassCoverageStorage";
import LevelSelect from "../LevelSelect";
import TextField from "../Controls/TextField";

type AssessmentDetailsSectionProps = {
  theme: AppTheme;

  assessmentName: string;
  onAssessmentNameChange: (value: string) => void;
  onAssessmentNameFocus: () => void;
  onAssessmentNameBlur: () => void;

  selectedLevelId: AssessmentLevelId | null;
  onLevelChange: (levelId: AssessmentLevelId) => void;

  levelLabel: string | null;
  classes: SchoolClass[];
  selectedClassIds: string[];
  useCompleteCourseCoverage: boolean;
  onToggleClass: (classId: string) => void;
  onSelectCompleteCourseCoverage: () => void;

  assessmentDate: string;
  onAssessmentDateChange: (value: string) => void;
};

export default function AssessmentDetailsSection({
  theme,
  assessmentName,
  onAssessmentNameChange,
  onAssessmentNameFocus,
  onAssessmentNameBlur,
  selectedLevelId,
  onLevelChange,
  levelLabel,
  classes,
  selectedClassIds,
  useCompleteCourseCoverage,
  onToggleClass,
  onSelectCompleteCourseCoverage,
  assessmentDate,
  onAssessmentDateChange,
}: AssessmentDetailsSectionProps) {
  return (
    <section
      style={{
        border: `1px solid ${theme.borderStandard}`,
        background: theme.bgSurface,
        borderRadius: 22,
        padding: "18px 20px",
      }}
    >
      <div
        style={{
          fontFamily: UI_TYPO.family,
          fontWeight: UI_TYPO.weightBold,
          fontSize: 18,
          color: theme.textPrimary,
          marginBottom: 14,
        }}
      >
        Assessment details
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "minmax(0, 1.2fr) 260px minmax(0, 1.15fr) 220px",
          gap: 14,
          alignItems: "start",
        }}
      >
        <div onBlur={onAssessmentNameBlur}>
          <TextField
            label="Assessment name"
            value={assessmentName}
            onChange={onAssessmentNameChange}
            onFocus={onAssessmentNameFocus}
            theme={theme}
          />
        </div>

        <LevelSelect
          value={selectedLevelId}
          onChange={onLevelChange}
          theme={theme}
        />

        <ClassCoverageSelect
          levelLabel={levelLabel}
          classes={classes}
          selectedClassIds={selectedClassIds}
          useCompleteCourseCoverage={useCompleteCourseCoverage}
          onToggleClass={onToggleClass}
          onSelectCompleteCourseCoverage={onSelectCompleteCourseCoverage}
          theme={theme}
        />

        <TextField
          label="Assessment date"
          type="date"
          value={assessmentDate}
          onChange={onAssessmentDateChange}
          theme={theme}
        />
      </div>
    </section>
  );
}