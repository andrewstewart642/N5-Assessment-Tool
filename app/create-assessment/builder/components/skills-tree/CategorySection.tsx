"use client";

// app/create-assessment/builder/components/skills-tree/CategorySection.tsx
// One umbrella category (e.g. Numerical Skills) containing clickable skills.

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";

import AddQuestionButton from "@/app/create-assessment/builder/components/skills-tree/AddQuestionButton";
import PaperContent from "@/app/create-assessment/builder/components/assessment-preview/PaperContent";
import { UI_TEXT, UI_TYPO } from "@/src/UI/Application/Typography/Typography";
import type { Theme } from "@/src/UI/Application/Theme/AppTheme";
import {
  getEligibleDifficultiesForConcept,
  getAvailableDifficultiesForConcept,
} from "@/app/create-assessment/builder/builder-logic/BuilderQuestionGenerators";
import {
  formatBuilderPaperSuitability,
  isPaperSuitableForSkill,
} from "@/app/create-assessment/builder/builder-logic/BuilderPaperTargets";
import {
  conceptMatchesThinkingTypeFilter,
  rankConceptsByTargetMarks,
} from "@/math-helpers/QuestionLogic";
import type { PaperPart } from "@/shared-types/PaperParts";
import type { QuestionSelectionFilters } from "@/shared-types/QuestionSelectionTypes";
import type {
  Concept,
  DifficultyLevel,
  Paper,
  Skill,
  SkillPaperSuitability,
  StandardFilter,
  ThinkingTypeFilter,
} from "@/shared-types/AssessmentTypes";

const CATEGORY_STRIPE_HEIGHT = 5;
const CATEGORY_HEADER_HEIGHT = 58;
const CATEGORY_ACTION_SLOT_WIDTH = 112;

type ConstraintPillId = "standard" | "targetMarks" | "thinkingType" | "paper";

type ConceptRestriction = {
  tag: string;
  constraint: ConstraintPillId;
};

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

  onConstraintBlocked: (constraint: ConstraintPillId) => void;

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

function getOrderedDifficultyLevels(
  availableLevels: DifficultyLevel[]
): DifficultyLevel[] {
  return [...availableLevels].sort((a, b) => a - b);
}

function canStepDifficulty(
  availableLevels: DifficultyLevel[],
  current: DifficultyLevel,
  direction: "prev" | "next"
): boolean {
  const orderedLevels = getOrderedDifficultyLevels(availableLevels);

  if (orderedLevels.length <= 1) {
    return false;
  }

  const currentIndex = orderedLevels.indexOf(current);

  if (currentIndex === -1) {
    return true;
  }

  if (direction === "prev") {
    return currentIndex > 0;
  }

  return currentIndex < orderedLevels.length - 1;
}

function stepDifficulty(
  availableLevels: DifficultyLevel[],
  current: DifficultyLevel,
  direction: "prev" | "next"
): DifficultyLevel {
  const orderedLevels = getOrderedDifficultyLevels(availableLevels);

  if (orderedLevels.length === 0) {
    return current;
  }

  const currentIndex = orderedLevels.indexOf(current);
  const safeIndex = currentIndex === -1 ? 0 : currentIndex;

  if (direction === "prev") {
    return orderedLevels[Math.max(0, safeIndex - 1)];
  }

  return orderedLevels[Math.min(orderedLevels.length - 1, safeIndex + 1)];
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
  targetPaper: Paper
): boolean {
  const suitability = getPaperSuitabilityForConcept(skill, concept);

  return isPaperSuitableForSkill({
    paper: targetPaper,
    paperSuitability: suitability,
  });
}

function formatPaperSuitabilityOnlyText(
  suitability: SkillPaperSuitability
): string {
  if (suitability === "BOTH") {
    return "both papers";
  }

  return `${formatBuilderPaperSuitability(suitability)} only`;
}

function conceptMatchesStandardFilter(
  concept: Concept,
  standardFilter: StandardFilter
): boolean {
  if (standardFilter === "C+A") return true;
  if (concept.standard === "C+A") return true;
  return concept.standard === standardFilter;
}

function buildStandardMismatchTag(concept: Concept): string {
  if (concept.standard === "C") return "C-standard only";
  if (concept.standard === "A") return "A-standard only";
  if (concept.standard === "C+A") return "A+C-standard";
  return "Wrong standard";
}

