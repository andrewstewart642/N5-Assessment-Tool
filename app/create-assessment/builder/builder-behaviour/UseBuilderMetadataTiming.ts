import { useCallback, useEffect } from "react";

import { calculateEndTime } from "../AssessmentTiming";
import { todayDisplayDate } from "../builder-logic/BuilderDateHelpers";

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

    if (!p1StartTime.trim()) {
      setP1EndTime("");
      return;
    }

    setP1EndTime(calculateEndTime("N5", "paper1", p1Marks, p1StartTime));
  }, [p1Marks, p1StartTime, p1EndTimeManuallyEdited, setP1EndTime]);

  useEffect(() => {
    if (p2EndTimeManuallyEdited) return;

    if (!p2StartTime.trim()) {
      setP2EndTime("");
      return;
    }

    setP2EndTime(calculateEndTime("N5", "paper2", p2Marks, p2StartTime));
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