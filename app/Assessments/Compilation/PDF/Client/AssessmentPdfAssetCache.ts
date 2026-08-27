import type {
  SavedAssessment,
} from "@/app/Assessments/SavedAssessments/SavedAssessment";


export type AssessmentPdfAsset = {
  key:
    string;

  assessmentId:
    string;

  sourceUpdatedAt:
    number;

  blob:
    Blob;

  objectUrl:
    string;

  filename:
    string;

  pageCount:
    number | null;
};


type AssessmentPdfCacheEntry = {
  assessmentId:
    string;

  promise:
    Promise<AssessmentPdfAsset>;
};


const pdfAssetCache =
  new Map<
    string,
    AssessmentPdfCacheEntry
  >();


/*
 * PDF generation launches Chromium on the server.
 *
 * Serialising first-time tile requests prevents
 * several visible assessments from each launching
 * a generation job at exactly the same moment.
 */
let generationQueue:
  Promise<void> =
    Promise.resolve();


function getAssessmentPdfCacheKey(
  savedAssessment:
    SavedAssessment
): string {
  return [
    savedAssessment.id,
    savedAssessment.updatedAt,
  ].join(
    ":"
  );
}


function readFilename(
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


function readPageCount(
  value:
    string | null
): number | null {
  if (
    !value
  ) {
    return null;
  }


  const parsed =
    Number(
      value
    );


  if (
    !Number.isInteger(
      parsed
    ) ||
    parsed <=
      0
  ) {
    return null;
  }


  return parsed;
}


async function readGenerationError(
  response:
    Response
): Promise<string> {
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
      return body.error;
    }
  } catch {
    // Fall through to generic error.
  }


  return "Unable to generate assessment PDF.";
}


function enqueueGeneration<T>(
  task:
    () => Promise<T>
): Promise<T> {
  const run =
    generationQueue.then(
      task,
      task
    );


  generationQueue =
    run.then(
      () => undefined,
      () => undefined
    );


  return run;
}


async function generateAssessmentPdfAsset(
  savedAssessment:
    SavedAssessment
): Promise<AssessmentPdfAsset> {
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
    throw new Error(
      await readGenerationError(
        response
      )
    );
  }


  const blob =
    await response.blob();


  if (
    blob.size <=
    0
  ) {
    throw new Error(
      "The generated assessment PDF was empty."
    );
  }


  const objectUrl =
    URL.createObjectURL(
      blob
    );


  return {
    key:
      getAssessmentPdfCacheKey(
        savedAssessment
      ),

    assessmentId:
      savedAssessment.id,

    sourceUpdatedAt:
      savedAssessment.updatedAt,

    blob,

    objectUrl,

    filename:
      readFilename(
        response.headers.get(
          "Content-Disposition"
        )
      ),

    pageCount:
      readPageCount(
        response.headers.get(
          "X-Assessment-Pdf-Pages"
        )
      ),
  };
}


function discardStaleAssessmentAssets({
  assessmentId,
  activeKey,
}: {
  assessmentId:
    string;

  activeKey:
    string;
}) {
  for (
    const [
      cacheKey,
      entry,
    ]
    of pdfAssetCache
  ) {
    if (
      entry.assessmentId !==
        assessmentId ||
      cacheKey ===
        activeKey
    ) {
      continue;
    }


    pdfAssetCache.delete(
      cacheKey
    );


    void entry.promise.then(
      (
        asset
      ) => {
        URL.revokeObjectURL(
          asset.objectUrl
        );
      },
      () => {
        // Failed assets have no object URL.
      }
    );
  }
}


export function getAssessmentPdfAsset(
  savedAssessment:
    SavedAssessment
): Promise<AssessmentPdfAsset> {
  if (
    typeof window ===
    "undefined"
  ) {
    return Promise.reject(
      new Error(
        "Assessment PDF assets can only be requested in the browser."
      )
    );
  }


  const key =
    getAssessmentPdfCacheKey(
      savedAssessment
    );


  const existing =
    pdfAssetCache.get(
      key
    );


  if (
    existing
  ) {
    return existing.promise;
  }


  discardStaleAssessmentAssets({
    assessmentId:
      savedAssessment.id,

    activeKey:
      key,
  });


  const promise =
    enqueueGeneration(
      () =>
        generateAssessmentPdfAsset(
          savedAssessment
        )
    );


  pdfAssetCache.set(
    key,
    {
      assessmentId:
        savedAssessment.id,

      promise,
    }
  );


  void promise.catch(
    () => {
      const current =
        pdfAssetCache.get(
          key
        );


      if (
        current?.promise ===
        promise
      ) {
        pdfAssetCache.delete(
          key
        );
      }
    }
  );


  return promise;
}


export function invalidateAssessmentPdfAsset(
  assessmentId:
    string
) {
  for (
    const [
      cacheKey,
      entry,
    ]
    of pdfAssetCache
  ) {
    if (
      entry.assessmentId !==
      assessmentId
    ) {
      continue;
    }


    pdfAssetCache.delete(
      cacheKey
    );


    void entry.promise.then(
      (
        asset
      ) => {
        URL.revokeObjectURL(
          asset.objectUrl
        );
      },
      () => {
        // Nothing to revoke.
      }
    );
  }
}