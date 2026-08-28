import Link from "next/link";

import {
  useMemo,
  useState,
} from "react";

import type {
  SavedAssessment,
} from "@/app/Assessments/SavedAssessments/SavedAssessment";

import {
  setCurrentSavedAssessmentId,
} from "@/app/Assessments/SavedAssessments/SavedAssessmentsStorage";

import type {
  CourseId,
} from "@/app/Courses/CourseTypes";

import type {
  AppTheme,
} from "@/app/UI/Application/Theme/AppTheme";

import {
  formatHomeShortDate,
  getHomeAssessmentCourseId,
  getHomeAssessmentName,
  getHomeDateKey,
  getUpcomingHomeAssessments,
  parseHomeAssessmentDate,
} from "../HomeDashboardData/HomeDashboardData";

import HomeSectionHeader from "../SharedComponents/HomeSectionHeader";


type Props = {
  assessments:
    SavedAssessment[];

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

        minHeight:
          410,

        height:
          "100%",

        padding:
          13,

        boxSizing:
          "border-box",

        display:
          "grid",

        alignContent:
          "start",

        gap:
          12,

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
        subtitle="Plan around what's approaching."
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
            "minmax(300px, 1fr) minmax(170px, 190px)",

          gap:
            13,
        }}
      >
        <div
          style={{
            minWidth:
              0,

            display:
              "grid",

            gap:
              8,
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
                  27,

                height:
                  27,

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
                  11.5,

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
                  27,

                height:
                  27,

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
                      18,

                    display:
                      "grid",

                    placeItems:
                      "center",

                    color:
                      theme.textMuted,

                    fontSize:
                      8.5,

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
                date
              ) => {
                const key =
                  getHomeDateKey(
                    date
                  );


                const dayAssessments =
                  assessmentsByDate.get(
                    key
                  ) ??
                  [];


                const currentMonth =
                  date.getMonth() ===
                  displayedMonth.getMonth();


                const isToday =
                  key ===
                  getHomeDateKey(
                    today
                  );


                return (
                  <div
                    key={
                      key
                    }
                    title={
                      dayAssessments
                        .map(
                          getHomeAssessmentName
                        )
                        .join(
                          "\n"
                        )
                    }
                    style={{
                      minWidth:
                        0,

                      height:
                        36,

                      padding:
                        "4px 5px",

                      boxSizing:
                        "border-box",

                      display:
                        "grid",

                      alignContent:
                        "space-between",

                      borderWidth:
                        1,

                      borderStyle:
                        "solid",

                      borderColor:
                        isToday
                          ? theme.controlSelectedBorder
                          : theme.borderStandard,

                      borderRadius:
                        5,

                      background:
                        isToday
                          ? `color-mix(
                              in srgb,
                              ${theme.accentPrimary} 11%,
                              ${theme.bgSection}
                            )`
                          : `color-mix(
                              in srgb,
                              ${theme.bgSection} 86%,
                              ${theme.bgElevated}
                            )`,

                      boxShadow:
                        isToday
                          ? `0 2px 7px ${theme.accentSoft}`
                          : "inset 0 1px 0 rgba(255,255,255,0.018)",

                      opacity:
                        currentMonth
                          ? 1
                          : 0.38,
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
                            ? 700
                            : 550,

                        lineHeight:
                          1,
                      }}
                    >
                      {date.getDate()}
                    </span>


                    <div
                      style={{
                        minHeight:
                          5,

                        display:
                          "flex",

                        alignItems:
                          "center",

                        gap:
                          2,
                      }}
                    >
                      {dayAssessments
                        .slice(
                          0,
                          3
                        )
                        .map(
                          (
                            assessment
                          ) => (
                            <span
                              key={
                                assessment.id
                              }
                              style={{
                                width:
                                  5,

                                height:
                                  5,

                                borderRadius:
                                  999,

                                background:
                                  getCourseColour(
                                    getHomeAssessmentCourseId(
                                      assessment
                                    )
                                  ),
                              }}
                            />
                          )
                        )}
                    </div>
                  </div>
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
              12,

            display:
              "grid",

            alignContent:
              "start",

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
              marginBottom:
                2,

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


          {upcoming.length >
          0 ? (
            upcoming.map(
              (
                assessment
              ) => {
                const date =
                  parseHomeAssessmentDate(
                    assessment.setup
                      .assessmentDate
                  );


                const accent =
                  getCourseColour(
                    getHomeAssessmentCourseId(
                      assessment
                    )
                  );


                return (
                  <Link
                    key={
                      assessment.id
                    }
                    href="/create-assessment/builder"
                    onClick={() =>
                      setCurrentSavedAssessmentId(
                        assessment.id
                      )
                    }
                    style={{
                      minWidth:
                        0,

                      padding:
                        "7px 7px 7px 10px",

                      position:
                        "relative",

                      overflow:
                        "hidden",

                      display:
                        "grid",

                      gap:
                        2,

                      borderWidth:
                        1,

                      borderStyle:
                        "solid",

                      borderColor:
                        `color-mix(
                          in srgb,
                          ${accent} 16%,
                          ${theme.borderStandard}
                        )`,

                      borderRadius:
                        5,

                      background:
                        `linear-gradient(
                          90deg,
                          color-mix(
                            in srgb,
                            ${accent} 8%,
                            ${theme.bgSection}
                          ) 0%,
                          ${theme.bgSection} 78%
                        )`,

                      color:
                        "inherit",

                      textDecoration:
                        "none",
                    }}
                  >
                    <span
                      aria-hidden="true"
                      style={{
                        position:
                          "absolute",

                        left:
                          0,

                        top:
                          0,

                        bottom:
                          0,

                        width:
                          3,

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

                        color:
                          theme.textPrimary,

                        fontSize:
                          10,

                        fontWeight:
                          650,

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


                    <span
                      style={{
                        color:
                          theme.textMuted,

                        fontSize:
                          9,

                        fontVariantNumeric:
                          "tabular-nums",
                      }}
                    >
                      {date
                        ? formatHomeShortDate(
                            date
                          )
                        : "No date"}
                      {" · "}
                      {assessment.status ===
                      "COMPLETE"
                        ? "Complete"
                        : "Draft"}
                    </span>
                  </Link>
                );
              }
            )
          ) : (
            <div
              style={{
                padding:
                  "8px 0",

                color:
                  theme.textMuted,

                fontSize:
                  10,

                lineHeight:
                  1.4,
              }}
            >
              No upcoming assessment dates yet.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}