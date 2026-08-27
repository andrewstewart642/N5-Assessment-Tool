"use client";

import {
  useState,
} from "react";

import type {
  SavedAssessment,
} from "@/app/Assessments/SavedAssessments/SavedAssessment";

import type {
  AppTheme,
} from "@/app/UI/Application/Theme/AppTheme";

import {
  UI_TEXT,
} from "@/app/UI/Application/Typography/Typography";


type PdfDownloadState =
  | "idle"
  | "generating"
  | "error";


function readDownloadFilename(
  contentDisposition:
    string | null
): string {
  if (
    !contentDisposition
  ) {
    return "Assessment.pdf";
  }


  const quotedMatch =
    contentDisposition.match(
      /filename="([^"]+)"/i
    );


  if (
    quotedMatch?.[1]
  ) {
    return quotedMatch[1];
  }


  const plainMatch =
    contentDisposition.match(
      /filename=([^;]+)/i
    );


  return (
    plainMatch?.[1]
      ?.trim() ||
    "Assessment.pdf"
  );
}


export default function AssessmentPdfDownloadButton({
  savedAssessment,
  theme,
}: {
  savedAssessment:
    SavedAssessment;

  theme:
    AppTheme;
}) {
  const [
    state,
    setState,
  ] =
    useState<PdfDownloadState>(
      "idle"
    );


  const [
    errorMessage,
    setErrorMessage,
  ] =
    useState(
      ""
    );


  async function handleDownload() {
    if (
      state ===
      "generating"
    ) {
      return;
    }


    setState(
      "generating"
    );

    setErrorMessage(
      ""
    );


    try {
      const response =
        await fetch(
          "/Assessments/Compilation/PDF/generate",
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                savedAssessment,
              }),
          }
        );


      if (
        !response.ok
      ) {
        let message =
          "Unable to generate PDF.";


        try {
          const body =
            await response.json() as {
              error?:
                unknown;
            };


          if (
            typeof body.error ===
            "string" &&
            body.error.trim()
          ) {
            message =
              body.error;
          }
        } catch {
          // Preserve fallback message.
        }


        throw new Error(
          message
        );
      }


      const blob =
        await response.blob();


      const objectUrl =
        URL.createObjectURL(
          blob
        );


      const filename =
        readDownloadFilename(
          response.headers.get(
            "Content-Disposition"
          )
        );


      const link =
        document.createElement(
          "a"
        );

      link.href =
        objectUrl;

      link.download =
        filename;

      link.style.display =
        "none";


      document.body.appendChild(
        link
      );

      link.click();

      link.remove();


      window.setTimeout(
        () => {
          URL.revokeObjectURL(
            objectUrl
          );
        },
        1_000
      );


      setState(
        "idle"
      );
    } catch (
      error
    ) {
      setErrorMessage(
        error instanceof
          Error
          ? error.message
          : "Unable to generate PDF."
      );

      setState(
        "error"
      );
    }
  }


  return (
    <div
      style={{
        display:
          "flex",

        alignItems:
          "center",

        gap:
          8,
      }}
    >
      {state ===
      "error" ? (
        <span
          title={
            errorMessage
          }
          style={{
            maxWidth:
              240,

            overflow:
              "hidden",

            textOverflow:
              "ellipsis",

            whiteSpace:
              "nowrap",

            color:
              theme.danger,

            ...UI_TEXT.helper,
          }}
        >
          {errorMessage}
        </span>
      ) : null}


      <button
        type="button"
        onClick={
          handleDownload
        }
        disabled={
          state ===
          "generating"
        }
        style={{
          height:
            32,

          padding:
            "0 10px",

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
            5,

          background:
            theme.controlSelectedBg,

          color:
            theme.textPrimary,

          opacity:
            state ===
            "generating"
              ? 0.72
              : 1,

          cursor:
            state ===
            "generating"
              ? "wait"
              : "pointer",

          ...UI_TEXT.buttonText,
        }}
      >
        {state ===
        "generating" ? (
          <>
            <span
              aria-hidden="true"
              style={{
                width:
                  10,

                height:
                  10,

                borderRadius:
                  999,

                borderWidth:
                  1.5,

                borderStyle:
                  "solid",

                borderColor:
                  "currentColor",

                borderRightColor:
                  "transparent",

                animation:
                  "assessment-pdf-spin 700ms linear infinite",
              }}
            />

            Generating…
          </>
        ) : (
          <>
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              aria-hidden="true"
            >
              <path
                d="M6 1.5v6M3.8 5.6 6 7.8l2.2-2.2M2 9.5h8"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            Download PDF
          </>
        )}


        <style>
          {`
            @keyframes assessment-pdf-spin {
              to {
                transform: rotate(360deg);
              }
            }
          `}
        </style>
      </button>
    </div>
  );
}