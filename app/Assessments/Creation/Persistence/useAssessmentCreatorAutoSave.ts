import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  upsertSavedAssessment,
} from "@/app/Assessments/SavedAssessments/SavedAssessmentsStorage";

import type {
  SavedAssessment,
} from "@/app/Assessments/SavedAssessments/SavedAssessment";

import type {
  Paper,
  Question,
  StandardFilter,
  ThinkingTypeFilter,
} from "@/app/Assessments/AssessmentTypes";

import type {
  AssessmentPaperBooleanMap,
  AssessmentPaperStringMap,
} from "../Papers/AssessmentPaperValueMaps";

import type {
  AssessmentTargetMarksByPaper,
} from "../Papers/AssessmentPaperTargets";

import type {
  AssessmentEditQuestionDraftByPaper,
  AssessmentQuestionDraftByPaper,
} from "../Questions/AssessmentQuestionDraftTypes";

import type {
  AssessmentSaveStatus,
} from "./AssessmentSaveStatus";

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
    AssessmentTargetMarksByPaper;

  p1Target:
    number;

  p2Target:
    number;

  questions:
    Question[];

  draftByPaper:
    AssessmentQuestionDraftByPaper;

  editDraftByPaper:
    AssessmentEditQuestionDraftByPaper;

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
    AssessmentPaperStringMap;

  startTimeByPaper:
    AssessmentPaperStringMap;

  endTimeByPaper:
    AssessmentPaperStringMap;

  coverDateCustomByPaper:
    AssessmentPaperBooleanMap;

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

const MINIMUM_SAVING_DISPLAY_MS =
  2800;

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
    saveStatus,
    setSaveStatus,
  ] =
    useState<AssessmentSaveStatus>(
      "saved"
    );

  const savedAssessmentRef =
    useRef<
      SavedAssessment | null
    >(
      loadedSavedAssessment
    );

  const settleTimeoutRef =
    useRef<
      ReturnType<
        typeof setTimeout
      > | null
    >(
      null
    );

  const hasInitialSaveCycleCompletedRef =
    useRef(
      false
    );

  useEffect(() => {
    savedAssessmentRef.current =
      loadedSavedAssessment;
  }, [
    loadedSavedAssessment,
  ]);

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

      updatedAt:
        Date.now(),

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

    const isInitialSaveCycle =
      !hasInitialSaveCycleCompletedRef
        .current;

    if (
      settleTimeoutRef.current
    ) {
      clearTimeout(
        settleTimeoutRef.current
      );

      settleTimeoutRef.current =
        null;
    }

    /*
     * Initial hydration should not flash
     * "Saving..." simply because the builder
     * has finished loading an existing file.
     */
    if (
      !isInitialSaveCycle
    ) {
      setSaveStatus(
        "saving"
      );
    }

    try {
      /*
       * The real persistence operation still
       * happens immediately.
       *
       * The longer visual Saving state below is
       * presentation only.
       */
      upsertSavedAssessment(
        nextSavedAssessment
      );

      savedAssessmentRef.current =
        nextSavedAssessment;

      if (
        isInitialSaveCycle
      ) {
        hasInitialSaveCycleCompletedRef.current =
          true;

        setSaveStatus(
          "saved"
        );

        return;
      }

      /*
       * Keep Saving... visible long enough to
       * communicate the operation clearly.
       *
       * If another change arrives meanwhile this
       * timeout is cleared above, so the spinner
       * simply continues rather than restarting.
       */
      settleTimeoutRef.current =
        setTimeout(
          () => {
            setSaveStatus(
              "saved"
            );

            settleTimeoutRef.current =
              null;
          },
          MINIMUM_SAVING_DISPLAY_MS
        );
    } catch {
      hasInitialSaveCycleCompletedRef.current =
        true;

      setSaveStatus(
        "error"
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
        settleTimeoutRef.current
      ) {
        clearTimeout(
          settleTimeoutRef.current
        );
      }
    };
  }, []);

  return {
    saveStatus,
  };
}