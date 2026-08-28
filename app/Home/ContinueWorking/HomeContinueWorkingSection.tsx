import Link from "next/link";

import type {
  SavedAssessment,
} from "@/app/Assessments/SavedAssessments/SavedAssessment";

import {
  setCurrentSavedAssessmentId,
} from "@/app/Assessments/SavedAssessments/SavedAssessmentsStorage";

import type {
  AppTheme,
} from "@/app/UI/Application/Theme/AppTheme";

import {
  getHomeAssessmentClassLabel,
  getHomeAssessmentCourseLabel,
  getHomeAssessmentName,
  getHomeAssessmentProgress,
  getHomeAssessmentTypeLabel,
} from "../HomeDashboardData/HomeDashboardData";

import HomeSectionHeader from "../SharedComponents/HomeSectionHeader";


type Props = {
  assessment:
    SavedAssessment | null;

  courseAccent:
    string;

  hasLoaded:
    boolean;

  theme:
    AppTheme;
};


export default function HomeContinueWorkingSection({
  assessment,
  courseAccent,
  hasLoaded,
  theme,
}: Props) {
  if (
    !hasLoaded
  ) {
    return (
      <section
        style={{
          minHeight:
            260,

          padding:
            14,

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
            11,
        }}
      >
        Loading recent work...
      </section>
    );
  }


  if (
    !assessment
  ) {
    return (
      <section
        style={{
          minHeight:
            260,

          padding:
            14,

          boxSizing:
            "border-box",

          display:
            "grid",

          alignContent:
            "space-between",

          gap:
            18,

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
        <HomeSectionHeader
          title="Continue working"
          subtitle="Pick up where you left off."
          theme={
            theme
          }
        />


        <div
          style={{
            display:
              "grid",

            gap:
              8,

            justifyItems:
              "start",
          }}
        >
          <div
            style={{
              color:
                theme.textPrimary,

              fontSize:
                15,

              fontWeight:
                700,
            }}
          >
            Nothing in progress yet
          </div>


          <div
            style={{
              maxWidth:
                420,

              color:
                theme.textMuted,

              fontSize:
                11,

              lineHeight:
                1.45,
            }}
          >
            Create an assessment and your most recently edited work will appear here.
          </div>


          <Link
            href="/create-assessment"
            style={{
              height:
                30,

              padding:
                "0 10px",

              display:
                "inline-flex",

              alignItems:
                "center",

              borderWidth:
                1,

              borderStyle:
                "solid",

              borderColor:
                theme.controlSelectedBorder,

              borderRadius:
                5,

              background:
                theme.controlSelectedBg,

              color:
                theme.textPrimary,

              textDecoration:
                "none",

              fontSize:
                11,

              fontWeight:
                600,
            }}
          >
            + New assessment
          </Link>
        </div>
      </section>
    );
  }


  const progress =
    getHomeAssessmentProgress(
      assessment
    );


  const complete =
    assessment.status ===
    "COMPLETE";


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

        position:
          "relative",

        overflow:
          "hidden",

        display:
          "grid",

        alignContent:
          "space-between",

        gap:
          18,

        borderWidth:
          1,

        borderStyle:
          "solid",

        borderColor:
          `color-mix(
            in srgb,
            ${courseAccent} 28%,
            ${theme.borderStandard}
          )`,

        borderRadius:
          6,

        background:
          `linear-gradient(
            135deg,
            color-mix(
              in srgb,
              ${courseAccent} 10%,
              ${theme.bgSection}
            ) 0%,
            ${theme.bgSurface} 64%
          )`,

        boxShadow:
          theme.shadow,
      }}
    >
      <div
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
            4,

          background:
            courseAccent,
        }}
      />


      <HomeSectionHeader
        title="Continue working"
        subtitle="Your most recently edited assessment."
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

          gap:
            10,
        }}
      >
        <div
          style={{
            minWidth:
              0,

            display:
              "flex",

            alignItems:
              "flex-start",

            justifyContent:
              "space-between",

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
                5,
            }}
          >
            <div
              title={
                getHomeAssessmentName(
                  assessment
                )
              }
              style={{
                minWidth:
                  0,

                overflow:
                  "hidden",

                color:
                  theme.textPrimary,

                fontSize:
                  18,

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
              {getHomeAssessmentName(
                assessment
              )}
            </div>


            <div
              style={{
                display:
                  "flex",

                alignItems:
                  "center",

                gap:
                  6,

                color:
                  courseAccent,

                fontSize:
                  10.5,

                fontWeight:
                  650,
              }}
            >
              <span
                style={{
                  width:
                    6,

                  height:
                    6,

                  borderRadius:
                    999,

                  background:
                    courseAccent,

                  boxShadow:
                    `0 0 6px ${courseAccent}`,
                }}
              />

              {getHomeAssessmentCourseLabel(
                assessment
              )}

              <span
                style={{
                  color:
                    theme.textMuted,
                }}
              >
                ·
              </span>

              <span
                style={{
                  color:
                    theme.textSecondary,
                }}
              >
                {getHomeAssessmentTypeLabel(
                  assessment
                )}
              </span>
            </div>


            <div
              style={{
                color:
                  theme.textMuted,

                fontSize:
                  10.5,
              }}
            >
              {getHomeAssessmentClassLabel(
                assessment
              )}
            </div>
          </div>


          <div
            style={{
              minHeight:
                26,

              padding:
                "5px 8px",

              display:
                "inline-flex",

              alignItems:
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
                theme.bgElevated,

              color:
                complete
                  ? theme.success
                  : theme.textSecondary,

              boxShadow:
                theme.shadow,

              fontSize:
                10,

              fontWeight:
                700,

              whiteSpace:
                "nowrap",
            }}
          >
            <span
              style={{
                width:
                  6,

                height:
                  6,

                borderRadius:
                  999,

                background:
                  complete
                    ? theme.success
                    : theme.accentPrimary,

                boxShadow:
                  complete
                    ? `0 0 0 2px ${theme.successSoft}`
                    : `0 0 0 2px ${theme.accentSoft}`,
              }}
            />

            {complete
              ? "Complete"
              : "Draft"}
          </div>
        </div>


        <div
          style={{
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
                10,
            }}
          >
            <span
              style={{
                color:
                  theme.textSecondary,

                fontSize:
                  10.5,

                fontWeight:
                  600,
              }}
            >
              Assessment progress
            </span>


            <span
              style={{
                color:
                  theme.textMuted,

                fontSize:
                  10,

                fontVariantNumeric:
                  "tabular-nums",
              }}
            >
              {progress.assignedMarks}
              {" / "}
              {progress.targetMarks}
              {" marks · "}
              {Math.round(
                progress.progressPct
              )}
              %
            </span>
          </div>


          <div
            style={{
              height:
                5,

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
                  `${progress.progressPct}%`,

                height:
                  "100%",

                borderRadius:
                  5,

                background:
                  theme.success,

                boxShadow:
                  `0 0 7px ${theme.successSoft}`,

                transition:
                  "width 180ms ease",
              }}
            />
          </div>
        </div>
      </div>


      <Link
        href="/create-assessment/builder"
        onClick={() =>
          setCurrentSavedAssessmentId(
            assessment.id
          )
        }
        style={{
          height:
            32,

          width:
            "fit-content",

          padding:
            "0 11px",

          display:
            "inline-flex",

          alignItems:
            "center",

          justifyContent:
            "center",

          gap:
            7,

          borderWidth:
            1,

          borderStyle:
            "solid",

          borderColor:
            theme.controlSelectedBorder,

          borderRadius:
            6,

          background:
            theme.controlSelectedBg,

          color:
            theme.textPrimary,

          textDecoration:
            "none",

          fontSize:
            11,

          fontWeight:
            650,
        }}
      >
        Continue assessment

        <span
          aria-hidden="true"
        >
          →
        </span>
      </Link>
    </section>
  );
}