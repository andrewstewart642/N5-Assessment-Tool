import {
  useEffect,
  useRef,
} from "react";

import {
  createPortal,
} from "react-dom";

import type {
  AppTheme,
} from "@/app/UI/Application/Theme/AppTheme";

import AssessmentPdfCanvasViewer from "./AssessmentPdfCanvasViewer";


type AssessmentPdfPreviewModalProps = {
  open:
    boolean;

  title:
    string;

  pdfUrl:
    string;

  pageCount:
    number | null;

  theme:
    AppTheme;

  onClose:
    () => void;
};


export default function AssessmentPdfPreviewModal({
  open,
  title,
  pdfUrl,
  pageCount,
  theme,
  onClose,
}: AssessmentPdfPreviewModalProps) {
  const closeButtonRef =
    useRef<HTMLButtonElement | null>(
      null
    );


  useEffect(() => {
    if (
      !open
    ) {
      return;
    }


    const previouslyFocused =
      document.activeElement instanceof
        HTMLElement
        ? document.activeElement
        : null;


    closeButtonRef.current?.focus();


    function handleKeyDown(
      event:
        KeyboardEvent
    ) {
      if (
        event.key ===
        "Escape"
      ) {
        event.preventDefault();

        onClose();
      }
    }


    window.addEventListener(
      "keydown",
      handleKeyDown
    );


    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );


      previouslyFocused?.focus();
    };
  }, [
    open,
    onClose,
  ]);


  if (
    !open ||
    typeof document ===
      "undefined"
  ) {
    return null;
  }


  const pageCountText =
    pageCount ===
      null
      ? "PDF preview"
      : pageCount ===
          1
        ? "1 page"
        : `${pageCount} pages`;


  return createPortal(
    <div
      role="presentation"
      onMouseDown={
        onClose
      }
      style={{
        position:
          "fixed",

        inset:
          0,

        zIndex:
          2000,

        padding:
          24,

        boxSizing:
          "border-box",

        display:
          "flex",

        alignItems:
          "center",

        justifyContent:
          "center",

        background:
          "rgba(0, 0, 0, 0.72)",

        animation:
          "assessment-pdf-preview-backdrop-in 140ms ease-out",
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="assessment-pdf-preview-title"
        onMouseDown={
          (
            event
          ) => {
            event.stopPropagation();
          }
        }
        style={{
          width:
            "min(860px, calc(100vw - 48px))",

          height:
            "calc(100vh - 48px)",

          maxHeight:
            1000,

          minWidth:
            0,

          minHeight:
            0,

          display:
            "grid",

          gridTemplateRows:
            "44px minmax(0, 1fr)",

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

          boxShadow:
            theme.shadowStrong,

          overflow:
            "hidden",

          animation:
            "assessment-pdf-preview-panel-in 150ms ease-out",
        }}
      >
        <header
          style={{
            minWidth:
              0,

            padding:
              "0 8px 0 12px",

            display:
              "flex",

            alignItems:
              "center",

            justifyContent:
              "space-between",

            gap:
              12,

            borderBottomWidth:
              1,

            borderBottomStyle:
              "solid",

            borderBottomColor:
              theme.borderStandard,

            background:
              theme.bgElevated,
          }}
        >
          <div
            style={{
              minWidth:
                0,

              display:
                "flex",

              alignItems:
                "baseline",

              gap:
                8,
            }}
          >
            <div
              id="assessment-pdf-preview-title"
              title={
                title
              }
              style={{
                minWidth:
                  0,

                overflow:
                  "hidden",

                whiteSpace:
                  "nowrap",

                textOverflow:
                  "ellipsis",

                color:
                  theme.textPrimary,

                fontSize:
                  13,

                fontWeight:
                  600,
              }}
            >
              {title}
            </div>

            <div
              style={{
                flexShrink:
                  0,

                color:
                  theme.textMuted,

                fontSize:
                  11,

                whiteSpace:
                  "nowrap",
              }}
            >
              {pageCountText}
            </div>
          </div>


          <button
            ref={
              closeButtonRef
            }
            type="button"
            aria-label="Close PDF preview"
            title="Close preview"
            onClick={
              onClose
            }
            style={{
              width:
                30,

              height:
                30,

              padding:
                0,

              flexShrink:
                0,

              display:
                "grid",

              placeItems:
                "center",

              borderWidth:
                1,

              borderStyle:
                "solid",

              borderColor:
                "transparent",

              borderRadius:
                5,

              background:
                "transparent",

              color:
                theme.textSecondary,

              cursor:
                "pointer",

              fontSize:
                18,

              lineHeight:
                1,
            }}
            onMouseEnter={
              (
                event
              ) => {
                event.currentTarget.style.background =
                  theme.controlBgHover;

                event.currentTarget.style.borderColor =
                  theme.borderStandard;
              }
            }
            onMouseLeave={
              (
                event
              ) => {
                event.currentTarget.style.background =
                  "transparent";

                event.currentTarget.style.borderColor =
                  "transparent";
              }
            }
          >
            ×
          </button>
        </header>


        <div
          style={{
            minWidth:
              0,

            minHeight:
              0,

            overflowY:
              "auto",

            overflowX:
              "hidden",

            padding:
              10,

            boxSizing:
              "border-box",

            overscrollBehavior:
              "contain",

            scrollbarWidth:
              "thin",

            scrollbarColor:
              `${theme.scrollbarThumb} transparent`,

            background:
              theme.bgWorkspace,
          }}
        >
          <AssessmentPdfCanvasViewer
            pdfUrl={
              pdfUrl
            }
          />
        </div>
      </section>


      <style>
        {`
          @keyframes assessment-pdf-preview-backdrop-in {
            from {
              opacity: 0;
            }

            to {
              opacity: 1;
            }
          }

          @keyframes assessment-pdf-preview-panel-in {
            from {
              opacity: 0;
              transform: scale(0.985);
            }

            to {
              opacity: 1;
              transform: scale(1);
            }
          }
        `}
      </style>
    </div>,
    document.body
  );
}