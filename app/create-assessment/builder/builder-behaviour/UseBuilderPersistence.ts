import { useEffect } from "react";

import {
  HUD_HEIGHT_KEY,
  INCLUDE_COVER_SHEET_KEY,
  INCLUDE_FORMULA_SHEET_KEY,
  PANE_RATIO_KEY,
  SHOW_COVER_DATE_TIME_KEY,
  SHOW_PROGRESS_PANEL_KEY,
  SHOW_SCN_BOX_KEY,
  STORAGE_KEY,
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

  metaNameKey: string;
  metaClassKey: string;
  metaAssessmentDateKey: string;
  p1CoverDateKey: string;
  p1StartTimeKey: string;
  p1EndTimeKey: string;
  p2CoverDateKey: string;
  p2StartTimeKey: string;
  p2EndTimeKey: string;
  p2DateCustomKey: string;
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
      window.localStorage.setItem(PANE_RATIO_KEY, String(leftPaneRatio));
    } catch {
      // ignore
    }
  }, [leftPaneRatio]);

  useEffect(() => {
    try {
      window.localStorage.setItem(HUD_HEIGHT_KEY, String(hudHeight));
    } catch {
      // ignore
    }
  }, [hudHeight]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        SHOW_PROGRESS_PANEL_KEY,
        String(showProgressPanel)
      );
    } catch {
      // ignore
    }
  }, [showProgressPanel]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        INCLUDE_COVER_SHEET_KEY,
        String(includeCoverSheet)
      );
    } catch {
      // ignore
    }
  }, [includeCoverSheet]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        SHOW_COVER_DATE_TIME_KEY,
        String(showCoverDateTime)
      );
    } catch {
      // ignore
    }
  }, [showCoverDateTime]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        SHOW_SCN_BOX_KEY,
        String(showScottishCandidateNumberBox)
      );
    } catch {
      // ignore
    }
  }, [showScottishCandidateNumberBox]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        INCLUDE_FORMULA_SHEET_KEY,
        String(includeFormulaSheet)
      );
    } catch {
      // ignore
    }
  }, [includeFormulaSheet]);

  useEffect(() => {
    try {
      window.localStorage.setItem(metaNameKey, assessmentName);
      window.localStorage.setItem(metaClassKey, className);
      window.localStorage.setItem(metaAssessmentDateKey, assessmentDate);

      window.localStorage.setItem(p1CoverDateKey, assessmentDate);
      window.localStorage.setItem(p1StartTimeKey, p1StartTime);
      window.localStorage.setItem(p1EndTimeKey, p1EndTime);

      window.localStorage.setItem(
        p2CoverDateKey,
        p2DateCustom ? p2CoverDate : assessmentDate
      );
      window.localStorage.setItem(p2StartTimeKey, p2StartTime);
      window.localStorage.setItem(p2EndTimeKey, p2EndTime);

      window.localStorage.setItem(p2DateCustomKey, String(p2DateCustom));
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
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ questions }));
    } catch {
      // ignore
    }
  }, [questions]);
}