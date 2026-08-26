import {
  useState,
} from "react";

import type {
  DifficultyLevel,
  Skill,
  StandardFilter,
  ThinkingTypeFilter,
} from "@/src/Assessments/AssessmentTypes";

import type {
  QuestionSelectionFilters,
} from "@/src/Assessments/Questions/Selection/QuestionSelectionTypes";

import type { AppTheme } from "@/src/UI/Application/Theme/AppTheme";

import {
  UI_TEXT,
  UI_TYPO,
} from "@/src/UI/Application/Typography/Typography";

import type {
  ConstraintPillId,
} from "../01-SkillsFilters/SkillsFilters";

import SkillRow from "./SkillRow";

const CATEGORY_STRIPE_HEIGHT =
  5;

const CATEGORY_HEADER_HEIGHT =
  58;

const CATEGORY_ACTION_SLOT_WIDTH =
  112;

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
  onCollapseCategorySkills,
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
        marginBottom: 16,

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
              : theme.bgElevated,

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
            categoryHovered
              ? "0 10px 22px rgba(15,23,42,0.10)"
              : "0 0 0 rgba(0,0,0,0)",

          transform:
            categoryHovered
              ? "scale(1.004)"
              : "scale(1)",

          transformOrigin:
            "center center",

          transition:
            "background 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease",
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
              `1fr ${CATEGORY_ACTION_SLOT_WIDTH}px`,

            gap: 14,

            alignItems:
              "center",

            height:
              CATEGORY_HEADER_HEIGHT,

            minHeight:
              CATEGORY_HEADER_HEIGHT,

            maxHeight:
              CATEGORY_HEADER_HEIGHT,

            padding:
              "0 14px",

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
                display:
                  "inline-block",

                width: 18,

                color:
                  categoryHovered
                    ? theme.textSecondary
                    : theme.textMuted,

                flex:
                  "0 0 auto",

                ...UI_TEXT.controlTextStrong,

                transition:
                  "color 0.18s ease",
              }}
            >
              {collapsed
                ? "▶"
                : "▼"}
            </span>

            <span
              style={{
                ...UI_TEXT.controlTextStrong,

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

          <div
            style={{
              width:
                CATEGORY_ACTION_SLOT_WIDTH,

              display:
                "flex",

              justifyContent:
                "flex-end",

              alignItems:
                "center",
            }}
          >
            <button
              type="button"
              onClick={(
                event
              ) => {
                event.stopPropagation();

                if (
                  !collapsed
                ) {
                  onCollapseCategorySkills();
                }
              }}
              style={{
                padding:
                  "0 12px",

                borderRadius:
                  999,

                border:
                  `1px solid ${theme.borderStandard}`,

                background:
                  categoryHovered
                    ? theme.controlBgHover
                    : theme.controlBg,

                color:
                  categoryHovered
                    ? theme.textSecondary
                    : theme.textMuted,

                cursor:
                  collapsed
                    ? "default"
                    : "pointer",

                height: 30,

                whiteSpace:
                  "nowrap",

                display:
                  "inline-flex",

                alignItems:
                  "center",

                justifyContent:
                  "center",

                textAlign:
                  "center",

                opacity:
                  collapsed
                    ? 0
                    : 1,

                pointerEvents:
                  collapsed
                    ? "none"
                    : "auto",

                ...UI_TEXT.buttonTextSmall,

                boxShadow:
                  categoryHovered
                    ? "0 4px 12px rgba(15,23,42,0.08)"
                    : "none",

                transition:
                  "background 0.15s ease, border-color 0.15s ease, color 0.15s ease, opacity 0.15s ease, box-shadow 0.18s ease",
              }}
              title={`Collapse expanded skills in ${category}`}
              aria-hidden={
                collapsed
              }
              tabIndex={
                collapsed
                  ? -1
                  : 0
              }
            >
              Collapse
            </button>
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