import Link from "next/link";

import {
  useState,
} from "react";

import {
  getCourseAccentTextColour,
  getCourseTileBackground,
} from "@/app/UI/Application/Colours/CourseAccent";

import type {
  AppTheme,
} from "@/app/UI/Application/Theme/AppTheme";

import {
  getAllCoverageSkills,
} from "../Coverage/SkillsAndProgress";

import type {
  SchoolClass,
} from "../ClassData";


type Props = {
  schoolClass:
    SchoolClass;

  accent:
    string;

  theme:
    AppTheme;
};


function getTotalSkills(
  schoolClass:
    SchoolClass
): number {
  try {
    return getAllCoverageSkills(
      schoolClass.courseId
    ).length;
  } catch {
    return 0;
  }
}


function formatUpdatedDate(
  timestamp:
    number
): string {
  return new Date(
    timestamp
  ).toLocaleDateString(
    "en-GB",
    {
      day:
        "2-digit",

      month:
        "short",

      year:
        "numeric",
    }
  );
}


export default function ClassTile({
  schoolClass,
  accent,
  theme,
}: Props) {
  const [
    isHovered,
    setIsHovered,
  ] =
    useState(
      false
    );


  const accentText =
    getCourseAccentTextColour(
      accent,
      theme
    );


  const totalSkills =
    getTotalSkills(
      schoolClass
    );


  const completedSkills =
    totalSkills > 0
      ? Math.min(
          schoolClass
            .completedSkillIds
            .length,
          totalSkills
        )
      : 0;


  const progressPct =
    totalSkills > 0
      ? (
          completedSkills /
          totalSkills
        ) *
        100
      : 0;


  const metaParts =
    [
      schoolClass.level,
      schoolClass.teacher,
    ].filter(
      Boolean
    );


  return (
    <Link
      href={`/my-classes/${schoolClass.id}`}
      aria-label={`Open class ${schoolClass.name}`}
      onMouseEnter={() =>
        setIsHovered(
          true
        )
      }
      onMouseLeave={() =>
        setIsHovered(
          false
        )
      }
      style={{
        minWidth:
          0,

        color:
          "inherit",

        textDecoration:
          "none",
      }}
    >
      <article
        style={{
          minWidth:
            0,

          minHeight:
            180,

          height:
            "100%",

          overflow:
            "hidden",

          boxSizing:
            "border-box",

          display:
            "grid",

          gridTemplateRows:
            "9px minmax(0, 1fr)",

          borderWidth:
            1,

          borderStyle:
            "solid",

          borderColor:
            isHovered
              ? accent
              : `color-mix(
                  in srgb,
                  ${accent} 24%,
                  ${theme.borderStandard}
                )`,

          borderRadius:
            6,

          background:
            getCourseTileBackground({
              accent,
              theme,
              hovered:
                isHovered,
            }),

          boxShadow:
            isHovered
              ? theme.shadowStrong
              : theme.shadow,

          transform:
            isHovered
              ? "translateY(-2px)"
              : "translateY(0)",

          transition:
            [
              "background 150ms ease",
              "border-color 150ms ease",
              "box-shadow 150ms ease",
              "transform 150ms ease",
            ].join(
              ", "
            ),
        }}
      >
        <div
          aria-hidden="true"
          style={{
            width:
              "100%",

            background:
              accent,

            boxShadow:
              isHovered
                ? `0 0 14px ${accent}`
                : `0 0 7px color-mix(
                    in srgb,
                    ${accent} 45%,
                    transparent
                  )`,

            transition:
              "box-shadow 150ms ease",
          }}
        />


        <div
          style={{
            minWidth:
              0,

            padding:
              12,

            boxSizing:
              "border-box",

            display:
              "grid",

            gridTemplateRows:
              "auto auto minmax(0, 1fr) auto",

            gap:
              10,
          }}
        >
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
            <div
              style={{
                minWidth:
                  0,

                overflow:
                  "hidden",

                color:
                  theme.textPrimary,

                fontSize:
                  16,

                fontWeight:
                  700,

                lineHeight:
                  1.2,

                whiteSpace:
                  "nowrap",

                textOverflow:
                  "ellipsis",
              }}
            >
              {schoolClass.name}
            </div>


            <div
              style={{
                minWidth:
                  0,

                overflow:
                  "hidden",

                color:
                  accentText,

                fontSize:
                  11,

                fontWeight:
                  650,

                lineHeight:
                  1.35,

                whiteSpace:
                  "nowrap",

                textOverflow:
                  "ellipsis",
              }}
            >
              {schoolClass.course}
            </div>
          </div>


          <div
            style={{
              minHeight:
                16,

              overflow:
                "hidden",

              color:
                theme.textMuted,

              fontSize:
                11,

              lineHeight:
                1.35,

              whiteSpace:
                "nowrap",

              textOverflow:
                "ellipsis",
            }}
          >
            {metaParts.length >
            0
              ? metaParts.join(
                  " · "
                )
              : "No additional details"}
          </div>


          <div
            style={{
              minWidth:
                0,

              alignSelf:
                "end",

              display:
                "grid",

              gap:
                5,
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
                  8,
              }}
            >
              <span
                style={{
                  color:
                    theme.textMuted,

                  fontSize:
                    10,
                }}
              >
                Coverage
              </span>


              <span
                style={{
                  color:
                    theme.textSecondary,

                  fontSize:
                    10,

                  fontVariantNumeric:
                    "tabular-nums",

                  whiteSpace:
                    "nowrap",
                }}
              >
                {totalSkills >
                0
                  ? `${completedSkills} / ${totalSkills} skills`
                  : "Not available"}
              </span>
            </div>


            <div
              style={{
                height:
                  4,

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
                    `${progressPct}%`,

                  height:
                    "100%",

                  borderRadius:
                    3,

                  background:
                    accent,

                  boxShadow:
                    `0 0 5px ${accent}`,

                  transition:
                    "width 180ms ease",
                }}
              />
            </div>
          </div>


          <div
            style={{
              minWidth:
                0,

              display:
                "flex",

              alignItems:
                "center",

              justifyContent:
                "space-between",

              gap:
                10,

              paddingTop:
                1,
            }}
          >
            <span
              style={{
                color:
                  accentText,

                fontSize:
                  11,

                fontWeight:
                  700,

                whiteSpace:
                  "nowrap",
              }}
            >
              Open class →
            </span>


            <span
              style={{
                minWidth:
                  0,

                overflow:
                  "hidden",

                color:
                  theme.textMuted,

                fontSize:
                  9.5,

                fontVariantNumeric:
                  "tabular-nums",

                whiteSpace:
                  "nowrap",

                textOverflow:
                  "ellipsis",
              }}
            >
              Updated{" "}
              {formatUpdatedDate(
                schoolClass.updatedAt
              )}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}