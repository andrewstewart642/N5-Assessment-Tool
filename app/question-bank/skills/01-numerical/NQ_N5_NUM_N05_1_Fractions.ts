// app/question-bank/skills/01-numerical/NQ_N5_NUM_N05_1_Fractions.ts

import type {
  DifficultyLevel,
} from "@/shared-types/AssessmentTypes";

import type {
  PaperPart,
} from "@/shared-types/PaperParts";

import type {
  ConceptGeneratorModule,
  GeneratedQuestionData,
  GeneratorContext,
} from "@/shared-types/QuestionGenerationTypes";

import type {
  QuestionVariantSelectionMeta,
} from "@/shared-types/QuestionSelectionTypes";

import {
  generateN5MathsFractionQuestion,
  type FractionDifficulty,
  type GeneratedFractionQuestion,
} from "@/src/Courses/National5Maths/QuestionAndAnswerGeneration/QuestionWriting/Numerical/N05_Fractions/N05_1_Fractions/N05_1_FractionsQuestionWriter";

import {
  generateN5MathsFractionWorkedAnswers,
} from "@/src/Courses/National5Maths/QuestionAndAnswerGeneration/AnswerWriting/Numerical/N05_Fractions/N05_1_Fractions/N05_1_FractionsAnswerWriter";


type FractionOperationMode =
  | "AUTO"
  | "ADD"
  | "SUBTRACT"
  | "MULTIPLY"
  | "DIVIDE"
  | "BRACKETED";


const DEFAULT_FRACTION_DIFFICULTY:
  FractionDifficulty = 2;


const SIMPLEST_FORM_INSTRUCTION =
  "Give your answer in its simplest form.";


function textPart(
  value: string
): PaperPart {
  return {
    kind:
      "text",

    value,
  };
}


function mathPart(
  latex: string
): PaperPart {
  return {
    kind:
      "math",

    latex,
  };
}


function normaliseDifficulty(
  input:
    DifficultyLevel
): FractionDifficulty {
  if (
    input <= 1
  ) {
    return 1;
  }

  if (
    input === 2
  ) {
    return 2;
  }

  return 3;
}


function modeFromConceptCode(
  conceptCode:
    string
): FractionOperationMode {
  if (
    conceptCode ===
    "N5.1.1"
  ) {
    return "ADD";
  }

  if (
    conceptCode ===
    "N5.1.2"
  ) {
    return "SUBTRACT";
  }

  if (
    conceptCode ===
    "N5.1.3"
  ) {
    return "MULTIPLY";
  }

  if (
    conceptCode ===
    "N5.1.4"
  ) {
    return "DIVIDE";
  }

  if (
    conceptCode ===
    "N5.1.5"
  ) {
    return "BRACKETED";
  }

  return "AUTO";
}


function conceptLabelFromMode(
  mode:
    FractionOperationMode
): string {
  if (
    mode ===
    "ADD"
  ) {
    return (
      "Fractions add"
    );
  }

  if (
    mode ===
    "SUBTRACT"
  ) {
    return (
      "Fractions subtract"
    );
  }

  if (
    mode ===
    "MULTIPLY"
  ) {
    return (
      "Fractions multiply"
    );
  }

  if (
    mode ===
    "DIVIDE"
  ) {
    return (
      "Fractions divide"
    );
  }

  if (
    mode ===
    "BRACKETED"
  ) {
    return (
      "Bracketed fraction operations"
    );
  }

  return (
    "Fraction operations"
  );
}


function expressionToLatex(
  expression:
    string
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

  const tokens =
    cleaned
      .split(
        /(\d+\s+\d+\/\d+|\d+\/\d+|[()+−+\-×÷])/g
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

        if (
          mixedMatch
        ) {
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

        if (
          fractionMatch
        ) {
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
          token ===
          "×"
        ) {
          return (
            "\\times"
          );
        }

        if (
          token ===
          "÷"
        ) {
          return (
            "\\div"
          );
        }

        if (
          token ===
            "−" ||
          token ===
            "-"
        ) {
          return "-";
        }

        if (
          token ===
          "+"
        ) {
          return "+";
        }

        if (
          token ===
          "("
        ) {
          return (
            "\\left("
          );
        }

        if (
          token ===
          ")"
        ) {
          return (
            "\\right)"
          );
        }

        return token;
      }
    )
    .join(
      " "
    );
}


function buildPromptParts(
  generated:
    GeneratedFractionQuestion
): PaperPart[] {
  const hasSimplestFormInstruction =
    generated.questionText.includes(
      SIMPLEST_FORM_INSTRUCTION
    );

  const withoutInstruction =
    hasSimplestFormInstruction
      ? generated.questionText
          .replace(
            SIMPLEST_FORM_INSTRUCTION,
            ""
          )
          .trim()
      : generated.questionText
          .trim();

  const expressionText =
    withoutInstruction
      .replace(
        /^Evaluate\s+/i,
        ""
      )
      .replace(
        /\.$/,
        ""
      )
      .trim();

  const parts:
    PaperPart[] = [
      textPart(
        "Evaluate "
      ),

      mathPart(
        expressionToLatex(
          expressionText
        )
      ),

      textPart(
        "."
      ),
    ];

  if (
    hasSimplestFormInstruction
  ) {
    parts.push(
      textPart(
        `\n${SIMPLEST_FORM_INSTRUCTION}`
      )
    );
  }

  return parts;
}


function buildAnswerParts(
  generated:
    GeneratedFractionQuestion
): PaperPart[] {
  return [
    mathPart(
      expressionToLatex(
        generated.answerText
      )
    ),
  ];
}


