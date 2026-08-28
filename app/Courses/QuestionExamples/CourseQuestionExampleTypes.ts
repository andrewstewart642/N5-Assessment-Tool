import type {
  Concept,
  DifficultyLevel,
  Skill,
} from "@/app/Assessments/AssessmentTypes";

import type {
  GeneratedQuestionData,
} from "@/app/Assessments/Questions/Generation/QuestionGenerationTypes";


export type CourseQuestionExampleRequest = {
  skill:
    Skill;

  concept:
    Concept;
};


export type CourseQuestionExampleGenerationRequest =
  CourseQuestionExampleRequest & {
    difficulty:
      DifficultyLevel;
  };


export type CourseQuestionExampleProvider = {
  getAvailableDifficulties:
    (
      request:
        CourseQuestionExampleRequest
    ) =>
      DifficultyLevel[];

  generate:
    (
      request:
        CourseQuestionExampleGenerationRequest
    ) =>
      GeneratedQuestionData | null;
};