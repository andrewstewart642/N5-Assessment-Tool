"use client";

import Link from "next/link";
import { use, useMemo, useState } from "react";
import { getAllCoverageSkills } from "../components/coverage/CoverageHelpers";
import { UseClasses } from "../state/UseClasses";
import CoverageTree from "../components/coverage/CoverageTree";
import CoverageDetails from "../components/coverage/CoverageDetails";

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
        background: "#0b0f14",
        color: "#e5eef8",
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
          scrollbar-color: rgba(140, 160, 180, 0.5) transparent;
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
          background: rgba(140, 160, 180, 0.45);
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
              color: "rgba(229,238,248,0.76)",
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
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 22,
              padding: 22,
              background: "rgba(255,255,255,0.03)",
              color: "rgba(229,238,248,0.72)",
              fontSize: 15,
              lineHeight: 1.45,
            }}
          >
            Loading class...
          </div>
        ) : !schoolClass ? (
          <div
            style={{
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 22,
              padding: 22,
              background: "rgba(255,255,255,0.03)",
              display: "grid",
              gap: 10,
            }}
          >
            <div
              style={{
                fontSize: 28,
                fontWeight: 700,
                lineHeight: 1.1,
                color: "#e5eef8",
              }}
            >
              Class not found
            </div>

            <div
              style={{
                fontSize: 15,
                lineHeight: 1.45,
                color: "rgba(229,238,248,0.72)",
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
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 22,
                padding: "18px 24px",
                background: "rgba(255,255,255,0.03)",
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
                      color: "#e5eef8",
                    }}
                  >
                    {schoolClass.name}
                  </div>

                  <div
                    style={{
                      fontSize: 15,
                      lineHeight: 1.3,
                      color: "rgba(229,238,248,0.82)",
                    }}
                  >
                    {schoolClass.course}
                  </div>

                  <div
                    style={{
                      fontSize: 14,
                      lineHeight: 1.35,
                      color: "rgba(229,238,248,0.62)",
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
                      border: "1px solid rgba(255,255,255,0.08)",
                      background: "rgba(255,255,255,0.05)",
                      boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.02)",
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
                        background: "rgba(74,222,128,0.22)",
                        boxShadow: "0 0 18px rgba(74,222,128,0.14)",
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
                        color: "#e5eef8",
                        textShadow: "0 1px 0 rgba(0,0,0,0.22)",
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
                      color: "rgba(229,238,248,0.52)",
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
              />

              <div
                style={{
                  background: "rgba(255,255,255,0.08)",
                  borderRadius: 999,
                  margin: "6px 10px",
                }}
              />

              <CoverageDetails selectedSkillId={selectedSkillId} />
            </section>

            <section
              style={{
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 22,
                padding: 24,
                background: "rgba(255,255,255,0.03)",
                display: "grid",
                gap: 10,
              }}
            >
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  lineHeight: 1.15,
                  color: "#e5eef8",
                }}
              >
                Class Actions
              </div>

              <div
                style={{
                  fontSize: 14,
                  lineHeight: 1.45,
                  color: "rgba(229,238,248,0.62)",
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