import {
  useEffect,
  useMemo,
  useState,
} from "react";

import ActionButton from "@/src/UI/Application/Components/ActionButton";

import {
  rankConceptsByTargetMarks,
} from "@/src/Courses/National5Maths/QuestionGeneration/ConceptSelection";

import type {
  DifficultyLevel,
  Skill,
  StandardFilter,
  ThinkingTypeFilter,
} from "@/shared-types/AssessmentTypes";

import type {
  QuestionSelectionFilters,
} from "@/shared-types/QuestionSelectionTypes";

import type { AppTheme } from "@/src/UI/Application/Theme/AppTheme";

import {
  UI_TEXT,
  UI_TYPO,
} from "@/src/UI/Application/Typography/Typography";

import type {
  ConstraintPillId,
} from "../01-SkillsFilters/SkillsFilters";

import ConceptSelector from "./ConceptSelector";

import DifficultyStepper from "./DifficultyStepper";

import {
  buildPrimaryBlockReason,
  conceptSelectionText,
  getAvailableConceptDifficulties,
  getConceptRestriction,
  getEligibleConceptDifficulties,
  stepDifficulty,
} from "./ConceptSelectionRules";

type SkillRowProps = {
  category: string;

  skill: Skill;

  index: number;

  isExpanded: boolean;

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

export default function SkillRow({
  category,
  skill,
  index,
  isExpanded,
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
}: SkillRowProps) {
  const [
    rowHovered,
    setRowHovered,
  ] =
    useState(false);

  const ranked =
    useMemo(
      () =>
        rankConceptsByTargetMarks(
          skill.concepts,
          targetMarks
        ),
      [
        skill.concepts,
        targetMarks,
      ]
    );

  const storedIndex =
    getConceptIndex(
      skill.id
    );

  const hasSelection =
    storedIndex >= 0 &&
    storedIndex <
      ranked.length;

  const currentIndex =
    hasSelection
      ? storedIndex
      : -1;

  const selected =
    hasSelection
      ? ranked[currentIndex]
      : undefined;

  const selectedConceptText =
    selected
      ? conceptSelectionText(
          selected
        )
      : "";

  const currentDifficulty =
    getDifficulty(
      skill.id
    );

  const availableLevels =
    useMemo<
      DifficultyLevel[]
    >(() => {
      if (!selected) {
        return [];
      }

      return getAvailableConceptDifficulties(
        skill,
        selectedConceptText
      );
    }, [
      skill,
      selected,
      selectedConceptText,
    ]);

  const eligibleLevels =
    useMemo<
      DifficultyLevel[]
    >(() => {
      if (!selected) {
        return [];
      }

      return getEligibleConceptDifficulties(
        skill,
        selectedConceptText,
        selectionFilters
      );
    }, [
      skill,
      selected,
      selectedConceptText,
      selectionFilters,
    ]);

  const selectedRestriction =
    selected
      ? getConceptRestriction({
          skill,
          concept:
            selected,

          standardFilter,
          thinkingTypeFilter,

          targetMarks,
          selectionFilters,
        })
      : null;

  const currentDifficultyIsEligible =
    eligibleLevels.includes(
      currentDifficulty
    );

  const canAdd =
    Boolean(selected) &&
    selectedRestriction ===
      null &&
    currentDifficultyIsEligible;

  const canRegenerate =
    canAdd;

  useEffect(() => {
    if (!selected) {
      return;
    }

    if (
      availableLevels.length ===
      0
    ) {
      return;
    }

    if (
      availableLevels.includes(
        currentDifficulty
      )
    ) {
      return;
    }

    setDifficulty(
      skill.id,
      availableLevels[0]
    );
  }, [
    selected,
    availableLevels,
    currentDifficulty,
    setDifficulty,
    skill.id,
  ]);

  const primaryBlockReason =
    buildPrimaryBlockReason({
      selected,
      skill,

      standardFilter,
      targetMarks,

      selectionFilters,
      thinkingTypeFilter,

      currentDifficulty,

      availableLevels,

      currentDifficultyIsEligible,
    });

  const showBlockReason =
    Boolean(selected) &&
    !canAdd;

  function flashCurrentRestriction() {
    if (!selected) {
      return;
    }

    if (
      selectedRestriction
    ) {
      onConstraintBlocked(
        selectedRestriction.constraint
      );

      return;
    }

    if (
      !currentDifficultyIsEligible
    ) {
      onConstraintBlocked(
        "targetMarks"
      );
    }
  }

  return (
    <div
      style={{
        borderTop:
          index === 0
            ? "none"
            : `1px solid ${theme.borderStandard}`,

        position:
          "relative",

        zIndex:
          isExpanded
            ? 2
            : 1,

        background:
          isExpanded
            ? theme.bgSurface
            : "transparent",

        transition:
          "background 0.15s ease",
      }}
    >
      <button
        type="button"
        onClick={() =>
          onToggleSkill(
            skill.id
          )
        }
        aria-expanded={
          isExpanded
        }
        onMouseEnter={() =>
          setRowHovered(true)
        }
        onMouseLeave={() =>
          setRowHovered(false)
        }
        style={{
          width: "100%",

          textAlign:
            "left",

          display:
            "grid",

          gridTemplateColumns:
            "64px 1fr 24px",

          gap: 10,

          padding:
            "12px 14px 12px 22px",

          background:
            isExpanded ||
            rowHovered
              ? theme.controlBgHover
              : "transparent",

          color:
            theme.textPrimary,

          border:
            "none",

          cursor:
            "pointer",

          fontFamily:
            UI_TYPO.family,

          boxSizing:
            "border-box",

          minWidth: 0,

          transition:
            "background 0.15s ease",
        }}
      >
        <span
          style={{
            color:
              theme.textMuted,

            ...UI_TEXT.controlTextStrong,

            letterSpacing:
              0.2,
          }}
        >
          {skill.code}
        </span>

        <span
          style={{
            ...UI_TEXT.controlText,

            color:
              theme.textPrimary,

            fontWeight:
              UI_TYPO.weightSemibold,

            minWidth: 0,

            overflow:
              "hidden",

            textOverflow:
              "ellipsis",

            whiteSpace:
              "nowrap",
          }}
        >
          {skill.text}
        </span>

        <span
          style={{
            color:
              isExpanded ||
              rowHovered
                ? theme.textSecondary
                : theme.textMuted,

            ...UI_TEXT.controlTextStrong,

            transition:
              "color 0.15s ease",
          }}
        >
          {isExpanded
            ? "▾"
            : "▸"}
        </span>
      </button>

      {isExpanded ? (
        <div
          style={{
            padding:
              "12px 14px 14px",

            background:
              theme.bgSurface,

            borderTop:
              `1px solid ${theme.borderStandard}`,

            display:
              "grid",

            gridTemplateColumns:
              "minmax(0, 1fr)",

            rowGap: 12,

            position:
              "relative",

            overflow:
              "visible",
          }}
        >
          <div
            style={{
              display:
                "grid",

              gridTemplateColumns:
                "minmax(0, 1fr) auto",

              columnGap:
                20,

              rowGap: 8,

              alignItems:
                "end",

              overflow:
                "visible",
            }}
          >
            <div
              style={{
                minWidth: 0,
              }}
            >
              <div
                style={{
                  display:
                    "flex",

                  alignItems:
                    "baseline",

                  gap: 8,

                  marginBottom:
                    6,

                  minWidth: 0,
                }}
              >
                <div
                  style={{
                    ...UI_TEXT.sectionLabel,

                    color:
                      theme.textSecondary,
                  }}
                >
                  Concept
                </div>

                <div
                  style={{
                    ...UI_TEXT.metadata,

                    color:
                      theme.textMuted,

                    fontWeight:
                      UI_TYPO.weightRegular,
                  }}
                >
                  visible with constraints
                </div>
              </div>

              <ConceptSelector
                skill={
                  skill
                }

                rankedConcepts={
                  ranked
                }

                currentIndex={
                  currentIndex
                }

                selected={
                  selected
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

                setConceptIndex={
                  setConceptIndex
                }

                onConstraintBlocked={
                  onConstraintBlocked
                }

                theme={
                  theme
                }
              />
            </div>

            <div
              style={{
                width:
                  "fit-content",

                justifySelf:
                  "end",

                marginLeft:
                  10,
              }}
            >
              <div
                style={{
                  ...UI_TEXT.sectionLabel,

                  color:
                    theme.textSecondary,

                  whiteSpace:
                    "nowrap",

                  marginBottom:
                    6,
                }}
              >
                Difficulty
              </div>

              <DifficultyStepper
                value={
                  currentDifficulty
                }

                availableLevels={
                  availableLevels
                }

                onDecrease={() =>
                  setDifficulty(
                    skill.id,

                    stepDifficulty(
                      availableLevels,
                      currentDifficulty,
                      "prev"
                    )
                  )
                }

                onIncrease={() =>
                  setDifficulty(
                    skill.id,

                    stepDifficulty(
                      availableLevels,
                      currentDifficulty,
                      "next"
                    )
                  )
                }

                theme={
                  theme
                }
              />
            </div>
          </div>

          {showBlockReason ? (
            <div
              style={{
                ...UI_TEXT.metadata,

                color:
                  theme.textMuted,

                marginTop:
                  -2,
              }}
            >
              {
                primaryBlockReason
              }
            </div>
          ) : null}

          <div
            style={{
              display:
                "grid",

              gridTemplateColumns:
                "1fr 1fr",

              gap: 10,

              width:
                "fit-content",

              justifySelf:
                "end",
            }}
          >
            <div
              style={{
                opacity:
                  canAdd
                    ? 1
                    : 0.62,
              }}
            >
              <ActionButton
                onClick={() => {
                  if (
                    !selected
                  ) {
                    return;
                  }

                  if (
                    !canAdd
                  ) {
                    flashCurrentRestriction();

                    return;
                  }

                  onAddQuestion(
                    category,
                    skill,
                    conceptSelectionText(
                      selected
                    ),
                    currentDifficulty
                  );
                }}
                theme={
                  theme
                }
                label="Add Question"
                title={
                  canAdd
                    ? "Add this question to the assessment"
                    : primaryBlockReason
                }
                variant="primary"
              />
            </div>

            <div
              style={{
                opacity:
                  canRegenerate
                    ? 1
                    : 0.62,
              }}
            >
              <ActionButton
                onClick={() => {
                  if (
                    !selected
                  ) {
                    return;
                  }

                  if (
                    !canRegenerate
                  ) {
                    flashCurrentRestriction();

                    return;
                  }

                  onRegenerateQuestion(
                    category,
                    skill,
                    conceptSelectionText(
                      selected
                    ),
                    currentDifficulty
                  );
                }}
                theme={
                  theme
                }
                label="Regenerate"
                title={
                  canRegenerate
                    ? "Generate another version of this question"
                    : primaryBlockReason
                }
                variant="secondary"
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}