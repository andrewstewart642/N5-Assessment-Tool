"use client";

import {
  useEffect,
  useState,
} from "react";

import type {
  SavedAssessment,
} from "@/app/Assessments/SavedAssessments/SavedAssessment";

import {
  useAssessmentPdfAsset,
} from "@/app/Assessments/Compilation/PDF/Client/useAssessmentPdfAsset";

import type {
  AppTheme,
} from "@/app/UI/Application/Theme/AppTheme";

import AssessmentPdfPreviewModal from "../Preview/AssessmentPdfPreviewModal";


export default function AssessmentListPreviewButton({
  savedAssessment,
  theme,
}: {
  savedAssessment:
    SavedAssessment;

  theme:
    AppTheme;
}) {
  const [
    requested,
    setRequested,
  ] =
    useState(
      false
    );


  const [
    open,
    setOpen,
  ] =
    useState(
      false
    );


  const pdfState =
    useAssessmentPdfAsset({
      savedAssessment,

      enabled:
        requested,
    });


  useEffect(() => {
    if (
      requested &&
      pdfState.status ===
        "ready"
    ) {
      setOpen(
        true
      );
    }
  }, [
    requested,
    pdfState.status,
  ]);


  const title =
    savedAssessment.setup
      .assessmentName
      .trim() ||
    "[Untitled file]";


  function handleClick() {
    if (
      pdfState.status ===
      "ready"
    ) {
      setOpen(
        true
      );

      return;
    }


    setRequested(
      true
    );
  }


  return (
    <>
      <button
        type="button"
        aria-label="Preview assessment"
        title={
          pdfState.status ===
          "error"
            ? pdfState.error
            : "Preview assessment"
        }
        onClick={
          handleClick
        }
        disabled={
          pdfState.status ===
          "loading"
        }
        style={{
          width:
            86,

          height:
            30,

          padding:
            "0 9px",

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
            pdfState.status ===
            "error"
              ? theme.danger
              : theme.controlSelectedBorder,

          borderRadius:
            5,

          background:
            pdfState.status ===
            "error"
              ? theme.controlBg
              : theme.controlSelectedBg,

          color:
            pdfState.status ===
            "error"
              ? theme.danger
              : theme.textPrimary,

          opacity:
            pdfState.status ===
            "loading"
              ? 0.68
              : 1,

          cursor:
            pdfState.status ===
            "loading"
              ? "wait"
              : "pointer",

          fontFamily:
            "var(--app-ui-font-family)",

          fontSize:
            11,

          fontWeight:
            600,

          whiteSpace:
            "nowrap",
        }}
      >
        {pdfState.status ===
        "loading" ? (
          <>
            <span
              aria-hidden="true"
              style={{
                width:
                  10,

                height:
                  10,

                flexShrink:
                  0,

                borderRadius:
                  999,

                borderWidth:
                  1.4,

                borderStyle:
                  "solid",

                borderColor:
                  "currentColor",

                borderRightColor:
                  "transparent",

                animation:
                  "assessment-list-preview-spin 700ms linear infinite",
              }}
            />

            Loading
          </>
        ) : (
          <>
            <svg
              width="13"
              height="13"
              viewBox="0 0 16 16"
              aria-hidden="true"
              style={{
                flexShrink:
                  0,
              }}
            >
              <path
                d="M1.7 8s2.2-3.7 6.3-3.7S14.3 8 14.3 8 12.1 11.7 8 11.7 1.7 8 1.7 8Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />

              <circle
                cx="8"
                cy="8"
                r="1.8"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
              />
            </svg>

            Preview
          </>
        )}


        <style>
          {`
            @keyframes assessment-list-preview-spin {
              to {
                transform: rotate(360deg);
              }
            }
          `}
        </style>
      </button>


      {pdfState.status ===
      "ready" ? (
        <AssessmentPdfPreviewModal
          open={
            open
          }
          title={
            title
          }
          pdfUrl={
            pdfState.asset
              .objectUrl
          }
          pageCount={
            pdfState.asset
              .pageCount
          }
          theme={
            theme
          }
          onClose={() =>
            setOpen(
              false
            )
          }
        />
      ) : null}
    </>
  );
}