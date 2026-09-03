import {
  A8_CORPUS_ENTRIES,
} from "../../../03_SkillCatalog/02-Algebraic/ALG-A8-SimultaneousEquations/A8CrossCorpusAnalysis";
import type { A8GeneratedQuestion } from "../../../04_QuestionGeneration/02-Algebraic/ALG-A8-SimultaneousEquations/Types";
import type {
  A8GeneratedAnswerProfile,
  A8GeneratedAnswerProfileId,
} from "./Types";

const sourceAnchors = (...ids: string[]): readonly string[] => {
  const known = new Set(A8_CORPUS_ENTRIES.map((entry) => entry.id));
  for (const id of ids) {
    if (!known.has(id)) throw new Error(`Unknown A8 answer-calibration source anchor: ${id}`);
  }
  return ids;
};

export const A8_GENERATED_ANSWER_PROFILES: Record<A8GeneratedAnswerProfileId, A8GeneratedAnswerProfile> = {
  ABSTRACT_RECENT_VALUE_VALUE: {
    id: "ABSTRACT_RECENT_VALUE_VALUE",
    family: "ABSTRACT_SOLVE",
    paper: "P1",
    markProfile: "SCALE_VALUE_VALUE",
    sourceAnchorIds: sourceAnchors(
      "N5_MATH_2023_P1_Q3_MS",
      "N5_MATH_2024_P1_Q7_MS",
    ),
    answerOnlyTreatment: "NO_CREDIT",
    explicitlyExcludedMethod: "REPEATED_SUBSTITUTION",
    roundedFollowThroughAtLeastDp: 1,
    separateScalingEitherCorrect: true,
    finalFractionConversionNotPenalised: true,
    equationEvidenceCanAppearLater: false,
    reversedCoordinatePairFullCredit: false,
    communicationMark: false,
    negativeValuesBlockFinalMark: false,
    rationale: "Use the recent P1 abstract A8 regime: one scaling mark followed by separate solved-value marks, with the source-supported recent follow-through and method notes.",
  },

  CONTEXT_P1_RECENT_VALUE_VALUE: {
    id: "CONTEXT_P1_RECENT_VALUE_VALUE",
    family: "CONTEXT_FORM_AND_SOLVE",
    paper: "P1",
    markProfile: "FORM_FORM_SCALE_VALUE_VALUE_COMMUNICATE",
    sourceAnchorIds: sourceAnchors(
      "N5_MATH_2016_P1_Q4_MS",
      "N5_MATH_2019_P1_Q8_MS",
    ),
    answerOnlyTreatment: "NO_CREDIT",
    explicitlyExcludedMethod: "GUESS_AND_CHECK",
    roundedFollowThroughAtLeastDp: null,
    separateScalingEitherCorrect: false,
    finalFractionConversionNotPenalised: false,
    equationEvidenceCanAppearLater: false,
    reversedCoordinatePairFullCredit: false,
    communicationMark: true,
    negativeValuesBlockFinalMark: true,
    rationale: "Preserve the stable P1 contextual 1+1+4 scaffold and use the later observed split of scaling, first value, second value and contextual communication.",
  },

  CONTEXT_P2_RECENT_VALUE_VALUE: {
    id: "CONTEXT_P2_RECENT_VALUE_VALUE",
    family: "CONTEXT_FORM_AND_SOLVE",
    paper: "P2",
    markProfile: "FORM_FORM_SCALE_VALUE_VALUE_COMMUNICATE",
    sourceAnchorIds: sourceAnchors(
      "N5_MATH_2014_P2_Q3_MS",
      "N5_MATH_2022_P2_Q4_MS",
    ),
    answerOnlyTreatment: "NO_CREDIT",
    explicitlyExcludedMethod: "GUESS_AND_CHECK",
    roundedFollowThroughAtLeastDp: null,
    separateScalingEitherCorrect: false,
    finalFractionConversionNotPenalised: false,
    equationEvidenceCanAppearLater: true,
    reversedCoordinatePairFullCredit: false,
    communicationMark: true,
    negativeValuesBlockFinalMark: true,
    rationale: "Use the later P2 contextual value/value profile while retaining the family-supported equation recovery and nearest-penny communication behaviour.",
  },

  GRAPH_2017_PROFILE: {
    id: "GRAPH_2017_PROFILE",
    family: "GRAPH_INTERSECTION_SOLVE",
    paper: "P1",
    markProfile: "SCALE_STRATEGY_CORRECT",
    sourceAnchorIds: sourceAnchors("N5_MATH_2017_P1_Q13_MS"),
    answerOnlyTreatment: "NO_CREDIT",
    explicitlyExcludedMethod: "GUESS_AND_CHECK",
    roundedFollowThroughAtLeastDp: null,
    separateScalingEitherCorrect: false,
    finalFractionConversionNotPenalised: false,
    equationEvidenceCanAppearLater: false,
    reversedCoordinatePairFullCredit: true,
    communicationMark: false,
    negativeValuesBlockFinalMark: false,
    rationale: "The graph family has one supplied source, so generated marking follows that source-local three-mark scaling/strategy/correct profile without generalising it to other A8 families.",
  },

  DERIVED_2025_PROFILE: {
    id: "DERIVED_2025_PROFILE",
    family: "CONTEXT_DERIVED_TOTAL",
    paper: "P2",
    markProfile: "FORM_FORM_SCALE_VALUE_VALUE_DERIVED",
    sourceAnchorIds: sourceAnchors("N5_MATH_2025_P2_Q10_MS"),
    answerOnlyTreatment: "NO_CREDIT",
    explicitlyExcludedMethod: "REPEATED_SUBSTITUTION",
    roundedFollowThroughAtLeastDp: null,
    separateScalingEitherCorrect: false,
    finalFractionConversionNotPenalised: false,
    equationEvidenceCanAppearLater: true,
    reversedCoordinatePairFullCredit: false,
    communicationMark: false,
    negativeValuesBlockFinalMark: true,
    rationale: "The derived-total family is single-source in the supplied corpus, so its generated six-mark structure follows the 2025 form/form/scale/value/value/derived profile.",
  },
};

export const resolveA8GeneratedAnswerProfile = (
  question: A8GeneratedQuestion,
): A8GeneratedAnswerProfile => {
  switch (question.family) {
    case "ABSTRACT_SOLVE":
      return A8_GENERATED_ANSWER_PROFILES.ABSTRACT_RECENT_VALUE_VALUE;
    case "GRAPH_INTERSECTION_SOLVE":
      return A8_GENERATED_ANSWER_PROFILES.GRAPH_2017_PROFILE;
    case "CONTEXT_DERIVED_TOTAL":
      return A8_GENERATED_ANSWER_PROFILES.DERIVED_2025_PROFILE;
    case "CONTEXT_FORM_AND_SOLVE":
      return question.paper === "P1"
        ? A8_GENERATED_ANSWER_PROFILES.CONTEXT_P1_RECENT_VALUE_VALUE
        : A8_GENERATED_ANSWER_PROFILES.CONTEXT_P2_RECENT_VALUE_VALUE;
  }
};
