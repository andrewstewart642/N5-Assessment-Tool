"use client";

import Link from "next/link";

import {
  use,
  useMemo,
  useState,
} from "react";

import {
  getCourseAccentTextColour,
} from "@/app/UI/Application/Colours/CourseAccent";

import {
  useCourseColourPreferences,
} from "@/app/UI/Application/Colours/useCourseColourPreferences";

import {
  useSettings,
} from "@/app/UI/Application/Settings/ApplicationSettings";

import ClassCoverageDetails from "./Coverage/ClassCoverageDetails";

import type {
  ClassCoverageSelection,
} from "./Coverage/ClassCoverageSelection";

import ClassCoverageTree from "./Coverage/ClassCoverageTree";

import {
  getCourseCoverage,
} from "./Coverage/ClassCoverageHelpers";

import {
  useClasses,
} from "./State/useClasses";


type Props = {
  params:
    Promise<{
      classId:
        string;
    }>;
};


function formatLastUpdated(
  timestamp:
    number
): string {
  const date =
    new Date(
      timestamp
    );


  const dateText =
    date.toLocaleDateString(
      "en-GB",
      {
        day:
          "numeric",

        month:
          "short",

        year:
          "numeric",
      }
    );


  const timeText =
    date.toLocaleTimeString(
      "en-GB",
      {
        hour:
          "2-digit",

        minute:
          "2-digit",
      }
    );


  return `${dateText} at ${timeText}`;
}


