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
            "#22a447",

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
}: {
  savedAssessment:
    SavedAssessment;

  theme:
    AppTheme;
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
                  theme.borderStandard,
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
                    theme.accentPrimary,

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