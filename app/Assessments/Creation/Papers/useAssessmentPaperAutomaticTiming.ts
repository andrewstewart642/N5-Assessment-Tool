"use client";

import {
  useEffect,
  useMemo,
} from "react";

import type {
  CourseAssessmentConfig,
} from "@/app/Courses/CourseAssessmentConfig";

import {
  getAssessmentPapers,
} from "./AssessmentPaperRules";

import {
  calculateAssessmentPaperEndTime,
} from "./AssessmentPaperTiming";

import {
  getAssessmentPaperBooleanValue,
  getAssessmentPaperNumberValue,
  getAssessmentPaperStringSetter,
  getAssessmentPaperStringValue,
  type AssessmentPaperBooleanMap,
  type AssessmentPaperNumberMap,
  type AssessmentPaperStringMap,
  type AssessmentPaperStringSetterMap,
} from "./AssessmentPaperValueMaps";

type UseAssessmentPaperAutomaticTimingArgs = {
  courseConfig:
    CourseAssessmentConfig;

  marksByPaper:
    AssessmentPaperNumberMap;

  startTimeByPaper:
    AssessmentPaperStringMap;

  endTimeManuallyEditedByPaper:
    AssessmentPaperBooleanMap;

  endTimeSetterByPaper:
    AssessmentPaperStringSetterMap;
};

export function useAssessmentPaperAutomaticTiming({
  courseConfig,
  marksByPaper,
  startTimeByPaper,
  endTimeManuallyEditedByPaper,
  endTimeSetterByPaper,
}: UseAssessmentPaperAutomaticTimingArgs) {
  const coursePapers =
    useMemo(() => {
      return getAssessmentPapers(
        courseConfig
      );
    }, [
      courseConfig,
    ]);

  useEffect(() => {
    coursePapers.forEach(
      (
        paper
      ) => {
        const hasManualEndTime =
          getAssessmentPaperBooleanValue({
            paper,

            valuesByPaper:
              endTimeManuallyEditedByPaper,
          });

        if (
          hasManualEndTime
        ) {
          return;
        }

        const setEndTime =
          getAssessmentPaperStringSetter({
            paper,

            settersByPaper:
              endTimeSetterByPaper,
          });

        if (
          !setEndTime
        ) {
          return;
        }

        const startTime =
          getAssessmentPaperStringValue({
            paper,

            valuesByPaper:
              startTimeByPaper,
          });

        if (
          !startTime.trim()
        ) {
          setEndTime(
            ""
          );

          return;
        }

        const marks =
          getAssessmentPaperNumberValue({
            paper,

            valuesByPaper:
              marksByPaper,
          });

        setEndTime(
          calculateAssessmentPaperEndTime({
            paper,
            marks,
            startTime,
            courseConfig,
          })
        );
      }
    );
  }, [
    coursePapers,
    courseConfig,
    marksByPaper,
    startTimeByPaper,
    endTimeManuallyEditedByPaper,
    endTimeSetterByPaper,
  ]);
}