import { G1_CORPUS_ENTRIES } from "../../../03_SkillCatalog/03-Geometric/GEO-G1-GradientTwoPoints/G1CrossCorpusAnalysis";
import type { G1GeneratedQuestion } from "../../../04_QuestionGeneration/03-Geometric/GEO-G1-GradientTwoPoints/Types";
import type {
  G1GeneratedAnswerProfile,
  G1GeneratedAnswerProfileId,
} from "./Types";

const answerAnchorIds = new Set(G1_CORPUS_ENTRIES.map((entry) => entry.sourceAnswerId));

const sourceAnchors = (...ids: string[]): readonly string[] => {
  for (const id of ids) {
    if (!answerAnchorIds.has(id)) {
      throw new Error(`Unknown G1 answer-calibration source anchor: ${id}`);
    }
  }
  return ids;
};

export const G1_GENERATED_ANSWER_PROFILES: Record<G1GeneratedAnswerProfileId, G1GeneratedAnswerProfile> = {
  LINE_EQUATION_WORKED: {
    id: "LINE_EQUATION_WORKED",
    family: "LINE_EQUATION_FROM_TWO_POINTS",
    markProfile: "GRADIENT_ANCHOR_EQUATION",
    sourceAnchorIds: sourceAnchors(
      "N5_MATH_2015_P1_Q8_MS",
      "N5_MATH_2017_P1_Q6_MS",
      "N5_MATH_2022_P1_Q6_MS",
      "N5_MATH_2025_P1_Q6_MS",
    ),
    workingRequired: true,
    correctAnswerWithoutWorking: "NO_CREDIT",
    equivalentLineFormsAccepted: true,
    coordinateSubtractionMustBeConsistent: true,
    simplestFormRequired: true,
    exactGradientRequired: true,
    contextVariablesRequiredForModel: false,
    followUpOwner: null,
    unitsRequiredForFollowUp: false,
    rationale: "Use one stable generated marking regime for the three-mark line family: gradient, line position, then a simplified equation. The reviewed corpus varies historically on answer-only treatment, so generated material deliberately adopts the later working-required regime instead of randomising historical policy by seed.",
  },
  DETERMINISTIC_CONTEXT_MODEL: {
    id: "DETERMINISTIC_CONTEXT_MODEL",
    family: "CONTEXTUAL_LINEAR_MODEL",
    markProfile: "GRADIENT_ANCHOR_EQUATION_APPLY",
    sourceAnchorIds: sourceAnchors(
      "N5_MATH_2018_P1_Q7_MS",
      "N5_MATH_2021_P1_Q10_MS",
    ),
    workingRequired: true,
    correctAnswerWithoutWorking: "NO_CREDIT",
    equivalentLineFormsAccepted: true,
    coordinateSubtractionMustBeConsistent: true,
    simplestFormRequired: true,
    exactGradientRequired: true,
    contextVariablesRequiredForModel: true,
    followUpOwner: "G1",
    unitsRequiredForFollowUp: false,
    rationale: "Preserve the reviewed deterministic 3+1 G1 architecture. The first three marks construct an exact contextual line model; the fourth applies that same deterministic model. Fractional gradients remain exact and the contextual variable names are part of full-credit presentation.",
  },
  BEST_FIT_G1_CONSTRUCTION_ONLY: {
    id: "BEST_FIT_G1_CONSTRUCTION_ONLY",
    family: "BEST_FIT_LINEAR_MODEL",
    markProfile: "GRADIENT_ANCHOR_EQUATION",
    sourceAnchorIds: sourceAnchors(
      "N5_MATH_2014_P1_Q6_MS",
      "N5_MATH_2016_P1_Q5_MS",
      "N5_MATH_2019_P1_Q6_MS",
      "N5_MATH_2023_P1_Q7_MS",
      "N5_MATH_2024_P1_Q9_MS",
    ),
    workingRequired: true,
    correctAnswerWithoutWorking: "NO_CREDIT",
    equivalentLineFormsAccepted: true,
    coordinateSubtractionMustBeConsistent: true,
    simplestFormRequired: true,
    exactGradientRequired: true,
    contextVariablesRequiredForModel: true,
    followUpOwner: "DEFERRED_S2",
    unitsRequiredForFollowUp: false,
    rationale: "Generate only the three G1 marks that construct the supplied fitted-line model. The historically adjacent one-mark statistical estimate remains outside this answer engine until the statistical generation layer is implemented, preserving the recorded cross-skill ownership boundary.",
  },
  SYMBOLIC_GRADIENT_FACTOR_CANCEL: {
    id: "SYMBOLIC_GRADIENT_FACTOR_CANCEL",
    family: "SYMBOLIC_GRADIENT_FROM_TWO_POINTS",
    markProfile: "SYMBOLIC_QUOTIENT_FACTOR_CANCEL",
    sourceAnchorIds: sourceAnchors("N5_MATH_2019_P2_Q13_MS"),
    workingRequired: true,
    correctAnswerWithoutWorking: "NO_CREDIT",
    equivalentLineFormsAccepted: false,
    coordinateSubtractionMustBeConsistent: true,
    simplestFormRequired: true,
    exactGradientRequired: true,
    contextVariablesRequiredForModel: false,
    followUpOwner: null,
    unitsRequiredForFollowUp: false,
    rationale: "Keep the narrow symbolic G1 route fully geometric in origin: form the two-point gradient quotient, factor the numerator, then factor/cancel the common structure and state the exact simplified gradient. A final expression without the coordinate-gradient working is not enough for the generated three-mark route.",
  },
};

export const resolveG1GeneratedAnswerProfile = (
  question: G1GeneratedQuestion,
): G1GeneratedAnswerProfile => {
  if (question.family === "LINE_EQUATION_FROM_TWO_POINTS") {
    return G1_GENERATED_ANSWER_PROFILES.LINE_EQUATION_WORKED;
  }
  if (question.family === "CONTEXTUAL_LINEAR_MODEL") {
    return G1_GENERATED_ANSWER_PROFILES.DETERMINISTIC_CONTEXT_MODEL;
  }
  if (question.family === "BEST_FIT_LINEAR_MODEL") {
    return G1_GENERATED_ANSWER_PROFILES.BEST_FIT_G1_CONSTRUCTION_ONLY;
  }
  return G1_GENERATED_ANSWER_PROFILES.SYMBOLIC_GRADIENT_FACTOR_CANCEL;
};
