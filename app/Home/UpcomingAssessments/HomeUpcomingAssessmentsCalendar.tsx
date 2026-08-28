import {
  useMemo,
  useState,
} from "react";

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
  getHomeDateKey,
  getUpcomingHomeAssessments,
  parseHomeAssessmentDate,
} from "../HomeDashboardData/HomeDashboardData";

import HomeSectionHeader from "../SharedComponents/HomeSectionHeader";

import HomeAssessmentTimelineCard from "./AssessmentTimeline/HomeAssessmentTimelineCard";

import HomeCalendarDay from "./CalendarGrid/HomeCalendarDay";

import {
  getRecentHomeAssessments,
} from "./HomeAssessmentCalendarHelpers";


type Props = {
  assessments:
    SavedAssessment[];

  classes:
    SchoolClass[];

  today:
    Date;

  getCourseColour:
    (
      courseId:
        CourseId | null
    ) => string;

  theme:
    AppTheme;
};


const WEEKDAY_LABELS = [
  "M",
  "T",
  "W",
  "T",
  "F",
  "S",
  "S",
];


function buildCalendarDays(
  month:
    Date
): Date[] {
  const firstDay =
    new Date(
      month.getFullYear(),
      month.getMonth(),
      1
    );


  const mondayOffset =
    (
      firstDay.getDay() +
      6
    ) %
    7;


  const calendarStart =
    new Date(
      firstDay.getFullYear(),
      firstDay.getMonth(),
      1 -
        mondayOffset
    );


  return Array.from(
    {
      length:
        42,
    },
    (
      _,
      index
    ) =>
      new Date(
        calendarStart.getFullYear(),
        calendarStart.getMonth(),
        calendarStart.getDate() +
          index
      )
  );
}


