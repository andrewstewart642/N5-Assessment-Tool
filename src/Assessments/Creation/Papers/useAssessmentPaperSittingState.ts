"use client";

import {
  useCallback,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

import type {
  CourseAssessmentConfig,
} from "@/course-data/course-configs/CourseConfigTypes";

import type {
  Paper,
} from "@/shared-types/AssessmentTypes";

import {
  getAssessmentPapers,
} from "./AssessmentPaperRules";

import {
  buildAssessmentPaperValueMap,
  buildEmptyAssessmentPaperValueMap,
  getAssessmentPaperBooleanValue,
  getAssessmentPaperStringValue,
  type AssessmentPaperBooleanMap,
  type AssessmentPaperStringMap,
  type AssessmentPaperStringSetterMap,
} from "./AssessmentPaperValueMaps";

type UseAssessmentPaperSittingStateArgs = {
  courseConfig:
    CourseAssessmentConfig;

  assessmentDate:
    string;
};

type StringSetter =
  Dispatch<
    SetStateAction<string>
  >;

type BooleanSetter =
  Dispatch<
    SetStateAction<boolean>
  >;

function resolveNextStringValue({
  currentValue,
  nextValueOrUpdater,
}: {
  currentValue:
    string;

  nextValueOrUpdater:
    SetStateAction<string>;
}): string {
  return typeof nextValueOrUpdater ===
    "function"
    ? nextValueOrUpdater(
        currentValue
      )
    : nextValueOrUpdater;
}

function resolveNextBooleanValue({
  currentValue,
  nextValueOrUpdater,
}: {
  currentValue:
    boolean;

  nextValueOrUpdater:
    SetStateAction<boolean>;
}): boolean {
  return typeof nextValueOrUpdater ===
    "function"
    ? nextValueOrUpdater(
        currentValue
      )
    : nextValueOrUpdater;
}

export function useAssessmentPaperSittingState({
  courseConfig,
  assessmentDate,
}: UseAssessmentPaperSittingStateArgs) {
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

  const [
    startTimeByPaper,
    setStartTimeByPaper,
  ] =
    useState<AssessmentPaperStringMap>(
      () =>
        buildEmptyAssessmentPaperValueMap({
          papers:
            coursePapers,

          value:
            "",
        })
    );

  const [
    endTimeByPaper,
    setEndTimeByPaper,
  ] =
    useState<AssessmentPaperStringMap>(
      () =>
        buildEmptyAssessmentPaperValueMap({
          papers:
            coursePapers,

          value:
            "",
        })
    );

  const [
    coverDateOverrideByPaper,
    setCoverDateOverrideByPaper,
  ] =
    useState<AssessmentPaperStringMap>(
      {}
    );

  const [
    coverDateCustomByPaper,
    setCoverDateCustomByPaper,
  ] =
    useState<AssessmentPaperBooleanMap>(
      {}
    );

  const [
    endTimeManuallyEditedByPaper,
    setEndTimeManuallyEditedByPaper,
  ] =
    useState<AssessmentPaperBooleanMap>(
      () =>
        buildEmptyAssessmentPaperValueMap({
          papers:
            coursePapers,

          value:
            false,
        })
    );

  const coverDateByPaper =
    useMemo<AssessmentPaperStringMap>(
      () => {
        return buildAssessmentPaperValueMap({
          papers:
            coursePapers,

          getValue:
            (
              paper
            ) => {
              const isCustom =
                getAssessmentPaperBooleanValue({
                  paper,

                  valuesByPaper:
                    coverDateCustomByPaper,
                });

              if (
                !isCustom
              ) {
                return assessmentDate;
              }

              return getAssessmentPaperStringValue({
                paper,

                valuesByPaper:
                  coverDateOverrideByPaper,

                fallback:
                  assessmentDate,
              });
            },
        });
      },
      [
        coursePapers,
        assessmentDate,
        coverDateCustomByPaper,
        coverDateOverrideByPaper,
      ]
    );

  const setStartTimeForPaper =
    useCallback(
      (
        paper: Paper,
        nextValueOrUpdater:
          SetStateAction<string>
      ) => {
        setStartTimeByPaper(
          (
            previous
          ) => {
            const currentValue =
              getAssessmentPaperStringValue({
                paper,

                valuesByPaper:
                  previous,
              });

            return {
              ...previous,

              [paper]:
                resolveNextStringValue({
                  currentValue,
                  nextValueOrUpdater,
                }),
            };
          }
        );
      },
      []
    );

  const setEndTimeForPaper =
    useCallback(
      (
        paper: Paper,
        nextValueOrUpdater:
          SetStateAction<string>
      ) => {
        setEndTimeByPaper(
          (
            previous
          ) => {
            const currentValue =
              getAssessmentPaperStringValue({
                paper,

                valuesByPaper:
                  previous,
              });

            return {
              ...previous,

              [paper]:
                resolveNextStringValue({
                  currentValue,
                  nextValueOrUpdater,
                }),
            };
          }
        );
      },
      []
    );

  const setCoverDateForPaper =
    useCallback(
      (
        paper: Paper,
        nextValueOrUpdater:
          SetStateAction<string>
      ) => {
        setCoverDateOverrideByPaper(
          (
            previous
          ) => {
            const currentValue =
              getAssessmentPaperStringValue({
                paper,

                valuesByPaper:
                  previous,
              });

            return {
              ...previous,

              [paper]:
                resolveNextStringValue({
                  currentValue,
                  nextValueOrUpdater,
                }),
            };
          }
        );
      },
      []
    );

  const setCoverDateCustomForPaper =
    useCallback(
      (
        paper: Paper,
        nextValueOrUpdater:
          SetStateAction<boolean>
      ) => {
        setCoverDateCustomByPaper(
          (
            previous
          ) => {
            const currentValue =
              getAssessmentPaperBooleanValue({
                paper,

                valuesByPaper:
                  previous,
              });

            return {
              ...previous,

              [paper]:
                resolveNextBooleanValue({
                  currentValue,
                  nextValueOrUpdater,
                }),
            };
          }
        );
      },
      []
    );

  const setEndTimeManuallyEditedForPaper =
    useCallback(
      (
        paper: Paper,
        nextValueOrUpdater:
          SetStateAction<boolean>
      ) => {
        setEndTimeManuallyEditedByPaper(
          (
            previous
          ) => {
            const currentValue =
              getAssessmentPaperBooleanValue({
                paper,

                valuesByPaper:
                  previous,
              });

            return {
              ...previous,

              [paper]:
                resolveNextBooleanValue({
                  currentValue,
                  nextValueOrUpdater,
                }),
            };
          }
        );
      },
      []
    );

  /*
   * Transitional first/second-paper aliases.
   *
   * Persistence still exposes historical
   * P1/P2 fields while that layer is being
   * migrated.
   */

  const p1StartTime =
    getAssessmentPaperStringValue({
      paper:
        firstPaper,

      valuesByPaper:
        startTimeByPaper,
    });

  const p1EndTime =
    getAssessmentPaperStringValue({
      paper:
        firstPaper,

      valuesByPaper:
        endTimeByPaper,
    });

  const p2CoverDate =
    getAssessmentPaperStringValue({
      paper:
        secondPaper,

      valuesByPaper:
        coverDateOverrideByPaper,

      fallback:
        assessmentDate,
    });

  const p2StartTime =
    getAssessmentPaperStringValue({
      paper:
        secondPaper,

      valuesByPaper:
        startTimeByPaper,
    });

  const p2EndTime =
    getAssessmentPaperStringValue({
      paper:
        secondPaper,

      valuesByPaper:
        endTimeByPaper,
    });

  const p2DateCustom =
    getAssessmentPaperBooleanValue({
      paper:
        secondPaper,

      valuesByPaper:
        coverDateCustomByPaper,
    });

  const setP1StartTime:
    StringSetter =
      useCallback(
        (
          nextValueOrUpdater
        ) => {
          setStartTimeForPaper(
            firstPaper,
            nextValueOrUpdater
          );
        },
        [
          firstPaper,
          setStartTimeForPaper,
        ]
      );

  const setP1EndTime:
    StringSetter =
      useCallback(
        (
          nextValueOrUpdater
        ) => {
          setEndTimeForPaper(
            firstPaper,
            nextValueOrUpdater
          );
        },
        [
          firstPaper,
          setEndTimeForPaper,
        ]
      );

  const setP2CoverDate:
    StringSetter =
      useCallback(
        (
          nextValueOrUpdater
        ) => {
          setCoverDateForPaper(
            secondPaper,
            nextValueOrUpdater
          );
        },
        [
          secondPaper,
          setCoverDateForPaper,
        ]
      );

  const setP2StartTime:
    StringSetter =
      useCallback(
        (
          nextValueOrUpdater
        ) => {
          setStartTimeForPaper(
            secondPaper,
            nextValueOrUpdater
          );
        },
        [
          secondPaper,
          setStartTimeForPaper,
        ]
      );

  const setP2EndTime:
    StringSetter =
      useCallback(
        (
          nextValueOrUpdater
        ) => {
          setEndTimeForPaper(
            secondPaper,
            nextValueOrUpdater
          );
        },
        [
          secondPaper,
          setEndTimeForPaper,
        ]
      );

  const setP2DateCustom:
    BooleanSetter =
      useCallback(
        (
          nextValueOrUpdater
        ) => {
          setCoverDateCustomForPaper(
            secondPaper,
            nextValueOrUpdater
          );
        },
        [
          secondPaper,
          setCoverDateCustomForPaper,
        ]
      );

  const setP1EndTimeManuallyEdited:
    BooleanSetter =
      useCallback(
        (
          nextValueOrUpdater
        ) => {
          setEndTimeManuallyEditedForPaper(
            firstPaper,
            nextValueOrUpdater
          );
        },
        [
          firstPaper,
          setEndTimeManuallyEditedForPaper,
        ]
      );

  const setP2EndTimeManuallyEdited:
    BooleanSetter =
      useCallback(
        (
          nextValueOrUpdater
        ) => {
          setEndTimeManuallyEditedForPaper(
            secondPaper,
            nextValueOrUpdater
          );
        },
        [
          secondPaper,
          setEndTimeManuallyEditedForPaper,
        ]
      );

  const endTimeSetterByPaper =
    useMemo<AssessmentPaperStringSetterMap>(
      () => {
        return buildAssessmentPaperValueMap({
          papers:
            coursePapers,

          getValue:
            (
              paper
            ) => {
              return (
                nextValueOrUpdater:
                  SetStateAction<string>
              ) => {
                setEndTimeForPaper(
                  paper,
                  nextValueOrUpdater
                );
              };
            },
        });
      },
      [
        coursePapers,
        setEndTimeForPaper,
      ]
    );

  return {
    coverDateByPaper,
    startTimeByPaper,
    endTimeByPaper,

    endTimeManuallyEditedByPaper,
    endTimeSetterByPaper,

    coverDateCustomByPaper,

    setCoverDateByPaper:
      setCoverDateOverrideByPaper,

    setStartTimeByPaper,
    setEndTimeByPaper,

    setCoverDateCustomByPaper,

    setEndTimeManuallyEditedByPaper,

    setStartTimeForPaper,
    setEndTimeForPaper,

    setCoverDateForPaper,
    setCoverDateCustomForPaper,

    setEndTimeManuallyEditedForPaper,

    p1StartTime,
    p1EndTime,

    p2CoverDate,
    p2StartTime,
    p2EndTime,

    p2DateCustom,

    setP1StartTime,
    setP1EndTime,

    setP2CoverDate,
    setP2StartTime,
    setP2EndTime,

    setP2DateCustom,

    setP1EndTimeManuallyEdited,
    setP2EndTimeManuallyEdited,
  };
}