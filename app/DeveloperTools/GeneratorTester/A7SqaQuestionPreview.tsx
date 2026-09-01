"use client";

import type { PaperPart } from "@/app/Assessments/Questions/Content/PaperParts";
import PaperContent from "@/app/UI/Documents/Components/PaperContent";
import type { A7GeneratedQuestion } from "../../Courses/National5Maths/03_QuestionGeneration/02-Algebraic/ALG-A7-LinearEquations";
import { fractionalEquationLatex } from "../../Courses/National5Maths/03_QuestionGeneration/02-Algebraic/ALG-A7-LinearEquations/PromptGrammar";
import A7AreaPreview from "./A7AreaPreview";

type Props = {
  question: A7GeneratedQuestion;
  questionNumber?: number;
};

const mathParts = (latex: string, displayMode = false): PaperPart[] => [
  { kind: "math", latex, displayMode },
];

function MarkColumn({ marks }: { marks: number }) {
  return (
    <div
      style={{
        minWidth: 50,
        textAlign: "center",
        fontWeight: 700,
        fontSize: "11pt",
        lineHeight: 1.2,
      }}
    >
      {marks}
    </div>
  );
}

function SqaHeaderMarks() {
  return (
    <div
      style={{
        gridColumn: 3,
        justifySelf: "center",
        alignSelf: "end",
        paddingBottom: 4,
        fontSize: "8.5pt",
        fontWeight: 700,
        letterSpacing: "0.01em",
      }}
    >
      MARKS
    </div>
  );
}

function FractionalQuestion({
  question,
  questionNumber,
}: {
  question: Extract<A7GeneratedQuestion, { family: "FRACTIONAL_COEFFICIENT" }>;
  questionNumber: number;
}) {
  const equation = fractionalEquationLatex(question.mathState);
  // The reviewed corpus uses both an inline equation (2019/2025) and a
  // centred equation on the next line (2016). Keep both source-like layouts
  // in the tester so presentation is checked as well as mathematics.
  const inlineEquation = question.mathState.surfaceVariant === "BINOMIAL_LEFT_NUMERATOR" || question.seed % 2 === 0;

  if (inlineEquation) {
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "38px minmax(0, 1fr) 54px",
          columnGap: 8,
          rowGap: 14,
          alignItems: "baseline",
        }}
      >
        <SqaHeaderMarks />
        <div style={{ gridColumn: 1, gridRow: 2, fontWeight: 700 }}>{questionNumber}.</div>
        <div
          style={{
            gridColumn: 2,
            gridRow: 2,
            display: "flex",
            gap: 7,
            alignItems: "baseline",
            flexWrap: "wrap",
            minWidth: 0,
          }}
        >
          <span>Solve the equation</span>
          <span style={{ whiteSpace: "nowrap" }}>
            <PaperContent parts={mathParts(equation)} />
          </span>
        </div>
        <div style={{ gridColumn: 3, gridRow: 2, justifySelf: "center" }}>
          <MarkColumn marks={question.marks} />
        </div>
        <div style={{ gridColumn: 2, gridRow: 3, paddingTop: 6 }}>
          Give your answer in its simplest form.
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "38px minmax(0, 1fr) 54px",
        columnGap: 8,
        rowGap: 12,
        alignItems: "start",
      }}
    >
      <SqaHeaderMarks />
      <div style={{ gridColumn: 1, gridRow: 2, fontWeight: 700 }}>{questionNumber}.</div>
      <div style={{ gridColumn: 2, gridRow: 2 }}>Solve the equation</div>
      <div
        style={{
          gridColumn: 2,
          gridRow: 3,
          width: "min(360px, 80%)",
          margin: "8px auto 10px",
          textAlign: "center",
          fontSize: "12pt",
          overflow: "visible",
        }}
      >
        <PaperContent parts={mathParts(equation, true)} />
      </div>
      <div style={{ gridColumn: 2, gridRow: 4, paddingTop: 2 }}>
        Give your answer in its simplest form.
      </div>
      <div style={{ gridColumn: 3, gridRow: 4, justifySelf: "center" }}>
        <MarkColumn marks={question.marks} />
      </div>
    </div>
  );
}

function ContextQuestion({
  question,
  questionNumber,
}: {
  question: Extract<A7GeneratedQuestion, { family: "CONTEXT_AREA_EQUALITY" }>;
  questionNumber: number;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "38px minmax(0, 1fr) 54px",
        columnGap: 8,
        rowGap: 12,
        alignItems: "start",
      }}
    >
      <SqaHeaderMarks />
      <div style={{ gridColumn: 1, gridRow: 2, fontWeight: 700 }}>{questionNumber}.</div>
      <div style={{ gridColumn: 2, gridRow: 2 }}>
        A triangle and a rectangle are shown in the diagram.
      </div>

      <div style={{ gridColumn: "2 / 4", gridRow: 3, paddingRight: 16 }}>
        <A7AreaPreview visual={question.visual} />
      </div>

      <div style={{ gridColumn: 1, gridRow: 4, textAlign: "right" }}>(a)</div>
      <div style={{ gridColumn: 2, gridRow: 4 }}>
        Find an expression, in terms of <em>x</em>, for the area of the triangle.
      </div>
      <div style={{ gridColumn: 3, gridRow: 4, justifySelf: "center" }}>
        <MarkColumn marks={1} />
      </div>

      <div style={{ gridColumn: 1, gridRow: 5, textAlign: "right" }}>(b)</div>
      <div style={{ gridColumn: 2, gridRow: 5 }}>
        The triangle and rectangle have equal areas. Find the value of <em>x</em> algebraically.
      </div>
      <div style={{ gridColumn: 3, gridRow: 5, justifySelf: "center" }}>
        <MarkColumn marks={4} />
      </div>
    </div>
  );
}

export default function A7SqaQuestionPreview({ question, questionNumber = 1 }: Props) {
  return (
    <div
      className="a7-sqa-preview"
      style={{
        width: "100%",
        minHeight: question.family === "CONTEXT_AREA_EQUALITY" ? 430 : 200,
        padding: question.family === "CONTEXT_AREA_EQUALITY" ? "22px 24px 26px" : "22px 24px 30px",
        background: "#ffffff",
        color: "#111111",
        borderRadius: 2,
        fontFamily: "Arial, Helvetica, sans-serif",
        fontSize: "11.5pt",
        lineHeight: 1.45,
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      {question.family === "FRACTIONAL_COEFFICIENT" ? (
        <FractionalQuestion question={question} questionNumber={questionNumber} />
      ) : (
        <ContextQuestion question={question} questionNumber={questionNumber} />
      )}
    </div>
  );
}
