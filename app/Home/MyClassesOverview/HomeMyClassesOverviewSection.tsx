import Link from "next/link";

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
  getHomeClassCoverage,
} from "../HomeDashboardData/HomeDashboardData";

import HomeSectionHeader from "../SharedComponents/HomeSectionHeader";


type Props = {
  classes:
    SchoolClass[];

  hasLoaded:
    boolean;

  getCourseColour:
    (
      courseId:
        CourseId | null
    ) => string;

  theme:
    AppTheme;
};


export default function HomeMyClassesOverviewSection({
  classes,
  hasLoaded,
  getCourseColour,
  theme,
}: Props) {
  const visibleClasses =
    [
      ...classes,
    ]
      .sort(
        (
          first,
          second
        ) =>
          second.updatedAt -
          first.updatedAt
      )
      .slice(
        0,
        4
      );


  return (
    <section
      style={{
        minWidth:
          0,

        padding:
          14,

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
        title="My classes"
        subtitle="Recent Course coverage at a glance."
        actionLabel="View all classes"
        actionHref="/my-classes"
        theme={
          theme
        }
      />


      {!hasLoaded ? (
        <div
          style={{
            color:
              theme.textMuted,

            fontSize:
              10.5,
          }}
        >
          Loading classes...
        </div>
      ) : visibleClasses.length ===
        0 ? (
        <div
          style={{
            padding:
              "14px 0",

            display:
              "grid",

            gap:
              8,

            justifyItems:
              "start",
          }}
        >
          <span
            style={{
              color:
                theme.textSecondary,

              fontSize:
                11,
            }}
          >
            No classes have been created yet.
          </span>


          <Link
            href="/my-classes"
            style={{
              color:
                theme.accentPrimary,

              textDecoration:
                "none",

              fontSize:
                10.5,

              fontWeight:
                600,
            }}
          >
            Set up classes →
          </Link>
        </div>
      ) : (
        <div
          style={{
            display:
              "grid",

            gap:
              5,
          }}
        >
          {visibleClasses.map(
            (
              schoolClass
            ) => {
              const accent =
                getCourseColour(
                  schoolClass.courseId
                );


              const coverage =
                getHomeClassCoverage(
                  schoolClass
                );


              return (
                <Link
                  key={
                    schoolClass.id
                  }
                  href={`/my-classes/${schoolClass.id}`}
                  style={{
                    minWidth:
                      0,

                    minHeight:
                      54,

                    padding:
                      "7px 9px 7px 12px",

                    boxSizing:
                      "border-box",

                    position:
                      "relative",

                    overflow:
                      "hidden",

                    display:
                      "grid",

                    gridTemplateColumns:
                      "minmax(150px, 1fr) minmax(140px, 0.9fr) 90px",

                    alignItems:
                      "center",

                    gap:
                      12,

                    borderWidth:
                      1,

                    borderStyle:
                      "solid",

                    borderColor:
                      `color-mix(
                        in srgb,
                        ${accent} 20%,
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
                        ${theme.bgSection} 46%,
                        ${theme.bgSurface} 100%
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


                  <div
                    style={{
                      minWidth:
                        0,

                      display:
                        "grid",

                      gap:
                        3,
                    }}
                  >
                    <span
                      style={{
                        minWidth:
                          0,

                        overflow:
                          "hidden",

                        color:
                          theme.textPrimary,

                        fontSize:
                          12,

                        fontWeight:
                          700,

                        whiteSpace:
                          "nowrap",

                        textOverflow:
                          "ellipsis",
                      }}
                    >
                      {schoolClass.name}
                    </span>


                    <span
                      style={{
                        color:
                          accent,

                        fontSize:
                          10,

                        fontWeight:
                          600,
                      }}
                    >
                      {schoolClass.course}
                    </span>
                  </div>


                  <div
                    style={{
                      minWidth:
                        0,

                      display:
                        "grid",

                      gap:
                        5,
                    }}
                  >
                    <span
                      style={{
                        color:
                          theme.textSecondary,

                        fontSize:
                          10,

                        fontVariantNumeric:
                          "tabular-nums",
                      }}
                    >
                      {coverage.totalSkills >
                      0
                        ? `${coverage.completedSkills} / ${coverage.totalSkills} skills covered`
                        : `${coverage.completedSkills} skills covered`}
                    </span>


                    <div
                      style={{
                        height:
                          3,

                        overflow:
                          "hidden",

                        borderRadius:
                          3,

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
                            3,

                          background:
                            accent,

                          transition:
                            "width 180ms ease",
                        }}
                      />
                    </div>
                  </div>


                  <span
                    style={{
                      justifySelf:
                        "end",

                      color:
                        theme.textMuted,

                      fontSize:
                        10,

                      fontWeight:
                        600,
                    }}
                  >
                    Open class →
                  </span>
                </Link>
              );
            }
          )}
        </div>
      )}
    </section>
  );
}