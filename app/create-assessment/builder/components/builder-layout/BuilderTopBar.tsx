"use client";

import { useState } from "react";
import ClassCoverageSelect from "@/app/components/ClassCoverageSelect";
import SharedCalendarPicker from "@/app/create-assessment/builder/components/builder-controls/SharedCalendarPicker";
import { UI_TYPO } from "@/app/ui/UiTypography";
import type { Theme } from "@/ui/AppTheme";
import type { Paper } from "@/shared-types/AssessmentTypes";
import type { SchoolClass } from "@/app/my-classes/types/Classes";
import { INTERACTION } from "@/app/ui/InteractionTokens";
import {
  BuilderMetaField,
  ViewingToggle,
} from "@/app/create-assessment/builder/builder-logic/BuilderUiHelpers";

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

  zoomPct: number;
  zoomIn: () => void;
  zoomOut: () => void;
  currentViewerPage: number;
  totalViewerPages: number;
};

const TOP_BAR_CONTROL_HEIGHT = 32;
const TOP_BAR_LABEL_GAP = 4;
const TOP_BAR_RADIUS = 10;

function formatAssessmentDateDisplay(value: string): string {
  if (!value) return "";

  const isoMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!isoMatch) return value;

  const [, year, month, day] = isoMatch;
  const utcDate = new Date(
    Date.UTC(Number(year), Number(month) - 1, Number(day))
  );

  if (Number.isNaN(utcDate.getTime())) return value;

  return utcDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

function fieldLabelStyle(theme: Theme): React.CSSProperties {
  return {
    fontSize: 12,
    fontWeight: UI_TYPO.weightMedium,
    color: theme.textMuted,
    lineHeight: 1.2,
    whiteSpace: "nowrap",
  };
}

function fixedFieldShellStyle(width: number): React.CSSProperties {
  return {
    display: "grid",
    gap: TOP_BAR_LABEL_GAP,
    minWidth: 0,
    width,
    fontFamily: UI_TYPO.family,
    flex: "0 0 auto",
  };
}

function getDateShellStyle(
  hovered: boolean,
  focused: boolean
): React.CSSProperties {
  const active = hovered || focused;

  return {
    width: "100%",
    borderRadius: TOP_BAR_RADIUS,
    transform: active ? INTERACTION.lift.subtle.transform : "scale(1)",
    boxShadow: active ? INTERACTION.lift.subtle.shadow : "0 0 0 rgba(0,0,0,0)",
    transition: INTERACTION.transition.smooth,
  };
}

