"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import type { SavedAssessment } from "./types/SavedAssessment";
import {
  deleteSavedAssessment,
  loadSavedAssessments,
  saveSavedAssessments,
  setCurrentSavedAssessmentId,
  upsertSavedAssessment,
} from "./state/SavedAssessmentsStorage";
import { ASSESSMENT_LEVEL_OPTIONS } from "@/app/create-assessment/setup/AssessmentClassCoverageStorage";
import { useSettings } from "@/app/settings-bar/GlobalSettingsContext";

function formatDateTime(timestamp: number): string {
  const date = new Date(timestamp);

  const timeText = date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const dateText = date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return `${timeText} ${dateText}`;
}

function getLevelLabel(savedAssessment: SavedAssessment): string {
  const match = ASSESSMENT_LEVEL_OPTIONS.find(
    (option) => option.id === savedAssessment.setup.levelId
  );

  return match?.label ?? "Unknown level";
}

function getCoverageLabel(savedAssessment: SavedAssessment): string {
  if (savedAssessment.setup.useCompleteCourseCoverage) {
    return "Full course coverage";
  }

  if (savedAssessment.setup.selectedClassIds.length === 0) {
    return "No classes selected";
  }

  if (savedAssessment.setup.selectedClassIds.length === 1) {
    return "1 class linked";
  }

  return `${savedAssessment.setup.selectedClassIds.length} classes linked`;
}

function getPaperStructureLabel(savedAssessment: SavedAssessment): string {
  if (savedAssessment.setup.paperStructure === "BOTH") {
    return "Paper 1 + Paper 2";
  }

  if (savedAssessment.setup.paperStructure === "P1_ONLY") {
    return "Paper 1 only";
  }

  return "Paper 2 only";
}

