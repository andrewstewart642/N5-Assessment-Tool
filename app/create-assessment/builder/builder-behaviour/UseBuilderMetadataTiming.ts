import { useCallback, useEffect } from "react";

import { todayDisplayDate } from "../builder-logic/BuilderDateHelpers";
import { calculateBuilderEndTimeForPaper } from "../builder-logic/BuilderPaperTiming";
import type { Paper } from "@/shared-types/AssessmentTypes";

type UseBuilderMetadataTimingArgs = {
  assessmentName: string;
  setAssessmentName: React.Dispatch<React.SetStateAction<string>>;

  assessmentDate: string;
  p2DateCustom: boolean;
  setP2CoverDate: React.Dispatch<React.SetStateAction<string>>;

  p1StartTime: string;
  p1Marks: number;
  p1EndTimeManuallyEdited: boolean;
  setP1EndTime: React.Dispatch<React.SetStateAction<string>>;

  p2StartTime: string;
  p2Marks: number;
  p2EndTimeManuallyEdited: boolean;
  setP2EndTime: React.Dispatch<React.SetStateAction<string>>;
};

function calculateCoverEndTimeForPaper({
  paper,
  marks,
  startTime,
}: {
  paper: Paper;
  marks: number;
  startTime: string;
}): string {
  if (!startTime.trim()) {
    return "";
  }

  return calculateBuilderEndTimeForPaper({
    paper,
    marks,
    startTime,
  });
}

export function useBuilderMetadataTiming({
  assessmentName,
  setAssessmentName,

  assessmentDate,
  p2DateCustom,
  setP2CoverDate,

  p1StartTime,
  p1Marks,
  p1EndTimeManuallyEdited,
  setP1EndTime,

  p2StartTime,
  p2Marks,
  p2EndTimeManuallyEdited,
  setP2EndTime,
}: UseBuilderMetadataTimingArgs) {
  useEffect(() => {
    if (!p2DateCustom) {
      setP2CoverDate(assessmentDate || todayDisplayDate());
    }
  }, [assessmentDate, p2DateCustom, setP2CoverDate]);

  useEffect(() => {
    if (p1EndTimeManuallyEdited) return;

    setP1EndTime(
      calculateCoverEndTimeForPaper({
        paper: "P1",
        marks: p1Marks,
        startTime: p1StartTime,
      })
    );
  }, [p1Marks, p1StartTime, p1EndTimeManuallyEdited, setP1EndTime]);

  useEffect(() => {
    if (p2EndTimeManuallyEdited) return;

    setP2EndTime(
      calculateCoverEndTimeForPaper({
        paper: "P2",
        marks: p2Marks,
        startTime: p2StartTime,
      })
    );
  }, [p2Marks, p2StartTime, p2EndTimeManuallyEdited, setP2EndTime]);

  const handleAssessmentNameFocus = useCallback(() => {
    if (assessmentName === "[Untitled file]") {
      setAssessmentName("");
    }
  }, [assessmentName, setAssessmentName]);

  const handleAssessmentNameBlur = useCallback(() => {
    if (!assessmentName.trim().length) {
      setAssessmentName("[Untitled file]");
    }
  }, [assessmentName, setAssessmentName]);

  return {
    handleAssessmentNameFocus,
    handleAssessmentNameBlur,
  };
}