import Link from "next/link";

import type {
  SavedAssessment,
} from "@/src/Assessments/SavedAssessments/SavedAssessment";

import {
  setCurrentSavedAssessmentId,
} from "@/src/Assessments/SavedAssessments/SavedAssessmentsStorage";

import { useSettings } from "@/app/settings-bar/GlobalSettingsContext";

import {
  formatDateTime,
  getAssignedMarksForPaper,
  getCoverageLabel,
  getLevelLabel,
  getOverallProgressPct,
  getPaperStructureLabel,
  getTargetMarksForPaper,
} from "../MyAssessmentsDisplay";

type AppTheme =
  ReturnType<typeof useSettings>["theme"];

type AssessmentPreviewCardProps = {
  savedAssessment: SavedAssessment;
  onDuplicate: (
    savedAssessment: SavedAssessment
  ) => void;
  onDelete: (
    savedAssessment: SavedAssessment
  ) => void;
  onTogglePinned: (
    savedAssessment: SavedAssessment
  ) => void;
  theme: AppTheme;
};

function MarksSummary({
  savedAssessment,
  theme,
}: {
  savedAssessment: SavedAssessment;
  theme: AppTheme;
}) {
  const assignedP1 =
    getAssignedMarksForPaper(
      savedAssessment,
      "P1"
    );

  const assignedP2 =
    getAssignedMarksForPaper(
      savedAssessment,
      "P2"
    );

  const targetP1 =
    getTargetMarksForPaper(
      savedAssessment,
      "P1"
    );

  const targetP2 =
    getTargetMarksForPaper(
      savedAssessment,
      "P2"
    );

  const showP1 =
    savedAssessment.setup.paperStructure !==
    "P2_ONLY";

  const showP2 =
    savedAssessment.setup.paperStructure !==
    "P1_ONLY";

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
            <span
              style={{
                color: theme.textMuted,
              }}
            >
              P1:
            </span>{" "}
            {assignedP1} / {targetP1} marks
          </div>
        ) : null}

        {showP2 ? (
          <div>
            <span
              style={{
                color: theme.textMuted,
              }}
            >
              P2:
            </span>{" "}
            {assignedP2} / {targetP2} marks
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function AssessmentPreviewCard({
  savedAssessment,
  onDuplicate,
  onDelete,
  onTogglePinned,
  theme,
}: AssessmentPreviewCardProps) {
  const paperLabel =
    getPaperStructureLabel(savedAssessment);

  const progressPct =
    getOverallProgressPct(savedAssessment);

  function handleOpenAssessment() {
    setCurrentSavedAssessmentId(
      savedAssessment.id
    );
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
        event.currentTarget.style.transform =
          "translateY(-2px) scale(1.008)";
        event.currentTarget.style.background =
          theme.bgElevated;
        event.currentTarget.style.borderColor =
          theme.controlSelectedBorder;
        event.currentTarget.style.boxShadow =
          theme.shadowStrong;
      }}
      onMouseLeave={(event) => {
        event.currentTarget.style.transform =
          "translateY(0) scale(1)";
        event.currentTarget.style.background =
          theme.bgSurface;
        event.currentTarget.style.borderColor =
          theme.borderStandard;
        event.currentTarget.style.boxShadow =
          theme.shadow;
      }}
    >
      <div
        style={{
          width: `${progressPct}%`,
          background: "#16a34a",
          boxShadow:
            "0 0 16px rgba(22,163,74,0.28)",
          transition: "width 220ms ease",
          minWidth:
            progressPct > 0 ? 10 : 0,
        }}
      />

      <div
        style={{
          padding: 18,
          display: "grid",
          gridTemplateColumns:
            "230px minmax(0, 1fr)",
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
              {savedAssessment.setup
                .assessmentName ||
                "[Untitled file]"}
            </div>

            <div
              style={{
                height: 1,
                background:
                  "rgba(0,0,0,0.12)",
              }}
            />

            <div
              style={{
                fontSize: 11,
                color:
                  "rgba(21,32,43,0.74)",
                lineHeight: 1.45,
                display: "grid",
                gap: 6,
              }}
            >
              <div>{paperLabel}</div>
              <div>
                {getLevelLabel(
                  savedAssessment
                )}
              </div>
            </div>

            <div
              style={{
                marginTop: 6,
                display: "grid",
                gap: 5,
              }}
            >
              {Array.from({
                length: 6,
              }).map((_, index) => (
                <div
                  key={index}
                  style={{
                    height: 8,
                    borderRadius: 999,
                    background:
                      index === 0
                        ? "rgba(37,99,235,0.22)"
                        : "rgba(0,0,0,0.08)",
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
            gridTemplateRows:
              "auto 1fr auto",
            gap: 16,
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "minmax(0, 1fr) auto",
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
                  color:
                    theme.textPrimary,
                  wordBreak: "break-word",
                }}
              >
                {savedAssessment.setup
                  .assessmentName ||
                  "[Untitled file]"}
              </div>

              <div
                style={{
                  fontSize: 15,
                  lineHeight: 1.35,
                  color:
                    theme.textSecondary,
                }}
              >
                {getLevelLabel(
                  savedAssessment
                )}{" "}
                •{" "}
                {getCoverageLabel(
                  savedAssessment
                )}
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
                onClick={() =>
                  onTogglePinned(
                    savedAssessment
                  )
                }
                aria-label={
                  savedAssessment.isPinned
                    ? "Unpin assessment"
                    : "Pin assessment"
                }
                title={
                  savedAssessment.isPinned
                    ? "Unpin assessment"
                    : "Pin assessment"
                }
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 999,
                  border: `1px solid ${
                    savedAssessment.isPinned
                      ? "#f59e0b"
                      : theme.borderStandard
                  }`,
                  background:
                    savedAssessment.isPinned
                      ? "rgba(245,158,11,0.12)"
                      : theme.controlBg,
                  color:
                    savedAssessment.isPinned
                      ? "#f59e0b"
                      : theme.textSecondary,
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
                  background:
                    theme.controlSelectedBg,
                  color:
                    theme.textPrimary,
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
            <MarksSummary
              savedAssessment={
                savedAssessment
              }
              theme={theme}
            />

            <div
              style={{
                display: "grid",
                gap: 8,
                fontSize: 15,
                lineHeight: 1.4,
                color:
                  theme.textSecondary,
              }}
            >
              <div>
                <span
                  style={{
                    color:
                      theme.textMuted,
                  }}
                >
                  Type:
                </span>{" "}
                {savedAssessment.setup.assessmentType.replaceAll(
                  "_",
                  " "
                )}
              </div>

              <div>
                <span
                  style={{
                    color:
                      theme.textMuted,
                  }}
                >
                  Assessment date:
                </span>{" "}
                {
                  savedAssessment.setup
                    .assessmentDate
                }
              </div>

              <div>
                <span
                  style={{
                    color:
                      theme.textMuted,
                  }}
                >
                  Last edited:
                </span>{" "}
                {formatDateTime(
                  savedAssessment.updatedAt
                )}
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
                onClick={
                  handleOpenAssessment
                }
                style={{
                  display:
                    "inline-flex",
                  alignItems: "center",
                  justifyContent:
                    "center",
                  height: 42,
                  padding: "0 16px",
                  borderRadius: 12,
                  textDecoration: "none",
                  background:
                    theme.controlSelectedBg,
                  border: `1px solid ${theme.controlSelectedBorder}`,
                  color:
                    theme.textPrimary,
                  fontSize: 15,
                  fontWeight: 700,
                }}
              >
                Open assessment
              </Link>

              <button
                type="button"
                onClick={() =>
                  onDuplicate(
                    savedAssessment
                  )
                }
                style={{
                  display:
                    "inline-flex",
                  alignItems: "center",
                  justifyContent:
                    "center",
                  gap: 8,
                  height: 42,
                  padding: "0 14px",
                  borderRadius: 12,
                  border: `1px solid ${theme.borderStandard}`,
                  background:
                    theme.controlBg,
                  color:
                    theme.textPrimary,
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                ⧉ Duplicate
              </button>

              <button
                type="button"
                onClick={() =>
                  onDelete(
                    savedAssessment
                  )
                }
                style={{
                  display:
                    "inline-flex",
                  alignItems: "center",
                  justifyContent:
                    "center",
                  gap: 8,
                  height: 42,
                  padding: "0 14px",
                  borderRadius: 12,
                  border: `1px solid ${theme.borderStandard}`,
                  background:
                    theme.controlBg,
                  color:
                    theme.textSecondary,
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
              Created on{" "}
              {formatDateTime(
                savedAssessment.createdAt
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}