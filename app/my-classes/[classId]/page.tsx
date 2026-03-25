"use client";

import Link from "next/link";
import { use, useEffect, useMemo, useState } from "react";
import { getAllCoverageSkills } from "../components/coverage/CoverageHelpers";
import { UseClasses } from "../state/UseClasses";
import CoverageTree from "../components/coverage/CoverageTree";
import CoverageDetails from "../components/coverage/CoverageDetails";
import { getTheme } from "@/ui/AppTheme";
import {
  getSystemPrefersDark,
  isThemeModePreference,
  resolveThemeMode,
  THEME_MODE_STORAGE_KEY,
  type ResolvedThemeMode,
  type ThemeModePreference,
} from "@/ui/ThemeMode";

type Props = {
  params: Promise<{
    classId: string;
  }>;
};

function formatLastUpdated(timestamp: number): string {
  const date = new Date(timestamp);

  const dateText = date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const timeText = date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${dateText} at ${timeText}`;
}

export default function ClassPage({ params }: Props) {
  const [resolvedMode, setResolvedMode] = useState<ResolvedThemeMode>("dark");

  useEffect(() => {
    function readResolvedMode(): ResolvedThemeMode {
      if (typeof window === "undefined") return "dark";

      const stored = window.localStorage.getItem(THEME_MODE_STORAGE_KEY);
      const preference: ThemeModePreference = isThemeModePreference(stored)
        ? stored
        : "system";

      return resolveThemeMode(preference, getSystemPrefersDark());
    }

    setResolvedMode(readResolvedMode());

    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    function handleChange() {
      setResolvedMode(readResolvedMode());
    }

    window.addEventListener("storage", handleChange);
    mediaQuery.addEventListener("change", handleChange);

    return () => {
      window.removeEventListener("storage", handleChange);
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  const theme = getTheme(resolvedMode);

  const { hasLoaded, getClassById, updateCompletedSkills } = UseClasses();
  const { classId } = use(params);

  const schoolClass = getClassById(classId);
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);

  const totalSkills = useMemo(() => getAllCoverageSkills().length, []);
  const completedCount = schoolClass?.completedSkillIds.length ?? 0;
  const progressPct = totalSkills > 0 ? (completedCount / totalSkills) * 100 : 0;

  function handleToggleSkill(skillId: string) {
    if (!schoolClass) return;

    const isAlreadyCompleted = schoolClass.completedSkillIds.includes(skillId);

    const nextCompletedSkillIds = isAlreadyCompleted
      ? schoolClass.completedSkillIds.filter((id) => id !== skillId)
      : [...schoolClass.completedSkillIds, skillId];

    updateCompletedSkills({
      classId: schoolClass.id,
      completedSkillIds: nextCompletedSkillIds,
    });
  }

  return (
    <main
      style={{
        minHeight: "100%",
        background: theme.bgPrimary,
        color: theme.textPrimary,
        padding: 24,
        boxSizing: "border-box",
        fontFamily: "var(--app-ui-font-family)",
      }}
    >
      <style jsx global>{`
        .coverage-scroll {
          scrollbar-width: thin;
          scrollbar-color: transparent transparent;
        }

        .coverage-scroll:hover {
          scrollbar-color: ${theme.scrollbarThumb} transparent;
        }

        .coverage-scroll::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        .coverage-scroll::-webkit-scrollbar-track {
          background: transparent;
        }

        .coverage-scroll::-webkit-scrollbar-thumb {
          background: transparent;
          border-radius: 999px;
        }

        .coverage-scroll:hover::-webkit-scrollbar-thumb {
          background: ${theme.scrollbarThumb};
        }
      `}</style>

      <div
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          display: "grid",
          gap: 18,
        }}
      >
        <div>
          <Link
            href="/my-classes"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              textDecoration: "none",
              color: theme.textSecondary,
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            ← Back to My Classes
          </Link>
        </div>

        {!hasLoaded ? (
          <div
            style={{
              border: `1px solid ${theme.borderSubtle}`,
              borderRadius: 22,
              padding: 22,
              background: theme.cardBg,
              color: theme.textSecondary,
              fontSize: 15,
              lineHeight: 1.45,
            }}
          >
            Loading class...
          </div>
        ) : !schoolClass ? (
          <div
            style={{
              border: `1px solid ${theme.borderSubtle}`,
              borderRadius: 22,
              padding: 22,
              background: theme.cardBg,
              display: "grid",
              gap: 10,
            }}
          >
            <div
              style={{
                fontSize: 28,
                fontWeight: 700,
                lineHeight: 1.1,
                color: theme.textPrimary,
              }}
            >
              Class not found
            </div>

            <div
              style={{
                fontSize: 15,
                lineHeight: 1.45,
                color: theme.textSecondary,
              }}
            >
              This class could not be found. It may have been removed or not
              saved properly.
            </div>
          </div>
        ) : (
          <>
            <section
              style={{
                border: `1px solid ${theme.borderSubtle}`,
                borderRadius: 22,
                padding: "18px 24px",
                background: theme.cardBg,
                minHeight: 126,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "stretch",
                  justifyContent: "space-between",
                  gap: 18,
                  flexWrap: "wrap",
                }}
              >
                <div
                  style={{
                    display: "grid",
                    alignContent: "start",
                    gap: 12,
                    minHeight: 88,
                  }}
                >
                  <div
                    style={{
                      fontSize: 40,
                      fontWeight: 700,
                      lineHeight: 1,
                      color: theme.textPrimary,
                    }}
                  >
                    {schoolClass.name}
                  </div>

                  <div
                    style={{
                      fontSize: 15,
                      lineHeight: 1.3,
                      color: theme.textSecondary,
                    }}
                  >
                    {schoolClass.course}
                  </div>

                  <div
                    style={{
                      fontSize: 14,
                      lineHeight: 1.35,
                      color: theme.textMuted,
                    }}
                  >
                    {[schoolClass.level, schoolClass.teacher]
                      .filter(Boolean)
                      .join(" • ") || "No extra details yet"}
                  </div>
                </div>

                <div
                  style={{
                    minWidth: 300,
                    display: "grid",
                    justifyItems: "end",
                    alignContent: "center",
                    gap: 10,
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      width: 300,
                      maxWidth: "100%",
                      height: 42,
                      borderRadius: 999,
                      overflow: "hidden",
                      border: `1px solid ${theme.borderSubtle}`,
                      background: theme.controlBg,
                      boxShadow: `inset 0 0 0 1px ${theme.borderSubtle}`,
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        bottom: 0,
                        width: `${progressPct}%`,
                        borderRadius: 999,
                        background: `${theme.success}33`,
                        boxShadow: `0 0 18px ${theme.success}22`,
                        transition: "width 220ms ease",
                      }}
                    />

                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        display: "grid",
                        placeItems: "center",
                        fontSize: 15,
                        fontWeight: 700,
                        lineHeight: 1.2,
                        color: theme.textPrimary,
                        textShadow:
                          resolvedMode === "dark"
                            ? "0 1px 0 rgba(0,0,0,0.22)"
                            : "none",
                        whiteSpace: "nowrap",
                        pointerEvents: "none",
                      }}
                    >
                      {completedCount} / {totalSkills} skills covered
                    </div>
                  </div>

                  <div
                    style={{
                      fontSize: 12,
                      lineHeight: 1.25,
                      color: theme.textMuted,
                      textAlign: "right",
                    }}
                  >
                    Last updated {formatLastUpdated(schoolClass.updatedAt)}
                  </div>
                </div>
              </div>
            </section>

            <section
              style={{
                display: "grid",
                gridTemplateColumns:
                  "minmax(0, 1fr) 1px minmax(380px, 0.78fr)",
                gap: 0,
                alignItems: "stretch",
              }}
            >
              <CoverageTree
                selectedSkillId={selectedSkillId}
                onSelectSkillId={setSelectedSkillId}
                completedSkillIds={schoolClass.completedSkillIds}
                onToggleSkillId={handleToggleSkill}
                theme={theme}
              />

              <div
                style={{
                  background: theme.divider,
                  borderRadius: 999,
                  margin: "6px 10px",
                }}
              />

              <CoverageDetails selectedSkillId={selectedSkillId} theme={theme} />
            </section>

            <section
              style={{
                border: `1px solid ${theme.borderSubtle}`,
                borderRadius: 22,
                padding: 24,
                background: theme.cardBg,
                display: "grid",
                gap: 10,
              }}
            >
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  lineHeight: 1.15,
                  color: theme.textPrimary,
                }}
              >
                Class Actions
              </div>

              <div
                style={{
                  fontSize: 14,
                  lineHeight: 1.45,
                  color: theme.textMuted,
                }}
              >
                Safer class actions like delete can live here later, rather than
                on the overview page.
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}