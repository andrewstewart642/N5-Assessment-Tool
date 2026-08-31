import {
  A7_CROSS_CORPUS_GENERATION_INVARIANTS,
  A7_GENERATOR_SCOPE,
} from "../../../02_AnswerCatalog/A7_LinearEquations/A7CrossCorpusAnalysis";
import {
  A7_ABSTRACT_CALIBRATION_ENVELOPE,
  A7_ABSTRACT_EQUATION_FINGERPRINTS,
  A7_CALIBRATION_DECISIONS,
  A7_CONTEXT_AREA_FINGERPRINTS,
  A7_CONTEXT_CALIBRATION_ENVELOPE,
  A7_EMPIRICAL_FAMILY_FREQUENCY,
} from "../../../02_AnswerCatalog/A7_LinearEquations/A7CrossCorpusCalibration";
import type { A7GeneratorFamily } from "./Types";

export const A7_GENERATOR_INVARIANTS = A7_CROSS_CORPUS_GENERATION_INVARIANTS;
export const A7_GENERATOR_DECISIONS = A7_CALIBRATION_DECISIONS;
export const A7_GENERATOR_ABSTRACT_ENVELOPE = A7_ABSTRACT_CALIBRATION_ENVELOPE;
export const A7_GENERATOR_CONTEXT_ENVELOPE = A7_CONTEXT_CALIBRATION_ENVELOPE;
export const A7_GENERATOR_FREQUENCY = A7_EMPIRICAL_FAMILY_FREQUENCY;
export const A7_GENERATOR_ABSTRACT_FINGERPRINTS = A7_ABSTRACT_EQUATION_FINGERPRINTS;
export const A7_GENERATOR_CONTEXT_FINGERPRINTS = A7_CONTEXT_AREA_FINGERPRINTS;

export const A7_GENERATOR_FAMILY_EVIDENCE: Record<A7GeneratorFamily, {
  readiness: "CORE" | "EXPERIMENTAL";
  evidenceCount: number;
  supportedPapers: readonly ("P1" | "P2")[];
  marks: 3 | 5;
  standard: "A";
  thinking: "OPERATIONAL" | "REASONING";
  questionCatalogIds: string[];
  answerCatalogIds: string[];
}> = {
  FRACTIONAL_COEFFICIENT: {
    readiness: A7_GENERATOR_SCOPE[0].readiness,
    evidenceCount: A7_GENERATOR_SCOPE[0].evidenceCount,
    supportedPapers: A7_GENERATOR_SCOPE[0].supportedPapers,
    marks: A7_GENERATOR_SCOPE[0].marks,
    standard: A7_GENERATOR_SCOPE[0].standard,
    thinking: A7_GENERATOR_SCOPE[0].thinking,
    questionCatalogIds: A7_ABSTRACT_EQUATION_FINGERPRINTS.map((entry) => entry.sourceQuestionId),
    answerCatalogIds: A7_ABSTRACT_EQUATION_FINGERPRINTS.map((entry) => entry.sourceAnswerId),
  },
  CONTEXT_AREA_EQUALITY: {
    readiness: A7_GENERATOR_SCOPE[1].readiness,
    evidenceCount: A7_GENERATOR_SCOPE[1].evidenceCount,
    supportedPapers: A7_GENERATOR_SCOPE[1].supportedPapers,
    marks: A7_GENERATOR_SCOPE[1].marks,
    standard: A7_GENERATOR_SCOPE[1].standard,
    thinking: A7_GENERATOR_SCOPE[1].thinking,
    questionCatalogIds: A7_CONTEXT_AREA_FINGERPRINTS.map((entry) => entry.sourceQuestionId),
    answerCatalogIds: A7_CONTEXT_AREA_FINGERPRINTS.map((entry) => entry.sourceAnswerId),
  },
};
