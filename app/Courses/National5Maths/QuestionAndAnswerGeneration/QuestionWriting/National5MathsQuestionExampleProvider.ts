import type {
  DifficultyLevel,
} from "@/app/Assessments/AssessmentTypes";

import type {
  CourseQuestionExampleProvider,
} from "@/app/Courses/QuestionExamples/CourseQuestionExampleTypes";

import {
  buildGenerated,
  conceptSelectionText,
  getAvailableDifficultiesForConcept,
} from "./QuestionWriterRegistry";


function normaliseDifficulties(
  levels:
    DifficultyLevel[]
): DifficultyLevel[] {
  return Array.from(
    new Set(
      levels
    )
  ).sort(
    (
      a,
      b
    ) =>
      a -
      b
  );
}


export const NATIONAL5_MATHS_QUESTION_EXAMPLE_PROVIDER:
  CourseQuestionExampleProvider = {
    getAvailableDifficulties({
      skill,
      concept,
    }) {
      return normaliseDifficulties(
        getAvailableDifficultiesForConcept(
          skill,
          conceptSelectionText(
            concept
          )
        )
      );
    },


    generate({
      skill,
      concept,
      difficulty,
    }) {
      return buildGenerated(
        skill,
        conceptSelectionText(
          concept
        ),
        difficulty
      );
    },
  };