"use client";

import { useEffect, useState } from "react";
import CategorySection from "@/app/create-assessment/builder/components/skills-tree/CategorySection";
import { UI_TEXT, UI_TYPO } from "@/app/ui/UiTypography";
import type { Theme } from "@/ui/AppTheme";
import type {
  DifficultyLevel,
  Paper,
  Skill,
  StandardFilter,
  ThinkingTypeFilter,
} from "@/shared-types/AssessmentTypes";
import type { QuestionSelectionFilters } from "@/shared-types/QuestionSelectionTypes";

const CONTROL_HEIGHT = 40;
const SEGMENT_INSET = 5;
const SEGMENT_INNER_HEIGHT = CONTROL_HEIGHT - SEGMENT_INSET * 2;

function SegmentedControl<Option extends string>(props: {
  ariaLabel: string;
  options: Array<{ value: Option; label: string }>;
  value: Option;
  onChange: (value: Option) => void;
  theme: Theme;
  size?: "sm" | "md";
}) {
  const { ariaLabel, options, value, onChange, theme, size = "md" } = props;

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        width: "fit-content",
        maxWidth: "100%",
        minWidth: 0,
        padding: SEGMENT_INSET,
        height: CONTROL_HEIGHT,
        borderRadius: 14,
        border: `1px solid ${theme.borderStandard}`,
        background: theme.controlBg,
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
        boxSizing: "border-box",
      }}
    >
      {options.map((option) => {
        const selected = option.value === value;

        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(option.value)}
            style={{
              flex: "0 0 auto",
              height: SEGMENT_INNER_HEIGHT,
              border: "none",
              borderRadius: 10,
              background: selected ? theme.controlSelectedBg : "transparent",
              color: selected ? theme.textPrimary : theme.textSecondary,
              cursor: "pointer",
              fontFamily: UI_TYPO.family,
              fontWeight: UI_TYPO.weightSemibold,
              fontSize: size === "sm" ? UI_TYPO.sizeSm : UI_TYPO.sizeMeta,
              lineHeight: 1,
              whiteSpace: "nowrap",
              padding: "0 10px",
              boxShadow: selected ? "0 2px 8px rgba(15,23,42,0.10)" : "none",
              transform: selected ? "scale(1.01)" : "scale(1)",
              transition:
                "background 0.16s ease, color 0.16s ease, box-shadow 0.16s ease, transform 0.16s ease",
            }}
            title={option.label}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

function MiniStepButton(props: {
  label: "Up" | "Down";
  onClick: () => void;
  theme: Theme;
}) {
  const { label, onClick, theme } = props;

  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      style={{
        borderRadius: 9,
        border: `1px solid ${theme.borderStandard}`,
        background: theme.controlBg,
        color: theme.textMuted,
        cursor: "pointer",
        fontFamily: UI_TYPO.family,
        fontWeight: UI_TYPO.weightHeavy,
        width: 30,
        height: 18,
        display: "grid",
        placeItems: "center",
        padding: 0,
        lineHeight: 1,
        fontSize: 9,
        transition:
          "background 0.15s ease, border-color 0.15s ease, color 0.15s ease",
      }}
      title={label}
    >
      <span
        style={{
          display: "block",
          lineHeight: 1,
          transform: label === "Up" ? "translateY(-0.5px)" : "translateY(0.5px)",
        }}
      >
        {label === "Up" ? "▲" : "▼"}
      </span>
    </button>
  );
}

type SkillsTreeProps = {
  skillsData: Record<string, Skill[]>;
  totalSkillsCount: number;
  standardFilter: StandardFilter;
  setStandardFilter: (v: StandardFilter) => void;

  thinkingTypeFilter: ThinkingTypeFilter;
  setThinkingTypeFilter: (v: ThinkingTypeFilter) => void;

  targetMarks: number;
  setTargetMarks: (n: number) => void;
  minTargetMarks: number;
  maxTargetMarks: number;

  activePaper: Paper;
  setActivePaper: (p: Paper) => void;

  collapsedCategories: Record<string, boolean>;
  toggleCategory: (categoryName: string) => void;

  expandedSkillIds: string[];
  toggleSkillRow: (skillId: string) => void;
  collapseAllSkills: () => void;

  getConceptIndex: (skillId: string) => number;
  setConceptIndex: (skillId: string, nextIndex: number) => void;

  getDifficulty: (skillId: string) => DifficultyLevel;
  setDifficulty: (skillId: string, next: DifficultyLevel) => void;

  addQuestionToPaper: (
    category: string,
    skill: Skill,
    concept: string,
    difficulty: DifficultyLevel,
    paper: Paper
  ) => void;

  regenerateQuestionToPaper: (
    category: string,
    skill: Skill,
    concept: string,
    difficulty: DifficultyLevel,
    paper: Paper
  ) => void;

  theme: Theme;
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
  theme,
}: SkillsTreeProps) {
  const [helperHidden, setHelperHidden] = useState(false);
  const [targetMarksText, setTargetMarksText] = useState(`${targetMarks} marks`);

  const helperColor = theme.textMuted;

  useEffect(() => {
    setTargetMarksText(`${targetMarks} marks`);
  }, [targetMarks]);

  const decMarks = () => setTargetMarks(Math.max(minTargetMarks, targetMarks - 1));
  const incMarks = () => setTargetMarks(Math.min(maxTargetMarks, targetMarks + 1));

  const collapseSkillsInCategory = (skills: Skill[]) => {
    const categoryIds = new Set(skills.map((s) => s.id));
    categoryIds.forEach((id) => {
      if (expandedSkillIds.includes(id)) {
        toggleSkillRow(id);
      }
    });
  };

  const selectionFilters: QuestionSelectionFilters = {
    selectedStandard: standardFilter,
    selectedThinkingType: thinkingTypeFilter,
    targetMarks,
    targetPaper: activePaper,
  };

  function commitTargetMarksInput(rawValue: string) {
    const digitsOnly = rawValue.replace(/\D/g, "");

    if (!digitsOnly.length) {
      setTargetMarks(minTargetMarks);
      setTargetMarksText(`${minTargetMarks} marks`);
      return;
    }

    const parsed = Number(digitsOnly);
    if (!Number.isFinite(parsed)) {
      setTargetMarksText(`${targetMarks} marks`);
      return;
    }

    const clamped = Math.max(minTargetMarks, Math.min(maxTargetMarks, parsed));
    setTargetMarks(clamped);
    setTargetMarksText(`${clamped} marks`);
  }

  return (
    <section
      style={{
        borderRight: `1px solid ${theme.borderStandard}`,
        background: theme.bgPage,
        minHeight: 0,
        display: "grid",
        gridTemplateRows: "auto 1fr",
        overflow: "hidden",
        ...UI_TEXT.appRoot,
      }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 2,
          background: theme.bgPage,
          borderBottom: `1px solid ${theme.borderStandard}`,
          padding: "14px 14px 10px",
        }}
      >
        <div
          style={{
            display: "grid",
            gap: 12,
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "auto 1fr",
              gap: 14,
              alignItems: "start",
            }}
          >
            <div
              style={{
                ...UI_TEXT.pageTitle,
                margin: 0,
                letterSpacing: 0.2,
                whiteSpace: "nowrap",
                color: theme.textPrimary,
              }}
            >
              Skills Tree
            </div>

            <div
              style={{
                ...UI_TEXT.metadata,
                color: theme.textMuted,
                textAlign: "right",
                whiteSpace: "nowrap",
              }}
            >
              {totalSkillsCount} skills • concepts filtered by Standard
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gap: 6,
              paddingBottom: 10,
              borderBottom: `1px solid ${theme.borderStandard}`,
            }}
          >
            {!helperHidden ? (
              <div
                style={{
                  ...UI_TEXT.helper,
                  color: helperColor,
                  textAlign: "left",
                  maxWidth: 520,
                }}
              >
                Filter by standard, choose a thinking type, select a paper to add to,
                and generate questions for your assessment. View them in the PDF builder
                in the right pane.{" "}
                <button
                  type="button"
                  onClick={() => setHelperHidden(true)}
                  style={{
                    border: "none",
                    background: "transparent",
                    color: theme.textSecondary,
                    cursor: "pointer",
                    padding: 0,
                    font: "inherit",
                    fontWeight: UI_TYPO.weightSemibold,
                    textDecoration: "underline",
                    textUnderlineOffset: 2,
                  }}
                >
                  Hide
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <button
                  type="button"
                  onClick={() => setHelperHidden(false)}
                  style={{
                    border: "none",
                    background: "transparent",
                    color: theme.textSecondary,
                    cursor: "pointer",
                    padding: 0,
                    fontFamily: UI_TYPO.family,
                    fontSize: UI_TYPO.sizeMeta,
                    fontWeight: UI_TYPO.weightSemibold,
                    textDecoration: "underline",
                    textUnderlineOffset: 2,
                  }}
                >
                  Show guidance
                </button>
              </div>
            )}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr) auto",
              columnGap: 14,
              rowGap: 12,
              alignItems: "end",
            }}
          >
            <div
              style={{
                display: "grid",
                gap: 6,
                justifyItems: "start",
                minWidth: 0,
              }}
            >
              <div
                style={{
                  ...UI_TEXT.sectionLabel,
                  color: theme.textMuted,
                }}
              >
                Standard
              </div>

              <div style={{ minWidth: 0, maxWidth: "100%", overflow: "hidden" }}>
                <SegmentedControl<StandardFilter>
                  ariaLabel="Standard filter"
                  value={standardFilter}
                  onChange={setStandardFilter}
                  theme={theme}
                  size="sm"
                  options={[
                    { value: "C", label: "C-standard" },
                    { value: "A", label: "A-standard" },
                    { value: "C+A", label: "A+C-standard" },
                  ]}
                />
              </div>
            </div>

            <div style={{ display: "grid", gap: 6, justifyItems: "start" }}>
              <div
                style={{
                  ...UI_TEXT.sectionLabel,
                  color: theme.textMuted,
                }}
              >
                Target marks
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  minHeight: CONTROL_HEIGHT,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    borderRadius: 14,
                    border: `1px solid ${theme.borderStandard}`,
                    background: theme.controlBg,
                    height: CONTROL_HEIGHT,
                    width: 104,
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
                    overflow: "hidden",
                    boxSizing: "border-box",
                  }}
                  title={`Target marks: ${targetMarks}`}
                >
                  <input
                    type="text"
                    inputMode="numeric"
                    value={targetMarksText}
                    onChange={(e) => setTargetMarksText(e.target.value)}
                    onFocus={(e) => e.currentTarget.select()}
                    onBlur={(e) => commitTargetMarksInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        commitTargetMarksInput(targetMarksText);
                        e.currentTarget.blur();
                      }
                    }}
                    style={{
                      width: "100%",
                      height: "100%",
                      border: "none",
                      outline: "none",
                      background: "transparent",
                      color: theme.textPrimary,
                      fontFamily: UI_TYPO.family,
                      fontWeight: UI_TYPO.weightSemibold,
                      fontSize: UI_TYPO.sizeMeta,
                      textAlign: "left",
                      lineHeight: 1,
                      padding: "0 14px",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <div
                  style={{
                    display: "grid",
                    gap: 4,
                    justifyItems: "center",
                    alignItems: "center",
                  }}
                >
                  <MiniStepButton label="Up" onClick={incMarks} theme={theme} />
                  <MiniStepButton label="Down" onClick={decMarks} theme={theme} />
                </div>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gap: 6,
                justifyItems: "start",
                minWidth: 0,
              }}
            >
              <div
                style={{
                  ...UI_TEXT.sectionLabel,
                  color: theme.textMuted,
                }}
              >
                Thinking type
              </div>

              <SegmentedControl<ThinkingTypeFilter>
                ariaLabel="Thinking type filter"
                value={thinkingTypeFilter}
                onChange={setThinkingTypeFilter}
                theme={theme}
                size="sm"
                options={[
                  { value: "OPERATIONAL", label: "Operational" },
                  { value: "REASONING", label: "Reasoning" },
                  { value: "ANY", label: "Any" },
                ]}
              />
            </div>

            <div
              style={{
                display: "grid",
                gap: 6,
                justifyItems: "start",
                alignSelf: "end",
                minWidth: 0,
              }}
            >
              <div
                style={{
                  ...UI_TEXT.sectionLabel,
                  color: theme.textMuted,
                }}
              >
                Add questions to
              </div>

              <SegmentedControl<Paper>
                ariaLabel="Active paper"
                value={activePaper}
                onChange={setActivePaper}
                theme={theme}
                size="sm"
                options={[
                  { value: "P1", label: "Paper 1" },
                  { value: "P2", label: "Paper 2" },
                ]}
              />
            </div>
          </div>
        </div>
      </div>

      <div
        className="hover-scroll"
        style={{
          minHeight: 0,
          overflowY: "auto",
          padding: "10px 14px 14px",
        }}
      >
        {Object.entries(skillsData).map(([category, skillsUnknown]) => {
          const skills = skillsUnknown as Skill[];

          return (
            <CategorySection
              key={category}
              category={category}
              skills={skills}
              collapsed={collapsedCategories[category] ?? false}
              onToggleCategory={() => toggleCategory(category)}
              onCollapseCategorySkills={() => collapseSkillsInCategory(skills)}
              expandedSkillIds={expandedSkillIds}
              onToggleSkill={toggleSkillRow}
              standardFilter={standardFilter}
              thinkingTypeFilter={thinkingTypeFilter}
              targetMarks={targetMarks}
              selectionFilters={selectionFilters}
              getConceptIndex={getConceptIndex}
              setConceptIndex={setConceptIndex}
              getDifficulty={getDifficulty}
              setDifficulty={setDifficulty}
              onAddQuestion={(categoryName, skill, concept, difficulty) =>
                addQuestionToPaper(
                  categoryName,
                  skill,
                  concept,
                  difficulty,
                  activePaper
                )
              }
              onRegenerateQuestion={(categoryName, skill, concept, difficulty) =>
                regenerateQuestionToPaper(
                  categoryName,
                  skill,
                  concept,
                  difficulty,
                  activePaper
                )
              }
              theme={theme}
            />
          );
        })}
      </div>
    </section>
  );
}