import { useMemo } from "react";

import type { Paper } from "@/shared-types/AssessmentTypes";
import {
  getPaperStringValue,
  type BuilderPaperStringMap,
} from "../builder-logic/BuilderPaperStateMaps";

type UsePaperViewMetadataArgs = {
  viewPaper: Paper;
  coverDateByPaper: BuilderPaperStringMap;
  startTimeByPaper: BuilderPaperStringMap;
  endTimeByPaper: BuilderPaperStringMap;
  fallbackCoverDate: string;
};

function buildCoverTimeText({
  startTime,
  endTime,
}: {
  startTime: string;
  endTime: string;
}): string {
  const cleanStartTime = startTime.trim();
  const cleanEndTime = endTime.trim();

  if (!cleanStartTime && !cleanEndTime) {
    return "";
  }

  if (cleanStartTime && cleanEndTime) {
    return `${cleanStartTime} - ${cleanEndTime}`;
  }

  return cleanStartTime || cleanEndTime;
}

export function usePaperViewMetadata({
  viewPaper,
  coverDateByPaper,
  startTimeByPaper,
  endTimeByPaper,
  fallbackCoverDate,
}: UsePaperViewMetadataArgs) {
  const coverDateTextForView = useMemo(() => {
    const dateForPaper = getPaperStringValue({
      paper: viewPaper,
      valuesByPaper: coverDateByPaper,
      fallback: fallbackCoverDate,
    });

    return dateForPaper.trim() ? dateForPaper : fallbackCoverDate;
  }, [viewPaper, coverDateByPaper, fallbackCoverDate]);

  const coverTimeTextForView = useMemo(() => {
    return buildCoverTimeText({
      startTime: getPaperStringValue({
        paper: viewPaper,
        valuesByPaper: startTimeByPaper,
      }),
      endTime: getPaperStringValue({
        paper: viewPaper,
        valuesByPaper: endTimeByPaper,
      }),
    });
  }, [viewPaper, startTimeByPaper, endTimeByPaper]);

  return {
    coverDateTextForView,
    coverTimeTextForView,
  };
}