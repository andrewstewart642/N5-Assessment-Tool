import type {
  SavedAssessment,
} from "@/app/Assessments/SavedAssessments/SavedAssessment";

import {
  generateAssessmentPdf,
} from "../generateAssessmentPdf";


export const runtime =
  "nodejs";


export const dynamic =
  "force-dynamic";


function isRecord(
  value:
    unknown
): value is Record<
  string,
  unknown
> {
  return (
    value !==
      null &&
    typeof value ===
      "object" &&
    !Array.isArray(
      value
    )
  );
}


function isSavedAssessmentPayload(
  value:
    unknown
): value is SavedAssessment {
  if (
    !isRecord(
      value
    )
  ) {
    return false;
  }


  if (
    typeof value.id !==
      "string" ||
    !isRecord(
      value.setup
    ) ||
    !isRecord(
      value.builder
    )
  ) {
    return false;
  }


  return Array.isArray(
    value.builder
      .questions
  );
}


export async function POST(
  request:
    Request
) {
  try {
    const body =
      await request.json() as unknown;


    if (
      !isRecord(
        body
      )
    ) {
      return Response.json(
        {
          error:
            "Invalid PDF request.",
        },
        {
          status:
            400,
        }
      );
    }


    const savedAssessment =
      body.savedAssessment;


    if (
      !isSavedAssessmentPayload(
        savedAssessment
      )
    ) {
      return Response.json(
        {
          error:
            "A valid saved assessment is required.",
        },
        {
          status:
            400,
        }
      );
    }


    const generated =
      await generateAssessmentPdf(
        savedAssessment
      );


    /*
     * Explicit copy gives this Uint8Array an
     * ArrayBuffer-backed type that satisfies
     * the DOM BodyInit definition used by
     * Next/TypeScript.
     */
    const responseBytes =
      new Uint8Array(
        generated.bytes
      );


    return new Response(
      responseBytes,
      {
        status:
          200,

        headers: {
          "Content-Type":
            "application/pdf",

          "Content-Length":
            String(
              responseBytes
                .byteLength
            ),

          "Content-Disposition":
            `attachment; filename="${generated.filename}"`,

          "Cache-Control":
            "no-store",

          "X-Assessment-Pdf-Pages":
            String(
              generated.pageCount
            ),
        },
      }
    );
  } catch (
    error
  ) {
    console.error(
      "Assessment PDF generation failed.",
      error
    );


    return Response.json(
      {
        error:
          error instanceof
            Error
            ? error.message
            : "Unable to generate the assessment PDF.",
      },
      {
        status:
          500,
      }
    );
  }
}