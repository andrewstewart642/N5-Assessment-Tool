import type {
  CourseId,
} from "@/app/Courses/CourseTypes";

import type {
  CourseQuestionExampleProvider,
} from "./CourseQuestionExampleTypes";

import {
  NATIONAL5_MATHS_QUESTION_EXAMPLE_PROVIDER,
} from "@/app/Courses/National5Maths/QuestionAndAnswerGeneration/QuestionWriting/National5MathsQuestionExampleProvider";


const COURSE_QUESTION_EXAMPLE_PROVIDERS:
  Partial<
    Record<
      CourseId,
      CourseQuestionExampleProvider
    >
  > = {
    N5_MATH:
      NATIONAL5_MATHS_QUESTION_EXAMPLE_PROVIDER,
  };


export function getCourseQuestionExampleProvider(
  courseId:
    CourseId
): CourseQuestionExampleProvider | null {
  return (
    COURSE_QUESTION_EXAMPLE_PROVIDERS[
      courseId
    ] ??
    null
  );
}