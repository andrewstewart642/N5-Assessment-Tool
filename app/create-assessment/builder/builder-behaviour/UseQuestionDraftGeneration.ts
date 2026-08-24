import { useCallback } from "react";

import { makeId } from "@/math-helpers/QuestionLogic_TEMP";
import type {
  DifficultyLevel,
  Paper,
  Question,
  Skill,
  StandardFilter,
  ThinkingTypeFilter,
} from "@/shared-types/AssessmentTypes";
import type { QuestionSelectionFilters } from "@/shared-types/QuestionSelectionTypes";
import { getCoursePaperSuitabilityTags } from "@/course-data/course-configs/CourseConfigTypes";
import {
  buildGenerated,
  buildSkillLinks,
  getConceptFromSelection,
} from "../builder-logic/BuilderQuestionGenerators";
import { buildSingleTopicMarkBreakdown } from "../builder-logic/AssessmentDistributionAnalysis";
import { getBuilderCourseId } from "../builder-logic/BuilderCourseConfig";
import {
  formatBuilderPaperSuitability,
  getBuilderPaperConfig,
  getBuilderPaperLabel,
  isPaperSuitableForSkill,
} from "../builder-logic/BuilderPaperTargets";
import { applyBuilderQuestionSpacingBase } from "../builder-logic/BuilderQuestionSpacing";
import type { DraftByPaper, EditDraftByPaper } from "../BuilderUtils";

type PendingJumpRef = React.MutableRefObject<{
  paper: Paper;
  draftId: string;
} | null>;

type EditDraftRef = React.MutableRefObject<EditDraftByPaper>;

type UseQuestionDraftGenerationArgs = {
  standardFilter: StandardFilter;
  thinkingTypeFilter: ThinkingTypeFilter;
  targetMarks: number;

  editDraftRef: EditDraftRef;

  setDraftByPaper: React.Dispatch<React.SetStateAction<DraftByPaper>>;
  setEditDraftByPaper: React.Dispatch<React.SetStateAction<EditDraftByPaper>>;
  setViewPaper: React.Dispatch<React.SetStateAction<Paper>>;

  pendingJumpDraftRef: PendingJumpRef;

  pushFlash: (message: string) => void;
  addQualityNote: (message: string) => void;
};

function withSpacingBase(question: Question): Question {
  return applyBuilderQuestionSpacingBase(question);
}

function resolvePreferredAnswerMethodFamilyId(
  previousQuestion: Question | null | undefined,
  generated:
    ReturnType<typeof buildGenerated>
): string | undefined {
  const workedAnswers =
    generated.workedAnswers;

  if (
    !workedAnswers ||
    workedAnswers.methods.length === 0
  ) {
    return undefined;
  }

  const previousPreference =
    previousQuestion
      ?.preferredAnswerMethodFamilyId;

  if (
    previousPreference &&
    workedAnswers.methods.some(
      (method) =>
        method.methodFamilyId ===
        previousPreference
    )
  ) {
    return previousPreference;
  }

  return (
    workedAnswers.defaultMethodFamilyId ??
    workedAnswers.methods[0]
      .methodFamilyId
  );
}

function resolveGeneratedTotalMarks(
  generated: ReturnType<typeof buildGenerated>,
  targetMarks: number
): number {
  if (
    typeof generated.markBreakdown?.totalMarks === "number" &&
    Number.isFinite(generated.markBreakdown.totalMarks)
  ) {
    return generated.markBreakdown.totalMarks;
  }

  if (typeof generated.marks === "number" && Number.isFinite(generated.marks)) {
    return generated.marks;
  }

  return targetMarks;
}

function buildSelectionFilters(args: {
  standardFilter: StandardFilter;
  thinkingTypeFilter: ThinkingTypeFilter;
  targetMarks: number;
  paper: Paper;
}): QuestionSelectionFilters {
  const paperConfig = getBuilderPaperConfig(args.paper);

  return {
    selectedStandard: args.standardFilter,
    selectedThinkingType: args.thinkingTypeFilter,
    targetMarks: args.targetMarks,
    targetPaper: args.paper,
    targetPaperSuitabilityTags: getCoursePaperSuitabilityTags(paperConfig),
  };
}

function buildPaperMismatchMessage({
  skill,
  paper,
  actionText,
}: {
  skill: Skill;
  paper: Paper;
  actionText: string;
}): string {
  return `Paper mismatch: ${skill.code} is typically ${formatBuilderPaperSuitability(
    skill.paperSuitability
  )} but you ${actionText} ${getBuilderPaperLabel(paper)}.`;
}

function warnIfPaperMismatch({
  skill,
  paper,
  actionText,
  pushFlash,
  addQualityNote,
}: {
  skill: Skill;
  paper: Paper;
  actionText: string;
  pushFlash: (message: string) => void;
  addQualityNote: (message: string) => void;
}): void {
  if (
    isPaperSuitableForSkill({
      paper,
      paperSuitability: skill.paperSuitability,
    })
  ) {
    return;
  }

  const message = buildPaperMismatchMessage({
    skill,
    paper,
    actionText,
  });

  pushFlash(message);
  addQualityNote(`• ${message}`);
}

