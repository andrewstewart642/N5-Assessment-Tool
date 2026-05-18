import { useEffect } from "react";

import {
  BUILDER_STORAGE_KEY_PAIRS,
  writeBuilderStorageValue,
  type BuilderStorageKeyPair,
} from "../BuilderStorageKeys";

type UseBuilderPersistenceArgs = {
  leftPaneRatio: number;
  hudHeight: number;
  showProgressPanel: boolean;
  includeCoverSheet: boolean;
  showCoverDateTime: boolean;
  showScottishCandidateNumberBox: boolean;
  includeFormulaSheet: boolean;

  assessmentName: string;
  className: string;
  assessmentDate: string;
  p1StartTime: string;
  p1EndTime: string;
  p2CoverDate: string;
  p2StartTime: string;
  p2EndTime: string;
  p2DateCustom: boolean;

  questions: unknown[];

  metaNameKey: BuilderStorageKeyPair;
  metaClassKey: BuilderStorageKeyPair;
  metaAssessmentDateKey: BuilderStorageKeyPair;
  p1CoverDateKey: BuilderStorageKeyPair;
  p1StartTimeKey: BuilderStorageKeyPair;
  p1EndTimeKey: BuilderStorageKeyPair;
  p2CoverDateKey: BuilderStorageKeyPair;
  p2StartTimeKey: BuilderStorageKeyPair;
  p2EndTimeKey: BuilderStorageKeyPair;
  p2DateCustomKey: BuilderStorageKeyPair;
};

export function useBuilderPersistence({
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

  metaNameKey,
  metaClassKey,
  metaAssessmentDateKey,
  p1CoverDateKey,
  p1StartTimeKey,
  p1EndTimeKey,
  p2CoverDateKey,
  p2StartTimeKey,
  p2EndTimeKey,
  p2DateCustomKey,
}: UseBuilderPersistenceArgs) {
  useEffect(() => {
    try {
      writeBuilderStorageValue(
        BUILDER_STORAGE_KEY_PAIRS.paneRatio,
        String(leftPaneRatio)
      );
    } catch {
      // ignore
    }
  }, [leftPaneRatio]);

  useEffect(() => {
    try {
      writeBuilderStorageValue(
        BUILDER_STORAGE_KEY_PAIRS.hudHeight,
        String(hudHeight)
      );
    } catch {
      // ignore
    }
  }, [hudHeight]);

  useEffect(() => {
    try {
      writeBuilderStorageValue(
        BUILDER_STORAGE_KEY_PAIRS.showProgressPanel,
        String(showProgressPanel)
      );
    } catch {
      // ignore
    }
  }, [showProgressPanel]);

  useEffect(() => {
    try {
      writeBuilderStorageValue(
        BUILDER_STORAGE_KEY_PAIRS.includeCoverSheet,
        String(includeCoverSheet)
      );
    } catch {
      // ignore
    }
  }, [includeCoverSheet]);

  useEffect(() => {
    try {
      writeBuilderStorageValue(
        BUILDER_STORAGE_KEY_PAIRS.showCoverDateTime,
        String(showCoverDateTime)
      );
    } catch {
      // ignore
    }
  }, [showCoverDateTime]);

  useEffect(() => {
    try {
      writeBuilderStorageValue(
        BUILDER_STORAGE_KEY_PAIRS.showScottishCandidateNumberBox,
        String(showScottishCandidateNumberBox)
      );
    } catch {
      // ignore
    }
  }, [showScottishCandidateNumberBox]);

  useEffect(() => {
    try {
      writeBuilderStorageValue(
        BUILDER_STORAGE_KEY_PAIRS.includeFormulaSheet,
        String(includeFormulaSheet)
      );
    } catch {
      // ignore
    }
  }, [includeFormulaSheet]);

  useEffect(() => {
    try {
            writeBuilderStorageValue(metaNameKey, assessmentName);
      writeBuilderStorageValue(metaClassKey, className);
      writeBuilderStorageValue(metaAssessmentDateKey, assessmentDate);

      writeBuilderStorageValue(p1CoverDateKey, assessmentDate);
      writeBuilderStorageValue(p1StartTimeKey, p1StartTime);
      writeBuilderStorageValue(p1EndTimeKey, p1EndTime);

      writeBuilderStorageValue(
        p2CoverDateKey,
        p2DateCustom ? p2CoverDate : assessmentDate
      );
      writeBuilderStorageValue(p2StartTimeKey, p2StartTime);
      writeBuilderStorageValue(p2EndTimeKey, p2EndTime);

      writeBuilderStorageValue(p2DateCustomKey, String(p2DateCustom));
    } catch {
      // ignore
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
    metaNameKey,
    metaClassKey,
    metaAssessmentDateKey,
    p1CoverDateKey,
    p1StartTimeKey,
    p1EndTimeKey,
    p2CoverDateKey,
    p2StartTimeKey,
    p2EndTimeKey,
    p2DateCustomKey,
  ]);

  useEffect(() => {
    try {
      writeBuilderStorageValue(
        BUILDER_STORAGE_KEY_PAIRS.state,
        JSON.stringify({ questions })
      );
    } catch {
      // ignore
    }
  }, [questions]);
}