"use client";

import Link from "next/link";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import type {
  SavedAssessment,
} from "@/src/Assessments/SavedAssessments/SavedAssessment";

import {
  deleteSavedAssessment,
  loadSavedAssessments,
  saveSavedAssessments,
  upsertSavedAssessment,
} from "@/src/Assessments/SavedAssessments/SavedAssessmentsStorage";

import {
  useSettings,
} from "@/app/settings-bar/GlobalSettingsContext";

import AssessmentPreviewCard from "./Components/AssessmentPreviewCard";
import DeleteAssessmentModal from "./Components/DeleteAssessmentModal";

import {
  sortSavedAssessmentsForDisplay,
} from "./MyAssessmentsDisplay";

function duplicateSavedAssessment(
  savedAssessment: SavedAssessment
): SavedAssessment {
  const now = Date.now();

  return {
    ...savedAssessment,
    id: `assessment-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}`,
    isPinned: false,
    createdAt: now,
    updatedAt: now,
    setup: {
      ...savedAssessment.setup,
      assessmentName:
        `${savedAssessment.setup.assessmentName} (Copy)`,
    },
    builder: {
      ...savedAssessment.builder,
      assessmentName:
        `${savedAssessment.builder.assessmentName} (Copy)`,
    },
  };
}

export default function MyAssessmentsPage() {
  const { theme } = useSettings();

  const [
    savedAssessments,
    setSavedAssessments,
  ] = useState<SavedAssessment[]>([]);

  const [
    hasLoaded,
    setHasLoaded,
  ] = useState(false);

  const [
    assessmentPendingDelete,
    setAssessmentPendingDelete,
  ] = useState<SavedAssessment | null>(
    null
  );

  useEffect(() => {
    const loaded =
      loadSavedAssessments().map(
        (assessment) => ({
          ...assessment,
          isPinned:
            Boolean(
              assessment.isPinned
            ),
        })
      );

    saveSavedAssessments(loaded);

    setSavedAssessments(
      sortSavedAssessmentsForDisplay(
        loaded
      )
    );

    setHasLoaded(true);
  }, []);

  const assessmentCountText =
    useMemo(() => {
      if (
        savedAssessments.length === 1
      ) {
        return "You have 1 assessment";
      }

      return `You have ${savedAssessments.length} assessments`;
    }, [savedAssessments.length]);

  function refreshSavedAssessments() {
    const loaded =
      loadSavedAssessments().map(
        (assessment) => ({
          ...assessment,
          isPinned:
            Boolean(
              assessment.isPinned
            ),
        })
      );

    saveSavedAssessments(loaded);

    setSavedAssessments(
      sortSavedAssessmentsForDisplay(
        loaded
      )
    );
  }

  function handleDuplicate(
    savedAssessment: SavedAssessment
  ) {
    const duplicatedAssessment =
      duplicateSavedAssessment(
        savedAssessment
      );

    upsertSavedAssessment(
      duplicatedAssessment
    );

    refreshSavedAssessments();
  }

  function handleRequestDelete(
    savedAssessment: SavedAssessment
  ) {
    setAssessmentPendingDelete(
      savedAssessment
    );
  }

  function handleCancelDelete() {
    setAssessmentPendingDelete(null);
  }

  function handleConfirmDelete() {
    if (!assessmentPendingDelete) {
      return;
    }

    deleteSavedAssessment(
      assessmentPendingDelete.id
    );

    setAssessmentPendingDelete(null);

    refreshSavedAssessments();
  }

  function handleTogglePinned(
    savedAssessment: SavedAssessment
  ) {
    const updatedAssessment: SavedAssessment =
      {
        ...savedAssessment,
        isPinned:
          !savedAssessment.isPinned,
        updatedAt: Date.now(),
      };

    upsertSavedAssessment(
      updatedAssessment
    );

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
          fontFamily:
            "var(--app-ui-font-family)",
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
              justifyContent:
                "space-between",
              gap: 18,
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                display: "grid",
                gap: 8,
              }}
            >
              <h1
                style={{
                  margin: 0,
                  fontSize: 40,
                  lineHeight: 1.05,
                  fontWeight: 700,
                  color:
                    theme.textPrimary,
                }}
              >
                My Assessments
              </h1>

              <div
                style={{
                  fontSize: 16,
                  lineHeight: 1.4,
                  color:
                    theme.textSecondary,
                }}
              >
                {hasLoaded
                  ? assessmentCountText
                  : "Loading assessments..."}
              </div>
            </div>

            <Link
              href="/create-assessment"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent:
                  "center",
                minWidth: 190,
                height: 50,
                padding: "0 18px",
                borderRadius: 14,
                textDecoration: "none",
                background:
                  theme.controlSelectedBg,
                border: `1px solid ${theme.controlSelectedBorder}`,
                color:
                  theme.textPrimary,
                fontSize: 16,
                fontWeight: 700,
                boxShadow:
                  theme.shadow,
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
                background:
                  theme.bgSurface,
                fontSize: 15,
                color:
                  theme.textSecondary,
              }}
            >
              Loading saved assessments...
            </section>
          ) : savedAssessments.length ===
            0 ? (
            <section
              style={{
                border: `1px solid ${theme.borderStandard}`,
                borderRadius: 22,
                padding: 28,
                background:
                  theme.bgSurface,
                display: "grid",
                gap: 12,
              }}
            >
              <div
                style={{
                  fontSize: 26,
                  fontWeight: 700,
                  lineHeight: 1.1,
                  color:
                    theme.textPrimary,
                }}
              >
                No assessments yet
              </div>

              <div
                style={{
                  fontSize: 15,
                  lineHeight: 1.5,
                  color:
                    theme.textSecondary,
                  maxWidth: 760,
                }}
              >
                Start a new assessment and
                it will appear here
                automatically as a saved
                draft the moment you
                continue into the builder.
              </div>
            </section>
          ) : (
            <section
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(2, minmax(0, 1fr))",
                gap: 18,
                alignItems: "start",
              }}
            >
              {savedAssessments.map(
                (savedAssessment) => (
                  <AssessmentPreviewCard
                    key={
                      savedAssessment.id
                    }
                    savedAssessment={
                      savedAssessment
                    }
                    onDuplicate={
                      handleDuplicate
                    }
                    onDelete={
                      handleRequestDelete
                    }
                    onTogglePinned={
                      handleTogglePinned
                    }
                    theme={theme}
                  />
                )
              )}
            </section>
          )}
        </div>
      </main>

      <DeleteAssessmentModal
        savedAssessment={
          assessmentPendingDelete
        }
        onCancel={
          handleCancelDelete
        }
        onConfirm={
          handleConfirmDelete
        }
        theme={theme}
      />
    </>
  );
}