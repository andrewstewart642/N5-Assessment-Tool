import type { HistoricalQuestionReferenceProfile } from "../../../CatalogCoreTypes";
import {
  A7_GENERATOR_ABSTRACT_FINGERPRINTS,
  A7_GENERATOR_FAMILY_EVIDENCE,
  A7_GENERATOR_FREQUENCY,
} from "./Evidence";
import type {
  A7FractionalEquationState,
  A7GeneratorFamily,
  A7GeneratorPaper,
} from "./Types";

const positiveModulo = (value: number, modulus: number) => ((value % modulus) + modulus) % modulus;
const gcd = (a: number, b: number): number => b === 0 ? Math.abs(a) : gcd(b, a % b);

const vectorGcd = (values: readonly number[]) =>
  values.reduce((current, value) => gcd(current, Math.abs(Math.round(value))), 0) || 1;

const normaliseDisplayedEquation = (values: readonly number[]) => {
  const divisor = vectorGcd(values);
  const reduced = values.map((value) => value / divisor);
  const firstNonZero = reduced.find((value) => value !== 0) ?? 1;
  return firstNonZero < 0 ? reduced.map((value) => -value) : reduced;
};

const sameVector = (first: readonly number[], second: readonly number[]) =>
  first.length === second.length && first.every((value, index) => value === second[index]);

export const chooseA7Paper = (
  seed: number,
  requestedFamily?: A7GeneratorFamily,
  requestedPaper?: A7GeneratorPaper,
): A7GeneratorPaper => {
  if (requestedPaper) {
    if (requestedFamily && !A7_GENERATOR_FAMILY_EVIDENCE[requestedFamily].supportedPapers.includes(requestedPaper)) {
      throw new Error(`${requestedFamily} is not supported on ${requestedPaper} by the reviewed A7 corpus.`);
    }
    return requestedPaper;
  }

  if (requestedFamily) {
    const supported = A7_GENERATOR_FAMILY_EVIDENCE[requestedFamily].supportedPapers;
    return supported[positiveModulo(seed, supported.length)] as A7GeneratorPaper;
  }

  // Three of the four reviewed A7 occurrences are on Paper 1.
  return positiveModulo(seed, 4) === 0 ? "P2" : "P1";
};

export const selectA7Family = (
  seed: number,
  paper: A7GeneratorPaper,
  requestedFamily?: A7GeneratorFamily,
  includeExperimentalFamilies = true,
): A7GeneratorFamily => {
  if (requestedFamily) {
    if (!A7_GENERATOR_FAMILY_EVIDENCE[requestedFamily].supportedPapers.includes(paper)) {
      throw new Error(`${requestedFamily} is not supported on ${paper} by the reviewed A7 corpus.`);
    }
    if (requestedFamily === "CONTEXT_AREA_EQUALITY" && !includeExperimentalFamilies) {
      throw new Error("The contextual A7 family is experimental and has been disabled for this generation request.");
    }
    return requestedFamily;
  }

  if (paper === "P2" || !includeExperimentalFamilies) return "FRACTIONAL_COEFFICIENT";

  // P1 corpus: 2 fractional examples, 1 equal-area contextual example.
  const slot = positiveModulo(seed * 17 + 5, 3);
  return slot === 2 ? "CONTEXT_AREA_EQUALITY" : "FRACTIONAL_COEFFICIENT";
};

export const a7FamilyFrequency = (family: A7GeneratorFamily, paper: A7GeneratorPaper) => {
  const cells = paper === "P1" ? A7_GENERATOR_FREQUENCY.P1 : A7_GENERATOR_FREQUENCY.P2;
  const cell = cells.find((entry) => entry.family === family);
  return cell ?? { family, count: 0, total: paper === "P1" ? 3 : 1, proportion: 0 };
};

export const historicalA7FractionalOverlap = (state: A7FractionalEquationState) => {
  const candidate = normaliseDisplayedEquation([
    state.clearedEquation.lhsX,
    state.clearedEquation.lhsConstant,
    state.clearedEquation.rhsX,
    state.clearedEquation.rhsConstant,
  ]);
  const swappedCandidate = normaliseDisplayedEquation([
    state.clearedEquation.rhsX,
    state.clearedEquation.rhsConstant,
    state.clearedEquation.lhsX,
    state.clearedEquation.lhsConstant,
  ]);

  return A7_GENERATOR_ABSTRACT_FINGERPRINTS.some((source) => {
    const historical = normaliseDisplayedEquation([
      source.clearedEquation.lhsX,
      source.clearedEquation.lhsConstant,
      source.clearedEquation.rhsX,
      source.clearedEquation.rhsConstant,
    ]);
    return sameVector(candidate, historical) || sameVector(swappedCandidate, historical);
  });
};

export const historicalReferenceForA7Fractional = (
  state: A7FractionalEquationState,
): HistoricalQuestionReferenceProfile => {
  const primaryQuestionCatalogId = state.surfaceVariant === "BINOMIAL_LEFT_NUMERATOR"
    ? "N5_MATH_2025_P2_Q13"
    : state.surfaceVariant === "BINOMIAL_RIGHT_NUMERATOR"
      ? "N5_MATH_2019_P1_Q14"
      : "N5_MATH_2016_P1_Q8";

  const all = A7_GENERATOR_ABSTRACT_FINGERPRINTS.map((entry) => entry.sourceQuestionId);
  return {
    primaryQuestionCatalogId,
    supportingQuestionCatalogIds: all.filter((id) => id !== primaryQuestionCatalogId),
    matchReasons: [
      "SAME_FAMILY",
      "SAME_SKILL",
      "SAME_MARK_TARIFF",
      "SAME_STANDARD_PROFILE",
      "SAME_THINKING_PROFILE",
      "SIMILAR_STRUCTURE",
      "SIMILAR_NUMERICAL_DEMAND",
    ],
  };
};

export const historicalReferenceForA7Context = (): HistoricalQuestionReferenceProfile => ({
  primaryQuestionCatalogId: "N5_MATH_2022_P1_Q15",
  supportingQuestionCatalogIds: [],
  matchReasons: [
    "SAME_FAMILY",
    "SAME_SKILL",
    "SAME_MARK_TARIFF",
    "SAME_STANDARD_PROFILE",
    "SAME_THINKING_PROFILE",
    "SIMILAR_STRUCTURE",
    "SIMILAR_CONTEXT",
    "SIMILAR_NUMERICAL_DEMAND",
  ],
});
