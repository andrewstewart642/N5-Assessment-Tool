
import {
  useCallback,
  useState,
} from "react";

import type {
  AssessmentPreviewViewMode,
} from "./ViewMode";

export function usePreviewViewMode() {
  const [
    previewViewMode,
    setPreviewViewMode,
  ] =
    useState<AssessmentPreviewViewMode>(
      "EXAM"
    );

  const suppressPreviewSpacing =
    previewViewMode ===
    "COMPACT";

  const showPreviewAnswers =
    previewViewMode ===
    "ANSWERS";

  const cyclePreviewViewMode =
    useCallback(() => {
      setPreviewViewMode(
        (
          previousMode
        ) => {
          switch (
            previousMode
          ) {
            case "EXAM":
              return "COMPACT";

            case "COMPACT":
              return "ANSWERS";

            case "ANSWERS":
            default:
              return "EXAM";
          }
        }
      );
    }, []);

  return {
    previewViewMode,
    setPreviewViewMode,

    suppressPreviewSpacing,
    showPreviewAnswers,

    cyclePreviewViewMode,
  };
}