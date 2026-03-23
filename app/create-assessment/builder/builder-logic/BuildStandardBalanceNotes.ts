import type { BuilderNote } from "@/app/create-assessment/builder/builder-logic/BuilderNotes";
import type { Paper, Question } from "@/shared-types/AssessmentTypes";

type BuildStandardBalanceNotesArgs = {
  questions: Question[];
  includedPapers?: Paper[];
  totalAssessmentMarks: number;

  includeBasisNote?: boolean;
  includeRecommendationNote?: boolean;

  earlyStageMaxAssignedPct?: number;
  midStageMaxAssignedPct?: number;
  lateStageMaxAssignedPct?: number;

  midStageAdvisedAMinPct?: number;
  lateStageAdvisedAMinPct?: number;
  finalStageAdvisedAMinPct?: number;

  lateStageEssentialAMinPct?: number;
  finalStageEssentialAMinPct?: number;

  midStageAdvisedCMinPct?: number;
  lateStageAdvisedCMinPct?: number;
  finalStageAdvisedCMinPct?: number;

  lateStageEssentialCMinPct?: number;
  finalStageEssentialCMinPct?: number;
};

type BuildStage = "early" | "mid" | "late" | "final";

type StandardBalance = {
  assignedMarks: number;
  cMarks: number;
  aMarks: number;
  cPct: number;
  aPct: number;
  recommendedNextStandard: "C" | "A" | null;
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

function getQuestionCMarks(question: Question): number {
  const explicitCMarks = (question as Question & { cMarks?: unknown }).cMarks;

  if (typeof explicitCMarks === "number" && Number.isFinite(explicitCMarks)) {
    return Math.max(0, explicitCMarks);
  }

  if (question.standardFilter === "C") {
    return getQuestionTotalMarks(question);
  }

  if (question.standardFilter === "A") {
    return 0;
  }

  return 0;
}

function getQuestionAMarks(question: Question): number {
  const explicitAMarks = (question as Question & { aMarks?: unknown }).aMarks;

  if (typeof explicitAMarks === "number" && Number.isFinite(explicitAMarks)) {
    return Math.max(0, explicitAMarks);
  }

  if (question.standardFilter === "A") {
    return getQuestionTotalMarks(question);
  }

  if (question.standardFilter === "C") {
    return 0;
  }

  return 0;
}

function getStandardBalance(args: {
  questions: Question[];
  includedPapers: Paper[];
}): StandardBalance {
  const { questions, includedPapers } = args;

  const includedQuestions = questions.filter((q) => includedPapers.includes(q.paper));

  const assignedMarks = roundTo(
    includedQuestions.reduce((sum, q) => sum + getQuestionTotalMarks(q), 0)
  );

  const cMarks = roundTo(
    includedQuestions.reduce((sum, q) => sum + getQuestionCMarks(q), 0)
  );

  const aMarks = roundTo(
    includedQuestions.reduce((sum, q) => sum + getQuestionAMarks(q), 0)
  );

  const cPct = assignedMarks > 0 ? roundTo((cMarks / assignedMarks) * 100) : 0;
  const aPct = assignedMarks > 0 ? roundTo((aMarks / assignedMarks) * 100) : 0;

  let recommendedNextStandard: "C" | "A" | null = null;

  if (assignedMarks > 0) {
    if (aPct < 30) {
      recommendedNextStandard = "A";
    } else if (cPct < 30) {
      recommendedNextStandard = "C";
    }
  }

  return {
    assignedMarks,
    cMarks,
    aMarks,
    cPct,
    aPct,
    recommendedNextStandard,
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
  balance: StandardBalance,
  includedPapers: Paper[]
): BuilderNote {
  return {
    id: "standard-basis",
    severity: "suggestion",
    source: "standard-balance",
    rank: 1,
    message: `Standard balance basis: ${formatNumber(
      balance.assignedMarks
    )} assigned marks across ${includedPapers.join(" + ")}, with ${formatNumber(
      balance.cMarks
    )} C marks and ${formatNumber(balance.aMarks)} A marks.`,
  };
}

function buildLowANote(balance: StandardBalance, severity: "advised" | "essential"): BuilderNote {
  return {
    id: severity === "essential" ? "standard-a-essential" : "standard-a-advised",
    severity,
    source: "standard-balance",
    rank: severity === "essential" ? 95 : 70,
    message:
      severity === "essential"
        ? `A-standard coverage is currently too low. Only ${formatNumber(
            balance.aMarks
          )} marks (${formatNumber(
            balance.aPct
          )}%) are A-standard, so the paper risks being too easy overall.`
        : `A-standard coverage is currently quite low. Only ${formatNumber(
            balance.aMarks
          )} marks (${formatNumber(
            balance.aPct
          )}%) are A-standard. Consider adding a stronger A-standard question.`,
  };
}

function buildLowCNote(balance: StandardBalance, severity: "advised" | "essential"): BuilderNote {
  return {
    id: severity === "essential" ? "standard-c-essential" : "standard-c-advised",
    severity,
    source: "standard-balance",
    rank: severity === "essential" ? 95 : 70,
    message:
      severity === "essential"
        ? `C-standard coverage is currently too low. Only ${formatNumber(
            balance.cMarks
          )} marks (${formatNumber(
            balance.cPct
          )}%) are C-standard, so the paper risks losing accessible core marks.`
        : `C-standard coverage is currently quite low. Only ${formatNumber(
            balance.cMarks
          )} marks (${formatNumber(
            balance.cPct
          )}%) are C-standard. Consider adding a more accessible C-standard question.`,
  };
}

function buildRecommendationNote(
  recommendedNextStandard: "C" | "A"
): BuilderNote {
  return {
    id: "standard-recommendation",
    severity: "suggestion",
    source: "standard-balance",
    rank: 10,
    message: `Recommended next standard: ${recommendedNextStandard}.`,
  };
}

export function buildStandardBalanceNotes({
  questions,
  includedPapers = ["P1", "P2"],
  totalAssessmentMarks,

  includeBasisNote = true,
  includeRecommendationNote = true,

  earlyStageMaxAssignedPct = 25,
  midStageMaxAssignedPct = 60,
  lateStageMaxAssignedPct = 85,

  midStageAdvisedAMinPct = 15,
  lateStageAdvisedAMinPct = 20,
  finalStageAdvisedAMinPct = 25,

  lateStageEssentialAMinPct = 10,
  finalStageEssentialAMinPct = 15,

  midStageAdvisedCMinPct = 15,
  lateStageAdvisedCMinPct = 20,
  finalStageAdvisedCMinPct = 25,

  lateStageEssentialCMinPct = 10,
  finalStageEssentialCMinPct = 15,
}: BuildStandardBalanceNotesArgs): BuilderNote[] {
  const notes: BuilderNote[] = [];

  const balance = getStandardBalance({
    questions,
    includedPapers,
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

  if (stage === "mid") {
    if (balance.aPct < midStageAdvisedAMinPct) {
      notes.push(buildLowANote(balance, "advised"));
    }
    if (balance.cPct < midStageAdvisedCMinPct) {
      notes.push(buildLowCNote(balance, "advised"));
    }
  }

  if (stage === "late") {
    if (balance.aPct < lateStageEssentialAMinPct) {
      notes.push(buildLowANote(balance, "essential"));
    } else if (balance.aPct < lateStageAdvisedAMinPct) {
      notes.push(buildLowANote(balance, "advised"));
    }

    if (balance.cPct < lateStageEssentialCMinPct) {
      notes.push(buildLowCNote(balance, "essential"));
    } else if (balance.cPct < lateStageAdvisedCMinPct) {
      notes.push(buildLowCNote(balance, "advised"));
    }
  }

  if (stage === "final") {
    if (balance.aPct < finalStageEssentialAMinPct) {
      notes.push(buildLowANote(balance, "essential"));
    } else if (balance.aPct < finalStageAdvisedAMinPct) {
      notes.push(buildLowANote(balance, "advised"));
    }

    if (balance.cPct < finalStageEssentialCMinPct) {
      notes.push(buildLowCNote(balance, "essential"));
    } else if (balance.cPct < finalStageAdvisedCMinPct) {
      notes.push(buildLowCNote(balance, "advised"));
    }
  }

  if (
    includeRecommendationNote &&
    balance.recommendedNextStandard &&
    balance.assignedMarks > 0
  ) {
    notes.push(buildRecommendationNote(balance.recommendedNextStandard));
  }

  return notes;
}