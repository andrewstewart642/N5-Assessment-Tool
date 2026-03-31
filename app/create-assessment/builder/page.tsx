"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import SkillsTree from "@/app/create-assessment/builder/components/skills-tree/SkillsTree";
import BuilderBottomHud from "@/app/create-assessment/builder/components/builder-layout/BuilderBottomHud";
import BuilderPreviewPane from "./builder-preview-engine/BuilderPreviewPane";
import BuilderTopBar from "@/app/create-assessment/builder/components/builder-layout/BuilderTopBar";
import type { BuilderNote } from "@/app/create-assessment/builder/builder-logic/BuilderNotes";

import {
  BUILDER_DEFAULT_HUD_HEIGHT,
  BUILDER_DIVIDER_WIDTH_PX,
} from "./builder-definitions/BuilderConstants";

import { skillsData } from "@/course-data/N5-Skills";
import { N5_MATH_COURSE_CONFIG } from "@/course-data/course-configs/N5MathsCourseConfig";
import { UI_TEXT, UI_TYPO } from "@/app/ui/UiTypography";
import type {
  Paper,
  Question,
  Skill,
  StandardFilter,
  ThinkingTypeFilter,
} from "@/shared-types/AssessmentTypes";

import BuilderGlobalStyles from "./BuilderStyles";
import BuilderSettingsPanel from "@/app/create-assessment/builder/components/builder-controls/BuilderSettingsPanel";
import { todayDisplayDate } from "./builder-logic/BuilderDateHelpers";
import { usePaperViewMetadata } from "./builder-behaviour/UsePaperViewMetadata";
import { usePreviewJumpNavigation } from "./builder-preview-engine/UsePreviewJumpNavigation";
import { usePreviewPages } from "./builder-preview-engine/UsePreviewPages";
import { useBuilderInitialisation } from "./builder-behaviour/UseBuilderInitialisation";
import { useBuilderLayout } from "./builder-behaviour/UseBuilderLayouts";
import { useBuilderPersistence } from "./builder-behaviour/UseBuilderPersistence";
import { useBuilderFlashFeedback } from "./builder-behaviour/UseBuilderFlashFeedback";
import { useBuilderMetadataTiming } from "./builder-behaviour/UseBuilderMetadataTiming";
import { useBuilderProgressMetrics } from "./builder-behaviour/UseBuilderProgressMetrics";
import { useBuilderUiChrome } from "./builder-behaviour/UseBuilderUiChrome";
import { useMeasuredQuestionHeights } from "./builder-preview-engine/UseMeasuredQuestionHeights";
import { usePreviewViewport } from "./builder-behaviour/UsePreviewViewport";
import { useQuestionWorkflow } from "./builder-behaviour/UseQuestionWorkflow";
import { useSkillsTreeState } from "./builder-behaviour/UseSkillsTreeState";
import { buildCalculatorSuitabilityNotes } from "@/app/create-assessment/builder/builder-logic/BuildCalculatorSuitabilityNotes";
import { buildStandardBalanceNotes } from "@/app/create-assessment/builder/builder-logic/BuildStandardBalanceNotes";
import {
  getFilteredConcepts,
  rankConceptsByTargetMarks,
} from "@/math-helpers/QuestionLogic";
import {
  analyseTopicBalance,
  calculateTotalAssessmentMarks,
} from "./builder-logic/AssessmentDistributionAnalysis";
import { buildTopicBalanceNotes } from "./builder-logic/BuildTopicBalanceNotes";
import { buildOperationalReasoningNotes } from "./builder-logic/BuildOperationalReasoningNotes";

import {
  clamp,
  type DraftByPaper,
  type EditDraftByPaper,
} from "./BuilderUtils";

import {
  ASSESSMENT_LEVEL_OPTIONS,
  type AssessmentLevelId,
} from "@/app/create-assessment/setup/AssessmentClassCoverageStorage";
import type { CourseOption, SchoolClass } from "@/app/my-classes/types/Classes";
import type { SavedAssessment } from "@/app/my-assessments/types/SavedAssessment";
import {
  getCurrentSavedAssessmentId,
  loadSavedAssessmentById,
  upsertSavedAssessment,
} from "@/app/my-assessments/state/SavedAssessmentsStorage";
import { useSettings } from "@/app/settings-bar/GlobalSettingsContext";

const META_NAME_KEY = "n5-builder-meta-name";
const META_CLASS_KEY = "n5-builder-meta-class";
const META_ASSESSMENT_DATE_KEY = "n5-builder-meta-assessment-date";

const P1_COVER_DATE_KEY = "n5-builder-p1-cover-date";
const P1_START_TIME_KEY = "n5-builder-p1-start-time";
const P1_END_TIME_KEY = "n5-builder-p1-end-time";

const P2_COVER_DATE_KEY = "n5-builder-p2-cover-date";
const P2_START_TIME_KEY = "n5-builder-p2-start-time";
const P2_END_TIME_KEY = "n5-builder-p2-end-time";

