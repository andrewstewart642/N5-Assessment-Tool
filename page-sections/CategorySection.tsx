"use client";

// page-sections/CategorySection.tsx
// One umbrella category (e.g. Numerical Skills) containing clickable skills.

import { useEffect, useMemo, useRef, useState } from "react";

import AddQuestionButton from "@/page-sections/AddQuestionButton";
import PaperContent from "@/page-sections/PaperContent";
import { UI_TEXT, UI_TYPO } from "@/app/ui/uiTypography";
import {
  cycleDifficulty,
  getFilteredConcepts,
  rankConceptsByTargetMarks,
} from "@/math-helpers/questionLogic";
import type { PaperPart } from "@/shared-types/paperParts";
import type {
  Concept,
  DifficultyLevel,
  Skill,
  StandardFilter,
  Theme,
} from "@/shared-types/assessmentTypes";

type Props = {
  category: string;
  skills: Skill[];
  collapsed: boolean;
  onToggleCategory: () => void;
  onCollapseCategorySkills: () => void;

  expandedSkillIds: string[];
  onToggleSkill: (skillId: string) => void;

  standardFilter: StandardFilter;

  targetMarks: number;

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
  const fallbackLabel = concept.label.replace(new RegExp(`^${concept.code}\\s*`), "").trim();
  const labelText = short || fallbackLabel || concept.label;

  const parts: PaperPart[] = [
    textPart(`${concept.code}\u2003${labelText}`), // em-space between code and label
  ];

  if (concept.badge?.trim()) {
    parts.push(textPart(" · "));
    parts.push(mathPart(concept.badge.trim()));
  }

  return parts;
}

function DifficultyStepper(props: {
  value: DifficultyLevel;
  onDecrease: () => void;
  onIncrease: () => void;
  theme: Theme;
}) {
  const { value, onDecrease, onIncrease, theme } = props;

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
        style={{
          height: 34,
          width: 30,
          borderRadius: 10,
          border: `1px solid ${theme.border}`,
          background: theme.controlBg,
          color: theme.textMuted,
          cursor: "pointer",
          display: "grid",
          placeItems: "center",
          fontFamily: UI_TYPO.family,
          fontWeight: UI_TYPO.weightBold,
          fontSize: 18,
          lineHeight: 1,
          padding: 0,
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
          border: `1px solid ${theme.border}`,
          background: theme.controlBg,
          color: theme.text,
          display: "grid",
          placeItems: "center",
          whiteSpace: "nowrap",
          fontFamily: UI_TYPO.family,
          fontWeight: UI_TYPO.weightSemibold,
          fontSize: UI_TYPO.sizeSm,
          lineHeight: 1,
        }}
      >
        Level {value}
      </div>

      <button
        type="button"
        onClick={onIncrease}
        style={{
          height: 34,
          width: 30,
          borderRadius: 10,
          border: `1px solid ${theme.border}`,
          background: theme.controlBg,
          color: theme.textMuted,
          cursor: "pointer",
          display: "grid",
          placeItems: "center",
          fontFamily: UI_TYPO.family,
          fontWeight: UI_TYPO.weightBold,
          fontSize: 18,
          lineHeight: 1,
          padding: 0,
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
  targetMarks: number;
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
    targetMarks,
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

  const filtered = useMemo(() => getFilteredConcepts(skill, standardFilter), [skill, standardFilter]);
  const ranked = useMemo(() => rankConceptsByTargetMarks(filtered, targetMarks), [filtered, targetMarks]);

  const storedIndex = getConceptIndex(skill.id);
  const hasSelection = storedIndex >= 0 && storedIndex < ranked.length;
  const currentIndex = hasSelection ? storedIndex : -1;
  const selected = hasSelection ? ranked[currentIndex] : undefined;

  const currentDifficulty = getDifficulty(skill.id);

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

  return (
    <div
      style={{
        borderTop: index === 0 ? "none" : `1px solid ${theme.borderSoft}`,
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

        <span style={{ ...UI_TEXT.controlText }}>{skill.text}</span>

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
            background: theme.panelBg,
            borderTop: `1px solid ${theme.borderSoft}`,
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) auto",
            columnGap: 14,
            rowGap: 10,
            alignItems: "end",
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
                  {ranked.length ? `${hasSelection ? currentIndex + 1 : 0}/${ranked.length}` : "0/0"}
                </div>
              </div>

              <div
                ref={dropdownRef}
                style={{
                  position: "relative",
                  minWidth: 0,
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
                      zIndex: 30,
                      width: "100%",
                      maxWidth: "100%",
                      maxHeight: 240,
                      overflowY: "auto",
                      borderRadius: 12,
                      border: `1px solid ${theme.border}`,
                      background: theme.panelBg,
                      boxShadow:
                        theme.pageBg === "#eef3f8"
                          ? "0 14px 32px rgba(15,23,42,0.12)"
                          : "0 16px 36px rgba(0,0,0,0.34)",
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
                        borderBottom: ranked.length ? `1px solid ${theme.borderSoft}` : "none",
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
                            color: theme.text,
                            textAlign: "left",
                            padding: "10px 12px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            minWidth: 0,
                          }}
                          title={conceptSelectionText(concept)}
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
                  1–5
                </div>
              </div>

              <DifficultyStepper
                value={currentDifficulty}
                onDecrease={() =>
                  setDifficulty(skill.id, cycleDifficulty(currentDifficulty, "prev"))
                }
                onIncrease={() =>
                  setDifficulty(skill.id, cycleDifficulty(currentDifficulty, "next"))
                }
                theme={theme}
              />
            </div>
          </div>

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
                opacity: selected ? 1 : 0.48,
                pointerEvents: selected ? "auto" : "none",
              }}
            >
              <AddQuestionButton
                onClick={() => {
                  if (!selected) return;
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
                  selected
                    ? "Add this (skill + concept + difficulty) to the assessment"
                    : "Select a concept first"
                }
                variant="primary"
              />
            </div>

            <div
              style={{
                opacity: selected ? 1 : 0.48,
                pointerEvents: selected ? "auto" : "none",
              }}
            >
              <AddQuestionButton
                onClick={() => {
                  if (!selected) return;
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
                  selected
                    ? "Replaces the most recent matching question on the paper (same skill, concept, difficulty)"
                    : "Select a concept first"
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
    targetMarks,
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
    <div style={{ marginBottom: 14 }}>
      <div
        style={{
          width: "100%",
          display: "grid",
          gridTemplateColumns: "1fr auto",
          gap: 10,
          alignItems: "center",
          background: theme.headerBg,
          color: theme.text,
          padding: "10px 12px",
          borderRadius: 14,
          border: `1px solid ${theme.border}`,
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
            overflow: "hidden",
            background: theme.controlBg,
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
              targetMarks={targetMarks}
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