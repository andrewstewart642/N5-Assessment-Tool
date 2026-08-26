"use client";

import {
  useState,
} from "react";

import type {
  StandardFilter,
  ThinkingTypeFilter,
} from "@/src/Assessments/AssessmentTypes";

export function useAssessmentQuestionControls() {
  const [
    standardFilter,
    setStandardFilter,
  ] =
    useState<StandardFilter>(
      "C+A"
    );

  const [
    thinkingTypeFilter,
    setThinkingTypeFilter,
  ] =
    useState<ThinkingTypeFilter>(
      "ANY"
    );

  const [
    targetMarks,
    setTargetMarks,
  ] =
    useState<number>(
      2
    );

  return {
    standardFilter,
    setStandardFilter,

    thinkingTypeFilter,
    setThinkingTypeFilter,

    targetMarks,
    setTargetMarks,
  };
}