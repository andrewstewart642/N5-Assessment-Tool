import type {
  N5HistoricQuestionRecord,
  N5Paper,
} from "./N5HistoricQuestionTypes";
import {
  getAllN5HistoricQuestions,
  getN5HistoricQuestionsByAnySkill,
  getN5HistoricQuestionsByConcept,
  getN5HistoricQuestionsByPaper,
  getN5HistoricQuestionsByPrimarySkill,
} from "./N5HistoricQuestionQueries";

export type N5StandardBreakdown = {
  cOnlyCount: number;
  aOnlyCount: number;
  mixedCount: number;
};

export type N5ThinkingBreakdown = {
  operationalOnlyCount: number;
  reasoningOnlyCount: number;
  mixedThinkingCount: number;
};

export type N5MarksBreakdownSummary = {
  totalMarks: number;
  cMarks: number;
  aMarks: number;
  operationalMarks: number;
  reasoningMarks: number;
  totalThinkingMarks: number;
};

export type N5HistoricQuestionAnalysisSummary = {
  totalQuestions: number;
  years: number[];
  papers: N5Paper[];
  questionLabels: string[];
  concepts: string[];
  primarySkillCodes: string[];
  supportingSkillCodes: string[];
  allSkillCodes: string[];
  totalMarksSeen: number[];
  averageTotalMarks: number;
  averageEstimatedHeightPx: number | null;
  standardBreakdown: N5StandardBreakdown;
  thinkingBreakdown: N5ThinkingBreakdown;
  marksSummary: N5MarksBreakdownSummary;
  supportingSkillAppearanceCount: number;
  primarySkillAppearanceCount: number;
};

function isCOnlyQuestion(question: N5HistoricQuestionRecord): boolean {
  return question.cMarks > 0 && question.aMarks === 0;
}

function isAOnlyQuestion(question: N5HistoricQuestionRecord): boolean {
  return question.aMarks > 0 && question.cMarks === 0;
}

function isMixedStandardQuestion(question: N5HistoricQuestionRecord): boolean {
  return question.aMarks > 0 && question.cMarks > 0;
}

function isOperationalOnlyQuestion(question: N5HistoricQuestionRecord): boolean {
  return question.operationalMarks > 0 && question.reasoningMarks === 0;
}

function isReasoningOnlyQuestion(question: N5HistoricQuestionRecord): boolean {
  return question.reasoningMarks > 0 && question.operationalMarks === 0;
}

function isMixedThinkingQuestion(question: N5HistoricQuestionRecord): boolean {
  return question.operationalMarks > 0 && question.reasoningMarks > 0;
}

function getUniqueSortedNumbers(values: number[]): number[] {
  return [...new Set(values)].sort((a, b) => a - b);
}

function getUniqueSortedStrings(values: string[]): string[] {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b));
}

