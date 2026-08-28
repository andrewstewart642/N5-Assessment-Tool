import type {
  SavedAssessment,
} from "@/app/Assessments/SavedAssessments/SavedAssessment";

import type {
  SchoolClass,
} from "@/app/Classes/ClassData";

import type {
  CourseId,
} from "@/app/Courses/CourseTypes";

import type {
  AppTheme,
} from "@/app/UI/Application/Theme/AppTheme";

import {
  getHomeAssessmentCourseId,
  getHomeAssessmentCourseLabel,
  getHomeAssessmentName,
  getHomeAssessmentProgress,
  getHomeAssessmentTypeLabel,
} from "../../HomeDashboardData/HomeDashboardData";

import {
  getCalendarAssessmentClassLabels,
  getCalendarAssessmentStatus,
  getCalendarAssessmentStatusLabel,
} from "../HomeAssessmentCalendarHelpers";


type Props = {
  date:
    Date;

  assessments:
    SavedAssessment[];

  classes:
    SchoolClass[];

  alignRight:
    boolean;

  preferAbove:
    boolean;

  getCourseColour:
    (
      courseId:
        CourseId | null
    ) => string;

  className:
    string;

  theme:
    AppTheme;
};


function getStatusColour(
  assessment:
    SavedAssessment,

  theme:
    AppTheme
): string {
  switch (
    getCalendarAssessmentStatus(
      assessment
    )
  ) {
    case "COMPLETE":
    case "READY_FOR_PRINT":
      return theme.success;

    case "IN_PROGRESS":
      return theme.warning;

    case "NOT_STARTED":
    default:
      return theme.textMuted;
  }
}


export default function HomeCalendarDayHoverCard({
  date,
  assessments,
  classes,
  alignRight,
  preferAbove,
  getCourseColour,
  className,
  theme,
}: Props) {
  const dateLabel =
    date.toLocaleDateString(
      "en-GB",
      {
        weekday:
          "long",

        day:
          "numeric",

        month:
          "long",

        year:
          "numeric",
      }
    );


  return (
    <div
      className={
        className
      }
      style={{
        left:
          alignRight
            ? "auto"
            : 0,

        right:
          alignRight
            ? 0
            : "auto",

        top:
          preferAbove
            ? "auto"
            : "calc(100% + 7px)",

        bottom:
          preferAbove
            ? "calc(100% + 7px)"
            : "auto",

        padding:
          10,

        boxSizing:
          "border-box",

        borderWidth:
          1,

        borderStyle:
          "solid",

        borderColor:
          theme.borderStandard,

        borderRadius:
          6,

        background:
          theme.bgElevated,

        boxShadow:
          theme.shadowStrong,
      }}
    >
      <div
        style={{
          marginBottom:
            8,

          color:
            theme.textPrimary,

          fontSize:
            10.5,

          fontWeight:
            700,
        }}
      >
        {dateLabel}
      </div>


      <div
        style={{
          display:
            "grid",

          gap:
            7,
        }}
      >
        {assessments.map(
          (
            assessment
          ) => {
            const accent =
              getCourseColour(
                getHomeAssessmentCourseId(
                  assessment
                )
              );


            const progress =
              getHomeAssessmentProgress(
                assessment
              );


            const classLabels =
              getCalendarAssessmentClassLabels(
                assessment,
                classes
              );


            return (
              <div
                key={
                  assessment.id
                }
                style={{
                  paddingTop:
                    7,

                  display:
                    "grid",

                  gap:
                    3,

                  borderTopWidth:
                    1,

                  borderTopStyle:
                    "solid",

                  borderTopColor:
                    theme.borderStandard,
                }}
              >
                <div
                  style={{
                    minWidth:
                      0,

                    display:
                      "flex",

                    alignItems:
                      "center",

                    gap:
                      6,
                  }}
                >
                  <span
                    style={{
                      width:
                        6,

                      height:
                        6,

                      flexShrink:
                        0,

                      borderRadius:
                        999,

                      background:
                        accent,

                      boxShadow:
                        `0 0 6px ${accent}`,
                    }}
                  />


                  <span
                    style={{
                      minWidth:
                        0,

                      overflow:
                        "hidden",

                      color:
                        theme.textPrimary,

                      fontSize:
                        10,

                      fontWeight:
                        700,

                      whiteSpace:
                        "nowrap",

                      textOverflow:
                        "ellipsis",
                    }}
                  >
                    {getHomeAssessmentName(
                      assessment
                    )}
                  </span>
                </div>


                <div
                  style={{
                    paddingLeft:
                      12,

                    color:
                      accent,

                    fontSize:
                      9,

                    fontWeight:
                      600,
                  }}
                >
                  {getHomeAssessmentCourseLabel(
                    assessment
                  )}
                  {" · "}
                  {getHomeAssessmentTypeLabel(
                    assessment
                  )}
                </div>


                <div
                  style={{
                    paddingLeft:
                      12,

                    color:
                      theme.textSecondary,

                    fontSize:
                      9,
                  }}
                >
                  {classLabels.join(
                    ", "
                  )}
                </div>


                <div
                  style={{
                    paddingLeft:
                      12,

                    display:
                      "flex",

                    alignItems:
                      "center",

                    gap:
                      5,

                    color:
                      getStatusColour(
                        assessment,
                        theme
                      ),

                    fontSize:
                      9,

                    fontWeight:
                      600,
                  }}
                >
                  <span
                    style={{
                      width:
                        5,

                      height:
                        5,

                      borderRadius:
                        999,

                      background:
                        "currentColor",
                    }}
                  />

                  {getCalendarAssessmentStatusLabel(
                    assessment
                  )}

                  {progress.targetMarks >
                  0 ? (
                    <span
                      style={{
                        color:
                          theme.textMuted,

                        fontWeight:
                          500,
                      }}
                    >
                      · {progress.assignedMarks}
                      {" / "}
                      {progress.targetMarks}
                      {" marks"}
                    </span>
                  ) : null}
                </div>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
}