"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { BUILDER_STORAGE_KEY_PAIRS } from "./BuilderStorageKeys";
import { useBuilderPaperPrintMetadata } from "./builder-behaviour/UseBuilderPaperPrintMetadata";
import { readMyClassesStorageValue } from "@/app/my-classes/state/ClassStorageKeys";

import SkillsTree from "@/app/create-assessment/builder/components/skills-tree/SkillsTree";
import BuilderBottomHud from "@/app/create-assessment/builder/components/builder-layout/BuilderBottomHud";
import BuilderPreviewPane from "./builder-preview-engine/BuilderPreviewPane";
import BuilderTopBar from "@/app/create-assessment/builder/components/builder-layout/BuilderTopBar";
import type { BuilderNote } from "@/app/create-assessment/builder/builder-logic/BuilderNotes";
import { useBuilderPaperSittingState } from "./builder-behaviour/UseBuilderPaperSittingState";
import { useBuilderPaperTargetMaps } from "./builder-behaviour/UseBuilderPaperTargetMaps";
import { useBuilderTargetMarksState } from "./builder-behaviour/UseBuilderTargetMarksState";
import { useBuilderProgressHudRows } from "./builder-behaviour/UseBuilderProgressHudRows";
import { normaliseClass } from "@/app/my-classes/state/ClassNormalisation";
import {
  BUILDER_DEFAULT_HUD_HEIGHT,
  BUILDER_DIVIDER_WIDTH_PX,
} from "./builder-definitions/BuilderConstants";

import {
  buildEmptyEditDraftsByPaper,
  buildEmptyQuestionDraftsByPaper,
  getDefaultBuilderPaper,
} from "./builder-logic/BuilderPaperTargets";
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
import { getBuilderCourseConfig } from "./builder-logic/BuilderCourseConfig";
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
import { analyseTopicBalance } from "./builder-logic/AssessmentDistributionAnalysis";
import { buildTopicBalanceNotes } from "./builder-logic/BuildTopicBalanceNotes";
import { buildOperationalReasoningNotes } from "./builder-logic/BuildOperationalReasoningNotes";

import {
  clamp,
  type DraftByPaper,
  type EditDraftByPaper,
} from "./BuilderUtils";

import {
  getAssessmentLevelLabel,
  normaliseAssessmentLevelId,
  type AssessmentLevelId,
} from "@/app/create-assessment/setup/AssessmentClassCoverageStorage";
import type { SchoolClass } from "@/app/my-classes/types/Classes";
import type { SavedAssessment } from "@/app/my-assessments/types/SavedAssessment";
import {
  getCurrentSavedAssessmentId,
  loadSavedAssessmentById,
  upsertSavedAssessment,
} from "@/app/my-assessments/state/SavedAssessmentsStorage";
import { useSettings } from "@/app/settings-bar/GlobalSettingsContext";


const META_NAME_KEY = BUILDER_STORAGE_KEY_PAIRS.metaName;
const META_CLASS_KEY = BUILDER_STORAGE_KEY_PAIRS.metaClass;
const META_ASSESSMENT_DATE_KEY = BUILDER_STORAGE_KEY_PAIRS.metaAssessmentDate;

const P1_COVER_DATE_KEY = BUILDER_STORAGE_KEY_PAIRS.p1CoverDate;
const P1_START_TIME_KEY = BUILDER_STORAGE_KEY_PAIRS.p1StartTime;
const P1_END_TIME_KEY = BUILDER_STORAGE_KEY_PAIRS.p1EndTime;

const P2_COVER_DATE_KEY = BUILDER_STORAGE_KEY_PAIRS.p2CoverDate;
const P2_START_TIME_KEY = BUILDER_STORAGE_KEY_PAIRS.p2StartTime;
const P2_END_TIME_KEY = BUILDER_STORAGE_KEY_PAIRS.p2EndTime;

const P2_DATE_CUSTOM_KEY = BUILDER_STORAGE_KEY_PAIRS.p2DateCustom;

