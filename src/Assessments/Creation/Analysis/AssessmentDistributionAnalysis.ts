import type {
  AssessmentTopicCode,
  Paper,
  Question,
  QuestionTopicMarkBreakdown,
  SkillDomain,
} from "@/src/Assessments/AssessmentTypes";
import type {
  CourseAssessmentConfig,
  CourseTopicTarget,
} from "@/src/Courses/CourseAssessmentConfig";

export const FALLBACK_ASSESSMENT_TOPICS: AssessmentTopicCode[] = [
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

function getAssessmentTopicsFromCourseConfig(
  courseConfig: CourseAssessmentConfig
): AssessmentTopicCode[] {
  const topics = courseConfig.topicTargets.map((target) => target.topic);
  return topics.length > 0 ? topics : FALLBACK_ASSESSMENT_TOPICS;
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
  breakdown: QuestionTopicMarkBreakdown | undefined,
  topics: AssessmentTopicCode[] = FALLBACK_ASSESSMENT_TOPICS
): number {
  if (!breakdown) return 0;

  return topics.reduce((sum, topic) => {
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
  includedPapers?: Paper[],
  topics: AssessmentTopicCode[] = FALLBACK_ASSESSMENT_TOPICS
): QuestionTopicMarkBreakdown {
  const next = emptyTopicMarkBreakdown();

  questions.forEach((question: Question) => {
    if (includedPapers && !includedPapers.includes(question.paper)) return;

    const breakdown = getQuestionTopicMarkBreakdown(question);

    topics.forEach((topic: AssessmentTopicCode) => {
      next[topic] += breakdown[topic] ?? 0;
    });
  });

  return next;
}

/**
 * Generic total-mark calculation.
 *
 * This is the future-facing version. It does not care whether a course has
 * Paper 1 / Paper 2 specifically. It only needs:
 *
 * - which papers are included
 * - the target marks for each paper
 */
export function calculateTotalAssessmentMarksFromPaperTargets(args: {
  includedPapers: Paper[];
  targetMarksByPaper: Partial<Record<Paper, number>>;
}): number {
  const { includedPapers, targetMarksByPaper } = args;

  return includedPapers.reduce((total, paper) => {
    const marks = targetMarksByPaper[paper];

    if (typeof marks !== "number" || !Number.isFinite(marks) || marks <= 0) {
      return total;
    }

    return total + marks;
  }, 0);
}

/**
 * Legacy N5-style helper kept temporarily for older call sites.
 *
 * Prefer calculateTotalAssessmentMarksFromPaperTargets(...) for new code.
 */
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

  return calculateTotalAssessmentMarksFromPaperTargets({
    includedPapers: [
      ...(includePaper1 ? (["P1"] as const) : []),
      ...(includePaper2 ? (["P2"] as const) : []),
    ],
    targetMarksByPaper: {
      P1: p1TargetMarks,
      P2: p2TargetMarks,
    },
  });
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
    includedPapers = courseConfig.papers.map((paper) => paper.id),
  } = args;

  const courseTopics = getAssessmentTopicsFromCourseConfig(courseConfig);

  const topicTotals = sumTopicMarkBreakdowns(
    questions,
    includedPapers,
    courseTopics
  );

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
      .sort(
        (a: TopicBalanceRow, b: TopicBalanceRow) =>
          b.marksFromTarget - a.marksFromTarget
      )[0] ?? null;

  return {
    totalAssessmentMarks: roundTo(totalAssessmentMarks),
    currentAssignedMarks,
    includedPapers,
    rows,
    recommendedNextTopic,
  };
}