import {
  useMemo,
} from "react";

import type {
  CourseAssessmentConfig,
} from "@/app/Courses/CourseAssessmentConfig";

import {
  buildAssessmentTargetMarksByPaperFromValues,
  getIncludedAssessmentPapersFromTargets,
  type AssessmentTargetMarksByPaper,
} from "./MarkTargetCalculations";

type UseAssessmentPaperTargetsArgs = {
  targetMarksByPaper:
    AssessmentTargetMarksByPaper;

  courseConfig:
    CourseAssessmentConfig;
};

export function useAssessmentPaperTargets({
  targetMarksByPaper:
    rawTargetMarksByPaper,

  courseConfig,
}: UseAssessmentPaperTargetsArgs) {
  const targetMarksByPaper =
    useMemo(() => {
      return buildAssessmentTargetMarksByPaperFromValues({
        targetMarksByPaper:
          rawTargetMarksByPaper,

        courseConfig,
      });
    }, [
      rawTargetMarksByPaper,
      courseConfig,
    ]);

  const includedPapers =
    useMemo(() => {
      return getIncludedAssessmentPapersFromTargets({
        targetMarksByPaper,

        courseConfig,
      });
    }, [
      targetMarksByPaper,
      courseConfig,
    ]);

  const totalAssessmentMarks =
    useMemo(() => {
      return includedPapers.reduce(
        (
          total,
          paper
        ) => {
          const marks =
            targetMarksByPaper[
              paper
            ];

          if (
            typeof marks !==
              "number" ||
            !Number.isFinite(
              marks
            ) ||
            marks <= 0
          ) {
            return total;
          }

          return (
            total +
            marks
          );
        },
        0
      );
    }, [
      includedPapers,
      targetMarksByPaper,
    ]);

  return {
    targetMarksByPaper,
    includedPapers,
    totalAssessmentMarks,
  };
}