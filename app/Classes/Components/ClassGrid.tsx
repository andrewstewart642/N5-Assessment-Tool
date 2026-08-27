import type {
  AppTheme,
} from "@/app/UI/Application/Theme/AppTheme";

import {
  getCourseAccentTextColour,
  getCourseSectionBackground,
  getCourseSectionBorder,
} from "@/app/UI/Application/Colours/CourseAccent";

import {
  useCourseColourPreferences,
} from "@/app/UI/Application/Colours/useCourseColourPreferences";

import {
  COURSE_OPTIONS,
  type CourseOption,
  type SchoolClass,
} from "../ClassTypes";

import ClassTile from "./ClassTile";
import CourseFamilySettingsControl from "./CourseFamilySettingsControl";


type Props = {
  classesByCourse:
    Map<
      CourseOption,
      SchoolClass[]
    >;

  theme:
    AppTheme;
};


export default function ClassGrid({
  classesByCourse,
  theme,
}: Props) {
  const {
    getColour,
    setColour,
    resetColour,
  } =
    useCourseColourPreferences();


  const totalClasses =
    COURSE_OPTIONS.reduce(
      (
        count,
        course
      ) =>
        count +
        (
          classesByCourse.get(
            course
          )?.length ??
          0
        ),
      0
    );


  if (
    totalClasses ===
    0
  ) {
    return (
      <div
        style={{
          minHeight:
            150,

          padding:
            24,

          boxSizing:
            "border-box",

          display:
            "grid",

          alignContent:
            "center",

          justifyItems:
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

          textAlign:
            "center",
        }}
      >
        <div
          style={{
            color:
              theme.textPrimary,

            fontSize:
              15,

            fontWeight:
              650,
          }}
        >
          No classes yet
        </div>

        <div
          style={{
            maxWidth:
              380,

            color:
              theme.textMuted,

            fontSize:
              12,

            lineHeight:
              1.45,
          }}
        >
          Create your first class to track course coverage and build assessments more quickly.
        </div>
      </div>
    );
  }


  return (
    <div
      style={{
        minWidth:
          0,

        display:
          "grid",

        gap:
          16,
      }}
    >
      {COURSE_OPTIONS.map(
        (
          course
        ) => {
          const courseClasses =
            classesByCourse.get(
              course
            ) ??
            [];


          if (
            courseClasses.length ===
            0
          ) {
            return null;
          }


          const courseId =
            courseClasses[0]
              .courseId;


          const accent =
            getColour(
              courseId
            );


          const accentText =
            getCourseAccentTextColour(
              accent,
              theme
            );


          const sectionBackground =
            getCourseSectionBackground(
              accent,
              theme
            );


          const sectionBorder =
            getCourseSectionBorder(
              accent,
              theme
            );


          return (
            <section
              key={
                course
              }
              style={{
                minWidth:
                  0,

                position:
                  "relative",

                padding:
                  10,

                boxSizing:
                  "border-box",

                display:
                  "grid",

                gap:
                  10,

                borderWidth:
                  1,

                borderStyle:
                  "solid",

                borderColor:
                  sectionBorder,

                borderRadius:
                  6,

                background:
                  sectionBackground,

                boxShadow:
                  `inset 4px 0 0 ${accent}, ${theme.shadow}`,
              }}
            >
              <div
                style={{
                  minHeight:
                    30,

                  display:
                    "flex",

                  alignItems:
                    "center",

                  justifyContent:
                    "space-between",

                  gap:
                    12,

                  padding:
                    "0 2px 7px 5px",

                  borderBottomWidth:
                    1,

                  borderBottomStyle:
                    "solid",

                  borderBottomColor:
                    sectionBorder,
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
                      8,
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      width:
                        8,

                      height:
                        8,

                      flexShrink:
                        0,

                      borderRadius:
                        999,

                      background:
                        accent,

                      boxShadow:
                        `0 0 9px ${accent}`,
                    }}
                  />


                  <h2
                    style={{
                      margin:
                        0,

                      color:
                        accentText,

                      fontSize:
                        16,

                      fontWeight:
                        700,

                      lineHeight:
                        1.25,
                    }}
                  >
                    {course}
                  </h2>
                </div>


                <div
                  style={{
                    display:
                      "flex",

                    alignItems:
                      "center",

                    gap:
                      9,
                  }}
                >
                  <span
                    style={{
                      color:
                        theme.textSecondary,

                      fontSize:
                        11,

                      fontVariantNumeric:
                        "tabular-nums",

                      whiteSpace:
                        "nowrap",
                    }}
                  >
                    {courseClasses.length}
                    {" "}
                    {courseClasses.length ===
                    1
                      ? "class"
                      : "classes"}
                  </span>


                  <CourseFamilySettingsControl
                    courseName={
                      course
                    }
                    accent={
                      accent
                    }
                    theme={
                      theme
                    }
                    onColourChange={(
                      colour
                    ) =>
                      setColour(
                        courseId,
                        colour
                      )
                    }
                    onResetColour={() =>
                      resetColour(
                        courseId
                      )
                    }
                  />
                </div>
              </div>


              <div
                style={{
                  minWidth:
                    0,

                  display:
                    "grid",

                  gridTemplateColumns:
                    "repeat(auto-fill, minmax(280px, 1fr))",

                  gap:
                    12,
                }}
              >
                {courseClasses.map(
                  (
                    schoolClass
                  ) => (
                    <ClassTile
                      key={
                        schoolClass.id
                      }
                      schoolClass={
                        schoolClass
                      }
                      accent={
                        accent
                      }
                      theme={
                        theme
                      }
                    />
                  )
                )}
              </div>
            </section>
          );
        }
      )}
    </div>
  );
}