const P2_DATE_CUSTOM_KEY = "n5-builder-p2-date-custom";

const MY_CLASSES_STORAGE_KEY = "n5-my-classes";

function getCourseLabelForLevelId(
  levelId: AssessmentLevelId | null
): CourseOption | null {
  if (!levelId) return null;

  const match = ASSESSMENT_LEVEL_OPTIONS.find((option) => option.id === levelId);
  if (!match) return null;

  return match.classCourseLabel as CourseOption;
}

function normaliseSavedClass(candidate: unknown): SchoolClass | null {
  if (!candidate || typeof candidate !== "object") return null;

  const item = candidate as Partial<SchoolClass>;

  if (
    typeof item.id !== "string" ||
    typeof item.name !== "string" ||
    typeof item.course !== "string" ||
    typeof item.level !== "string" ||
    typeof item.teacher !== "string" ||
    typeof item.createdAt !== "number"
  ) {
    return null;
  }

  return {
    id: item.id,
    name: item.name,
    course: item.course as CourseOption,
    level: item.level,
    teacher: item.teacher,
    createdAt: item.createdAt,
    updatedAt:
      typeof item.updatedAt === "number" ? item.updatedAt : item.createdAt,
    completedSkillIds: Array.isArray(item.completedSkillIds)
      ? item.completedSkillIds.filter(
          (skillId): skillId is string => typeof skillId === "string"
        )
      : [],
  };
}

function loadSavedClasses(): SchoolClass[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(MY_CLASSES_STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];

    return parsed
      .map(normaliseSavedClass)
      .filter((item): item is SchoolClass => item !== null);
  } catch {
    return [];
  }
}

function getSharedCompletedSkillIds(selectedClasses: SchoolClass[]): string[] {
  if (selectedClasses.length === 0) return [];

  let sharedSkillIds = new Set(selectedClasses[0].completedSkillIds);

  for (const schoolClass of selectedClasses.slice(1)) {
    const classSkillIds = new Set(schoolClass.completedSkillIds);

    sharedSkillIds = new Set(
      [...sharedSkillIds].filter((skillId) => classSkillIds.has(skillId))
    );
  }

  return [...sharedSkillIds];
}

function buildFilteredSkillsData(
  allSkillsData: Record<string, Skill[]>,
  allowedSkillIds: Set<string>
): Record<string, Skill[]> {
  const filteredEntries = Object.entries(allSkillsData)
    .map(([categoryName, skills]) => {
      const visibleSkills = skills.filter((skill) => allowedSkillIds.has(skill.id));
      return [categoryName, visibleSkills] as const;
    })
    .filter(([, skills]) => skills.length > 0);

  return Object.fromEntries(filteredEntries);
}

function buildClassCoverageSummary(args: {
  classes: SchoolClass[];
  selectedClassIds: string[];
  useCompleteCourseCoverage: boolean;
}): string {
  const { classes, selectedClassIds, useCompleteCourseCoverage } = args;

  if (useCompleteCourseCoverage) {
    return "Complete course";
  }

  if (selectedClassIds.length === 0) {
    return "";
  }

  const selectedClasses = classes.filter((item) =>
    selectedClassIds.includes(item.id)
  );

  if (selectedClasses.length === 1) {
    return selectedClasses[0].name;
  }

  if (selectedClasses.length === 2) {
    return `${selectedClasses[0].name}, ${selectedClasses[1].name}`;
  }

  return `${selectedClasses.length} classes selected`;
}

