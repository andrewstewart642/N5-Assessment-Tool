import {
  useMemo,
} from "react";

import {
  getCoursePaperConfig,
  type CourseAssessmentConfig,
} from "@/course-data/course-configs/CourseConfigTypes";

import type {
  Paper,
} from "@/shared-types/AssessmentTypes";

import type {
  AssessmentProgressPanelPaperRow,
} from "./AssessmentProgressPanel";

type AssessmentPaperNumberMap =
  Partial<
    Record<
      Paper,
      number
    >
  >;

type UseAssessmentProgressRowsArgs = {
  courseConfig:
    CourseAssessmentConfig;

  marksByPaper:
    AssessmentPaperNumberMap;

  targetMarksByPaper:
    AssessmentPaperNumberMap;

  minutesByPaper:
    AssessmentPaperNumberMap;
};

function getPaperNumberValue({
  paper,
  valuesByPaper,
  fallback = 0,
}: {
  paper:
    Paper;

  valuesByPaper:
    AssessmentPaperNumberMap;

  fallback?:
    number;
}): number {
  const value =
    valuesByPaper[
      paper
    ];

  return (
    typeof value ===
      "number" &&
    Number.isFinite(
      value
    )
      ? value
      : fallback
  );
}

function getSortedCoursePapers(
  courseConfig:
    CourseAssessmentConfig
): Paper[] {
  return [
    ...courseConfig.papers,
  ]
    .sort(
      (
        first,
        second
      ) =>
        first.order -
        second.order
    )
    .map(
      (
        paper
      ) =>
        paper.id
    );
}

export function useAssessmentProgressRows({
  courseConfig,
  marksByPaper,
  targetMarksByPaper,
  minutesByPaper,
}: UseAssessmentProgressRowsArgs): AssessmentProgressPanelPaperRow[] {
  return useMemo(
    () => {
      return getSortedCoursePapers(
        courseConfig
      ).map(
        (
          paper
        ) => {
          const paperConfig =
            getCoursePaperConfig(
              courseConfig,
              paper
            );

          return {
            paper,

            paperLabel:
              paperConfig.shortLabel,

            marks:
              getPaperNumberValue({
                paper,
                valuesByPaper:
                  marksByPaper,
              }),

            targetMarks:
              getPaperNumberValue({
                paper,
                valuesByPaper:
                  targetMarksByPaper,
              }),

            timeMinutes:
              getPaperNumberValue({
                paper,
                valuesByPaper:
                  minutesByPaper,
              }),
          };
        }
      );
    },
    [
      courseConfig,
      marksByPaper,
      targetMarksByPaper,
      minutesByPaper,
    ]
  );
}