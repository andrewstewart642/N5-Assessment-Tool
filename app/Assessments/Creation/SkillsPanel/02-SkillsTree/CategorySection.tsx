import {
  useState,
} from "react";

import type {
  DifficultyLevel,
  Skill,
  StandardFilter,
  ThinkingTypeFilter,
} from "@/app/Assessments/AssessmentTypes";

import type {
  QuestionSelectionFilters,
} from "@/app/Assessments/Questions/Selection/QuestionSelectionTypes";

import type { AppTheme } from "@/app/UI/Application/Theme/AppTheme";

import {
  UI_TEXT,
  UI_TYPO,
} from "@/app/UI/Application/Typography/Typography";

import type {
  ConstraintPillId,
} from "../01-SkillsFilters/SkillsFilters";

import SkillRow from "./SkillRow";

const CATEGORY_STRIPE_HEIGHT =
  3;

const CATEGORY_HEADER_HEIGHT =
  38;

type CategorySectionProps = {
  category:
    string;

  skills:
    Skill[];

  collapsed:
    boolean;

  onToggleCategory:
    () => void;

  onCollapseCategorySkills:
    () => void;

  expandedSkillIds:
    string[];

  onToggleSkill: (
    skillId: string
  ) => void;

  standardFilter:
    StandardFilter;

  thinkingTypeFilter:
    ThinkingTypeFilter;

  targetMarks:
    number;

  selectionFilters:
    QuestionSelectionFilters;

  getConceptIndex: (
    skillId: string
  ) => number;

  setConceptIndex: (
    skillId: string,
    nextIndex: number
  ) => void;

  getDifficulty: (
    skillId: string
  ) => DifficultyLevel;

  setDifficulty: (
    skillId: string,
    next:
      DifficultyLevel
  ) => void;

  onConstraintBlocked: (
    constraint:
      ConstraintPillId
  ) => void;

  onAddQuestion: (
    category: string,
    skill: Skill,
    concept: string,
    difficulty:
      DifficultyLevel
  ) => void;

  onRegenerateQuestion: (
    category: string,
    skill: Skill,
    concept: string,
    difficulty:
      DifficultyLevel
  ) => void;

  theme:
    AppTheme;
};

function getCategoryStripeColour(
  category: string,
  theme: AppTheme
): string {
  const normalised =
    category
      .trim()
      .toLowerCase();

  if (
    normalised.includes(
      "numer"
    )
  ) {
    return theme.categoryStripes
      .numerical;
  }

  if (
    normalised.includes(
      "algebra"
    )
  ) {
    return theme.categoryStripes
      .algebraic;
  }

  if (
    normalised.includes(
      "geometr"
    )
  ) {
    return theme.categoryStripes
      .geometric;
  }

  if (
    normalised.includes(
      "trig"
    )
  ) {
    return theme.categoryStripes
      .trigonometric;
  }

  if (
    normalised.includes(
      "stat"
    )
  ) {
    return theme.categoryStripes
      .statistical;
  }

  return theme.categoryStripes
    .default;
}

