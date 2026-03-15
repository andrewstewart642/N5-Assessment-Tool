// app/create-assessment/builder/builder-logic/AssessmentDistributionAnalysis.ts

import type {
  AssessmentTopicCode,
  Paper,
  Question,
  QuestionTopicMarkBreakdown,
  SkillDomain,
} from "@/shared-types/AssessmentTypes";
import type {
  CourseAssessmentConfig,
  CourseTopicTarget,
} from "@/course-data/course-configs/N5MathsCourseConfig";

export const ALL_ASSESSMENT_TOPICS: AssessmentTopicCode[] = [
  "NUM",
  "ALG",
  "GEO",
  "TRIG",
  "STAT",
];

export type TopicBalanceRow = {
  topic: AssessmentTopicCode;
  label: string;

  minPct: number;
  maxPct: number;
  targetPct: number;

  minMarks: number;
  maxMarks: number;
  targetMarks: number;

  currentMarks: number;
  currentPct: number;

  marksFromTarget: number;
  pctFromTarget: number;
};

export type TopicBalanceAnalysis = {
  totalAssessmentMarks: number;
  currentAssignedMarks: number;
  includedPapers: Paper[];
  rows: TopicBalanceRow[];
  recommendedNextTopic: TopicBalanceRow | null;
};

function roundTo(value: number, dp = 2): number {
  const factor = 10 ** dp;
  return Math.round(value * factor) / factor;
}

export function emptyTopicMarkBreakdown(): QuestionTopicMarkBreakdown {
  return {
    NUM: 0,
    ALG: 0,
    GEO: 0,
    TRIG: 0,
    STAT: 0,
  };
}

export function totalMarksFromTopicBreakdown(
  breakdown: QuestionTopicMarkBreakdown | undefined
): number {
  if (!breakdown) return 0;

  return ALL_ASSESSMENT_TOPICS.reduce((sum, topic) => {
    const value = breakdown[topic];
    return sum + (Number.isFinite(value) ? value : 0);
  }, 0);
}

export function getQuestionTotalMarks(question: Question): number {
  if (typeof question.marks === "number" && Number.isFinite(question.marks)) {
    return question.marks;
  }

  if (
    typeof question.targetMarks === "number" &&
    Number.isFinite(question.targetMarks)
  ) {
    return question.targetMarks;
  }

  return 0;
}

export function buildSingleTopicMarkBreakdown(
  topic: SkillDomain | undefined,
  totalMarks: number
): QuestionTopicMarkBreakdown | undefined {
  if (!topic || !Number.isFinite(totalMarks) || totalMarks <= 0) {
    return undefined;
  }

  const breakdown = emptyTopicMarkBreakdown();
  breakdown[topic] = totalMarks;
  return breakdown;
}

export function getQuestionTopicMarkBreakdown(
  question: Question
): QuestionTopicMarkBreakdown {
  if (question.topicMarkBreakdown) {
    return {
      ...emptyTopicMarkBreakdown(),
      ...question.topicMarkBreakdown,
    };
  }

  const totalMarks = getQuestionTotalMarks(question);
  return (
    buildSingleTopicMarkBreakdown(question.skillDomain, totalMarks) ??
    emptyTopicMarkBreakdown()
  );
}

export function sumTopicMarkBreakdowns(
  questions: Question[],
  includedPapers?: Paper[]
): QuestionTopicMarkBreakdown {
  const next = emptyTopicMarkBreakdown();

  questions.forEach((question: Question) => {
    if (includedPapers && !includedPapers.includes(question.paper)) return;

    const breakdown = getQuestionTopicMarkBreakdown(question);

    ALL_ASSESSMENT_TOPICS.forEach((topic: AssessmentTopicCode) => {
      next[topic] += breakdown[topic] ?? 0;
    });
  });

  return next;
}

export function calculateTotalAssessmentMarks(args: {
  includePaper1: boolean;
  includePaper2: boolean;
  p1TargetMarks: number;
  p2TargetMarks: number;
}): number {
  const {
    includePaper1,
    includePaper2,
    p1TargetMarks,
    p2TargetMarks,
  } = args;

  let total = 0;

  if (includePaper1) total += p1TargetMarks;
  if (includePaper2) total += p2TargetMarks;

  return total;
}

function buildRow(
  target: CourseTopicTarget,
  currentMarks: number,
  totalAssessmentMarks: number
): TopicBalanceRow {
  const minMarks = (target.minPct / 100) * totalAssessmentMarks;
  const maxMarks = (target.maxPct / 100) * totalAssessmentMarks;
  const targetMarks = (target.targetPct / 100) * totalAssessmentMarks;
  const currentPct =
    totalAssessmentMarks > 0 ? (currentMarks / totalAssessmentMarks) * 100 : 0;

  return {
    topic: target.topic,
    label: target.label,

    minPct: target.minPct,
    maxPct: target.maxPct,
    targetPct: target.targetPct,

    minMarks: roundTo(minMarks),
    maxMarks: roundTo(maxMarks),
    targetMarks: roundTo(targetMarks),

    currentMarks: roundTo(currentMarks),
    currentPct: roundTo(currentPct),

    marksFromTarget: roundTo(targetMarks - currentMarks),
    pctFromTarget: roundTo(target.targetPct - currentPct),
  };
}

export function analyseTopicBalance(args: {
  questions: Question[];
  totalAssessmentMarks: number;
  courseConfig: CourseAssessmentConfig;
  includedPapers?: Paper[];
}): TopicBalanceAnalysis {
  const {
    questions,
    totalAssessmentMarks,
    courseConfig,
    includedPapers = ["P1", "P2"],
  } = args;

  const topicTotals = sumTopicMarkBreakdowns(questions, includedPapers);

  const currentAssignedMarks = roundTo(
    questions
      .filter((q: Question) => includedPapers.includes(q.paper))
      .reduce((sum: number, q: Question) => sum + getQuestionTotalMarks(q), 0)
  );

  const rows: TopicBalanceRow[] = courseConfig.topicTargets.map(
    (target: CourseTopicTarget) =>
      buildRow(target, topicTotals[target.topic] ?? 0, totalAssessmentMarks)
  );

  const recommendedNextTopic: TopicBalanceRow | null =
    rows
      .filter((row: TopicBalanceRow) => row.marksFromTarget > 0)
      .sort((a: TopicBalanceRow, b: TopicBalanceRow) => b.marksFromTarget - a.marksFromTarget)[0] ??
    null;

  return {
    totalAssessmentMarks: roundTo(totalAssessmentMarks),
    currentAssignedMarks,
    includedPapers,
    rows,
    recommendedNextTopic,
  };
}