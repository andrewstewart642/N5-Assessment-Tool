import type {
  AssessmentQualityNote,
} from "./AssessmentQualityNotes";
import { getDefaultCourseAssessmentConfig } from "@/src/Courses/CourseRegistry";
import type { CourseAssessmentConfig } from "@/src/Courses/CourseAssessmentConfig";
import type { Paper } from "@/shared-types/AssessmentTypes";
import type {
  TopicBalanceAnalysis,
  TopicBalanceRow,
} from "./AssessmentDistributionAnalysis";

type BuildTopicBalanceNotesArgs = {
  analysis: TopicBalanceAnalysis;
  courseConfig?: CourseAssessmentConfig;

  includeBasisNote?: boolean;
  includeRecommendationNote?: boolean;

  earlyStageMaxAssignedPct?: number;
  midStageMaxAssignedPct?: number;
  lateStageMaxAssignedPct?: number;

  midStageMidpointTolerancePct?: number;
  lateStageMidpointTolerancePct?: number;
  finalStageMidpointTolerancePct?: number;

  maxAdvisedMidStage?: number;
  maxAdvisedLateStage?: number;
  maxAdvisedFinalStage?: number;

  maxEssentialLateStage?: number;
  maxEssentialFinalStage?: number;
};

type BuildStage = "early" | "mid" | "late" | "final";

type RankedTopicIssue = {
  note: AssessmentQualityNote;
  score: number;
};

function formatNumber(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(2);
}

function clampPct(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, value));
}

function getAssignedPct(analysis: TopicBalanceAnalysis): number {
  if (analysis.totalAssessmentMarks <= 0) return 0;
  return clampPct(
    (analysis.currentAssignedMarks / analysis.totalAssessmentMarks) * 100
  );
}

function getRemainingMarks(analysis: TopicBalanceAnalysis): number {
  return Math.max(
    0,
    analysis.totalAssessmentMarks - analysis.currentAssignedMarks
  );
}

function getBuildStage(args: {
  assignedPct: number;
  earlyStageMaxAssignedPct: number;
  midStageMaxAssignedPct: number;
  lateStageMaxAssignedPct: number;
}): BuildStage {
  const {
    assignedPct,
    earlyStageMaxAssignedPct,
    midStageMaxAssignedPct,
    lateStageMaxAssignedPct,
  } = args;

  if (assignedPct < earlyStageMaxAssignedPct) return "early";
  if (assignedPct < midStageMaxAssignedPct) return "mid";
  if (assignedPct < lateStageMaxAssignedPct) return "late";
  return "final";
}

function getPaperLabel(
  courseConfig: CourseAssessmentConfig,
  paper: Paper
): string {
  return courseConfig.papers.find((item) => item.id === paper)?.shortLabel ?? paper;
}

function formatIncludedPapers(
  courseConfig: CourseAssessmentConfig,
  includedPapers: Paper[]
): string {
  return includedPapers
    .map((paper) => getPaperLabel(courseConfig, paper))
    .join(" + ");
}

function getAwardingBodyStyleLabel(
  courseConfig: CourseAssessmentConfig
): string {
  return `${courseConfig.awardingBody}-style`;
}

function buildBasisNote(args: {
  analysis: TopicBalanceAnalysis;
  courseConfig: CourseAssessmentConfig;
}): AssessmentQualityNote {
  const { analysis, courseConfig } = args;

  return {
    id: "topic-basis",
    severity: "suggestion",
    source: "topic-balance",
    rank: 1,
    message: `Topic balance basis: ${formatNumber(
      analysis.totalAssessmentMarks
    )} total assessment marks across ${formatIncludedPapers(
      courseConfig,
      analysis.includedPapers
    )}.`,
  };
}

function buildRecommendationNote(row: TopicBalanceRow): AssessmentQualityNote {
  return {
    id: "topic-recommendation",
    severity: "suggestion",
    source: "topic-balance",
    rank: 10,
    message: `Recommended next topic area: ${row.label}.`,
  };
}

