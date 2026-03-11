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
import { loadAssessmentSetupBrief } from "../../setup/AssessmentSetupStorage";
import { normaliseDisplayDate, todayDisplayDate } from "../builder-logic/BuilderDateHelpers";
import type { AppearancePreference } from "@/app/ui/AppTheme";
import type { Paper, Question } from "@/shared-types/AssessmentTypes";
import type { clamp } from "../BuilderUtils";

type UseBuilderInitialisationArgs = {
  defaultHudHeight: number;
  appearanceStorageKey: string;
  clampFn: typeof clamp;

  setSystemPrefersDark: (value: boolean) => void;
  setAppearance: (value: AppearancePreference) => void;

  setLeftPaneRatio: (value: number) => void;
  setHudHeight: (value: number) => void;
  setShowProgressPanel: (value: boolean) => void;
  setIncludeCoverSheet: (value: boolean) => void;
  setShowCoverDateTime: (value: boolean) => void;
  setShowScottishCandidateNumberBox: (value: boolean) => void;
  setIncludeFormulaSheet: (value: boolean) => void;

  setAssessmentName: React.Dispatch<React.SetStateAction<string>>;
  setClassName: React.Dispatch<React.SetStateAction<string>>;
  setAssessmentDate: React.Dispatch<React.SetStateAction<string>>;
  setP2CoverDate: React.Dispatch<React.SetStateAction<string>>;
  setCreatedAt: (value: number) => void;

  setP1StartTime: (value: string) => void;
  setP1EndTime: (value: string) => void;
  setP2StartTime: (value: string) => void;
  setP2EndTime: (value: string) => void;
  setP2DateCustom: (value: boolean) => void;
  setP1EndTimeManuallyEdited: (value: boolean) => void;
  setP2EndTimeManuallyEdited: (value: boolean) => void;

  setActivePaper: (value: Paper) => void;
  setViewPaper: (value: Paper) => void;

  setP1Target: (value: number) => void;
  setP2Target: (value: number) => void;

  setQuestions: (value: Question[]) => void;

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

export function useBuilderInitialisation({
  defaultHudHeight,
  appearanceStorageKey,
  clampFn,

  setSystemPrefersDark,
  setAppearance,

  setLeftPaneRatio,
  setHudHeight,
  setShowProgressPanel,
  setIncludeCoverSheet,
  setShowCoverDateTime,
  setShowScottishCandidateNumberBox,
  setIncludeFormulaSheet,

  setAssessmentName,
  setClassName,
  setAssessmentDate,
  setP2CoverDate,
  setCreatedAt,

  setP1StartTime,
  setP1EndTime,
  setP2StartTime,
  setP2EndTime,
  setP2DateCustom,
  setP1EndTimeManuallyEdited,
  setP2EndTimeManuallyEdited,

  setActivePaper,
  setViewPaper,

  setP1Target,
  setP2Target,

  setQuestions,

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
}: UseBuilderInitialisationArgs) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => setSystemPrefersDark(media.matches);

    apply();

    const raw = window.localStorage.getItem(appearanceStorageKey);
    if (raw === "dark" || raw === "light" || raw === "system") {
      setAppearance(raw as AppearancePreference);
    }

    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", apply);
      return () => media.removeEventListener("change", apply);
    }

    media.addListener(apply);
    return () => media.removeListener(apply);
  }, [appearanceStorageKey, setAppearance, setSystemPrefersDark]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(PANE_RATIO_KEY);
      if (raw) {
        const parsed = Number(raw);
        if (Number.isFinite(parsed)) {
          setLeftPaneRatio(clampFn(parsed, 0.28, 0.62));
        }
      }

      const rawHud = window.localStorage.getItem(HUD_HEIGHT_KEY);
      if (rawHud) {
        const parsedHud = Number(rawHud);
        if (Number.isFinite(parsedHud)) {
          setHudHeight(clampFn(parsedHud, defaultHudHeight, 280));
        }
      }

      const rawShowHud = window.localStorage.getItem(SHOW_PROGRESS_PANEL_KEY);
      if (rawShowHud === "true") setShowProgressPanel(true);
      if (rawShowHud === "false") setShowProgressPanel(false);

      const rawIncludeCover = window.localStorage.getItem(INCLUDE_COVER_SHEET_KEY);
      if (rawIncludeCover === "true") setIncludeCoverSheet(true);
      if (rawIncludeCover === "false") setIncludeCoverSheet(false);

      const rawShowDateTime = window.localStorage.getItem(SHOW_COVER_DATE_TIME_KEY);
      if (rawShowDateTime === "true") setShowCoverDateTime(true);
      if (rawShowDateTime === "false") setShowCoverDateTime(false);

      const rawScn = window.localStorage.getItem(SHOW_SCN_BOX_KEY);
      if (rawScn === "true") setShowScottishCandidateNumberBox(true);
      if (rawScn === "false") setShowScottishCandidateNumberBox(false);

      const rawFormula = window.localStorage.getItem(INCLUDE_FORMULA_SHEET_KEY);
      if (rawFormula === "true") setIncludeFormulaSheet(true);
      if (rawFormula === "false") setIncludeFormulaSheet(false);

      const storedName = window.localStorage.getItem(metaNameKey);
      const storedClass = window.localStorage.getItem(metaClassKey);
      const storedAssessmentDate = window.localStorage.getItem(metaAssessmentDateKey);
      const storedP1Date = window.localStorage.getItem(p1CoverDateKey);
      const storedP2Date = window.localStorage.getItem(p2CoverDateKey);

      if (storedName !== null) setAssessmentName(storedName);
      if (storedClass !== null) setClassName(storedClass);

      const initialAssessmentDate = normaliseDisplayDate(
        storedAssessmentDate || storedP1Date || ""
      );
      if (initialAssessmentDate) {
        setAssessmentDate(initialAssessmentDate);
      }

      const normalisedP2Date = normaliseDisplayDate(storedP2Date || "");
      if (normalisedP2Date) {
        setP2CoverDate(normalisedP2Date);
      }

      const storedP1Start = window.localStorage.getItem(p1StartTimeKey);
      const storedP1End = window.localStorage.getItem(p1EndTimeKey);
      const storedP2Start = window.localStorage.getItem(p2StartTimeKey);
      const storedP2End = window.localStorage.getItem(p2EndTimeKey);
      const storedP2Custom = window.localStorage.getItem(p2DateCustomKey);

      if (storedP1Start !== null) setP1StartTime(storedP1Start);
      if (storedP1End !== null) {
        setP1EndTime(storedP1End);
        if (storedP1End.trim()) setP1EndTimeManuallyEdited(true);
      }

      if (storedP2Start !== null) setP2StartTime(storedP2Start);
      if (storedP2End !== null) {
        setP2EndTime(storedP2End);
        if (storedP2End.trim()) setP2EndTimeManuallyEdited(true);
      }

      if (storedP2Custom === "true") setP2DateCustom(true);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    const brief = loadAssessmentSetupBrief();
    if (!brief) return;

    setIncludeCoverSheet(brief.includeCoverSheet);
    setIncludeFormulaSheet(brief.includeFormulaSheet);

    setAssessmentName((prev) =>
      prev !== "[Untitled file]"
        ? prev
        : brief.assessmentName && brief.assessmentName.trim().length
          ? brief.assessmentName
          : "[Untitled file]"
    );

    setClassName((prev) => (prev.trim().length ? prev : brief.className ?? ""));

    const briefDate = normaliseDisplayDate(brief.assessmentDate || "");
    if (briefDate) {
      setAssessmentDate((prev) =>
        prev && prev !== todayDisplayDate() ? prev : briefDate
      );
      setP2CoverDate((prev) =>
        prev && prev !== todayDisplayDate() ? prev : briefDate
      );
    }

    setCreatedAt(
      typeof brief.createdAt === "number" && Number.isFinite(brief.createdAt)
        ? brief.createdAt
        : Date.now()
    );

    if (brief.paperStructure === "P2_ONLY") {
      setActivePaper("P2");
      setViewPaper("P2");
    } else {
      setActivePaper("P1");
      setViewPaper("P1");
    }

    if (brief.buildPriority === "MARKS") {
      if (typeof brief.marksTargetP1 === "number" && brief.marksTargetP1 > 0) {
        setP1Target(brief.marksTargetP1);
      }
      if (typeof brief.marksTargetP2 === "number" && brief.marksTargetP2 > 0) {
        setP2Target(brief.marksTargetP2);
      }
      return;
    }

    if (typeof brief.timeTargetP1 === "number" && brief.timeTargetP1 > 0) {
      setP1Target(Math.max(1, Math.floor(brief.timeTargetP1 / 1.5)));
    }
    if (typeof brief.timeTargetP2 === "number" && brief.timeTargetP2 > 0) {
      setP2Target(Math.max(1, Math.floor(brief.timeTargetP2 / 1.8)));
    }
  }, []);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as { questions?: Question[] };
      if (Array.isArray(parsed.questions)) {
        setQuestions(parsed.questions);
      }
    } catch {
      // ignore
    }
  }, []);
}