function sharedInputStyle(
  theme: Theme,
  hovered = false,
  focused = false
): React.CSSProperties {
  const active = hovered || focused;

  return {
    height: TOP_BAR_CONTROL_HEIGHT,
    borderRadius: TOP_BAR_RADIUS,
    border: `1px solid ${
      active ? theme.controlSelectedBorder : theme.borderStandard
    }`,
    background: active ? theme.controlBgHover : theme.bgSurface,
    color: theme.textPrimary,
    padding: "0 34px 0 10px",
    fontSize: 13,
    fontFamily: UI_TYPO.family,
    fontWeight: UI_TYPO.weightSemibold,
    minWidth: 0,
    width: "100%",
    boxSizing: "border-box",
    outline: "none",
    boxShadow: active
      ? "inset 0 1px 0 rgba(255,255,255,0.06)"
      : "inset 0 1px 0 rgba(255,255,255,0.04)",
    transition: INTERACTION.transition.smooth,
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
  const [dateHovered, setDateHovered] = useState(false);
  const [dateFocused, setDateFocused] = useState(false);
  const [calendarButtonHovered, setCalendarButtonHovered] = useState(false);
  const [zoomOutHovered, setZoomOutHovered] = useState(false);
  const [zoomInHovered, setZoomInHovered] = useState(false);

  return (
    <div
      style={{
        borderBottom: `1px solid ${theme.borderStandard}`,
        background: theme.bgSurface,
        display: "grid",
        gridTemplateRows: "auto auto",
        rowGap: 10,
        padding: "8px 12px 60px",
        boxSizing: "border-box",
        minHeight: 0,
        position: "relative",
        zIndex: 5,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 12,
          minWidth: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 12,
            flex: "1 1 auto",
            minWidth: 0,
          }}
        >
          <div style={{ flex: "1.2 1 0", minWidth: 0 }}>
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

          <div style={{ flex: "1 1 0", minWidth: 0 }}>
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
            alignItems: "flex-start",
            gap: 12,
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

            <div
              style={getDateShellStyle(dateHovered, dateFocused)}
              onMouseEnter={() => setDateHovered(true)}
              onMouseLeave={() => setDateHovered(false)}
            >
              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  value={formattedAssessmentDate}
                  readOnly
                  onFocus={() => {
                    setDateFocused(true);
                    setBuilderCalendarOpen(true);
                  }}
                  onBlur={() => setDateFocused(false)}
                  onClick={() => setBuilderCalendarOpen(true)}
                  style={{
                    ...sharedInputStyle(theme, dateHovered, dateFocused),
                    cursor: "pointer",
                  }}
                />

                <button
                  type="button"
                  onClick={() => setBuilderCalendarOpen((prev) => !prev)}
                  onMouseEnter={() => setCalendarButtonHovered(true)}
                  onMouseLeave={() => setCalendarButtonHovered(false)}
                  style={{
                    position: "absolute",
                    right: 5,
                    top: "50%",
                    transform: calendarButtonHovered
                      ? "translateY(-50%) scale(1.04)"
                      : "translateY(-50%) scale(1)",
                    width: 22,
                    height: 22,
                    borderRadius: 7,
                    border: `1px solid ${
                      calendarButtonHovered
                        ? theme.controlSelectedBorder
                        : theme.borderStandard
                    }`,
                    background: calendarButtonHovered
                      ? theme.controlBgHover
                      : theme.controlBg,
                    color: theme.textMuted,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    transition: INTERACTION.transition.smooth,
                    boxShadow: calendarButtonHovered
                      ? INTERACTION.lift.subtle.shadow
                      : "0 0 0 rgba(0,0,0,0)",
                  }}
                >
                  🗓️
                </button>
              </div>
            </div>

            {builderCalendarOpen && (
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
            )}
          </div>

          <div
            style={{
              display: "grid",
              gap: TOP_BAR_LABEL_GAP,
              width: "fit-content",
              fontFamily: UI_TYPO.family,
            }}
          >
            <span style={fieldLabelStyle(theme)}>Viewing</span>
            <div
              style={{
                height: TOP_BAR_CONTROL_HEIGHT,
                display: "flex",
                alignItems: "center",
              }}
            >
              <ViewingToggle
                value={viewPaper}
                onChange={setViewPaper}
                theme={theme}
              />
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
            padding: "4px 12px",
            borderRadius: 8,
            background: theme.bgElevated,
            opacity: 0.92,
            border: `1px solid ${theme.borderStandard}`,
            boxShadow: theme.shadow,
          }}
        >
          <div
            style={{
              minWidth: 34,
              textAlign: "center",
              color: theme.textMuted,
              fontSize: 12,
              fontWeight: UI_TYPO.weightMedium,
            }}
          >
            {currentViewerPage}/{totalViewerPages}
          </div>

          <div
            style={{
              width: 1,
              height: 14,
              background: theme.borderStandard,
            }}
          />

          <button
            type="button"
            onClick={zoomOut}
            onMouseEnter={() => setZoomOutHovered(true)}
            onMouseLeave={() => setZoomOutHovered(false)}
            style={{
              width: 16,
              height: 16,
              border: "none",
              background: "transparent",
              color: theme.textSecondary,
              cursor: "pointer",
              fontSize: 16,
              display: "grid",
              placeItems: "center",
              transition: INTERACTION.transition.smooth,
              transform: zoomOutHovered
                ? INTERACTION.lift.subtle.transform
                : "scale(1)",
              boxShadow: zoomOutHovered
                ? INTERACTION.lift.subtle.shadow
                : "0 0 0 rgba(0,0,0,0)",
            }}
          >
            −
          </button>

          <div
            style={{
              minWidth: 42,
              textAlign: "center",
              color: theme.textPrimary,
              fontSize: 12,
              fontWeight: UI_TYPO.weightSemibold,
            }}
          >
            {zoomPct}%
          </div>

          <button
            type="button"
            onClick={zoomIn}
            onMouseEnter={() => setZoomInHovered(true)}
            onMouseLeave={() => setZoomInHovered(false)}
            style={{
              width: 16,
              height: 16,
              border: "none",
              background: "transparent",
              color: theme.textSecondary,
              cursor: "pointer",
              fontSize: 16,
              display: "grid",
              placeItems: "center",
              transition: INTERACTION.transition.smooth,
              transform: zoomInHovered
                ? INTERACTION.lift.subtle.transform
                : "scale(1)",
              boxShadow: zoomInHovered
                ? INTERACTION.lift.subtle.shadow
                : "0 0 0 rgba(0,0,0,0)",
            }}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}