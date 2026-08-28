import type {
  CourseId,
} from "@/app/Courses/CourseTypes";

import type {
  AppTheme,
} from "@/app/UI/Application/Theme/AppTheme";

import HomeSectionHeader from "../SharedComponents/HomeSectionHeader";

import {
  HOME_DEPARTMENT_ACTIVITY,
} from "./HomeDepartmentActivityData";


type Props = {
  getCourseColour:
    (
      courseId:
        CourseId | null
    ) => string;

  theme:
    AppTheme;
};


export default function HomeDepartmentActivitySection({
  getCourseColour,
  theme,
}: Props) {
  return (
    <section
      style={{
        minWidth:
          0,

        width:
          "100%",

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
          `color-mix(
            in srgb,
            ${theme.textMuted} 12%,
            ${theme.borderStandard}
          )`,

        borderRadius:
          6,

        background:
          `linear-gradient(
            145deg,
            color-mix(
              in srgb,
              ${theme.accentPrimary} 3%,
              ${theme.bgElevated}
            ) 0%,
            ${theme.bgElevated} 58%,
            color-mix(
              in srgb,
              ${theme.bgElevated} 74%,
              ${theme.bgSurface}
            ) 100%
          )`,

        boxShadow:
          `${theme.shadowStrong}, inset 0 1px 0 rgba(255,255,255,0.025)`,
      }}
    >
      <HomeSectionHeader
        title="Department activity"
        subtitle="A preview of shared department work."
        theme={
          theme
        }
      />


      <div
        style={{
          display:
            "grid",

          gap:
            0,
        }}
      >
        {HOME_DEPARTMENT_ACTIVITY.map(
          (
            activity,
            index
          ) => {
            const accent =
              getCourseColour(
                activity.courseId
              );


            return (
              <article
                key={
                  activity.id
                }
                style={{
                  padding:
                    "9px 0",

                  display:
                    "grid",

                  gap:
                    4,

                  borderTopWidth:
                    index ===
                    0
                      ? 0
                      : 1,

                  borderTopStyle:
                    "solid",

                  borderTopColor:
                    theme.borderStandard,
                }}
              >
                <div
                  style={{
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
                      color:
                        theme.textMuted,

                      fontSize:
                        9,
                    }}
                  >
                    {activity.timeLabel}
                  </span>
                </div>


                <div
                  style={{
                    color:
                      theme.textSecondary,

                    fontSize:
                      10,

                    lineHeight:
                      1.4,
                  }}
                >
                  <strong
                    style={{
                      color:
                        theme.textPrimary,

                      fontWeight:
                        700,
                    }}
                  >
                    {activity.person}
                  </strong>

                  {" "}
                  {activity.action}
                  {" "}

                  <strong
                    style={{
                      color:
                        theme.textPrimary,

                      fontWeight:
                        650,
                    }}
                  >
                    {activity.subject}
                  </strong>
                </div>


                <div
                  style={{
                    color:
                      accent,

                    fontSize:
                      9,

                    fontWeight:
                      600,
                  }}
                >
                  {activity.detail}
                </div>
              </article>
            );
          }
        )}
      </div>
    </section>
  );
}