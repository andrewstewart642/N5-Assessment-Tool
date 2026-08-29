import {
  A8_CORPUS_ENTRIES,
  A8_CROSS_CORPUS_GENERATION_INVARIANTS,
  A8_FAMILY_COMPARISONS,
} from "../../02_AnswerCatalog/A8_SimultaneousEquations/A8CrossCorpusAnalysis";
import type { A8GeneratorFamily, A8GeneratorPaper } from "./Types";

export const A8_GENERATOR_SOURCE_IDS = A8_CORPUS_ENTRIES.map((entry) => entry.id.replace(/_MS$/, ""));
export const A8_ANSWER_SOURCE_IDS = A8_CORPUS_ENTRIES.map((entry) => entry.id);

export const A8_GENERATOR_INVARIANTS = [...A8_CROSS_CORPUS_GENERATION_INVARIANTS] as const;

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
