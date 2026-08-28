import type {
  ComponentType,
  ReactNode,
} from "react";

import type {
  Paper,
} from "@/app/Assessments/AssessmentTypes";

import type {
  CourseId,
} from "@/app/Courses/CourseTypes";

import {
  National5MathsCourseDocuments,
} from "@/app/Courses/National5Maths/Documents/CourseDocuments";


export type CourseCoverPageProps = {
  pageNumber:
    number;

  paper:
    Paper;

  totalMarks:
    number;

  showDateTime:
    boolean;

  dateText:
    string;

  timeText:
    string;

  subjectName?:
    string;

  qualificationBadge?:
    string;

  qualificationLabelLines?:
    string[];

  paperTitle?:
    string;

  coverInstructionText?:
    string;

  showNoCalculatorIcon?:
    boolean;

  showScottishCandidateNumberBox:
    boolean;

  viewerScale?:
    number;

  outerPaddingPx?:
    number;
};


export type CourseFormulaSheetProps = {
  pageNumber:
    number;

  viewerScale?:
    number;

  outerPaddingPx?:
    number;
};


export type CourseQuestionPageProps = {
  children?:
    ReactNode;

  paper:
    Paper;

  pageNumber:
    number;

  totalMarks?:
    number;

  isFirstQuestionPage?:
    boolean;

  showTurnOver?:
    boolean;

  viewerScale?:
    number;

  outerPaddingPx?:
    number;
};


export type CourseDocumentSet = {
  CoverPage:
    ComponentType<
      CourseCoverPageProps
    >;

  FormulaSheet:
    ComponentType<
      CourseFormulaSheetProps
    >;

  QuestionPage:
    ComponentType<
      CourseQuestionPageProps
    >;
};


const COURSE_DOCUMENT_REGISTRY:
  Partial<
    Record<
      CourseId,
      CourseDocumentSet
    >
  > = {
    N5_MATH:
      National5MathsCourseDocuments,
  };


export function getCourseDocumentSet(
  courseId:
    CourseId
): CourseDocumentSet | null {
  return (
    COURSE_DOCUMENT_REGISTRY[
      courseId
    ] ??
    null
  );
}


export function hasCourseDocumentSet(
  courseId:
    CourseId
): boolean {
  return (
    getCourseDocumentSet(
      courseId
    ) !== null
  );
}
