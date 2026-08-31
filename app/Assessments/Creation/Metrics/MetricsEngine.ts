import type {
  AssessmentTopicCode,
  Question,
} from "@/app/Assessments/AssessmentTypes";

import {
  getQuestionCoverageUnitIds,
} from "./CourseSpecificationCoverage";

import {
  resolveQuestionMetricProfile,
} from "./MetricsValidation";

import {
  toAchievableTopicMarkRange,
} from "./MetricsTargets";

import type {
  AssessmentMetricValidationIssue,
  AssessmentMetricsPolicy,
  AssessmentMetricsSnapshot,
  BalanceMetricPolicy,
  BalanceMetricSnapshot,
  MetricRangeStatus,
  TopicMetricSnapshot,
} from "./MetricsTypes";

function clampPct(
  value: number
): number {
  return Math.min(
    100,
    Math.max(
      0,
      value
    )
  );
}

function rangeStatus(
  value: number | null,
  min: number,
  max: number
): MetricRangeStatus {
  if (value === null) {
    return "unavailable";
  }

  if (value < min) {
    return "below";
  }

  if (value > max) {
    return "above";
  }

  return "valid";
}

function buildBalanceSnapshot({
  policy,
  leftMarks,
  rightMarks,
  totalMarks,
  invalid,
}: {
  policy: BalanceMetricPolicy;
  leftMarks: number;
  rightMarks: number;
  totalMarks: number;
  invalid: boolean;
}): BalanceMetricSnapshot {
  const minRightPct =
    clampPct(
      policy.rightTargetPct -
      policy.tolerancePct
    );

  const maxRightPct =
    clampPct(
      policy.rightTargetPct +
      policy.tolerancePct
    );

  if (invalid) {
    return {
      policy,
      availability:
        "invalid",
      status:
        "unavailable",
      leftMarks,
      rightMarks,
      totalMarks,
      leftPct: null,
      rightPct: null,
      minRightPct,
      targetRightPct:
        policy.rightTargetPct,
      maxRightPct,
    };
  }

  if (totalMarks <= 0) {
    return {
      policy,
      availability:
        "empty",
      status:
        "unavailable",
      leftMarks: 0,
      rightMarks: 0,
      totalMarks: 0,
      leftPct: null,
      rightPct: null,
      minRightPct,
      targetRightPct:
        policy.rightTargetPct,
      maxRightPct,
    };
  }

  const rightPct =
    (
      rightMarks /
      totalMarks
    ) * 100;

  return {
    policy,
    availability:
      "ready",
    status:
      rangeStatus(
        rightPct,
        minRightPct,
        maxRightPct
      ),
    leftMarks,
    rightMarks,
    totalMarks,
    leftPct:
      100 - rightPct,
    rightPct,
    minRightPct,
    targetRightPct:
      policy.rightTargetPct,
    maxRightPct,
  };
}

function buildTopicSnapshots({
  policy,
  finalTargetMarks,
  topicMarks,
  invalid,
}: {
  policy: AssessmentMetricsPolicy;
  finalTargetMarks: number;
  topicMarks: Record<
    AssessmentTopicCode,
    number
  >;
  invalid: boolean;
}): TopicMetricSnapshot[] {
  return policy.topicTargets.map(
    (target) => {
      const marks =
        topicMarks[
          target.topic
        ] ?? 0;

      const range =
        toAchievableTopicMarkRange({
          minPct:
            target.minPct,
          targetPct:
            target.targetPct,
          maxPct:
            target.maxPct,
          finalTargetMarks,
        });

      const currentPct =
        !invalid &&
        finalTargetMarks > 0
          ? (
              marks /
              finalTargetMarks
            ) * 100
          : null;

      return {
        policy: target,
        availability:
          invalid
            ? "invalid"
            : finalTargetMarks > 0
              ? "ready"
              : "empty",
        status:
          rangeStatus(
            currentPct,
            target.minPct,
            target.maxPct
          ),
        marks,
        currentPct,
        minMarksExact:
          range.minExact,
        targetMarksExact:
          range.targetExact,
        maxMarksExact:
          range.maxExact,
        minMarksAchievable:
          range.minAchievable,
        targetMarksAchievable:
          range.targetAchievable,
        maxMarksAchievable:
          range.maxAchievable,
      };
    }
  );
}

