"use client";

import { useMemo, useState } from "react";
import { skillsData } from "@/course-data/N5-Skills";
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
};

function getCategoryAccent(categoryName: string): string {
  const name = categoryName.toLowerCase();

  if (name.includes("numerical")) return "rgba(96,165,250,0.92)";
  if (name.includes("algebra")) return "rgba(196,181,253,0.92)";
  if (name.includes("geometric")) return "rgba(74,222,128,0.92)";
  if (name.includes("trigon")) return "rgba(250,204,21,0.92)";
  if (name.includes("stat")) return "rgba(244,114,182,0.92)";

  return "rgba(148,163,184,0.92)";
}

export default function CoverageTree({
  selectedSkillId,
  onSelectSkillId,
  completedSkillIds,
  onToggleSkillId,
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
        const accent = getCategoryAccent(categoryName);
        const categoryCompletedCount = categorySkills.filter((skill) =>
          completedSkillIds.includes(skill.id)
        ).length;

        return (
          <section
            key={categoryName}
            style={{
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 18,
              background: "rgba(255,255,255,0.03)",
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
                    color: "#e5eef8",
                  }}
                >
                  {isCollapsed ? "▸" : "▾"} {categoryName}
                </div>

                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    lineHeight: 1.2,
                    color: "rgba(229,238,248,0.82)",
                  }}
                >
                  {categoryCompletedCount} / {categorySkills.length}
                </div>
              </div>
            </button>

            {!isCollapsed ? (
              <div
                style={{
                  borderTop: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                {categorySkills.map((skill) => {
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
                      onClick={() =>
                        onSelectSkillId(isSelected ? null : skill.id)
                      }
                      style={{
                        width: "100%",
                        border: "none",
                        borderTop: "1px solid rgba(255,255,255,0.05)",
                        background: isCompleted
                          ? isSelected
                            ? "rgba(74,222,128,0.18)"
                            : "rgba(74,222,128,0.11)"
                          : isSelected
                          ? "rgba(255,255,255,0.08)"
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
                              accentColor: "#60a5fa",
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
                                  color: isCompleted
                                    ? "rgba(220,252,231,0.92)"
                                    : "rgba(229,238,248,0.78)",
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
                                  ? "rgba(220,252,231,0.96)"
                                  : isSelected
                                  ? "#f4f8fc"
                                  : "rgba(229,238,248,0.90)",
                              }}
                            >
                              {skillTitle}
                            </div>
                          </div>

                          <div
                            style={{
                              fontSize: 13,
                              lineHeight: 1.4,
                              color: isCompleted
                                ? "rgba(220,252,231,0.74)"
                                : "rgba(229,238,248,0.56)",
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
                            color: "rgba(229,238,248,0.56)",
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