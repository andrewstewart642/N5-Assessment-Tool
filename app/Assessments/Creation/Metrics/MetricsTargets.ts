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

type SkillsTreeTopicPresentation = {
  topic: AssessmentTopicCode;
  label?: string;
};

function getSkillsTreeCategoryLabel(
  categoryLabel: string
): string {
  const trimmed =
    categoryLabel.trim();

  const withoutSkillsSuffix =
    trimmed.replace(
      /\s+skills$/i,
      ""
    );

  return (
    withoutSkillsSuffix.trim() ||
    trimmed
  );
}

/**
 * Resolve topic navigation order and teacher-facing names from the actual
 * Skills Tree. Metrics therefore follows whatever Course curriculum tree is
 * active rather than maintaining its own duplicated topic vocabulary.
 */
function getTopicPresentationFromSkillsData(
  skillsData: SkillsData | undefined
): SkillsTreeTopicPresentation[] {
  if (!skillsData) {
    return [];
  }

  const orderedTopics:
    SkillsTreeTopicPresentation[] = [];

  Object.entries(
    skillsData
  ).forEach(
    ([categoryLabel, skills]) => {
      const categoryTopics =
        skills.reduce<AssessmentTopicCode[]>(
          (
            topics,
            skill
          ) => {
            const domain =
              skill.domain;

            if (
              domain &&
              !topics.includes(
                domain
              )
            ) {
              topics.push(
                domain
              );
            }

            return topics;
          },
          []
        );

      categoryTopics.forEach(
        (topic) => {
          if (
            orderedTopics.some(
              (item) =>
                item.topic ===
                topic
            )
          ) {
            return;
          }

          orderedTopics.push({
            topic,

            /**
             * A one-domain Skills Tree category is an authoritative topic
             * heading. Mixed-domain categories still supply order, while the
             * Course topic target label remains the safe fallback.
             */
            label:
              categoryTopics.length === 1
                ? getSkillsTreeCategoryLabel(
                    categoryLabel
                  )
                : undefined,
          });
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
  const topicPresentation =
    getTopicPresentationFromSkillsData(
      skillsData
    );

  if (
    topicPresentation.length === 0
  ) {
    return topicTargets;
  }

  const presentationByTopic =
    new Map(
      topicPresentation.map(
        (
          item,
          index
        ) => [
          item.topic,
          {
            ...item,
            index,
          },
        ] as const
      )
    );

  return topicTargets
    .map(
      (
        target,
        originalIndex
      ) => ({
        target: {
          ...target,
          label:
            presentationByTopic.get(
              target.topic
            )?.label ??
            target.label,
        },
        originalIndex,
      })
    )
    .sort(
      (
        first,
        second
      ) => {
        const firstIndex =
          presentationByTopic.get(
            first.target.topic
          )?.index;

        const secondIndex =
          presentationByTopic.get(
            second.target.topic
          )?.index;

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
 * Topic rows follow the first occurrence of each domain in the Course Skills
 * Tree, and single-domain category headings provide the visible Metrics topic
 * names. A Course can therefore replace its curriculum tree without changing
 * the generic Metrics feature.
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
