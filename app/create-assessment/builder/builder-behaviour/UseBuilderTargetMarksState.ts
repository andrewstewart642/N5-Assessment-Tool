import { useCallback, useMemo, useState } from "react";

import type { CourseAssessmentConfig } from "@/course-data/course-configs/CourseConfigTypes";
import type { Paper } from "@/shared-types/AssessmentTypes";
import {
  buildDefaultTargetMarksByPaper,
  getDefaultTargetMarksForPaper,
  normaliseTargetMarksByPaper,
  type BuilderTargetMarksByPaper,
} from "../builder-logic/BuilderPaperTargets";
import { getPaperNumberValue } from "../builder-logic/BuilderPaperStateMaps";

type UseBuilderTargetMarksStateArgs = {
  courseConfig: CourseAssessmentConfig;
};

type TargetMarksSetter = React.Dispatch<React.SetStateAction<number>>;

function resolveNextTargetMarksValue({
  currentValue,
  nextValueOrUpdater,
}: {
  currentValue: number;
  nextValueOrUpdater: React.SetStateAction<number>;
}): number {
  return typeof nextValueOrUpdater === "function"
    ? nextValueOrUpdater(currentValue)
    : nextValueOrUpdater;
}

export function useBuilderTargetMarksState({
  courseConfig,
}: UseBuilderTargetMarksStateArgs) {
  const defaultTargetMarksByPaper = useMemo(() => {
    return buildDefaultTargetMarksByPaper(courseConfig);
  }, [courseConfig]);

  const [rawTargetMarksByPaper, setRawTargetMarksByPaper] =
    useState<BuilderTargetMarksByPaper>(() => defaultTargetMarksByPaper);

  const targetMarksByPaper = useMemo(() => {
    return normaliseTargetMarksByPaper({
      targetMarksByPaper: rawTargetMarksByPaper,
      courseConfig,
    });
  }, [rawTargetMarksByPaper, courseConfig]);

  const setTargetMarksByPaper = useCallback(
    (nextTargetMarksByPaper: BuilderTargetMarksByPaper) => {
      setRawTargetMarksByPaper(nextTargetMarksByPaper);
    },
    []
  );

  const setTargetMarksForPaper = useCallback(
    (paper: Paper, nextValueOrUpdater: React.SetStateAction<number>) => {
      setRawTargetMarksByPaper((prev) => {
        const currentValue = getPaperNumberValue({
          paper,
          valuesByPaper: prev,
          fallback: getDefaultTargetMarksForPaper(paper, courseConfig),
        });

        const nextValue = resolveNextTargetMarksValue({
          currentValue,
          nextValueOrUpdater,
        });

        return {
          ...prev,
          [paper]: nextValue,
        };
      });
    },
    [courseConfig]
  );

  const getTargetMarksForPaper = useCallback(
    (paper: Paper): number => {
      return getPaperNumberValue({
        paper,
        valuesByPaper: targetMarksByPaper,
        fallback: getDefaultTargetMarksForPaper(paper, courseConfig),
      });
    },
    [targetMarksByPaper, courseConfig]
  );

  /**
   * Temporary legacy aliases.
   *
   * These keep page.tsx, initialisation, saved-assessment loading and settings
   * code working while we move the real state to targetMarksByPaper.
   */
  const p1Target = getTargetMarksForPaper("P1");
  const p2Target = getTargetMarksForPaper("P2");

  const setP1Target: TargetMarksSetter = useCallback(
    (nextValueOrUpdater) => {
      setTargetMarksForPaper("P1", nextValueOrUpdater);
    },
    [setTargetMarksForPaper]
  );

  const setP2Target: TargetMarksSetter = useCallback(
    (nextValueOrUpdater) => {
      setTargetMarksForPaper("P2", nextValueOrUpdater);
    },
    [setTargetMarksForPaper]
  );

  return {
    targetMarksByPaper,
    setTargetMarksByPaper,
    setTargetMarksForPaper,
    getTargetMarksForPaper,

    p1Target,
    p2Target,
    setP1Target,
    setP2Target,
  };
}