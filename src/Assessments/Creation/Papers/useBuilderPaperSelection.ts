"use client";

import {
  useCallback,
  useMemo,
  useState,
  type SetStateAction,
} from "react";

import type { CourseAssessmentConfig } from "@/course-data/course-configs/CourseConfigTypes";

import type {
  Paper,
} from "@/shared-types/AssessmentTypes";

import {
  getDefaultBuilderPaper,
} from "@/app/create-assessment/builder/builder-logic/BuilderPaperTargets";

type UseBuilderPaperSelectionArgs = {
  courseConfig: CourseAssessmentConfig;
};

export function useBuilderPaperSelection({
  courseConfig,
}: UseBuilderPaperSelectionArgs) {
  const defaultBuilderPaper =
    useMemo(() => {
      return getDefaultBuilderPaper(
        courseConfig
      );
    }, [courseConfig]);

  const [
    activePaper,
    setActivePaper,
  ] = useState<Paper>(
    defaultBuilderPaper
  );

  const [
    viewPaper,
    setViewPaper,
  ] = useState<Paper>(
    defaultBuilderPaper
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

        setActivePaper(nextPaper);
        setViewPaper(nextPaper);
      },
      [activePaper]
    );

  return {
    defaultBuilderPaper,

    activePaper,
    setActivePaper,

    viewPaper,
    setViewPaper,

    handleActivePaperChange,
  };
}