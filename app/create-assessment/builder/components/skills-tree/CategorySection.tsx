"use client";

// app/create-assessment/builder/components/skills-tree/CategorySection.tsx
// One umbrella category (e.g. Numerical Skills) containing clickable skills.

import { useEffect, useMemo, useRef, useState } from "react";

import AddQuestionButton from "@/app/create-assessment/builder/components/skills-tree/AddQuestionButton";
import PaperContent from "@/app/create-assessment/builder/components/assessment-preview/PaperContent";
import { UI_TEXT, UI_TYPO } from "@/app/ui/UiTypography";
import type { Theme } from "@/ui/AppTheme";
import {
  getEligibleDifficultiesForConcept,
  getAvailableDifficultiesForConcept,
} from "@/app/create-assessment/builder/builder-logic/BuilderQuestionGenerators";
import {
  conceptMatchesThinkingTypeFilter,
  getFilteredConcepts,
  rankConceptsByTargetMarks,
} from "@/math-helpers/QuestionLogic";
import type { PaperPart } from "@/shared-types/PaperParts";
import type { QuestionSelectionFilters } from "@/shared-types/QuestionSelectionTypes";
import type {
  Concept,
  DifficultyLevel,
  Skill,
  SkillPaperSuitability,
  StandardFilter,
  ThinkingTypeFilter,
} from "@/shared-types/AssessmentTypes";

const CATEGORY_STRIPE_HEIGHT = 5;
const CATEGORY_HEADER_HEIGHT = 58;
const CATEGORY_ACTION_SLOT_WIDTH = 112;

type Props = {
  category: string;
  skills: Skill[];
  collapsed: boolean;
  onToggleCategory: () => void;
  onCollapseCategorySkills: () => void;

  expandedSkillIds: string[];
  onToggleSkill: (skillId: string) => void;

  standardFilter: StandardFilter;
  thinkingTypeFilter: ThinkingTypeFilter;
  targetMarks: number;
  selectionFilters: QuestionSelectionFilters;

  getConceptIndex: (skillId: string) => number;
  setConceptIndex: (skillId: string, nextIndex: number) => void;

  getDifficulty: (skillId: string) => DifficultyLevel;
  setDifficulty: (skillId: string, next: DifficultyLevel) => void;

  onAddQuestion: (
    category: string,
    skill: Skill,
    concept: string,
    difficulty: DifficultyLevel
  ) => void;
  onRegenerateQuestion: (
    category: string,
    skill: Skill,
    concept: string,
    difficulty: DifficultyLevel
  ) => void;

  theme: Theme;
};

function textPart(value: string): PaperPart {
  return { kind: "text", value };
}

function mathPart(latex: string): PaperPart {
  return { kind: "math", latex };
}

function conceptSelectionText(concept: Concept): string {
  const short = concept.shortLabel?.trim();
  if (short) return `${concept.code} ${short}`;
  return concept.label.trim();
}

function conceptInlineParts(concept: Concept): PaperPart[] {
  const short = concept.shortLabel?.trim();
  const fallbackLabel = concept.label
    .replace(new RegExp(`^${concept.code}\\s*`), "")
    .trim();
  const labelText = short || fallbackLabel || concept.label;

  const parts: PaperPart[] = [textPart(`${concept.code}\u2003${labelText}`)];

  if (concept.badge?.trim()) {
    parts.push(textPart(" · "));
    parts.push(mathPart(concept.badge.trim()));
  }

  return parts;
}

function stepDifficulty(
  availableLevels: DifficultyLevel[],
  current: DifficultyLevel,
  direction: "prev" | "next"
): DifficultyLevel {
  if (availableLevels.length === 0) return current;

  const currentIndex = availableLevels.indexOf(current);

  if (currentIndex === -1) {
    return direction === "prev"
      ? availableLevels[availableLevels.length - 1]
      : availableLevels[0];
  }

  if (direction === "prev") {
    return currentIndex === 0
      ? availableLevels[availableLevels.length - 1]
      : availableLevels[currentIndex - 1];
  }

  return currentIndex === availableLevels.length - 1
    ? availableLevels[0]
    : availableLevels[currentIndex + 1];
}

function getPaperSuitabilityForConcept(
  skill: Skill,
  concept: Concept
): SkillPaperSuitability {
  return concept.metadata?.paperSuitability ?? skill.paperSuitability;
}

