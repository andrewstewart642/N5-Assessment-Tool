import type {
  AssessmentCompilationDocument,
  AssessmentCompilationPage,
  AssessmentCompilationPaper,
} from "../Model/AssessmentCompilationDocument";

import {
  getCourseDocumentSet,
} from "@/app/Courses/Documents/CourseDocumentRegistry";

import AssessmentCompiledQuestion from "./AssessmentCompiledQuestion";


type AssessmentCompiledPageProps = {
  document:
    AssessmentCompilationDocument;

  paper:
    AssessmentCompilationPaper;

  page:
    AssessmentCompilationPage;

  pageIndex:
    number;

  viewerScale:
    number;
};


export default function AssessmentCompiledPage({
  document,
  paper,
  page,
  pageIndex,
  viewerScale,
}: AssessmentCompiledPageProps) {
  const documents =
    getCourseDocumentSet(
      document.courseId
    );


  if (
    !documents
  ) {
    return null;
  }


  const {
    CoverPage,
    FormulaSheet,
    QuestionPage,
  } =
    documents;


  if (
    page.kind ===
    "cover"
  ) {
    return (
      <CoverPage
        pageNumber={
          page.pageNumber
        }
        paper={
          paper.paper
        }
        totalMarks={
          paper.totalMarks
        }
        showDateTime={
          paper.showDateTime
        }
        dateText={
          paper.dateText
        }
        timeText={
          paper.timeText
        }
        subjectName={
          document.printSubjectName
        }
        qualificationBadge={
          document.printQualificationBadge
        }
        qualificationLabelLines={
          document.printQualificationLabelLines
        }
        paperTitle={
          paper.printTitle
        }
        coverInstructionText={
          paper.coverInstructionText
        }
        showNoCalculatorIcon={
          paper.showNoCalculatorIcon
        }
        showScottishCandidateNumberBox={
          document.showScottishCandidateNumberBox
        }
        viewerScale={
          viewerScale
        }
        outerPaddingPx={
          0
        }
      />
    );
  }


  if (
    page.kind ===
    "formula"
  ) {
    return (
      <FormulaSheet
        pageNumber={
          page.pageNumber
        }
        viewerScale={
          viewerScale
        }
        outerPaddingPx={
          0
        }
      />
    );
  }


  const showTurnOver =
    pageIndex <
    paper.pages.length -
      1;


  if (
    page.kind ===
    "empty"
  ) {
    return (
      <QuestionPage
        paper={
          paper.paper
        }
        pageNumber={
          page.pageNumber
        }
        totalMarks={
          paper.totalMarks
        }
        isFirstQuestionPage
        showTurnOver={
          false
        }
        viewerScale={
          viewerScale
        }
        outerPaddingPx={
          0
        }
      />
    );
  }


  return (
    <QuestionPage
      paper={
        paper.paper
      }
      pageNumber={
        page.pageNumber
      }
      totalMarks={
        paper.totalMarks
      }
      isFirstQuestionPage={
        page.questionPageIndex ===
        0
      }
      showTurnOver={
        showTurnOver
      }
      viewerScale={
        viewerScale
      }
      outerPaddingPx={
        0
      }
    >
      <div
        style={{
          display:
            "grid",

          gap:
            2,
        }}
      >
        {page.questions.map(
          (
            question,
            index
          ) => (
            <AssessmentCompiledQuestion
              key={
                question.id
              }
              index={
                page.questionStartIndex +
                index
              }
              question={
                question
              }
              courseId={
                document.courseId
              }
            />
          )
        )}
      </div>
    </QuestionPage>
  );
}