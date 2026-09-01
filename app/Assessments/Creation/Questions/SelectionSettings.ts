import {
  useCallback,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

import type {
  StandardFilter,
  ThinkingTypeFilter,
} from "@/app/Assessments/AssessmentTypes";

function normaliseTargetMarks(
  value: unknown,
  fallback: number
): number {
  const numericValue =
    typeof value === "number"
      ? value
      : Number(
          String(value)
            .replace(/\D/g, "")
        );

  if (
    !Number.isFinite(numericValue) ||
    numericValue <= 0
  ) {
    return fallback;
  }

  return numericValue;
}

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
    setTargetMarksState,
  ] =
    useState<number>(
      2
    );

  const setTargetMarks:
    Dispatch<
      SetStateAction<number>
    > =
    useCallback(
      (nextValue) => {
        setTargetMarksState(
          (currentValue) => {
            const resolvedValue =
              typeof nextValue ===
                "function"
                ? nextValue(
                    currentValue
                  )
                : nextValue;

            return normaliseTargetMarks(
              resolvedValue,
              currentValue
            );
          }
        );
      },
      []
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