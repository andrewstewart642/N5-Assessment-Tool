import {
  useMemo,
} from "react";

import type {
  Question,
} from "@/app/Assessments/AssessmentTypes";

import {
  calculateAssessmentMetrics,
} from "./MetricsEngine";

import type {
  AssessmentMetricsPolicy,
} from "./MetricsTypes";

/**
 * Live Metrics state is intentionally derived only from committed assessment
 * questions. Draft generation and unsaved edits do not affect the snapshot.
 */
export function useAssessmentMetrics({
  questions,
  finalTargetMarks,
  policy,
  coverageUnitIds,
}: {
  questions: Question[];
  finalTargetMarks: number;
  policy: AssessmentMetricsPolicy;
  coverageUnitIds: string[];
}) {
  return useMemo(
    () =>
      calculateAssessmentMetrics({
        questions,
        finalTargetMarks,
        policy,
        coverageUnitIds,
      }),
    [
      questions,
      finalTargetMarks,
      policy,
      coverageUnitIds,
    ]
  );
}
