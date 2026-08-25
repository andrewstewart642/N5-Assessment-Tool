"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  upsertSavedAssessment,
} from "@/app/my-assessments/state/SavedAssessmentsStorage";

import type { SavedAssessment } from "@/app/my-assessments/types/SavedAssessment";

import type {
  Paper,
  Question,
  StandardFilter,
  ThinkingTypeFilter,
} from "@/shared-types/AssessmentTypes";

import type {
  DraftByPaper,
  EditDraftByPaper,
} from "@/app/create-assessment/builder/BuilderUtils";

import type {
  BuilderPaperBooleanMap,
  BuilderPaperStringMap,
} from "@/app/create-assessment/builder/builder-logic/BuilderPaperStateMaps";

import type {
  BuilderTargetMarksByPaper,
} from "@/app/create-assessment/builder/builder-logic/BuilderPaperTargets";

type UseAssessmentCreatorAutoSaveArgs = {
  currentAssessmentId:
    string | null;

  loadedSavedAssessment:
    SavedAssessment | null;

  hasLoadedSavedAssessment:
    boolean;

  standardFilter:
    StandardFilter;

  thinkingTypeFilter:
    ThinkingTypeFilter;

  targetMarks:
    number;

  activePaper:
    Paper;

  viewPaper:
    Paper;

  targetMarksByPaper:
    BuilderTargetMarksByPaper;

  p1Target:
    number;

  p2Target:
    number;

  questions:
    Question[];

  draftByPaper:
    DraftByPaper;

  editDraftByPaper:
    EditDraftByPaper;

  includeCoverSheet:
    boolean;

  includeFormulaSheet:
    boolean;

  showCoverDateTime:
    boolean;

  showScottishCandidateNumberBox:
    boolean;

  assessmentName:
    string;

  assessmentDate:
    string;

  computedClassSummary:
    string;

  coverDateByPaper:
    BuilderPaperStringMap;

  startTimeByPaper:
    BuilderPaperStringMap;

  endTimeByPaper:
    BuilderPaperStringMap;

  coverDateCustomByPaper:
    BuilderPaperBooleanMap;

  p1StartTime:
    string;

  p1EndTime:
    string;

  p2CoverDate:
    string;

  p2StartTime:
    string;

  p2EndTime:
    string;

  p2DateCustom:
    boolean;

  selectedClassIds:
    string[];

  useCompleteCourseCoverage:
    boolean;
};

export function useAssessmentCreatorAutoSave({
  currentAssessmentId,
  loadedSavedAssessment,
  hasLoadedSavedAssessment,

  standardFilter,
  thinkingTypeFilter,
  targetMarks,

  activePaper,
  viewPaper,

  targetMarksByPaper,
  p1Target,
  p2Target,

  questions,
  draftByPaper,
  editDraftByPaper,

  includeCoverSheet,
  includeFormulaSheet,
  showCoverDateTime,
  showScottishCandidateNumberBox,

  assessmentName,
  assessmentDate,
  computedClassSummary,

  coverDateByPaper,
  startTimeByPaper,
  endTimeByPaper,
  coverDateCustomByPaper,

  p1StartTime,
  p1EndTime,

  p2CoverDate,
  p2StartTime,
  p2EndTime,
  p2DateCustom,

  selectedClassIds,
  useCompleteCourseCoverage,
}: UseAssessmentCreatorAutoSaveArgs) {
  const [
    saveStateLabel,
    setSaveStateLabel,
  ] = useState("Saved");

  const [
    isSaving,
    setIsSaving,
  ] = useState(false);

  const savedAssessmentRef =
    useRef<SavedAssessment | null>(
      loadedSavedAssessment
    );

  const saveTimeoutRef =
    useRef<
      ReturnType<typeof setTimeout> | null
    >(null);

  const hasInitialSaveCycleCompletedRef =
    useRef(false);

  useEffect(() => {
    savedAssessmentRef.current =
      loadedSavedAssessment;
  }, [loadedSavedAssessment]);

  useEffect(() => {
    if (
      !currentAssessmentId ||
      !savedAssessmentRef.current ||
      !hasLoadedSavedAssessment
    ) {
      return;
    }

    const nextSavedAssessment:
      SavedAssessment = {
      ...savedAssessmentRef.current,

      updatedAt: Date.now(),

      setup: {
        ...savedAssessmentRef.current
          .setup,

        assessmentName:
          assessmentName
            .trim()
            .length > 0
            ? assessmentName.trim()
            : "[Untitled file]",

        className:
          computedClassSummary,

        assessmentDate,

        includeCoverSheet,
        includeFormulaSheet,

        selectedClassIds,

        useCompleteCourseCoverage,
      },

      builder: {
        standardFilter,
        thinkingTypeFilter,
        targetMarks,

        activePaper,
        viewPaper,

        targetMarksByPaper,
        p1Target,
        p2Target,

        questions,
        draftByPaper,
        editDraftByPaper,

        includeCoverSheet,
        includeFormulaSheet,

        showCoverDateTime,
        showScottishCandidateNumberBox,

        assessmentName:
          assessmentName
            .trim()
            .length > 0
            ? assessmentName.trim()
            : "[Untitled file]",

        className:
          computedClassSummary,

        assessmentDate,

        coverDateByPaper,
        startTimeByPaper,
        endTimeByPaper,
        coverDateCustomByPaper,

        p1StartTime,
        p1EndTime,

        p2CoverDate,
        p2StartTime,
        p2EndTime,
        p2DateCustom,
      },
    };

    setIsSaving(true);
    setSaveStateLabel(
      "Saving..."
    );

    upsertSavedAssessment(
      nextSavedAssessment
    );

    savedAssessmentRef.current =
      nextSavedAssessment;

    if (saveTimeoutRef.current) {
      clearTimeout(
        saveTimeoutRef.current
      );
    }

    if (
      hasInitialSaveCycleCompletedRef
        .current
    ) {
      saveTimeoutRef.current =
        setTimeout(() => {
          setIsSaving(false);

          setSaveStateLabel(
            "Saved"
          );
        }, 350);
    } else {
      hasInitialSaveCycleCompletedRef.current =
        true;

      setIsSaving(false);

      setSaveStateLabel(
        "Saved"
      );
    }
  }, [
    currentAssessmentId,
    hasLoadedSavedAssessment,

    standardFilter,
    thinkingTypeFilter,
    targetMarks,

    activePaper,
    viewPaper,

    targetMarksByPaper,
    p1Target,
    p2Target,

    questions,
    draftByPaper,
    editDraftByPaper,

    includeCoverSheet,
    includeFormulaSheet,
    showCoverDateTime,
    showScottishCandidateNumberBox,

    assessmentName,
    assessmentDate,
    computedClassSummary,

    coverDateByPaper,
    startTimeByPaper,
    endTimeByPaper,
    coverDateCustomByPaper,

    p1StartTime,
    p1EndTime,

    p2CoverDate,
    p2StartTime,
    p2EndTime,
    p2DateCustom,

    selectedClassIds,
    useCompleteCourseCoverage,
  ]);

  useEffect(() => {
    return () => {
      if (
        saveTimeoutRef.current
      ) {
        clearTimeout(
          saveTimeoutRef.current
        );
      }
    };
  }, []);

  return {
    saveStateLabel,
    isSaving,
  };
}