function buildOverweightEssentialNote(args: {
  row: TopicBalanceRow;
  courseConfig: CourseAssessmentConfig;
}): AssessmentQualityNote {
  const { row, courseConfig } = args;
  const styleLabel = getAwardingBodyStyleLabel(courseConfig);

  return {
    id: `topic-${row.topic.toLowerCase()}-overweight-essential`,
    severity: "essential",
    source: "topic-balance",
    rank: 100,
    message: `${row.label} already contributes ${formatNumber(
      row.currentMarks
    )} marks (${formatNumber(
      row.currentPct
    )}%), which is above the ${styleLabel} maximum of ${formatNumber(
      row.maxMarks
    )} marks (${formatNumber(row.maxPct)}%). This is now difficult to recover because assigned marks cannot be removed through later topic choices.`,
  };
}

function buildUnderweightEssentialNote(args: {
  row: TopicBalanceRow;
  remainingMarks: number;
  courseConfig: CourseAssessmentConfig;
}): AssessmentQualityNote {
  const { row, remainingMarks, courseConfig } = args;
  const styleLabel = getAwardingBodyStyleLabel(courseConfig);

  return {
    id: `topic-${row.topic.toLowerCase()}-underweight-essential`,
    severity: "essential",
    source: "topic-balance",
    rank: 95,
    message: `${row.label} currently contributes ${formatNumber(
      row.currentMarks
    )} marks (${formatNumber(
      row.currentPct
    )}%). With only ${formatNumber(
      remainingMarks
    )} marks still unassigned, it can no longer realistically reach the minimum ${styleLabel} target of ${formatNumber(
      row.minMarks
    )} marks (${formatNumber(row.minPct)}%).`,
  };
}

function buildRangeDriftAdvisedNote(args: {
  row: TopicBalanceRow;
  courseConfig: CourseAssessmentConfig;
}): AssessmentQualityNote {
  const { row, courseConfig } = args;
  const styleLabel = getAwardingBodyStyleLabel(courseConfig);
  const isBelow = row.currentPct < row.minPct;
  const driftText = isBelow ? "below" : "above";

  return {
    id: `topic-${row.topic.toLowerCase()}-range-drift`,
    severity: "advised",
    source: "topic-balance",
    rank: 70,
    message: `${row.label} is currently ${driftText} its ${styleLabel} range at ${formatNumber(
      row.currentMarks
    )} marks (${formatNumber(
      row.currentPct
    )}%). Recommended range is ${formatNumber(
      row.minMarks
    )}–${formatNumber(row.maxMarks)} marks (${formatNumber(
      row.minPct
    )}%–${formatNumber(row.maxPct)}%).`,
  };
}

function buildMidpointDriftAdvisedNote(row: TopicBalanceRow): AssessmentQualityNote {
  const marksDelta = Math.abs(row.marksFromTarget);
  const belowTarget = row.marksFromTarget > 0;
  const directionText = belowTarget ? "below" : "above";

  return {
    id: `topic-${row.topic.toLowerCase()}-midpoint-drift`,
    severity: "advised",
    source: "topic-balance",
    rank: 55,
    message: `${row.label} is within range, but currently sits ${formatNumber(
      marksDelta
    )} marks ${directionText} its midpoint target of ${formatNumber(
      row.targetMarks
    )} marks (${formatNumber(row.targetPct)}%).`,
  };
}

function scoreOverweightEssential(row: TopicBalanceRow): number {
  return Math.max(0, row.currentMarks - row.maxMarks);
}

function scoreUnderweightEssential(
  row: TopicBalanceRow,
  remainingMarks: number
): number {
  const reachableMarks = row.currentMarks + remainingMarks;
  return Math.max(0, row.minMarks - reachableMarks);
}

function scoreRangeDrift(row: TopicBalanceRow): number {
  if (row.currentPct < row.minPct) return row.minPct - row.currentPct;
  if (row.currentPct > row.maxPct) return row.currentPct - row.maxPct;
  return 0;
}

function scoreMidpointDrift(row: TopicBalanceRow): number {
  return Math.abs(row.pctFromTarget);
}

function sortRankedIssuesDescending(
  issues: RankedTopicIssue[]
): RankedTopicIssue[] {
  return [...issues].sort((a, b) => b.score - a.score);
}

