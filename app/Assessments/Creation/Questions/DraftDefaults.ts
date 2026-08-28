import type {
  CourseAssessmentConfig,
} from "@/app/Courses/CourseAssessmentConfig";

import type {
  Paper,
  Question,
} from "@/app/Assessments/AssessmentTypes";

import {
  getAssessmentPapers,
} from "../Papers/AssessmentPaperRules";

type AssessmentEditQuestionDraft =
  | null
  | {
      questionIndex:
        number;

      original:
        Question;

      draft:
        Question;
    };

export function buildEmptyAssessmentQuestionDraftsByPaper(
  courseConfig?:
    CourseAssessmentConfig
): Record<
  Paper,
  Question | null
> {
  return getAssessmentPapers(
    courseConfig
  ).reduce<
    Partial<
      Record<
        Paper,
        Question | null
      >
    >
  >(
    (
      drafts,
      paper
    ) => {
      drafts[paper] =
        null;

      return drafts;
    },
    {}
  ) as Record<
    Paper,
    Question | null
  >;
}

export function buildEmptyAssessmentEditDraftsByPaper(
  courseConfig?:
    CourseAssessmentConfig
): Record<
  Paper,
  AssessmentEditQuestionDraft
> {
  return getAssessmentPapers(
    courseConfig
  ).reduce<
    Partial<
      Record<
        Paper,
        AssessmentEditQuestionDraft
      >
    >
  >(
    (
      drafts,
      paper
    ) => {
      drafts[paper] =
        null;

      return drafts;
    },
    {}
  ) as Record<
    Paper,
    AssessmentEditQuestionDraft
  >;
}