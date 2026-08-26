import {
  useMemo,
} from "react";

import type {
  CourseAssessmentConfig,
} from "@/course-data/course-configs/CourseConfigTypes";

import type {
  Paper,
  Question,
} from "@/shared-types/AssessmentTypes";

import {
  getAssessmentPapers,
} from "../Papers/AssessmentPaperRules";

import {
  calculateAssessmentPaperDurationMinutes,
} from "../Papers/AssessmentPaperTiming";

import {
  getAssessmentPaperNumberValue,
  type AssessmentPaperNumberMap,
} from "../Papers/AssessmentPaperValueMaps";

type QuestionsByPaper =
  Partial<
    Record<
      Paper,
      Question[]
    >
  >;

function getQuestionMarks(
  question: Question
): number {
  if (
    typeof question.marks ===
      "number" &&
    Number.isFinite(
      question.marks
    )
  ) {
    return question.marks;
  }

  if (
    typeof question.targetMarks ===
      "number" &&
    Number.isFinite(
      question.targetMarks
    )
  ) {
    return question.targetMarks;
  }

  return 0;
}

function getActualQuestionMarks(
  question: Question
): number {
  return (
    typeof question.marks ===
      "number" &&
    Number.isFinite(
      question.marks
    )
  )
    ? question.marks
    : 0;
}

export function useAssessmentProgressMetrics({
  questions,
  viewPaper,
  courseConfig,
}: {
  questions:
    Question[];

  viewPaper:
    Paper;

  courseConfig:
    CourseAssessmentConfig;
}) {
  const coursePapers =
    useMemo(() => {
      return getAssessmentPapers(
        courseConfig
      );
    }, [
      courseConfig,
    ]);

  const questionsByPaper =
    useMemo<QuestionsByPaper>(
      () => {
        return coursePapers.reduce<QuestionsByPaper>(
          (
            grouped,
            paper
          ) => {
            grouped[
              paper
            ] =
              questions.filter(
                (
                  question
                ) =>
                  question.paper ===
                  paper
              );

            return grouped;
          },
          {}
        );
      },
      [
        questions,
        coursePapers,
      ]
    );

  const marksByPaper =
    useMemo<AssessmentPaperNumberMap>(
      () => {
        return coursePapers.reduce<AssessmentPaperNumberMap>(
          (
            marks,
            paper
          ) => {
            marks[
              paper
            ] =
              (
                questionsByPaper[
                  paper
                ] ??
                []
              ).reduce(
                (
                  total,
                  question
                ) =>
                  total +
                  getQuestionMarks(
                    question
                  ),
                0
              );

            return marks;
          },
          {}
        );
      },
      [
        questionsByPaper,
        coursePapers,
      ]
    );

  const actualQuestionMarksByPaper =
    useMemo<AssessmentPaperNumberMap>(
      () => {
        return coursePapers.reduce<AssessmentPaperNumberMap>(
          (
            marks,
            paper
          ) => {
            marks[
              paper
            ] =
              (
                questionsByPaper[
                  paper
                ] ??
                []
              ).reduce(
                (
                  total,
                  question
                ) =>
                  total +
                  getActualQuestionMarks(
                    question
                  ),
                0
              );

            return marks;
          },
          {}
        );
      },
      [
        questionsByPaper,
        coursePapers,
      ]
    );

  const minutesByPaper =
    useMemo<AssessmentPaperNumberMap>(
      () => {
        return coursePapers.reduce<AssessmentPaperNumberMap>(
          (
            minutes,
            paper
          ) => {
            minutes[
              paper
            ] =
              calculateAssessmentPaperDurationMinutes({
                paper,

                marks:
                  getAssessmentPaperNumberValue({
                    paper,

                    valuesByPaper:
                      marksByPaper,
                  }),

                courseConfig,
              });

            return minutes;
          },
          {}
        );
      },
      [
        marksByPaper,
        coursePapers,
        courseConfig,
      ]
    );

  const assignedForView =
    useMemo(() => {
      return (
        questionsByPaper[
          viewPaper
        ] ??
        []
      );
    }, [
      questionsByPaper,
      viewPaper,
    ]);

  const activePaperCoverMarks =
    getAssessmentPaperNumberValue({
      paper:
        viewPaper,

      valuesByPaper:
        actualQuestionMarksByPaper,
    });

  return {
    assignedForView,

    activePaperCoverMarks,

    questionsByPaper,
    marksByPaper,

    actualQuestionMarksByPaper,

    minutesByPaper,
  };
}