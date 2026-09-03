import {
  findSkillEvidenceByAnswerId,
  validateSkillCorpusSummaryCoverage,
} from "../../SkillCatalogTypes";
import { A8_CORPUS_ENTRIES } from "./A8CrossCorpusAnalysis";
import { A8_HISTORICAL_EVIDENCE } from "./HistoricalEvidence";

const answerIds = A8_CORPUS_ENTRIES.map((entry) => entry.id);
validateSkillCorpusSummaryCoverage(A8_HISTORICAL_EVIDENCE, answerIds);

for (const summary of A8_CORPUS_ENTRIES) {
  const evidence = findSkillEvidenceByAnswerId(
    A8_HISTORICAL_EVIDENCE,
    summary.id,
  );

  const mismatches = [
    summary.year !== evidence.question.identity.year && "year",
    summary.paper !== evidence.question.identity.paper && "paper",
    summary.questionNumber !== evidence.question.identity.questionNumber && "question number",
    summary.totalMarks !== evidence.answer.sourceContext.totalMarks && "mark tariff",
  ].filter(Boolean);

  if (mismatches.length) {
    throw new Error(
      `A8 SkillCatalog summary drift for ${summary.id}: ${mismatches.join(", ")}.`,
    );
  }
}

/** Reaching this export means the curated A8 synthesis matches the imported historical bank. */
export const A8_HISTORICAL_EVIDENCE_VALIDATED = true as const;
