import {
  prerenderToNodeStream,
} from "react-dom/static";

import type {
  AssessmentCompilationDocument,
} from "../Model/AssessmentCompilationDocument";

import AssessmentPdfDocument from "./AssessmentPdfDocument";

import {
  getEmbeddedKatexCss,
} from "./AssessmentPdfKatexStyles";


function escapeHtml(
  value:
    string
): string {
  return value
    .replaceAll(
      "&",
      "&amp;"
    )
    .replaceAll(
      "<",
      "&lt;"
    )
    .replaceAll(
      ">",
      "&gt;"
    )
    .replaceAll(
      "\"",
      "&quot;"
    )
    .replaceAll(
      "'",
      "&#039;"
    );
}


async function renderAssessmentPdfMarkup(
  document:
    AssessmentCompilationDocument
): Promise<string> {
  const {
    prelude,
  } =
    await prerenderToNodeStream(
      <AssessmentPdfDocument
        document={
          document
        }
      />
    );


  let markup =
    "";


  for await (
    const chunk
    of prelude
  ) {
    if (
      typeof chunk ===
      "string"
    ) {
      markup +=
        chunk;

      continue;
    }


    markup +=
      Buffer.from(
        chunk
      ).toString(
        "utf8"
      );
  }


  return markup;
}


export async function buildAssessmentPdfHtml(
  document:
    AssessmentCompilationDocument
): Promise<string> {
  const [
    katexCss,
    documentMarkup,
  ] =
    await Promise.all([
      getEmbeddedKatexCss(),

      renderAssessmentPdfMarkup(
        document
      ),
    ]);


  const title =
    escapeHtml(
      document.assessmentName
    );


  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta
  name="viewport"
  content="width=device-width, initial-scale=1"
/>

<title>${title}</title>

<style>
${katexCss}

@page {
  size: A4;
  margin: 0;
}

html,
body {
  margin: 0;
  padding: 0;
  width: 210mm;
  background: #ffffff;
}

html {
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

body {
  font-family:
    "Helvetica Neue",
    Helvetica,
    Arial,
    sans-serif;
}

.assessment-pdf-root {
  width: 210mm;
  margin: 0;
  padding: 0;
}

.assessment-pdf-page {
  position: relative;

  width: 210mm;
  height: 297mm;

  margin: 0;
  padding: 0;

  overflow: hidden;

  break-after: page;
  page-break-after: always;
}

.assessment-pdf-page:last-child {
  break-after: auto;
  page-break-after: auto;
}

.assessment-pdf-page * {
  box-shadow: none !important;
}
</style>
</head>

<body>
${documentMarkup}
</body>
</html>`;
}