"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import type {
  PDFDocumentProxy,
  RenderTask,
} from "pdfjs-dist";

import {
  loadAssessmentPdfJs,
} from "./AssessmentPdfJs";


type AssessmentPdfCanvasPageProps = {
  pdfDocument:
    PDFDocumentProxy;

  pageNumber:
    number;

  width:
    number;
};


function AssessmentPdfCanvasPage({
  pdfDocument,
  pageNumber,
  width,
}: AssessmentPdfCanvasPageProps) {
  const canvasRef =
    useRef<HTMLCanvasElement | null>(
      null
    );


  useEffect(() => {
    const canvas =
      canvasRef.current;


    if (
      !canvas ||
      width <=
        0
    ) {
      return;
    }


    let cancelled =
      false;

    let renderTask:
      RenderTask | null =
        null;


    void pdfDocument
      .getPage(
        pageNumber
      )
      .then(
        async (
          pdfPage
        ) => {
          if (
            cancelled
          ) {
            return;
          }


          const baseViewport =
            pdfPage.getViewport({
              scale:
                1,
            });


          const cssScale =
            width /
            baseViewport.width;


          const deviceScale =
            Math.min(
              window
                .devicePixelRatio ||
                1,
              2
            );


          const renderViewport =
            pdfPage.getViewport({
              scale:
                cssScale *
                deviceScale,
            });


          const cssWidth =
            Math.round(
              baseViewport.width *
                cssScale
            );


          const cssHeight =
            Math.round(
              baseViewport.height *
                cssScale
            );


          canvas.width =
            Math.max(
              1,
              Math.round(
                renderViewport.width
              )
            );

          canvas.height =
            Math.max(
              1,
              Math.round(
                renderViewport.height
              )
            );


          canvas.style.width =
            `${cssWidth}px`;

          canvas.style.height =
            `${cssHeight}px`;


          const context =
            canvas.getContext(
              "2d",
              {
                alpha:
                  false,
              }
            );


          if (
            !context
          ) {
            return;
          }


          context.save();

          context.fillStyle =
            "#ffffff";

          context.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
          );

          context.restore();


          renderTask =
            pdfPage.render({
              canvasContext:
                context,

              viewport:
                renderViewport,

              canvas,
            });


          try {
            await renderTask.promise;
          } catch (
            error
          ) {
            if (
              cancelled
            ) {
              return;
            }


            throw error;
          }
        }
      );


    return () => {
      cancelled =
        true;


      renderTask?.cancel();
    };
  }, [
    pageNumber,
    pdfDocument,
    width,
  ]);


  return (
    <canvas
      ref={
        canvasRef
      }
      aria-label={`PDF page ${pageNumber}`}
      style={{
        display:
          "block",

        maxWidth:
          "100%",

        background:
          "#ffffff",
      }}
    />
  );
}


export default function AssessmentPdfCanvasViewer({
  pdfUrl,
}: {
  pdfUrl:
    string;
}) {
  const containerRef =
    useRef<HTMLDivElement | null>(
      null
    );


  const [
    containerWidth,
    setContainerWidth,
  ] =
    useState(
      0
    );


  const [
    pdfDocument,
    setPdfDocument,
  ] =
    useState<PDFDocumentProxy | null>(
      null
    );


  const [
    loadError,
    setLoadError,
  ] =
    useState(
      ""
    );


  useEffect(() => {
    const container =
      containerRef.current;


    if (
      container ===
      null
    ) {
      return;
    }


    function setMeasuredWidth(
      width:
        number
    ) {
      setContainerWidth(
        Math.max(
          0,
          Math.floor(
            width
          )
        )
      );
    }


    /*
     * Initial measurement.
     *
     * This happens immediately while we have
     * already proven the ref is non-null.
     */
    setMeasuredWidth(
      container
        .getBoundingClientRect()
        .width
    );


    /*
     * Subsequent measurements come directly from
     * ResizeObserverEntry rather than re-reading
     * containerRef.current inside a closure.
     *
     * This avoids the nullable-ref narrowing issue
     * entirely.
     */
    const observer =
      new ResizeObserver(
        (
          entries
        ) => {
          const entry =
            entries[0];


          if (
            !entry
          ) {
            return;
          }


          setMeasuredWidth(
            entry.contentRect.width
          );
        }
      );


    observer.observe(
      container
    );


    return () => {
      observer.disconnect();
    };
  }, []);


  useEffect(() => {
    let cancelled =
      false;

    let loadingTask:
      ReturnType<
        Awaited<
          ReturnType<
            typeof loadAssessmentPdfJs
          >
        >["getDocument"]
      > | null =
        null;


    setPdfDocument(
      null
    );

    setLoadError(
      ""
    );


    void loadAssessmentPdfJs()
      .then(
        (
          pdfJs
        ) => {
          if (
            cancelled
          ) {
            return null;
          }


          loadingTask =
            pdfJs.getDocument({
              url:
                pdfUrl,
            });


          return loadingTask.promise;
        }
      )
      .then(
        (
          loadedDocument
        ) => {
          if (
            cancelled ||
            !loadedDocument
          ) {
            return;
          }


          setPdfDocument(
            loadedDocument
          );
        }
      )
      .catch(
        (
          error
        ) => {
          if (
            cancelled
          ) {
            return;
          }


          setLoadError(
            error instanceof
              Error
              ? error.message
              : "Unable to render PDF."
          );
        }
      );


    return () => {
      cancelled =
        true;


      void loadingTask?.destroy();
    };
  }, [
    pdfUrl,
  ]);


  const pageWidth =
    Math.max(
      0,
      containerWidth -
        6
    );


  return (
    <div
      ref={
        containerRef
      }
      style={{
        width:
          "100%",

        minWidth:
          0,

        boxSizing:
          "border-box",

        padding:
          "3px",

        display:
          "grid",

        justifyItems:
          "center",

        gap:
          5,
      }}
    >
      {loadError ? (
        <div
          style={{
            padding:
              10,

            fontSize:
              10,

            lineHeight:
              1.35,

            textAlign:
              "center",

            color:
              "#8c8c8c",
          }}
        >
          Preview unavailable
        </div>
      ) : null}


      {pdfDocument &&
      pageWidth >
        0
        ? Array.from(
            {
              length:
                pdfDocument.numPages,
            },
            (
              _,
              index
            ) => (
              <AssessmentPdfCanvasPage
                key={
                  index + 1
                }
                pdfDocument={
                  pdfDocument
                }
                pageNumber={
                  index + 1
                }
                width={
                  pageWidth
                }
              />
            )
          )
        : null}
    </div>
  );
}