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
  AssessmentMetricsSnapshot,
} from "./MetricsTypes";

/**
 * Live Metrics state is intentionally derived only from committed assessment
 * questions. Draft generation and unsaved edits do not affect the snapshot.
 *
 * A course can omit a Metrics policy entirely; in that case the Builder keeps
 * working and this hook simply returns null.
 */
export function useAssessmentMetrics({
  questions,
  finalTargetMarks,
  policy,
  coverageUnitIds,
}: {
  questions: Question[];
  finalTargetMarks: number;
  policy: AssessmentMetricsPolicy | null;
  coverageUnitIds: string[];
}): AssessmentMetricsSnapshot | null {
  return useMemo(
    () =>
      policy
        ? calculateAssessmentMetrics({
            questions,
            finalTargetMarks,
            policy,
            coverageUnitIds,
          })
        : null,
    [
      questions,
      finalTargetMarks,
      policy,
      coverageUnitIds,
    ]
  );
}
