import { useState } from "react";
import type { DifficultyLevel } from "@/shared-types/AssessmentTypes";

type ConceptIndexBySkill = Record<string, number>;
type DifficultyBySkill = Record<string, DifficultyLevel>;

export function useSkillsTreeState() {
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});
  const [expandedSkillIds, setExpandedSkillIds] = useState<string[]>([]);

  const [conceptIndexBySkill, setConceptIndexBySkill] =
    useState<ConceptIndexBySkill>({});

  const [difficultyBySkill, setDifficultyBySkill] =
    useState<DifficultyBySkill>({});

  const toggleCategory = (category: string) => {
    setCollapsedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const toggleSkill = (skillId: string) => {
    setExpandedSkillIds((prev) =>
      prev.includes(skillId)
        ? prev.filter((id) => id !== skillId)
        : [...prev, skillId]
    );
  };

  const setConceptIndex = (skillId: string, index: number) => {
    setConceptIndexBySkill((prev) => ({
      ...prev,
      [skillId]: index,
    }));
  };

  const setDifficulty = (skillId: string, difficulty: DifficultyLevel) => {
    setDifficultyBySkill((prev) => ({
      ...prev,
      [skillId]: difficulty,
    }));
  };

  const collapseAllSkills = () => {
    setExpandedSkillIds([]);
  };

  return {
    collapsedCategories,
    expandedSkillIds,
    conceptIndexBySkill,
    difficultyBySkill,

    toggleCategory,
    toggleSkill,
    setConceptIndex,
    setDifficulty,
    collapseAllSkills,
  };
}