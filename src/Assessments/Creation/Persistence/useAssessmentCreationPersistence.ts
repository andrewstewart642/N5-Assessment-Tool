"use client";

import {
  useEffect,
} from "react";

import type {
  Question,
} from "@/shared-types/AssessmentTypes";

import {
  ASSESSMENT_CREATION_STORAGE_KEY_PAIRS,
  writeAssessmentCreationStorageValue,
} from "./AssessmentCreationStorageKeys";

type UseAssessmentCreationPersistenceArgs = {
  leftPaneRatio:
    number;

  hudHeight:
    number;

  showProgressPanel:
    boolean;

  includeCoverSheet:
    boolean;

  showCoverDateTime:
    boolean;

  showScottishCandidateNumberBox:
    boolean;

  includeFormulaSheet:
    boolean;

  assessmentName:
    string;

  className:
    string;

  assessmentDate:
    string;

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

  questions:
    Question[];
};

export function useAssessmentCreationPersistence({
  leftPaneRatio,
  hudHeight,
  showProgressPanel,

  includeCoverSheet,
  showCoverDateTime,
  showScottishCandidateNumberBox,
  includeFormulaSheet,

  assessmentName,
  className,
  assessmentDate,

  p1StartTime,
  p1EndTime,

  p2CoverDate,
  p2StartTime,
  p2EndTime,

  p2DateCustom,

  questions,
}: UseAssessmentCreationPersistenceArgs) {
  useEffect(() => {
    try {
      writeAssessmentCreationStorageValue(
        ASSESSMENT_CREATION_STORAGE_KEY_PAIRS
          .paneRatio,

        String(
          leftPaneRatio
        )
      );
    } catch {
      // Browser storage failure is non-fatal.
    }
  }, [
    leftPaneRatio,
  ]);

  useEffect(() => {
    try {
      writeAssessmentCreationStorageValue(
        ASSESSMENT_CREATION_STORAGE_KEY_PAIRS
          .hudHeight,

        String(
          hudHeight
        )
      );
    } catch {
      // Browser storage failure is non-fatal.
    }
  }, [
    hudHeight,
  ]);

  useEffect(() => {
    try {
      writeAssessmentCreationStorageValue(
        ASSESSMENT_CREATION_STORAGE_KEY_PAIRS
          .showProgressPanel,

        String(
          showProgressPanel
        )
      );
    } catch {
      // Browser storage failure is non-fatal.
    }
  }, [
    showProgressPanel,
  ]);

  useEffect(() => {
    try {
      writeAssessmentCreationStorageValue(
        ASSESSMENT_CREATION_STORAGE_KEY_PAIRS
          .includeCoverSheet,

        String(
          includeCoverSheet
        )
      );
    } catch {
      // Browser storage failure is non-fatal.
    }
  }, [
    includeCoverSheet,
  ]);

  useEffect(() => {
    try {
      writeAssessmentCreationStorageValue(
        ASSESSMENT_CREATION_STORAGE_KEY_PAIRS
          .showCoverDateTime,

        String(
          showCoverDateTime
        )
      );
    } catch {
      // Browser storage failure is non-fatal.
    }
  }, [
    showCoverDateTime,
  ]);

  useEffect(() => {
    try {
      writeAssessmentCreationStorageValue(
        ASSESSMENT_CREATION_STORAGE_KEY_PAIRS
          .showScottishCandidateNumberBox,

        String(
          showScottishCandidateNumberBox
        )
      );
    } catch {
      // Browser storage failure is non-fatal.
    }
  }, [
    showScottishCandidateNumberBox,
  ]);

  useEffect(() => {
    try {
      writeAssessmentCreationStorageValue(
        ASSESSMENT_CREATION_STORAGE_KEY_PAIRS
          .includeFormulaSheet,

        String(
          includeFormulaSheet
        )
      );
    } catch {
      // Browser storage failure is non-fatal.
    }
  }, [
    includeFormulaSheet,
  ]);

  useEffect(() => {
    try {
      writeAssessmentCreationStorageValue(
        ASSESSMENT_CREATION_STORAGE_KEY_PAIRS
          .metaName,

        assessmentName
      );

      writeAssessmentCreationStorageValue(
        ASSESSMENT_CREATION_STORAGE_KEY_PAIRS
          .metaClass,

        className
      );

      writeAssessmentCreationStorageValue(
        ASSESSMENT_CREATION_STORAGE_KEY_PAIRS
          .metaAssessmentDate,

        assessmentDate
      );

      writeAssessmentCreationStorageValue(
        ASSESSMENT_CREATION_STORAGE_KEY_PAIRS
          .p1CoverDate,

        assessmentDate
      );

      writeAssessmentCreationStorageValue(
        ASSESSMENT_CREATION_STORAGE_KEY_PAIRS
          .p1StartTime,

        p1StartTime
      );

      writeAssessmentCreationStorageValue(
        ASSESSMENT_CREATION_STORAGE_KEY_PAIRS
          .p1EndTime,

        p1EndTime
      );

      writeAssessmentCreationStorageValue(
        ASSESSMENT_CREATION_STORAGE_KEY_PAIRS
          .p2CoverDate,

        p2DateCustom
          ? p2CoverDate
          : assessmentDate
      );

      writeAssessmentCreationStorageValue(
        ASSESSMENT_CREATION_STORAGE_KEY_PAIRS
          .p2StartTime,

        p2StartTime
      );

      writeAssessmentCreationStorageValue(
        ASSESSMENT_CREATION_STORAGE_KEY_PAIRS
          .p2EndTime,

        p2EndTime
      );

      writeAssessmentCreationStorageValue(
        ASSESSMENT_CREATION_STORAGE_KEY_PAIRS
          .p2DateCustom,

        String(
          p2DateCustom
        )
      );
    } catch {
      // Browser storage failure is non-fatal.
    }
  }, [
    assessmentName,
    className,
    assessmentDate,

    p1StartTime,
    p1EndTime,

    p2CoverDate,
    p2StartTime,
    p2EndTime,

    p2DateCustom,
  ]);

  useEffect(() => {
    try {
      writeAssessmentCreationStorageValue(
        ASSESSMENT_CREATION_STORAGE_KEY_PAIRS
          .state,

        JSON.stringify({
          questions,
        })
      );
    } catch {
      // Browser storage failure is non-fatal.
    }
  }, [
    questions,
  ]);
}