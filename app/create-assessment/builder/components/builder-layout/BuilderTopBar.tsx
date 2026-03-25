"use client";

import ClassCoverageSelect from "@/app/components/ClassCoverageSelect";
import SharedCalendarPicker from "@/app/create-assessment/builder/components/builder-controls/SharedCalendarPicker";
import { UI_TYPO } from "@/app/ui/UiTypography";
import type { AppTheme } from "@/ui/AppTheme";
import type { Paper } from "@/shared-types/AssessmentTypes";
import type { SchoolClass } from "@/app/my-classes/types/Classes";
import {
  BuilderMetaField,
  ViewingToggle,
} from "@/app/create-assessment/builder/builder-logic/BuilderUiHelpers";

type Props = {
  theme: AppTheme;
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

  zoomPct: number;
  zoomIn: () => void;
  zoomOut: () => void;
  currentViewerPage: number;
  totalViewerPages: number;
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

function fieldLabelStyle(theme: AppTheme): React.CSSProperties {
  return {
    fontSize: 12,
    fontWeight: UI_TYPO.weightMedium,
    letterSpacing: 0,
    color: theme.subtleText,
    lineHeight: 1.2,
    whiteSpace: "nowrap",
  };
}

function fixedFieldShellStyle(width: number): React.CSSProperties {
  return {
    display: "grid",
    gap: 4,
    minWidth: 0,
    width,
    fontFamily: UI_TYPO.family,
    flex: "0 0 auto",
  };
}

function sharedInputStyle(theme: AppTheme): React.CSSProperties {
  return {
    height: 32,
    borderRadius: 10,
    border: `1px solid ${theme.viewerChromeBorder}`,
    background: theme.bgSurface,
    color: theme.textPrimary,
    padding: "0 34px 0 10px",
    fontSize: 13,
    fontFamily: UI_TYPO.family,
    fontWeight: UI_TYPO.weightSemibold,
    minWidth: 0,
    width: "100%",
    boxSizing: "border-box",
    outline: "none",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
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
  zoomPct,
  zoomIn,
  zoomOut,
  currentViewerPage,
  totalViewerPages,
}: Props) {
  const formattedAssessmentDate = formatAssessmentDateDisplay(assessmentDate);

  return (
    <div
      style={{
        border: `1px solid ${theme.viewerChromeBorder}`,
        background: theme.headerBg,
        display: "grid",
        gridTemplateRows: "auto auto",
        rowGap: 12,
        padding: "8px 12px 65px",
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
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "end",
            gap: 10,
            flex: "1 1 auto",
            minWidth: 0,
          }}
        >
          <div
            style={{
              flex: "1.2 1 0",
              minWidth: 0,
            }}
          >
            <BuilderMetaField
              label="Name"
              value={assessmentName}
              onChange={setAssessmentName}
              onFocus={handleAssessmentNameFocus}
              onBlur={handleAssessmentNameBlur}
              width={undefined as never}
              theme={theme}
            />
          </div>

          <div
            style={{
              flex: "1 1 0",
              minWidth: 0,
            }}
          >
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
              width="100%"
              dropdownWidth={340}
              zIndex={320}
              theme={theme}
            />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "end",
            gap: 10,
            flex: "0 0 auto",
            minWidth: 0,
          }}
        >
          <div
            ref={builderDateFieldRef}
            style={{
              ...fixedFieldShellStyle(150),
              position: "relative",
              zIndex: builderCalendarOpen ? 200 : "auto",
            }}
          >
            <span style={fieldLabelStyle(theme)}>Assessment Date</span>

            <div style={{ position: "relative" }}>
              <input
                type="text"
                value={formattedAssessmentDate}
                readOnly
                onFocus={() => setBuilderCalendarOpen(true)}
                onClick={() => setBuilderCalendarOpen(true)}
                style={{
                  ...sharedInputStyle(theme),
                  cursor: "pointer",
                }}
                aria-label="Assessment date"
              />

              <button
                type="button"
                onClick={() => setBuilderCalendarOpen((prev) => !prev)}
                style={{
                  position: "absolute",
                  right: 5,
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: 22,
                  height: 22,
                  borderRadius: 7,
                  border: `1px solid ${theme.viewerChromeBorder}`,
                  background: theme.buttonGhostBg,
                  color: theme.subtleText,
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

          <div
            style={{
              display: "grid",
              gap: 4,
              minWidth: 0,
              width: "fit-content",
              fontFamily: UI_TYPO.family,
              flex: "0 0 auto",
            }}
          >
            <span style={fieldLabelStyle(theme)}>Viewing</span>
            <div style={{ height: 32, display: "flex", alignItems: "center" }}>
              <ViewingToggle value={viewPaper} onChange={setViewPaper} theme={theme} />
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 18,
          marginTop: 2,
        }}
      >
        <div
          style={{
            transform: "translateY(8px)",
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            minHeight: 10,
            padding: "4px 12px",
            borderRadius: 6,
            background: theme.bgSurface,
            opacity: 0.88,
            border: `1px solid ${theme.viewerChromeBorder}`,
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
            backdropFilter: "blur(4px)",
          }}
        >
          <div
            style={{
              minWidth: 34,
              textAlign: "center",
              color: theme.subtleText,
              fontSize: 12,
              fontFamily: UI_TYPO.family,
              fontWeight: UI_TYPO.weightMedium,
              lineHeight: 1,
            }}
            title={`Page ${currentViewerPage} of ${totalViewerPages}`}
          >
            {currentViewerPage}/{totalViewerPages}
          </div>

          <div
            style={{
              width: 1,
              height: 14,
              background: theme.borderSoft,
            }}
          />

          <button
            type="button"
            onClick={zoomOut}
            style={{
              width: 16,
              height: 16,
              border: "none",
              background: "transparent",
              color: theme.text,
              cursor: "pointer",
              fontFamily: UI_TYPO.family,
              fontWeight: UI_TYPO.weightMedium,
              fontSize: 16,
              lineHeight: "16px",
              display: "grid",
              placeItems: "center",
              padding: 0,
            }}
            title="Zoom out"
          >
            −
          </button>

          <div
            style={{
              minWidth: 42,
              textAlign: "center",
              color: theme.text,
              fontSize: 12,
              fontFamily: UI_TYPO.family,
              fontWeight: UI_TYPO.weightSemibold,
              lineHeight: 1,
            }}
            title="Current zoom"
          >
            {zoomPct}%
          </div>

          <button
            type="button"
            onClick={zoomIn}
            style={{
              width: 16,
              height: 16,
              border: "none",
              background: "transparent",
              color: theme.text,
              cursor: "pointer",
              fontFamily: UI_TYPO.family,
              fontWeight: UI_TYPO.weightMedium,
              fontSize: 16,
              lineHeight: "16px",
              display: "grid",
              placeItems: "center",
              padding: 0,
            }}
            title="Zoom in"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}