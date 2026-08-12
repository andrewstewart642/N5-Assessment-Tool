import { useMemo } from "react";

import {
  buildPaperBooleanMapFromLegacyValues,
  buildPaperStringMapFromLegacyValues,
  buildPaperStringSetterMapFromLegacySetters,
} from "../builder-logic/BuilderPaperStateMaps";

type UseBuilderPaperMetadataMapsArgs = {
  assessmentDate: string;

  p1StartTime: string;
  p1EndTime: string;
  p1EndTimeManuallyEdited: boolean;
  setP1EndTime: React.Dispatch<React.SetStateAction<string>>;

  p2CoverDate: string;
  p2DateCustom: boolean;
  p2StartTime: string;
  p2EndTime: string;
  p2EndTimeManuallyEdited: boolean;
  setP2EndTime: React.Dispatch<React.SetStateAction<string>>;
};

export function useBuilderPaperMetadataMaps({
  assessmentDate,

  p1StartTime,
  p1EndTime,
  p1EndTimeManuallyEdited,
  setP1EndTime,

  p2CoverDate,
  p2DateCustom,
  p2StartTime,
  p2EndTime,
  p2EndTimeManuallyEdited,
  setP2EndTime,
}: UseBuilderPaperMetadataMapsArgs) {
  const coverDateByPaper = useMemo(() => {
    return buildPaperStringMapFromLegacyValues({
      p1Value: assessmentDate,
      p2Value: p2DateCustom ? p2CoverDate : assessmentDate,
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

  const endTimeManuallyEditedByPaper = useMemo(() => {
    return buildPaperBooleanMapFromLegacyValues({
      p1Value: p1EndTimeManuallyEdited,
      p2Value: p2EndTimeManuallyEdited,
    });
  }, [p1EndTimeManuallyEdited, p2EndTimeManuallyEdited]);

  const endTimeSetterByPaper = useMemo(() => {
    return buildPaperStringSetterMapFromLegacySetters({
      setP1Value: setP1EndTime,
      setP2Value: setP2EndTime,
    });
  }, [setP1EndTime, setP2EndTime]);

  return {
    coverDateByPaper,
    startTimeByPaper,
    endTimeByPaper,
    endTimeManuallyEditedByPaper,
    endTimeSetterByPaper,
  };
}