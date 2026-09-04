import {
  generateG1Question,
  generateG1QuestionBatch,
} from "../../../04_QuestionGeneration/03-Geometric/GEO-G1-GradientTwoPoints/Generator";
import type {
  G1GenerateOptions,
  G1GeneratedQuestion,
} from "../../../04_QuestionGeneration/03-Geometric/GEO-G1-GradientTwoPoints/Types";
import { generateG1Answer } from "./Generator";
import type { G1GeneratedMarkingScheme } from "./Types";

export type G1GeneratedAssessmentPair = {
  question: G1GeneratedQuestion;
  markingScheme: G1GeneratedMarkingScheme;
};

export const generateG1AssessmentPair = (
  options: G1GenerateOptions,
): G1GeneratedAssessmentPair => {
  const question = generateG1Question(options);
  return {
    question,
    markingScheme: generateG1Answer(question),
  };
};

export const generateG1AssessmentBatch = (
  count: number,
  options: Omit<G1GenerateOptions, "seed"> & { seed: number },
): G1GeneratedAssessmentPair[] => {
  const questions = generateG1QuestionBatch(count, options);
  return questions.map((question) => ({
    question,
    markingScheme: generateG1Answer(question),
  }));
};
