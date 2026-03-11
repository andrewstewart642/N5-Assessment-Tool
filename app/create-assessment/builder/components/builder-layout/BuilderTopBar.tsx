"use client";

import SharedCalendarPicker from "@/app/create-assessment/builder/components/builder-controls/SharedCalendarPicker";
import { UI_TYPO } from "@/app/ui/UiTypography";
import { getTheme } from "@/app/ui/AppTheme";
import type { Paper } from "@/shared-types/AssessmentTypes";
import {
  BuilderMetaField,
  ViewingToggle,
} from "@/app/create-assessment/builder/builder-logic/BuilderUiHelpers";

type Theme = ReturnType<typeof getTheme>;

type Props = {
  theme: Theme;
  assessmentName: string;
  setAssessmentName: React.Dispatch<React.SetStateAction<string>>;
  className: string;
  setClassName: React.Dispatch<React.SetStateAction<string>>;
  assessmentDate: string;
  setAssessmentDate: React.Dispatch<React.SetStateAction<string>>;
  builderCalendarOpen: boolean;
  setBuilderCalendarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  builderDateFieldRef: React.RefObject<HTMLDivElement | null>;
  handleAssessmentNameFocus: () => void;
  handleAssessmentNameBlur: () => void;
  viewPaper: Paper;
  setViewPaper: React.Dispatch<React.SetStateAction<Paper>>;
};

export default function BuilderTopBar({
  theme,
  assessmentName,
  setAssessmentName,
  className,
  setClassName,
  assessmentDate,
  setAssessmentDate,
  builderCalendarOpen,
  setBuilderCalendarOpen,
  builderDateFieldRef,
  handleAssessmentNameFocus,
  handleAssessmentNameBlur,
  viewPaper,
  setViewPaper,
}: Props) {
  return (
    <div
      style={{
        borderBottom: `1px solid ${theme.border}`,
        background: theme.panelBg2,
        display: "grid",
        gridTemplateColumns: "minmax(0, 1fr) auto",
        alignItems: "center",
        gap: 10,
        padding: "3px 10px 14px",
        boxSizing: "border-box",
        minHeight: 0,
        position: "relative",
        zIndex: 3,
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
        <BuilderMetaField
          label="Name"
          value={assessmentName}
          onChange={setAssessmentName}
          onFocus={handleAssessmentNameFocus}
          onBlur={handleAssessmentNameBlur}
          width={220}
        />

        <BuilderMetaField
          label="Class"
          value={className}
          onChange={setClassName}
          width={118}
        />

        <div
          ref={builderDateFieldRef}
          style={{
            display: "grid",
            gap: 3,
            minWidth: 0,
            width: 170,
            position: "relative",
            fontFamily: UI_TYPO.family,
          }}
        >
          <span
            style={{
              fontSize: 12,
              fontWeight: UI_TYPO.weightMedium,
              letterSpacing: 0,
              color: "rgba(214,227,243,0.74)",
              lineHeight: 1.2,
              whiteSpace: "nowrap",
            }}
          >
            Assessment Date
          </span>

          <div style={{ position: "relative" }}>
            <input
              type="text"
              value={assessmentDate}
              onChange={(e) => setAssessmentDate(e.target.value)}
              onFocus={() => setBuilderCalendarOpen(true)}
              onClick={() => setBuilderCalendarOpen(true)}
              style={{
                height: 30,
                borderRadius: 9,
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.02)",
                color: "#f7fbff",
                padding: "0 34px 0 9px",
                fontSize: 13,
                fontFamily: UI_TYPO.family,
                fontWeight: UI_TYPO.weightSemibold,
                minWidth: 0,
                width: "100%",
                boxSizing: "border-box",
                outline: "none",
              }}
            />

            <button
              type="button"
              onClick={() => setBuilderCalendarOpen((prev) => !prev)}
              style={{
                position: "absolute",
                right: 4,
                top: 4,
                width: 22,
                height: 22,
                borderRadius: 7,
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.03)",
                color: "rgba(214,227,243,0.78)",
                cursor: "pointer",
                display: "grid",
                placeItems: "center",
                fontSize: 12,
                lineHeight: 1,
              }}
              aria-label="Open assessment date calendar"
            >
              🗓️
            </button>
          </div>

          {builderCalendarOpen ? (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 10px)",
                left: 0,
                zIndex: 20,
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
          gap: 10,
          justifySelf: "end",
          whiteSpace: "nowrap",
          transform: "translateY(1px)",
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