export default function HomeUpcomingAssessmentsCalendar({
  assessments,
  classes,
  today,
  getCourseColour,
  theme,
}: Props) {
  const [
    displayedMonth,
    setDisplayedMonth,
  ] =
    useState(
      () =>
        new Date(
          today.getFullYear(),
          today.getMonth(),
          1
        )
    );


  const calendarDays =
    useMemo(
      () =>
        buildCalendarDays(
          displayedMonth
        ),
      [
        displayedMonth,
      ]
    );


  const assessmentsByDate =
    useMemo(
      () => {
        const mapped =
          new Map<
            string,
            SavedAssessment[]
          >();


        for (
          const assessment
          of assessments
        ) {
          const date =
            parseHomeAssessmentDate(
              assessment.setup
                .assessmentDate
            );


          if (
            !date
          ) {
            continue;
          }


          const key =
            getHomeDateKey(
              date
            );


          const existing =
            mapped.get(
              key
            ) ??
            [];


          existing.push(
            assessment
          );


          mapped.set(
            key,
            existing
          );
        }


        return mapped;
      },
      [
        assessments,
      ]
    );


  const recent =
    getRecentHomeAssessments(
      assessments,
      today,
      3
    );


  const upcoming =
    getUpcomingHomeAssessments(
      assessments,
      today
    ).slice(
      0,
      3
    );


  const monthLabel =
    displayedMonth.toLocaleDateString(
      "en-GB",
      {
        month:
          "long",

        year:
          "numeric",
      }
    );


  function moveMonth(
    offset:
      number
  ) {
    setDisplayedMonth(
      (
        current
      ) =>
        new Date(
          current.getFullYear(),
          current.getMonth() +
            offset,
          1
        )
    );
  }


  return (
    <section
      style={{
        minWidth:
          0,

        padding:
          12,

        boxSizing:
          "border-box",

        display:
          "grid",

        alignContent:
          "start",

        gap:
          11,

        borderWidth:
          1,

        borderStyle:
          "solid",

        borderColor:
          `color-mix(
            in srgb,
            ${theme.textMuted} 12%,
            ${theme.borderStandard}
          )`,

        borderRadius:
          6,

        background:
          `linear-gradient(
            180deg,
            ${theme.bgElevated} 0%,
            color-mix(
              in srgb,
              ${theme.bgElevated} 72%,
              ${theme.bgSurface}
            ) 100%
          )`,

        boxShadow:
          `${theme.shadowStrong}, inset 0 1px 0 rgba(255,255,255,0.025)`,
      }}
    >
      <HomeSectionHeader
        title="Upcoming assessments"
        subtitle="Recent activity, today and what's approaching."
        actionLabel="All assessments"
        actionHref="/my-assessments"
        theme={
          theme
        }
      />


      <div
        style={{
          minWidth:
            0,

          display:
            "grid",

          gridTemplateColumns:
            "minmax(125px, 0.34fr) minmax(360px, 1fr) minmax(135px, 0.36fr)",

          gap:
            11,

          alignItems:
            "stretch",
        }}
      >
        <div
          style={{
            minWidth:
              0,

            paddingRight:
              10,

            display:
              "grid",

            gridTemplateRows:
              "auto minmax(0, 1fr)",

            gap:
              6,

            borderRightWidth:
              1,

            borderRightStyle:
              "solid",

            borderRightColor:
              theme.borderStandard,
          }}
        >
          <span
            style={{
              color:
                theme.textMuted,

              fontSize:
                8.5,

              fontWeight:
                750,

              letterSpacing:
                "0.05em",

              textTransform:
                "uppercase",
            }}
          >
            Recent
          </span>


          <div
            style={{
              display:
                "flex",

              flexDirection:
                "column",

              justifyContent:
                "flex-end",

              gap:
                5,
            }}
          >
            {recent.length >
            0 ? (
              [
                ...recent,
              ]
                .reverse()
                .map(
                  (
                    assessment
                  ) => (
                    <HomeAssessmentTimelineCard
                      key={
                        assessment.id
                      }
                      assessment={
                        assessment
                      }
                      classes={
                        classes
                      }
                      accent={
                        getCourseColour(
                          getHomeAssessmentCourseId(
                            assessment
                          )
                        )
                      }
                      theme={
                        theme
                      }
                    />
                  )
                )
            ) : (
              <span
                style={{
                  color:
                    theme.textMuted,

                  fontSize:
                    9,
                }}
              >
                No recent assessments.
              </span>
            )}
          </div>
        </div>


        <div
          style={{
            minWidth:
              0,

            display:
              "grid",

            gap:
              7,
          }}
        >
          <div
            style={{
              display:
                "flex",

              alignItems:
                "center",

              justifyContent:
                "space-between",

              gap:
                8,
            }}
          >
            <button
              type="button"
              aria-label="Previous month"
              onClick={() =>
                moveMonth(
                  -1
                )
              }
              style={{
                width:
                  26,

                height:
                  26,

                padding:
                  0,

                display:
                  "grid",

                placeItems:
                  "center",

                borderWidth:
                  1,

                borderStyle:
                  "solid",

                borderColor:
                  theme.borderStandard,

                borderRadius:
                  5,

                background:
                  theme.bgSection,

                color:
                  theme.textSecondary,

                boxShadow:
                  theme.shadow,

                cursor:
                  "pointer",
              }}
            >
              ‹
            </button>


            <span
              style={{
                color:
                  theme.textPrimary,

                fontSize:
                  11,

                fontWeight:
                  700,
              }}
            >
              {monthLabel}
            </span>


            <button
              type="button"
              aria-label="Next month"
              onClick={() =>
                moveMonth(
                  1
                )
              }
              style={{
                width:
                  26,

                height:
                  26,

                padding:
                  0,

                display:
                  "grid",

                placeItems:
                  "center",

                borderWidth:
                  1,

                borderStyle:
                  "solid",

                borderColor:
                  theme.borderStandard,

                borderRadius:
                  5,

                background:
                  theme.bgSection,

                color:
                  theme.textSecondary,

                boxShadow:
                  theme.shadow,

                cursor:
                  "pointer",
              }}
            >
              ›
            </button>
          </div>


          <div
            style={{
              display:
                "grid",

              gridTemplateColumns:
                "repeat(7, minmax(0, 1fr))",

              gap:
                4,
            }}
          >
            {WEEKDAY_LABELS.map(
              (
                label,
                index
              ) => (
                <div
                  key={`${label}-${index}`}
                  style={{
                    height:
                      16,

                    display:
                      "grid",

                    placeItems:
                      "center",

                    color:
                      theme.textMuted,

                    fontSize:
                      8,

                    fontWeight:
                      700,
                  }}
                >
                  {label}
                </div>
              )
            )}


            {calendarDays.map(
              (
                date,
                index
              ) => {
                const key =
                  getHomeDateKey(
                    date
                  );


                return (
                  <HomeCalendarDay
                    key={
                      key
                    }
                    date={
                      date
                    }
                    assessments={
                      assessmentsByDate.get(
                        key
                      ) ??
                      []
                    }
                    classes={
                      classes
                    }
                    currentMonth={
                      date.getMonth() ===
                      displayedMonth.getMonth()
                    }
                    today={
                      today
                    }
                    gridIndex={
                      index
                    }
                    getCourseColour={
                      getCourseColour
                    }
                    theme={
                      theme
                    }
                  />
                );
              }
            )}
          </div>
        </div>


        <div
          style={{
            minWidth:
              0,

            paddingLeft:
              10,

            display:
              "grid",

            gridTemplateRows:
              "auto minmax(0, 1fr)",

            gap:
              6,

            borderLeftWidth:
              1,

            borderLeftStyle:
              "solid",

            borderLeftColor:
              theme.borderStandard,
          }}
        >
          <span
            style={{
              color:
                theme.textMuted,

              fontSize:
                8.5,

              fontWeight:
                750,

              letterSpacing:
                "0.05em",

              textTransform:
                "uppercase",
            }}
          >
            Next up
          </span>


          <div
            style={{
              display:
                "flex",

              flexDirection:
                "column",

              gap:
                5,
            }}
          >
            {upcoming.length >
            0 ? (
              upcoming.map(
                (
                  assessment
                ) => (
                  <HomeAssessmentTimelineCard
                    key={
                      assessment.id
                    }
                    assessment={
                      assessment
                    }
                    classes={
                      classes
                    }
                    accent={
                      getCourseColour(
                        getHomeAssessmentCourseId(
                          assessment
                        )
                      )
                    }
                    theme={
                      theme
                    }
                  />
                )
              )
            ) : (
              <span
                style={{
                  color:
                    theme.textMuted,

                  fontSize:
                    9,
                }}
              >
                Nothing scheduled.
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}