"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import type {
  SavedAssessment,
} from "@/app/Assessments/SavedAssessments/SavedAssessment";

import type {
  AppTheme,
} from "@/app/UI/Application/Theme/AppTheme";

import {
  useAssessmentPdfAsset,
} from "@/app/Assessments/Compilation/PDF/Client/useAssessmentPdfAsset";

import AssessmentPdfCanvasViewer from "../Preview/AssessmentPdfCanvasViewer";


type AssessmentPreviewViewportProps = {
  savedAssessment:
    SavedAssessment;

  theme:
    AppTheme;

  onOpenPreview?:
    () => void;
};


function LoadingIndicator({
  theme,
}: {
  theme:
    AppTheme;
}) {
  return (
    <div
      aria-label="Preparing assessment preview"
      style={{
        width:
          "100%",

        height:
          "100%",

        minHeight:
          310,

        display:
          "grid",

        placeItems:
          "center",

        background:
          theme.paper,
      }}
    >
      <div
        aria-hidden="true"
        style={{
          width:
            14,

          height:
            14,

          borderRadius:
            999,

          borderWidth:
            1.5,

          borderStyle:
            "solid",

          borderColor:
            "rgba(0,0,0,0.18)",

          borderRightColor:
            "rgba(0,0,0,0.58)",

          animation:
            "assessment-preview-spin 700ms linear infinite",
        }}
      />

      <style>
        {`
          @keyframes assessment-preview-spin {
            to {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
    </div>
  );
}


export default function AssessmentPreviewViewport({
  savedAssessment,
  theme,
  onOpenPreview,
}: AssessmentPreviewViewportProps) {
  const viewportRef =
    useRef<HTMLDivElement | null>(
      null
    );


  const [
    shouldLoad,
    setShouldLoad,
  ] =
    useState(
      false
    );


  const interactive =
    typeof onOpenPreview ===
    "function";


  useEffect(() => {
    const element =
      viewportRef.current;


    if (
      !element
    ) {
      return;
    }


    if (
      !(
        "IntersectionObserver" in
        window
      )
    ) {
      setShouldLoad(
        true
      );

      return;
    }


    const observer =
      new IntersectionObserver(
        (
          entries
        ) => {
          const entry =
            entries[0];


          if (
            !entry?.isIntersecting
          ) {
            return;
          }


          setShouldLoad(
            true
          );

          observer.disconnect();
        },
        {
          /*
           * Begin generation shortly before the
           * tile actually reaches the viewport.
           */
          rootMargin:
            "500px 0px",
        }
      );


    observer.observe(
      element
    );


    return () => {
      observer.disconnect();
    };
  }, []);


  const pdfState =
    useAssessmentPdfAsset({
      savedAssessment,

      enabled:
        shouldLoad,
    });


  return (
    <div
      ref={
        viewportRef
      }
      data-assessment-id={
        savedAssessment.id
      }
      aria-label="Assessment document preview"
      role={
        interactive
          ? "button"
          : "region"
      }
      tabIndex={
        interactive
          ? 0
          : undefined
      }
      onClick={
        onOpenPreview
      }
      onKeyDown={
        interactive
          ? (
              event
            ) => {
              if (
                event.key ===
                  "Enter" ||
                event.key ===
                  " "
              ) {
                event.preventDefault();

                onOpenPreview();
              }
            }
          : undefined
      }
      style={{
        width:
          "100%",

        height:
          "100%",

        minHeight:
          310,

        boxSizing:
          "border-box",

        overflowY:
          "auto",

        overflowX:
          "hidden",

        overscrollBehavior:
          "contain",

        scrollbarWidth:
          "thin",

        scrollbarColor:
          `${theme.borderStandard} transparent`,

        background:
          theme.bgSection,

        borderRightWidth:
          1,

        borderRightStyle:
          "solid",

        borderRightColor:
          theme.borderStandard,

        cursor:
          interactive
            ? "zoom-in"
            : "default",
      }}
    >
      {!shouldLoad ||
      pdfState.status ===
        "idle" ||
      pdfState.status ===
        "loading" ? (
        <LoadingIndicator
          theme={
            theme
          }
        />
      ) : null}


      {pdfState.status ===
      "error" ? (
        <div
          title={
            pdfState.error
          }
          style={{
            width:
              "100%",

            height:
              "100%",

            minHeight:
              310,

            padding:
              12,

            boxSizing:
              "border-box",

            display:
              "grid",

            placeItems:
              "center",

            background:
              theme.paper,

            color:
              "#777",

            fontSize:
              10,

            textAlign:
              "center",
          }}
        >
          Preview unavailable
        </div>
      ) : null}


      {pdfState.status ===
      "ready" ? (
        <AssessmentPdfCanvasViewer
          pdfUrl={
            pdfState.asset
              .objectUrl
          }
        />
      ) : null}
    </div>
  );
}