export default function ClassDetailsPage({
  params,
}: Props) {
  const {
    classId,
  } =
    use(
      params
    );


  const {
    theme,
  } =
    useSettings();


  const {
    getColour,
  } =
    useCourseColourPreferences();


  const {
    hasLoaded,
    getClassById,
    updateCompletedSkills,
    updateCompletedConcepts,
  } =
    useClasses();


  const schoolClass =
    getClassById(
      classId
    );


  const [
    selection,
    setSelection,
  ] =
    useState<ClassCoverageSelection>(
      null
    );


  const courseAccent =
    schoolClass
      ? getColour(
          schoolClass.courseId
        )
      : theme.accentPrimary;


  const courseAccentText =
    getCourseAccentTextColour(
      courseAccent,
      theme
    );


  const coverage =
  useMemo(
    () =>
      schoolClass
        ? getCourseCoverage(
            schoolClass.courseId,
            schoolClass.completedConceptIds,
            schoolClass.completedSkillIds
          )
        : {
            completedSkills:
              0,

            totalSkills:
              0,

            progressPct:
              0,
          },
    [
      schoolClass,
    ]
  );


  function handleToggleSkill(
    skillId:
      string
  ) {
    if (
      !schoolClass
    ) {
      return;
    }


    const alreadyComplete =
      schoolClass.completedSkillIds.includes(
        skillId
      );


    const nextCompletedSkillIds =
      alreadyComplete
        ? schoolClass.completedSkillIds.filter(
            (
              id
            ) =>
              id !==
              skillId
          )
        : [
            ...schoolClass.completedSkillIds,
            skillId,
          ];


    updateCompletedSkills({
      classId:
        schoolClass.id,

      completedSkillIds:
        nextCompletedSkillIds,
    });
  }


  function handleToggleConcept(
    conceptId:
      string
  ) {
    if (
      !schoolClass
    ) {
      return;
    }


    const alreadyComplete =
      schoolClass.completedConceptIds.includes(
        conceptId
      );


    const nextCompletedConceptIds =
      alreadyComplete
        ? schoolClass.completedConceptIds.filter(
            (
              id
            ) =>
              id !==
              conceptId
          )
        : [
            ...schoolClass.completedConceptIds,
            conceptId,
          ];


    updateCompletedConcepts({
      classId:
        schoolClass.id,

      completedConceptIds:
        nextCompletedConceptIds,
    });
  }


  return (
    <main
      style={{
        minHeight:
          "100%",

        padding:
          "24px 16px",

        boxSizing:
          "border-box",

        background:
          theme.bgPage,

        color:
          theme.textPrimary,

        fontFamily:
          "var(--app-ui-font-family)",
      }}
    >
      <div
        style={{
          width:
            "100%",

          maxWidth:
            1400,

          margin:
            "0 auto",

          display:
            "grid",

          gap:
            16,
        }}
      >
        <div>
          <Link
            href="/my-classes"
            style={{
              display:
                "inline-flex",

              alignItems:
                "center",

              gap:
                5,

              color:
                theme.textMuted,

              textDecoration:
                "none",

              fontSize:
                10.5,

              fontWeight:
                600,
            }}
          >
            <span
              aria-hidden="true"
            >
              ←
            </span>

            My Classes
          </Link>
        </div>


        {!hasLoaded ? (
          <div
            style={{
              minHeight:
                100,

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
                6,

              background:
                theme.bgSurface,

              color:
                theme.textMuted,

              fontSize:
                12,
            }}
          >
            Loading class...
          </div>
        ) : !schoolClass ? (
          <div
            style={{
              minHeight:
                150,

              padding:
                18,

              boxSizing:
                "border-box",

              display:
                "grid",

              alignContent:
                "center",

              gap:
                6,

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
            }}
          >
            <div
              style={{
                color:
                  theme.textPrimary,

                fontSize:
                  20,

                fontWeight:
                  700,
              }}
            >
              Class not found
            </div>


            <div
              style={{
                color:
                  theme.textMuted,

                fontSize:
                  11,

                lineHeight:
                  1.4,
              }}
            >
              This class may have been removed or is no longer available.
            </div>
          </div>
        ) : (
          <>
            <header
              style={{
                minWidth:
                  0,

                display:
                  "grid",

                gridTemplateColumns:
                  "minmax(0, 1fr) minmax(260px, 360px)",

                alignItems:
                  "end",

                gap:
                  24,

                paddingBottom:
                  14,

                borderBottomWidth:
                  1,

                borderBottomStyle:
                  "solid",

                borderBottomColor:
                  `color-mix(
                    in srgb,
                    ${courseAccent} 34%,
                    ${theme.borderStandard}
                  )`,
              }}
            >
              <div
                style={{
                  minWidth:
                    0,

                  display:
                    "grid",

                  gap:
                    4,
                }}
              >
                <h1
                  style={{
                    margin:
                      0,

                    color:
                      theme.textPrimary,

                    fontSize:
                      30,

                    fontWeight:
                      700,

                    lineHeight:
                      1.08,
                  }}
                >
                  {schoolClass.name}
                </h1>


                <div
                  style={{
                    display:
                      "flex",

                    alignItems:
                      "center",

                    gap:
                      7,

                    color:
                      courseAccentText,

                    fontSize:
                      12,

                    fontWeight:
                      650,
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      width:
                        7,

                      height:
                        7,

                      flexShrink:
                        0,

                      borderRadius:
                        999,

                      background:
                        courseAccent,

                      boxShadow:
                        `0 0 7px ${courseAccent}`,
                    }}
                  />

                  {schoolClass.course}
                </div>


                <div
                  style={{
                    color:
                      theme.textMuted,

                    fontSize:
                      11,
                  }}
                >
                  {[
                    schoolClass.level,
                    schoolClass.teacher,
                  ]
                    .filter(
                      Boolean
                    )
                    .join(
                      " · "
                    ) ||
                    "No additional class details"}
                </div>
              </div>


              <div
                style={{
                  minWidth:
                    0,

                  display:
                    "grid",

                  gap:
                    6,
                }}
              >
                <div
                  style={{
                    display:
                      "flex",

                    alignItems:
                      "baseline",

                    justifyContent:
                      "space-between",

                    gap:
                      12,
                  }}
                >
                  <span
                    style={{
                      color:
                        theme.textSecondary,

                      fontSize:
                        11,

                      fontWeight:
                        650,

                      whiteSpace:
                        "nowrap",
                    }}
                  >
                    Course coverage
                  </span>


                  <span
                    style={{
                      color:
                        theme.textPrimary,

                      fontSize:
                        12,

                      fontWeight:
                        700,

                      fontVariantNumeric:
                        "tabular-nums",

                      whiteSpace:
                        "nowrap",
                    }}
                  >
                    {coverage.completedSkills}
                    {" / "}
                    {coverage.totalSkills}
                    {" "}
                    skills covered
                  </span>
                </div>


                <div
                  style={{
                    height:
                      6,

                    overflow:
                      "hidden",

                    borderRadius:
                      5,

                    background:
                      theme.borderStandard,
                  }}
                >
                  <div
                    style={{
                      width:
                        `${coverage.progressPct}%`,

                      height:
                        "100%",

                      borderRadius:
                        5,

                      background:
                        courseAccent,

                      boxShadow:
                        `0 0 9px color-mix(
                          in srgb,
                          ${courseAccent} 60%,
                          transparent
                        )`,

                      transition:
                        "width 180ms ease",
                    }}
                  />
                </div>


                <div
                  style={{
                    display:
                      "flex",

                    justifyContent:
                      "flex-end",

                    color:
                      theme.textMuted,

                    fontSize:
                      9.5,

                    fontVariantNumeric:
                      "tabular-nums",
                  }}
                >
                  Last updated{" "}
                  {formatLastUpdated(
                    schoolClass.updatedAt
                  )}
                </div>
              </div>
            </header>


            <section
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
                    "baseline",

                  justifyContent:
                    "space-between",

                  gap:
                    12,
                }}
              >
                <div
                  style={{
                    display:
                      "grid",

                    gap:
                      2,
                  }}
                >
                  <h2
                    style={{
                      margin:
                        0,

                      color:
                        theme.textPrimary,

                      fontSize:
                        15,

                      fontWeight:
                        700,
                    }}
                  >
                    Course Coverage
                  </h2>


                  <span
                    style={{
                      color:
                        theme.textMuted,

                      fontSize:
                        10,
                    }}
                  >
                    Track taught skills against the registered course specification.
                  </span>
                </div>
              </div>


              <div
                style={{
                  minWidth:
                    0,

                  display:
                    "grid",

                  gridTemplateColumns:
                    "minmax(420px, 1.12fr) minmax(360px, 0.88fr)",

                  gap:
                    10,

                  alignItems:
                    "start",
                }}
              >
                <ClassCoverageTree
                  courseId={
                    schoolClass.courseId
                  }
                  selection={
                    selection
                  }
                  onSelectionChange={
                    setSelection
                  }
                  completedSkillIds={
                    schoolClass.completedSkillIds
                  }
                  completedConceptIds={
                    schoolClass.completedConceptIds
                  }
                  onToggleSkillId={
                    handleToggleSkill
                  }
                  onToggleConceptId={
                    handleToggleConcept
                  }
                  theme={
                    theme
                  }
                  courseAccent={
                    courseAccent
                  }
                />


                <div
                  style={{
                    position:
                      "sticky",

                    top:
                      12,
                  }}
                >
                  <ClassCoverageDetails
                    courseId={
                      schoolClass.courseId
                    }
                    selection={
                      selection
                    }
                    onSelectionChange={
                      setSelection
                    }
                    completedSkillIds={
                      schoolClass.completedSkillIds
                    }
                    completedConceptIds={
                      schoolClass.completedConceptIds
                    }
                    theme={
                      theme
                    }
                    courseAccent={
                      courseAccent
                    }
                  />
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}