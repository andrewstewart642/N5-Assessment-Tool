import {
  findSkillEvidenceByAnswerId,
  validateSkillCorpusSummaryCoverage,
} from "../../SkillCatalogTypes";
import {
  G1_CORPUS_ENTRIES,
  G1_EMBEDDED_S2_SKILL_ID,
  G1_SKILL_ID,
} from "./G1CrossCorpusAnalysis";
import { G1_HISTORICAL_EVIDENCE } from "./HistoricalEvidence";

const answerIds = G1_CORPUS_ENTRIES.map((entry) => entry.sourceAnswerId);
validateSkillCorpusSummaryCoverage(G1_HISTORICAL_EVIDENCE, answerIds);

for (const summary of G1_CORPUS_ENTRIES) {
  const evidence = findSkillEvidenceByAnswerId(
    G1_HISTORICAL_EVIDENCE,
    summary.sourceAnswerId,
  );

  const g1MarkCount = evidence.answer.markNodes
    .filter((mark) => mark.skillIds.includes(G1_SKILL_ID))
    .reduce((total, mark) => total + mark.markValue, 0);

  const s2MarkCount = evidence.answer.markNodes
    .filter((mark) => mark.skillIds.includes(G1_EMBEDDED_S2_SKILL_ID))
    .reduce((total, mark) => total + mark.markValue, 0);

  const g1Parts = evidence.question.structure.parts.filter(
    (part) => part.primarySkillId === G1_SKILL_ID,
  );
  const s2Parts = evidence.question.structure.parts.filter(
    (part) => part.primarySkillId === G1_EMBEDDED_S2_SKILL_ID,
  );

  const primaryAnswer = evidence.answer.expectedResponse.canonicalAnswers[0]?.normalisedAnswer ?? null;

  const mismatches = [
    summary.sourceQuestionId !== evidence.question.identity.id && "question ID",
    summary.year !== evidence.question.identity.year && "year",
    summary.paper !== evidence.question.identity.paper && "paper",
    summary.questionNumber !== evidence.question.identity.questionNumber && "question number",
    summary.totalMarks !== evidence.answer.sourceContext.totalMarks && "mark tariff",
    summary.catalogFamilyId !== evidence.question.family.familyId && "family ID",
    !evidence.question.family.surfaceStyleIds.includes(summary.surfaceStyleId) && "surface style",
    summary.g1Marks !== g1MarkCount && "G1 mark ownership",
    summary.embeddedS2Marks !== s2MarkCount && "S2 mark ownership",
    g1Parts.some((part) => part.standardProfile !== summary.g1Standard) && "G1 Standard",
    g1Parts.some((part) => part.thinkingProfile !== summary.g1Thinking) && "G1 thinking",
    summary.embeddedS2Marks === 1 && s2Parts.length !== 1 && "S2 part count",
    summary.embeddedS2Marks === 1 && s2Parts.some((part) => part.standardProfile !== "C") && "S2 Standard",
    summary.embeddedS2Marks === 1 && s2Parts.some((part) => part.thinkingProfile !== "REASONING") && "S2 thinking",
    summary.expectedPrimaryAnswer !== primaryAnswer && "primary answer",
  ].filter(Boolean);

  if (mismatches.length) {
    throw new Error(
      `G1 SkillCatalog summary drift for ${summary.sourceAnswerId}: ${mismatches.join(", ")}.`,
    );
  }
}

/** Reaching this export means the curated G1 synthesis matches the imported historical bank. */
export const G1_HISTORICAL_EVIDENCE_VALIDATED = true as const;