function duplicateSavedAssessment(savedAssessment: SavedAssessment): SavedAssessment {
  const now = Date.now();

  return {
    ...savedAssessment,
    id: `assessment-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    isPinned: false,
    createdAt: now,
    updatedAt: now,
    setup: {
      ...savedAssessment.setup,
      assessmentName: `${savedAssessment.setup.assessmentName} (Copy)`,
    },
    builder: {
      ...savedAssessment.builder,
      assessmentName: `${savedAssessment.builder.assessmentName} (Copy)`,
    },
  };
}

function getAssignedMarksForPaper(
  savedAssessment: SavedAssessment,
  paper: "P1" | "P2"
): number {
  return savedAssessment.builder.questions
    .filter((question) => question.paper === paper)
    .reduce((total, question) => total + question.targetMarks, 0);
}

function getTargetMarksForPaper(
  savedAssessment: SavedAssessment,
  paper: "P1" | "P2"
): number {
  return paper === "P1"
    ? savedAssessment.builder.p1Target
    : savedAssessment.builder.p2Target;
}

function getOverallProgressPct(savedAssessment: SavedAssessment): number {
  const assignedP1 = getAssignedMarksForPaper(savedAssessment, "P1");
  const assignedP2 = getAssignedMarksForPaper(savedAssessment, "P2");

  const targetP1 = getTargetMarksForPaper(savedAssessment, "P1");
  const targetP2 = getTargetMarksForPaper(savedAssessment, "P2");

  const totalAssigned = assignedP1 + assignedP2;
  const totalTarget = targetP1 + targetP2;

  if (totalTarget <= 0) return 0;
  return Math.max(0, Math.min(100, (totalAssigned / totalTarget) * 100));
}

function sortSavedAssessmentsForDisplay(
  savedAssessments: SavedAssessment[]
): SavedAssessment[] {
  return [...savedAssessments].sort((a, b) => {
    if (a.isPinned !== b.isPinned) {
      return a.isPinned ? -1 : 1;
    }

    return b.updatedAt - a.updatedAt;
  });
}

function MarksSummary({
  savedAssessment,
  theme,
}: {
  savedAssessment: SavedAssessment;
  theme: ReturnType<typeof useSettings>["theme"];
}) {
  const assignedP1 = getAssignedMarksForPaper(savedAssessment, "P1");
  const assignedP2 = getAssignedMarksForPaper(savedAssessment, "P2");
  const targetP1 = getTargetMarksForPaper(savedAssessment, "P1");
  const targetP2 = getTargetMarksForPaper(savedAssessment, "P2");

  const showP1 = savedAssessment.setup.paperStructure !== "P2_ONLY";
  const showP2 = savedAssessment.setup.paperStructure !== "P1_ONLY";

  return (
    <div
      style={{
        display: "grid",
        gap: 8,
        padding: "12px 14px",
        borderRadius: 14,
        background: theme.bgElevated,
        border: `1px solid ${theme.borderStandard}`,
      }}
    >
      <div
        style={{
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: 0.25,
          textTransform: "uppercase",
          color: theme.textMuted,
        }}
      >
        Marks progress
      </div>

      <div
        style={{
          display: "grid",
          gap: 6,
          fontSize: 15,
          lineHeight: 1.35,
          color: theme.textSecondary,
        }}
      >
        {showP1 ? (
          <div>
            <span style={{ color: theme.textMuted }}>P1:</span> {assignedP1} /{" "}
            {targetP1} marks
          </div>
        ) : null}

        {showP2 ? (
          <div>
            <span style={{ color: theme.textMuted }}>P2:</span> {assignedP2} /{" "}
            {targetP2} marks
          </div>
        ) : null}
      </div>
    </div>
  );
}

function DeleteAssessmentModal({
  savedAssessment,
  onCancel,
  onConfirm,
  theme,
}: {
  savedAssessment: SavedAssessment | null;
  onCancel: () => void;
  onConfirm: () => void;
  theme: ReturnType<typeof useSettings>["theme"];
}) {
  if (!savedAssessment) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: theme.modalOverlay,
        display: "grid",
        placeItems: "center",
        padding: 24,
        zIndex: 1000,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 520,
          border: `1px solid ${theme.borderStandard}`,
          borderRadius: 24,
          background: theme.bgElevated,
          boxShadow: theme.shadowStrong,
          padding: 24,
          display: "grid",
          gap: 18,
        }}
      >
        <div style={{ display: "grid", gap: 10 }}>
          <div
            style={{
              fontSize: 28,
              fontWeight: 700,
              lineHeight: 1.05,
              color: theme.textPrimary,
            }}
          >
            Delete assessment?
          </div>

          <div
            style={{
              fontSize: 15,
              lineHeight: 1.5,
              color: theme.textSecondary,
            }}
          >
            <strong style={{ color: theme.textPrimary }}>
              {savedAssessment.setup.assessmentName || "[Untitled Assessment]"}
            </strong>{" "}
            will be permanently removed.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <button
            type="button"
            onClick={onCancel}
            style={{
              height: 44,
              padding: "0 16px",
              borderRadius: 12,
              border: `1px solid ${theme.borderStandard}`,
              background: theme.controlBg,
              color: theme.textPrimary,
              fontSize: 15,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            style={{
              height: 44,
              padding: "0 16px",
              borderRadius: 12,
              border: "1px solid #dc2626",
              background: "rgba(220,38,38,0.12)",
              color: theme.textPrimary,
              fontSize: 15,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Delete assessment
          </button>
        </div>
      </div>
    </div>
  );
}

function AssessmentPreviewCard({
  savedAssessment,
  onDuplicate,
  onDelete,
  onTogglePinned,
  theme,
}: {
  savedAssessment: SavedAssessment;
  onDuplicate: (savedAssessment: SavedAssessment) => void;
  onDelete: (savedAssessment: SavedAssessment) => void;
  onTogglePinned: (savedAssessment: SavedAssessment) => void;
  theme: ReturnType<typeof useSettings>["theme"];
}) {
  const paperLabel = getPaperStructureLabel(savedAssessment);
  const progressPct = getOverallProgressPct(savedAssessment);

  function handleOpenAssessment() {
    setCurrentSavedAssessmentId(savedAssessment.id);
  }

  return (
    <article
      style={{
        border: `1px solid ${theme.borderStandard}`,
        borderRadius: 22,
        background: theme.bgSurface,
        overflow: "hidden",
        display: "grid",
        gridTemplateRows: "8px auto",
        minHeight: 310,
        transition:
          "transform 160ms ease, background 160ms ease, border-color 160ms ease, box-shadow 160ms ease",
        boxShadow: theme.shadow,
      }}
      onMouseEnter={(event) => {
        event.currentTarget.style.transform = "translateY(-2px) scale(1.008)";
        event.currentTarget.style.background = theme.bgElevated;
        event.currentTarget.style.borderColor = theme.controlSelectedBorder;
        event.currentTarget.style.boxShadow = theme.shadowStrong;
      }}
      onMouseLeave={(event) => {
        event.currentTarget.style.transform = "translateY(0) scale(1)";
        event.currentTarget.style.background = theme.bgSurface;
        event.currentTarget.style.borderColor = theme.borderStandard;
        event.currentTarget.style.boxShadow = theme.shadow;
      }}
    >
      <div
        style={{
          width: `${progressPct}%`,
          background: "#16a34a",
          boxShadow: "0 0 16px rgba(22,163,74,0.28)",
          transition: "width 220ms ease",
          minWidth: progressPct > 0 ? 10 : 0,
        }}
      />

      <div
        style={{
          padding: 18,
          display: "grid",
          gridTemplateColumns: "230px minmax(0, 1fr)",
          gap: 18,
          minHeight: 0,
        }}
      >
        <div
          style={{
            borderRadius: 16,
            border: `1px solid ${theme.borderStandard}`,
            background: theme.bgElevated,
            padding: 16,
            display: "grid",
            alignContent: "start",
            gap: 12,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: 0.4,
              textTransform: "uppercase",
              color: theme.textMuted,
            }}
          >
            Assessment preview
          </div>

          <div
            style={{
              borderRadius: 12,
              background: theme.paper,
              minHeight: 170,
              padding: 14,
              color: "#15202b",
              display: "grid",
              alignContent: "start",
              gap: 10,
              boxShadow: theme.shadow,
            }}
          >
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                textAlign: "center",
                letterSpacing: 0.3,
              }}
            >
              {savedAssessment.setup.assessmentName || "[Untitled file]"}
            </div>

            <div
              style={{
                height: 1,
                background: "rgba(0,0,0,0.12)",
              }}
            />

            <div
              style={{
                fontSize: 11,
                color: "rgba(21,32,43,0.74)",
                lineHeight: 1.45,
                display: "grid",
                gap: 6,
              }}
            >
              <div>{paperLabel}</div>
              <div>{getLevelLabel(savedAssessment)}</div>
            </div>

            <div
              style={{
                marginTop: 6,
                display: "grid",
                gap: 5,
              }}
            >
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  style={{
                    height: 8,
                    borderRadius: 999,
                    background:
                      index === 0 ? "rgba(37,99,235,0.22)" : "rgba(0,0,0,0.08)",
                    width:
                      index === 0
                        ? "82%"
                        : index === 1
                          ? "68%"
                          : index === 2
                            ? "74%"
                            : index === 3
                              ? "61%"
                              : index === 4
                                ? "80%"
                                : "57%",
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        <div
          style={{
            minWidth: 0,
            display: "grid",
            gridTemplateRows: "auto 1fr auto",
            gap: 16,
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr) auto",
              gap: 12,
              alignItems: "start",
            }}
          >
            <div
              style={{
                minWidth: 0,
                display: "grid",
                gap: 8,
              }}
            >
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  lineHeight: 1.05,
                  color: theme.textPrimary,
                  wordBreak: "break-word",
                }}
              >
                {savedAssessment.setup.assessmentName || "[Untitled file]"}
              </div>

              <div
                style={{
                  fontSize: 15,
                  lineHeight: 1.35,
                  color: theme.textSecondary,
                }}
              >
                {getLevelLabel(savedAssessment)} • {getCoverageLabel(savedAssessment)}
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gap: 10,
                justifyItems: "end",
                flexShrink: 0,
              }}
            >
              <button
                type="button"
                onClick={() => onTogglePinned(savedAssessment)}
                aria-label={savedAssessment.isPinned ? "Unpin assessment" : "Pin assessment"}
                title={savedAssessment.isPinned ? "Unpin assessment" : "Pin assessment"}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 999,
                  border: `1px solid ${
                    savedAssessment.isPinned ? "#f59e0b" : theme.borderStandard
                  }`,
                  background: savedAssessment.isPinned
                    ? "rgba(245,158,11,0.12)"
                    : theme.controlBg,
                  color: savedAssessment.isPinned ? "#f59e0b" : theme.textSecondary,
                  fontSize: 16,
                  cursor: "pointer",
                }}
              >
                📌
              </button>

              <div
                style={{
                  borderRadius: 999,
                  padding: "6px 12px",
                  border: `1px solid ${theme.controlSelectedBorder}`,
                  background: theme.controlSelectedBg,
                  color: theme.textPrimary,
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: 0.3,
                }}
              >
                Draft
              </div>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              alignContent: "start",
              gap: 16,
            }}
          >
            <MarksSummary savedAssessment={savedAssessment} theme={theme} />

            <div
              style={{
                display: "grid",
                gap: 8,
                fontSize: 15,
                lineHeight: 1.4,
                color: theme.textSecondary,
              }}
            >
              <div>
                <span style={{ color: theme.textMuted }}>Type:</span>{" "}
                {savedAssessment.setup.assessmentType.replaceAll("_", " ")}
              </div>

              <div>
                <span style={{ color: theme.textMuted }}>Assessment date:</span>{" "}
                {savedAssessment.setup.assessmentDate}
              </div>

              <div>
                <span style={{ color: theme.textMuted }}>Last edited:</span>{" "}
                {formatDateTime(savedAssessment.updatedAt)}
              </div>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gap: 12,
              paddingTop: 12,
              borderTop: `1px solid ${theme.borderStandard}`,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                flexWrap: "wrap",
              }}
            >
              <Link
                href="/create-assessment/builder"
                onClick={handleOpenAssessment}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: 42,
                  padding: "0 16px",
                  borderRadius: 12,
                  textDecoration: "none",
                  background: theme.controlSelectedBg,
                  border: `1px solid ${theme.controlSelectedBorder}`,
                  color: theme.textPrimary,
                  fontSize: 15,
                  fontWeight: 700,
                }}
              >
                Open assessment
              </Link>

              <button
                type="button"
                onClick={() => onDuplicate(savedAssessment)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  height: 42,
                  padding: "0 14px",
                  borderRadius: 12,
                  border: `1px solid ${theme.borderStandard}`,
                  background: theme.controlBg,
                  color: theme.textPrimary,
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                ⧉ Duplicate
              </button>

              <button
                type="button"
                onClick={() => onDelete(savedAssessment)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  height: 42,
                  padding: "0 14px",
                  borderRadius: 12,
                  border: `1px solid ${theme.borderStandard}`,
                  background: theme.controlBg,
                  color: theme.textSecondary,
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
                aria-label={`Delete ${savedAssessment.setup.assessmentName}`}
                title="Delete assessment"
              >
                🗑 Delete
              </button>
            </div>

            <div
              style={{
                fontSize: 12,
                lineHeight: 1.3,
                color: theme.textMuted,
              }}
            >
              Created on {formatDateTime(savedAssessment.createdAt)}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function MyAssessmentsPage() {
  const { theme } = useSettings();
  const [savedAssessments, setSavedAssessments] = useState<SavedAssessment[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [assessmentPendingDelete, setAssessmentPendingDelete] =
    useState<SavedAssessment | null>(null);

  useEffect(() => {
    const loaded = loadSavedAssessments().map((assessment) => ({
      ...assessment,
      isPinned: Boolean(assessment.isPinned),
    }));

    saveSavedAssessments(loaded);
    setSavedAssessments(sortSavedAssessmentsForDisplay(loaded));
    setHasLoaded(true);
  }, []);

  const assessmentCountText = useMemo(() => {
    if (savedAssessments.length === 1) {
      return "You have 1 assessment";
    }

    return `You have ${savedAssessments.length} assessments`;
  }, [savedAssessments.length]);

  function refreshSavedAssessments() {
    const loaded = loadSavedAssessments().map((assessment) => ({
      ...assessment,
      isPinned: Boolean(assessment.isPinned),
    }));

    saveSavedAssessments(loaded);
    setSavedAssessments(sortSavedAssessmentsForDisplay(loaded));
  }

  function handleDuplicate(savedAssessment: SavedAssessment) {
    const duplicatedAssessment = duplicateSavedAssessment(savedAssessment);
    upsertSavedAssessment(duplicatedAssessment);
    refreshSavedAssessments();
  }

  function handleRequestDelete(savedAssessment: SavedAssessment) {
    setAssessmentPendingDelete(savedAssessment);
  }

  function handleCancelDelete() {
    setAssessmentPendingDelete(null);
  }

  function handleConfirmDelete() {
    if (!assessmentPendingDelete) return;

    deleteSavedAssessment(assessmentPendingDelete.id);
    setAssessmentPendingDelete(null);
    refreshSavedAssessments();
  }

  function handleTogglePinned(savedAssessment: SavedAssessment) {
    const updatedAssessment: SavedAssessment = {
      ...savedAssessment,
      isPinned: !savedAssessment.isPinned,
      updatedAt: Date.now(),
    };

    upsertSavedAssessment(updatedAssessment);
    refreshSavedAssessments();
  }

  return (
    <>
      <main
        style={{
          minHeight: "100%",
          background: theme.bgPage,
          color: theme.textPrimary,
          padding: 24,
          boxSizing: "border-box",
          fontFamily: "var(--app-ui-font-family)",
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            display: "grid",
            gap: 22,
          }}
        >
          <section
            style={{
              display: "flex",
              alignItems: "start",
              justifyContent: "space-between",
              gap: 18,
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "grid", gap: 8 }}>
              <h1
                style={{
                  margin: 0,
                  fontSize: 40,
                  lineHeight: 1.05,
                  fontWeight: 700,
                  color: theme.textPrimary,
                }}
              >
                My Assessments
              </h1>

              <div
                style={{
                  fontSize: 16,
                  lineHeight: 1.4,
                  color: theme.textSecondary,
                }}
              >
                {hasLoaded ? assessmentCountText : "Loading assessments..."}
              </div>
            </div>

            <Link
              href="/create-assessment"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                minWidth: 190,
                height: 50,
                padding: "0 18px",
                borderRadius: 14,
                textDecoration: "none",
                background: theme.controlSelectedBg,
                border: `1px solid ${theme.controlSelectedBorder}`,
                color: theme.textPrimary,
                fontSize: 16,
                fontWeight: 700,
                boxShadow: theme.shadow,
              }}
            >
              + Create New Assessment
            </Link>
          </section>

          {!hasLoaded ? (
            <section
              style={{
                border: `1px solid ${theme.borderStandard}`,
                borderRadius: 22,
                padding: 24,
                background: theme.bgSurface,
                fontSize: 15,
                color: theme.textSecondary,
              }}
            >
              Loading saved assessments...
            </section>
          ) : savedAssessments.length === 0 ? (
            <section
              style={{
                border: `1px solid ${theme.borderStandard}`,
                borderRadius: 22,
                padding: 28,
                background: theme.bgSurface,
                display: "grid",
                gap: 12,
              }}
            >
              <div
                style={{
                  fontSize: 26,
                  fontWeight: 700,
                  lineHeight: 1.1,
                  color: theme.textPrimary,
                }}
              >
                No assessments yet
              </div>

              <div
                style={{
                  fontSize: 15,
                  lineHeight: 1.5,
                  color: theme.textSecondary,
                  maxWidth: 760,
                }}
              >
                Start a new assessment and it will appear here automatically as a
                saved draft the moment you continue into the builder.
              </div>
            </section>
          ) : (
            <section
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: 18,
                alignItems: "start",
              }}
            >
              {savedAssessments.map((savedAssessment) => (
                <AssessmentPreviewCard
                  key={savedAssessment.id}
                  savedAssessment={savedAssessment}
                  onDuplicate={handleDuplicate}
                  onDelete={handleRequestDelete}
                  onTogglePinned={handleTogglePinned}
                  theme={theme}
                />
              ))}
            </section>
          )}
        </div>
      </main>

      <DeleteAssessmentModal
        savedAssessment={assessmentPendingDelete}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        theme={theme}
      />
    </>
  );
}