export default function CreateAssessmentBuilderPage() {
  const router = useRouter();
  const { theme } = useSettings();

  const [standardFilter, setStandardFilter] = useState<StandardFilter>("C+A");
  const [thinkingTypeFilter, setThinkingTypeFilter] =
    useState<ThinkingTypeFilter>("ANY");
  const [targetMarks, setTargetMarks] = useState<number>(2);

  const [activePaper, setActivePaper] = useState<Paper>("P1");
  const [viewPaper, setViewPaper] = useState<Paper>("P1");

  const [p1Target, setP1Target] = useState<number>(40);
  const [p2Target, setP2Target] = useState<number>(50);

  const {
    collapsedCategories,
    expandedSkillIds,
    conceptIndexBySkill,
    difficultyBySkill,
    toggleCategory,
    expandCategory,
    toggleSkill: toggleSkillRow,
    expandSkill,
    setConceptIndex,
    setDifficulty,
    collapseAllSkills,
  } = useSkillsTreeState();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [draftByPaper, setDraftByPaper] = useState<DraftByPaper>({
    P1: null,
    P2: null,
  });
  const [editDraftByPaper, setEditDraftByPaper] = useState<EditDraftByPaper>({
    P1: null,
    P2: null,
  });

  const [measuredHeights, setMeasuredHeights] = useState<Record<string, number>>(
    {}
  );

  const [savedClasses, setSavedClasses] = useState<SchoolClass[]>([]);
  const [currentAssessmentId, setCurrentAssessmentId] = useState<string | null>(
    null
  );
  const [loadedSavedAssessment, setLoadedSavedAssessment] =
    useState<SavedAssessment | null>(null);
  const [hasLoadedSavedAssessment, setHasLoadedSavedAssessment] =
    useState(false);

  const [builderSelectedClassIds, setBuilderSelectedClassIds] = useState<string[]>(
    []
  );
  const [builderUseCompleteCourseCoverage, setBuilderUseCompleteCourseCoverage] =
    useState(false);

  const [saveStateLabel, setSaveStateLabel] = useState("Saved");
  const [isSaving, setIsSaving] = useState(false);

  const savedAssessmentRef = useRef<SavedAssessment | null>(null);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasInitialSaveCycleCompletedRef = useRef(false);

  const previewPaneRef = useRef<HTMLDivElement | null>(null);
  const pageWrapperRefs = useRef<Array<HTMLDivElement | null>>([]);
  const pendingJumpDraftRef = useRef<{ paper: Paper; draftId: string } | null>(
    null
  );
  const builderDateFieldRef = useRef<HTMLDivElement | null>(null);

  const [includeCoverSheet, setIncludeCoverSheet] = useState(false);
  const [showCoverDateTime, setShowCoverDateTime] = useState(false);
  const [showScottishCandidateNumberBox, setShowScottishCandidateNumberBox] =
    useState(true);
  const [includeFormulaSheet, setIncludeFormulaSheet] = useState(false);

  const [settingsOpen, setSettingsOpen] = useState(false);

  const [assessmentName, setAssessmentName] = useState("[Untitled file]");
  const [className, setClassName] = useState("");
  const [assessmentDate, setAssessmentDate] = useState(todayDisplayDate());
  const [builderCalendarOpen, setBuilderCalendarOpen] = useState(false);
  const [createdAt, setCreatedAt] = useState<number>(Date.now());

  const [p1StartTime, setP1StartTime] = useState("");
  const [p1EndTime, setP1EndTime] = useState("");

  const [p2CoverDate, setP2CoverDate] = useState(todayDisplayDate());
  const [p2StartTime, setP2StartTime] = useState("");
  const [p2EndTime, setP2EndTime] = useState("");
  const [p2DateCustom, setP2DateCustom] = useState(false);

  const [p1EndTimeManuallyEdited, setP1EndTimeManuallyEdited] = useState(false);
  const [p2EndTimeManuallyEdited, setP2EndTimeManuallyEdited] = useState(false);

  const DEFAULT_HUD_HEIGHT = BUILDER_DEFAULT_HUD_HEIGHT;

  const {
    layoutRef,
    hudResizeStartRef,
    leftPaneRatio,
    setLeftPaneRatio,
    isDraggingDivider,
    setIsDraggingDivider,
    hudHeight,
    setHudHeight,
    setIsDraggingHud,
    showProgressPanel,
    setShowProgressPanel,
    resetLayout,
  } = useBuilderLayout({
    defaultHudHeight: DEFAULT_HUD_HEIGHT,
  });

  useBuilderInitialisation({
    defaultHudHeight: DEFAULT_HUD_HEIGHT,
    clampFn: clamp,

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

    metaNameKey: META_NAME_KEY,
    metaClassKey: META_CLASS_KEY,
    metaAssessmentDateKey: META_ASSESSMENT_DATE_KEY,
    p1CoverDateKey: P1_COVER_DATE_KEY,
    p1StartTimeKey: P1_START_TIME_KEY,
    p1EndTimeKey: P1_END_TIME_KEY,
    p2CoverDateKey: P2_COVER_DATE_KEY,
    p2StartTimeKey: P2_START_TIME_KEY,
    p2EndTimeKey: P2_END_TIME_KEY,
    p2DateCustomKey: P2_DATE_CUSTOM_KEY,
  });

  useBuilderPersistence({
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

    metaNameKey: META_NAME_KEY,
    metaClassKey: META_CLASS_KEY,
    metaAssessmentDateKey: META_ASSESSMENT_DATE_KEY,
    p1CoverDateKey: P1_COVER_DATE_KEY,
    p1StartTimeKey: P1_START_TIME_KEY,
    p1EndTimeKey: P1_END_TIME_KEY,
    p2CoverDateKey: P2_COVER_DATE_KEY,
    p2StartTimeKey: P2_START_TIME_KEY,
    p2EndTimeKey: P2_END_TIME_KEY,
    p2DateCustomKey: P2_DATE_CUSTOM_KEY,
  });

  const { qualityNotes, flashWarning, pushFlash, addQualityNote } =
    useBuilderFlashFeedback();

  useBuilderUiChrome({
    builderCalendarOpen,
    setBuilderCalendarOpen,
    builderDateFieldRef,
    settingsOpen,
    setSettingsOpen,
  });

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    const previousHtmlOverflow = html.style.overflow;
    const previousHtmlHeight = html.style.height;
    const previousHtmlOverscroll = html.style.overscrollBehavior;

    const previousBodyOverflow = body.style.overflow;
    const previousBodyHeight = body.style.height;
    const previousBodyOverscroll = body.style.overscrollBehavior;

    html.style.overflow = "hidden";
    html.style.height = "100%";
    html.style.overscrollBehavior = "none";

    body.style.overflow = "hidden";
    body.style.height = "100%";
    body.style.overscrollBehavior = "none";

    return () => {
      html.style.overflow = previousHtmlOverflow;
      html.style.height = previousHtmlHeight;
      html.style.overscrollBehavior = previousHtmlOverscroll;

      body.style.overflow = previousBodyOverflow;
      body.style.height = previousBodyHeight;
      body.style.overscrollBehavior = previousBodyOverscroll;
    };
  }, []);

  const {
    assignedForView,
    p1Marks,
    p2Marks,
    p1Mins,
    p2Mins,
    activePaperCoverMarks,
  } = useBuilderProgressMetrics({
    questions,
    viewPaper,
  });

  const { handleAssessmentNameFocus, handleAssessmentNameBlur } =
    useBuilderMetadataTiming({
      assessmentName,
      setAssessmentName,

      assessmentDate,
      p2DateCustom,
      setP2CoverDate,

      p1StartTime,
      p1Marks,
      p1EndTimeManuallyEdited,
      setP1EndTime,

      p2StartTime,
      p2Marks,
      p2EndTimeManuallyEdited,
      setP2EndTime,
    });

  const { onMeasure } = useMeasuredQuestionHeights({
    questions,
    draftByPaper,
    editDraftByPaper,
    setMeasuredHeights,
  });

  useEffect(() => {
    setSavedClasses(loadSavedClasses());

    const nextAssessmentId = getCurrentSavedAssessmentId();
    setCurrentAssessmentId(nextAssessmentId);

    if (!nextAssessmentId) {
      setHasLoadedSavedAssessment(true);
      return;
    }

    const savedAssessment = loadSavedAssessmentById(nextAssessmentId);
    setLoadedSavedAssessment(savedAssessment);
    savedAssessmentRef.current = savedAssessment;

    if (!savedAssessment) {
      setHasLoadedSavedAssessment(true);
      return;
    }

    setCreatedAt(savedAssessment.createdAt);

    setAssessmentName(savedAssessment.builder.assessmentName);
    setClassName(savedAssessment.builder.className);
    setAssessmentDate(savedAssessment.builder.assessmentDate);

    setStandardFilter(savedAssessment.builder.standardFilter);
    setThinkingTypeFilter(savedAssessment.builder.thinkingTypeFilter);
    setTargetMarks(savedAssessment.builder.targetMarks);

    setActivePaper(savedAssessment.builder.activePaper);
    setViewPaper(savedAssessment.builder.viewPaper);

    setP1Target(savedAssessment.builder.p1Target);
    setP2Target(savedAssessment.builder.p2Target);

    setQuestions(savedAssessment.builder.questions);
    setDraftByPaper(savedAssessment.builder.draftByPaper);
    setEditDraftByPaper(savedAssessment.builder.editDraftByPaper);

    setIncludeCoverSheet(savedAssessment.builder.includeCoverSheet);
    setIncludeFormulaSheet(savedAssessment.builder.includeFormulaSheet);
    setShowCoverDateTime(savedAssessment.builder.showCoverDateTime);
    setShowScottishCandidateNumberBox(
      savedAssessment.builder.showScottishCandidateNumberBox
    );

    setP1StartTime(savedAssessment.builder.p1StartTime);
    setP1EndTime(savedAssessment.builder.p1EndTime);
    setP2CoverDate(savedAssessment.builder.p2CoverDate);
    setP2StartTime(savedAssessment.builder.p2StartTime);
    setP2EndTime(savedAssessment.builder.p2EndTime);
    setP2DateCustom(savedAssessment.builder.p2DateCustom);

    setP1EndTimeManuallyEdited(
      savedAssessment.builder.p1EndTime.trim().length > 0
    );
    setP2EndTimeManuallyEdited(
      savedAssessment.builder.p2EndTime.trim().length > 0
    );

    setBuilderSelectedClassIds(savedAssessment.setup.selectedClassIds);
    setBuilderUseCompleteCourseCoverage(
      savedAssessment.setup.useCompleteCourseCoverage
    );

    setSaveStateLabel("Saved");
    setIsSaving(false);
    setHasLoadedSavedAssessment(true);
  }, []);

  const builderLevelLabel = useMemo(() => {
    if (!loadedSavedAssessment?.setup.levelId) return null;

    return (
      ASSESSMENT_LEVEL_OPTIONS.find(
        (option) => option.id === loadedSavedAssessment.setup.levelId
      )?.label ?? null
    );
  }, [loadedSavedAssessment]);

  const builderAvailableClasses = useMemo(() => {
    if (!loadedSavedAssessment?.setup.levelId) return [];

    const expectedCourse = getCourseLabelForLevelId(
      loadedSavedAssessment.setup.levelId
    );

    if (!expectedCourse) return [];

    return savedClasses.filter(
      (schoolClass) => schoolClass.course === expectedCourse
    );
  }, [loadedSavedAssessment, savedClasses]);

  const computedClassSummary = useMemo(() => {
    return buildClassCoverageSummary({
      classes: builderAvailableClasses,
      selectedClassIds: builderSelectedClassIds,
      useCompleteCourseCoverage: builderUseCompleteCourseCoverage,
    });
  }, [
    builderAvailableClasses,
    builderSelectedClassIds,
    builderUseCompleteCourseCoverage,
  ]);

  useEffect(() => {
    setClassName(computedClassSummary);
  }, [computedClassSummary]);

  useEffect(() => {
    if (
      !currentAssessmentId ||
      !savedAssessmentRef.current ||
      !hasLoadedSavedAssessment
    ) {
      return;
    }

    const nextSavedAssessment: SavedAssessment = {
      ...savedAssessmentRef.current,
      updatedAt: Date.now(),
      setup: {
        ...savedAssessmentRef.current.setup,
        assessmentName:
          assessmentName.trim().length > 0
            ? assessmentName.trim()
            : "[Untitled file]",
        className: computedClassSummary,
        assessmentDate,
        includeCoverSheet,
        includeFormulaSheet,
        selectedClassIds: builderSelectedClassIds,
        useCompleteCourseCoverage: builderUseCompleteCourseCoverage,
      },
      builder: {
        standardFilter,
        thinkingTypeFilter,
        targetMarks,
        activePaper,
        viewPaper,
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
          assessmentName.trim().length > 0
            ? assessmentName.trim()
            : "[Untitled file]",
        className: computedClassSummary,
        assessmentDate,
        p1StartTime,
        p1EndTime,
        p2CoverDate,
        p2StartTime,
        p2EndTime,
        p2DateCustom,
      },
    };

    setIsSaving(true);
    setSaveStateLabel("Saving...");

    upsertSavedAssessment(nextSavedAssessment);
    savedAssessmentRef.current = nextSavedAssessment;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    if (hasInitialSaveCycleCompletedRef.current) {
      saveTimeoutRef.current = setTimeout(() => {
        setIsSaving(false);
        setSaveStateLabel("Saved");
      }, 350);
    } else {
      hasInitialSaveCycleCompletedRef.current = true;
      setIsSaving(false);
      setSaveStateLabel("Saved");
    }
  }, [
    currentAssessmentId,
    hasLoadedSavedAssessment,
    standardFilter,
    thinkingTypeFilter,
    targetMarks,
    activePaper,
    viewPaper,
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
    p1StartTime,
    p1EndTime,
    p2CoverDate,
    p2StartTime,
    p2EndTime,
    p2DateCustom,
    builderSelectedClassIds,
    builderUseCompleteCourseCoverage,
    computedClassSummary,
  ]);

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  const editDraftRef = useRef<EditDraftByPaper>({ P1: null, P2: null });
  useEffect(() => {
    editDraftRef.current = editDraftByPaper;
  }, [editDraftByPaper]);

  const selectedClassesForCoverage = useMemo(() => {
    if (!loadedSavedAssessment) return [];

    const expectedCourse = getCourseLabelForLevelId(
      loadedSavedAssessment.setup.levelId
    );

    const selectedClasses = builderSelectedClassIds
      .map((classId) =>
        savedClasses.find((schoolClass) => schoolClass.id === classId)
      )
      .filter((schoolClass): schoolClass is SchoolClass => schoolClass !== undefined);

    if (!expectedCourse) return selectedClasses;

    return selectedClasses.filter(
      (schoolClass) => schoolClass.course === expectedCourse
    );
  }, [loadedSavedAssessment, savedClasses, builderSelectedClassIds]);

  const sharedCompletedSkillIds = useMemo(() => {
    return getSharedCompletedSkillIds(selectedClassesForCoverage);
  }, [selectedClassesForCoverage]);

  const filteredSkillsData = useMemo<Record<string, Skill[]>>(() => {
    if (!loadedSavedAssessment) {
      return skillsData as Record<string, Skill[]>;
    }

    if (builderUseCompleteCourseCoverage) {
      return skillsData as Record<string, Skill[]>;
    }

    if (builderSelectedClassIds.length === 0) {
      return skillsData as Record<string, Skill[]>;
    }

    if (selectedClassesForCoverage.length === 0) {
      return skillsData as Record<string, Skill[]>;
    }

    const allowedSkillIds = new Set(sharedCompletedSkillIds);

    return buildFilteredSkillsData(
      skillsData as Record<string, Skill[]>,
      allowedSkillIds
    );
  }, [
    loadedSavedAssessment,
    selectedClassesForCoverage,
    sharedCompletedSkillIds,
    builderUseCompleteCourseCoverage,
    builderSelectedClassIds,
  ]);

  const totalSkillsCount = useMemo(() => {
    return Object.values(filteredSkillsData).reduce<number>(
      (acc, list) => acc + list.length,
      0
    );
  }, [filteredSkillsData]);

  const restoreTreeForQuestion = useCallback(
    (question: Question) => {
      setStandardFilter(question.standardFilter);
      setTargetMarks(question.targetMarks);
      setActivePaper(question.paper);
      setViewPaper(question.paper);

      if (!question.category || !question.skillId) return;

      expandCategory(question.category);
      expandSkill(question.skillId);

      const categorySkills = (skillsData[question.category] ?? []) as Skill[];
      const skill = categorySkills.find((entry) => entry.id === question.skillId);

      if (!skill) {
        setDifficulty(question.skillId, question.difficulty);
        return;
      }

      const filteredConcepts = getFilteredConcepts(skill, question.standardFilter);
      const rankedConcepts = rankConceptsByTargetMarks(
        filteredConcepts,
        question.targetMarks
      );

      const conceptIndex = rankedConcepts.findIndex(
        (concept) =>
          (question.conceptId && concept.id === question.conceptId) ||
          concept.label === question.concept ||
          concept.code === question.concept ||
          `${concept.code} ${concept.shortLabel ?? ""}`.trim() ===
            question.concept.trim()
      );

      setConceptIndex(skill.id, conceptIndex >= 0 ? conceptIndex : -1);
      setDifficulty(question.skillId, question.difficulty);
    },
    [
      expandCategory,
      expandSkill,
      setConceptIndex,
      setDifficulty,
      setStandardFilter,
      setTargetMarks,
      setActivePaper,
      setViewPaper,
    ]
  );

  const {
    addQuestionToPaper,
    regenerateQuestionToPaper,
    assignNewDraft,
    removeNewDraft,
    startEditLockedQuestion,
    saveEdit,
    removeWhileEditing,
    canAssignNewDraft,
    canSaveEdit,
    invalidCommitMessage,
  } = useQuestionWorkflow({
    standardFilter,
    targetMarks,
    activePaper,
    viewPaper,
    questions,
    draftByPaper,
    editDraftByPaper,
    editDraftRef,
    setQuestions,
    setDraftByPaper,
    setEditDraftByPaper,
    setViewPaper,
    pendingJumpDraftRef,
    pushFlash,
    addQualityNote,
    restoreTreeForQuestion,
  });

  const getConceptIndex = (skillId: string) => conceptIndexBySkill[skillId] ?? -1;
  const getDifficulty = (skillId: string) => difficultyBySkill[skillId] ?? 3;

  const editForView = editDraftByPaper[viewPaper];
  const newDraftForView = draftByPaper[viewPaper];

  const { renderById, previewPages } = usePreviewPages({
    assignedForView,
    editForView,
    newDraftForView,
    measuredHeights,
    includeCoverSheet,
    includeFormulaSheet,
  });

  const {
    zoomPct,
    currentViewerPage,
    viewerScale,
    totalViewerPages,
    zoomIn,
    zoomOut,
    resetZoom,
  } = usePreviewViewport({
    previewPaneRef,
    pageWrapperRefs,
    previewPages,
    showProgressPanel,
    includeCoverSheet,
    includeFormulaSheet,
    viewPaper,
  });

  usePreviewJumpNavigation({
    pendingJumpDraftRef,
    previewPages,
    viewPaper,
    pageWrapperRefs,
  });

  const includedPapers = useMemo<Paper[]>(() => {
    const papers: Paper[] = [];
    if (p1Target > 0) papers.push("P1");
    if (p2Target > 0) papers.push("P2");
    return papers;
  }, [p1Target, p2Target]);

  const totalAssessmentMarks = useMemo(() => {
    return calculateTotalAssessmentMarks({
      includePaper1: includedPapers.includes("P1"),
      includePaper2: includedPapers.includes("P2"),
      p1TargetMarks: p1Target,
      p2TargetMarks: p2Target,
    });
  }, [includedPapers, p1Target, p2Target]);

  const topicBalanceAnalysis = useMemo(() => {
    return analyseTopicBalance({
      questions,
      totalAssessmentMarks,
      courseConfig: N5_MATH_COURSE_CONFIG,
      includedPapers,
    });
  }, [questions, totalAssessmentMarks, includedPapers]);

  const topicQualityNotes = useMemo<Array<string | BuilderNote>>(() => {
    return buildTopicBalanceNotes({
      analysis: topicBalanceAnalysis,
      includeBasisNote: true,
      includeRecommendationNote: true,
    });
  }, [topicBalanceAnalysis]);

  const operationalReasoningNotes = useMemo<Array<string | BuilderNote>>(() => {
    return buildOperationalReasoningNotes({
      questions,
      includedPapers,
      totalAssessmentMarks,
      includeBasisNote: true,
      includeRecommendationNote: true,
    });
  }, [questions, includedPapers, totalAssessmentMarks]);

  const calculatorSuitabilityNotes = useMemo<Array<string | BuilderNote>>(() => {
    return buildCalculatorSuitabilityNotes({
      questions,
      includedPapers,
    });
  }, [questions, includedPapers]);

  const standardBalanceNotes = useMemo<Array<string | BuilderNote>>(() => {
    return buildStandardBalanceNotes({
      questions,
      includedPapers,
      totalAssessmentMarks,
      includeBasisNote: true,
      includeRecommendationNote: true,
    });
  }, [questions, includedPapers, totalAssessmentMarks]);

  const mergedQualityNotes = useMemo(() => {
    return [
      ...qualityNotes,
      ...topicQualityNotes,
      ...operationalReasoningNotes,
      ...calculatorSuitabilityNotes,
      ...standardBalanceNotes,
    ];
  }, [
    qualityNotes,
    topicQualityNotes,
    operationalReasoningNotes,
    calculatorSuitabilityNotes,
    standardBalanceNotes,
  ]);

  const viewerHudRow = showProgressPanel ? `${hudHeight}px` : "0px";
  const dividerWidth = BUILDER_DIVIDER_WIDTH_PX;
  const bodyGridColumns = `${(leftPaneRatio * 100).toFixed(
    3
  )}% ${dividerWidth}px minmax(0, 1fr)`;
  const { coverDateTextForView, coverTimeTextForView } = usePaperViewMetadata({
    viewPaper,
    assessmentDate,
    p2CoverDate,
    p2DateCustom,
    p1StartTime,
    p1EndTime,
    p2StartTime,
    p2EndTime,
  });

  function handleBuilderToggleClass(classId: string) {
    setBuilderUseCompleteCourseCoverage(false);
    setBuilderSelectedClassIds((current) =>
      current.includes(classId)
        ? current.filter((id) => id !== classId)
        : [...current, classId]
    );
  }

  function handleBuilderSelectCompleteCourseCoverage() {
    setBuilderUseCompleteCourseCoverage(true);
    setBuilderSelectedClassIds([]);
  }

  const routerPushCompile = useCallback(() => {
    router.push("/compile-assessment");
  }, [router]);

  const dividerColour = isDraggingDivider
    ? theme.accentSoft
    : theme.borderStandard;

  return (
    <>
      <BuilderGlobalStyles theme={theme} />

      <main
        style={{
          height: "100vh",
          maxHeight: "100vh",
          background: theme.bgPage,
          color: theme.textPrimary,
          display: "grid",
          gridTemplateRows: "1fr",
          overflow: "hidden",
          position: "relative",
          ...UI_TEXT.appRoot,
        }}
      >
        <div
          ref={layoutRef}
          style={{
            display: "grid",
            gridTemplateColumns: bodyGridColumns,
            minHeight: 0,
            height: "100%",
            overflow: "hidden",
            fontFamily: UI_TYPO.family,
          }}
        >
          <SkillsTree
            skillsData={filteredSkillsData}
            totalSkillsCount={totalSkillsCount}
            standardFilter={standardFilter}
            setStandardFilter={setStandardFilter}
            thinkingTypeFilter={thinkingTypeFilter}
            setThinkingTypeFilter={setThinkingTypeFilter}
            targetMarks={targetMarks}
            setTargetMarks={setTargetMarks}
            minTargetMarks={1}
            maxTargetMarks={6}
            activePaper={activePaper}
            setActivePaper={setActivePaper}
            collapsedCategories={collapsedCategories}
            toggleCategory={toggleCategory}
            expandedSkillIds={expandedSkillIds}
            toggleSkillRow={toggleSkillRow}
            collapseAllSkills={collapseAllSkills}
            getConceptIndex={getConceptIndex}
            setConceptIndex={setConceptIndex}
            getDifficulty={getDifficulty}
            setDifficulty={setDifficulty}
            addQuestionToPaper={addQuestionToPaper}
            regenerateQuestionToPaper={regenerateQuestionToPaper}
            theme={theme}
          />

          <div
            onMouseDown={() => setIsDraggingDivider(true)}
            onMouseUp={() => setIsDraggingDivider(false)}
            style={{
              width: dividerWidth,
              background: dividerColour,
              cursor: "col-resize",
              position: "relative",
            }}
            title="Drag to resize panes"
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to right, transparent 0, transparent 2px, rgba(147,197,253,0.20) 2px, rgba(147,197,253,0.20) 6px, transparent 6px, transparent 100%)",
                opacity: isDraggingDivider ? 1 : 0.3,
              }}
            />
          </div>

          <section
            style={{
              background: theme.bgSurface,
              display: "grid",
              gridTemplateRows: `65px minmax(0, 1fr) ${viewerHudRow}`,
              minHeight: 0,
              height: "100%",
              overflow: "hidden",
              position: "relative",
              fontFamily: UI_TYPO.family,
            }}
          >
            <BuilderTopBar
              theme={theme}
              assessmentName={assessmentName}
              setAssessmentName={setAssessmentName}
              assessmentDate={assessmentDate}
              setAssessmentDate={setAssessmentDate}
              builderCalendarOpen={builderCalendarOpen}
              setBuilderCalendarOpen={setBuilderCalendarOpen}
              builderDateFieldRef={builderDateFieldRef}
              handleAssessmentNameFocus={handleAssessmentNameFocus}
              handleAssessmentNameBlur={handleAssessmentNameBlur}
              viewPaper={viewPaper}
              setViewPaper={setViewPaper}
              classLevelLabel={builderLevelLabel}
              availableClasses={builderAvailableClasses}
              selectedClassIds={builderSelectedClassIds}
              useCompleteCourseCoverage={builderUseCompleteCourseCoverage}
              onToggleClass={handleBuilderToggleClass}
              onSelectCompleteCourseCoverage={handleBuilderSelectCompleteCourseCoverage}
              zoomPct={zoomPct}
              zoomIn={zoomIn}
              zoomOut={zoomOut}
              currentViewerPage={currentViewerPage}
              totalViewerPages={totalViewerPages}
            />

            <BuilderPreviewPane
              theme={theme}
              previewPaneRef={previewPaneRef}
              pageWrapperRefs={pageWrapperRefs}
              flashWarning={flashWarning}
              previewPages={previewPages}
              viewPaper={viewPaper}
              viewerScale={viewerScale}
              activePaperCoverMarks={activePaperCoverMarks}
              showCoverDateTime={showCoverDateTime}
              coverDateTextForView={coverDateTextForView}
              coverTimeTextForView={coverTimeTextForView}
              showScottishCandidateNumberBox={showScottishCandidateNumberBox}
              includeCoverSheet={includeCoverSheet}
              includeFormulaSheet={includeFormulaSheet}
              renderById={renderById}
              editForView={editForView}
              onMeasure={onMeasure}
              saveEdit={saveEdit}
              removeWhileEditing={removeWhileEditing}
              assignNewDraft={assignNewDraft}
              removeNewDraft={removeNewDraft}
              startEditLockedQuestion={startEditLockedQuestion}
              canAssignNewDraft={canAssignNewDraft}
              canSaveEdit={canSaveEdit}
              invalidCommitMessage={invalidCommitMessage}
            />

            <BuilderBottomHud
              theme={theme}
              routerPushCompile={routerPushCompile}
              showProgressPanel={showProgressPanel}
              hudHeight={hudHeight}
              hudResizeStartRef={hudResizeStartRef}
              setIsDraggingHud={setIsDraggingHud}
              viewPaper={viewPaper}
              p1Marks={p1Marks}
              p2Marks={p2Marks}
              p1Target={p1Target}
              p2Target={p2Target}
              p1Mins={p1Mins}
              p2Mins={p2Mins}
              qualityNotes={mergedQualityNotes}
              saveStateLabel={saveStateLabel}
              isSaving={isSaving}
            />
          </section>
        </div>

        <BuilderSettingsPanel
          open={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          theme={theme}
          includeCoverSheet={includeCoverSheet}
          setIncludeCoverSheet={setIncludeCoverSheet}
          showCoverDateTime={showCoverDateTime}
          setShowCoverDateTime={setShowCoverDateTime}
          assessmentDate={assessmentDate}
          setAssessmentDate={setAssessmentDate}
          p1StartTime={p1StartTime}
          setP1StartTime={setP1StartTime}
          p1EndTime={p1EndTime}
          setP1EndTime={setP1EndTime}
          setP1EndTimeManuallyEdited={setP1EndTimeManuallyEdited}
          p2CoverDate={p2CoverDate}
          setP2CoverDate={setP2CoverDate}
          p2DateCustom={p2DateCustom}
          setP2DateCustom={setP2DateCustom}
          p2StartTime={p2StartTime}
          setP2StartTime={setP2StartTime}
          p2EndTime={p2EndTime}
          setP2EndTime={setP2EndTime}
          setP2EndTimeManuallyEdited={setP2EndTimeManuallyEdited}
          showScottishCandidateNumberBox={showScottishCandidateNumberBox}
          setShowScottishCandidateNumberBox={setShowScottishCandidateNumberBox}
          includeFormulaSheet={includeFormulaSheet}
          setIncludeFormulaSheet={setIncludeFormulaSheet}
          showProgressPanel={showProgressPanel}
          setShowProgressPanel={setShowProgressPanel}
          resetLayout={resetLayout}
          resetZoom={resetZoom}
        />
      </main>
    </>
  );
}