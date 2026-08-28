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
            196,

          padding:
            12,

          boxSizing:
            "border-box",

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

          boxShadow:
            theme.shadowStrong,

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
            196,

          padding:
            12,

          boxSizing:
            "border-box",

          display:
            "grid",

          alignContent:
            "space-between",

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
            theme.bgElevated,

          boxShadow:
            `${theme.shadowStrong}, inset 0 1px 0 rgba(255,255,255,0.025)`,
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
              6,

            justifyItems:
              "start",
          }}
        >
          <div
            style={{
              color:
                theme.textPrimary,

              fontSize:
                14,

              fontWeight:
                700,
            }}
          >
            Nothing in progress yet
          </div>


          <div
            style={{
              color:
                theme.textMuted,

              fontSize:
                10,

              lineHeight:
                1.4,
            }}
          >
            Your most recently edited assessment will appear here.
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
                10.5,

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
          196,

        padding:
          "11px 12px 11px 15px",

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
          9,

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
              ${courseAccent} 9%,
              ${theme.bgElevated}
            ) 0%,
            ${theme.bgElevated} 54%,
            color-mix(
              in srgb,
              ${theme.bgElevated} 76%,
              ${theme.bgSurface}
            ) 100%
          )`,

        boxShadow:
          `${theme.shadowStrong}, inset 0 1px 0 rgba(255,255,255,0.025)`,
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
            "flex",

          alignItems:
            "flex-start",

          justifyContent:
            "space-between",

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
                15,

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
              minWidth:
                0,

              display:
                "flex",

              alignItems:
                "center",

              gap:
                5,

              color:
                courseAccent,

              fontSize:
                10,

              fontWeight:
                650,

              whiteSpace:
                "nowrap",
            }}
          >
            <span
              aria-hidden="true"
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
                  courseAccent,

                boxShadow:
                  `0 0 6px ${courseAccent}`,
              }}
            />


            <span
              style={{
                minWidth:
                  0,

                overflow:
                  "hidden",

                textOverflow:
                  "ellipsis",
              }}
            >
              {getHomeAssessmentCourseLabel(
                assessment
              )}
            </span>


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
                9.5,
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
              24,

            padding:
              "4px 7px",

            flexShrink:
              0,

            display:
              "inline-flex",

            alignItems:
              "center",

            gap:
              5,

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
              complete
                ? theme.success
                : theme.textSecondary,

            boxShadow:
              theme.shadow,

            fontSize:
              9.5,

            fontWeight:
              700,

            whiteSpace:
              "nowrap",
          }}
        >
          <span
            aria-hidden="true"
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
              10,
          }}
        >
          <span
            style={{
              color:
                theme.textSecondary,

              fontSize:
                9.5,

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
                9,

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
              4,

            overflow:
              "hidden",

            borderRadius:
              4,

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
                4,

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


      <Link
        href="/create-assessment/builder"
        onClick={() =>
          setCurrentSavedAssessmentId(
            assessment.id
          )
        }
        style={{
          height:
            29,

          width:
            "fit-content",

          padding:
            "0 9px",

          display:
            "inline-flex",

          alignItems:
            "center",

          justifyContent:
            "center",

          gap:
            6,

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
            10,

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