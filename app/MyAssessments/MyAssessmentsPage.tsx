"use client";

import Link from "next/link";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import type {
  SavedAssessment,
} from "@/app/Assessments/SavedAssessments/SavedAssessment";

import {
  deleteSavedAssessment,
  loadSavedAssessments,
  saveSavedAssessments,
  upsertSavedAssessment,
} from "@/app/Assessments/SavedAssessments/SavedAssessmentsStorage";

import {
  useSettings,
} from "@/app/UI/Application/Settings/ApplicationSettings";

import DeleteAssessmentModal from "./Actions/DeleteAssessmentModal";

import {
  sortSavedAssessmentsForLibrary,
} from "./Library/AssessmentLibrarySorting";

import AssessmentTile from "./TileView/AssessmentTile";


function duplicateSavedAssessment(
  savedAssessment:
    SavedAssessment
): SavedAssessment {
  const now =
    Date.now();

  const sourceName =
    savedAssessment.setup
      .assessmentName;

  const duplicatedName =
    `${sourceName} (Copy)`;

  return {
    ...savedAssessment,

    id:
      `assessment-${now}-${Math.random()
        .toString(36)
        .slice(2, 8)}`,

    isPinned:
      false,

    createdAt:
      now,

    updatedAt:
      now,

    setup: {
      ...savedAssessment.setup,

      assessmentName:
        duplicatedName,
    },

    builder: {
      ...savedAssessment.builder,

      assessmentName:
        duplicatedName,
    },
  };
}


function normaliseSavedAssessments(
  assessments:
    SavedAssessment[]
): SavedAssessment[] {
  return assessments.map(
    (
      assessment
    ) => ({
      ...assessment,

      isPinned:
        Boolean(
          assessment.isPinned
        ),
    })
  );
}


