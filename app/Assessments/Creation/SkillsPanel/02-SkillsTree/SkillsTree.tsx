import {
  useEffect,
  useRef,
  useState,
} from "react";

import CategorySection from "./CategorySection";

import {
  getCoursePaperSuitabilityTags,
} from "@/app/Courses/CourseAssessmentConfig";

import {
  getAssessmentPaperConfig,
} from "@/app/Assessments/Creation/Papers/PaperRules";

import type {
  DifficultyLevel,
  Paper,
  Skill,
  StandardFilter,
  ThinkingTypeFilter,
} from "@/app/Assessments/AssessmentTypes";

import type {
  QuestionSelectionFilters,
} from "@/app/Assessments/Questions/Selection/QuestionSelectionTypes";

import type {
  AppTheme,
} from "@/app/UI/Application/Theme/AppTheme";

import {
  UI_TEXT,
} from "@/app/UI/Application/Typography/Typography";

import SkillsFilters, {
  type ConstraintPillId,
} from "../01-SkillsFilters/SkillsFilters";

type SkillsTreeProps = {
  skillsData:
    Record<string, Skill[]>;

  totalSkillsCount:
    number;

  standardFilter:
    StandardFilter;

  setStandardFilter: (
    value:
      StandardFilter
  ) => void;

  thinkingTypeFilter:
    ThinkingTypeFilter;

  setThinkingTypeFilter: (
    value:
      ThinkingTypeFilter
  ) => void;

  targetMarks:
    number;

  setTargetMarks: (
    value:
      number
  ) => void;

  minTargetMarks:
    number;

  maxTargetMarks:
    number;

  activePaper:
    Paper;

  setActivePaper: (
    paper:
      Paper
  ) => void;

  collapsedCategories:
    Record<
      string,
      boolean
    >;

  toggleCategory: (
    categoryName:
      string
  ) => void;

  expandedSkillIds:
    string[];

  toggleSkillRow: (
    skillId:
      string
  ) => void;

  collapseAllSkills:
    () => void;

  getConceptIndex: (
    skillId:
      string
  ) => number;

  setConceptIndex: (
    skillId:
      string,
    nextIndex:
      number
  ) => void;

  getDifficulty: (
    skillId:
      string
  ) => DifficultyLevel;

  setDifficulty: (
    skillId:
      string,
    next:
      DifficultyLevel
  ) => void;

  addQuestionToPaper: (
    category:
      string,
    skill:
      Skill,
    concept:
      string,
    difficulty:
      DifficultyLevel,
    paper:
      Paper
  ) => void;

  regenerateQuestionToPaper: (
    category:
      string,
    skill:
      Skill,
    concept:
      string,
    difficulty:
      DifficultyLevel,
    paper:
      Paper
  ) => void;

  /**
   * Removes the lower rounding/border when another Explorer-style section is
   * attached immediately beneath the Skills Tree.
   */
  attachedFooter?:
    boolean;

  theme:
    AppTheme;
};

