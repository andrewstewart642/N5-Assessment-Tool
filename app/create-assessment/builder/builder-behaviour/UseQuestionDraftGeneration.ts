import { useCallback } from "react";

import { getSpacingBasePx } from "@/app/paper-layout/N5-Question-Spacing-px";
import { makeId } from "@/math-helpers/QuestionLogic";
import type {
  DifficultyLevel,
  Paper,
  Question,
  Skill,
  StandardFilter,
} from "@/shared-types/AssessmentTypes";
import { DEFAULT_QUESTION_SPACING_BASE_PX } from "../builder-definitions/BuilderConstants";
import {
  buildGenerated,
  buildSkillLinks,
  getConceptFromSelection,
} from "../builder-logic/BuilderQuestionGenerators";
import {
  buildSingleTopicMarkBreakdown,
} from "../builder-logic/AssessmentDistributionAnalysis";
import type { DraftByPaper, EditDraftByPaper } from "../BuilderUtils";

type PendingJumpRef = React.MutableRefObject<{ paper: Paper; draftId: string } | null>;
type EditDraftRef = React.MutableRefObject<EditDraftByPaper>;

type UseQuestionDraftGenerationArgs = {
  standardFilter: StandardFilter;
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
  const code = question.questionCode;
  return {
    ...question,
    spacingBasePx: code ? getSpacingBasePx(code) : DEFAULT_QUESTION_SPACING_BASE_PX,
  };
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

export function useQuestionDraftGeneration({
  standardFilter,
  targetMarks,
  editDraftRef,
  setDraftByPaper,
  setEditDraftByPaper,
  setViewPaper,
  pendingJumpDraftRef,
  pushFlash,
  addQualityNote,
}: UseQuestionDraftGenerationArgs) {
  const addQuestionToPaper = useCallback(
    (
      category: string,
      skill: Skill,
      concept: string,
      difficulty: DifficultyLevel,
      paper: Paper
    ) => {
      if (skill.paperSuitability !== "BOTH" && skill.paperSuitability !== paper) {
        const msg = `Paper mismatch: ${skill.code} is typically ${skill.paperSuitability} but you added it to ${paper}.`;
        pushFlash(msg);
        addQualityNote(`• ${msg}`);
      }

      const generated = buildGenerated(skill, concept, difficulty);
      const conceptMeta = getConceptFromSelection(skill, concept);
      const skillLinks = buildSkillLinks(skill, conceptMeta);
      const resolvedMarks = resolveGeneratedTotalMarks(generated, targetMarks);

      const draft = withSpacingBase({
        id: makeId(),
        category,
        courseId: "N5_MATH",
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
        topicMarkBreakdown:
          generated.topicMarkBreakdown ??
          buildSingleTopicMarkBreakdown(skill.domain, resolvedMarks),
      });

      pendingJumpDraftRef.current = { paper, draftId: draft.id };
      setDraftByPaper((prev) => ({ ...prev, [paper]: draft }));
      setViewPaper((prev) => (prev === paper ? prev : paper));
    },
    [
      standardFilter,
      targetMarks,
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
      if (skill.paperSuitability !== "BOTH" && skill.paperSuitability !== paper) {
        const msg = `Paper mismatch: ${skill.code} is typically ${skill.paperSuitability} but you regenerated it for ${paper}.`;
        pushFlash(msg);
        addQualityNote(`• ${msg}`);
      }

      const generated = buildGenerated(skill, concept, difficulty);
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
            courseId: "N5_MATH",
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
            topicMarkBreakdown:
              generated.topicMarkBreakdown ??
              buildSingleTopicMarkBreakdown(skill.domain, resolvedMarks),
          });

          pendingJumpDraftRef.current = { paper, draftId: nextDraft.id };

          return { ...prev, [paper]: { ...nowEdit, draft: nextDraft } };
        });

        setViewPaper((prev) => (prev === paper ? prev : paper));
        return;
      }

      setDraftByPaper((prevDrafts) => {
        const nextDraft = withSpacingBase({
          id: prevDrafts[paper]?.id ?? makeId(),
          category,
          courseId: "N5_MATH",
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
          topicMarkBreakdown:
            generated.topicMarkBreakdown ??
            buildSingleTopicMarkBreakdown(skill.domain, resolvedMarks),
        });

        pendingJumpDraftRef.current = { paper, draftId: nextDraft.id };

        return { ...prevDrafts, [paper]: nextDraft };
      });

      setViewPaper((prev) => (prev === paper ? prev : paper));
    },
    [
      standardFilter,
      targetMarks,
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