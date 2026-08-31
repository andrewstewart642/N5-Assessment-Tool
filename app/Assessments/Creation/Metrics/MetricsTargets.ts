import type {
  AssessmentTopicCode,
  Paper,
  SkillsData,
} from "@/app/Assessments/AssessmentTypes";

import type {
  CourseAssessmentConfig,
  CourseTopicTarget,
} from "@/app/Courses/CourseAssessmentConfig";

import type {
  AssessmentMetricsPolicy,
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

function getTopicOrderFromSkillsData(
  skillsData: SkillsData | undefined
): AssessmentTopicCode[] {
  if (!skillsData) {
    return [];
  }

  const orderedTopics:
    AssessmentTopicCode[] = [];

  Object.values(
    skillsData
  ).forEach(
    (skills) => {
      skills.forEach(
        (skill) => {
          const domain =
            skill.domain;

          if (
            domain &&
            !orderedTopics.includes(
              domain
            )
          ) {
            orderedTopics.push(
              domain
            );
          }
        }
      );
    }
  );

  return orderedTopics;
}

function orderTopicTargetsForCourse({
  topicTargets,
  skillsData,
}: {
  topicTargets: CourseTopicTarget[];
  skillsData: SkillsData | undefined;
}): CourseTopicTarget[] {
  const topicOrder =
    getTopicOrderFromSkillsData(
      skillsData
    );

  if (
    topicOrder.length === 0
  ) {
    return topicTargets;
  }

  const orderIndex =
    new Map(
      topicOrder.map(
        (
          topic,
          index
        ) => [
          topic,
          index,
        ] as const
      )
    );

  return topicTargets
    .map(
      (
        target,
        originalIndex
      ) => ({
        target,
        originalIndex,
      })
    )
    .sort(
      (
        first,
        second
      ) => {
        const firstIndex =
          orderIndex.get(
            first.target.topic
          );

        const secondIndex =
          orderIndex.get(
            second.target.topic
          );

        if (
          firstIndex === undefined &&
          secondIndex === undefined
        ) {
          return (
            first.originalIndex -
            second.originalIndex
          );
        }

        if (
          firstIndex === undefined
        ) {
          return 1;
        }

        if (
          secondIndex === undefined
        ) {
          return -1;
        }

        return (
          firstIndex -
          secondIndex
        );
      }
    )
    .map(
      ({ target }) =>
        target
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

/**
 * Convert the course-owned policy into the generic Metrics policy.
 *
 * No course identity, paper mark total or subject-specific percentage is
 * embedded here. Courses opt in by supplying assessmentMetrics plus their
 * existing topicTargets.
 *
 * Topic rows follow the first occurrence of each domain in the course Skills
 * Tree so Metrics mirrors the teacher's navigation order without hard-wiring
 * a subject-specific topic sequence into the generic feature.
 */
export function buildAssessmentMetricsPolicy(
  courseConfig: CourseAssessmentConfig
): AssessmentMetricsPolicy | null {
  const config =
    courseConfig.assessmentMetrics;

  if (!config) {
    return null;
  }

  const orderedTopicTargets =
    orderTopicTargetsForCourse({
      topicTargets:
        courseConfig.topicTargets,
      skillsData:
        courseConfig.skillTree,
    });

  return {
    standardBalance: {
      ...config.standardBalance,
    },
    thinkingBalance: {
      ...config.thinkingBalance,
    },
    topicTargets:
      buildTopicMetricPolicies(
        orderedTopicTargets
      ),
    coverage: {
      ...config.coverage,
    },
  };
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
