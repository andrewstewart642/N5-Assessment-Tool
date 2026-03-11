import { useMemo } from "react";
import type { Paper } from "@/shared-types/AssessmentTypes";
import { buildTimeRange, formatCoverDate } from "../builder-logic/BuilderDateHelpers";

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
  const coverDateTextForView = useMemo(() => {
    return viewPaper === "P1"
      ? formatCoverDate(assessmentDate)
      : formatCoverDate(p2DateCustom ? p2CoverDate : assessmentDate);
  }, [viewPaper, assessmentDate, p2CoverDate, p2DateCustom]);

  const coverTimeTextForView = useMemo(() => {
    return viewPaper === "P1"
      ? buildTimeRange(p1StartTime, p1EndTime)
      : buildTimeRange(p2StartTime, p2EndTime);
  }, [viewPaper, p1StartTime, p1EndTime, p2StartTime, p2EndTime]);

  return {
    coverDateTextForView,
    coverTimeTextForView,
  };
}