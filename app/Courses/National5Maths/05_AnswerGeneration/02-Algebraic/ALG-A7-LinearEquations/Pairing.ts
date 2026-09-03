import {
  generateA7Question,
  generateA7QuestionBatch,
} from "../../../03_QuestionGeneration/02-Algebraic/ALG-A7-LinearEquations/Generator";
import type {
  A7GenerateOptions,
  A7GeneratedQuestion,
} from "../../../03_QuestionGeneration/02-Algebraic/ALG-A7-LinearEquations/Types";
import { generateA7Answer, generateA7AnswerBatch } from "./Generator";
import type { A7GeneratedMarkingScheme } from "./Types";

export type A7GeneratedAssessmentPair = {
  question: A7GeneratedQuestion;
  markingScheme: A7GeneratedMarkingScheme;
};

export const generateA7AssessmentPair = (
  options: A7GenerateOptions,
): A7GeneratedAssessmentPair => {
  const question = generateA7Question(options);
  return {
    question,
    markingScheme: generateA7Answer(question),
  };
};

export const generateA7AssessmentBatch = (
  count: number,
  options: Omit<A7GenerateOptions, "seed"> & { seed: number },
): A7GeneratedAssessmentPair[] => {
  const questions = generateA7QuestionBatch(count, options);
  const markingSchemes = generateA7AnswerBatch(questions);
  return questions.map((question, index) => ({
    question,
    markingScheme: markingSchemes[index],
  }));
};