function conceptMatchesPaper(
  skill: Skill,
  concept: Concept,
  targetPaper: "P1" | "P2"
): boolean {
  const suitability = getPaperSuitabilityForConcept(skill, concept);
  return suitability === "BOTH" || suitability === targetPaper;
}

function buildThinkingTypeMismatchMessage(
  filter: ThinkingTypeFilter
): string {
  if (filter === "REASONING") {
    return "No reasoning marks here — choose Any or Operational.";
  }

  if (filter === "OPERATIONAL") {
    return "Reasoning-only here — choose Any or Reasoning.";
  }

  return "This concept does not match the current thinking type.";
}

function buildPaperMismatchMessage(targetPaper: "P1" | "P2"): string {
  return targetPaper === "P1"
    ? "Paper 2 only — switch to Paper 2."
    : "Paper 1 only — switch to Paper 1.";
}

function buildDropdownMismatchTag(args: {
  skill: Skill;
  concept: Concept;
  targetPaper: "P1" | "P2";
  thinkingTypeFilter: ThinkingTypeFilter;
}): string | null {
  const { skill, concept, targetPaper, thinkingTypeFilter } = args;

  if (!conceptMatchesPaper(skill, concept, targetPaper)) {
    return targetPaper === "P1" ? "P2 only" : "P1 only";
  }

  if (!conceptMatchesThinkingTypeFilter(concept, thinkingTypeFilter)) {
    return thinkingTypeFilter === "REASONING"
      ? "Operational only"
      : "Reasoning only";
  }

  return null;
}

function buildPrimaryBlockReason(args: {
  selected: Concept | undefined;
  skill: Skill;
  targetPaper: "P1" | "P2";
  thinkingTypeFilter: ThinkingTypeFilter;
  currentDifficulty: DifficultyLevel;
  availableLevels: DifficultyLevel[];
  currentDifficultyIsEligible: boolean;
}): string {
  const {
    selected,
    skill,
    targetPaper,
    thinkingTypeFilter,
    currentDifficulty,
    availableLevels,
    currentDifficultyIsEligible,
  } = args;

  if (!selected) {
    return "Select a concept first.";
  }

  if (!conceptMatchesPaper(skill, selected, targetPaper)) {
    return buildPaperMismatchMessage(targetPaper);
  }

  if (!conceptMatchesThinkingTypeFilter(selected, thinkingTypeFilter)) {
    return buildThinkingTypeMismatchMessage(thinkingTypeFilter);
  }

  if (availableLevels.length === 0) {
    return "No selectable levels for this concept.";
  }

  if (!availableLevels.includes(currentDifficulty)) {
    return `Level ${currentDifficulty} is not available for this concept.`;
  }

  if (!currentDifficultyIsEligible) {
    return `Level ${currentDifficulty} does not match the current marks filter.`;
  }

  return "This concept is not available under the current filters.";
}

function getCategoryStripeColour(category: string, theme: Theme): string {
  const normalised = category.trim().toLowerCase();

  if (normalised.includes("numer")) return theme.categoryStripes.numerical;
  if (normalised.includes("algebra")) return theme.categoryStripes.algebraic;
  if (normalised.includes("geometr")) return theme.categoryStripes.geometric;
  if (normalised.includes("trig")) return theme.categoryStripes.trigonometric;
  if (normalised.includes("stat")) return theme.categoryStripes.statistical;

  return theme.categoryStripes.default;
}

