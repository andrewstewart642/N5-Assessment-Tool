import { createG1GradientAnswerCatalogEntry } from "../../G1GradientAnswerCatalogFactory";
import { getG1AnswerConfig, type G1AnswerConfig } from "../../G1GradientAnswerCatalogSource";
import { N5_MATHS_2019_P2_Q13 as question } from "../../../01_QuestionCatalog/2019/Paper2/N5_Maths_2019_P2_Q13";

const sourceConfig = getG1AnswerConfig(2019, "P2", "13");

/**
 * Source-correction override:
 * the reviewed marking evidence simplifies the gradient to (2p+3)/2,
 * equivalently p+3/2. The earlier G1 answer-source transcription dropped
 * the denominator 2; keep the correction local to this historical entry until
 * the shared source table is next normalised.
 */
const correctedConfig: G1AnswerConfig = {
  ...sourceConfig,
  canonicalPrimaryAnswer: "p + 3/2",
  completionSummary: "Factor the denominator consistently, cancel the common factor, and state the gradient as (2p + 3)/2 or equivalently p + 3/2.",
  acceptedEquivalentPrimaryAnswers: [
    "(2p + 3)/2",
    "(3 + 2p)/2",
    "3/2 + p",
  ],
  commonResponses: [
    ...sourceConfig.commonResponses,
    {
      idSuffix: "DROPPED_DENOMINATOR_AFTER_CORRECT_FACTOR_CANCEL",
      category: "COMMON_ERROR",
      errorFamily: "INVALID_FRACTION_SIMPLIFICATION",
      normalisedResponse: "After reaching the correct quotient (2p + 3)/2, incorrectly simplifying it to p + 3 receives two of the three marks.",
      affectedMarkRefs: ["M3"],
      marksAwarded: 2,
      maximumMarks: 2,
      followThroughAvailable: false,
    },
  ],
};

export const N5_MATHS_2019_P2_Q13_MS = createG1GradientAnswerCatalogEntry(
  question,
  correctedConfig,
);
