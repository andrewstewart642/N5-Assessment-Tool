
import type {
  Question,
} from "@/shared-types/AssessmentTypes";

import {
  UI_TYPO,
} from "@/src/UI/Application/Typography/Typography";

import PaperContent from "@/src/UI/Documents/Components/PaperContent";

import {
  QUESTION_COLUMN_GAP_PX,
  QUESTION_MARKS_COLUMN_PX,
  QUESTION_NUMBER_COLUMN_PX,
} from "@/src/Assessments/Questions/Preview/QuestionPreviewLayout";

function splitAtFirstEquals(
  value: string
): {
  left: string;
  right: string;
} | null {
  const cleaned =
    value.trim();

  const index =
    cleaned.indexOf("=");

  if (index < 0) {
    return null;
  }

  return {
    left:
      cleaned
        .slice(
          0,
          index
        )
        .trim(),

    right:
      cleaned
        .slice(
          index + 1
        )
        .trim(),
  };
}

function looksLikeFractionMath(
  value: string
): boolean {
  return (
    /\d+\s*\/\s*\d+/.test(
      value
    ) &&
    !/[A-Za-z£%]/.test(
      value
    )
  );
}

function expressionToLatex(
  expression: string
): string {
  const cleaned =
    expression
      .replace(
        /\.$/,
        ""
      )
      .replace(
        /\s+/g,
        " "
      )
      .trim();

  if (!cleaned) {
    return "";
  }

  const tokens =
    cleaned
      .split(
        /(\d+\s+\d+\/\d+|\d+\/\d+|[=()+−+\-×÷])/g
      )
      .map(
        (token) =>
          token.trim()
      )
      .filter(
        Boolean
      );

  return tokens
    .map(
      (token) => {
        const mixedMatch =
          token.match(
            /^(\d+)\s+(\d+)\/(\d+)$/
          );

        if (mixedMatch) {
          const [
            ,
            whole,
            numerator,
            denominator,
          ] =
            mixedMatch;

          return (
            `${whole}\\,\\dfrac{${numerator}}{${denominator}}`
          );
        }

        const fractionMatch =
          token.match(
            /^(\d+)\/(\d+)$/
          );

        if (fractionMatch) {
          const [
            ,
            numerator,
            denominator,
          ] =
            fractionMatch;

          return (
            `\\dfrac{${numerator}}{${denominator}}`
          );
        }

        if (
          token === "×"
        ) {
          return "\\times";
        }

        if (
          token === "÷"
        ) {
          return "\\div";
        }

        if (
          token === "−" ||
          token === "-"
        ) {
          return "-";
        }

        if (
          token === "+"
        ) {
          return "+";
        }

        if (
          token === "="
        ) {
          return "=";
        }

        if (
          token === "("
        ) {
          return "\\left(";
        }

        if (
          token === ")"
        ) {
          return "\\right)";
        }

        return token;
      }
    )
    .join(
      " "
    );
}

function MathExpression({
  value,
}: {
  value: string;
}) {
  if (!value) {
    return null;
  }

  return (
    <PaperContent
      parts={[
        {
          kind:
            "math",

          latex:
            expressionToLatex(
              value
            ),
        },
      ]}
    />
  );
}

type WorkedAnswerPreviewProps = {
  question:
    Question;

  onMethodChange: (
    questionId: string,
    methodFamilyId: string
  ) => void;
};