export function calculateAssessmentMetrics({
  questions,
  finalTargetMarks,
  policy,
  coverageUnitIds,
}: {
  questions: Question[];
  finalTargetMarks: number;
  policy: AssessmentMetricsPolicy;
  coverageUnitIds: string[];
}): AssessmentMetricsSnapshot {
  const validationIssues:
    AssessmentMetricValidationIssue[] = [];

  const topicMarks: Record<
    AssessmentTopicCode,
    number
  > = {
    NUM: 0,
    ALG: 0,
    GEO: 0,
    TRIG: 0,
    STAT: 0,
  };

  let assignedMarks = 0;
  let cMarks = 0;
  let aMarks = 0;
  let operationalMarks = 0;
  let reasoningMarks = 0;

  let standardInvalid = false;
  let thinkingInvalid = false;
  let topicInvalid = false;

  const representedCoverage =
    new Set<string>();

  const allowedCoverage =
    new Set(
      coverageUnitIds
    );

  questions.forEach((question) => {
    const resolved =
      resolveQuestionMetricProfile(
        question
      );

    assignedMarks +=
      resolved.totalMarks;

    validationIssues.push(
      ...resolved.issues
    );

    if (
      resolved.cMarks === null ||
      resolved.aMarks === null
    ) {
      standardInvalid = true;
    } else {
      cMarks +=
        resolved.cMarks;
      aMarks +=
        resolved.aMarks;
    }

    if (
      resolved.operationalMarks === null ||
      resolved.reasoningMarks === null
    ) {
      thinkingInvalid = true;
    } else {
      operationalMarks +=
        resolved.operationalMarks;
      reasoningMarks +=
        resolved.reasoningMarks;
    }

    if (!resolved.topicMarks) {
      topicInvalid = true;
    } else {
      Object.keys(
        topicMarks
      ).forEach((topic) => {
        const code =
          topic as AssessmentTopicCode;

        topicMarks[code] +=
          resolved.topicMarks?.[code] ??
          0;
      });
    }

    getQuestionCoverageUnitIds(
      question
    ).forEach((unitId) => {
      if (
        allowedCoverage.has(
          unitId
        )
      ) {
        representedCoverage.add(
          unitId
        );
      } else {
        validationIssues.push({
          questionId:
            question.id,
          dimension:
            "coverage",
          message:
            `Question ${question.id} references unknown coverage unit ${unitId}.`,
        });
      }
    });
  });

  if (
    !Number.isFinite(
      finalTargetMarks
    ) ||
    finalTargetMarks <= 0
  ) {
    validationIssues.push({
      dimension:
        "target",
      message:
        "Assessment Metrics requires a positive final target-mark total.",
    });
  }

  const totalCoverageUnits =
    allowedCoverage.size;

  const representedUnits =
    representedCoverage.size;

  const coveragePercentage =
    totalCoverageUnits > 0
      ? (
          representedUnits /
          totalCoverageUnits
        ) * 100
      : 0;

  const requiredUnits =
    totalCoverageUnits > 0
      ? Math.ceil(
          totalCoverageUnits *
          (
            policy.coverage
              .thresholdPct /
            100
          )
        )
      : 0;

  return {
    assignedMarks,
    finalTargetMarks:
      Math.max(
        0,
        Number.isFinite(
          finalTargetMarks
        )
          ? finalTargetMarks
          : 0
      ),

    standard:
      buildBalanceSnapshot({
        policy:
          policy.standardBalance,
        leftMarks:
          cMarks,
        rightMarks:
          aMarks,
        totalMarks:
          assignedMarks,
        invalid:
          standardInvalid,
      }),

    thinking:
      buildBalanceSnapshot({
        policy:
          policy.thinkingBalance,
        leftMarks:
          operationalMarks,
        rightMarks:
          reasoningMarks,
        totalMarks:
          assignedMarks,
        invalid:
          thinkingInvalid,
      }),

    topics:
      buildTopicSnapshots({
        policy,
        finalTargetMarks,
        topicMarks,
        invalid:
          topicInvalid,
      }),

    coverage: {
      policy:
        policy.coverage,
      availability:
        totalCoverageUnits > 0
          ? "ready"
          : "invalid",
      representedUnits,
      totalUnits:
        totalCoverageUnits,
      requiredUnits,
      percentage:
        coveragePercentage,
      thresholdMet:
        coveragePercentage >=
        policy.coverage
          .thresholdPct,
      representedUnitIds: [
        ...representedCoverage,
      ],
    },

    validationIssues,
  };
}