function DifficultyStepper(props: {
  value: DifficultyLevel;
  availableLevels: DifficultyLevel[];
  eligibleLevels: DifficultyLevel[];
  onDecrease: () => void;
  onIncrease: () => void;
  theme: Theme;
}) {
  const {
    value,
    availableLevels,
    eligibleLevels,
    onDecrease,
    onIncrease,
    theme,
  } = props;

  const isEligible = eligibleLevels.includes(value);

  return (
    <div
      style={{
        display: "inline-grid",
        gridTemplateColumns: "30px 82px 30px",
        alignItems: "center",
        gap: 6,
      }}
    >
      <button
        type="button"
        onClick={onDecrease}
        disabled={availableLevels.length === 0}
        style={{
          height: 34,
          width: 30,
          borderRadius: 10,
          border: `1px solid ${theme.borderStandard}`,
          background: theme.controlBg,
          color: theme.textMuted,
          cursor: availableLevels.length === 0 ? "default" : "pointer",
          opacity: availableLevels.length === 0 ? 0.5 : 1,
          display: "grid",
          placeItems: "center",
          fontFamily: UI_TYPO.family,
          fontWeight: UI_TYPO.weightBold,
          fontSize: 18,
          lineHeight: 1,
          padding: 0,
          transition:
            "background 0.15s ease, border-color 0.15s ease, color 0.15s ease",
        }}
        title="Decrease difficulty"
        aria-label="Decrease difficulty"
      >
        −
      </button>

      <div
        style={{
          height: 34,
          borderRadius: 10,
          border: `1px solid ${theme.borderStandard}`,
          background: theme.controlBg,
          color: isEligible ? theme.textPrimary : theme.textMuted,
          opacity: isEligible ? 1 : 0.72,
          display: "grid",
          placeItems: "center",
          whiteSpace: "nowrap",
          fontFamily: UI_TYPO.family,
          fontWeight: UI_TYPO.weightSemibold,
          fontSize: UI_TYPO.sizeSm,
          lineHeight: 1,
        }}
        title={
          isEligible
            ? `Level ${value} is within the current filters`
            : `Level ${value} is outside the current filters`
        }
      >
        Level {value}
      </div>

      <button
        type="button"
        onClick={onIncrease}
        disabled={availableLevels.length === 0}
        style={{
          height: 34,
          width: 30,
          borderRadius: 10,
          border: `1px solid ${theme.borderStandard}`,
          background: theme.controlBg,
          color: theme.textMuted,
          cursor: availableLevels.length === 0 ? "default" : "pointer",
          opacity: availableLevels.length === 0 ? 0.5 : 1,
          display: "grid",
          placeItems: "center",
          fontFamily: UI_TYPO.family,
          fontWeight: UI_TYPO.weightBold,
          fontSize: 18,
          lineHeight: 1,
          padding: 0,
          transition:
            "background 0.15s ease, border-color 0.15s ease, color 0.15s ease",
        }}
        title="Increase difficulty"
        aria-label="Increase difficulty"
      >
        +
      </button>
    </div>
  );
}

