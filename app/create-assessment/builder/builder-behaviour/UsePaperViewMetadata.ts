import { useMemo } from "react";

import type { Paper } from "@/shared-types/AssessmentTypes";
import {
  buildPaperStringMapFromLegacyValues,
  getPaperStringValue,
} from "../builder-logic/BuilderPaperStateMaps";

type UsePaperViewMetadataArgs = {
  viewPaper: Paper;

  assessmentDate: string;
  p2CoverDate: string;
  p2DateCustom: boolean;

  p1StartTime: string;
  p1EndTime: string;
  p2StartTime: string;
  p2EndTime: string;
};

function buildCoverDateByPaper({
  assessmentDate,
  p2CoverDate,
  p2DateCustom,
}: {
  assessmentDate: string;
  p2CoverDate: string;
  p2DateCustom: boolean;
}) {
  return buildPaperStringMapFromLegacyValues({
    p1Value: assessmentDate,
    p2Value: p2DateCustom ? p2CoverDate : assessmentDate,
  });
}

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

  assessmentDate,
  p2CoverDate,
  p2DateCustom,

  p1StartTime,
  p1EndTime,
  p2StartTime,
  p2EndTime,
}: UsePaperViewMetadataArgs) {
  const coverDateByPaper = useMemo(() => {
    return buildCoverDateByPaper({
      assessmentDate,
      p2CoverDate,
      p2DateCustom,
    });
  }, [assessmentDate, p2CoverDate, p2DateCustom]);

  const startTimeByPaper = useMemo(() => {
    return buildPaperStringMapFromLegacyValues({
      p1Value: p1StartTime,
      p2Value: p2StartTime,
    });
  }, [p1StartTime, p2StartTime]);

  const endTimeByPaper = useMemo(() => {
    return buildPaperStringMapFromLegacyValues({
      p1Value: p1EndTime,
      p2Value: p2EndTime,
    });
  }, [p1EndTime, p2EndTime]);

  const coverDateTextForView = useMemo(() => {
    return getPaperStringValue({
      paper: viewPaper,
      valuesByPaper: coverDateByPaper,
      fallback: assessmentDate,
    });
  }, [viewPaper, coverDateByPaper, assessmentDate]);

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