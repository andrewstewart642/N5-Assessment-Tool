import { useCallback, useMemo, useState } from "react";

import type { CourseAssessmentConfig } from "@/course-data/course-configs/CourseConfigTypes";
import type { Paper } from "@/shared-types/AssessmentTypes_TEMP";
import { getBuilderPapers } from "../builder-logic/BuilderPaperTargets";
import {
  buildEmptyPaperValueMap,
  buildPaperValueMap,
  getPaperBooleanValue,
  getPaperStringValue,
  type BuilderPaperBooleanMap,
  type BuilderPaperStringMap,
  type BuilderPaperStringSetterMap,
} from "../builder-logic/BuilderPaperStateMaps";

type UseBuilderPaperSittingStateArgs = {
  courseConfig: CourseAssessmentConfig;
  assessmentDate: string;
};

type StringSetter = React.Dispatch<React.SetStateAction<string>>;
type BooleanSetter = React.Dispatch<React.SetStateAction<boolean>>;

function resolveNextStringValue({
  currentValue,
  nextValueOrUpdater,
}: {
  currentValue: string;
  nextValueOrUpdater: React.SetStateAction<string>;
}): string {
  return typeof nextValueOrUpdater === "function"
    ? nextValueOrUpdater(currentValue)
    : nextValueOrUpdater;
}

function resolveNextBooleanValue({
  currentValue,
  nextValueOrUpdater,
}: {
  currentValue: boolean;
  nextValueOrUpdater: React.SetStateAction<boolean>;
}): boolean {
  return typeof nextValueOrUpdater === "function"
    ? nextValueOrUpdater(currentValue)
    : nextValueOrUpdater;
}

