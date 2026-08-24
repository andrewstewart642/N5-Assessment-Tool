import { useCallback, useEffect, useMemo } from "react";

import type { Paper } from "@/shared-types/AssessmentTypes_TEMP";
import { getBuilderPapers } from "../builder-logic/BuilderPaperTargets";
import { calculateBuilderEndTimeForPaper } from "../builder-logic/BuilderPaperTiming";
import {
  getPaperBooleanValue,
  getPaperNumberValue,
  getPaperStringSetter,
  getPaperStringValue,
  type BuilderPaperBooleanMap,
  type BuilderPaperNumberMap,
  type BuilderPaperStringMap,
  type BuilderPaperStringSetterMap,
} from "../builder-logic/BuilderPaperStateMaps";

type UseBuilderMetadataTimingArgs = {
  assessmentName: string;
  setAssessmentName: React.Dispatch<React.SetStateAction<string>>;

  marksByPaper: BuilderPaperNumberMap;
  startTimeByPaper: BuilderPaperStringMap;
  endTimeManuallyEditedByPaper: BuilderPaperBooleanMap;
  endTimeSetterByPaper: BuilderPaperStringSetterMap;
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

  marksByPaper,
  startTimeByPaper,
  endTimeManuallyEditedByPaper,
  endTimeSetterByPaper,
}: UseBuilderMetadataTimingArgs) {
  const builderPapers = useMemo(() => {
    return getBuilderPapers();
  }, []);

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