function generateFractionQuestionForMode(
  mode:
    FractionOperationMode,

  difficulty:
    FractionDifficulty
): GeneratedFractionQuestion {
  if (
    mode ===
    "ADD"
  ) {
    return (
      generateN5MathsFractionQuestion({
        difficulty,
        operationType:
          "ADD",
      })
    );
  }

  if (
    mode ===
    "SUBTRACT"
  ) {
    return (
      generateN5MathsFractionQuestion({
        difficulty,
        operationType:
          "SUBTRACT",
      })
    );
  }

  if (
    mode ===
    "MULTIPLY"
  ) {
    return (
      generateN5MathsFractionQuestion({
        difficulty,
        operationType:
          "MULTIPLY",
      })
    );
  }

  if (
    mode ===
    "DIVIDE"
  ) {
    return (
      generateN5MathsFractionQuestion({
        difficulty,
        operationType:
          "DIVIDE",
      })
    );
  }

  if (
    mode ===
    "BRACKETED"
  ) {
    return (
      generateN5MathsFractionQuestion({
        difficulty,
        operationType:
          "BRACKETED_SUM_AND_MULTIPLY",
      })
    );
  }

  return (
    generateN5MathsFractionQuestion({
      difficulty,
    })
  );
}


function buildSelectionMeta(args: {
  level:
    DifficultyLevel;

  templateId:
    string;
}): QuestionVariantSelectionMeta {
  return {
    level:
      args.level,

    templateId:
      args.templateId,

    marks: {
      totalMarks:
        2,

      cMarks:
        2,

      aMarks:
        0,

      reasoningMarks:
        0,
    },

    standardProfile:
      "C",

    paperSuitability:
      "P1",

    calculatorStatus:
      "NonCalculatorOnly",
  };
}


function buildGeneratedFractionQuestion(
  context:
    GeneratorContext
): GeneratedQuestionData {
  const conceptCode =
    context.concept?.code ??
    "N5.1";

  const mode =
    modeFromConceptCode(
      conceptCode
    );

  const difficulty =
    normaliseDifficulty(
      context.difficulty
    );

  const generated =
    generateFractionQuestionForMode(
      mode,
      difficulty
    );

  const workedAnswers =
    generateN5MathsFractionWorkedAnswers(
      generated
    );

  const label =
    conceptLabelFromMode(
      mode
    );

  const templateId = [
    "source-catalogue-fractions",
    mode.toLowerCase(),
    `level-${difficulty}`,
    generated.familyId,
    generated.operationType,
  ].join(
    "-"
  );

  return {
    prompt:
      generated.questionText,

    answer:
      generated.answerText,

    marks:
      2,

    questionCode:
      generated.familyId,

    promptParts:
      buildPromptParts(
        generated
      ),

    answerParts:
      buildAnswerParts(
        generated
      ),

    workedAnswers,

    markBreakdown: {
      totalMarks:
        2,

      cMarks:
        2,

      aMarks:
        0,

      reasoningMarks:
        0,
    },

    classification: {
      standard:
        "C",

      calculatorStatus:
        "NonCalculatorOnly",

      structureType:
        "SingleStep",

      isReasoning:
        false,

      paperSuitability:
        "P1",
    },

    sourceSkillCode:
      "NQ_N5_NUM_N05",

    sourceConceptCode:
      conceptCode,

    sourceConceptLabel:
      label,

    templateId,

    topicMarkBreakdown: {
      NUM:
        2,

      ALG:
        0,

      GEO:
        0,

      TRIG:
        0,

      STAT:
        0,
    },

    selectionMeta:
      buildSelectionMeta({
        level:
          difficulty,

        templateId,
      }),
  };
}


function levelSelectionEntry(
  level:
    FractionDifficulty
): QuestionVariantSelectionMeta {
  return {
    level,

    templateId:
      `source-catalogue-fractions-level-${level}`,

    marks: {
      totalMarks:
        2,

      cMarks:
        2,

      aMarks:
        0,

      reasoningMarks:
        0,
    },

    standardProfile:
      "C",

    paperSuitability:
      "P1",

    calculatorStatus:
      "NonCalculatorOnly",
  };
}


export const FractionsConceptModule:
  ConceptGeneratorModule = {
    metadata: {
      moduleId:
        "NQ_N5_NUM_N05_1_FRACTIONS",

      domain:
        "NUM",

      skillCode:
        "NQ_N5_NUM_N05",

      conceptCode:
        "N5.1",

      conceptLabel:
        "Fraction operations",

      difficultyProfile: {
        availableLevels: [
          1,
          2,
          3,
        ],

        defaultLevel:
          DEFAULT_FRACTION_DIFFICULTY,

        levelDescriptions: {
          1:
            "Accessible National 5 fraction arithmetic using smaller values while preserving the normal question structure.",

          2:
            "Typical National 5 fraction arithmetic and numerical burden.",

          3:
            "More demanding National 5 fraction arithmetic at the upper end of the normal non-calculator range.",
        },
      },

      capabilities: {
        standardCoverage: [
          "C",
        ],

        canGenerateReasoning:
          false,

        calculatorStatus:
          "NonCalculatorOnly",

        paperSuitability:
          "P1",

        typicalStructureTypes: [
          "SingleStep",
        ],
      },

      levelSelectionProfile: {
        1: [
          levelSelectionEntry(
            1
          ),
        ],

        2: [
          levelSelectionEntry(
            2
          ),
        ],

        3: [
          levelSelectionEntry(
            3
          ),
        ],
      },
    },

    canHandle(
      code:
        string
    ) {
      return (
        code ===
          "N5.1" ||
        code ===
          "N5.1.1" ||
        code ===
          "N5.1.2" ||
        code ===
          "N5.1.3" ||
        code ===
          "N5.1.4" ||
        code ===
          "N5.1.5"
      );
    },

    generate:
      buildGeneratedFractionQuestion,
  };


export default
  FractionsConceptModule;