function takeTopIssues(
  issues: RankedTopicIssue[],
  limit: number
): AssessmentQualityNote[] {
  if (limit <= 0) return [];
  return sortRankedIssuesDescending(issues)
    .slice(0, limit)
    .map((issue) => issue.note);
}

export function buildTopicBalanceNotes({
  analysis,
  courseConfig = getDefaultCourseAssessmentConfig(),
  includeBasisNote = true,
  includeRecommendationNote = true,

  earlyStageMaxAssignedPct = 25,
  midStageMaxAssignedPct = 60,
  lateStageMaxAssignedPct = 85,

  midStageMidpointTolerancePct = 8,
  lateStageMidpointTolerancePct = 5,
  finalStageMidpointTolerancePct = 3,

  maxAdvisedMidStage = 1,
  maxAdvisedLateStage = 2,
  maxAdvisedFinalStage = 3,

  maxEssentialLateStage = 2,
  maxEssentialFinalStage = 3,
}: BuildTopicBalanceNotesArgs): AssessmentQualityNote[] {
  const notes: AssessmentQualityNote[] = [];

  if (includeBasisNote) {
    notes.push(
      buildBasisNote({
        analysis,
        courseConfig,
      })
    );
  }

  if (analysis.totalAssessmentMarks <= 0) {
    return notes;
  }

  const assignedPct = getAssignedPct(analysis);
  const remainingMarks = getRemainingMarks(analysis);

  const stage = getBuildStage({
    assignedPct,
    earlyStageMaxAssignedPct,
    midStageMaxAssignedPct,
    lateStageMaxAssignedPct,
  });

  const essentialIssues: RankedTopicIssue[] = [];
  const advisedIssues: RankedTopicIssue[] = [];

  for (const row of analysis.rows) {
    const isOverweightNow = row.currentMarks > row.maxMarks;
    const isUnderweightNow = row.currentMarks < row.minMarks;
    const isInsideRange = !isOverweightNow && !isUnderweightNow;

    const isUnderweightUnrecoverable =
      row.currentMarks + remainingMarks < row.minMarks;

    if (isOverweightNow) {
      essentialIssues.push({
        note: buildOverweightEssentialNote({
          row,
          courseConfig,
        }),
        score: scoreOverweightEssential(row),
      });
      continue;
    }

    if (isUnderweightUnrecoverable) {
      essentialIssues.push({
        note: buildUnderweightEssentialNote({
          row,
          remainingMarks,
          courseConfig,
        }),
        score: scoreUnderweightEssential(row, remainingMarks),
      });
      continue;
    }

    if (stage === "early") {
      continue;
    }

    if (isUnderweightNow) {
      advisedIssues.push({
        note: buildRangeDriftAdvisedNote({
          row,
          courseConfig,
        }),
        score: scoreRangeDrift(row),
      });
      continue;
    }

    let midpointTolerancePct = finalStageMidpointTolerancePct;
    if (stage === "mid") midpointTolerancePct = midStageMidpointTolerancePct;
    if (stage === "late") midpointTolerancePct = lateStageMidpointTolerancePct;

    if (isInsideRange && Math.abs(row.pctFromTarget) >= midpointTolerancePct) {
      advisedIssues.push({
        note: buildMidpointDriftAdvisedNote(row),
        score: scoreMidpointDrift(row),
      });
    }
  }

  if (stage === "mid") {
    notes.push(...takeTopIssues(advisedIssues, maxAdvisedMidStage));
  } else if (stage === "late") {
    notes.push(...takeTopIssues(essentialIssues, maxEssentialLateStage));
    notes.push(...takeTopIssues(advisedIssues, maxAdvisedLateStage));
  } else if (stage === "final") {
    notes.push(...takeTopIssues(essentialIssues, maxEssentialFinalStage));
    notes.push(...takeTopIssues(advisedIssues, maxAdvisedFinalStage));
  }

  if (
    includeRecommendationNote &&
    analysis.recommendedNextTopic &&
    analysis.currentAssignedMarks > 0
  ) {
    notes.push(buildRecommendationNote(analysis.recommendedNextTopic));
  }

  return notes;
}