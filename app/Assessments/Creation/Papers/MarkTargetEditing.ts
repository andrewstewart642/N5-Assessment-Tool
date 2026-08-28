
import {
  useCallback,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

import type {
  CourseAssessmentConfig,
} from "@/app/Courses/CourseAssessmentConfig";

import type {
  Paper,
} from "@/app/Assessments/AssessmentTypes";

import {
  getAssessmentPapers,
  getDefaultTargetMarksForAssessmentPaper,
} from "./PaperRules";

import {
  buildDefaultAssessmentTargetMarksByPaper,
  normaliseAssessmentTargetMarksByPaper,
  type AssessmentTargetMarksByPaper,
} from "./MarkTargetCalculations";

type UseAssessmentPaperTargetStateArgs = {
  courseConfig:
    CourseAssessmentConfig;
};

type TargetMarksSetter =
  Dispatch<
    SetStateAction<number>
  >;

function resolveNextTargetMarksValue({
  currentValue,
  nextValueOrUpdater,
}: {
  currentValue:
    number;

  nextValueOrUpdater:
    SetStateAction<number>;
}): number {
  return typeof nextValueOrUpdater ===
    "function"
    ? nextValueOrUpdater(
        currentValue
      )
    : nextValueOrUpdater;
}

export function useAssessmentPaperTargetState({
  courseConfig,
}: UseAssessmentPaperTargetStateArgs) {
  const coursePapers =
    useMemo(() => {
      return getAssessmentPapers(
        courseConfig
      );
    }, [
      courseConfig,
    ]);

  const firstPaper =
    coursePapers[0] ??
    "P1";

  const secondPaper =
    coursePapers[1] ??
    coursePapers[0] ??
    "P2";

  const defaultTargetMarksByPaper =
    useMemo(() => {
      return buildDefaultAssessmentTargetMarksByPaper(
        courseConfig
      );
    }, [
      courseConfig,
    ]);

  const [
    rawTargetMarksByPaper,
    setRawTargetMarksByPaper,
  ] =
    useState<AssessmentTargetMarksByPaper>(
      () =>
        defaultTargetMarksByPaper
    );

  const targetMarksByPaper =
    useMemo(() => {
      return normaliseAssessmentTargetMarksByPaper({
        targetMarksByPaper:
          rawTargetMarksByPaper,

        courseConfig,
      });
    }, [
      rawTargetMarksByPaper,
      courseConfig,
    ]);

  const setTargetMarksByPaper =
    useCallback(
      (
        nextTargetMarksByPaper:
          AssessmentTargetMarksByPaper
      ) => {
        setRawTargetMarksByPaper(
          nextTargetMarksByPaper
        );
      },
      []
    );

  const setTargetMarksForPaper =
    useCallback(
      (
        paper: Paper,
        nextValueOrUpdater:
          SetStateAction<number>
      ) => {
        setRawTargetMarksByPaper(
          (previous) => {
            const storedValue =
              previous[
                paper
              ];

            const currentValue =
              typeof storedValue ===
                "number" &&
              Number.isFinite(
                storedValue
              )
                ? storedValue
                : getDefaultTargetMarksForAssessmentPaper(
                    paper,
                    courseConfig
                  );

            const nextValue =
              resolveNextTargetMarksValue({
                currentValue,
                nextValueOrUpdater,
              });

            return {
              ...previous,

              [paper]:
                nextValue,
            };
          }
        );
      },
      [
        courseConfig,
      ]
    );

  const getTargetMarksForPaper =
    useCallback(
      (
        paper: Paper
      ): number => {
        const value =
          targetMarksByPaper[
            paper
          ];

        return (
          typeof value ===
            "number" &&
          Number.isFinite(
            value
          )
        )
          ? value
          : getDefaultTargetMarksForAssessmentPaper(
              paper,
              courseConfig
            );
      },
      [
        targetMarksByPaper,
        courseConfig,
      ]
    );

  /*
   * Transitional aliases.
   *
   * Existing persistence and autosave
   * still describe the first and second
   * configured papers as P1/P2.
   */
  const p1Target =
    getTargetMarksForPaper(
      firstPaper
    );

  const p2Target =
    getTargetMarksForPaper(
      secondPaper
    );

  const setP1Target:
    TargetMarksSetter =
      useCallback(
        (
          nextValueOrUpdater
        ) => {
          setTargetMarksForPaper(
            firstPaper,
            nextValueOrUpdater
          );
        },
        [
          firstPaper,
          setTargetMarksForPaper,
        ]
      );

  const setP2Target:
    TargetMarksSetter =
      useCallback(
        (
          nextValueOrUpdater
        ) => {
          setTargetMarksForPaper(
            secondPaper,
            nextValueOrUpdater
          );
        },
        [
          secondPaper,
          setTargetMarksForPaper,
        ]
      );

  return {
    targetMarksByPaper,
    setTargetMarksByPaper,

    setTargetMarksForPaper,
    getTargetMarksForPaper,

    p1Target,
    p2Target,

    setP1Target,
    setP2Target,
  };
}