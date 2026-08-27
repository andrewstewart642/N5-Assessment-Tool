"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import type {
  SavedAssessment,
} from "@/app/Assessments/SavedAssessments/SavedAssessment";

import {
  getCurrentSavedAssessmentId,
  loadSavedAssessmentById,
} from "@/app/Assessments/SavedAssessments/SavedAssessmentsStorage";

import {
  useSettings,
} from "@/app/UI/Application/Settings/ApplicationSettings";

import {
  buildAssessmentCompilationDocument,
} from "./Model/buildAssessmentCompilationDocument";

import AssessmentCompiledDocument from "./Rendering/AssessmentCompiledDocument";

import AssessmentPdfDownloadButton from "./PDF/AssessmentPdfDownloadButton";


export default function AssessmentCompilationPage() {
  const {
    theme,
  } =
    useSettings();


  const [
    savedAssessment,
    setSavedAssessment,
  ] =
    useState<
      SavedAssessment | null
    >(
      null
    );


  const [
    hasLoaded,
    setHasLoaded,
  ] =
    useState(
      false
    );


  useEffect(() => {
    const assessmentId =
      getCurrentSavedAssessmentId();


    if (
      !assessmentId
    ) {
      setHasLoaded(
        true
      );

      return;
    }


    setSavedAssessment(
      loadSavedAssessmentById(
        assessmentId
      )
    );


    setHasLoaded(
      true
    );
  }, []);


  const compilationResult =
    useMemo(
      () => {
        if (
          !savedAssessment
        ) {
          return {
            document:
              null,

            error:
              null,
          };
        }


        try {
          return {
            document:
              buildAssessmentCompilationDocument(
                savedAssessment
              ),

            error:
              null,
          };
        } catch (
          error
        ) {
          return {
            document:
              null,

            error:
              error instanceof
                Error
                ? error.message
                : "Unable to build the assessment document.",
          };
        }
      },
      [
        savedAssessment,
      ]
    );


  return (
    <main
      style={{
        width:
          "100%",

        minHeight:
          "100%",

        boxSizing:
          "border-box",

        padding:
          16,

        background:
          theme.bgWorkspace,

        color:
          theme.textPrimary,

        overflow:
          "auto",
      }}
    >
      <div
        style={{
          width:
            "100%",

          maxWidth:
            1180,

          margin:
            "0 auto",

          display:
            "grid",

          gap:
            14,
        }}
      >
        <header
          style={{
            minHeight:
              42,

            padding:
              "8px 10px",

            boxSizing:
              "border-box",

            display:
              "flex",

            alignItems:
              "center",

            justifyContent:
              "space-between",

            gap:
              12,

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
              minWidth:
                0,

              display:
                "grid",

              gap:
                2,
            }}
          >
            <div
              style={{
                fontSize:
                  13,

                fontWeight:
                  600,

                color:
                  theme.textPrimary,
              }}
            >
              Compilation preview
            </div>

            <div
              style={{
                minWidth:
                  0,

                overflow:
                  "hidden",

                whiteSpace:
                  "nowrap",

                textOverflow:
                  "ellipsis",

                fontSize:
                  11,

                color:
                  theme.textMuted,
              }}
            >
              {savedAssessment?.setup
                .assessmentName ||
                "[Untitled file]"}
            </div>
          </div>


          {savedAssessment &&
          compilationResult.document ? (
            <AssessmentPdfDownloadButton
              savedAssessment={
                savedAssessment
              }
              theme={
                theme
              }
            />
          ) : null}
        </header>


        {!hasLoaded ? (
          <div
            style={{
              padding:
                16,

              color:
                theme.textSecondary,
            }}
          >
            Loading assessment…
          </div>
        ) : !savedAssessment ? (
          <div
            style={{
              padding:
                16,

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
            }}
          >
            No current saved assessment was found.
          </div>
        ) : compilationResult.error ? (
          <div
            style={{
              padding:
                16,

              borderWidth:
                1,

              borderStyle:
                "solid",

              borderColor:
                theme.danger,

              borderRadius:
                6,

              background:
                theme.dangerSoft,

              color:
                theme.textPrimary,
            }}
          >
            {compilationResult.error}
          </div>
        ) : compilationResult.document ? (
          <AssessmentCompiledDocument
            document={
              compilationResult.document
            }
            viewerScale={
              0.72
            }
          />
        ) : null}
      </div>
    </main>
  );
}