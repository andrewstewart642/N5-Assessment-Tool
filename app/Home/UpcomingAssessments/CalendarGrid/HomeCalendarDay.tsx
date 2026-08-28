import type {
  CSSProperties,
} from "react";

import type {
  SavedAssessment,
} from "@/app/Assessments/SavedAssessments/SavedAssessment";

import type {
  SchoolClass,
} from "@/app/Classes/ClassTypes";

import type {
  CourseId,
} from "@/app/Courses/CourseTypes";

import type {
  AppTheme,
} from "@/app/UI/Application/Theme/AppTheme";

import {
  getHomeAssessmentCourseId,
  getHomeDateKey,
} from "../../HomeDashboardData/HomeDashboardData";

import HomeCalendarDayHoverCard from "../CalendarHoverDetails/HomeCalendarDayHoverCard";

import {
  getCalendarAssessmentPrimaryClassLabel,
  getCalendarPulseDurationSeconds,
} from "../HomeAssessmentCalendarHelpers";

import styles from "./HomeCalendarDayAnimations.module.css";


type Props = {
  date:
    Date;

  assessments:
    SavedAssessment[];

  classes:
    SchoolClass[];

  currentMonth:
    boolean;

  today:
    Date;

  gridIndex:
    number;

  getCourseColour:
    (
      courseId:
        CourseId | null
    ) => string;

  theme:
    AppTheme;
};


function getPulseClass(
  colourCount:
    number
): string {
  if (
    colourCount <=
    1
  ) {
    return styles.pulseOne;
  }


  if (
    colourCount ===
    2
  ) {
    return styles.pulseTwo;
  }


  if (
    colourCount ===
    3
  ) {
    return styles.pulseThree;
  }


  return styles.pulseFour;
}