function buildTargetMarksMismatchTag(concept: Concept): string {
  if (typeof concept.marks === "number" && Number.isFinite(concept.marks)) {
    return `${concept.marks} marks only`;
  }

  return "Wrong mark target";
}

function buildThinkingTypeMismatchMessage(filter: ThinkingTypeFilter): string {
  if (filter === "REASONING") {
    return "Operational only — choose Any or Operational.";
  }

  if (filter === "OPERATIONAL") {
    return "Reasoning only — choose Any or Reasoning.";
  }

  return "This concept does not match the current thinking type.";
}

function buildPaperMismatchMessage(suitability: SkillPaperSuitability): string {
  return `${formatPaperSuitabilityOnlyText(suitability)} — switch paper.`;
}

function getConceptRestriction(args: {
  skill: Skill;
  concept: Concept;
  standardFilter: StandardFilter;
  thinkingTypeFilter: ThinkingTypeFilter;
  targetMarks: number;
  selectionFilters: QuestionSelectionFilters;
}): ConceptRestriction | null {
  const {
    skill,
    concept,
    standardFilter,
    thinkingTypeFilter,
    selectionFilters,
  } = args;

  if (!conceptMatchesStandardFilter(concept, standardFilter)) {
    return {
      tag: buildStandardMismatchTag(concept),
      constraint: "standard",
    };
  }

  const suitability = getPaperSuitabilityForConcept(skill, concept);

  if (!conceptMatchesPaper(skill, concept, selectionFilters.targetPaper)) {
    return {
      tag: formatPaperSuitabilityOnlyText(suitability),
      constraint: "paper",
    };
  }

  if (!conceptMatchesThinkingTypeFilter(concept, thinkingTypeFilter)) {
    return {
      tag:
        thinkingTypeFilter === "REASONING"
          ? "Operational only"
          : "Reasoning only",
      constraint: "thinkingType",
    };
  }

  const conceptText = conceptSelectionText(concept);
  const eligibleLevels = getEligibleDifficultiesForConcept(
    skill,
    conceptText,
    selectionFilters
  );

  if (eligibleLevels.length === 0) {
    return {
      tag: buildTargetMarksMismatchTag(concept),
      constraint: "targetMarks",
    };
  }

  return null;
}