export default function MyAssessmentsPage() {
  const {
    theme,
  } =
    useSettings();


  const [
    savedAssessments,
    setSavedAssessments,
  ] =
    useState<
      SavedAssessment[]
    >(
      []
    );


  const [
    hasLoaded,
    setHasLoaded,
  ] =
    useState(
      false
    );


  const [
    assessmentPendingDelete,
    setAssessmentPendingDelete,
  ] =
    useState<
      SavedAssessment | null
    >(
      null
    );


  useEffect(() => {
    const loaded =
      normaliseSavedAssessments(
        loadSavedAssessments()
      );

    saveSavedAssessments(
      loaded
    );

    setSavedAssessments(
      sortSavedAssessmentsForLibrary(
        loaded
      )
    );

    setHasLoaded(
      true
    );
  }, []);


  const assessmentCountText =
    useMemo(
      () => {
        if (
          savedAssessments.length ===
          1
        ) {
          return "1 assessment";
        }

        return `${savedAssessments.length} assessments`;
      },
      [
        savedAssessments.length,
      ]
    );


  function refreshSavedAssessments() {
    const loaded =
      normaliseSavedAssessments(
        loadSavedAssessments()
      );

    saveSavedAssessments(
      loaded
    );

    setSavedAssessments(
      sortSavedAssessmentsForLibrary(
        loaded
      )
    );
  }


  function handleDuplicate(
    savedAssessment:
      SavedAssessment
  ) {
    upsertSavedAssessment(
      duplicateSavedAssessment(
        savedAssessment
      )
    );

    refreshSavedAssessments();
  }


  function handleRequestDelete(
    savedAssessment:
      SavedAssessment
  ) {
    setAssessmentPendingDelete(
      savedAssessment
    );
  }


  function handleCancelDelete() {
    setAssessmentPendingDelete(
      null
    );
  }


  function handleConfirmDelete() {
    if (
      !assessmentPendingDelete
    ) {
      return;
    }

    deleteSavedAssessment(
      assessmentPendingDelete.id
    );

    setAssessmentPendingDelete(
      null
    );

    refreshSavedAssessments();
  }


  function handleTogglePinned(
    savedAssessment:
      SavedAssessment
  ) {
    const updatedAssessment:
      SavedAssessment = {
      ...savedAssessment,

      isPinned:
        !savedAssessment.isPinned,
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
          minHeight:
            "100%",

          padding:
            "24px 16px",

          boxSizing:
            "border-box",

          background:
            theme.bgPage,

          color:
            theme.textPrimary,

          fontFamily:
            "var(--app-ui-font-family)",
        }}
      >
        <div
          style={{
            width:
              "100%",

            maxWidth:
              1400,

            margin:
              "0 auto",

            display:
              "grid",

            gap:
              16,
          }}
        >
          <section
            style={{
              minWidth:
                0,

              display:
                "flex",

              alignItems:
                "flex-start",

              justifyContent:
                "space-between",

              gap:
                16,

              flexWrap:
                "wrap",
            }}
          >
            <div
              style={{
                display:
                  "grid",

                gap:
                  4,
              }}
            >
              <h1
                style={{
                  margin:
                    0,

                  color:
                    theme.textPrimary,

                  fontSize:
                    30,

                  fontWeight:
                    700,

                  lineHeight:
                    1.08,
                }}
              >
                My Assessments
              </h1>

              <div
                style={{
                  color:
                    theme.textSecondary,

                  fontSize:
                    13,

                  lineHeight:
                    1.35,
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
                height:
                  32,

                padding:
                  "0 11px",

                boxSizing:
                  "border-box",

                display:
                  "inline-flex",

                alignItems:
                  "center",

                justifyContent:
                  "center",

                gap:
                  6,

                borderWidth:
                  1,

                borderStyle:
                  "solid",

                borderColor:
                  theme.controlSelectedBorder,

                borderRadius:
                  6,

                background:
                  theme.controlSelectedBg,

                color:
                  theme.textPrimary,

                textDecoration:
                  "none",

                fontSize:
                  12,

                fontWeight:
                  600,
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  fontSize:
                    15,

                  lineHeight:
                    1,
                }}
              >
                +
              </span>

              New assessment
            </Link>
          </section>


          {!hasLoaded ? (
            <section
              style={{
                padding:
                  18,

                borderWidth:
                  1,

                borderStyle:
                  "solid",

                borderColor:
                  theme.borderStandard,

                borderRadius:
                  6,

                background:
                  theme.bgSurface,

                color:
                  theme.textSecondary,

                fontSize:
                  12,
              }}
            >
              Loading saved assessments...
            </section>
          ) : savedAssessments.length ===
            0 ? (
            <section
              style={{
                padding:
                  20,

                display:
                  "grid",

                gap:
                  6,

                borderWidth:
                  1,

                borderStyle:
                  "solid",

                borderColor:
                  theme.borderStandard,

                borderRadius:
                  6,

                background:
                  theme.bgSurface,
              }}
            >
              <div
                style={{
                  color:
                    theme.textPrimary,

                  fontSize:
                    17,

                  fontWeight:
                    650,
                }}
              >
                No assessments yet
              </div>

              <div
                style={{
                  maxWidth:
                    680,

                  color:
                    theme.textSecondary,

                  fontSize:
                    12,

                  lineHeight:
                    1.45,
                }}
              >
                Create an assessment and it will
                appear here automatically when
                you continue into the builder.
              </div>
            </section>
          ) : (
            <section
              aria-label="Assessment library"
              style={{
                minWidth:
                  0,

                display:
                  "grid",

                gridTemplateColumns:
                  "repeat(auto-fit, minmax(400px, 1fr))",

                gap:
                  12,

                alignItems:
                  "stretch",
              }}
            >
              {savedAssessments.map(
                (
                  savedAssessment
                ) => (
                  <AssessmentTile
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
                    theme={
                      theme
                    }
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
        theme={
          theme
        }
      />
    </>
  );
}