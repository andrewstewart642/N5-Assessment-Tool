"use client";


type PdfJsModule =
  typeof import(
    "pdfjs-dist"
  );


let pdfJsPromise:
  Promise<PdfJsModule> | null =
    null;


export function loadAssessmentPdfJs():
  Promise<PdfJsModule> {
  if (
    pdfJsPromise
  ) {
    return pdfJsPromise;
  }


  pdfJsPromise =
    import(
      "pdfjs-dist"
    ).then(
      (
        pdfJs
      ) => {
        if (
          !pdfJs
            .GlobalWorkerOptions
            .workerSrc
        ) {
          pdfJs
            .GlobalWorkerOptions
            .workerSrc =
            new URL(
              "pdfjs-dist/build/pdf.worker.min.mjs",
              import.meta.url
            ).toString();
        }


        return pdfJs;
      }
    );


  return pdfJsPromise;
}