export default function CategorySection({
  category,
  skills,
  collapsed,
  onToggleCategory,
  expandedSkillIds,
  onToggleSkill,
  standardFilter,
  thinkingTypeFilter,
  targetMarks,
  selectionFilters,
  getConceptIndex,
  setConceptIndex,
  getDifficulty,
  setDifficulty,
  onConstraintBlocked,
  onAddQuestion,
  onRegenerateQuestion,
  theme,
}: CategorySectionProps) {
  const stripeColour =
    getCategoryStripeColour(
      category,
      theme
    );

  const [
    categoryHovered,
    setCategoryHovered,
  ] =
    useState(false);

  function handleToggleCategory() {
    if (!collapsed) {
      skills.forEach(
        (skill) => {
          setConceptIndex(
            skill.id,
            -1
          );
        }
      );
    }

    onToggleCategory();
  }

  return (
    <div
      style={{
        marginBottom: 8,

        position:
          "relative",

        zIndex: 1,

        minWidth: 0,

        maxWidth:
          "100%",

        marginLeft:
          -14,

        marginRight:
          -14,
      }}
    >
      <div
        style={{
          width:
            "auto",

          boxSizing:
            "border-box",

          background:
            categoryHovered
              ? theme.controlBgHover
              : theme.bgSection,

          color:
            theme.textPrimary,

          borderTop:
            `1px solid ${theme.borderStandard}`,

          borderBottom:
            `1px solid ${theme.borderStandard}`,

          borderLeft:
            "none",

          borderRight:
            "none",

          overflow:
            "hidden",

          boxShadow:
            "none",

          transform:
            "none",

          transition:
            "background 0.14s ease",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            height:
              CATEGORY_STRIPE_HEIGHT,

            width:
              "100%",

            background:
              stripeColour,

            transition:
              "filter 0.18s ease",

            filter:
              categoryHovered
                ? "brightness(1.08)"
                : "brightness(1)",
          }}
        />

        <div
          onClick={
            handleToggleCategory
          }
          role="button"
          aria-expanded={
            !collapsed
          }
          tabIndex={0}
          onMouseEnter={() =>
            setCategoryHovered(
              true
            )
          }
          onMouseLeave={() =>
            setCategoryHovered(
              false
            )
          }
          onKeyDown={(
            event
          ) => {
            if (
              event.key ===
                "Enter" ||
              event.key === " "
            ) {
              event.preventDefault();

              handleToggleCategory();
            }
          }}
          style={{
            display:
              "grid",

            gridTemplateColumns:
              "1fr",

            gap: 8,

            alignItems:
              "center",

            height:
              CATEGORY_HEADER_HEIGHT,

            minHeight:
              CATEGORY_HEADER_HEIGHT,

            maxHeight:
              CATEGORY_HEADER_HEIGHT,

            padding:
              "0 10px",

            cursor:
              "pointer",

            boxSizing:
              "border-box",
          }}
        >
          <div
            style={{
              display:
                "flex",

              alignItems:
                "center",

              minWidth: 0,

              fontFamily:
                UI_TYPO.family,
            }}
          >
            <span
                style={{
                  width: 14,
                  height: 14,

                  display: "grid",
                  placeItems: "center",

                  color:
                    categoryHovered
                      ? theme.textSecondary
                      : theme.textMuted,

                  flex: "0 0 auto",

                  transition:
                    "color 0.18s ease",
                }}
              >
                <svg
                  width="7"
                  height="7"
                  viewBox="0 0 8 8"
                  aria-hidden="true"
                  style={{
                    display: "block",
                  }}
                >
                  <path
                    d={
                      collapsed
                        ? "M2 1 L5 4 L2 7"
                        : "M1 2 L4 5 L7 2"
                    }
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>

            <span
              style={{
                ...UI_TEXT.controlTextStrong,
                
                fontSize:
                  UI_TYPO.sizeMeta,

                color:
                  theme.textPrimary,

                whiteSpace:
                  "nowrap",

                overflow:
                  "hidden",

                textOverflow:
                  "ellipsis",

                minWidth: 0,

                letterSpacing:
                  0.2,

                fontWeight:
                  UI_TYPO.weightSemibold,
              }}
            >
              {category}
            </span>
          </div>

          
        </div>
      </div>

      {!collapsed ? (
        <div
          style={{
            borderBottom:
              `1px solid ${theme.borderStandard}`,

            background:
              theme.bgSurface,

            position:
              "relative",

            zIndex: 1,
          }}
        >
          {skills.map(
            (
              skill,
              index
            ) => (
              <SkillRow
                key={
                  skill.id
                }

                category={
                  category
                }

                skill={
                  skill
                }

                index={
                  index
                }

                isExpanded={
                  expandedSkillIds.includes(
                    skill.id
                  )
                }

                onToggleSkill={
                  onToggleSkill
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
                  onConstraintBlocked
                }

                onAddQuestion={
                  onAddQuestion
                }

                onRegenerateQuestion={
                  onRegenerateQuestion
                }

                theme={
                  theme
                }
              />
            )
          )}
        </div>
      ) : null}
    </div>
  );
}