function SkillRow(props: {
  category: string;
  skill: Skill;
  index: number;
  isExpanded: boolean;
  onToggleSkill: (skillId: string) => void;
  standardFilter: StandardFilter;
  thinkingTypeFilter: ThinkingTypeFilter;
  targetMarks: number;
  selectionFilters: QuestionSelectionFilters;
  getConceptIndex: (skillId: string) => number;
  setConceptIndex: (skillId: string, nextIndex: number) => void;
  getDifficulty: (skillId: string) => DifficultyLevel;
  setDifficulty: (skillId: string, next: DifficultyLevel) => void;
  onAddQuestion: (
    category: string,
    skill: Skill,
    concept: string,
    difficulty: DifficultyLevel
  ) => void;
  onRegenerateQuestion: (
    category: string,
    skill: Skill,
    concept: string,
    difficulty: DifficultyLevel
  ) => void;
  theme: Theme;
}) {
  const {
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
    onAddQuestion,
    onRegenerateQuestion,
    theme,
  } = props;

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [rowHovered, setRowHovered] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const filtered = useMemo(
    () => getFilteredConcepts(skill, standardFilter),
    [skill, standardFilter]
  );
  const ranked = useMemo(
    () => rankConceptsByTargetMarks(filtered, targetMarks),
    [filtered, targetMarks]
  );

  const storedIndex = getConceptIndex(skill.id);
  const hasSelection = storedIndex >= 0 && storedIndex < ranked.length;
  const currentIndex = hasSelection ? storedIndex : -1;
  const selected = hasSelection ? ranked[currentIndex] : undefined;
  const selectedConceptText = selected ? conceptSelectionText(selected) : "";

  const currentDifficulty = getDifficulty(skill.id);

  const availableLevels = useMemo<DifficultyLevel[]>(() => {
    if (!selected) return [];
    return getAvailableDifficultiesForConcept(skill, selectedConceptText);
  }, [skill, selected, selectedConceptText]);

  const eligibleLevels = useMemo<DifficultyLevel[]>(() => {
    if (!selected) return [];
    return getEligibleDifficultiesForConcept(
      skill,
      selectedConceptText,
      selectionFilters
    );
  }, [skill, selected, selectedConceptText, selectionFilters]);

  const currentDifficultyIsEligible = eligibleLevels.includes(currentDifficulty);
  const selectedConceptMatchesThinkingType =
    !!selected &&
    conceptMatchesThinkingTypeFilter(selected, thinkingTypeFilter);
  const selectedConceptMatchesPaper =
    !!selected &&
    conceptMatchesPaper(skill, selected, selectionFilters.targetPaper);

  useEffect(() => {
    if (!dropdownOpen) return;

    function handleMouseDown(event: MouseEvent) {
      if (!dropdownRef.current) return;
      if (dropdownRef.current.contains(event.target as Node)) return;
      setDropdownOpen(false);
    }

    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [dropdownOpen]);

  useEffect(() => {
    if (!isExpanded) {
      setDropdownOpen(false);
    }
  }, [isExpanded]);

  useEffect(() => {
    if (!selected) return;
    if (availableLevels.length === 0) return;
    if (availableLevels.includes(currentDifficulty)) return;

    setDifficulty(skill.id, availableLevels[0]);
  }, [selected, availableLevels, currentDifficulty, setDifficulty, skill.id]);

  const canAdd =
    !!selected &&
    selectedConceptMatchesPaper &&
    selectedConceptMatchesThinkingType &&
    currentDifficultyIsEligible;

  const canRegenerate =
    !!selected &&
    selectedConceptMatchesPaper &&
    selectedConceptMatchesThinkingType &&
    currentDifficultyIsEligible;

  const difficultyRangeText =
    selected && availableLevels.length > 0
      ? `${availableLevels[0]}–${availableLevels[availableLevels.length - 1]}`
      : null;

  const primaryBlockReason = buildPrimaryBlockReason({
    selected,
    skill,
    targetPaper: selectionFilters.targetPaper,
    thinkingTypeFilter,
    currentDifficulty,
    availableLevels,
    currentDifficultyIsEligible,
  });

  const showBlockReason = !!selected && !canAdd;

  return (
    <div
      style={{
        borderTop:
          index === 0 ? "none" : `1px solid ${theme.borderStandard}`,
        position: "relative",
        zIndex: dropdownOpen ? 50 : 1,
        background: isExpanded ? theme.bgSurface : "transparent",
        transition: "background 0.15s ease",
      }}
    >
      <button
        type="button"
        onClick={() => onToggleSkill(skill.id)}
        aria-expanded={isExpanded}
        onMouseEnter={() => setRowHovered(true)}
        onMouseLeave={() => setRowHovered(false)}
        style={{
          width: "100%",
          textAlign: "left",
          display: "grid",
          gridTemplateColumns: "64px 1fr 24px",
          gap: 10,
          padding: "12px 14px 12px 22px",
          background:
            isExpanded || rowHovered ? theme.controlBgHover : "transparent",
          color: theme.textPrimary,
          border: "none",
          cursor: "pointer",
          fontFamily: UI_TYPO.family,
          boxSizing: "border-box",
          minWidth: 0,
          transition: "background 0.15s ease",
        }}
      >
        <span
          style={{
            color: theme.textMuted,
            ...UI_TEXT.controlTextStrong,
            letterSpacing: 0.2,
          }}
        >
          {skill.code}
        </span>

        <span
          style={{
            ...UI_TEXT.controlText,
            color: theme.textPrimary,
            fontWeight: UI_TYPO.weightSemibold,
            minWidth: 0,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {skill.text}
        </span>

        <span
          style={{
            color:
              isExpanded || rowHovered ? theme.textSecondary : theme.textMuted,
            ...UI_TEXT.controlTextStrong,
            transition: "color 0.15s ease",
          }}
        >
          {isExpanded ? "▾" : "▸"}
        </span>
      </button>

      {isExpanded && (
        <div
          style={{
            padding: "12px 14px 14px",
            background: theme.bgSurface,
            borderTop: `1px solid ${theme.borderStandard}`,
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr)",
            rowGap: 12,
            position: "relative",
            overflow: "visible",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr) auto",
              columnGap: 20,
              rowGap: 8,
              alignItems: "end",
              overflow: "visible",
            }}
          >
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 8,
                  marginBottom: 6,
                  minWidth: 0,
                }}
              >
                <div
                  style={{
                    ...UI_TEXT.sectionLabel,
                    color: theme.textSecondary,
                  }}
                >
                  Concept
                </div>

                <div
                  style={{
                    ...UI_TEXT.metadata,
                    color: theme.textMuted,
                    fontWeight: UI_TYPO.weightRegular,
                  }}
                >
                  filtered: {standardFilter}
                </div>
              </div>

              <div
                ref={dropdownRef}
                style={{
                  position: "relative",
                  minWidth: 0,
                  overflow: "visible",
                }}
              >
                <button
                  type="button"
                  onClick={() =>
                    ranked.length > 0 && setDropdownOpen((prev) => !prev)
                  }
                  disabled={ranked.length === 0}
                  style={{
                    width: "100%",
                    height: 36,
                    borderRadius: 10,
                    border: `1px solid ${theme.borderStandard}`,
                    background: theme.controlBg,
                    color: theme.textPrimary,
                    boxSizing: "border-box",
                    padding: "0 34px 0 10px",
                    display: "flex",
                    alignItems: "center",
                    minWidth: 0,
                    overflow: "hidden",
                    cursor: ranked.length === 0 ? "default" : "pointer",
                    opacity: ranked.length === 0 ? 0.62 : 1,
                    position: "relative",
                    transition:
                      "background 0.15s ease, border-color 0.15s ease, color 0.15s ease, box-shadow 0.15s ease",
                    boxShadow: dropdownOpen ? theme.shadow : "none",
                  }}
                  title={
                    selected ? conceptSelectionText(selected) : "Select skill concept"
                  }
                >
                  <span
                    style={{
                      minWidth: 0,
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                      fontSize: UI_TYPO.sizeSm,
                      lineHeight: 1,
                      fontWeight: UI_TYPO.weightSemibold,
                    }}
                  >
                    {selected ? (
                      <PaperContent parts={conceptInlineParts(selected)} />
                    ) : (
                      <span style={{ color: theme.textMuted }}>
                        Select skill concept
                      </span>
                    )}
                  </span>

                  <span
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      right: 10,
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: theme.textMuted,
                      fontSize: 12,
                      lineHeight: 1,
                      pointerEvents: "none",
                    }}
                  >
                    ▾
                  </span>
                </button>

                {dropdownOpen ? (
                  <div
                    className="hover-scroll"
                    style={{
                      position: "absolute",
                      top: "calc(100% + 6px)",
                      left: 0,
                      right: 0,
                      zIndex: 60,
                      width: "100%",
                      maxWidth: "100%",
                      maxHeight: 240,
                      overflowY: "auto",
                      borderRadius: 12,
                      border: `1px solid ${theme.borderStandard}`,
                      background: theme.bgElevated,
                      boxShadow: theme.shadowStrong,
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setConceptIndex(skill.id, -1);
                        setDropdownOpen(false);
                      }}
                      style={{
                        width: "100%",
                        border: "none",
                        borderBottom: ranked.length
                          ? `1px solid ${theme.borderStandard}`
                          : "none",
                        background:
                          currentIndex === -1 ? theme.controlBgHover : "transparent",
                        color: theme.textMuted,
                        textAlign: "left",
                        padding: "10px 12px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        minWidth: 0,
                        fontSize: UI_TYPO.sizeSm,
                        fontWeight: UI_TYPO.weightSemibold,
                        lineHeight: 1,
                      }}
                      title="Clear selected concept"
                    >
                      Select skill concept
                    </button>

                    {ranked.map((concept, conceptIdx) => {
                      const active = conceptIdx === currentIndex;
                      const mismatchTag = buildDropdownMismatchTag({
                        skill,
                        concept,
                        targetPaper: selectionFilters.targetPaper,
                        thinkingTypeFilter,
                      });
                      const isDropdownEligible = mismatchTag === null;

                      return (
                        <button
                          key={concept.id}
                          type="button"
                          onClick={() => {
                            setConceptIndex(skill.id, conceptIdx);
                            setDropdownOpen(false);
                          }}
                          style={{
                            width: "100%",
                            border: "none",
                            borderBottom:
                              conceptIdx === ranked.length - 1
                                ? "none"
                                : `1px solid ${theme.borderStandard}`,
                            background: active
                              ? theme.controlBgHover
                              : "transparent",
                            color: isDropdownEligible
                              ? theme.textPrimary
                              : theme.textMuted,
                            opacity: isDropdownEligible ? 1 : 0.7,
                            textAlign: "left",
                            padding: "10px 12px",
                            cursor: "pointer",
                            display: "grid",
                            gridTemplateColumns: "minmax(0, 1fr) auto",
                            alignItems: "center",
                            columnGap: 10,
                            minWidth: 0,
                          }}
                          title={
                            mismatchTag
                              ? `${conceptSelectionText(concept)} — ${mismatchTag}`
                              : conceptSelectionText(concept)
                          }
                        >
                          <span
                            style={{
                              minWidth: 0,
                              overflow: "hidden",
                              whiteSpace: "nowrap",
                              textOverflow: "ellipsis",
                              fontSize: UI_TYPO.sizeSm,
                              lineHeight: 1,
                            }}
                          >
                            <PaperContent parts={conceptInlineParts(concept)} />
                          </span>

                          {mismatchTag ? (
                            <span
                              style={{
                                fontSize: UI_TYPO.sizeXs,
                                lineHeight: 1,
                                color: theme.textSecondary,
                                whiteSpace: "nowrap",
                                border: `1px solid ${theme.borderStandard}`,
                                borderRadius: 999,
                                padding: "4px 8px",
                                background: theme.controlBg,
                              }}
                            >
                              {mismatchTag}
                            </span>
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            </div>

            <div
              style={{
                width: "fit-content",
                justifySelf: "end",
                marginLeft: 10,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  justifyContent: "space-between",
                  gap: 12,
                  marginBottom: 6,
                }}
              >
                <div
                  style={{
                    ...UI_TEXT.sectionLabel,
                    color: theme.textSecondary,
                    whiteSpace: "nowrap",
                  }}
                >
                  Difficulty
                </div>

                {difficultyRangeText ? (
                  <div
                    style={{
                      ...UI_TEXT.metadata,
                      color: theme.textMuted,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {difficultyRangeText}
                  </div>
                ) : null}
              </div>

              <DifficultyStepper
                value={currentDifficulty}
                availableLevels={availableLevels}
                eligibleLevels={eligibleLevels}
                onDecrease={() =>
                  setDifficulty(
                    skill.id,
                    stepDifficulty(availableLevels, currentDifficulty, "prev")
                  )
                }
                onIncrease={() =>
                  setDifficulty(
                    skill.id,
                    stepDifficulty(availableLevels, currentDifficulty, "next")
                  )
                }
                theme={theme}
              />
            </div>
          </div>

          {showBlockReason ? (
            <div
              style={{
                ...UI_TEXT.metadata,
                color: theme.textMuted,
                marginTop: -2,
              }}
            >
              {primaryBlockReason}
            </div>
          ) : null}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
              width: "fit-content",
              justifySelf: "end",
            }}
          >
            <div
              style={{
                opacity: canAdd ? 1 : 0.62,
                pointerEvents: canAdd ? "auto" : "none",
              }}
            >
              <AddQuestionButton
                onClick={() => {
                  if (!selected || !canAdd) return;
                  onAddQuestion(
                    category,
                    skill,
                    conceptSelectionText(selected),
                    currentDifficulty
                  );
                }}
                theme={theme}
                label="Add Question"
                title={
                  canAdd ? "Add this question to the assessment" : primaryBlockReason
                }
                variant="primary"
              />
            </div>

            <div
              style={{
                opacity: canRegenerate ? 1 : 0.62,
                pointerEvents: canRegenerate ? "auto" : "none",
              }}
            >
              <AddQuestionButton
                onClick={() => {
                  if (!selected || !canRegenerate) return;
                  onRegenerateQuestion(
                    category,
                    skill,
                    conceptSelectionText(selected),
                    currentDifficulty
                  );
                }}
                theme={theme}
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
      )}
    </div>
  );
}

export default function CategorySection(props: Props) {
  const {
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
    onAddQuestion,
    onRegenerateQuestion,
    theme,
  } = props;

  const stripeColour = getCategoryStripeColour(category, theme);
  const [categoryHovered, setCategoryHovered] = useState(false);

  function handleToggleCategory() {
    if (!collapsed) {
      skills.forEach((skill) => {
        setConceptIndex(skill.id, -1);
      });
    }
    onToggleCategory();
  }

  return (
    <div
      style={{
        marginBottom: 16,
        position: "relative",
        zIndex: 1,
        minWidth: 0,
        maxWidth: "100%",
        marginLeft: -14,
        marginRight: -14,
      }}
    >
      <div
        style={{
          width: "auto",
          boxSizing: "border-box",
          background: categoryHovered ? theme.controlBgHover : theme.bgElevated,
          color: theme.textPrimary,
          borderTop: `1px solid ${theme.borderStandard}`,
          borderBottom: `1px solid ${theme.borderStandard}`,
          borderLeft: "none",
          borderRight: "none",
          overflow: "hidden",
          boxShadow: categoryHovered
            ? "0 10px 22px rgba(15,23,42,0.10)"
            : "0 0 0 rgba(0,0,0,0)",
          transform: categoryHovered ? "scale(1.004)" : "scale(1)",
          transformOrigin: "center center",
          transition:
            "background 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            height: CATEGORY_STRIPE_HEIGHT,
            width: "100%",
            background: stripeColour,
            transition: "filter 0.18s ease",
            filter: categoryHovered ? "brightness(1.08)" : "brightness(1)",
          }}
        />

        <div
          onClick={handleToggleCategory}
          role="button"
          aria-expanded={!collapsed}
          tabIndex={0}
          onMouseEnter={() => setCategoryHovered(true)}
          onMouseLeave={() => setCategoryHovered(false)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleToggleCategory();
            }
          }}
          style={{
            display: "grid",
            gridTemplateColumns: `1fr ${CATEGORY_ACTION_SLOT_WIDTH}px`,
            gap: 14,
            alignItems: "center",
            height: CATEGORY_HEADER_HEIGHT,
            minHeight: CATEGORY_HEADER_HEIGHT,
            maxHeight: CATEGORY_HEADER_HEIGHT,
            padding: "0 14px",
            cursor: "pointer",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              minWidth: 0,
              fontFamily: UI_TYPO.family,
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: 18,
                color: categoryHovered ? theme.textSecondary : theme.textMuted,
                flex: "0 0 auto",
                ...UI_TEXT.controlTextStrong,
                transition: "color 0.18s ease",
              }}
            >
              {collapsed ? "▶" : "▼"}
            </span>

            <span
              style={{
                ...UI_TEXT.controlTextStrong,
                color: theme.textPrimary,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                minWidth: 0,
                letterSpacing: 0.2,
                fontWeight: UI_TYPO.weightSemibold,
              }}
            >
              {category}
            </span>
          </div>

          <div
            style={{
              width: CATEGORY_ACTION_SLOT_WIDTH,
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (!collapsed) {
                  onCollapseCategorySkills();
                }
              }}
              style={{
                padding: "0 12px",
                borderRadius: 999,
                border: `1px solid ${theme.borderStandard}`,
                background: categoryHovered ? theme.controlBgHover : theme.controlBg,
                color: categoryHovered ? theme.textSecondary : theme.textMuted,
                cursor: collapsed ? "default" : "pointer",
                height: 30,
                whiteSpace: "nowrap",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                opacity: collapsed ? 0 : 1,
                pointerEvents: collapsed ? "none" : "auto",
                ...UI_TEXT.buttonTextSmall,
                boxShadow: categoryHovered
                  ? "0 4px 12px rgba(15,23,42,0.08)"
                  : "none",
                transition:
                  "background 0.15s ease, border-color 0.15s ease, color 0.15s ease, opacity 0.15s ease, box-shadow 0.18s ease",
              }}
              title={`Collapse expanded skills in ${category}`}
              aria-hidden={collapsed}
              tabIndex={collapsed ? -1 : 0}
            >
              Collapse
            </button>
          </div>
        </div>
      </div>

      {!collapsed && (
        <div
          style={{
            borderBottom: `1px solid ${theme.borderStandard}`,
            background: theme.bgSurface,
            position: "relative",
            zIndex: 1,
          }}
        >
          {skills.map((skill, idx) => (
            <SkillRow
              key={skill.id}
              category={category}
              skill={skill}
              index={idx}
              isExpanded={expandedSkillIds.includes(skill.id)}
              onToggleSkill={onToggleSkill}
              standardFilter={standardFilter}
              thinkingTypeFilter={thinkingTypeFilter}
              targetMarks={targetMarks}
              selectionFilters={selectionFilters}
              getConceptIndex={getConceptIndex}
              setConceptIndex={setConceptIndex}
              getDifficulty={getDifficulty}
              setDifficulty={setDifficulty}
              onAddQuestion={onAddQuestion}
              onRegenerateQuestion={onRegenerateQuestion}
              theme={theme}
            />
          ))}
        </div>
      )}
    </div>
  );
}