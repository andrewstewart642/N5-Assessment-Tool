// page-sections/CategorySection.tsx
// One umbrella category (e.g. Numerical Skills) containing clickable skills.

import ConceptDifficultySelector from "@/page-sections/ConceptDifficultySelector";
import AddQuestionButton from "@/page-sections/AddQuestionButton";
import { UI_TEXT, UI_TYPO } from "@/app/ui/uiTypography";
import { cycleDifficulty, cycleIndex, getFilteredConcepts, rankConceptsByTargetMarks } from "@/math-helpers/questionLogic";
import type { DifficultyLevel, Skill, StandardFilter, Theme } from "@/shared-types/assessmentTypes";

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

  onAddQuestion: (category: string, skill: Skill, concept: string, difficulty: DifficultyLevel) => void;
  onRegenerateQuestion: (category: string, skill: Skill, concept: string, difficulty: DifficultyLevel) => void;

  theme: Theme;
};

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
          onClick={onToggleCategory}
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
          {skills.map((skill, idx) => {
            const isExpanded = expandedSkillIds.includes(skill.id);

            const filtered = getFilteredConcepts(skill, standardFilter);
            const ranked = rankConceptsByTargetMarks(filtered, targetMarks);

            const currentIndex = Math.min(getConceptIndex(skill.id), ranked.length - 1);
            const selected = ranked[currentIndex];

            const selectedConceptLabel = selected?.label ?? "Concept";
            const selectedConceptMarks = selected?.marks ? ` (${selected.marks}m)` : "";
            const selectedConceptDisplay = `${selectedConceptLabel}${selectedConceptMarks}`;

            const currentDifficulty = getDifficulty(skill.id);

            return (
              <div key={skill.id} style={{ borderTop: idx === 0 ? "none" : `1px solid ${theme.borderSoft}` }}>
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
                      gridTemplateColumns: "1fr 360px",
                      columnGap: 14,
                      rowGap: 10,
                      alignItems: "end",
                    }}
                  >
                    <div style={{ gridColumn: "1 / -1" }}>
                      <ConceptDifficultySelector
                        conceptTitle={`Concept (filtered: ${standardFilter})`}
                        conceptValue={selectedConceptDisplay}
                        conceptCounter={ranked.length ? `${currentIndex + 1}/${ranked.length}` : ""}
                        conceptDisabled={ranked.length <= 1}
                        onConceptUp={() => setConceptIndex(skill.id, cycleIndex(currentIndex, ranked.length, "prev"))}
                        onConceptDown={() => setConceptIndex(skill.id, cycleIndex(currentIndex, ranked.length, "next"))}
                        difficultyValue={`Level ${currentDifficulty}`}
                        difficultyCounter="1–5"
                        onDifficultyUp={() => setDifficulty(skill.id, cycleDifficulty(currentDifficulty, "prev"))}
                        onDifficultyDown={() => setDifficulty(skill.id, cycleDifficulty(currentDifficulty, "next"))}
                        theme={theme}
                      />
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
                      <AddQuestionButton
                        onClick={() => onAddQuestion(category, skill, selectedConceptLabel, currentDifficulty)}
                        theme={theme}
                        label="Add Question"
                        title="Add this (skill + concept + difficulty) to the assessment"
                        variant="primary"
                      />

                      <AddQuestionButton
                        onClick={() => onRegenerateQuestion(category, skill, selectedConceptLabel, currentDifficulty)}
                        theme={theme}
                        label="Regenerate"
                        title="Replaces the most recent matching question on the paper (same skill, concept, difficulty)"
                        variant="secondary"
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}