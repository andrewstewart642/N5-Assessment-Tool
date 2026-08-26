"use client";

import {
  useCallback,
  useMemo,
  useState,
  type SetStateAction,
} from "react";

import type {
  CourseAssessmentConfig,
} from "@/app/Courses/CourseAssessmentConfig";

import type {
  Paper,
} from "@/app/Assessments/AssessmentTypes";

import {
  getDefaultAssessmentPaper,
} from "./AssessmentPaperRules";

type UseAssessmentPaperSelectionArgs = {
  courseConfig:
    CourseAssessmentConfig;
};

export function useAssessmentPaperSelection({
  courseConfig,
}: UseAssessmentPaperSelectionArgs) {
  const defaultAssessmentPaper =
    useMemo(() => {
      return getDefaultAssessmentPaper(
        courseConfig
      );
    }, [
      courseConfig,
    ]);

  const [
    activePaper,
    setActivePaper,
  ] =
    useState<Paper>(
      defaultAssessmentPaper
    );

  const [
    viewPaper,
    setViewPaper,
  ] =
    useState<Paper>(
      defaultAssessmentPaper
    );

  const handleActivePaperChange =
    useCallback(
      (
        nextValueOrUpdater:
          SetStateAction<Paper>
      ) => {
        const nextPaper =
          typeof nextValueOrUpdater ===
          "function"
            ? nextValueOrUpdater(
                activePaper
              )
            : nextValueOrUpdater;

        setActivePaper(
          nextPaper
        );

        setViewPaper(
          nextPaper
        );
      },
      [
        activePaper,
      ]
    );

  return {
    defaultAssessmentPaper,

    activePaper,
    setActivePaper,

    viewPaper,
    setViewPaper,

    handleActivePaperChange,
  };
}