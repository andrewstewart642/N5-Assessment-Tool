"use client";

import ClassCoverageSelect from "@/app/components/ClassCoverageSelect";
import SharedCalendarPicker from "@/app/create-assessment/builder/components/builder-controls/SharedCalendarPicker";
import { UI_TYPO } from "@/app/ui/UiTypography";
import { getTheme } from "@/app/ui/AppTheme";
import type { Paper } from "@/shared-types/AssessmentTypes";
import type { SchoolClass } from "@/app/my-classes/types/Classes";
import {
  BuilderMetaField,
  ViewingToggle,
} from "@/app/create-assessment/builder/builder-logic/BuilderUiHelpers";

type Theme = ReturnType<typeof getTheme>;

type Props = {
  theme: Theme;
  assessmentName: string;
  setAssessmentName: React.Dispatch<React.SetStateAction<string>>;
  assessmentDate: string;
  setAssessmentDate: React.Dispatch<React.SetStateAction<string>>;
  builderCalendarOpen: boolean;
  setBuilderCalendarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  builderDateFieldRef: React.RefObject<HTMLDivElement | null>;
  handleAssessmentNameFocus: () => void;
  handleAssessmentNameBlur: () => void;
  viewPaper: Paper;
  setViewPaper: React.Dispatch<React.SetStateAction<Paper>>;

  classLevelLabel: string | null;
  availableClasses: SchoolClass[];
  selectedClassIds: string[];
  useCompleteCourseCoverage: boolean;
  onToggleClass: (classId: string) => void;
  onSelectCompleteCourseCoverage: () => void;
};

function formatAssessmentDateDisplay(value: string): string {
  if (!value) return "";

  const isoMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!isoMatch) return value;

  const [, year, month, day] = isoMatch;
  const utcDate = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));

  if (Number.isNaN(utcDate.getTime())) return value;

  return utcDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

function fieldLabelStyle(): React.CSSProperties {
  return {
    fontSize: 12,
    fontWeight: UI_TYPO.weightMedium,
    letterSpacing: 0,
    color: "rgba(214,227,243,0.74)",
    lineHeight: 1.2,
    whiteSpace: "nowrap",
  };
}

function fieldShellStyle(width: number): React.CSSProperties {
  return {
    display: "grid",
    gap: 3,
    minWidth: 0,
    width,
    fontFamily: UI_TYPO.family,
  };
}

function sharedInputStyle(): React.CSSProperties {
  return {
    height: 30,
    borderRadius: 9,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.02)",
    color: "#f7fbff",
    padding: "0 38px 0 10px",
    fontSize: 13,
    fontFamily: UI_TYPO.family,
    fontWeight: UI_TYPO.weightSemibold,
    minWidth: 0,
    width: "100%",
    boxSizing: "border-box",
    outline: "none",
  };
}

export default function BuilderTopBar({
  theme,
  assessmentName,
  setAssessmentName,
  assessmentDate,
  setAssessmentDate,
  builderCalendarOpen,
  setBuilderCalendarOpen,
  builderDateFieldRef,
  handleAssessmentNameFocus,
  handleAssessmentNameBlur,
  viewPaper,
  setViewPaper,
  classLevelLabel,
  availableClasses,
  selectedClassIds,
  useCompleteCourseCoverage,
  onToggleClass,
  onSelectCompleteCourseCoverage,
}: Props) {
  const formattedAssessmentDate = formatAssessmentDateDisplay(assessmentDate);

  return (
    <div
      style={{
        borderBottom: `1px solid ${theme.border}`,
        background: theme.panelBg2,
        display: "grid",
        gridTemplateColumns: "minmax(0, 1fr) auto",
        alignItems: "center",
        gap: 10,
        padding: "8px 10px 10px",
        boxSizing: "border-box",
        minHeight: 0,
        position: "relative",
        zIndex: 5,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "end",
          gap: 10,
          minWidth: 0,
          flexWrap: "nowrap",
        }}
      >
        <BuilderMetaField
          label="Name"
          value={assessmentName}
          onChange={setAssessmentName}
          onFocus={handleAssessmentNameFocus}
          onBlur={handleAssessmentNameBlur}
          width={220}
        />

        <ClassCoverageSelect
          levelLabel={classLevelLabel}
          classes={availableClasses}
          selectedClassIds={selectedClassIds}
          useCompleteCourseCoverage={useCompleteCourseCoverage}
          onToggleClass={onToggleClass}
          onSelectCompleteCourseCoverage={onSelectCompleteCourseCoverage}
          label="Class"
          emptyText="Select classes"
          disabledText="No level"
          completeCoverageSummaryText="Complete course"
          hideHelperText
          compact
          width={190}
          dropdownWidth={340}
          zIndex={320}
        />

        <div
          ref={builderDateFieldRef}
          style={{
            ...fieldShellStyle(190),
            position: "relative",
            zIndex: builderCalendarOpen ? 200 : "auto",
          }}
        >
          <span style={fieldLabelStyle()}>Assessment Date</span>

          <div style={{ position: "relative" }}>
            <input
              type="text"
              value={formattedAssessmentDate}
              readOnly
              onFocus={() => setBuilderCalendarOpen(true)}
              onClick={() => setBuilderCalendarOpen(true)}
              style={{
                ...sharedInputStyle(),
                cursor: "pointer",
              }}
              aria-label="Assessment date"
            />

            <button
              type="button"
              onClick={() => setBuilderCalendarOpen((prev) => !prev)}
              style={{
                position: "absolute",
                right: 4,
                top: "50%",
                transform: "translateY(-50%)",
                width: 22,
                height: 22,
                borderRadius: 7,
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.03)",
                color: "rgba(214,227,243,0.78)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                lineHeight: 1,
                padding: 0,
              }}
              aria-label="Open assessment date calendar"
            >
              <span
                aria-hidden="true"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  height: "100%",
                  transform: "translateY(-0.5px)",
                }}
              >
                🗓️
              </span>
            </button>
          </div>

          {builderCalendarOpen ? (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 10px)",
                left: 0,
                zIndex: 300,
                width: 320,
              }}
            >
              <SharedCalendarPicker
                theme={theme}
                value={assessmentDate}
                onCancel={() => setBuilderCalendarOpen(false)}
                onApply={(next) => {
                  setAssessmentDate(next);
                  setBuilderCalendarOpen(false);
                }}
              />
            </div>
          ) : null}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          justifySelf: "end",
          whiteSpace: "nowrap",
          minWidth: 0,
        }}
      >
        <div
          style={{
            color: "rgba(214,227,243,0.78)",
            fontSize: 13,
            fontFamily: UI_TYPO.family,
            fontWeight: UI_TYPO.weightMedium,
          }}
        >
          Viewing
        </div>

        <ViewingToggle value={viewPaper} onChange={setViewPaper} />
      </div>
    </div>
  );
}