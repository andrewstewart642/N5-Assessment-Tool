import ClassCoverageSelect from "@/app/Classes/Coverage/ClassCoverageSelect";

import type {
  SchoolClass,
} from "@/app/Classes/ClassTypes";

import type {
  Paper,
} from "@/app/Assessments/AssessmentTypes";

import type {
  AppTheme,
} from "@/app/UI/Application/Theme/AppTheme";

import AssessmentDateField from "./AssessmentDateField";

import AssessmentMetaField from "./AssessmentMetaField";

import AssessmentTopBarField from "./AssessmentTopBarField";

import {
  TOP_BAR_COLUMN_GAP,
  TOP_BAR_HORIZONTAL_PADDING,
} from "./AssessmentTopBarTokens";

import PaperViewingToggle from "./PaperViewingToggle";

type AssessmentTopBarProps = {
  theme:
    AppTheme;

  assessmentName:
    string;

  setAssessmentName:
    React.Dispatch<
      React.SetStateAction<string>
    >;

  assessmentDate:
    string;

  setAssessmentDate:
    React.Dispatch<
      React.SetStateAction<string>
    >;

  builderCalendarOpen:
    boolean;

  setBuilderCalendarOpen:
    React.Dispatch<
      React.SetStateAction<boolean>
    >;

  builderDateFieldRef:
    React.RefObject<
      HTMLDivElement | null
    >;

  handleAssessmentNameFocus:
    () => void;

  handleAssessmentNameBlur:
    () => void;

  viewPaper:
    Paper;

  setViewPaper:
    React.Dispatch<
      React.SetStateAction<Paper>
    >;

  classLevelLabel:
    string | null;

  availableClasses:
    SchoolClass[];

  selectedClassIds:
    string[];

  useCompleteCourseCoverage:
    boolean;

  onToggleClass: (
    classId: string
  ) => void;

  onSelectCompleteCourseCoverage:
    () => void;
};

export default function AssessmentTopBar({
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
}: AssessmentTopBarProps) {
  return (
    <div
      style={{
        height:
          "100%",

        minWidth:
          0,

        boxSizing:
          "border-box",

        /*
         * No fixed vertical padding.
         *
         * The complete label/control stack is centred
         * inside the TopBar, which guarantees equal
         * visual space above and below regardless of
         * the exact label line-height.
         */
        padding:
          `0 ${TOP_BAR_HORIZONTAL_PADDING}px`,

        borderBottom:
          `1px solid ${theme.borderStandard}`,

        background:
          theme.bgSection,

        display:
          "grid",

        gridTemplateColumns:
          "minmax(160px, 1.25fr) minmax(170px, 1fr) 150px max-content",

        columnGap:
          TOP_BAR_COLUMN_GAP,

        alignItems:
          "center",

        position:
          "relative",
      }}
    >
      <AssessmentMetaField
        label="Name"
        value={
          assessmentName
        }
        onChange={
          setAssessmentName
        }
        onFocus={
          handleAssessmentNameFocus
        }
        onBlur={
          handleAssessmentNameBlur
        }
        theme={
          theme
        }
      />

      <ClassCoverageSelect
        levelLabel={
          classLevelLabel
        }
        classes={
          availableClasses
        }
        selectedClassIds={
          selectedClassIds
        }
        useCompleteCourseCoverage={
          useCompleteCourseCoverage
        }
        onToggleClass={
          onToggleClass
        }
        onSelectCompleteCourseCoverage={
          onSelectCompleteCourseCoverage
        }
        label="Class"
        emptyText="Select classes"
        disabledText="No level"
        completeCoverageSummaryText="Complete course"
        hideHelperText
        compact
        width="100%"
        dropdownWidth="min(300px, calc(100vw - 32px))"
        zIndex={
          320
        }
        theme={
          theme
        }
      />

      <AssessmentDateField
        theme={
          theme
        }
        assessmentDate={
          assessmentDate
        }
        setAssessmentDate={
          setAssessmentDate
        }
        builderCalendarOpen={
          builderCalendarOpen
        }
        setBuilderCalendarOpen={
          setBuilderCalendarOpen
        }
        builderDateFieldRef={
          builderDateFieldRef
        }
      />

      <AssessmentTopBarField
        label="Viewing"
        theme={
          theme
        }
        width="fit-content"
      >
        <PaperViewingToggle
          value={
            viewPaper
          }
          onChange={
            setViewPaper
          }
          theme={
            theme
          }
        />
      </AssessmentTopBarField>
    </div>
  );
}