function buildPrimaryBlockReason(args: {
  selected: Concept | undefined;
  skill: Skill;
  standardFilter: StandardFilter;
  targetMarks: number;
  selectionFilters: QuestionSelectionFilters;
  thinkingTypeFilter: ThinkingTypeFilter;
  currentDifficulty: DifficultyLevel;
  availableLevels: DifficultyLevel[];
  currentDifficultyIsEligible: boolean;
}): string {
  const {
    selected,
    skill,
    standardFilter,
    targetMarks,
    selectionFilters,
    thinkingTypeFilter,
    currentDifficulty,
    availableLevels,
    currentDifficultyIsEligible,
  } = args;

  if (!selected) {
    return "Select a concept first.";
  }

  const restriction = getConceptRestriction({
    skill,
    concept: selected,
    standardFilter,
    thinkingTypeFilter,
    targetMarks,
    selectionFilters,
  });

  if (restriction?.constraint === "standard") {
    return `${restriction.tag} — change Standard.`;
  }

  if (restriction?.constraint === "paper") {
    return buildPaperMismatchMessage(
      getPaperSuitabilityForConcept(skill, selected)
    );
  }

  if (restriction?.constraint === "thinkingType") {
    return buildThinkingTypeMismatchMessage(thinkingTypeFilter);
  }

  if (restriction?.constraint === "targetMarks") {
    return `${restriction.tag} — change Target marks.`;
  }

  if (availableLevels.length === 0) {
    return "No selectable difficulty for this concept.";
  }

  if (!availableLevels.includes(currentDifficulty)) {
    return "This difficulty is not available for this concept.";
  }

  if (!currentDifficultyIsEligible) {
    return "This difficulty does not match the current marks filter.";
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
  onDecrease: () => void;
  onIncrease: () => void;
  theme: Theme;
}) {
  const { value, availableLevels, onDecrease, onIncrease, theme } = props;

  const canDecrease = canStepDifficulty(availableLevels, value, "prev");
  const canIncrease = canStepDifficulty(availableLevels, value, "next");
  const hasAvailableDifficulty = availableLevels.length > 0;

  function buttonStyle(enabled: boolean): CSSProperties {
    return {
      height: 34,
      width: 56,
      borderRadius: 10,
      border: `1px solid ${theme.borderStandard}`,
      background: enabled ? theme.controlBg : theme.bgSurface,
      color: enabled ? theme.textPrimary : theme.textMuted,
      cursor: enabled ? "pointer" : "default",
      opacity: enabled ? 1 : 0.42,
      display: "grid",
      placeItems: "center",
      fontFamily: UI_TYPO.family,
      fontWeight: UI_TYPO.weightBold,
      fontSize: 20,
      lineHeight: 1,
      padding: 0,
      transition:
        "background 0.15s ease, border-color 0.15s ease, color 0.15s ease, opacity 0.15s ease",
    };
  }

  return (
    <div
      style={{
        display: "inline-grid",
        gridTemplateColumns: "56px 56px",
        alignItems: "center",
        gap: 8,
      }}
      title={
        hasAvailableDifficulty
          ? `Difficulty ${value}`
          : "No difficulty range available for this concept"
      }
    >
      <button
        type="button"
        onClick={onDecrease}
        disabled={!canDecrease}
        style={buttonStyle(canDecrease)}
        title={canDecrease ? "Decrease difficulty" : "Minimum difficulty reached"}
        aria-label="Decrease difficulty"
      >
        −
      </button>

      <button
        type="button"
        onClick={onIncrease}
        disabled={!canIncrease}
        style={buttonStyle(canIncrease)}
        title={canIncrease ? "Increase difficulty" : "Maximum difficulty reached"}
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
  onConstraintBlocked: (constraint: ConstraintPillId) => void;
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
    onConstraintBlocked,
    onAddQuestion,
    onRegenerateQuestion,
    theme,
  } = props;

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [rowHovered, setRowHovered] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const ranked = useMemo(
    () => rankConceptsByTargetMarks(skill.concepts, targetMarks),
    [skill.concepts, targetMarks]
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

  const selectedRestriction = selected
    ? getConceptRestriction({
        skill,
        concept: selected,
        standardFilter,
        thinkingTypeFilter,
        targetMarks,
        selectionFilters,
      })
    : null;

  const currentDifficultyIsEligible = eligibleLevels.includes(currentDifficulty);

  const canAdd =
    !!selected && selectedRestriction === null && currentDifficultyIsEligible;

  const canRegenerate =
    !!selected && selectedRestriction === null && currentDifficultyIsEligible;

  function flashCurrentRestriction() {
    if (!selected) return;

    if (selectedRestriction) {
      onConstraintBlocked(selectedRestriction.constraint);
      return;
    }

    if (!currentDifficultyIsEligible) {
      onConstraintBlocked("targetMarks");
    }
  }

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

  const primaryBlockReason = buildPrimaryBlockReason({
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
                  visible with constraints
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
                      position: "relative",
                      zIndex: 80,
                      width: "100%",
                      maxWidth: "100%",
                      maxHeight: 240,
                      overflowY: "auto",
                      marginTop: 6,
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
                      const restriction = getConceptRestriction({
                        skill,
                        concept,
                        standardFilter,
                        thinkingTypeFilter,
                        targetMarks,
                        selectionFilters,
                      });

                      const isDropdownEligible = restriction === null;

                      return (
                        <button
                          key={concept.id}
                          type="button"
                          onClick={() => {
                            setConceptIndex(skill.id, conceptIdx);
                            setDropdownOpen(false);

                            if (restriction) {
                              onConstraintBlocked(restriction.constraint);
                            }
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
                            opacity: isDropdownEligible ? 1 : 0.62,
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
                            restriction
                              ? `${conceptSelectionText(concept)} — ${restriction.tag}`
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

                          {restriction ? (
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
                              {restriction.tag}
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
                  ...UI_TEXT.sectionLabel,
                  color: theme.textSecondary,
                  whiteSpace: "nowrap",
                  marginBottom: 6,
                }}
              >
                Difficulty
              </div>

              <DifficultyStepper
                value={currentDifficulty}
                availableLevels={availableLevels}
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
              }}
            >
              <AddQuestionButton
                onClick={() => {
                  if (!selected) return;

                  if (!canAdd) {
                    flashCurrentRestriction();
                    return;
                  }

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
              }}
            >
              <AddQuestionButton
                onClick={() => {
                  if (!selected) return;

                  if (!canRegenerate) {
                    flashCurrentRestriction();
                    return;
                  }

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
    onConstraintBlocked,
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
              onConstraintBlocked={onConstraintBlocked}
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