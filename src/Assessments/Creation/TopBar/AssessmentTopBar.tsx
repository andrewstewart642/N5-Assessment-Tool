import ClassCoverageSelect from "@/src/Classes/Coverage/ClassCoverageSelect";

import type {
  SchoolClass,
} from "@/src/Classes/ClassTypes";

import type {
  Paper,
} from "@/src/Assessments/AssessmentTypes";

import type {
  AppTheme,
} from "@/src/UI/Application/Theme/AppTheme";

import {
  UI_TYPO,
} from "@/src/UI/Application/Typography/Typography";

import AssessmentDateField from "./AssessmentDateField";

import AssessmentMetaField from "./AssessmentMetaField";

import PaperViewingToggle from "./PaperViewingToggle";

import PreviewZoomControls from "./PreviewZoomControls";

type AssessmentTopBarProps = {
  theme: AppTheme;

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

  zoomPct:
    number;

  zoomIn:
    () => void;

  zoomOut:
    () => void;

  currentViewerPage:
    number;

  totalViewerPages:
    number;
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

  zoomPct,
  zoomIn,
  zoomOut,
  currentViewerPage,
  totalViewerPages,
}: AssessmentTopBarProps) {
  return (
    <div
      style={{
        borderBottom:
          `1px solid ${theme.borderStandard}`,

        background:
          theme.bgSurface,

        display:
          "grid",

        gridTemplateRows:
          "auto auto",

        rowGap:
          10,

        padding:
          "8px 12px 60px",

        boxSizing:
          "border-box",

        minHeight:
          0,

        position:
          "relative",

        zIndex:
          5,
      }}
    >
      <div
        style={{
          display:
            "flex",

          alignItems:
            "flex-start",

          gap:
            12,

          minWidth:
            0,
        }}
      >
        <div
          style={{
            display:
              "flex",

            alignItems:
              "flex-start",

            gap:
              12,

            flex:
              "1 1 auto",

            minWidth:
              0,
          }}
        >
          <div
            style={{
              flex:
                "1.2 1 0",

              minWidth:
                0,
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
          </div>

          <div
            style={{
              flex:
                "1 1 0",

              minWidth:
                0,
            }}
          >
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
              dropdownWidth={
                340
              }
              zIndex={
                320
              }
              theme={
                theme
              }
            />
          </div>
        </div>

        <div
          style={{
            display:
              "flex",

            alignItems:
              "flex-start",

            gap:
              12,

            flex:
              "0 0 auto",

            minWidth:
              0,
          }}
        >
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

          <div
            style={{
              display:
                "grid",

              gap:
                4,

              width:
                "fit-content",

              fontFamily:
                UI_TYPO.family,
            }}
          >
            <span
              style={{
                fontSize:
                  12,

                fontWeight:
                  UI_TYPO.weightMedium,

                color:
                  theme.textMuted,

                lineHeight:
                  1.2,

                whiteSpace:
                  "nowrap",
              }}
            >
              Viewing
            </span>

            <div
              style={{
                height:
                  32,

                display:
                  "flex",

                alignItems:
                  "center",
              }}
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
            </div>
          </div>
        </div>
      </div>

      <PreviewZoomControls
        theme={
          theme
        }
        zoomPct={
          zoomPct
        }
        zoomIn={
          zoomIn
        }
        zoomOut={
          zoomOut
        }
        currentViewerPage={
          currentViewerPage
        }
        totalViewerPages={
          totalViewerPages
        }
      />
    </div>
  );
}