import { useCallback, useMemo, useState } from "react";

import type { CourseAssessmentConfig } from "@/course-data/course-configs/CourseConfigTypes";
import type { Paper } from "@/shared-types/AssessmentTypes_TEMP";
import {
  buildDefaultTargetMarksByPaper,
  getBuilderPapers,
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
  const coursePapers = useMemo(() => {
    return getBuilderPapers(courseConfig);
  }, [courseConfig]);

  const legacyP1Paper = coursePapers[0] ?? "P1";
  const legacyP2Paper = coursePapers[1] ?? coursePapers[0] ?? "P2";

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
   * These no longer assume literal "P1" / "P2" paper ids.
   * Instead:
   * - p1Target maps to the first configured paper
   * - p2Target maps to the second configured paper
   *
   * This keeps older page.tsx/UI code working during the transition while still
   * allowing smoke-test paper ids such as NON_CALCULATOR / CALCULATOR.
   */
  const p1Target = getTargetMarksForPaper(legacyP1Paper);
  const p2Target = getTargetMarksForPaper(legacyP2Paper);

  const setP1Target: TargetMarksSetter = useCallback(
    (nextValueOrUpdater) => {
      setTargetMarksForPaper(legacyP1Paper, nextValueOrUpdater);
    },
    [legacyP1Paper, setTargetMarksForPaper]
  );

  const setP2Target: TargetMarksSetter = useCallback(
    (nextValueOrUpdater) => {
      setTargetMarksForPaper(legacyP2Paper, nextValueOrUpdater);
    },
    [legacyP2Paper, setTargetMarksForPaper]
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