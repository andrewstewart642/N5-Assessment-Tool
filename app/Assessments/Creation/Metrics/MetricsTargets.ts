import type {
  Paper,
} from "@/app/Assessments/AssessmentTypes";

import type {
  CourseTopicTarget,
} from "@/app/Courses/CourseAssessmentConfig";

import type {
  TopicMetricPolicy,
} from "./MetricsTypes";

export function sumAssessmentTargetMarks({
  papers,
  targetMarksByPaper,
}: {
  papers: Paper[];
  targetMarksByPaper: Partial<
    Record<Paper, number>
  >;
}): number {
  return papers.reduce(
    (total, paper) => {
      const value =
        targetMarksByPaper[paper];

      return total +
        (
          typeof value === "number" &&
          Number.isFinite(value)
            ? Math.max(0, value)
            : 0
        );
    },
    0
  );
}

export function buildTopicMetricPolicies(
  topicTargets: CourseTopicTarget[]
): TopicMetricPolicy[] {
  return topicTargets.map(
    (target) => ({
      topic: target.topic,
      label: target.label,
      minPct: target.minPct,
      targetPct: target.targetPct,
      maxPct: target.maxPct,
    })
  );
}

export function percentageToMarks(
  percentage: number,
  finalTargetMarks: number
): number {
  if (
    !Number.isFinite(percentage) ||
    !Number.isFinite(finalTargetMarks) ||
    finalTargetMarks <= 0
  ) {
    return 0;
  }

  return (
    percentage /
    100
  ) * finalTargetMarks;
}

export function toAchievableTopicMarkRange({
  minPct,
  targetPct,
  maxPct,
  finalTargetMarks,
}: {
  minPct: number;
  targetPct: number;
  maxPct: number;
  finalTargetMarks: number;
}) {
  const minExact =
    percentageToMarks(
      minPct,
      finalTargetMarks
    );

  const targetExact =
    percentageToMarks(
      targetPct,
      finalTargetMarks
    );

  const maxExact =
    percentageToMarks(
      maxPct,
      finalTargetMarks
    );

  return {
    minExact,
    targetExact,
    maxExact,

    minAchievable:
      Math.ceil(minExact),

    targetAchievable:
      Math.round(targetExact),

    maxAchievable:
      Math.floor(maxExact),
  };
}