export function useQuestionDraftGeneration({
  standardFilter,
  thinkingTypeFilter,
  targetMarks,

  editDraftRef,

  setDraftByPaper,
  setEditDraftByPaper,
  setViewPaper,

  pendingJumpDraftRef,

  pushFlash,
  addQualityNote,
}: UseQuestionDraftGenerationArgs) {
  const builderCourseId = getBuilderCourseId();

  const addQuestionToPaper = useCallback(
    (
      category: string,
      skill: Skill,
      concept: string,
      difficulty: DifficultyLevel,
      paper: Paper
    ) => {
      warnIfPaperMismatch({
        skill,
        paper,
        actionText: "added it to",
        pushFlash,
        addQualityNote,
      });

      const selectionFilters = buildSelectionFilters({
        standardFilter,
        thinkingTypeFilter,
        targetMarks,
        paper,
      });

      const generated = buildGenerated(
        skill,
        concept,
        difficulty,
        selectionFilters
      );

      const conceptMeta = getConceptFromSelection(skill, concept);
      const skillLinks = buildSkillLinks(skill, conceptMeta);
      const resolvedMarks = resolveGeneratedTotalMarks(generated, targetMarks);

      const draft = withSpacingBase({
        id: makeId(),
        category,
        courseId: builderCourseId,
        skillId: skill.id,
        skillCode: skill.code,
        skillText: skill.text,
        skillDomain: skill.domain,
        primarySkillId: skill.id,
        primaryConceptId: conceptMeta?.id,
        supportingSkillIds: [],
        skillLinks,
        standardFilter,
        concept,
        conceptId: conceptMeta?.id,
        difficulty,
        targetMarks,
        createdAt: Date.now(),
        paper,
          ...generated,

          preferredAnswerMethodFamilyId:
            resolvePreferredAnswerMethodFamilyId(
              null,
              generated
            ),

          topicMarkBreakdown:
          generated.topicMarkBreakdown ??
          buildSingleTopicMarkBreakdown(skill.domain, resolvedMarks),
      });

      pendingJumpDraftRef.current = {
        paper,
        draftId: draft.id,
      };

      setDraftByPaper((prev) => ({
        ...prev,
        [paper]: draft,
      }));

      setViewPaper((prev) => (prev === paper ? prev : paper));
    },
    [
      standardFilter,
      thinkingTypeFilter,
      targetMarks,
      builderCourseId,
      setDraftByPaper,
      setViewPaper,
      pendingJumpDraftRef,
      pushFlash,
      addQualityNote,
    ]
  );

  const regenerateQuestionToPaper = useCallback(
    (
      category: string,
      skill: Skill,
      concept: string,
      difficulty: DifficultyLevel,
      paper: Paper
    ) => {
      warnIfPaperMismatch({
        skill,
        paper,
        actionText: "regenerated it for",
        pushFlash,
        addQualityNote,
      });

      const selectionFilters = buildSelectionFilters({
        standardFilter,
        thinkingTypeFilter,
        targetMarks,
        paper,
      });

      const generated = buildGenerated(
        skill,
        concept,
        difficulty,
        selectionFilters
      );

      const conceptMeta = getConceptFromSelection(skill, concept);
      const skillLinks = buildSkillLinks(skill, conceptMeta);
      const resolvedMarks = resolveGeneratedTotalMarks(generated, targetMarks);

      const activeEdit = editDraftRef.current[paper];

      if (activeEdit) {
        setEditDraftByPaper((prev) => {
          const nowEdit = prev[paper];
          if (!nowEdit) return prev;

          const nextDraft = withSpacingBase({
            ...nowEdit.draft,
            category,
            courseId: builderCourseId,
            skillId: skill.id,
            skillCode: skill.code,
            skillText: skill.text,
            skillDomain: skill.domain,
            primarySkillId: skill.id,
            primaryConceptId: conceptMeta?.id,
            supportingSkillIds: [],
            skillLinks,
            standardFilter,
            concept,
            conceptId: conceptMeta?.id,
            difficulty,
            targetMarks,
            createdAt: Date.now(),
            paper,
              ...generated,

              preferredAnswerMethodFamilyId:
                resolvePreferredAnswerMethodFamilyId(
                  nowEdit.draft,
                  generated
                ),

              topicMarkBreakdown:
              generated.topicMarkBreakdown ??
              buildSingleTopicMarkBreakdown(skill.domain, resolvedMarks),
          });

          pendingJumpDraftRef.current = {
            paper,
            draftId: nextDraft.id,
          };

          return {
            ...prev,
            [paper]: {
              ...nowEdit,
              draft: nextDraft,
            },
          };
        });

        setViewPaper((prev) => (prev === paper ? prev : paper));
        return;
      }

      setDraftByPaper((prevDrafts) => {
        const nextDraft = withSpacingBase({
          id: prevDrafts[paper]?.id ?? makeId(),
          category,
          courseId: builderCourseId,
          skillId: skill.id,
          skillCode: skill.code,
          skillText: skill.text,
          skillDomain: skill.domain,
          primarySkillId: skill.id,
          primaryConceptId: conceptMeta?.id,
          supportingSkillIds: [],
          skillLinks,
          standardFilter,
          concept,
          conceptId: conceptMeta?.id,
          difficulty,
          targetMarks,
          createdAt: Date.now(),
          paper,
            ...generated,

            preferredAnswerMethodFamilyId:
              resolvePreferredAnswerMethodFamilyId(
                prevDrafts[paper],
                generated
              ),

            topicMarkBreakdown:
            generated.topicMarkBreakdown ??
            buildSingleTopicMarkBreakdown(skill.domain, resolvedMarks),
        });

        pendingJumpDraftRef.current = {
          paper,
          draftId: nextDraft.id,
        };

        return {
          ...prevDrafts,
          [paper]: nextDraft,
        };
      });

      setViewPaper((prev) => (prev === paper ? prev : paper));
    },
    [
      standardFilter,
      thinkingTypeFilter,
      targetMarks,
      builderCourseId,
      editDraftRef,
      setEditDraftByPaper,
      setDraftByPaper,
      setViewPaper,
      pendingJumpDraftRef,
      pushFlash,
      addQualityNote,
    ]
  );

  return {
    addQuestionToPaper,
    regenerateQuestionToPaper,
  };
}