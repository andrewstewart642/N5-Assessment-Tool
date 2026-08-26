import type { CourseAssessmentConfig } from "@/src/Courses/CourseAssessmentConfig";

import type { AppTheme } from "@/src/UI/Application/Theme/AppTheme";

import type {
  AssessmentType,
  BuildPriority,
  PaperStructure,
} from "../AssessmentSetupStorage";

import {
  getPaperLabel,
  structureIncludesPaper,
} from "../AssessmentSetupCourseRules";

import SetupCard from "../SetupCard";
import CheckRow from "../Controls/CheckRow";
import ChoiceRow from "../Controls/ChoiceRow";
import NumberField from "../Controls/NumberField";

type AssessmentModeOption = {
  id: AssessmentType;
  label: string;
};

type AssessmentStructureOption = {
  id: PaperStructure;
  label: string;
};

type AssessmentOptionsSectionProps = {
  theme: AppTheme;
  courseConfig: CourseAssessmentConfig;

  assessmentModes: AssessmentModeOption[];
  assessmentType: AssessmentType | null;
  onAssessmentTypeChange: (value: AssessmentType) => void;

  assessmentStructures: AssessmentStructureOption[];
  paperStructure: PaperStructure | null;
  onPaperStructureChange: (value: PaperStructure) => void;

  includeCoverSheet: boolean;
  onToggleCoverSheet: () => void;

  includeFormulaSheet: boolean;
  onToggleFormulaSheet: () => void;

  buildPriority: BuildPriority | null;
  onBuildPriorityChange: (value: BuildPriority) => void;

  marksTargetP1: string;
  onMarksTargetP1Change: (value: string) => void;

  marksTargetP2: string;
  onMarksTargetP2Change: (value: string) => void;

  timeTargetP1: string;
  onTimeTargetP1Change: (value: string) => void;

  timeTargetP2: string;
  onTimeTargetP2Change: (value: string) => void;

  derivedSummary: string[];
};

export default function AssessmentOptionsSection({
  theme,
  courseConfig,
  assessmentModes,
  assessmentType,
  onAssessmentTypeChange,
  assessmentStructures,
  paperStructure,
  onPaperStructureChange,
  includeCoverSheet,
  onToggleCoverSheet,
  includeFormulaSheet,
  onToggleFormulaSheet,
  buildPriority,
  onBuildPriorityChange,
  marksTargetP1,
  onMarksTargetP1Change,
  marksTargetP2,
  onMarksTargetP2Change,
  timeTargetP1,
  onTimeTargetP1Change,
  timeTargetP2,
  onTimeTargetP2Change,
  derivedSummary,
}: AssessmentOptionsSectionProps) {
  const showPaperStructure = assessmentType !== null;
  const showBuildPriority = paperStructure !== null;

  return (
    <section
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, minmax(280px, 1fr))",
        gap: 18,
        alignItems: "start",
      }}
    >
      <SetupCard title="1. Assessment Type" theme={theme}>
        {assessmentModes.map((mode) => (
          <ChoiceRow
            key={mode.id}
            label={mode.label}
            selected={assessmentType === mode.id}
            onClick={() => onAssessmentTypeChange(mode.id)}
            theme={theme}
          />
        ))}
      </SetupCard>

      <SetupCard title="2. Paper Structure" theme={theme}>
        {showPaperStructure ? (
          <>
            {assessmentStructures.map((structure) => (
              <ChoiceRow
                key={structure.id}
                label={structure.label}
                selected={paperStructure === structure.id}
                onClick={() => onPaperStructureChange(structure.id)}
                theme={theme}
              >
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: theme.textMuted,
                    marginBottom: 2,
                  }}
                >
                  Include
                </div>

                <CheckRow
                  label="Cover sheet"
                  checked={includeCoverSheet}
                  onToggle={onToggleCoverSheet}
                  theme={theme}
                />

                <CheckRow
                  label="Formula sheet"
                  checked={includeFormulaSheet}
                  onToggle={onToggleFormulaSheet}
                  theme={theme}
                />
              </ChoiceRow>
            ))}
          </>
        ) : (
          <div
            style={{
              border: `1px dashed ${theme.borderStandard}`,
              borderRadius: 14,
              padding: "14px 16px",
              color: theme.textMuted,
              fontSize: 14,
              lineHeight: 1.5,
            }}
          >
            Choose an assessment type first.
          </div>
        )}
      </SetupCard>

      <SetupCard title="3. Build Priority" theme={theme}>
        {showBuildPriority ? (
          <>
            <ChoiceRow
              label="Marks-led"
              selected={buildPriority === "MARKS"}
              onClick={() => onBuildPriorityChange("MARKS")}
              theme={theme}
            >
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: theme.textMuted,
                  marginBottom: 2,
                }}
              >
                Targets
              </div>

              {structureIncludesPaper(
                paperStructure,
                "P1",
                courseConfig
              ) ? (
                <NumberField
                  label={`${getPaperLabel("P1", courseConfig)} target`}
                  value={marksTargetP1}
                  onChange={onMarksTargetP1Change}
                  suffix="marks"
                  theme={theme}
                />
              ) : null}

              {structureIncludesPaper(
                paperStructure,
                "P2",
                courseConfig
              ) ? (
                <NumberField
                  label={`${getPaperLabel("P2", courseConfig)} target`}
                  value={marksTargetP2}
                  onChange={onMarksTargetP2Change}
                  suffix="marks"
                  theme={theme}
                />
              ) : null}

              <div
                style={{
                  display: "grid",
                  gap: 4,
                  fontSize: 13,
                  color: theme.textMuted,
                }}
              >
                {buildPriority === "MARKS"
                  ? derivedSummary.map((row) => (
                      <div key={row}>{row}</div>
                    ))
                  : null}
              </div>
            </ChoiceRow>

            <ChoiceRow
              label="Time-led"
              selected={buildPriority === "TIME"}
              onClick={() => onBuildPriorityChange("TIME")}
              theme={theme}
            >
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: theme.textMuted,
                  marginBottom: 2,
                }}
              >
                Targets
              </div>

              {structureIncludesPaper(
                paperStructure,
                "P1",
                courseConfig
              ) ? (
                <NumberField
                  label={`${getPaperLabel("P1", courseConfig)} target`}
                  value={timeTargetP1}
                  onChange={onTimeTargetP1Change}
                  suffix="minutes"
                  theme={theme}
                />
              ) : null}

              {structureIncludesPaper(
                paperStructure,
                "P2",
                courseConfig
              ) ? (
                <NumberField
                  label={`${getPaperLabel("P2", courseConfig)} target`}
                  value={timeTargetP2}
                  onChange={onTimeTargetP2Change}
                  suffix="minutes"
                  theme={theme}
                />
              ) : null}

              <div
                style={{
                  display: "grid",
                  gap: 4,
                  fontSize: 13,
                  color: theme.textMuted,
                }}
              >
                {buildPriority === "TIME"
                  ? derivedSummary.map((row) => (
                      <div key={row}>{row}</div>
                    ))
                  : null}
              </div>
            </ChoiceRow>
          </>
        ) : (
          <div
            style={{
              border: `1px dashed ${theme.borderStandard}`,
              borderRadius: 14,
              padding: "14px 16px",
              color: theme.textMuted,
              fontSize: 14,
              lineHeight: 1.5,
            }}
          >
            Choose a paper structure first.
          </div>
        )}
      </SetupCard>
    </section>
  );
}