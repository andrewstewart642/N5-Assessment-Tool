import type {
  CourseAssessmentConfig,
} from "@/app/Courses/CourseAssessmentConfig";

import type {
  BuildPriority,
} from "../Setup/SavedChoices";

import type {
  AssessmentTargetMarksByPaper,
} from "./MarkTargetCalculations";

import {
  getAssessmentPapers,
} from "./PaperRules";

import {
  calculateAssessmentPaperDurationMinutes,
} from "./TimeCalculations";

import type {
  AssessmentPaperNumberMap,
} from "./PaperSpecificValues";


type BuildAssessmentPaperIntendedDurationArgs = {
  courseConfig:
    CourseAssessmentConfig;

  buildPriority:
    BuildPriority | null;

  marksTargetP1:
    number | null;

  marksTargetP2:
    number | null;

  timeTargetP1:
    number | null;

  timeTargetP2:
    number | null;

  targetMarksByPaper:
    AssessmentTargetMarksByPaper;
};


function isPositiveFiniteNumber(
  value:
    number | null | undefined
): value is number {
  return (
    typeof value ===
      "number" &&
    Number.isFinite(
      value
    ) &&
    value > 0
  );
}


export function buildAssessmentPaperIntendedDurationMinutesByPaper({
  courseConfig,
  buildPriority,

  marksTargetP1,
  marksTargetP2,

  timeTargetP1,
  timeTargetP2,

  targetMarksByPaper,
}: BuildAssessmentPaperIntendedDurationArgs): AssessmentPaperNumberMap {
  const coursePapers =
    getAssessmentPapers(
      courseConfig
    );

  const setupTargets = [
    {
      marks:
        marksTargetP1,

      minutes:
        timeTargetP1,
    },

    {
      marks:
        marksTargetP2,

      minutes:
        timeTargetP2,
    },
  ];

  return coursePapers.reduce<
    AssessmentPaperNumberMap
  >(
    (
      durationByPaper,
      paper,
      index
    ) => {
      const setupTarget =
        setupTargets[
          index
        ];

      /*
       * TIME-led assessment:
       *
       * The setup duration itself is the
       * authoritative intended sitting time.
       *
       * Do not reverse-engineer it from the
       * generated mark count because doing so
       * can introduce rounding differences.
       */
      if (
        buildPriority ===
          "TIME" &&
        isPositiveFiniteNumber(
          setupTarget
            ?.minutes
        )
      ) {
        durationByPaper[
          paper
        ] =
          setupTarget.minutes;

        return durationByPaper;
      }

      /*
       * MARKS-led assessment:
       *
       * Use the marks selected when the
       * assessment was created.
       */
      if (
        buildPriority ===
          "MARKS" &&
        isPositiveFiniteNumber(
          setupTarget
            ?.marks
        )
      ) {
        durationByPaper[
          paper
        ] =
          calculateAssessmentPaperDurationMinutes({
            paper,

            marks:
              setupTarget.marks,

            courseConfig,
          });

        return durationByPaper;
      }

      /*
       * Compatibility fallback.
       *
       * Older assessments may not have the
       * complete setup target information.
       *
       * In that case use the stored builder
       * target — never the current live marks
       * achieved by the question paper.
       */
      const fallbackMarks =
        targetMarksByPaper[
          paper
        ];

      if (
        isPositiveFiniteNumber(
          fallbackMarks
        )
      ) {
        durationByPaper[
          paper
        ] =
          calculateAssessmentPaperDurationMinutes({
            paper,

            marks:
              fallbackMarks,

            courseConfig,
          });
      }

      return durationByPaper;
    },
    {}
  );
}