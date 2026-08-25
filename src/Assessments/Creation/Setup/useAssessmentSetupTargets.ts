"use client";

import { useEffect, useState } from "react";

import type { CourseAssessmentConfig } from "@/course-data/course-configs/CourseConfigTypes";

import type {
  BuildPriority,
  PaperStructure,
} from "./AssessmentSetupStorage";

import {
  getDefaultTargetMarksText,
  getDefaultTargetTimeText,
  structureIncludesPaper,
} from "./AssessmentSetupCourseRules";

import {
  areAssessmentTargetsValid,
  buildAssessmentTargetSummary,
  parsePositiveInteger,
} from "./AssessmentSetupTargetCalculations";

type UseAssessmentSetupTargetsArgs = {
  paperStructure: PaperStructure | null;
  courseConfig: CourseAssessmentConfig;
};

export function useAssessmentSetupTargets({
  paperStructure,
  courseConfig,
}: UseAssessmentSetupTargetsArgs) {
  const [buildPriority, setBuildPriority] =
    useState<BuildPriority | null>(null);

  const [marksTargetP1, setMarksTargetP1] =
    useState("");

  const [marksTargetP2, setMarksTargetP2] =
    useState("");

  const [timeTargetP1, setTimeTargetP1] =
    useState("");

  const [timeTargetP2, setTimeTargetP2] =
    useState("");

  useEffect(() => {
    if (!buildPriority || !paperStructure) {
      return;
    }

    const includesP1 = structureIncludesPaper(
      paperStructure,
      "P1",
      courseConfig
    );

    const includesP2 = structureIncludesPaper(
      paperStructure,
      "P2",
      courseConfig
    );

    if (buildPriority === "MARKS") {
      if (includesP1) {
        setMarksTargetP1((previous) =>
          previous.trim().length
            ? previous
            : getDefaultTargetMarksText(
                "P1",
                courseConfig
              )
        );
      } else {
        setMarksTargetP1("");
      }

      if (includesP2) {
        setMarksTargetP2((previous) =>
          previous.trim().length
            ? previous
            : getDefaultTargetMarksText(
                "P2",
                courseConfig
              )
        );
      } else {
        setMarksTargetP2("");
      }

      setTimeTargetP1("");
      setTimeTargetP2("");

      return;
    }

    if (includesP1) {
      setTimeTargetP1((previous) =>
        previous.trim().length
          ? previous
          : getDefaultTargetTimeText(
              "P1",
              courseConfig
            )
      );
    } else {
      setTimeTargetP1("");
    }

    if (includesP2) {
      setTimeTargetP2((previous) =>
        previous.trim().length
          ? previous
          : getDefaultTargetTimeText(
              "P2",
              courseConfig
            )
      );
    } else {
      setTimeTargetP2("");
    }

    setMarksTargetP1("");
    setMarksTargetP2("");
  }, [
    buildPriority,
    paperStructure,
    courseConfig,
  ]);

  const parsedMarksP1 =
    parsePositiveInteger(marksTargetP1);

  const parsedMarksP2 =
    parsePositiveInteger(marksTargetP2);

  const parsedTimeP1 =
    parsePositiveInteger(timeTargetP1);

  const parsedTimeP2 =
    parsePositiveInteger(timeTargetP2);

  const targetsValid =
    areAssessmentTargetsValid({
      buildPriority,
      paperStructure,
      parsedMarksP1,
      parsedMarksP2,
      parsedTimeP1,
      parsedTimeP2,
      courseConfig,
    });

  const derivedSummary =
    buildAssessmentTargetSummary({
      buildPriority,
      paperStructure,
      parsedMarksP1,
      parsedMarksP2,
      parsedTimeP1,
      parsedTimeP2,
      courseConfig,
    });

  function resetTargets() {
    setBuildPriority(null);

    setMarksTargetP1("");
    setMarksTargetP2("");

    setTimeTargetP1("");
    setTimeTargetP2("");
  }

  return {
    buildPriority,
    setBuildPriority,

    marksTargetP1,
    setMarksTargetP1,

    marksTargetP2,
    setMarksTargetP2,

    timeTargetP1,
    setTimeTargetP1,

    timeTargetP2,
    setTimeTargetP2,

    parsedMarksP1,
    parsedMarksP2,
    parsedTimeP1,
    parsedTimeP2,

    targetsValid,
    derivedSummary,

    resetTargets,
  };
}