import {
  A7_CORPUS_ENTRIES,
} from "../../../02_AnswerCatalog/A7_LinearEquations/A7CrossCorpusAnalysis";
import type { A7GeneratedQuestion } from "../../../03_QuestionGeneration/02-Algebraic/ALG-A7-LinearEquations/Types";
import type {
  A7GeneratedAnswerProfile,
  A7GeneratedAnswerProfileId,
} from "./Types";

const answerAnchorIds = new Set(A7_CORPUS_ENTRIES.map((entry) => entry.sourceAnswerId));

const sourceAnchors = (...ids: string[]): readonly string[] => {
  for (const id of ids) {
    if (!answerAnchorIds.has(id)) throw new Error(`Unknown A7 answer-calibration source anchor: ${id}`);
  }
  return ids;
};

export const A7_GENERATED_ANSWER_PROFILES: Record<A7GeneratedAnswerProfileId, A7GeneratedAnswerProfile> = {
  FRACTIONAL_MODERN_EXACT: {
    id: "FRACTIONAL_MODERN_EXACT",
    family: "FRACTIONAL_COEFFICIENT",
    markProfile: "EQUIVALENT_REARRANGE_EXACT",
    sourceAnchorIds: sourceAnchors(
      "N5_MATH_2019_P1_Q14_MS",
      "N5_MATH_2025_P2_Q13_MS",
    ),
    exactFractionRequired: true,
    algebraicWorkingRequired: true,
    correctAnswerWithoutWorking: "NO_CREDIT",
    explicitlyExcludedMethods: ["REPEATED_SUBSTITUTION"],
    equivalentAlgebraicRoutesAccepted: true,
    laterPartCanSupplyTriangleAreaEvidence: false,
    triangleHalfFactorMustSurviveFirstSolveStep: false,
    trivialIntegerFinalDivisionBlocked: false,
    rationale: "Use the modern reviewed A7 fractional-equation regime: three independently mark-bearing algebraic stages, a non-integer exact rational solution, and no replacement of the exact value by a decimal approximation. The repeated-substitution exclusion is a generated assessment policy aligned to the explicit 2025 source, not a claim that every historical A7 question stated that exclusion.",
  },
  CONTEXT_2022_EQUAL_AREA: {
    id: "CONTEXT_2022_EQUAL_AREA",
    family: "CONTEXT_AREA_EQUALITY",
    markProfile: "AREA_EQUATE_START_REARRANGE_SOLVE",
    sourceAnchorIds: sourceAnchors("N5_MATH_2022_P1_Q15_MS"),
    exactFractionRequired: false,
    algebraicWorkingRequired: true,
    correctAnswerWithoutWorking: "NO_CREDIT",
    explicitlyExcludedMethods: ["GUESS_AND_CHECK"],
    equivalentAlgebraicRoutesAccepted: true,
    laterPartCanSupplyTriangleAreaEvidence: true,
    triangleHalfFactorMustSurviveFirstSolveStep: true,
    trivialIntegerFinalDivisionBlocked: true,
    rationale: "Preserve the reviewed 2022 equal-area 1+4 structure: form the triangle area, form/equate the rectangle area, begin a valid solve while retaining the one-half structure, rearrange to ax=b, then divide to the exact positive integer solution. Guess-and-check is explicitly excluded by the historical marking instructions.",
  },
};

export const resolveA7GeneratedAnswerProfile = (
  question: A7GeneratedQuestion,
): A7GeneratedAnswerProfile => question.family === "CONTEXT_AREA_EQUALITY"
  ? A7_GENERATED_ANSWER_PROFILES.CONTEXT_2022_EQUAL_AREA
  : A7_GENERATED_ANSWER_PROFILES.FRACTIONAL_MODERN_EXACT;
