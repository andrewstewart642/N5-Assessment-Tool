import {
  useState,
} from "react";

import type {
  DifficultyLevel,
} from "@/app/Assessments/AssessmentTypes";

type ConceptIndexBySkill =
  Record<string, number>;

type DifficultyBySkill =
  Record<
    string,
    DifficultyLevel
  >;

const DEFAULT_COLLAPSED_CATEGORIES:
  Record<string, boolean> = {
    "Numerical Skills": true,
    "Algebraic Skills": true,
    "Geometric Skills": true,
    "Trigonometric Skills": true,
    "Statistical Skills": true,
  };

export function useSkillsTreeState() {
  const [
    collapsedCategories,
    setCollapsedCategories,
  ] =
    useState<
      Record<string, boolean>
    >(
      DEFAULT_COLLAPSED_CATEGORIES
    );

  const [
    expandedSkillIds,
    setExpandedSkillIds,
  ] =
    useState<string[]>([]);

  const [
    conceptIndexBySkill,
    setConceptIndexBySkill,
  ] =
    useState<ConceptIndexBySkill>(
      {}
    );

  const [
    difficultyBySkill,
    setDifficultyBySkill,
  ] =
    useState<DifficultyBySkill>(
      {}
    );

  function toggleCategory(
    category: string
  ) {
    setCollapsedCategories(
      (previous) => ({
        ...previous,

        [category]:
          !previous[
            category
          ],
      })
    );
  }

  function expandCategory(
    category: string
  ) {
    setCollapsedCategories(
      (previous) => ({
        ...previous,

        [category]:
          false,
      })
    );
  }

  function toggleSkill(
    skillId: string
  ) {
    setExpandedSkillIds(
      (previous) =>
        previous.includes(
          skillId
        )
          ? previous.filter(
              (id) =>
                id !==
                skillId
            )
          : [
              ...previous,
              skillId,
            ]
    );
  }

  function expandSkill(
    skillId: string
  ) {
    setExpandedSkillIds(
      (previous) =>
        previous.includes(
          skillId
        )
          ? previous
          : [
              ...previous,
              skillId,
            ]
    );
  }

  function setConceptIndex(
    skillId: string,
    index: number
  ) {
    setConceptIndexBySkill(
      (previous) => ({
        ...previous,

        [skillId]:
          index,
      })
    );
  }

  function setDifficulty(
    skillId: string,
    difficulty:
      DifficultyLevel
  ) {
    setDifficultyBySkill(
      (previous) => ({
        ...previous,

        [skillId]:
          difficulty,
      })
    );
  }

  function collapseAllSkills() {
    setExpandedSkillIds([]);
  }

  return {
    collapsedCategories,
    expandedSkillIds,

    conceptIndexBySkill,
    difficultyBySkill,

    toggleCategory,
    expandCategory,

    toggleSkill,
    expandSkill,

    setConceptIndex,
    setDifficulty,

    collapseAllSkills,
  };
}