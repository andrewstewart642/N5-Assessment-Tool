import {
  useEffect,
  useMemo,
} from "react";

import type {
  CourseAssessmentConfig,
} from "@/app/Courses/CourseAssessmentConfig";

import {
  getAssessmentPapers,
} from "./PaperRules";

import {
  calculateAssessmentPaperEndTimeFromDuration,
} from "./TimeCalculations";

import {
  getAssessmentPaperBooleanValue,
  getAssessmentPaperNumberValue,
  getAssessmentPaperStringSetter,
  getAssessmentPaperStringValue,
  type AssessmentPaperBooleanMap,
  type AssessmentPaperNumberMap,
  type AssessmentPaperStringMap,
  type AssessmentPaperStringSetterMap,
} from "./PaperSpecificValues";


type UseAssessmentPaperAutomaticTimingArgs = {
  courseConfig:
    CourseAssessmentConfig;

  intendedDurationMinutesByPaper:
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

  intendedDurationMinutesByPaper,

  startTimeByPaper,

  endTimeManuallyEditedByPaper,

  endTimeSetterByPaper,
}: UseAssessmentPaperAutomaticTimingArgs) {
  const coursePapers =
    useMemo(
      () => {
        return getAssessmentPapers(
          courseConfig
        );
      },
      [
        courseConfig,
      ]
    );

  useEffect(() => {
    coursePapers.forEach(
      (
        paper
      ) => {
        /*
         * Teacher autonomy wins.
         *
         * Once the teacher manually changes the
         * End field for this paper, automatic
         * end-time calculation stops touching it.
         */
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

        /*
         * Crucially, this value comes from the
         * assessment's intended setup target.
         *
         * It is NOT the marks currently achieved
         * in the HUD / live question collection.
         */
        const durationMinutes =
          getAssessmentPaperNumberValue({
            paper,

            valuesByPaper:
              intendedDurationMinutesByPaper,
          });

        if (
          durationMinutes <= 0
        ) {
          setEndTime(
            ""
          );

          return;
        }

        setEndTime(
          calculateAssessmentPaperEndTimeFromDuration({
            startTime,

            durationMinutes,
          })
        );
      }
    );
  }, [
    coursePapers,

    intendedDurationMinutesByPaper,

    startTimeByPaper,

    endTimeManuallyEditedByPaper,

    endTimeSetterByPaper,
  ]);
}