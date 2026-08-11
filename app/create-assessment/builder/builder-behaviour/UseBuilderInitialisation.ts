import { useEffect } from "react";

import { getSpacingBasePx } from "@/app/paper-layout/N5-Question-Spacing-px";
import { ACTIVE_COURSE_CONFIG } from "@/course-data/course-configs/ActiveCourseConfig";
import type { Paper, Question } from "@/shared-types/AssessmentTypes";
import { DEFAULT_QUESTION_SPACING_BASE_PX } from "../builder-definitions/BuilderConstants";
import {
  BUILDER_STORAGE_KEY_PAIRS,
  readBuilderStorageValue,
  type BuilderStorageKeyPair,
} from "../BuilderStorageKeys";
import { loadAssessmentSetupBrief } from "../../setup/AssessmentSetupStorage";
import {
  normaliseDisplayDate,
  todayDisplayDate,
} from "../builder-logic/BuilderDateHelpers";
import type { clamp } from "../BuilderUtils";
import { estimateMarksFromTimeForPaper, getInitialBuilderPaperForStructure } from "../builder-logic/BuilderPaperTargets";

type UseBuilderInitialisationArgs = {
  defaultHudHeight: number;
  clampFn: typeof clamp;

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

function withSpacingBase(question: Question): Question {
  if (
    typeof question.spacingBasePx === "number" &&
    Number.isFinite(question.spacingBasePx)
  ) {
    return question;
  }

  const code = question.questionCode;
  return {
    ...question,
    spacingBasePx: code
      ? getSpacingBasePx(code)
      : DEFAULT_QUESTION_SPACING_BASE_PX,
  };
}

export function useBuilderInitialisation({
  defaultHudHeight,
  clampFn,

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
    try {
      const rawPaneRatio = readBuilderStorageValue(
        BUILDER_STORAGE_KEY_PAIRS.paneRatio
      );
      if (rawPaneRatio) {
        const parsed = Number(rawPaneRatio);
        if (Number.isFinite(parsed)) {
          setLeftPaneRatio(clampFn(parsed, 0.28, 0.62));
        }
      }

      const rawHud = readBuilderStorageValue(
        BUILDER_STORAGE_KEY_PAIRS.hudHeight
      );
      if (rawHud) {
        const parsedHud = Number(rawHud);
        if (Number.isFinite(parsedHud)) {
          setHudHeight(clampFn(parsedHud, defaultHudHeight, 280));
        }
      }

      const rawShowHud = readBuilderStorageValue(
        BUILDER_STORAGE_KEY_PAIRS.showProgressPanel
      );
      if (rawShowHud === "true") setShowProgressPanel(true);
      if (rawShowHud === "false") setShowProgressPanel(false);

      const rawIncludeCover = readBuilderStorageValue(
        BUILDER_STORAGE_KEY_PAIRS.includeCoverSheet
      );
      if (rawIncludeCover === "true") setIncludeCoverSheet(true);
      if (rawIncludeCover === "false") setIncludeCoverSheet(false);

      const rawShowDateTime = readBuilderStorageValue(
        BUILDER_STORAGE_KEY_PAIRS.showCoverDateTime
      );
      if (rawShowDateTime === "true") setShowCoverDateTime(true);
      if (rawShowDateTime === "false") setShowCoverDateTime(false);

      const rawScn = readBuilderStorageValue(
        BUILDER_STORAGE_KEY_PAIRS.showScottishCandidateNumberBox
      );
      if (rawScn === "true") setShowScottishCandidateNumberBox(true);
      if (rawScn === "false") setShowScottishCandidateNumberBox(false);

      const rawFormula = readBuilderStorageValue(
        BUILDER_STORAGE_KEY_PAIRS.includeFormulaSheet
      );
      if (rawFormula === "true") setIncludeFormulaSheet(true);
      if (rawFormula === "false") setIncludeFormulaSheet(false);

      const storedName = readBuilderStorageValue(metaNameKey);
      const storedClass = readBuilderStorageValue(metaClassKey);
      const storedAssessmentDate = readBuilderStorageValue(
        metaAssessmentDateKey
      );
      const storedP1Date = readBuilderStorageValue(p1CoverDateKey);
      const storedP2Date = readBuilderStorageValue(p2CoverDateKey);

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

      const storedP1Start = readBuilderStorageValue(p1StartTimeKey);
      const storedP1End = readBuilderStorageValue(p1EndTimeKey);
      const storedP2Start = readBuilderStorageValue(p2StartTimeKey);
      const storedP2End = readBuilderStorageValue(p2EndTimeKey);
      const storedP2Custom = readBuilderStorageValue(p2DateCustomKey);

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
  }, [
    clampFn,
    defaultHudHeight,
    metaAssessmentDateKey,
    metaClassKey,
    metaNameKey,
    p1CoverDateKey,
    p1EndTimeKey,
    p1StartTimeKey,
    p2CoverDateKey,
    p2DateCustomKey,
    p2EndTimeKey,
    p2StartTimeKey,
    setAssessmentDate,
    setAssessmentName,
    setClassName,
    setHudHeight,
    setIncludeCoverSheet,
    setIncludeFormulaSheet,
    setLeftPaneRatio,
    setP1EndTime,
    setP1EndTimeManuallyEdited,
    setP1StartTime,
    setP2CoverDate,
    setP2DateCustom,
    setP2EndTime,
    setP2EndTimeManuallyEdited,
    setP2StartTime,
    setShowCoverDateTime,
    setShowProgressPanel,
    setShowScottishCandidateNumberBox,
  ]);

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

          const initialPaper = getInitialBuilderPaperForStructure({
        paperStructure: brief.paperStructure,
        courseConfig: ACTIVE_COURSE_CONFIG,
      });

      setActivePaper(initialPaper);
      setViewPaper(initialPaper);

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
  setP1Target(
    estimateMarksFromTimeForPaper({
      paper: "P1",
      minutes: brief.timeTargetP1,
      courseConfig: ACTIVE_COURSE_CONFIG,
    })
  );
}

if (typeof brief.timeTargetP2 === "number" && brief.timeTargetP2 > 0) {
  setP2Target(
    estimateMarksFromTimeForPaper({
      paper: "P2",
      minutes: brief.timeTargetP2,
      courseConfig: ACTIVE_COURSE_CONFIG,
    })
  );
}
  }, [
    setActivePaper,
    setAssessmentDate,
    setAssessmentName,
    setClassName,
    setCreatedAt,
    setIncludeCoverSheet,
    setIncludeFormulaSheet,
    setP1Target,
    setP2CoverDate,
    setP2Target,
    setViewPaper,
  ]);

  useEffect(() => {
    try {
      const raw = readBuilderStorageValue(BUILDER_STORAGE_KEY_PAIRS.state);
      if (!raw) return;

      const parsed = JSON.parse(raw) as { questions?: Question[] };
      if (!Array.isArray(parsed.questions)) return;

      setQuestions(parsed.questions.map(withSpacingBase));
    } catch {
      // ignore
    }
  }, [setQuestions]);
}