function buildAnalysisSummary(
  questions: N5HistoricQuestionRecord[],
  focusSkillCode?: string,
): N5HistoricQuestionAnalysisSummary {
  const totalQuestions = questions.length;

  const years = getUniqueSortedNumbers(
    questions.map((question: N5HistoricQuestionRecord) => question.year),
  );

  const papers = getUniqueSortedStrings(
    questions.map((question: N5HistoricQuestionRecord) => question.paper),
  ) as N5Paper[];

  const questionLabels = getUniqueSortedStrings(
    questions.map(
      (question: N5HistoricQuestionRecord) => question.displayLabel,
    ),
  );

  const concepts = getUniqueSortedStrings(
    questions.map((question: N5HistoricQuestionRecord) => question.concept),
  );

  const primarySkillCodes = getUniqueSortedStrings(
    questions.map(
      (question: N5HistoricQuestionRecord) => question.primarySkillCode,
    ),
  );

  const supportingSkillCodes = getUniqueSortedStrings(
    questions.flatMap(
      (question: N5HistoricQuestionRecord) => question.supportingSkillCodes,
    ),
  );

  const allSkillCodes = getUniqueSortedStrings(
    questions.flatMap(
      (question: N5HistoricQuestionRecord) => question.allSkillCodes,
    ),
  );

  const totalMarksSeen = getUniqueSortedNumbers(
    questions.map((question: N5HistoricQuestionRecord) => question.totalMarks),
  );

  const marksSummary = questions.reduce<N5MarksBreakdownSummary>(
    (
      summary: N5MarksBreakdownSummary,
      question: N5HistoricQuestionRecord,
    ) => {
      summary.totalMarks += question.totalMarks;
      summary.cMarks += question.cMarks;
      summary.aMarks += question.aMarks;
      summary.operationalMarks += question.operationalMarks;
      summary.reasoningMarks += question.reasoningMarks;
      summary.totalThinkingMarks += question.totalThinkingMarks;
      return summary;
    },
    {
      totalMarks: 0,
      cMarks: 0,
      aMarks: 0,
      operationalMarks: 0,
      reasoningMarks: 0,
      totalThinkingMarks: 0,
    },
  );

  const standardBreakdown: N5StandardBreakdown = {
    cOnlyCount: questions.filter(isCOnlyQuestion).length,
    aOnlyCount: questions.filter(isAOnlyQuestion).length,
    mixedCount: questions.filter(isMixedStandardQuestion).length,
  };

  const thinkingBreakdown: N5ThinkingBreakdown = {
    operationalOnlyCount: questions.filter(isOperationalOnlyQuestion).length,
    reasoningOnlyCount: questions.filter(isReasoningOnlyQuestion).length,
    mixedThinkingCount: questions.filter(isMixedThinkingQuestion).length,
  };

  const measuredHeights = questions
    .map(
      (question: N5HistoricQuestionRecord) => question.estimatedHeightPx,
    )
    .filter((height: number | null): height is number => height !== null);

  const averageEstimatedHeightPx =
    measuredHeights.length > 0
      ? measuredHeights.reduce(
          (sum: number, height: number) => sum + height,
          0,
        ) / measuredHeights.length
      : null;

  const averageTotalMarks =
    totalQuestions > 0 ? marksSummary.totalMarks / totalQuestions : 0;

  const supportingSkillAppearanceCount =
    focusSkillCode === undefined
      ? 0
      : questions.filter((question: N5HistoricQuestionRecord) =>
          question.supportingSkillCodes.includes(focusSkillCode),
        ).length;

  const primarySkillAppearanceCount =
    focusSkillCode === undefined
      ? 0
      : questions.filter(
          (question: N5HistoricQuestionRecord) =>
            question.primarySkillCode === focusSkillCode,
        ).length;

  return {
    totalQuestions,
    years,
    papers,
    questionLabels,
    concepts,
    primarySkillCodes,
    supportingSkillCodes,
    allSkillCodes,
    totalMarksSeen,
    averageTotalMarks,
    averageEstimatedHeightPx,
    standardBreakdown,
    thinkingBreakdown,
    marksSummary,
    supportingSkillAppearanceCount,
    primarySkillAppearanceCount,
  };
}

export function getN5SkillAnalysis(
  skillCode: string,
): N5HistoricQuestionAnalysisSummary {
  const questions = getN5HistoricQuestionsByAnySkill(skillCode);
  return buildAnalysisSummary(questions, skillCode);
}

export function getN5PrimarySkillAnalysis(
  skillCode: string,
): N5HistoricQuestionAnalysisSummary {
  const questions = getN5HistoricQuestionsByPrimarySkill(skillCode);
  return buildAnalysisSummary(questions, skillCode);
}

export function getN5ConceptAnalysis(
  concept: string,
): N5HistoricQuestionAnalysisSummary {
  const questions = getN5HistoricQuestionsByConcept(concept);
  return buildAnalysisSummary(questions);
}

export function getN5PaperAnalysis(
  paper: N5Paper,
): N5HistoricQuestionAnalysisSummary {
  const questions = getN5HistoricQuestionsByPaper(paper);
  return buildAnalysisSummary(questions);
}

export function getN5FullHistoricAnalysis(): N5HistoricQuestionAnalysisSummary {
  const questions = getAllN5HistoricQuestions();
  return buildAnalysisSummary(questions);
}