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


function getGlowAnimationClass(
  colourCount:
    number
): string {
  if (
    colourCount <=
    1
  ) {
    return styles.glowOne;
  }


  if (
    colourCount ===
    2
  ) {
    return styles.glowTwo;
  }


  if (
    colourCount ===
    3
  ) {
    return styles.glowThree;
  }


  return styles.glowFour;
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


  /*
   * One pulse means one complete:
   *
   * 20% → 100% → 20%
   *
   * Proximity still controls how quickly
   * that complete throb occurs.
   */
  const pulseDurationPerColour =
    getCalendarPulseDurationSeconds(
      date,
      today
    );


  /*
   * If several Course colours share a date,
   * each colour receives one full pulse slot.
   *
   * Example with two Courses and a 5s urgency:
   *
   * 0–5s   Course A
   * 5–10s  Course B
   * 10–15s Course A
   * ...
   */
  const colourCount =
    Math.max(
      uniqueColours.length,
      1
    );


  const fullGlowCycleDuration =
    pulseDurationPerColour *
    colourCount;


  const classNames =
    [
      styles.calendarDay,

      hasAssessments
        ? styles.eventDay
        : "",

      isToday
        ? styles.today
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
        minWidth:
          0,

        height:
          46,

        padding:
          "4px 5px",

        boxSizing:
          "border-box",

        position:
          "relative",

        display:
          "grid",

        borderWidth:
          1,

        borderStyle:
          "solid",

        borderColor:
          isToday
            ? "rgba(255,255,255,0.68)"
            : hasAssessments
              ? uniqueColours.length ===
                  1
                ? `color-mix(
                    in srgb,
                    ${primaryAccent} 38%,
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
      {hasAssessments &&
      !isToday
        ? uniqueColours.map(
            (
              colour,
              index
            ) => {
              /*
               * No date-dependent/random offset anymore.
               *
               * Every assessment day begins from the exact
               * same animation phase.
               *
               * The only stagger is between multiple Course
               * colours INSIDE the same date.
               */
              const glowStyle =
                {
                  "--calendar-layer-colour":
                    colour,

                  "--calendar-glow-cycle-duration":
                    `${fullGlowCycleDuration}s`,

                  animationDelay:
                    `${index *
                    pulseDurationPerColour}s`,
                } as CSSProperties;


              return (
                <span
                  key={`${colour}-${index}`}
                  aria-hidden="true"
                  className={[
                    styles.glowLayer,
                    getGlowAnimationClass(
                      colourCount
                    ),
                  ].join(
                    " "
                  )}
                  style={
                    glowStyle
                  }
                />
              );
            }
          )
        : null}


      <div
        className={
          styles.dayContent
        }
        style={{
          display:
            "grid",

          gridTemplateRows:
            "auto minmax(0, 1fr)",

          gap:
            2,
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