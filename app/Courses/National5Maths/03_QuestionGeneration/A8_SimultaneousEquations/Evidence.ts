import {
  A8_CORPUS_ENTRIES,
  A8_CROSS_CORPUS_GENERATION_INVARIANTS,
  A8_FAMILY_COMPARISONS,
} from "../../02_AnswerCatalog/A8_SimultaneousEquations/A8CrossCorpusAnalysis";
import {
  A8_CALIBRATION_DECISIONS,
  A8_DEFAULT_DIFFICULTY_LEVEL,
  A8_DIFFICULTY_BANDS,
  A8_DIFFICULTY_SUPPORT_BY_FAMILY,
  A8_EMPIRICAL_FAMILY_FREQUENCY,
  A8_HISTORICAL_ROUTE_FINGERPRINTS,
  A8_HISTORICAL_SYSTEM_SIGNATURES,
  A8_PAPER_NUMERICAL_CALIBRATION,
  A8_SUPPORTED_DIFFICULTY_LEVELS,
} from "../../02_AnswerCatalog/A8_SimultaneousEquations/A8CrossCorpusCalibration";
import type { A8GeneratorFamily, A8GeneratorPaper } from "./Types";

export const A8_GENERATOR_SOURCE_IDS = A8_CORPUS_ENTRIES.map((entry) => entry.id.replace(/_MS$/, ""));
export const A8_ANSWER_SOURCE_IDS = A8_CORPUS_ENTRIES.map((entry) => entry.id);

export const A8_GENERATOR_INVARIANTS = [...A8_CROSS_CORPUS_GENERATION_INVARIANTS] as const;

/**
 * Generation consumes the dedicated cross-corpus calibration rather than
 * inventing a fixed course-wide difficulty ladder. A8 currently supports
 * exactly three evidence-derived levels; another skill may support a different
 * count after its own calibration pass.
 */
export {
  A8_CALIBRATION_DECISIONS,
  A8_DEFAULT_DIFFICULTY_LEVEL,
  A8_DIFFICULTY_BANDS,
  A8_DIFFICULTY_SUPPORT_BY_FAMILY,
  A8_EMPIRICAL_FAMILY_FREQUENCY,
  A8_HISTORICAL_ROUTE_FINGERPRINTS,
  A8_HISTORICAL_SYSTEM_SIGNATURES,
  A8_PAPER_NUMERICAL_CALIBRATION,
  A8_SUPPORTED_DIFFICULTY_LEVELS,
};

export const A8_GENERATOR_FAMILY_EVIDENCE: Record<A8GeneratorFamily, {
  questionCatalogIds: string[];
  answerCatalogIds: string[];
  evidenceCount: number;
  readiness: "CORE" | "EXPERIMENTAL";
  supportedPapers: A8GeneratorPaper[];
  rationale: string;
}> = Object.fromEntries(
  A8_FAMILY_COMPARISONS.map((comparison) => {
    const entries = A8_CORPUS_ENTRIES.filter((entry) => entry.surfaceFamily === comparison.family);
    return [comparison.family, {
      questionCatalogIds: entries.map((entry) => entry.id.replace(/_MS$/, "")),
      answerCatalogIds: entries.map((entry) => entry.id),
      evidenceCount: entries.length,
      readiness: entries.length >= 3 ? "CORE" : "EXPERIMENTAL",
      supportedPapers: [...new Set(entries.map((entry) => entry.paper))] as A8GeneratorPaper[],
      rationale: comparison.generatorDecision,
    }];
  }),
) as Record<A8GeneratorFamily, {
  questionCatalogIds: string[];
  answerCatalogIds: string[];
  evidenceCount: number;
  readiness: "CORE" | "EXPERIMENTAL";
  supportedPapers: A8GeneratorPaper[];
  rationale: string;
}>;
