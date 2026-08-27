

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

import AssessmentPdfPreviewModal from "../Preview/AssessmentPdfPreviewModal";


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
          0,

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


  const [
    isPreviewOpen,
    setIsPreviewOpen,
  ] =
    useState(
      false
    );


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


  const interactive =
    pdfState.status ===
    "ready";


  const assessmentName =
    savedAssessment.setup
      .assessmentName
      .trim() ||
    "[Untitled file]";


  function handleOpenPreview() {
    if (
      pdfState.status !==
      "ready"
    ) {
      return;
    }


    if (
      onOpenPreview
    ) {
      onOpenPreview();

      return;
    }


    setIsPreviewOpen(
      true
    );
  }


  function handleClosePreview() {
    setIsPreviewOpen(
      false
    );
  }


  return (
    <>
      <div
        ref={
          viewportRef
        }
        data-assessment-id={
          savedAssessment.id
        }
        aria-label={
          interactive
            ? "Assessment document preview. Click to enlarge."
            : "Assessment document preview"
        }
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
          interactive
            ? handleOpenPreview
            : undefined
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

                  handleOpenPreview();
                }
              }
            : undefined
        }
        style={{
          width:
            "100%",

          height:
            "100%",

          minWidth:
            0,

          minHeight:
            0,

          maxHeight:
            "100%",

          alignSelf:
            "stretch",

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

          scrollbarGutter:
            "stable",

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
                0,

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


      {pdfState.status ===
      "ready" &&
      !onOpenPreview ? (
        <AssessmentPdfPreviewModal
          open={
            isPreviewOpen
          }
          title={
            assessmentName
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
          onClose={
            handleClosePreview
          }
        />
      ) : null}
    </>
  );
}