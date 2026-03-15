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
import {
  APPEARANCE_STORAGE_KEY,
  getTheme,
  type AppearancePreference,
} from "@/app/ui/AppTheme";
import type {
  Paper,
  Question,
  Skill,
  StandardFilter,
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
import {
  getFilteredConcepts,
  rankConceptsByTargetMarks,
} from "@/math-helpers/QuestionLogic";
import {
  analyseTopicBalance,
  calculateTotalAssessmentMarks,
} from "./builder-logic/AssessmentDistributionAnalysis";

import {
  clamp,
  type DraftByPaper,
  type EditDraftByPaper,
} from "./BuilderUtils";

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

export default function CreateAssessmentBuilderPage() {
  const router = useRouter();

  const [standardFilter, setStandardFilter] = useState<StandardFilter>("C+A");
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
  const [draftByPaper, setDraftByPaper] = useState<DraftByPaper>({ P1: null, P2: null });
  const [editDraftByPaper, setEditDraftByPaper] = useState<EditDraftByPaper>({
    P1: null,
    P2: null,
  });

  const [measuredHeights, setMeasuredHeights] = useState<Record<string, number>>({});

  const previewPaneRef = useRef<HTMLDivElement | null>(null);
  const pageWrapperRefs = useRef<Array<HTMLDivElement | null>>([]);
  const pendingJumpDraftRef = useRef<{ paper: Paper; draftId: string } | null>(null);
  const builderDateFieldRef = useRef<HTMLDivElement | null>(null);

  const [includeCoverSheet, setIncludeCoverSheet] = useState(false);
  const [showCoverDateTime, setShowCoverDateTime] = useState(false);
  const [showScottishCandidateNumberBox, setShowScottishCandidateNumberBox] =
    useState(true);
  const [includeFormulaSheet, setIncludeFormulaSheet] = useState(false);

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [appearance, setAppearance] = useState<AppearancePreference>("dark");
  const [systemPrefersDark, setSystemPrefersDark] = useState(true);

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

  const theme = useMemo(
    () => getTheme(appearance, systemPrefersDark),
    [appearance, systemPrefersDark]
  );

  useBuilderInitialisation({
    defaultHudHeight: DEFAULT_HUD_HEIGHT,
    appearanceStorageKey: APPEARANCE_STORAGE_KEY,
    clampFn: clamp,

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
    appearance,
    appearanceStorageKey: APPEARANCE_STORAGE_KEY,

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

  const {
    qualityNotes,
    flashWarning,
    pushFlash,
    addQualityNote,
  } = useBuilderFlashFeedback();

  useBuilderUiChrome({
    builderCalendarOpen,
    setBuilderCalendarOpen,
    builderDateFieldRef,
    settingsOpen,
    setSettingsOpen,
  });

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

  const { handleAssessmentNameFocus, handleAssessmentNameBlur } = useBuilderMetadataTiming({
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

  const editDraftRef = useRef<EditDraftByPaper>({ P1: null, P2: null });
  useEffect(() => {
    editDraftRef.current = editDraftByPaper;
  }, [editDraftByPaper]);

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
          `${concept.code} ${concept.shortLabel ?? ""}`.trim() === question.concept.trim()
      );

      setConceptIndex(skill.id, conceptIndex >= 0 ? conceptIndex : -1);
      setDifficulty(skill.id, question.difficulty);
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

  const totalSkillsCount = useMemo(() => {
    return Object.values(skillsData).reduce<number>(
      (acc, list) => acc + (list as Skill[]).length,
      0
    );
  }, []);

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
  const notes: BuilderNote[] = [];

  notes.push({
    id: "topic-basis",
    severity: "suggestion",
    source: "topic-balance",
    rank: 1,
    message: `Topic balance basis: ${topicBalanceAnalysis.totalAssessmentMarks} total assessment marks across ${topicBalanceAnalysis.includedPapers.join(" + ")}.`,
  });

  const statsRow = topicBalanceAnalysis.rows.find((row) => row.topic === "STAT");

  if (statsRow) {
    const statsOutsideRange =
      statsRow.currentPct < statsRow.minPct || statsRow.currentPct > statsRow.maxPct;

    notes.push({
      id: "topic-statistics",
      severity: statsOutsideRange ? "essential" : "advised",
      source: "topic-balance",
      rank: statsOutsideRange ? 100 : 70,
      message: `Statistics currently contributes ${statsRow.currentMarks} marks (${statsRow.currentPct}%). Target midpoint is ${statsRow.targetMarks} marks (${statsRow.targetPct}%), with an SQA-style range of ${statsRow.minMarks}–${statsRow.maxMarks} marks.`,
    });
  }

  if (topicBalanceAnalysis.recommendedNextTopic) {
    notes.push({
      id: "topic-recommendation",
      severity: "suggestion",
      source: "topic-balance",
      rank: 10,
      message: `Recommended next topic area: ${topicBalanceAnalysis.recommendedNextTopic.label}.`,
    });
  }

  return notes;
}, [topicBalanceAnalysis]);

  const mergedQualityNotes = useMemo(() => {
    return [...qualityNotes, ...topicQualityNotes];
  }, [qualityNotes, topicQualityNotes]);

  const viewerHudRow = showProgressPanel ? `${hudHeight}px` : "0px";
  const dividerWidth = BUILDER_DIVIDER_WIDTH_PX;
  const bodyGridColumns = `${(leftPaneRatio * 100).toFixed(3)}% ${dividerWidth}px minmax(0, 1fr)`;
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

  return (
    <>
      <BuilderGlobalStyles theme={theme} />

      <main
        style={{
          height: "100vh",
          background: theme.pageBg,
          color: theme.text,
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
            overflow: "hidden",
            fontFamily: UI_TYPO.family,
          }}
        >
          <SkillsTree
            skillsData={skillsData as any}
            totalSkillsCount={totalSkillsCount}
            standardFilter={standardFilter}
            setStandardFilter={setStandardFilter}
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
              background: isDraggingDivider
                ? theme.pageBg === "#eef3f8"
                  ? "#cfe0f5"
                  : "#1e2b3b"
                : (theme as any).borderSoft ?? theme.border,
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
                opacity: isDraggingDivider ? 1 : 0.4,
              }}
            />
          </div>

          <section
            style={{
              background: theme.panelBg2,
              display: "grid",
              gridTemplateRows: `65px minmax(0, 1fr) ${viewerHudRow}`,
              minHeight: 0,
              overflow: "hidden",
              position: "relative",
              fontFamily: UI_TYPO.family,
            }}
          >
            <BuilderTopBar
              theme={theme}
              assessmentName={assessmentName}
              setAssessmentName={setAssessmentName}
              className={className}
              setClassName={setClassName}
              assessmentDate={assessmentDate}
              setAssessmentDate={setAssessmentDate}
              builderCalendarOpen={builderCalendarOpen}
              setBuilderCalendarOpen={setBuilderCalendarOpen}
              builderDateFieldRef={builderDateFieldRef}
              handleAssessmentNameFocus={handleAssessmentNameFocus}
              handleAssessmentNameBlur={handleAssessmentNameBlur}
              viewPaper={viewPaper}
              setViewPaper={setViewPaper}
            />

            <BuilderPreviewPane
              theme={theme}
              previewPaneRef={previewPaneRef}
              pageWrapperRefs={pageWrapperRefs}
              flashWarning={flashWarning}
              currentViewerPage={currentViewerPage}
              totalViewerPages={totalViewerPages}
              zoomPct={zoomPct}
              zoomIn={zoomIn}
              zoomOut={zoomOut}
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
              routerPushCompile={() => router.push("/compile-assessment")}
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
            />
          </section>
        </div>

        <BuilderSettingsPanel
          open={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          theme={theme}
          appearance={appearance}
          setAppearance={setAppearance}
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