export default function HomeCalendarDay({
  date,
  assessments,
  classes,
  currentMonth,
  today,
  gridIndex,
  getCourseColour,
  theme,
}: Props) {
  const isToday =
    getHomeDateKey(
      date
    ) ===
    getHomeDateKey(
      today
    );


  const hasAssessments =
    assessments.length >
    0;


  const uniqueColours =
    Array.from(
      new Set(
        assessments.map(
          (
            assessment
          ) =>
            getCourseColour(
              getHomeAssessmentCourseId(
                assessment
              )
            )
        )
      )
    ).slice(
      0,
      4
    );


  const primaryAccent =
    uniqueColours[0] ??
    theme.accentPrimary;


  const pulseDurationPerColour =
    getCalendarPulseDurationSeconds(
      date,
      today
    );


  const colourCycleCount =
    Math.max(
      uniqueColours.length,
      1
    );


  const fullPulseCycleDuration =
    pulseDurationPerColour *
    colourCycleCount;


  const pulseVariables =
    {
      "--calendar-pulse-duration":
        `${fullPulseCycleDuration}s`,

      "--calendar-pulse-delay":
        `${-(
          (
            date.getDate() %
            4
          ) *
          0.35
        ).toFixed(
          2
        )}s`,

      "--calendar-glow-a":
        uniqueColours[0] ??
        primaryAccent,

      "--calendar-glow-b":
        uniqueColours[1] ??
        primaryAccent,

      "--calendar-glow-c":
        uniqueColours[2] ??
        primaryAccent,

      "--calendar-glow-d":
        uniqueColours[3] ??
        primaryAccent,
    } as CSSProperties;


  const classNames =
    [
      styles.calendarDay,

      hasAssessments
        ? styles.eventDay
        : "",

      isToday
        ? styles.today
        : "",

      hasAssessments &&
      !isToday
        ? getPulseClass(
            uniqueColours.length
          )
        : "",
    ]
      .filter(
        Boolean
      )
      .join(
        " "
      );


  const columnIndex =
    gridIndex %
    7;


  const rowIndex =
    Math.floor(
      gridIndex /
      7
    );


  const visibleAssessments =
    assessments.slice(
      0,
      2
    );


  return (
    <div
      className={
        classNames
      }
      tabIndex={
        hasAssessments
          ? 0
          : undefined
      }
      style={{
        ...pulseVariables,

        minWidth:
          0,

        height:
          46,

        padding:
          "4px 5px",

        boxSizing:
          "border-box",

        display:
          "grid",

        gridTemplateRows:
          "auto minmax(0, 1fr)",

        gap:
          2,

        borderWidth:
          1,

        borderStyle:
          "solid",

        borderColor:
          isToday
            ? "rgba(255,255,255,0.62)"
            : hasAssessments
              ? uniqueColours.length ===
                  1
                ? `color-mix(
                    in srgb,
                    ${primaryAccent} 34%,
                    ${theme.borderStandard}
                  )`
                : `color-mix(
                    in srgb,
                    ${theme.textSecondary} 20%,
                    ${theme.borderStandard}
                  )`
              : theme.borderStandard,

        borderRadius:
          5,

        background:
          isToday
            ? `color-mix(
                in srgb,
                ${theme.paper} 5%,
                ${theme.bgSection}
              )`
            : hasAssessments
              ? `linear-gradient(
                  145deg,
                  color-mix(
                    in srgb,
                    ${primaryAccent} 7%,
                    ${theme.bgSection}
                  ) 0%,
                  ${theme.bgSection} 74%
                )`
              : `color-mix(
                  in srgb,
                  ${theme.bgSection} 86%,
                  ${theme.bgElevated}
                )`,

        opacity:
          currentMonth
            ? 1
            : hasAssessments
              ? 0.64
              : 0.34,

        cursor:
          hasAssessments
            ? "default"
            : "inherit",
      }}
    >
      <span
        style={{
          color:
            isToday
              ? theme.textPrimary
              : theme.textSecondary,

          fontSize:
            9,

          fontWeight:
            isToday
              ? 750
              : 600,

          lineHeight:
            1,
        }}
      >
        {date.getDate()}
      </span>


      <div
        style={{
          minWidth:
            0,

          display:
            "grid",

          alignContent:
            "end",

          gap:
            1,
        }}
      >
        {visibleAssessments.map(
          (
            assessment
          ) => {
            const accent =
              getCourseColour(
                getHomeAssessmentCourseId(
                  assessment
                )
              );


            return (
              <div
                key={
                  assessment.id
                }
                style={{
                  minWidth:
                    0,

                  display:
                    "flex",

                  alignItems:
                    "center",

                  gap:
                    3,

                  color:
                    theme.textSecondary,

                  fontSize:
                    8,

                  lineHeight:
                    1.05,
                }}
              >
                <span
                  style={{
                    width:
                      4,

                    height:
                      4,

                    flexShrink:
                      0,

                    borderRadius:
                      999,

                    background:
                      accent,
                  }}
                />


                <span
                  style={{
                    minWidth:
                      0,

                    overflow:
                      "hidden",

                    whiteSpace:
                      "nowrap",

                    textOverflow:
                      "ellipsis",
                  }}
                >
                  {getCalendarAssessmentPrimaryClassLabel(
                    assessment,
                    classes
                  )}
                </span>
              </div>
            );
          }
        )}


        {assessments.length >
        2 ? (
          <span
            style={{
              paddingLeft:
                7,

              color:
                theme.textMuted,

              fontSize:
                7.5,

              lineHeight:
                1,
            }}
          >
            +
            {assessments.length -
              2}
          </span>
        ) : null}
      </div>


      {hasAssessments ? (
        <HomeCalendarDayHoverCard
          date={
            date
          }
          assessments={
            assessments
          }
          classes={
            classes
          }
          alignRight={
            columnIndex >=
            5
          }
          preferAbove={
            rowIndex >=
            4
          }
          getCourseColour={
            getCourseColour
          }
          className={
            styles.hoverCard
          }
          theme={
            theme
          }
        />
      ) : null}
    </div>
  );
}