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
  DEFAULT_ASSESSMENT_LIBRARY_SORT_MODE,
  DEFAULT_ASSESSMENT_LIBRARY_STATUS_FILTER,
  DEFAULT_ASSESSMENT_LIBRARY_VIEW_MODE,
  type AssessmentLibrarySortMode,
  type AssessmentLibraryStatusFilter,
  type AssessmentLibraryViewMode,
} from "./Library/ViewOptions";

import {
  filterSavedAssessmentsForLibrary,
} from "./Library/Filtering";

import {
  sortSavedAssessmentsForLibrary,
} from "./Library/Sorting";

import AssessmentListView from "./ListView/AssessmentListView";

import AssessmentTile from "./TileView/AssessmentTile";

import AssessmentLibraryToolbar from "./Toolbar/AssessmentLibraryToolbar";


const VIEW_MODE_STORAGE_KEY =
  "my-assessments-view-mode-v1";


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


function readStoredViewMode():
  AssessmentLibraryViewMode {
  const stored =
    window.localStorage.getItem(
      VIEW_MODE_STORAGE_KEY
    );


  return stored ===
    "LIST"
    ? "LIST"
    : "TILES";
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
    useState<SavedAssessment[]>(
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
    useState<SavedAssessment | null>(
      null
    );


  const [
    searchText,
    setSearchText,
  ] =
    useState(
      ""
    );


  const [
    statusFilter,
    setStatusFilter,
  ] =
    useState<AssessmentLibraryStatusFilter>(
      DEFAULT_ASSESSMENT_LIBRARY_STATUS_FILTER
    );


  const [
    sortMode,
    setSortMode,
  ] =
    useState<AssessmentLibrarySortMode>(
      DEFAULT_ASSESSMENT_LIBRARY_SORT_MODE
    );


  const [
    viewMode,
    setViewMode,
  ] =
    useState<AssessmentLibraryViewMode>(
      DEFAULT_ASSESSMENT_LIBRARY_VIEW_MODE
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
      loaded
    );


    setViewMode(
      readStoredViewMode()
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


  const visibleAssessments =
    useMemo(
      () => {
        const filtered =
          filterSavedAssessmentsForLibrary({
            savedAssessments,

            searchText,

            statusFilter,
          });


        return sortSavedAssessmentsForLibrary(
          filtered,
          sortMode
        );
      },
      [
        savedAssessments,
        searchText,
        statusFilter,
        sortMode,
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
      loaded
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


  function handleViewModeChange(
    nextViewMode:
      AssessmentLibraryViewMode
  ) {
    setViewMode(
      nextViewMode
    );


    window.localStorage.setItem(
      VIEW_MODE_STORAGE_KEY,
      nextViewMode
    );
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
              12,
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


          {hasLoaded &&
          savedAssessments.length >
            0 ? (
            <AssessmentLibraryToolbar
              searchText={
                searchText
              }
              statusFilter={
                statusFilter
              }
              sortMode={
                sortMode
              }
              viewMode={
                viewMode
              }
              resultCount={
                visibleAssessments.length
              }
              totalCount={
                savedAssessments.length
              }
              theme={
                theme
              }
              onSearchTextChange={
                setSearchText
              }
              onStatusFilterChange={
                setStatusFilter
              }
              onSortModeChange={
                setSortMode
              }
              onViewModeChange={
                handleViewModeChange
              }
            />
          ) : null}


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
          ) : visibleAssessments.length ===
            0 ? (
            <section
              style={{
                padding:
                  20,

                display:
                  "grid",

                justifyItems:
                  "start",

                gap:
                  8,

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
                    13,

                  fontWeight:
                    600,
                }}
              >
                No assessments match these filters
              </div>


              <button
                type="button"
                onClick={() => {
                  setSearchText(
                    ""
                  );

                  setStatusFilter(
                    "ALL"
                  );
                }}
                style={{
                  height:
                    28,

                  padding:
                    "0 9px",

                  borderWidth:
                    1,

                  borderStyle:
                    "solid",

                  borderColor:
                    theme.borderStandard,

                  borderRadius:
                    5,

                  background:
                    theme.controlBg,

                  color:
                    theme.textSecondary,

                  cursor:
                    "pointer",

                  fontSize:
                    11,

                  fontWeight:
                    600,
                }}
              >
                Clear filters
              </button>
            </section>
          ) : viewMode ===
            "LIST" ? (
            <AssessmentListView
              savedAssessments={
                visibleAssessments
              }
              theme={
                theme
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
            />
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
              {visibleAssessments.map(
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