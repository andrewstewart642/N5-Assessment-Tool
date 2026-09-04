import { generateN2Question } from "../../../04_QuestionGeneration/01-Numerical/NUM-N2-Indices/Generator";
import type {
  N2GenerateOptions,
  N2GeneratedQuestion,
} from "../../../04_QuestionGeneration/01-Numerical/NUM-N2-Indices/Types";
import { generateN2Answer } from "./Generator";
import type { N2GeneratedMarkingScheme } from "./Types";

export type N2GeneratedAssessmentPair = {
  question: N2GeneratedQuestion;
  markingScheme: N2GeneratedMarkingScheme;
};

export const generateN2AssessmentPair = (
  options: N2GenerateOptions,
): N2GeneratedAssessmentPair => {
  const question = generateN2Question(options);
  return {
    question,
    markingScheme: generateN2Answer(question),
  };
};

export const generateN2AssessmentBatch = (
  count: number,
  options: N2GenerateOptions,
): N2GeneratedAssessmentPair[] => {
  if (!Number.isInteger(count) || count < 0) {
    throw new Error("N2 assessment batch count must be a non-negative integer.");
  }

  return Array.from({ length: count }, (_, index) =>
    generateN2AssessmentPair({
      ...options,
      seed: Math.trunc(options.seed) + index,
    }),
  );
};
