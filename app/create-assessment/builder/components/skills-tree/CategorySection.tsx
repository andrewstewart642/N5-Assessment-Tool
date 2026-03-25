"use client";

// app/create-assessment/builder/components/skills-tree/CategorySection.tsx
// One umbrella category (e.g. Numerical Skills) containing clickable skills.

import { useEffect, useMemo, useRef, useState } from "react";

import AddQuestionButton from "@/app/create-assessment/builder/components/skills-tree/AddQuestionButton";
import PaperContent from "@/app/create-assessment/builder/components/assessment-preview/PaperContent";
import { UI_TEXT, UI_TYPO } from "@/app/ui/UiTypography";
import type { AppTheme } from "@/ui/AppTheme";
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

  theme: AppTheme;
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

function DifficultyStepper(props: {
  value: DifficultyLevel;
  availableLevels: DifficultyLevel[];
  eligibleLevels: DifficultyLevel[];
  onDecrease: () => void;
  onIncrease: () => void;
  theme: AppTheme;
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
          border: `1px solid ${theme.border}`,
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
          border: `1px solid ${isEligible ? theme.border : theme.borderSoft}`,
          background: theme.controlBg,
          color: isEligible ? theme.text : theme.textDim,
          opacity: isEligible ? 1 : 0.6,
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
          border: `1px solid ${theme.border}`,
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
  theme: AppTheme;
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
    availableLevels.length === 0
      ? "Select concept"
      : `${availableLevels[0]}–${availableLevels[availableLevels.length - 1]}`;

  const primaryBlockReason = buildPrimaryBlockReason({
    selected,
    skill,
    targetPaper: selectionFilters.targetPaper,
    thinkingTypeFilter,
    currentDifficulty,
    availableLevels,
    currentDifficultyIsEligible,
  });

  const showBlockReason = !canAdd;

  return (
    <div
      style={{
        borderTop: index === 0 ? "none" : `1px solid ${theme.borderSoft}`,
        position: "relative",
        zIndex: dropdownOpen ? 50 : 1,
      }}
    >
      <button
        type="button"
        onClick={() => onToggleSkill(skill.id)}
        aria-expanded={isExpanded}
        style={{
          width: "100%",
          textAlign: "left",
          display: "grid",
          gridTemplateColumns: "64px 1fr 24px",
          gap: 10,
          padding: "10px 12px 10px 22px",
          background: isExpanded ? theme.rowHover : "transparent",
          color: theme.text,
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
          }}
        >
          {skill.code}
        </span>

        <span
          style={{
            ...UI_TEXT.controlText,
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
            color: theme.textMuted,
            ...UI_TEXT.controlTextStrong,
          }}
        >
          {isExpanded ? "▾" : "▸"}
        </span>
      </button>

      {isExpanded && (
        <div
          style={{
            padding: "10px 12px 12px",
            background: theme.panelBg2,
            borderTop: `1px solid ${theme.borderSoft}`,
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) auto",
            columnGap: 14,
            rowGap: 10,
            alignItems: "end",
            position: "relative",
            overflow: "visible",
          }}
        >
          <div
            style={{
              gridColumn: "1 / -1",
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr) auto",
              columnGap: 14,
              rowGap: 8,
              alignItems: "end",
              overflow: "visible",
            }}
          >
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                  marginBottom: 6,
                }}
              >
                <div
                  style={{
                    ...UI_TEXT.sectionLabel,
                    color: theme.textDim,
                    minWidth: 0,
                  }}
                >
                  Concept (filtered: {standardFilter})
                </div>

                <div
                  style={{
                    ...UI_TEXT.metadata,
                    color: theme.textMuted,
                    whiteSpace: "nowrap",
                    flex: "0 0 auto",
                  }}
                >
                  {ranked.length
                    ? `${hasSelection ? currentIndex + 1 : 0}/${ranked.length}`
                    : "0/0"}
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
                  onClick={() => ranked.length > 0 && setDropdownOpen((prev) => !prev)}
                  disabled={ranked.length === 0}
                  style={{
                    width: "100%",
                    height: 34,
                    borderRadius: 10,
                    border: `1px solid ${theme.border}`,
                    background: theme.controlBg,
                    color: theme.text,
                    boxSizing: "border-box",
                    padding: "0 34px 0 10px",
                    display: "flex",
                    alignItems: "center",
                    minWidth: 0,
                    overflow: "hidden",
                    cursor: ranked.length === 0 ? "default" : "pointer",
                    opacity: ranked.length === 0 ? 0.6 : 1,
                    position: "relative",
                    transition:
                      "background 0.15s ease, border-color 0.15s ease, color 0.15s ease",
                  }}
                  title={selected ? conceptSelectionText(selected) : "Select skill concept"}
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
                      <span style={{ color: theme.textMuted }}>Select skill concept</span>
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
                      border: `1px solid ${theme.border}`,
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
                          ? `1px solid ${theme.borderSoft}`
                          : "none",
                        background: currentIndex === -1 ? theme.rowHover : "transparent",
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
                                : `1px solid ${theme.borderSoft}`,
                            background: active ? theme.rowHover : "transparent",
                            color: isDropdownEligible ? theme.text : theme.textMuted,
                            opacity: isDropdownEligible ? 1 : 0.64,
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
                                color: theme.textDim,
                                whiteSpace: "nowrap",
                                border: `1px solid ${theme.borderSoft}`,
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

            <div style={{ width: "fit-content" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                  marginBottom: 6,
                }}
              >
                <div
                  style={{
                    ...UI_TEXT.sectionLabel,
                    color: theme.textDim,
                    whiteSpace: "nowrap",
                  }}
                >
                  Difficulty
                </div>

                <div
                  style={{
                    ...UI_TEXT.metadata,
                    color: theme.textMuted,
                    whiteSpace: "nowrap",
                  }}
                >
                  {difficultyRangeText}
                </div>
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
                gridColumn: "1 / -1",
                ...UI_TEXT.metadata,
                color: theme.textMuted,
              }}
            >
              {primaryBlockReason}
            </div>
          ) : null}

          <div
            style={{
              gridColumn: 2,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
              width: "100%",
              justifySelf: "end",
            }}
          >
            <div
              style={{
                opacity: canAdd ? 1 : 0.48,
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
                title={canAdd ? "Add this question to the assessment" : primaryBlockReason}
                variant="primary"
              />
            </div>

            <div
              style={{
                opacity: canRegenerate ? 1 : 0.48,
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
        marginBottom: 14,
        position: "relative",
        zIndex: 1,
        minWidth: 0,
        maxWidth: "100%",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "100%",
          minWidth: 0,
          boxSizing: "border-box",
          display: "grid",
          gridTemplateColumns: "1fr auto",
          gap: 10,
          alignItems: "center",
          background: theme.headerBg,
          color: theme.text,
          padding: "10px 12px",
          borderRadius: 14,
          border: `1px solid ${theme.border}`,
          overflow: "hidden",
          boxShadow: theme.cardShadow,
        }}
      >
        <button
          onClick={handleToggleCategory}
          type="button"
          aria-expanded={!collapsed}
          style={{
            textAlign: "left",
            cursor: "pointer",
            background: "transparent",
            color: theme.text,
            border: "none",
            padding: 0,
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
              color: theme.textMuted,
              flex: "0 0 auto",
              ...UI_TEXT.controlTextStrong,
            }}
          >
            {collapsed ? "▶" : "▼"}
          </span>

          <span
            style={{
              ...UI_TEXT.sectionTitle,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              minWidth: 0,
            }}
          >
            {category}
          </span>
        </button>

        {!collapsed ? (
          <button
            type="button"
            onClick={onCollapseCategorySkills}
            style={{
              padding: "6px 12px",
              borderRadius: 12,
              border: `1px solid ${theme.border}`,
              background: theme.controlBg,
              color: theme.textMuted,
              cursor: "pointer",
              height: 30,
              whiteSpace: "nowrap",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              ...UI_TEXT.buttonTextSmall,
              transition:
                "background 0.15s ease, border-color 0.15s ease, color 0.15s ease",
            }}
            title={`Collapse expanded skills in ${category}`}
          >
            Collapse
          </button>
        ) : null}
      </div>

      {!collapsed && (
        <div
          style={{
            marginTop: 8,
            border: `1px solid ${theme.borderSoft}`,
            borderRadius: 14,
            overflow: "visible",
            background: theme.bgSurfaceAlt,
            position: "relative",
            zIndex: 1,
            boxShadow: theme.cardShadow,
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