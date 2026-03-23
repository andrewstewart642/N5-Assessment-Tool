import type { BuilderNote } from "@/app/create-assessment/builder/builder-logic/BuilderNotes";
import type { Paper, Question } from "@/shared-types/AssessmentTypes";

type BuildOperationalReasoningNotesArgs = {
  questions: Question[];
  includedPapers?: Paper[];
  totalAssessmentMarks: number;

  includeBasisNote?: boolean;
  includeRecommendationNote?: boolean;

  earlyStageMaxAssignedPct?: number;
  midStageMaxAssignedPct?: number;
  lateStageMaxAssignedPct?: number;

  midStageAdvisedReasoningMinPct?: number;
  lateStageAdvisedReasoningMinPct?: number;
  finalStageAdvisedReasoningMinPct?: number;

  lateStageEssentialReasoningMinPct?: number;
  finalStageEssentialReasoningMinPct?: number;
};

type BuildStage = "early" | "mid" | "late" | "final";

type ThinkingTypeBalance = {
  assignedMarks: number;
  operationalMarks: number;
  reasoningMarks: number;
  operationalPct: number;
  reasoningPct: number;
  recommendedNextType: "OPERATIONAL" | "REASONING" | null;
};

function roundTo(value: number, dp = 2): number {
  const factor = 10 ** dp;
  return Math.round(value * factor) / factor;
}

function formatNumber(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(2);
}

