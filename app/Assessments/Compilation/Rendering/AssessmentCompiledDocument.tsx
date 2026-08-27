import type {
  AssessmentCompilationDocument,
} from "../Model/AssessmentCompilationDocument";

import {
  getCourseDocumentSet,
} from "@/app/Courses/Documents/CourseDocumentRegistry";

import AssessmentCompiledPage from "./AssessmentCompiledPage";


export default function AssessmentCompiledDocument({
  document,
  viewerScale =
    0.72,
}: {
  document:
    AssessmentCompilationDocument;

  viewerScale?:
    number;
}) {
  const courseDocuments =
    getCourseDocumentSet(
      document.courseId
    );


  if (
    !courseDocuments
  ) {
    return (
      <div
        style={{
          padding:
            16,

          border:
            "1px solid rgba(255,255,255,0.12)",

          borderRadius:
            6,

          color:
            "rgba(255,255,255,0.72)",
        }}
      >
        Printable document templates are not yet
        registered for{" "}
        {document.courseDisplayName}.
      </div>
    );
  }


  return (
    <div
      data-assessment-compilation-document={
        document.assessmentId
      }
      style={{
        display:
          "grid",

        gap:
          30,

        justifyItems:
          "center",
      }}
    >
      {document.papers.map(
        (
          paper
        ) => (
          <section
            key={
              paper.paper
            }
            data-assessment-compilation-paper={
              paper.paper
            }
            style={{
              display:
                "grid",

              gap:
                14,

              justifyItems:
                "center",
            }}
          >
            {paper.pages.map(
              (
                page,
                pageIndex
              ) => (
                <AssessmentCompiledPage
                  key={`${paper.paper}-${page.pageNumber}-${page.kind}`}
                  document={
                    document
                  }
                  paper={
                    paper
                  }
                  page={
                    page
                  }
                  pageIndex={
                    pageIndex
                  }
                  viewerScale={
                    viewerScale
                  }
                />
              )
            )}
          </section>
        )
      )}
    </div>
  );
}