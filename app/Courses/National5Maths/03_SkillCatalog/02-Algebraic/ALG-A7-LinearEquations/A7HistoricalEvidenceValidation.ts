import {
  findSkillEvidenceByAnswerId,
  validateSkillCorpusSummaryCoverage,
} from "../../SkillCatalogTypes";
import { A7_CORPUS_ENTRIES } from "./A7CrossCorpusAnalysis";
import { A7_HISTORICAL_EVIDENCE } from "./HistoricalEvidence";

const answerIds = A7_CORPUS_ENTRIES.map((entry) => entry.sourceAnswerId);
validateSkillCorpusSummaryCoverage(A7_HISTORICAL_EVIDENCE, answerIds);

for (const summary of A7_CORPUS_ENTRIES) {
  const evidence = findSkillEvidenceByAnswerId(
    A7_HISTORICAL_EVIDENCE,
    summary.sourceAnswerId,
  );

  const mismatches = [
    summary.sourceQuestionId !== evidence.question.identity.id && "question ID",
    summary.year !== evidence.question.identity.year && "year",
    summary.paper !== evidence.question.identity.paper && "paper",
    summary.questionNumber !== evidence.question.identity.questionNumber && "question number",
    summary.totalMarks !== evidence.answer.sourceContext.totalMarks && "mark tariff",
  ].filter(Boolean);

  if (mismatches.length) {
    throw new Error(
      `A7 SkillCatalog summary drift for ${summary.sourceAnswerId}: ${mismatches.join(", ")}.`,
    );
  }
}

/** Reaching this export means the curated A7 synthesis matches the imported historical bank. */
export const A7_HISTORICAL_EVIDENCE_VALIDATED = true as const;
