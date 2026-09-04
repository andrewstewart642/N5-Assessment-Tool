import {
  N2_CORPUS_ENTRIES,
  N2_CROSS_CORPUS_GENERATION_INVARIANTS,
  N2_GENERATOR_SCOPE,
} from "../../../03_SkillCatalog/01-Numerical/NUM-N2-Indices/N2CrossCorpusAnalysis";
import {
  N2_CALIBRATION_DECISIONS,
  N2_EMPIRICAL_FAMILY_FREQUENCY,
  N2_EMPIRICAL_TARIFF_AND_CLASSIFICATION,
  N2_FRACTIONAL_EVALUATION_FINGERPRINTS,
  N2_FRACTIONAL_GENERATION_ENVELOPE,
  N2_SYMBOLIC_FINGERPRINTS,
  N2_SYMBOLIC_GENERATION_ENVELOPE,
} from "../../../03_SkillCatalog/01-Numerical/NUM-N2-Indices/N2CrossCorpusCalibration";
import {
  N2_DIFFICULTY_ANCHORS,
  N2_DIFFICULTY_BANDS,
  N2_DIFFICULTY_LEVERS,
  N2_DIFFICULTY_SCORING_RULES,
} from "../../../03_SkillCatalog/01-Numerical/NUM-N2-Indices/N2DifficultyCalibration";
import {
  N2_HISTORICAL_EVIDENCE_VALIDATED,
} from "../../../03_SkillCatalog/01-Numerical/NUM-N2-Indices/N2HistoricalEvidenceValidation";
import {
  N2_BRACKETED_SURFACE_GUARDRAILS,
  N2_FRACTIONAL_SURFACE_GUARDRAILS,
  N2_GENERAL_SURFACE_GUARDRAILS,
  N2_MULTI_LAW_SURFACE_GUARDRAILS,
  N2_SURFACE_EVIDENCE,
} from "../../../03_SkillCatalog/01-Numerical/NUM-N2-Indices/N2SurfaceCalibration";
import type {
  N2GeneratorFamily,
  N2GeneratorFamilyReadiness,
  N2GeneratorPaper,
  N2GeneratorStandardProfile,
} from "./Types";

export const N2_GENERATOR_EVIDENCE_VALIDATED = N2_HISTORICAL_EVIDENCE_VALIDATED;
export const N2_GENERATOR_CORPUS = N2_CORPUS_ENTRIES;
export const N2_GENERATOR_INVARIANTS = N2_CROSS_CORPUS_GENERATION_INVARIANTS;
export const N2_GENERATOR_DECISIONS = N2_CALIBRATION_DECISIONS;
export const N2_GENERATOR_FREQUENCY = N2_EMPIRICAL_FAMILY_FREQUENCY;
export const N2_GENERATOR_TARIFF_CLASSIFICATION = N2_EMPIRICAL_TARIFF_AND_CLASSIFICATION;
export const N2_GENERATOR_FRACTIONAL_FINGERPRINTS = N2_FRACTIONAL_EVALUATION_FINGERPRINTS;
export const N2_GENERATOR_SYMBOLIC_FINGERPRINTS = N2_SYMBOLIC_FINGERPRINTS;
export const N2_GENERATOR_FRACTIONAL_ENVELOPE = N2_FRACTIONAL_GENERATION_ENVELOPE;
export const N2_GENERATOR_SYMBOLIC_ENVELOPE = N2_SYMBOLIC_GENERATION_ENVELOPE;
export const N2_GENERATOR_DIFFICULTY_ANCHORS = N2_DIFFICULTY_ANCHORS;
export const N2_GENERATOR_DIFFICULTY_BANDS = N2_DIFFICULTY_BANDS;
export const N2_GENERATOR_DIFFICULTY_LEVERS = N2_DIFFICULTY_LEVERS;
export const N2_GENERATOR_DIFFICULTY_RULES = N2_DIFFICULTY_SCORING_RULES;
export const N2_GENERATOR_SURFACE_EVIDENCE = N2_SURFACE_EVIDENCE;
export const N2_GENERATOR_GENERAL_SURFACE_GUARDRAILS = N2_GENERAL_SURFACE_GUARDRAILS;
export const N2_GENERATOR_FRACTIONAL_SURFACE_GUARDRAILS = N2_FRACTIONAL_SURFACE_GUARDRAILS;
export const N2_GENERATOR_BRACKETED_SURFACE_GUARDRAILS = N2_BRACKETED_SURFACE_GUARDRAILS;
export const N2_GENERATOR_MULTI_LAW_SURFACE_GUARDRAILS = N2_MULTI_LAW_SURFACE_GUARDRAILS;

type FamilyEvidence = {
  readiness: N2GeneratorFamilyReadiness;
  evidenceCount: number;
  supportedPapers: readonly N2GeneratorPaper[];
  supportedMarks: readonly (2 | 3)[];
  observedStandardProfiles: readonly N2GeneratorStandardProfile[];
  thinking: "OPERATIONAL";
  questionCatalogIds: string[];
  answerCatalogIds: string[];
};

const scopeFor = (family: N2GeneratorFamily) => {
  const scope = N2_GENERATOR_SCOPE.find((entry) => entry.family === family);
  if (!scope) throw new Error(`Missing N2 SkillCatalog generator scope for ${family}.`);
  return scope;
};

const familyEvidence = (family: N2GeneratorFamily): FamilyEvidence => {
  const scope = scopeFor(family);
  const entries = N2_CORPUS_ENTRIES.filter((entry) => entry.family === family);
  return {
    readiness: scope.readiness,
    evidenceCount: scope.evidenceCount,
    supportedPapers: scope.supportedPapers,
    supportedMarks: scope.supportedMarks,
    observedStandardProfiles: scope.observedStandardProfiles,
    thinking: scope.thinking,
    questionCatalogIds: entries.map((entry) => entry.sourceQuestionId),
    answerCatalogIds: entries.map((entry) => entry.sourceAnswerId),
  };
};

export const N2_GENERATOR_FAMILY_EVIDENCE: Record<N2GeneratorFamily, FamilyEvidence> = {
  FRACTIONAL_INDEX_EVALUATION: familyEvidence("FRACTIONAL_INDEX_EVALUATION"),
  BRACKETED_INDEX_LAWS: familyEvidence("BRACKETED_INDEX_LAWS"),
  MULTI_LAW_SIMPLIFICATION: familyEvidence("MULTI_LAW_SIMPLIFICATION"),
};
