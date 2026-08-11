import { useCallback, useEffect, useMemo } from "react";

import type { Paper } from "@/shared-types/AssessmentTypes";
import { todayDisplayDate } from "../builder-logic/BuilderDateHelpers";
import { getBuilderPapers } from "../builder-logic/BuilderPaperTargets";
import { calculateBuilderEndTimeForPaper } from "../builder-logic/BuilderPaperTiming";
import {
  buildPaperStringSetterMapFromLegacySetters,
  getPaperBooleanValue,
  getPaperNumberValue,
  getPaperStringSetter,
  getPaperStringValue,
  type BuilderPaperBooleanMap,
  type BuilderPaperNumberMap,
  type BuilderPaperStringMap,
} from "../builder-logic/BuilderPaperStateMaps";

type UseBuilderMetadataTimingArgs = {
  assessmentName: string;
  setAssessmentName: React.Dispatch<React.SetStateAction<string>>;

  assessmentDate: string;
  p2DateCustom: boolean;
  setP2CoverDate: React.Dispatch<React.SetStateAction<string>>;

  marksByPaper: BuilderPaperNumberMap;
  startTimeByPaper: BuilderPaperStringMap;
  endTimeManuallyEditedByPaper: BuilderPaperBooleanMap;

  setP1EndTime: React.Dispatch<React.SetStateAction<string>>;
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

  marksByPaper,
  startTimeByPaper,
  endTimeManuallyEditedByPaper,

  setP1EndTime,
  setP2EndTime,
}: UseBuilderMetadataTimingArgs) {
  const builderPapers = useMemo(() => {
    return getBuilderPapers();
  }, []);

  const endTimeSetterByPaper = useMemo(() => {
    return buildPaperStringSetterMapFromLegacySetters({
      setP1Value: setP1EndTime,
      setP2Value: setP2EndTime,
    });
  }, [setP1EndTime, setP2EndTime]);

  useEffect(() => {
    if (!p2DateCustom) {
      setP2CoverDate(assessmentDate || todayDisplayDate());
    }
  }, [assessmentDate, p2DateCustom, setP2CoverDate]);

  useEffect(() => {
    builderPapers.forEach((paper) => {
      const endTimeHasBeenManuallyEdited = getPaperBooleanValue({
        paper,
        valuesByPaper: endTimeManuallyEditedByPaper,
      });

      if (endTimeHasBeenManuallyEdited) {
        return;
      }

      const setEndTime = getPaperStringSetter({
        paper,
        settersByPaper: endTimeSetterByPaper,
      });

      if (!setEndTime) {
        return;
      }

      setEndTime(
        calculateCoverEndTimeForPaper({
          paper,
          marks: getPaperNumberValue({
            paper,
            valuesByPaper: marksByPaper,
          }),
          startTime: getPaperStringValue({
            paper,
            valuesByPaper: startTimeByPaper,
          }),
        })
      );
    });
  }, [
    builderPapers,
    marksByPaper,
    startTimeByPaper,
    endTimeManuallyEditedByPaper,
    endTimeSetterByPaper,
  ]);

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