import { useMemo } from "react";

import type { CourseAssessmentConfig } from "@/course-data/course-configs/CourseConfigTypes";
import type { Paper } from "@/shared-types/AssessmentTypes_TEMP";
import { calculateTotalAssessmentMarksFromPaperTargets } from "../builder-logic/AssessmentDistributionAnalysis";
import {
  buildTargetMarksByPaper,
  buildTargetMarksByPaperFromValues,
  getIncludedPapersFromTargets,
  type BuilderTargetMarksByPaper,
} from "../builder-logic/BuilderPaperTargets";

type LegacyUseBuilderPaperTargetMapsArgs = {
  p1Target: number;
  p2Target: number;
  courseConfig: CourseAssessmentConfig;
};

type GenericUseBuilderPaperTargetMapsArgs = {
  targetMarksByPaper: BuilderTargetMarksByPaper;
  courseConfig: CourseAssessmentConfig;
};

type UseBuilderPaperTargetMapsArgs =
  | LegacyUseBuilderPaperTargetMapsArgs
  | GenericUseBuilderPaperTargetMapsArgs;

function isGenericTargetArgs(
  args: UseBuilderPaperTargetMapsArgs
): args is GenericUseBuilderPaperTargetMapsArgs {
  return "targetMarksByPaper" in args;
}

function buildResolvedTargetMarksByPaper(
  args: UseBuilderPaperTargetMapsArgs
): BuilderTargetMarksByPaper {
  if (isGenericTargetArgs(args)) {
    return buildTargetMarksByPaperFromValues({
      targetMarksByPaper: args.targetMarksByPaper,
      courseConfig: args.courseConfig,
    });
  }

  return buildTargetMarksByPaper({
    p1Target: args.p1Target,
    p2Target: args.p2Target,
    courseConfig: args.courseConfig,
  });
}

export function useBuilderPaperTargetMaps(args: UseBuilderPaperTargetMapsArgs) {
  const courseConfig = args.courseConfig;

  const rawTargetMarksByPaper = isGenericTargetArgs(args)
    ? args.targetMarksByPaper
    : undefined;

  const legacyP1Target = isGenericTargetArgs(args) ? undefined : args.p1Target;
  const legacyP2Target = isGenericTargetArgs(args) ? undefined : args.p2Target;

  const targetMarksByPaper = useMemo<BuilderTargetMarksByPaper>(() => {
    return buildResolvedTargetMarksByPaper(args);
  }, [args, rawTargetMarksByPaper, legacyP1Target, legacyP2Target]);

  const includedPapers = useMemo<Paper[]>(() => {
    return getIncludedPapersFromTargets({
      targetMarksByPaper,
      courseConfig,
    });
  }, [targetMarksByPaper, courseConfig]);

  const totalAssessmentMarks = useMemo(() => {
    return calculateTotalAssessmentMarksFromPaperTargets({
      includedPapers,
      targetMarksByPaper,
    });
  }, [includedPapers, targetMarksByPaper]);

  return {
    targetMarksByPaper,
    includedPapers,
    totalAssessmentMarks,
  };
}