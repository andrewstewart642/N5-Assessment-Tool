import {
  useCallback,
  type Dispatch,
  type SetStateAction,
} from "react";

import {
  getFilteredConcepts,
  rankConceptsByTargetMarks,
} from "@/src/Courses/National5Maths/QuestionAndAnswerGeneration/QuestionWriting/ConceptSelection";

import type {
  DifficultyLevel,
  Paper,
  Question,
  Skill,
  StandardFilter,
} from "@/shared-types/AssessmentTypes";

type UseQuestionTreeRestorationArgs = {
  activeSkillsData:
    Record<string, Skill[]>;

  expandCategory:
    (category: string) => void;

  expandSkill:
    (skillId: string) => void;

  setConceptIndex: (
    skillId: string,
    index: number
  ) => void;

  setDifficulty: (
    skillId: string,
    difficulty: DifficultyLevel
  ) => void;

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

export function useQuestionTreeRestoration({
  activeSkillsData,

  expandCategory,
  expandSkill,

  setConceptIndex,
  setDifficulty,

  setStandardFilter,
  setTargetMarks,

  setActivePaper,
  setViewPaper,
}: UseQuestionTreeRestorationArgs) {
  const restoreTreeForQuestion =
    useCallback(
      (question: Question) => {
        setStandardFilter(
          question.standardFilter
        );

        setTargetMarks(
          question.targetMarks
        );

        setActivePaper(
          question.paper
        );

        setViewPaper(
          question.paper
        );

        if (
          !question.category ||
          !question.skillId
        ) {
          return;
        }

        expandCategory(
          question.category
        );

        expandSkill(
          question.skillId
        );

        const categorySkills =
          activeSkillsData[
            question.category
          ] ?? [];

        const skill =
          categorySkills.find(
            (entry) =>
              entry.id ===
              question.skillId
          );

        if (!skill) {
          setDifficulty(
            question.skillId,
            question.difficulty
          );

          return;
        }

        const filteredConcepts =
          getFilteredConcepts(
            skill,
            question.standardFilter
          );

        const rankedConcepts =
          rankConceptsByTargetMarks(
            filteredConcepts,
            question.targetMarks
          );

        const conceptIndex =
          rankedConcepts.findIndex(
            (concept) =>
              (
                question.conceptId &&
                concept.id ===
                  question.conceptId
              ) ||
              concept.label ===
                question.concept ||
              concept.code ===
                question.concept ||
              `${
                concept.code
              } ${
                concept.shortLabel ??
                ""
              }`.trim() ===
                question.concept.trim()
          );

        setConceptIndex(
          skill.id,
          conceptIndex >= 0
            ? conceptIndex
            : -1
        );

        setDifficulty(
          question.skillId,
          question.difficulty
        );
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

  return {
    restoreTreeForQuestion,
  };
}