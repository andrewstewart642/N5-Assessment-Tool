import { N2_CORPUS_ENTRIES } from "../../../03_SkillCatalog/01-Numerical/NUM-N2-Indices/N2CrossCorpusAnalysis";
import type { N2GeneratedQuestion, N2GeneratorMechanism } from "../../../04_QuestionGeneration/01-Numerical/NUM-N2-Indices/Types";
import type {
  N2GeneratedAnswerProfile,
  N2GeneratedAnswerProfileId,
} from "./Types";

const answerAnchorIds = new Set(N2_CORPUS_ENTRIES.map((entry) => entry.sourceAnswerId));

const sourceAnchors = (...ids: string[]): readonly string[] => {
  for (const id of ids) {
    if (!answerAnchorIds.has(id)) throw new Error(`Unknown N2 answer-calibration source anchor: ${id}`);
  }
  return ids;
};

export const N2_GENERATED_ANSWER_PROFILES: Record<N2GeneratedAnswerProfileId, N2GeneratedAnswerProfile> = {
  FRACTIONAL_INDEX_EVALUATION_EXACT: {
    id: "FRACTIONAL_INDEX_EVALUATION_EXACT",
    family: "FRACTIONAL_INDEX_EVALUATION",
    mechanism: "FRACTIONAL_NUMERIC_EVALUATION",
    markProfile: "FRACTIONAL_INTERPRET_EVALUATE",
    sourceAnchorIds: sourceAnchors("N5_MATH_2015_P1_Q14_MS", "N5_MATH_2021_P1_Q15_MS"),
    correctAnswerWithoutWorking: "FULL_CREDIT",
    workingRequired: false,
    equivalentRoutesAccepted: true,
    positivePowerOutputRequired: false,
    exactIntegerRequired: true,
    rationale: "Preserve the stable two-stage numerical fractional-index structure: interpret the fractional exponent, then complete an exact integer evaluation. Difficulty may vary through controlled exact-value burden without changing the two-mark architecture.",
  },
  PRODUCT_QUOTIENT_COEFFICIENT: {
    id: "PRODUCT_QUOTIENT_COEFFICIENT",
    family: "MULTI_LAW_SIMPLIFICATION",
    mechanism: "PRODUCT_QUOTIENT_WITH_COEFFICIENT",
    markProfile: "PRODUCT_COEFFICIENT_QUOTIENT",
    sourceAnchorIds: sourceAnchors("N5_MATH_2014_P2_Q8_MS"),
    correctAnswerWithoutWorking: "FULL_CREDIT",
    workingRequired: false,
    equivalentRoutesAccepted: true,
    positivePowerOutputRequired: false,
    exactIntegerRequired: false,
    rationale: "Keep three separable marks for numerator index combination, coefficient reduction and the quotient law. Equivalent ordering is acceptable provided the same mathematical evidence remains visible.",
  },
  POWER_OF_POWER_NEGATIVE_INDEX: {
    id: "POWER_OF_POWER_NEGATIVE_INDEX",
    family: "MULTI_LAW_SIMPLIFICATION",
    mechanism: "POWER_OF_POWER_WITH_NEGATIVE_INDEX",
    markProfile: "POWER_SIGNED_CONVERT",
    sourceAnchorIds: sourceAnchors("N5_MATH_2016_P2_Q10_MS", "N5_MATH_2022_P1_Q11_MS"),
    correctAnswerWithoutWorking: "FULL_CREDIT",
    workingRequired: false,
    equivalentRoutesAccepted: true,
    positivePowerOutputRequired: true,
    exactIntegerRequired: false,
    rationale: "Preserve the three-stage route: apply power-of-a-power, combine signed exponents, then convert the negative result to reciprocal positive-power form. Factor order and sign layout may vary when the same three mathematical stages remain intact.",
  },
  RECIPROCAL_ROOT_SINGLE_POWER: {
    id: "RECIPROCAL_ROOT_SINGLE_POWER",
    family: "MULTI_LAW_SIMPLIFICATION",
    mechanism: "RECIPROCAL_ROOT_TO_NEGATIVE_FRACTIONAL_INDEX",
    markProfile: "ROOT_RECIPROCAL_SINGLE_POWER",
    sourceAnchorIds: sourceAnchors("N5_MATH_2017_P2_Q12_MS"),
    correctAnswerWithoutWorking: "FULL_CREDIT",
    workingRequired: false,
    equivalentRoutesAccepted: true,
    positivePowerOutputRequired: false,
    exactIntegerRequired: false,
    rationale: "The two marks are representation-led: a powered root becomes a fractional index, then the reciprocal becomes a negative fractional index while retaining one power of the same base. The powered radicand may vary to produce non-unit fractional numerators.",
  },
  SQUARED_FRACTIONAL_MONOMIAL: {
    id: "SQUARED_FRACTIONAL_MONOMIAL",
    family: "BRACKETED_INDEX_LAWS",
    mechanism: "SQUARED_FRACTIONAL_MONOMIAL",
    markProfile: "POWERED_MONOMIAL_TWO_COMPONENT",
    sourceAnchorIds: sourceAnchors("N5_MATH_2018_P1_Q15_MS"),
    correctAnswerWithoutWorking: "FULL_CREDIT",
    workingRequired: false,
    equivalentRoutesAccepted: true,
    positivePowerOutputRequired: false,
    exactIntegerRequired: false,
    rationale: "The first mark can be evidenced by correctly applying the outer square to either the fractional coefficient or the indexed variable; the second completes both components into one simplified monomial.",
  },
  PRODUCT_OVER_ROOT: {
    id: "PRODUCT_OVER_ROOT",
    family: "MULTI_LAW_SIMPLIFICATION",
    mechanism: "PRODUCT_OVER_ROOT",
    markProfile: "PRODUCT_ROOT_QUOTIENT",
    sourceAnchorIds: sourceAnchors("N5_MATH_2019_P2_Q16_MS"),
    correctAnswerWithoutWorking: "FULL_CREDIT",
    workingRequired: false,
    equivalentRoutesAccepted: true,
    positivePowerOutputRequired: false,
    exactIntegerRequired: false,
    rationale: "Keep the numerator product, root-to-fractional-index translation and final quotient as three distinct marks. Equivalent exact fractional-exponent routes are accepted.",
  },
  NEGATIVE_INDEX_QUOTIENT: {
    id: "NEGATIVE_INDEX_QUOTIENT",
    family: "MULTI_LAW_SIMPLIFICATION",
    mechanism: "NEGATIVE_INDEX_QUOTIENT",
    markProfile: "DENOMINATOR_QUOTIENT_CONVERT",
    sourceAnchorIds: sourceAnchors("N5_MATH_2023_P1_Q12_MS"),
    correctAnswerWithoutWorking: "FULL_CREDIT",
    workingRequired: false,
    equivalentRoutesAccepted: true,
    positivePowerOutputRequired: true,
    exactIntegerRequired: false,
    rationale: "Use the reviewed denominator-product, signed quotient and positive-power conversion structure. A positive-powers-first route is also acceptable when it preserves equivalent demand and the numerical coefficient remains correctly positioned.",
  },
  DISTRIBUTIVE_INDEX_EXPANSION: {
    id: "DISTRIBUTIVE_INDEX_EXPANSION",
    family: "BRACKETED_INDEX_LAWS",
    mechanism: "DISTRIBUTIVE_INDEX_EXPANSION",
    markProfile: "DISTRIBUTE_TWO_TERMS",
    sourceAnchorIds: sourceAnchors("N5_MATH_2024_P1_Q13_MS"),
    correctAnswerWithoutWorking: "FULL_CREDIT",
    workingRequired: false,
    equivalentRoutesAccepted: true,
    positivePowerOutputRequired: false,
    exactIntegerRequired: false,
    rationale: "Preserve the two-mark distributive structure: one correct indexed product establishes progress, then both distributed terms are completed and simplified. A zero-power constant may occur, but it is no longer forced in every generated layout.",
  },
  POSITIVE_POWER_PRODUCT_QUOTIENT: {
    id: "POSITIVE_POWER_PRODUCT_QUOTIENT",
    family: "MULTI_LAW_SIMPLIFICATION",
    mechanism: "POSITIVE_POWER_PRODUCT_QUOTIENT",
    markProfile: "POWER_PRODUCT_QUOTIENT",
    sourceAnchorIds: sourceAnchors("N5_MATH_2025_P1_Q10_MS"),
    correctAnswerWithoutWorking: "NO_CREDIT",
    workingRequired: true,
    equivalentRoutesAccepted: true,
    positivePowerOutputRequired: false,
    exactIntegerRequired: false,
    rationale: "Preserve the explicit three-process-mark working regime: power-of-a-power, numerator product and quotient. A correct unsupported final answer receives no credit for this generated mechanism because that rule is source-confirmed for the calibration anchor.",
  },
};

