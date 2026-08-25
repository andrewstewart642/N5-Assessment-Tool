"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import type { CourseAssessmentConfig } from "@/course-data/course-configs/CourseConfigTypes";

import type {
  Paper,
  Question,
} from "@/shared-types/AssessmentTypes";

import type {
  DraftByPaper,
  EditDraftByPaper,
} from "@/app/create-assessment/builder/BuilderUtils";

import {
  buildEmptyEditDraftsByPaper,
  buildEmptyQuestionDraftsByPaper,
} from "@/app/create-assessment/builder/builder-logic/BuilderPaperTargets";

type UseAssessmentQuestionStateArgs = {
  courseConfig: CourseAssessmentConfig;
  viewPaper: Paper;
};

export function useAssessmentQuestionState({
  courseConfig,
  viewPaper,
}: UseAssessmentQuestionStateArgs) {
  const [
    questions,
    setQuestions,
  ] = useState<Question[]>([]);

  const [
    draftByPaper,
    setDraftByPaper,
  ] = useState<DraftByPaper>(() => {
    return buildEmptyQuestionDraftsByPaper(
      courseConfig
    );
  });

  const [
    editDraftByPaper,
    setEditDraftByPaper,
  ] = useState<EditDraftByPaper>(() => {
    return buildEmptyEditDraftsByPaper(
      courseConfig
    );
  });

  const [
    measuredHeights,
    setMeasuredHeights,
  ] = useState<Record<string, number>>(
    {}
  );

  const editDraftRef =
    useRef<EditDraftByPaper>(
      buildEmptyEditDraftsByPaper(
        courseConfig
      )
    );

  const pendingJumpDraftRef =
    useRef<{
      paper: Paper;
      draftId: string;
    } | null>(null);

  useEffect(() => {
    editDraftRef.current =
      editDraftByPaper;
  }, [editDraftByPaper]);

  const handlePreferredAnswerMethodChange =
    useCallback(
      (
        questionId: string,
        methodFamilyId: string
      ) => {
        setQuestions((previous) =>
          previous.map((question) =>
            question.id === questionId
              ? {
                  ...question,
                  preferredAnswerMethodFamilyId:
                    methodFamilyId,
                }
              : question
          )
        );

        setDraftByPaper(
          (previous) =>
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
            ) as DraftByPaper
        );

        setEditDraftByPaper(
          (previous) =>
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
            ) as EditDraftByPaper
        );
      },
      []
    );

  const editForView =
    editDraftByPaper[viewPaper];

  const newDraftForView =
    draftByPaper[viewPaper];

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