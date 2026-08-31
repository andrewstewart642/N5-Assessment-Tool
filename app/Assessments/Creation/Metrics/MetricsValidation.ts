import type {
  AssessmentTopicCode,
  Question,
  QuestionTopicMarkBreakdown,
} from "@/app/Assessments/AssessmentTypes";

import type {
  AssessmentMetricValidationIssue,
} from "./MetricsTypes";

export const ASSESSMENT_TOPIC_CODES:
  AssessmentTopicCode[] = [
    "NUM",
    "ALG",
    "GEO",
    "TRIG",
    "STAT",
  ];

export type ResolvedQuestionMetricProfile = {
  totalMarks: number;

  cMarks: number | null;
  aMarks: number | null;

  operationalMarks:
    number | null;
  reasoningMarks:
    number | null;

  topicMarks:
    QuestionTopicMarkBreakdown | null;

  issues:
    AssessmentMetricValidationIssue[];
};

function finiteNonNegative(
  value: unknown
): value is number {
  return (
    typeof value === "number" &&
    Number.isFinite(value) &&
    value >= 0
  );
}

export function getQuestionMetricTotalMarks(
  question: Question
): number {
  if (
    finiteNonNegative(
      question.marks
    )
  ) {
    return question.marks;
  }

  if (
    finiteNonNegative(
      question.targetMarks
    )
  ) {
    return question.targetMarks;
  }

  return 0;
}

function totalsMatch(
  first: number,
  second: number
): boolean {
  return (
    Math.abs(
      first - second
    ) < 0.000001
  );
}

function resolveStandardMarks(
  question: Question,
  totalMarks: number,
  issues:
    AssessmentMetricValidationIssue[]
): {
  cMarks: number | null;
  aMarks: number | null;
} {
  const selectionMarks =
    question.selectionMeta
      ?.marks;

  if (
    selectionMarks &&
    finiteNonNegative(
      selectionMarks.cMarks
    ) &&
    finiteNonNegative(
      selectionMarks.aMarks
    ) &&
    totalsMatch(
      selectionMarks.totalMarks,
      totalMarks
    ) &&
    totalsMatch(
      selectionMarks.cMarks +
        selectionMarks.aMarks,
      totalMarks
    )
  ) {
    return {
      cMarks:
        selectionMarks.cMarks,
      aMarks:
        selectionMarks.aMarks,
    };
  }

  if (
    finiteNonNegative(
      question.cMarks
    ) &&
    finiteNonNegative(
      question.aMarks
    ) &&
    totalsMatch(
      question.cMarks +
        question.aMarks,
      totalMarks
    )
  ) {
    return {
      cMarks:
        question.cMarks,
      aMarks:
        question.aMarks,
    };
  }

  issues.push({
    questionId:
      question.id,
    dimension:
      "standard",
    message:
      `Question ${question.id} must allocate all ${totalMarks} marks between C and A.`,
  });

  return {
    cMarks: null,
    aMarks: null,
  };
}

function resolveThinkingMarks(
  question: Question,
  totalMarks: number,
  issues:
    AssessmentMetricValidationIssue[]
): {
  operationalMarks:
    number | null;
  reasoningMarks:
    number | null;
} {
  const selectionReasoning =
    question.selectionMeta
      ?.marks
      .reasoningMarks;

  const reasoningMarks =
    finiteNonNegative(
      selectionReasoning
    ) &&
    selectionReasoning <=
      totalMarks
      ? selectionReasoning
      : finiteNonNegative(
            question.reasoningMarks
          ) &&
          question.reasoningMarks <=
            totalMarks
        ? question.reasoningMarks
        : null;

  if (
    reasoningMarks !== null
  ) {
    return {
      reasoningMarks,
      operationalMarks:
        totalMarks -
        reasoningMarks,
    };
  }

  issues.push({
    questionId:
      question.id,
    dimension:
      "thinking",
    message:
      `Question ${question.id} must classify all ${totalMarks} marks as Operational or Reasoning.`,
  });

  return {
    operationalMarks: null,
    reasoningMarks: null,
  };
}

function resolveTopicMarks(
  question: Question,
  totalMarks: number,
  issues:
    AssessmentMetricValidationIssue[]
): QuestionTopicMarkBreakdown | null {
  const breakdown =
    question.topicMarkBreakdown;

  if (!breakdown) {
    issues.push({
      questionId:
        question.id,
      dimension:
        "topic",
      message:
        `Question ${question.id} must allocate all ${totalMarks} marks across assessment topics.`,
    });

    return null;
  }

  const values =
    ASSESSMENT_TOPIC_CODES.map(
      (topic) =>
        breakdown[topic]
    );

  if (
    values.some(
      (value) =>
        !finiteNonNegative(
          value
        )
    )
  ) {
    issues.push({
      questionId:
        question.id,
      dimension:
        "topic",
      message:
        `Question ${question.id} contains invalid topic-mark data.`,
    });

    return null;
  }

  const topicTotal =
    values.reduce(
      (sum, value) =>
        sum + value,
      0
    );

  if (
    !totalsMatch(
      topicTotal,
      totalMarks
    )
  ) {
    issues.push({
      questionId:
        question.id,
      dimension:
        "topic",
      message:
        `Question ${question.id} allocates ${topicTotal} topic marks but has ${totalMarks} total marks.`,
    });

    return null;
  }

  return breakdown;
}

export function resolveQuestionMetricProfile(
  question: Question
): ResolvedQuestionMetricProfile {
  const issues:
    AssessmentMetricValidationIssue[] = [];

  const totalMarks =
    getQuestionMetricTotalMarks(
      question
    );

  const standard =
    resolveStandardMarks(
      question,
      totalMarks,
      issues
    );

  const thinking =
    resolveThinkingMarks(
      question,
      totalMarks,
      issues
    );

  const topicMarks =
    resolveTopicMarks(
      question,
      totalMarks,
      issues
    );

  return {
    totalMarks,

    cMarks:
      standard.cMarks,
    aMarks:
      standard.aMarks,

    operationalMarks:
      thinking.operationalMarks,
    reasoningMarks:
      thinking.reasoningMarks,

    topicMarks,
    issues,
  };
}
