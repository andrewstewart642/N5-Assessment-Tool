import type { ExamQuestionCatalogEntry } from "./ExamQuestionTypes";

export type ExamQuestionFrequencyRow = {
  id: string;
  count: number;
  percentage: number;
};

function buildFrequencyRows(values: string[]): ExamQuestionFrequencyRow[] {
  const counts = new Map<string, number>();

  for (const value of values) {
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }

  const total = values.length || 1;

  return [...counts.entries()]
    .map(([id, count]) => ({
      id,
      count,
      percentage: count / total,
    }))
    .sort((a, b) => b.count - a.count || a.id.localeCompare(b.id));
}

export function getExamQuestionsForFamily(
  catalog: ExamQuestionCatalogEntry[],
  familyId: string
): ExamQuestionCatalogEntry[] {
  return catalog.filter((question) => question.familyId === familyId);
}

export function analyseExamQuestionFamily(
  catalog: ExamQuestionCatalogEntry[],
  familyId: string
) {
  const questions = getExamQuestionsForFamily(catalog, familyId);

  return {
    familyId,
    sourceQuestionCount: questions.length,

    years: questions
      .map((question) => question.year)
      .filter((year): year is number => typeof year === "number")
      .sort((a, b) => a - b),

    questionNumbers: buildFrequencyRows(
      questions.map((question) => `Q${question.questionNumber}`)
    ),

    operationFrequencies: buildFrequencyRows(
      questions.map((question) => question.operationType ?? "UNKNOWN")
    ),

    surfaceStyleFrequencies: buildFrequencyRows(
      questions.map((question) => question.surfaceStyleId)
    ),

    simplificationVisibilityFrequencies: buildFrequencyRows(
      questions.map(
        (question) =>
          question.numberProfile?.simplificationVisibility ?? "UNKNOWN"
      )
    ),

    cancellationStyleFrequencies: buildFrequencyRows(
      questions.map(
        (question) => question.numberProfile?.cancellationStyle ?? "UNKNOWN"
      )
    ),

    finalAnswerTypeFrequencies: buildFrequencyRows(
      questions.map(
        (question) => question.numberProfile?.finalAnswerType ?? "UNKNOWN"
      )
    ),

    answerSpaceMm: questions
      .map((question) => question.answerSpace.sourceMeasurement?.heightMm)
      .filter((value): value is number => typeof value === "number"),
  };
}