const PROFILE_BY_MECHANISM: Record<N2GeneratorMechanism, N2GeneratedAnswerProfileId> = {
  FRACTIONAL_NUMERIC_EVALUATION: "FRACTIONAL_INDEX_EVALUATION_EXACT",
  PRODUCT_QUOTIENT_WITH_COEFFICIENT: "PRODUCT_QUOTIENT_COEFFICIENT",
  POWER_OF_POWER_WITH_NEGATIVE_INDEX: "POWER_OF_POWER_NEGATIVE_INDEX",
  RECIPROCAL_ROOT_TO_NEGATIVE_FRACTIONAL_INDEX: "RECIPROCAL_ROOT_SINGLE_POWER",
  SQUARED_FRACTIONAL_MONOMIAL: "SQUARED_FRACTIONAL_MONOMIAL",
  PRODUCT_OVER_ROOT: "PRODUCT_OVER_ROOT",
  NEGATIVE_INDEX_QUOTIENT: "NEGATIVE_INDEX_QUOTIENT",
  DISTRIBUTIVE_INDEX_EXPANSION: "DISTRIBUTIVE_INDEX_EXPANSION",
  POSITIVE_POWER_PRODUCT_QUOTIENT: "POSITIVE_POWER_PRODUCT_QUOTIENT",
};

export const resolveN2GeneratedAnswerProfile = (
  question: N2GeneratedQuestion,
): N2GeneratedAnswerProfile => N2_GENERATED_ANSWER_PROFILES[PROFILE_BY_MECHANISM[question.mechanism]];
