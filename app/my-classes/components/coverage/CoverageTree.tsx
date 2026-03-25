"use client";

import { useMemo, useState } from "react";
import { skillsData } from "@/course-data/N5-Skills";
import type { AppTheme } from "@/ui/AppTheme";
import {
  getCoverageSkillById,
  getSkillCode,
  getSkillConceptSummary,
  getSkillTitle,
  type SkillLike,
} from "./CoverageHelpers";

type Props = {
  selectedSkillId: string | null;
  onSelectSkillId: (skillId: string | null) => void;
  completedSkillIds: string[];
  onToggleSkillId: (skillId: string) => void;
  theme: AppTheme;
};

function getCategoryAccent(categoryName: string, theme: AppTheme): string {
  const name = categoryName.toLowerCase();

  if (name.includes("numerical")) return theme.skillNumerical;
  if (name.includes("algebra")) return theme.skillAlgebraic;
  if (name.includes("geometric")) return theme.skillGeometric;
  if (name.includes("trigon")) return theme.skillTrigonometric;
  if (name.includes("stat")) return theme.skillStatistical;

  return theme.textMuted;
}

export default function CoverageTree({
  selectedSkillId,
  onSelectSkillId,
  completedSkillIds,
  onToggleSkillId,
  theme,
}: Props) {
  const categoryEntries = useMemo(() => {
    return Object.entries(skillsData) as Array<[string, SkillLike[]]>;
  }, []);

  const [collapsedByCategory, setCollapsedByCategory] = useState<Record<string, boolean>>({});

  function toggleCategory(categoryName: string) {
    const isCurrentlyCollapsed = collapsedByCategory[categoryName] ?? false;
    const nextCollapsed = !isCurrentlyCollapsed;

    if (nextCollapsed && selectedSkillId) {
      const selectedEntry = getCoverageSkillById(selectedSkillId);
      if (selectedEntry?.categoryName === categoryName) {
        onSelectSkillId(null);
      }
    }

    setCollapsedByCategory((current) => ({
      ...current,
      [categoryName]: nextCollapsed,
    }));
  }

  return (
    <div
      style={{
        display: "grid",
        gap: 14,
        minHeight: 0,
      }}
    >
      {categoryEntries.map(([categoryName, categorySkills]) => {
        const isCollapsed = collapsedByCategory[categoryName] ?? false;
        const accent = getCategoryAccent(categoryName, theme);
        const categoryCompletedCount = categorySkills.filter((skill) =>
          completedSkillIds.includes(skill.id)
        ).length;

        return (
          <section
            key={categoryName}
            style={{
              border: `1px solid ${theme.borderSubtle}`,
              borderRadius: 18,
              background: theme.cardBg,
              overflow: "hidden",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 4,
                background: accent,
              }}
            />

            <button
              type="button"
              onClick={() => toggleCategory(categoryName)}
              style={{
                width: "100%",
                minHeight: 68,
                border: "none",
                background: "transparent",
                cursor: "pointer",
                padding: "14px 18px 12px 18px",
                textAlign: "left",
                boxSizing: "border-box",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(0, 1fr) auto",
                  alignItems: "center",
                  gap: 14,
                }}
              >
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    lineHeight: 1.2,
                    color: theme.textPrimary,
                  }}
                >
                  {isCollapsed ? "▸" : "▾"} {categoryName}
                </div>

                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    lineHeight: 1.2,
                    color: theme.textSecondary,
                  }}
                >
                  {categoryCompletedCount} / {categorySkills.length}
                </div>
              </div>
            </button>

            {!isCollapsed ? (
              <div
                style={{
                  borderTop: `1px solid ${theme.borderSubtle}`,
                }}
              >
                {categorySkills.map((skill, index) => {
                  const isSelected = selectedSkillId === skill.id;
                  const isCompleted = completedSkillIds.includes(skill.id);
                  const skillCode = getSkillCode(skill);
                  const skillTitle = getSkillTitle(skill);
                  const tooltipSummary = getSkillConceptSummary(skill);

                  return (
                    <button
                      key={skill.id}
                      type="button"
                      title={tooltipSummary}
                      onClick={() => onSelectSkillId(isSelected ? null : skill.id)}
                      style={{
                        width: "100%",
                        border: "none",
                        borderTop:
                          index === 0 ? "none" : `1px solid ${theme.borderSubtle}`,
                        background: isCompleted
                          ? isSelected
                            ? `${theme.success}2e`
                            : `${theme.success}1c`
                          : isSelected
                            ? theme.controlBgHover
                            : "transparent",
                        padding: "0 18px",
                        textAlign: "left",
                        cursor: "pointer",
                        transition:
                          "background 140ms ease, box-shadow 140ms ease, transform 140ms ease",
                      }}
                    >
                      <div
                        style={{
                          minHeight: 78,
                          display: "grid",
                          gridTemplateColumns: "34px minmax(0, 1fr) auto",
                          gap: 14,
                          alignItems: "center",
                        }}
                      >
                        <div
                          onClick={(event) => event.stopPropagation()}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            height: "100%",
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={isCompleted}
                            onChange={() => onToggleSkillId(skill.id)}
                            style={{
                              width: 20,
                              height: 20,
                              cursor: "pointer",
                              accentColor: accent,
                            }}
                          />
                        </div>

                        <div style={{ display: "grid", gap: 6, minWidth: 0 }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "baseline",
                              gap: 12,
                              flexWrap: "wrap",
                            }}
                          >
                            {skillCode ? (
                              <div
                                style={{
                                  minWidth: 32,
                                  fontSize: 14,
                                  fontWeight: 700,
                                  lineHeight: 1.2,
                                  color: isCompleted ? theme.success : theme.textSecondary,
                                }}
                              >
                                {skillCode}
                              </div>
                            ) : null}

                            <div
                              style={{
                                fontSize: 15,
                                fontWeight: 600,
                                lineHeight: 1.35,
                                color: isCompleted
                                  ? theme.textPrimary
                                  : isSelected
                                    ? theme.textPrimary
                                    : theme.textPrimary,
                              }}
                            >
                              {skillTitle}
                            </div>
                          </div>

                          <div
                            style={{
                              fontSize: 13,
                              lineHeight: 1.4,
                              color: isCompleted ? theme.textSecondary : theme.textMuted,
                            }}
                          >
                            {isCompleted ? "Completed" : "Not completed yet"}
                          </div>
                        </div>

                        <div
                          style={{
                            fontSize: 14,
                            fontWeight: 700,
                            lineHeight: 1,
                            color: theme.textMuted,
                          }}
                        >
                          ▸
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : null}
          </section>
        );
      })}
    </div>
  );
}