function getQuestionTotalMarks(question: Question): number {
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

function getQuestionReasoningMarks(question: Question): number {
  if (
    typeof question.reasoningMarks === "number" &&
    Number.isFinite(question.reasoningMarks) &&
    question.reasoningMarks > 0
  ) {
    return question.reasoningMarks;
  }

  if (question.isReasoning) {
    return getQuestionTotalMarks(question);
  }

  return 0;
}

function getThinkingTypeBalance(args: {
  questions: Question[];
  includedPapers: Paper[];
  totalAssessmentMarks: number;
}): ThinkingTypeBalance {
  const { questions, includedPapers, totalAssessmentMarks } = args;

  const includedQuestions = questions.filter((q) => includedPapers.includes(q.paper));

  const assignedMarks = roundTo(
    includedQuestions.reduce((sum, q) => sum + getQuestionTotalMarks(q), 0)
  );

  const reasoningMarks = roundTo(
    includedQuestions.reduce((sum, q) => sum + getQuestionReasoningMarks(q), 0)
  );

  const operationalMarks = roundTo(Math.max(0, assignedMarks - reasoningMarks));

  const reasoningPct =
    assignedMarks > 0 ? roundTo((reasoningMarks / assignedMarks) * 100) : 0;

  const operationalPct =
    assignedMarks > 0 ? roundTo((operationalMarks / assignedMarks) * 100) : 0;

  let recommendedNextType: "OPERATIONAL" | "REASONING" | null = null;

  if (assignedMarks > 0) {
    recommendedNextType =
      reasoningPct < 30 ? "REASONING" : operationalPct < 30 ? "OPERATIONAL" : null;
  }

  return {
    assignedMarks,
    operationalMarks,
    reasoningMarks,
    operationalPct,
    reasoningPct,
    recommendedNextType,
  };
}

function getAssignedPctOfAssessment(
  assignedMarks: number,
  totalAssessmentMarks: number
): number {
  if (!Number.isFinite(totalAssessmentMarks) || totalAssessmentMarks <= 0) {
    return 0;
  }

  return roundTo((assignedMarks / totalAssessmentMarks) * 100);
}

function getBuildStage(args: {
  assignedPctOfAssessment: number;
  earlyStageMaxAssignedPct: number;
  midStageMaxAssignedPct: number;
  lateStageMaxAssignedPct: number;
}): BuildStage {
  const {
    assignedPctOfAssessment,
    earlyStageMaxAssignedPct,
    midStageMaxAssignedPct,
    lateStageMaxAssignedPct,
  } = args;

  if (assignedPctOfAssessment < earlyStageMaxAssignedPct) return "early";
  if (assignedPctOfAssessment < midStageMaxAssignedPct) return "mid";
  if (assignedPctOfAssessment < lateStageMaxAssignedPct) return "late";
  return "final";
}

function buildBasisNote(
  balance: ThinkingTypeBalance,
  includedPapers: Paper[]
): BuilderNote {
  return {
    id: "thinking-basis",
    severity: "suggestion",
    source: "thinking-balance",
    rank: 1,
    message: `Thinking type basis: ${formatNumber(
      balance.assignedMarks
    )} assigned marks across ${includedPapers.join(
      " + "
    )}, with ${formatNumber(balance.reasoningMarks)} reasoning and ${formatNumber(
      balance.operationalMarks
    )} operational.`,
  };
}

function buildAdvisedReasoningNote(balance: ThinkingTypeBalance): BuilderNote {
  return {
    id: "thinking-reasoning-advised",
    severity: "advised",
    source: "thinking-balance",
    rank: 70,
    message: `This assessment is currently quite operational-heavy. Reasoning contributes ${formatNumber(
      balance.reasoningMarks
    )} marks (${formatNumber(
      balance.reasoningPct
    )}%). Consider adding a reasoning question.`,
  };
}

function buildEssentialReasoningNote(balance: ThinkingTypeBalance): BuilderNote {
  return {
    id: "thinking-reasoning-essential",
    severity: "essential",
    source: "thinking-balance",
    rank: 95,
    message: `Reasoning is currently too scarce for a well-balanced paper. Only ${formatNumber(
      balance.reasoningMarks
    )} marks (${formatNumber(
      balance.reasoningPct
    )}%) are reasoning-based, so the assessment risks becoming too procedural.`,
  };
}

function buildRecommendationNote(
  recommendedNextType: "OPERATIONAL" | "REASONING"
): BuilderNote {
  return {
    id: "thinking-recommendation",
    severity: "suggestion",
    source: "thinking-balance",
    rank: 10,
    message: `Recommended next thinking type: ${
      recommendedNextType === "REASONING" ? "Reasoning" : "Operational"
    }.`,
  };
}

export function buildOperationalReasoningNotes({
  questions,
  includedPapers = ["P1", "P2"],
  totalAssessmentMarks,

  includeBasisNote = true,
  includeRecommendationNote = true,

  earlyStageMaxAssignedPct = 25,
  midStageMaxAssignedPct = 60,
  lateStageMaxAssignedPct = 85,

  midStageAdvisedReasoningMinPct = 20,
  lateStageAdvisedReasoningMinPct = 25,
  finalStageAdvisedReasoningMinPct = 30,

  lateStageEssentialReasoningMinPct = 15,
  finalStageEssentialReasoningMinPct = 20,
}: BuildOperationalReasoningNotesArgs): BuilderNote[] {
  const notes: BuilderNote[] = [];

  const balance = getThinkingTypeBalance({
    questions,
    includedPapers,
    totalAssessmentMarks,
  });

  if (includeBasisNote) {
    notes.push(buildBasisNote(balance, includedPapers));
  }

  if (balance.assignedMarks <= 0 || totalAssessmentMarks <= 0) {
    return notes;
  }

  const assignedPctOfAssessment = getAssignedPctOfAssessment(
    balance.assignedMarks,
    totalAssessmentMarks
  );

  const stage = getBuildStage({
    assignedPctOfAssessment,
    earlyStageMaxAssignedPct,
    midStageMaxAssignedPct,
    lateStageMaxAssignedPct,
  });

  if (stage === "mid" && balance.reasoningPct < midStageAdvisedReasoningMinPct) {
    notes.push(buildAdvisedReasoningNote(balance));
  }

  if (stage === "late") {
    if (balance.reasoningPct < lateStageEssentialReasoningMinPct) {
      notes.push(buildEssentialReasoningNote(balance));
    } else if (balance.reasoningPct < lateStageAdvisedReasoningMinPct) {
      notes.push(buildAdvisedReasoningNote(balance));
    }
  }

  if (stage === "final") {
    if (balance.reasoningPct < finalStageEssentialReasoningMinPct) {
      notes.push(buildEssentialReasoningNote(balance));
    } else if (balance.reasoningPct < finalStageAdvisedReasoningMinPct) {
      notes.push(buildAdvisedReasoningNote(balance));
    }
  }

  if (
    includeRecommendationNote &&
    balance.recommendedNextType &&
    balance.assignedMarks > 0
  ) {
    notes.push(buildRecommendationNote(balance.recommendedNextType));
  }

  return notes;
}