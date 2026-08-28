import type {
  SavedAssessment,
} from "@/app/Assessments/SavedAssessments/SavedAssessment";

import type {
  AppTheme,
} from "@/app/UI/Application/Theme/AppTheme";

import {
  UI_TEXT,
} from "@/app/UI/Application/Typography/Typography";

import {
  getAssessmentPaperProgress,
  getOverallProgressPct,
} from "../Display/AssessmentProgressDisplay";


export function AssessmentOverallProgressBar({
  savedAssessment,
  theme,
}: {
  savedAssessment:
    SavedAssessment;

  theme:
    AppTheme;
}) {
  const progressPct =
    getOverallProgressPct(
      savedAssessment
    );


  return (
    <div
      title={`${Math.round(
        progressPct
      )}% total progress`}
      style={{
        position:
          "absolute",

        left:
          0,

        right:
          0,

        top:
          0,

        height:
          3,

        background:
          theme.borderStandard,

        zIndex:
          5,

        pointerEvents:
          "none",
      }}
    >
      <div
        style={{
          width:
            `${progressPct}%`,

          height:
            "100%",

          background:
            theme.success,

          boxShadow:
            progressPct >
            0
              ? `0 0 7px ${theme.successSoft}`
              : "none",

          transition:
            "width 180ms ease",
        }}
      />
    </div>
  );
}


export default function AssessmentTileProgress({
  savedAssessment,
  theme,
  courseAccent,
}: {
  savedAssessment:
    SavedAssessment;

  theme:
    AppTheme;

  courseAccent:
    string;
}) {
  const paperRows =
    getAssessmentPaperProgress(
      savedAssessment
    );


  return (
    <div
      style={{
        display:
          "grid",

        gap:
          7,
      }}
    >
      {paperRows.map(
        (
          row
        ) => (
          <div
            key={
              row.paper
            }
            style={{
              display:
                "grid",

              gridTemplateColumns:
                "20px 48px minmax(0, 1fr)",

              alignItems:
                "center",

              gap:
                6,

              minWidth:
                0,
            }}
          >
            <span
              style={{
                ...UI_TEXT.smallValueText,

                color:
                  theme.textMuted,
              }}
            >
              {row.paper}
            </span>


            <span
              style={{
                ...UI_TEXT.helper,

                color:
                  theme.textSecondary,

                whiteSpace:
                  "nowrap",

                fontVariantNumeric:
                  "tabular-nums",
              }}
            >
              {row.assignedMarks}
              {" / "}
              {row.targetMarks}
            </span>


            <div
              style={{
                minWidth:
                  0,

                height:
                  3,

                borderRadius:
                  3,

                overflow:
                  "hidden",

                background:
                  `color-mix(
                    in srgb,
                    ${courseAccent} 12%,
                    ${theme.borderStandard}
                  )`,
              }}
            >
              <div
                style={{
                  width:
                    `${row.progressPct}%`,

                  height:
                    "100%",

                  borderRadius:
                    3,

                  background:
                    courseAccent,

                  boxShadow:
                    row.progressPct >
                    0
                      ? `0 0 6px color-mix(
                          in srgb,
                          ${courseAccent} 50%,
                          transparent
                        )`
                      : "none",

                  transition:
                    "width 180ms ease",
                }}
              />
            </div>
          </div>
        )
      )}
    </div>
  );
}