"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import type { SavedAssessment } from "./types/SavedAssessment";
import {
  loadSavedAssessments,
  setCurrentSavedAssessmentId,
} from "./state/SavedAssessmentsStorage";
import { ASSESSMENT_LEVEL_OPTIONS } from "@/app/create-assessment/setup/AssessmentClassCoverageStorage";

function formatLastUpdated(timestamp: number): string {
  const date = new Date(timestamp);

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
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

function getQuestionCount(savedAssessment: SavedAssessment): number {
  return savedAssessment.builder.questions.length;
}

function AssessmentPreviewCard({
  savedAssessment,
}: {
  savedAssessment: SavedAssessment;
}) {
  const questionCount = getQuestionCount(savedAssessment);
  const paperLabel =
    savedAssessment.setup.paperStructure === "BOTH"
      ? "Paper 1 + Paper 2"
      : savedAssessment.setup.paperStructure === "P1_ONLY"
        ? "Paper 1"
        : "Paper 2";

  function handleOpenAssessment() {
    setCurrentSavedAssessmentId(savedAssessment.id);
  }

  return (
    <article
      style={{
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 22,
        background: "rgba(255,255,255,0.03)",
        padding: 18,
        display: "grid",
        gridTemplateColumns: "240px minmax(0, 1fr)",
        gap: 18,
        minHeight: 260,
      }}
    >
      <div
        style={{
          borderRadius: 16,
          border: "1px solid rgba(255,255,255,0.08)",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)",
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
            color: "rgba(229,238,248,0.56)",
          }}
        >
          Assessment preview
        </div>

        <div
          style={{
            borderRadius: 12,
            background: "rgba(255,255,255,0.92)",
            minHeight: 160,
            padding: 14,
            color: "#15202b",
            display: "grid",
            alignContent: "start",
            gap: 10,
            boxShadow: "0 10px 24px rgba(0,0,0,0.18)",
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
            {savedAssessment.setup.assessmentName || "[Untitled Assessment]"}
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
            <div>{questionCount} questions saved</div>
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
          gridTemplateRows: "auto 1fr auto",
          gap: 14,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "start",
            justifyContent: "space-between",
            gap: 12,
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
                color: "#e5eef8",
                wordBreak: "break-word",
              }}
            >
              {savedAssessment.setup.assessmentName || "[Untitled Assessment]"}
            </div>

            <div
              style={{
                fontSize: 15,
                lineHeight: 1.35,
                color: "rgba(229,238,248,0.74)",
              }}
            >
              {getLevelLabel(savedAssessment)} • {getCoverageLabel(savedAssessment)}
            </div>
          </div>

          <div
            style={{
              flexShrink: 0,
              borderRadius: 999,
              padding: "6px 12px",
              border: "1px solid rgba(96,165,250,0.22)",
              background: "rgba(37,99,235,0.16)",
              color: "#dbeafe",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: 0.3,
            }}
          >
            Draft
          </div>
        </div>

        <div
          style={{
            display: "grid",
            alignContent: "start",
            gap: 10,
            fontSize: 15,
            color: "rgba(229,238,248,0.82)",
            lineHeight: 1.45,
          }}
        >
          <div>
            <span style={{ color: "rgba(229,238,248,0.55)" }}>Type:</span>{" "}
            {savedAssessment.setup.assessmentType.replaceAll("_", " ")}
          </div>

          <div>
            <span style={{ color: "rgba(229,238,248,0.55)" }}>Structure:</span>{" "}
            {savedAssessment.setup.paperStructure === "BOTH"
              ? "Paper 1 + Paper 2"
              : savedAssessment.setup.paperStructure === "P1_ONLY"
                ? "Paper 1 only"
                : "Paper 2 only"}
          </div>

          <div>
            <span style={{ color: "rgba(229,238,248,0.55)" }}>Questions:</span>{" "}
            {questionCount}
          </div>

          <div>
            <span style={{ color: "rgba(229,238,248,0.55)" }}>Assessment date:</span>{" "}
            {savedAssessment.setup.assessmentDate}
          </div>

          <div>
            <span style={{ color: "rgba(229,238,248,0.55)" }}>Last edited:</span>{" "}
            {formatLastUpdated(savedAssessment.updatedAt)}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
            paddingTop: 4,
            borderTop: "1px solid rgba(255,255,255,0.08)",
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
              background: "rgba(37,99,235,0.20)",
              border: "1px solid rgba(96,165,250,0.7)",
              color: "#f8fbff",
              fontSize: 15,
              fontWeight: 700,
            }}
          >
            Open assessment
          </Link>

          <div
            style={{
              fontSize: 14,
              color: "rgba(229,238,248,0.50)",
            }}
          >
            More actions later: duplicate, delete, compile
          </div>
        </div>
      </div>
    </article>
  );
}

export default function MyAssessmentsPage() {
  const [savedAssessments, setSavedAssessments] = useState<SavedAssessment[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    setSavedAssessments(loadSavedAssessments());
    setHasLoaded(true);
  }, []);

  const assessmentCountText = useMemo(() => {
    if (savedAssessments.length === 1) {
      return "You have 1 assessment";
    }

    return `You have ${savedAssessments.length} assessments`;
  }, [savedAssessments.length]);

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
                color: "#e5eef8",
              }}
            >
              My Assessments
            </h1>

            <div
              style={{
                fontSize: 16,
                lineHeight: 1.4,
                color: "rgba(229,238,248,0.70)",
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
              background: "rgba(37,99,235,0.20)",
              border: "1px solid rgba(96,165,250,0.75)",
              color: "#f8fbff",
              fontSize: 16,
              fontWeight: 700,
              boxShadow: "0 12px 24px rgba(0,0,0,0.16)",
            }}
          >
            + Create New Assessment
          </Link>
        </section>

        {!hasLoaded ? (
          <section
            style={{
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 22,
              padding: 24,
              background: "rgba(255,255,255,0.03)",
              fontSize: 15,
              color: "rgba(229,238,248,0.68)",
            }}
          >
            Loading saved assessments...
          </section>
        ) : savedAssessments.length === 0 ? (
          <section
            style={{
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 22,
              padding: 28,
              background: "rgba(255,255,255,0.03)",
              display: "grid",
              gap: 12,
            }}
          >
            <div
              style={{
                fontSize: 26,
                fontWeight: 700,
                lineHeight: 1.1,
                color: "#e5eef8",
              }}
            >
              No assessments yet
            </div>

            <div
              style={{
                fontSize: 15,
                lineHeight: 1.5,
                color: "rgba(229,238,248,0.68)",
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
              />
            ))}
          </section>
        )}
      </div>
    </main>
  );
}