export function useBuilderPaperSittingState({
  courseConfig,
  assessmentDate,
}: UseBuilderPaperSittingStateArgs) {
  const coursePapers = useMemo(() => {
    return getBuilderPapers(courseConfig);
  }, [courseConfig]);

  const [startTimeByPaper, setStartTimeByPaper] =
    useState<BuilderPaperStringMap>(() =>
      buildEmptyPaperValueMap({
        papers: coursePapers,
        value: "",
      })
    );

  const [endTimeByPaper, setEndTimeByPaper] =
    useState<BuilderPaperStringMap>(() =>
      buildEmptyPaperValueMap({
        papers: coursePapers,
        value: "",
      })
    );

  const [coverDateOverrideByPaper, setCoverDateOverrideByPaper] =
    useState<BuilderPaperStringMap>({});

  const [coverDateCustomByPaper, setCoverDateCustomByPaper] =
    useState<BuilderPaperBooleanMap>({});

  const [endTimeManuallyEditedByPaper, setEndTimeManuallyEditedByPaper] =
    useState<BuilderPaperBooleanMap>(() =>
      buildEmptyPaperValueMap({
        papers: coursePapers,
        value: false,
      })
    );

  const coverDateByPaper = useMemo<BuilderPaperStringMap>(() => {
    return buildPaperValueMap({
      papers: coursePapers,
      getValue: (paper) => {
        const isCustom = getPaperBooleanValue({
          paper,
          valuesByPaper: coverDateCustomByPaper,
        });

        if (!isCustom) {
          return assessmentDate;
        }

        return getPaperStringValue({
          paper,
          valuesByPaper: coverDateOverrideByPaper,
          fallback: assessmentDate,
        });
      },
    });
  }, [
    coursePapers,
    assessmentDate,
    coverDateCustomByPaper,
    coverDateOverrideByPaper,
  ]);

  const setStartTimeForPaper = useCallback(
    (paper: Paper, nextValueOrUpdater: React.SetStateAction<string>) => {
      setStartTimeByPaper((prev) => {
        const currentValue = getPaperStringValue({
          paper,
          valuesByPaper: prev,
        });

        return {
          ...prev,
          [paper]: resolveNextStringValue({
            currentValue,
            nextValueOrUpdater,
          }),
        };
      });
    },
    []
  );

  const setEndTimeForPaper = useCallback(
    (paper: Paper, nextValueOrUpdater: React.SetStateAction<string>) => {
      setEndTimeByPaper((prev) => {
        const currentValue = getPaperStringValue({
          paper,
          valuesByPaper: prev,
        });

        return {
          ...prev,
          [paper]: resolveNextStringValue({
            currentValue,
            nextValueOrUpdater,
          }),
        };
      });
    },
    []
  );

  const setCoverDateForPaper = useCallback(
  (paper: Paper, nextValueOrUpdater: React.SetStateAction<string>) => {
    setCoverDateOverrideByPaper((prev) => {
      const currentValue = getPaperStringValue({
        paper,
        valuesByPaper: prev,
      });

      return {
        ...prev,
        [paper]: resolveNextStringValue({
          currentValue,
          nextValueOrUpdater,
        }),
      };
    });
  },
  []
);

  const setCoverDateCustomForPaper = useCallback(
    (paper: Paper, nextValueOrUpdater: React.SetStateAction<boolean>) => {
      setCoverDateCustomByPaper((prev) => {
        const currentValue = getPaperBooleanValue({
          paper,
          valuesByPaper: prev,
        });

        return {
          ...prev,
          [paper]: resolveNextBooleanValue({
            currentValue,
            nextValueOrUpdater,
          }),
        };
      });
    },
    []
  );

  const setEndTimeManuallyEditedForPaper = useCallback(
    (paper: Paper, nextValueOrUpdater: React.SetStateAction<boolean>) => {
      setEndTimeManuallyEditedByPaper((prev) => {
        const currentValue = getPaperBooleanValue({
          paper,
          valuesByPaper: prev,
        });

        return {
          ...prev,
          [paper]: resolveNextBooleanValue({
            currentValue,
            nextValueOrUpdater,
          }),
        };
      });
    },
    []
  );

  /**
   * Temporary legacy aliases.
   *
   * These keep the existing builder, settings panel, persistence and saved
   * assessment loading code working while the real state moves to paper maps.
   */
  const p1StartTime = getPaperStringValue({
    paper: "P1",
    valuesByPaper: startTimeByPaper,
  });

  const p1EndTime = getPaperStringValue({
    paper: "P1",
    valuesByPaper: endTimeByPaper,
  });

  const p2CoverDate = getPaperStringValue({
    paper: "P2",
    valuesByPaper: coverDateOverrideByPaper,
    fallback: assessmentDate,
  });

  const p2StartTime = getPaperStringValue({
    paper: "P2",
    valuesByPaper: startTimeByPaper,
  });

  const p2EndTime = getPaperStringValue({
    paper: "P2",
    valuesByPaper: endTimeByPaper,
  });

  const p2DateCustom = getPaperBooleanValue({
    paper: "P2",
    valuesByPaper: coverDateCustomByPaper,
  });

  const p1EndTimeManuallyEdited = getPaperBooleanValue({
    paper: "P1",
    valuesByPaper: endTimeManuallyEditedByPaper,
  });

  const p2EndTimeManuallyEdited = getPaperBooleanValue({
    paper: "P2",
    valuesByPaper: endTimeManuallyEditedByPaper,
  });

  const setP1StartTime: StringSetter = useCallback(
    (nextValueOrUpdater) => {
      setStartTimeForPaper("P1", nextValueOrUpdater);
    },
    [setStartTimeForPaper]
  );

  const setP1EndTime: StringSetter = useCallback(
    (nextValueOrUpdater) => {
      setEndTimeForPaper("P1", nextValueOrUpdater);
    },
    [setEndTimeForPaper]
  );

  const setP2CoverDate: StringSetter = useCallback(
    (nextValueOrUpdater) => {
      setCoverDateForPaper("P2", nextValueOrUpdater);
    },
    [setCoverDateForPaper]
  );

  const setP2StartTime: StringSetter = useCallback(
    (nextValueOrUpdater) => {
      setStartTimeForPaper("P2", nextValueOrUpdater);
    },
    [setStartTimeForPaper]
  );

  const setP2EndTime: StringSetter = useCallback(
    (nextValueOrUpdater) => {
      setEndTimeForPaper("P2", nextValueOrUpdater);
    },
    [setEndTimeForPaper]
  );

  const setP2DateCustom: BooleanSetter = useCallback(
    (nextValueOrUpdater) => {
      setCoverDateCustomForPaper("P2", nextValueOrUpdater);
    },
    [setCoverDateCustomForPaper]
  );

  const setP1EndTimeManuallyEdited: BooleanSetter = useCallback(
    (nextValueOrUpdater) => {
      setEndTimeManuallyEditedForPaper("P1", nextValueOrUpdater);
    },
    [setEndTimeManuallyEditedForPaper]
  );

  const setP2EndTimeManuallyEdited: BooleanSetter = useCallback(
    (nextValueOrUpdater) => {
      setEndTimeManuallyEditedForPaper("P2", nextValueOrUpdater);
    },
    [setEndTimeManuallyEditedForPaper]
  );

  const endTimeSetterByPaper = useMemo<BuilderPaperStringSetterMap>(() => {
  return buildPaperValueMap({
    papers: coursePapers,
    getValue: (paper) => {
      return (nextValueOrUpdater: React.SetStateAction<string>) => {
        setEndTimeForPaper(paper, nextValueOrUpdater);
      };
    },
  });
}, [coursePapers, setEndTimeForPaper]);

  return {
    coverDateByPaper,
    startTimeByPaper,
    endTimeByPaper,
    endTimeManuallyEditedByPaper,
    endTimeSetterByPaper,
    coverDateCustomByPaper,

    setCoverDateByPaper: setCoverDateOverrideByPaper,
    setStartTimeByPaper,
    setEndTimeByPaper,
    setCoverDateCustomByPaper,
    setEndTimeManuallyEditedByPaper,

    setStartTimeForPaper,
    setEndTimeForPaper,
    setCoverDateForPaper,
    setCoverDateCustomForPaper,
    setEndTimeManuallyEditedForPaper,

    p1StartTime,
    p1EndTime,
    p2CoverDate,
    p2StartTime,
    p2EndTime,
    p2DateCustom,
    p1EndTimeManuallyEdited,
    p2EndTimeManuallyEdited,

    setP1StartTime,
    setP1EndTime,
    setP2CoverDate,
    setP2StartTime,
    setP2EndTime,
    setP2DateCustom,
    setP1EndTimeManuallyEdited,
    setP2EndTimeManuallyEdited,
  };
}