function getCourseIdForLevelId(
  levelId: AssessmentLevelId | null
): AssessmentLevelId | null {
  return normaliseAssessmentLevelId(levelId);
}



function loadSavedClasses(): SchoolClass[] {
  if (typeof window === "undefined") return [];

  try {
        const raw = readMyClassesStorageValue();
    if (!raw) return [];

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];

    return parsed
      .map(normaliseClass)
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

  const builderCourseConfig = useMemo(() => {
    return getBuilderCourseConfig();
  }, []);

  const activeSkillsData = useMemo<Record<string, Skill[]>>(() => {
  return (builderCourseConfig.skillTree ?? {}) as Record<string, Skill[]>;
}, [builderCourseConfig]);

const defaultBuilderPaper = useMemo(() => {
  return getDefaultBuilderPaper(builderCourseConfig);
}, [builderCourseConfig]);

  const [standardFilter, setStandardFilter] = useState<StandardFilter>("C+A");
  const [thinkingTypeFilter, setThinkingTypeFilter] =
    useState<ThinkingTypeFilter>("ANY");
  const [targetMarks, setTargetMarks] = useState<number>(2);

  const [activePaper, setActivePaper] = useState<Paper>(defaultBuilderPaper);
  const [viewPaper, setViewPaper] = useState<Paper>(defaultBuilderPaper);

  const {
  targetMarksByPaper: builderTargetMarksByPaper,
  setTargetMarksByPaper: setBuilderTargetMarksByPaper,
  p1Target,
  p2Target,
  setP1Target,
  setP2Target,
} = useBuilderTargetMarksState({
  courseConfig: builderCourseConfig,
});

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
  const [draftByPaper, setDraftByPaper] = useState<DraftByPaper>(() => {
  return buildEmptyQuestionDraftsByPaper(builderCourseConfig);
});

const [editDraftByPaper, setEditDraftByPaper] = useState<EditDraftByPaper>(() => {
  return buildEmptyEditDraftsByPaper(builderCourseConfig);
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

 const {
  coverDateByPaper,
  startTimeByPaper,
  endTimeByPaper,
  endTimeManuallyEditedByPaper,
  endTimeSetterByPaper,
  coverDateCustomByPaper,

  setCoverDateByPaper,
  setStartTimeByPaper,
  setEndTimeByPaper,
  setCoverDateCustomByPaper,
  setEndTimeManuallyEditedByPaper,

  setStartTimeForPaper,
  setEndTimeForPaper,
  setCoverDateForPaper,
  setCoverDateCustomForPaper,
  setEndTimeManuallyEditedForPaper,

  p1StartTime,
  p1EndTime,
  p2CoverDate,
  p2StartTime,
  p2EndTime,
  p2DateCustom,
  p1EndTimeManuallyEdited,
  p2EndTimeManuallyEdited,

  setP1StartTime,
  setP1EndTime,
  setP2CoverDate,
  setP2StartTime,
  setP2EndTime,
  setP2DateCustom,
  setP1EndTimeManuallyEdited,
  setP2EndTimeManuallyEdited,
} = useBuilderPaperSittingState({
  courseConfig: builderCourseConfig,
  assessmentDate,
});

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

    setTargetMarksByPaper: setBuilderTargetMarksByPaper,   

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
  marksByPaper,
  minutesByPaper,
} = useBuilderProgressMetrics({
  questions,
  viewPaper,
});



  const { handleAssessmentNameFocus, handleAssessmentNameBlur } =
  useBuilderMetadataTiming({
    assessmentName,
    setAssessmentName,

    marksByPaper,
    startTimeByPaper,
    endTimeManuallyEditedByPaper,
    endTimeSetterByPaper,
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

    setBuilderTargetMarksByPaper(
      savedAssessment.builder.targetMarksByPaper ?? {
        P1: savedAssessment.builder.p1Target,
        P2: savedAssessment.builder.p2Target,
      }
    );

    setQuestions(savedAssessment.builder.questions);
    setDraftByPaper(savedAssessment.builder.draftByPaper);
    setEditDraftByPaper(savedAssessment.builder.editDraftByPaper);

    setIncludeCoverSheet(savedAssessment.builder.includeCoverSheet);
    setIncludeFormulaSheet(savedAssessment.builder.includeFormulaSheet);
    setShowCoverDateTime(savedAssessment.builder.showCoverDateTime);
    setShowScottishCandidateNumberBox(
      savedAssessment.builder.showScottishCandidateNumberBox
    );

    setCoverDateByPaper(
  savedAssessment.builder.coverDateByPaper ?? {
    P1: savedAssessment.builder.assessmentDate,
    P2: savedAssessment.builder.p2CoverDate,
  }
);

setStartTimeByPaper(
  savedAssessment.builder.startTimeByPaper ?? {
    P1: savedAssessment.builder.p1StartTime,
    P2: savedAssessment.builder.p2StartTime,
  }
);

setEndTimeByPaper(
  savedAssessment.builder.endTimeByPaper ?? {
    P1: savedAssessment.builder.p1EndTime,
    P2: savedAssessment.builder.p2EndTime,
  }
);

setCoverDateCustomByPaper(
  savedAssessment.builder.coverDateCustomByPaper ?? {
    P1: false,
    P2: savedAssessment.builder.p2DateCustom,
  }
);

setEndTimeManuallyEditedByPaper({
  P1: savedAssessment.builder.p1EndTime.trim().length > 0,
  P2: savedAssessment.builder.p2EndTime.trim().length > 0,
});

    setBuilderSelectedClassIds(savedAssessment.setup.selectedClassIds);
    setBuilderUseCompleteCourseCoverage(
      savedAssessment.setup.useCompleteCourseCoverage
    );

    setSaveStateLabel("Saved");
    setIsSaving(false);
    setHasLoadedSavedAssessment(true);
  }, []);

  const builderLevelLabel = useMemo(() => {
  return getAssessmentLevelLabel(loadedSavedAssessment?.setup.levelId);
}, [loadedSavedAssessment]);

  const builderAvailableClasses = useMemo(() => {
  if (!loadedSavedAssessment?.setup.levelId) return [];

  const expectedCourseId = getCourseIdForLevelId(
    loadedSavedAssessment.setup.levelId
  );

  if (!expectedCourseId) return [];

  return savedClasses.filter(
    (schoolClass) => schoolClass.courseId === expectedCourseId
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

        targetMarksByPaper: builderTargetMarksByPaper,
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
    builderTargetMarksByPaper,
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

  const editDraftRef = useRef<EditDraftByPaper>(  buildEmptyEditDraftsByPaper(builderCourseConfig));
  useEffect(() => {
    editDraftRef.current = editDraftByPaper;
  }, [editDraftByPaper]);

  const selectedClassesForCoverage = useMemo(() => {
  if (!loadedSavedAssessment) return [];

  const expectedCourseId = getCourseIdForLevelId(
    loadedSavedAssessment.setup.levelId
  );

  const selectedClasses = builderSelectedClassIds
    .map((classId) =>
      savedClasses.find((schoolClass) => schoolClass.id === classId)
    )
    .filter(
      (schoolClass): schoolClass is SchoolClass => schoolClass !== undefined
    );

  if (!expectedCourseId) return selectedClasses;

  return selectedClasses.filter(
    (schoolClass) => schoolClass.courseId === expectedCourseId
  );
}, [loadedSavedAssessment, savedClasses, builderSelectedClassIds]);

  const sharedCompletedSkillIds = useMemo(() => {
    return getSharedCompletedSkillIds(selectedClassesForCoverage);
  }, [selectedClassesForCoverage]);

  const filteredSkillsData = useMemo<Record<string, Skill[]>>(() => {
  if (!loadedSavedAssessment) {
    return activeSkillsData;
  }

  if (builderUseCompleteCourseCoverage) {
    return activeSkillsData;
  }

  if (builderSelectedClassIds.length === 0) {
    return activeSkillsData;
  }

  if (selectedClassesForCoverage.length === 0) {
    return activeSkillsData;
  }

  const allowedSkillIds = new Set(sharedCompletedSkillIds);

  return buildFilteredSkillsData(activeSkillsData, allowedSkillIds);
}, [
  activeSkillsData,
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

      const categorySkills = (activeSkillsData[question.category] ?? []) as Skill[];
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
      activeSkillsData,
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
    thinkingTypeFilter,
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

  const {
  targetMarksByPaper,
  includedPapers,
  totalAssessmentMarks,
} = useBuilderPaperTargetMaps({
  targetMarksByPaper: builderTargetMarksByPaper,
  courseConfig: builderCourseConfig,
});

const progressHudPaperRows = useBuilderProgressHudRows({
  courseConfig: builderCourseConfig,
  marksByPaper,
  targetMarksByPaper,
  minutesByPaper,
});

  const topicBalanceAnalysis = useMemo(() => {
    return analyseTopicBalance({
      questions,
      totalAssessmentMarks,
      courseConfig: builderCourseConfig,
      includedPapers,
    });
  }, [questions, totalAssessmentMarks, includedPapers, builderCourseConfig]);

  const topicQualityNotes = useMemo<Array<string | BuilderNote>>(() => {
  return buildTopicBalanceNotes({
    analysis: topicBalanceAnalysis,
    courseConfig: builderCourseConfig,
    includeBasisNote: true,
    includeRecommendationNote: true,
  });
}, [topicBalanceAnalysis, builderCourseConfig]);

  const operationalReasoningNotes = useMemo<Array<string | BuilderNote>>(() => {
  return buildOperationalReasoningNotes({
    questions,
    courseConfig: builderCourseConfig,
    includedPapers,
    totalAssessmentMarks,
    includeBasisNote: true,
    includeRecommendationNote: true,
  });
}, [questions, includedPapers, totalAssessmentMarks, builderCourseConfig]);

 const calculatorSuitabilityNotes = useMemo<Array<string | BuilderNote>>(() => {
  return buildCalculatorSuitabilityNotes({
    questions,
    courseConfig: builderCourseConfig,
    includedPapers,
  });
}, [questions, includedPapers, builderCourseConfig]);

  const standardBalanceNotes = useMemo<Array<string | BuilderNote>>(() => {
  return buildStandardBalanceNotes({
    questions,
    courseConfig: builderCourseConfig,
    includedPapers,
    totalAssessmentMarks,
    includeBasisNote: true,
    includeRecommendationNote: true,
  });
}, [questions, includedPapers, totalAssessmentMarks, builderCourseConfig]);

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
  coverDateByPaper,
  startTimeByPaper,
  endTimeByPaper,
  fallbackCoverDate: assessmentDate,
});

const {
  printSubjectName,
  printQualificationBadge,
  printQualificationLabelLines,
  paperPrintTitle,
  paperCoverInstructionText,
  showNoCalculatorIcon,
} = useBuilderPaperPrintMetadata({
  paper: viewPaper,
  courseConfig: builderCourseConfig,
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
              printSubjectName={printSubjectName}
              printQualificationBadge={printQualificationBadge}
              printQualificationLabelLines={printQualificationLabelLines}
              paperPrintTitle={paperPrintTitle}
              paperCoverInstructionText={paperCoverInstructionText}
              showNoCalculatorIcon={showNoCalculatorIcon}
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
              paperRows={progressHudPaperRows}
              qualityNotes={qualityNotes}
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
          coverDateByPaper={coverDateByPaper}
          startTimeByPaper={startTimeByPaper}
          endTimeByPaper={endTimeByPaper}
          coverDateCustomByPaper={coverDateCustomByPaper}
          setStartTimeForPaper={setStartTimeForPaper}
          setEndTimeForPaper={setEndTimeForPaper}
          setCoverDateForPaper={setCoverDateForPaper}
          setCoverDateCustomForPaper={setCoverDateCustomForPaper}
          setEndTimeManuallyEditedForPaper={setEndTimeManuallyEditedForPaper}
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