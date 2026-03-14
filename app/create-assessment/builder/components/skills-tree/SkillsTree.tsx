"use client";

import CategorySection from "@/app/create-assessment/builder/components/skills-tree/CategorySection";
import { UI_TEXT, UI_TYPO } from "@/app/ui/UiTypography";
import type {
  DifficultyLevel,
  Paper,
  Skill,
  StandardFilter,
  Theme,
} from "@/shared-types/AssessmentTypes";
import type { QuestionSelectionFilters } from "@/shared-types/QuestionSelectionTypes";

function CircleRadio(props: {
  label: string;
  checked: boolean;
  onClick: () => void;
  theme: Theme;
  fontSize?: number;
}) {
  const { label, checked, onClick, theme, fontSize = UI_TYPO.sizeMeta } = props;
  const isLight = theme.pageBg === "#eef3f8";

  return (
    <button
      type="button"
      role="radio"
      aria-checked={checked}
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 7,
        padding: "6px 12px",
        borderRadius: 999,
        border: `1px solid ${checked ? theme.accentStrong : theme.border}`,
        background: checked ? (isLight ? "#eff6ff" : "#0d1b2a") : theme.controlBg,
        color: checked ? theme.accent : theme.textMuted,
        cursor: "pointer",
        fontFamily: UI_TYPO.family,
        fontWeight: UI_TYPO.weightSemibold,
        fontSize,
        height: 30,
        lineHeight: 1,
        whiteSpace: "nowrap",
        width: "fit-content",
        minWidth: 0,
        flex: "0 0 auto",
      }}
      title={label}
    >
      <span
        style={{
          width: 10,
          height: 10,
          borderRadius: 999,
          border: `2px solid ${checked ? theme.accentStrong : theme.textDim}`,
          background: checked ? theme.accentStrong : "transparent",
          display: "inline-block",
          flex: "0 0 auto",
        }}
      />
      <span style={{ whiteSpace: "nowrap" }}>{label}</span>
    </button>
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
        borderRadius: 10,
        border: `1px solid ${theme.border}`,
        background: theme.controlBg,
        color: theme.textMuted,
        cursor: "pointer",
        fontFamily: UI_TYPO.family,
        fontWeight: UI_TYPO.weightHeavy,
        width: 30,
        height: 14,
        lineHeight: "14px",
        display: "grid",
        placeItems: "center",
        padding: 0,
        fontSize: UI_TYPO.sizeSm,
      }}
      title={label}
    >
      {label === "Up" ? "▲" : "▼"}
    </button>
  );
}

