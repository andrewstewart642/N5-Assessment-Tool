import {
  useMemo,
} from "react";

import type {
  Paper,
} from "@/src/Assessments/AssessmentTypes";

import {
  getAssessmentPaperStringValue,
  type AssessmentPaperStringMap,
} from "../../Papers/AssessmentPaperValueMaps";

import {
  buildAssessmentTimeRange,
} from "../../AssessmentSettings/AssessmentDateTime";

type UseAssessmentPaperViewMetadataArgs = {
  viewPaper:
    Paper;

  coverDateByPaper:
    AssessmentPaperStringMap;

  startTimeByPaper:
    AssessmentPaperStringMap;

  endTimeByPaper:
    AssessmentPaperStringMap;

  fallbackCoverDate:
    string;
};

export function useAssessmentPaperViewMetadata({
  viewPaper,
  coverDateByPaper,
  startTimeByPaper,
  endTimeByPaper,
  fallbackCoverDate,
}: UseAssessmentPaperViewMetadataArgs) {
  const coverDateTextForView =
    useMemo(() => {
      const dateForPaper =
        getAssessmentPaperStringValue({
          paper:
            viewPaper,

          valuesByPaper:
            coverDateByPaper,

          fallback:
            fallbackCoverDate,
        });

      return dateForPaper.trim()
        ? dateForPaper
        : fallbackCoverDate;
    }, [
      viewPaper,
      coverDateByPaper,
      fallbackCoverDate,
    ]);

  const coverTimeTextForView =
    useMemo(() => {
      return buildAssessmentTimeRange(
        getAssessmentPaperStringValue({
          paper:
            viewPaper,

          valuesByPaper:
            startTimeByPaper,
        }),

        getAssessmentPaperStringValue({
          paper:
            viewPaper,

          valuesByPaper:
            endTimeByPaper,
        })
      );
    }, [
      viewPaper,
      startTimeByPaper,
      endTimeByPaper,
    ]);

  return {
    coverDateTextForView,
    coverTimeTextForView,
  };
}