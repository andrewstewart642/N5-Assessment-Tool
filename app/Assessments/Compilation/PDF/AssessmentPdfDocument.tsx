import type {
  AssessmentCompilationDocument,
} from "../Model/AssessmentCompilationDocument";

import {
  getCourseDocumentSet,
} from "@/app/Courses/Documents/CourseDocumentRegistry";

import AssessmentCompiledPage from "../Rendering/AssessmentCompiledPage";


export default function AssessmentPdfDocument({
  document,
}: {
  document:
    AssessmentCompilationDocument;
}) {
  const courseDocuments =
    getCourseDocumentSet(
      document.courseId
    );


  if (
    !courseDocuments
  ) {
    throw new Error(
      `Printable document templates are not registered for ${document.courseDisplayName}.`
    );
  }


  return (
    <div className="assessment-pdf-root">
      {document.papers.map(
        (
          paper
        ) =>
          paper.pages.map(
            (
              page,
              pageIndex
            ) => (
              <div
                className="assessment-pdf-page"
                key={`${paper.paper}-${page.pageNumber}-${page.kind}`}
                data-pdf-paper={
                  paper.paper
                }
                data-pdf-page={
                  page.pageNumber
                }
              >
                <AssessmentCompiledPage
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
                    1
                  }
                />
              </div>
            )
          )
      )}
    </div>
  );
}