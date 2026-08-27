import type {
  SavedAssessment,
} from "@/app/Assessments/SavedAssessments/SavedAssessment";

import {
  A4_PAGE_HEIGHT_PX,
  A4_PAGE_WIDTH_PX,
} from "@/app/UI/Documents/Layout/DocumentUnits";

import {
  buildAssessmentCompilationDocument,
} from "../Model/buildAssessmentCompilationDocument";

import {
  buildAssessmentPdfHtml,
} from "./AssessmentPdfHtml";

import {
  launchAssessmentPdfBrowser,
} from "./AssessmentPdfBrowser";


export type GeneratedAssessmentPdf = {
  bytes:
    Uint8Array;

  filename:
    string;

  pageCount:
    number;
};


function buildPdfFilename(
  assessmentName:
    string
): string {
  const cleaned =
    assessmentName
      .normalize(
        "NFKD"
      )
      .replace(
        /[^\x20-\x7E]/g,
        ""
      )
      .replace(
        /[<>:"/\\|?*\x00-\x1F]/g,
        ""
      )
      .replace(
        /\s+/g,
        " "
      )
      .trim();


  const baseName =
    cleaned
      .replace(
        /^\[|\]$/g,
        ""
      )
      .trim() ||
    "Assessment";


  return `${baseName}.pdf`;
}


export async function generateAssessmentPdf(
  savedAssessment:
    SavedAssessment
): Promise<GeneratedAssessmentPdf> {
  /*
   * Deliberately named compilationDocument rather
   * than document.
   *
   * The browser page evaluated below has its own
   * global DOM `document`.
   */
  const compilationDocument =
    buildAssessmentCompilationDocument(
      savedAssessment
    );


  const html =
    await buildAssessmentPdfHtml(
      compilationDocument
    );


  const browser =
    await launchAssessmentPdfBrowser();


  try {
    const page =
      await browser.newPage();


    await page.setViewport({
      width:
        A4_PAGE_WIDTH_PX,

      height:
        A4_PAGE_HEIGHT_PX,

      deviceScaleFactor:
        1,
    });


    await page.emulateMediaType(
      "print"
    );


    await page.setContent(
      html,
      {
        waitUntil:
          "load",

        timeout:
          30_000,
      }
    );


    /*
     * Wait for embedded KaTeX fonts to finish
     * resolving before Chromium prints the page.
     *
     * This `document` is the browser DOM document,
     * not our AssessmentCompilationDocument.
     */
    await page.evaluate(
      async () => {
        await document.fonts.ready;
      }
    );


    const pdfBytes =
      await page.pdf({
        format:
          "A4",

        printBackground:
          true,

        preferCSSPageSize:
          true,

        displayHeaderFooter:
          false,

        margin: {
          top:
            "0mm",

          right:
            "0mm",

          bottom:
            "0mm",

          left:
            "0mm",
        },
      });


    const pageCount =
      compilationDocument.papers.reduce(
        (
          total,
          paper
        ) =>
          total +
          paper.pages.length,
        0
      );


    return {
      /*
       * Normalise Puppeteer's typed array into
       * an ordinary Uint8Array owned by this
       * application boundary.
       */
      bytes:
        new Uint8Array(
          pdfBytes
        ),

      filename:
        buildPdfFilename(
          compilationDocument
            .assessmentName
        ),

      pageCount,
    };
  } finally {
    await browser.close();
  }
}