type SkillsTreeProps = {
  skillsData: Record<string, Skill[]>;
  totalSkillsCount: number;
  standardFilter: StandardFilter;
  setStandardFilter: (v: StandardFilter) => void;

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
  const isLight = theme.pageBg === "#eef3f8";

  const headerGradient = isLight
    ? "linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(244,248,252,0.98) 100%)"
    : "linear-gradient(180deg, rgba(18,28,40,0.82) 0%, rgba(12,18,26,0.96) 100%)";

  const helperColor = isLight ? "rgba(80,97,116,0.86)" : "rgba(127,144,164,0.78)";
  const insetShadow = isLight
    ? "inset 0 1px 0 rgba(255,255,255,0.55)"
    : "inset 0 1px 0 rgba(255,255,255,0.03)";

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
    targetMarks,
    targetPaper: activePaper,
  };

  return (
    <section
      style={{
        borderRight: `1px solid ${theme.border}`,
        background: theme.panelBg,
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
          background: theme.panelBg,
          borderBottom: `1px solid ${theme.borderSoft}`,
          padding: "12px 14px 10px",
        }}
      >
        <div
          style={{
            display: "grid",
            gap: 14,
            padding: 14,
            border: `1px solid ${theme.borderSoft}`,
            borderRadius: 16,
            background: headerGradient,
            boxShadow: isLight ? "0 8px 22px rgba(15,23,42,0.05)" : "none",
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
                color: theme.text,
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
              ...UI_TEXT.helper,
              color: helperColor,
              textAlign: "left",
              maxWidth: 520,
            }}
          >
            Filter by standard, choose a paper to add to, and generate questions for
            your assessment. View them in the PDF builder in the right pane.
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              rowGap: 14,
              alignItems: "end",
            }}
          >
            <div style={{ display: "grid", gap: 6 }}>
              <div
                style={{
                  ...UI_TEXT.sectionLabel,
                  color: theme.textDim,
                }}
              >
                Standard
              </div>

              <div
                role="radiogroup"
                aria-label="Standard filter"
                style={{
                  display: "flex",
                  gap: 8,
                  flexWrap: "nowrap",
                  alignItems: "center",
                  minWidth: 0,
                }}
              >
                <CircleRadio
                  label="C-standard"
                  checked={standardFilter === "C"}
                  onClick={() => setStandardFilter("C")}
                  theme={theme}
                  fontSize={UI_TYPO.sizeSm}
                />
                <CircleRadio
                  label="A-standard"
                  checked={standardFilter === "A"}
                  onClick={() => setStandardFilter("A")}
                  theme={theme}
                  fontSize={UI_TYPO.sizeSm}
                />
                <CircleRadio
                  label="A+C-standard"
                  checked={standardFilter === "C+A"}
                  onClick={() => setStandardFilter("C+A")}
                  theme={theme}
                  fontSize={UI_TYPO.sizeXs}
                />
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "auto 1fr",
                columnGap: 24,
                rowGap: 14,
                alignItems: "end",
              }}
            >
              <div style={{ display: "grid", gap: 6 }}>
                <div
                  style={{
                    ...UI_TEXT.sectionLabel,
                    color: theme.textDim,
                  }}
                >
                  Target marks
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    width: "fit-content",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 12,
                      padding: "0 14px",
                      borderRadius: 14,
                      border: `1px solid ${theme.border}`,
                      background: theme.controlBg,
                      height: 38,
                      minWidth: 180,
                      boxShadow: insetShadow,
                    }}
                    title={`Target marks: ${targetMarks}`}
                  >
                    <div
                      style={{
                        ...UI_TEXT.valueText,
                        color: theme.text,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {targetMarks} marks
                    </div>
                  </div>

                  <div style={{ display: "grid", gap: 4 }}>
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
                  alignSelf: "end",
                }}
              >
                <div
                  style={{
                    ...UI_TEXT.sectionLabel,
                    color: theme.textDim,
                  }}
                >
                  Add questions to
                </div>

                <div
                  role="radiogroup"
                  aria-label="Active paper"
                  style={{
                    display: "flex",
                    gap: 8,
                    flexWrap: "nowrap",
                    alignItems: "center",
                  }}
                >
                  <CircleRadio
                    label="Paper 1"
                    checked={activePaper === "P1"}
                    onClick={() => setActivePaper("P1")}
                    theme={theme}
                    fontSize={UI_TYPO.sizeMeta}
                  />
                  <CircleRadio
                    label="Paper 2"
                    checked={activePaper === "P2"}
                    onClick={() => setActivePaper("P2")}
                    theme={theme}
                    fontSize={UI_TYPO.sizeMeta}
                  />
                </div>
              </div>
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
              targetMarks={targetMarks}
              selectionFilters={selectionFilters}
              activePaper={activePaper}
              getConceptIndex={getConceptIndex}
              setConceptIndex={setConceptIndex}
              getDifficulty={getDifficulty}
              setDifficulty={setDifficulty}
              onAddQuestion={(cat, skill, concept, diff) =>
                addQuestionToPaper(cat, skill, concept, diff, activePaper)
              }
              onRegenerateQuestion={(cat, skill, concept, diff) =>
                regenerateQuestionToPaper(cat, skill, concept, diff, activePaper)
              }
              theme={theme}
            />
          );
        })}
      </div>
    </section>
  );
}