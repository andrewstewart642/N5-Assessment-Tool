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
          260,

        padding:
          14,

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
          theme.borderStandard,

        borderRadius:
          6,

        background:
          theme.bgSurface,

        boxShadow:
          theme.shadow,
      }}
    >
      <HomeSectionHeader
        title="Upcoming assessments"
        subtitle="Assessment dates across your classes."
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
            "minmax(250px, 1fr) minmax(190px, 0.72fr)",

          gap:
            12,
        }}
      >
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
                  theme.controlBg,

                color:
                  theme.textSecondary,

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
                  650,
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
                  theme.controlBg,

                color:
                  theme.textSecondary,

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
                3,
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
                      650,
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
                        30,

                      padding:
                        "3px 4px",

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
                        4,

                      background:
                        isToday
                          ? `color-mix(
                              in srgb,
                              ${theme.accentPrimary} 8%,
                              ${theme.bgSection}
                            )`
                          : theme.bgSection,

                      opacity:
                        currentMonth
                          ? 1
                          : 0.42,
                    }}
                  >
                    <span
                      style={{
                        color:
                          isToday
                            ? theme.textPrimary
                            : theme.textSecondary,

                        fontSize:
                          8.5,

                        fontWeight:
                          isToday
                            ? 700
                            : 500,

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
                9,

              fontWeight:
                700,

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
                        "7px 8px 7px 10px",

                      position:
                        "relative",

                      overflow:
                        "hidden",

                      display:
                        "grid",

                      gap:
                        3,

                      borderWidth:
                        1,

                      borderStyle:
                        "solid",

                      borderColor:
                        theme.borderStandard,

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
                          ${theme.bgSection} 75%
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
                          10.5,

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
                          9.5,

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
                  10.5,

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