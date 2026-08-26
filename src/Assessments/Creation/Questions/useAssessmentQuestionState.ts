"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import type {
  CourseAssessmentConfig,
} from "@/src/Courses/CourseAssessmentConfig";

import type {
  Paper,
  Question,
} from "@/src/Assessments/AssessmentTypes";

import {
  buildEmptyAssessmentEditDraftsByPaper,
  buildEmptyAssessmentQuestionDraftsByPaper,
} from "./AssessmentQuestionDrafts";

import type {
  AssessmentEditQuestionDraftByPaper,
  AssessmentQuestionDraftByPaper,
} from "./AssessmentQuestionDraftTypes";

type UseAssessmentQuestionStateArgs = {
  courseConfig:
    CourseAssessmentConfig;

  viewPaper:
    Paper;
};

export function useAssessmentQuestionState({
  courseConfig,
  viewPaper,
}: UseAssessmentQuestionStateArgs) {
  const [
    questions,
    setQuestions,
  ] =
    useState<Question[]>(
      []
    );

  const [
    draftByPaper,
    setDraftByPaper,
  ] =
    useState<AssessmentQuestionDraftByPaper>(
      () =>
        buildEmptyAssessmentQuestionDraftsByPaper(
          courseConfig
        )
    );

  const [
    editDraftByPaper,
    setEditDraftByPaper,
  ] =
    useState<AssessmentEditQuestionDraftByPaper>(
      () =>
        buildEmptyAssessmentEditDraftsByPaper(
          courseConfig
        )
    );

  const [
    measuredHeights,
    setMeasuredHeights,
  ] =
    useState<
      Record<
        string,
        number
      >
    >(
      {}
    );

  const editDraftRef =
    useRef<AssessmentEditQuestionDraftByPaper>(
      buildEmptyAssessmentEditDraftsByPaper(
        courseConfig
      )
    );

  const pendingJumpDraftRef =
    useRef<{
      paper:
        Paper;

      draftId:
        string;
    } | null>(
      null
    );

  useEffect(() => {
    editDraftRef.current =
      editDraftByPaper;
  }, [
    editDraftByPaper,
  ]);

  const handlePreferredAnswerMethodChange =
    useCallback(
      (
        questionId:
          string,

        methodFamilyId:
          string
      ) => {
        setQuestions(
          (
            previous
          ) =>
            previous.map(
              (
                question
              ) =>
                question.id ===
                questionId
                  ? {
                      ...question,

                      preferredAnswerMethodFamilyId:
                        methodFamilyId,
                    }
                  : question
            )
        );

        setDraftByPaper(
          (
            previous
          ) =>
            Object.fromEntries(
              Object.entries(
                previous
              ).map(
                ([
                  paper,
                  draft,
                ]) => [
                  paper,

                  draft?.id ===
                  questionId
                    ? {
                        ...draft,

                        preferredAnswerMethodFamilyId:
                          methodFamilyId,
                      }
                    : draft,
                ]
              )
            ) as AssessmentQuestionDraftByPaper
        );

        setEditDraftByPaper(
          (
            previous
          ) =>
            Object.fromEntries(
              Object.entries(
                previous
              ).map(
                ([
                  paper,
                  edit,
                ]) => [
                  paper,

                  edit?.draft.id ===
                  questionId
                    ? {
                        ...edit,

                        draft: {
                          ...edit.draft,

                          preferredAnswerMethodFamilyId:
                            methodFamilyId,
                        },
                      }
                    : edit,
                ]
              )
            ) as AssessmentEditQuestionDraftByPaper
        );
      },
      []
    );

  const editForView =
    editDraftByPaper[
      viewPaper
    ];

  const newDraftForView =
    draftByPaper[
      viewPaper
    ];

  return {
    questions,
    setQuestions,

    draftByPaper,
    setDraftByPaper,

    editDraftByPaper,
    setEditDraftByPaper,

    editForView,
    newDraftForView,

    editDraftRef,
    pendingJumpDraftRef,

    measuredHeights,
    setMeasuredHeights,

    handlePreferredAnswerMethodChange,
  };
}