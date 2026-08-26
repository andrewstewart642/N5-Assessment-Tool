import {
  useEffect,
  useMemo,
  useState,
} from "react";

import ActionButton from "@/app/UI/Application/Components/ActionButton";

import {
  rankConceptsByTargetMarks,
} from "@/app/Courses/National5Maths/QuestionAndAnswerGeneration/QuestionWriting/ConceptSelection";

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

const EDITOR_COLUMN_GAP =
  8;

const ACTION_WIDTH =
  140;

const ACTION_HEIGHT =
  30;

const ACTION_RADIUS =
  5;

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
          width:
            "100%",

          textAlign:
            "left",

          display:
            "grid",

          gridTemplateColumns:
            "36px 1fr 16px",

          gap:
            8,

          padding:
            "8px 10px 8px 24px",

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

          minWidth:
            0,

          transition:
            "background 0.15s ease",
        }}
      >
        <span
          style={{
            color:
              theme.textMuted,

            ...UI_TEXT.controlTextStrong,

            fontSize:
              UI_TYPO.sizeMeta,

            fontWeight:
              UI_TYPO.weightMedium,

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

            fontSize:
              UI_TYPO.sizeMeta,

            fontWeight:
              UI_TYPO.weightRegular,

            minWidth:
              0,

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
            width:
              16,

            height:
              16,

            display:
              "grid",

            placeItems:
              "center",

            color:
              isExpanded ||
              rowHovered
                ? theme.textSecondary
                : theme.textMuted,

            transition:
              "color 0.15s ease",
          }}
        >
          <svg
            width="7"
            height="7"
            viewBox="0 0 8 8"
            aria-hidden="true"
            style={{
              display:
                "block",
            }}
          >
            <path
              d={
                isExpanded
                  ? "M1 2 L4 5 L7 2"
                  : "M2 1 L5 4 L2 7"
              }
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>

      {isExpanded ? (
        <div
          style={{
            padding:
              "9px 10px 10px",

            background:
              theme.bgSurface,

            borderTop:
              `1px solid ${theme.borderStandard}`,

            display:
              "grid",

            gridTemplateColumns:
              "minmax(0, 1fr)",

            rowGap:
              EDITOR_COLUMN_GAP,

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
                `minmax(0, 1fr) ${ACTION_WIDTH}px`,

              columnGap:
                EDITOR_COLUMN_GAP,

              rowGap:
                6,

              alignItems:
                "end",

              overflow:
                "visible",
            }}
          >
            <div
              style={{
                minWidth:
                  0,
              }}
            >
              <div
                style={{
                  display:
                    "flex",

                  alignItems:
                    "baseline",

                  gap:
                    8,

                  marginBottom:
                    4,

                  minWidth:
                    0,
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
                  ACTION_WIDTH,

                justifySelf:
                  "stretch",

                marginLeft:
                  0,
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
                    4,
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
                `minmax(0, 1fr) ${ACTION_WIDTH}px`,

              columnGap:
                EDITOR_COLUMN_GAP,

              width:
                "100%",

              alignItems:
                "center",
            }}
          >
            <div
              style={{
                opacity:
                  canAdd
                    ? 1
                    : 0.62,

                justifySelf:
                  "end",
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
                width={
                  ACTION_WIDTH
                }
                minWidth={
                  ACTION_WIDTH
                }
                height={
                  ACTION_HEIGHT
                }
                borderRadius={
                  ACTION_RADIUS
                }
                padding="0 10px"
                boxSizing="border-box"
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
                width={
                  ACTION_WIDTH
                }
                minWidth={
                  ACTION_WIDTH
                }
                height={
                  ACTION_HEIGHT
                }
                borderRadius={
                  ACTION_RADIUS
                }
                padding="0 10px"
                boxSizing="border-box"
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}