export default function WorkedAnswerPreview({
  question,
  onMethodChange,
}: WorkedAnswerPreviewProps) {
  const answerSet =
    question.workedAnswers;

  if (
    !answerSet ||
    answerSet.methods.length === 0
  ) {
    return null;
  }

  const preferredMethod =
    question
      .preferredAnswerMethodFamilyId;

  const selectedMethod =
    answerSet.methods.find(
      (method) =>
        method.methodFamilyId ===
        preferredMethod
    ) ??
    answerSet.methods.find(
      (method) =>
        method.methodFamilyId ===
        answerSet.defaultMethodFamilyId
    ) ??
    answerSet.methods[0];

  const selectedIndex =
    answerSet.methods.findIndex(
      (method) =>
        method.methodFamilyId ===
        selectedMethod.methodFamilyId
    );

  const canCycle =
    answerSet.methods.length > 1;

  const cycleMethod = () => {
    if (!canCycle) {
      return;
    }

    const nextIndex =
      (
        selectedIndex + 1
      ) %
      answerSet.methods.length;

    const nextMethod =
      answerSet.methods[
        nextIndex
      ];

    onMethodChange(
      question.id,
      nextMethod.methodFamilyId
    );
  };

  return (
    <div
      style={{
        position:
          "absolute",

        top:
          12,

        left:
          QUESTION_NUMBER_COLUMN_PX +
          QUESTION_COLUMN_GAP_PX,

        right:
          QUESTION_MARKS_COLUMN_PX +
          QUESTION_COLUMN_GAP_PX,

        fontFamily:
          UI_TYPO.family,

        color:
          "rgba(15, 23, 42, 0.56)",
      }}
    >
      {canCycle ? (
        <button
          type="button"
          aria-label="Cycle answer method"
          onClick={
            cycleMethod
          }
          style={{
            position:
              "absolute",

            top:
              0,

            right:
              0,

            height:
              24,

            padding:
              "0 7px",

            border:
              "1px solid rgba(15,23,42,0.18)",

            borderRadius:
              7,

            background:
              "rgba(255,255,255,0.78)",

            color:
              "rgba(15,23,42,0.58)",

            cursor:
              "pointer",

            fontFamily:
              UI_TYPO.family,

            fontSize:
              10,

            fontWeight:
              UI_TYPO.weightSemibold,

            lineHeight:
              1,

            whiteSpace:
              "nowrap",
          }}
        >
          Method ↻
        </button>
      ) : null}

      <div
        style={{
          display:
            "grid",

          gap:
            7,

          paddingRight:
            canCycle
              ? 76
              : 0,

          fontSize:
            13,

          fontWeight:
            UI_TYPO.weightMedium,

          lineHeight:
            1.45,
        }}
      >
        <div
          style={{
            display:
              "table",

            borderCollapse:
              "separate",

            borderSpacing:
              "0 7px",
          }}
        >
          {selectedMethod.lines.map(
            (line) => {
              const firstPart =
                line.parts[0];

              const isSingleTextPart =
                line.parts.length ===
                  1 &&
                firstPart?.kind ===
                  "text";

              const textValue =
                isSingleTextPart
                  ? firstPart.value
                  : null;

              const isFractionMath =
                textValue !== null &&
                looksLikeFractionMath(
                  textValue
                );

              const equation =
                isFractionMath
                  ? splitAtFirstEquals(
                      textValue
                    )
                  : null;

              if (equation) {
                return (
                  <div
                    key={
                      line.id
                    }
                    style={{
                      display:
                        "table-row",
                    }}
                  >
                    <div
                      style={{
                        display:
                          "table-cell",

                        textAlign:
                          "right",

                        whiteSpace:
                          "nowrap",

                        verticalAlign:
                          "middle",
                      }}
                    >
                      <MathExpression
                        value={
                          equation.left
                        }
                      />
                    </div>

                    <div
                      style={{
                        display:
                          "table-cell",

                        paddingLeft:
                          7,

                        paddingRight:
                          7,

                        textAlign:
                          "center",

                        whiteSpace:
                          "nowrap",

                        verticalAlign:
                          "middle",
                      }}
                    >
                      <MathExpression
                        value="="
                      />
                    </div>

                    <div
                      style={{
                        display:
                          "table-cell",

                        whiteSpace:
                          "nowrap",

                        verticalAlign:
                          "middle",
                      }}
                    >
                      <MathExpression
                        value={
                          equation.right
                        }
                      />
                    </div>
                  </div>
                );
              }

              if (
                isFractionMath &&
                textValue
              ) {
                return (
                  <div
                    key={
                      line.id
                    }
                    style={{
                      display:
                        "table-row",
                    }}
                  >
                    <div
                      style={{
                        display:
                          "table-cell",

                        whiteSpace:
                          "nowrap",

                        verticalAlign:
                          "middle",
                      }}
                    >
                      <MathExpression
                        value={
                          textValue
                        }
                      />
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={
                    line.id
                  }
                  style={{
                    display:
                      "table-row",
                  }}
                >
                  <div
                    style={{
                      display:
                        "table-cell",
                    }}
                  >
                    <PaperContent
                      parts={
                        line.parts
                      }
                    />
                  </div>
                </div>
              );
            }
          )}
        </div>
      </div>
    </div>
  );
}