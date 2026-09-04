import {
  findSkillEvidenceByAnswerId,
  validateSkillCorpusSummaryCoverage,
} from "../../SkillCatalogTypes";
import {
  N2_CORPUS_ENTRIES,
  type N2CorpusFamily,
  type N2QuestionStandardProfile,
} from "./N2CrossCorpusAnalysis";
import { N2_HISTORICAL_EVIDENCE } from "./HistoricalEvidence";

const familyIdByFamily: Record<N2CorpusFamily, string> = {
  FRACTIONAL_INDEX_EVALUATION: "NUM_N2_FRACTIONAL_INDEX_EVALUATION",
  BRACKETED_INDEX_LAWS: "NUM_N2_BRACKETED_INDEX_LAWS",
  MULTI_LAW_SIMPLIFICATION: "NUM_N2_MULTI_LAW_SIMPLIFICATION",
};

const deriveStandardProfile = (marks: readonly ("C" | "A")[]): N2QuestionStandardProfile => {
  const hasC = marks.includes("C");
  const hasA = marks.includes("A");
  if (hasC && hasA) return "C+A";
  return hasA ? "A" : "C";
};

const answerIds = N2_CORPUS_ENTRIES.map((entry) => entry.sourceAnswerId);
validateSkillCorpusSummaryCoverage(N2_HISTORICAL_EVIDENCE, answerIds);

for (const summary of N2_CORPUS_ENTRIES) {
  const evidence = findSkillEvidenceByAnswerId(
    N2_HISTORICAL_EVIDENCE,
    summary.sourceAnswerId,
  );

  const derivedStandardProfile = deriveStandardProfile(summary.standardMarks);
  const mismatches = [
    summary.sourceQuestionId !== evidence.question.identity.id && "question ID",
    summary.year !== evidence.question.identity.year && "year",
    summary.paper !== evidence.question.identity.paper && "paper",
    summary.questionNumber !== evidence.question.identity.questionNumber && "question number",
    summary.totalMarks !== evidence.answer.sourceContext.totalMarks && "mark tariff",
    summary.totalMarks !== evidence.question.structure.totalMarks && "question tariff",
    summary.questionFamilyId !== evidence.question.family.familyId && "question family ID",
    summary.questionFamilyId !== familyIdByFamily[summary.family] && "family mapping",
    summary.standardProfile !== evidence.question.curriculum.standardProfile && "question standard profile",
    summary.standardProfile !== derivedStandardProfile && "mark-standard summary",
    summary.standardMarks.length !== summary.totalMarks && "mark-standard count",
    summary.thinking !== evidence.question.curriculum.thinkingProfile && "thinking profile",
    summary.correctAnswerWithoutWorking !== evidence.answer.workingPolicy.correctAnswerWithoutWorking.treatment && "answer-only treatment",
    summary.positivePowerOutputRequired !== evidence.question.answerSpecification.positivePowersRequired && "positive-power output requirement",
  ].filter(Boolean);

  if (mismatches.length) {
    throw new Error(
      `N2 SkillCatalog summary drift for ${summary.sourceAnswerId}: ${mismatches.join(", ")}.`,
    );
  }
}

const totalMarks = N2_CORPUS_ENTRIES.reduce((sum, entry) => sum + entry.totalMarks, 0);
const cMarks = N2_CORPUS_ENTRIES.flatMap((entry) => entry.standardMarks).filter((mark) => mark === "C").length;
const aMarks = N2_CORPUS_ENTRIES.flatMap((entry) => entry.standardMarks).filter((mark) => mark === "A").length;
const reasoningEntries = N2_CORPUS_ENTRIES.filter((entry) => entry.thinking !== "OPERATIONAL");

if (N2_CORPUS_ENTRIES.length !== 11 || totalMarks !== 28 || cMarks !== 12 || aMarks !== 16 || reasoningEntries.length !== 0) {
  throw new Error(
    `N2 SkillCatalog corpus totals drifted: entries=${N2_CORPUS_ENTRIES.length}, marks=${totalMarks}, C=${cMarks}, A=${aMarks}, nonOperational=${reasoningEntries.length}.`,
  );
}

/** Reaching this export means the curated N2 synthesis matches the imported historical bank. */
export const N2_HISTORICAL_EVIDENCE_VALIDATED = true as const;