export default function SkillsTree({
  skillsData,

  totalSkillsCount,

  standardFilter,
  setStandardFilter,

  thinkingTypeFilter,
  setThinkingTypeFilter,

  targetMarks,
  setTargetMarks,

  minTargetMarks,
  maxTargetMarks,

  activePaper,
  setActivePaper,

  collapsedCategories,
  toggleCategory,

  expandedSkillIds,
  toggleSkillRow,

  getConceptIndex,
  setConceptIndex,

  getDifficulty,
  setDifficulty,

  addQuestionToPaper,
  regenerateQuestionToPaper,

  attachedFooter = false,

  theme,
}: SkillsTreeProps) {
  const [
    flashingConstraint,
    setFlashingConstraint,
  ] =
    useState<
      ConstraintPillId | null
    >(
      null
    );

  const flashTimeoutRef =
    useRef<
      ReturnType<
        typeof setTimeout
      > | null
    >(
      null
    );

  const activePaperConfig =
    getAssessmentPaperConfig(
      activePaper
    );

  const selectionFilters:
    QuestionSelectionFilters = {
    selectedStandard:
      standardFilter,

    selectedThinkingType:
      thinkingTypeFilter,

    targetMarks,

    targetPaper:
      activePaper,

    targetPaperSuitabilityTags:
      getCoursePaperSuitabilityTags(
        activePaperConfig
      ),
  };

  useEffect(() => {
    return () => {
      if (
        flashTimeoutRef.current
      ) {
        clearTimeout(
          flashTimeoutRef.current
        );
      }
    };
  }, []);

  function triggerConstraintFlash(
    constraint:
      ConstraintPillId
  ) {
    if (
      flashTimeoutRef.current
    ) {
      clearTimeout(
        flashTimeoutRef.current
      );
    }

    setFlashingConstraint(
      null
    );

    window.setTimeout(() => {
      setFlashingConstraint(
        constraint
      );

      flashTimeoutRef.current =
        setTimeout(() => {
          setFlashingConstraint(
            null
          );
        }, 3000);
    }, 0);
  }

  function collapseSkillsInCategory(
    skills:
      Skill[]
  ) {
    const categoryIds =
      new Set(
        skills.map(
          (skill) =>
            skill.id
        )
      );

    categoryIds.forEach(
      (
        skillId
      ) => {
        if (
          expandedSkillIds.includes(
            skillId
          )
        ) {
          toggleSkillRow(
            skillId
          );
        }
      }
    );
  }

  return (
    <section
      style={{
        position:
          "relative",

        border:
          `1px solid ${theme.borderStandard}`,

        borderBottom:
          attachedFooter
            ? "none"
            : `1px solid ${theme.borderStandard}`,

        borderRadius:
          attachedFooter
            ? "6px 6px 0 0"
            : 6,

        background:
          theme.bgSurface,

        minWidth:
          0,

        minHeight:
          0,

        height:
          "100%",

        display:
          "grid",

        gridTemplateRows:
          "auto 1fr",

        overflow:
          "hidden",

        boxSizing:
          "border-box",

        ...UI_TEXT.appRoot,
      }}
    >
      <style jsx global>{`
        .skills-tree-scroll {
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
        }

        .skills-tree-scroll::-webkit-scrollbar {
          width: 0 !important;
          height: 0 !important;
          display: none !important;
        }

        @keyframes constraintPulseRed {
          0% {
            outline-color: rgba(239, 68, 68, 0.95);
            box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.24);
            transform: scale(1.015);
          }

          12% {
            outline-color: rgba(239, 68, 68, 0.25);
            box-shadow: 0 0 0 1px rgba(239, 68, 68, 0.05);
            transform: scale(1);
          }

          24% {
            outline-color: rgba(239, 68, 68, 0.95);
            box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.24);
            transform: scale(1.015);
          }

          36% {
            outline-color: rgba(239, 68, 68, 0.25);
            box-shadow: 0 0 0 1px rgba(239, 68, 68, 0.05);
            transform: scale(1);
          }

          48% {
            outline-color: rgba(239, 68, 68, 0.95);
            box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.24);
            transform: scale(1.015);
          }

          70% {
            outline-color: rgba(239, 68, 68, 0.2);
            box-shadow: 0 0 0 1px rgba(239, 68, 68, 0.04);
            transform: scale(1);
          }

          100% {
            outline-color: transparent;
            box-shadow: none;
            transform: scale(1);
          }
        }
      `}</style>

      <SkillsFilters
        theme={
          theme
        }

        totalSkillsCount={
          totalSkillsCount
        }

        standardFilter={
          standardFilter
        }

        setStandardFilter={
          setStandardFilter
        }

        thinkingTypeFilter={
          thinkingTypeFilter
        }

        setThinkingTypeFilter={
          setThinkingTypeFilter
        }

        targetMarks={
          targetMarks
        }

        setTargetMarks={
          setTargetMarks
        }

        minTargetMarks={
          minTargetMarks
        }

        maxTargetMarks={
          maxTargetMarks
        }

        activePaper={
          activePaper
        }

        setActivePaper={
          setActivePaper
        }

        flashingConstraint={
          flashingConstraint
        }
      />

      <div
        className="skills-tree-scroll"
        style={{
          minWidth:
            0,

          minHeight:
            0,

          height:
            "100%",

          overflowY:
            "auto",

          overflowX:
            "hidden",

          padding:
            "10px 0 14px 14px",

          boxSizing:
            "border-box",
        }}
      >
        {Object.entries(
          skillsData
        ).map(
          ([
            category,
            skillsUnknown,
          ]) => {
            const skills =
              skillsUnknown as Skill[];

            return (
              <CategorySection
                key={
                  category
                }

                category={
                  category
                }

                skills={
                  skills
                }

                collapsed={
                  collapsedCategories[
                    category
                  ] ??
                  false
                }

                onToggleCategory={() =>
                  toggleCategory(
                    category
                  )
                }

                onCollapseCategorySkills={() =>
                  collapseSkillsInCategory(
                    skills
                  )
                }

                expandedSkillIds={
                  expandedSkillIds
                }

                onToggleSkill={
                  toggleSkillRow
                }

                standardFilter={
                  standardFilter
                }

                thinkingTypeFilter={
                  thinkingTypeFilter
                }

                targetMarks={
                  targetMarks
                }

                selectionFilters={
                  selectionFilters
                }

                getConceptIndex={
                  getConceptIndex
                }

                setConceptIndex={
                  setConceptIndex
                }

                getDifficulty={
                  getDifficulty
                }

                setDifficulty={
                  setDifficulty
                }

                onConstraintBlocked={
                  triggerConstraintFlash
                }

                onAddQuestion={(
                  categoryName,
                  skill,
                  concept,
                  difficulty
                ) =>
                  addQuestionToPaper(
                    categoryName,
                    skill,
                    concept,
                    difficulty,
                    activePaper
                  )
                }

                onRegenerateQuestion={(
                  categoryName,
                  skill,
                  concept,
                  difficulty
                ) =>
                  regenerateQuestionToPaper(
                    categoryName,
                    skill,
                    concept,
                    difficulty,
                    activePaper
                  )
                }

                theme={
                  theme
                }
              />
            );
          }
        )}
      </div>
    </section>
  );
}
