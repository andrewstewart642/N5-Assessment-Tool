import type {
  Dispatch,
  SetStateAction,
} from "react";

import {
  useSkillsTreeState,
} from "./02-SkillsTree/useSkillsTreeState";

import type {
  Paper,
  Skill,
  StandardFilter,
} from "@/src/Assessments/AssessmentTypes";

import { useQuestionTreeRestoration } from "./useQuestionTreeRestoration";

type UseAssessmentSkillsPanelStateArgs = {
  activeSkillsData:
    Record<string, Skill[]>;

  setStandardFilter:
    Dispatch<
      SetStateAction<StandardFilter>
    >;

  setTargetMarks:
    Dispatch<
      SetStateAction<number>
    >;

  setActivePaper:
    Dispatch<
      SetStateAction<Paper>
    >;

  setViewPaper:
    Dispatch<
      SetStateAction<Paper>
    >;
};

export function useAssessmentSkillsPanelState({
  activeSkillsData,

  setStandardFilter,
  setTargetMarks,

  setActivePaper,
  setViewPaper,
}: UseAssessmentSkillsPanelStateArgs) {
  const {
    collapsedCategories,
    expandedSkillIds,

    conceptIndexBySkill,
    difficultyBySkill,

    toggleCategory,
    expandCategory,

    toggleSkill:
      toggleSkillRow,

    expandSkill,

    setConceptIndex,
    setDifficulty,

    collapseAllSkills,
  } =
    useSkillsTreeState();

  const {
    restoreTreeForQuestion,
  } =
    useQuestionTreeRestoration({
      activeSkillsData,

      expandCategory,
      expandSkill,

      setConceptIndex,
      setDifficulty,

      setStandardFilter,
      setTargetMarks,

      setActivePaper,
      setViewPaper,
    });

  function getConceptIndex(
    skillId: string
  ) {
    return (
      conceptIndexBySkill[
        skillId
      ] ?? -1
    );
  }

  function getDifficulty(
    skillId: string
  ) {
    return (
      difficultyBySkill[
        skillId
      ] ?? 3
    );
  }

  return {
    collapsedCategories,
    expandedSkillIds,

    toggleCategory,
    toggleSkillRow,

    collapseAllSkills,

    setConceptIndex,
    setDifficulty,

    getConceptIndex,
    getDifficulty,

    restoreTreeForQuestion,
  };
}