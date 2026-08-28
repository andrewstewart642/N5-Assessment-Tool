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
        3
      );


  return (
    <section
      style={{
        width:
          "100%",

        maxWidth:
          820,

        minWidth:
          0,

        padding:
          12,

        boxSizing:
          "border-box",

        justifySelf:
          "start",

        display:
          "grid",

        alignContent:
          "start",

        gap:
          9,

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
        title="My classes"
        subtitle="Recent Course coverage."
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
              10,
          }}
        >
          Loading classes...
        </div>
      ) : visibleClasses.length ===
        0 ? (
        <div
          style={{
            padding:
              "10px 0",

            display:
              "grid",

            gap:
              7,

            justifyItems:
              "start",
          }}
        >
          <span
            style={{
              color:
                theme.textSecondary,

              fontSize:
                10.5,
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
                10,

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
                      48,

                    padding:
                      "6px 8px 6px 11px",

                    boxSizing:
                      "border-box",

                    position:
                      "relative",

                    overflow:
                      "hidden",

                    display:
                      "grid",

                    gridTemplateColumns:
                      "minmax(130px, 0.9fr) minmax(145px, 1fr) 72px",

                    alignItems:
                      "center",

                    gap:
                      10,

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
                        ${theme.bgSection} 50%,
                        color-mix(
                          in srgb,
                          ${theme.bgSection} 76%,
                          ${theme.bgElevated}
                        ) 100%
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
                        2,
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
                          11,

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
                        minWidth:
                          0,

                        overflow:
                          "hidden",

                        color:
                          accent,

                        fontSize:
                          9.5,

                        fontWeight:
                          600,

                        whiteSpace:
                          "nowrap",

                        textOverflow:
                          "ellipsis",
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
                        4,
                    }}
                  >
                    <span
                      style={{
                        color:
                          theme.textSecondary,

                        fontSize:
                          9.5,

                        fontVariantNumeric:
                          "tabular-nums",

                        whiteSpace:
                          "nowrap",
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
                        9.5,

                      fontWeight:
                        600,

                      whiteSpace:
                        "nowrap",
                    }}
                  >
                    Open →
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