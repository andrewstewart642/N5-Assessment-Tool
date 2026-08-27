import type {
  Question,
} from "@/app/Assessments/AssessmentTypes";

import type {
  CompilationPageSizeConfig,
} from "@/app/Assessments/Compilation/CompilationPageSizes";

import {
  DEFAULT_COURSE_ID,
} from "@/app/Courses/CourseRegistry";

import {
  paginateAssessmentCompilationQuestions,
} from "./Pagination/AssessmentCompilationPagination";


/*
 * Compatibility wrapper.
 *
 * Legacy Compilation callers can continue using
 * paginateCompilationQuestions while the new
 * canonical document architecture uses
 * paginateAssessmentCompilationQuestions directly.
 */

export function paginateCompilationQuestions(
  questions:
    Question[],

  page:
    CompilationPageSizeConfig
): Question[][] {
  return paginateAssessmentCompilationQuestions({
    questions,

    courseId:
      DEFAULT_COURSE_ID,

    contentHeightPx:
      page.contentHeightPx,

    scale:
      page.scale,
  });
}