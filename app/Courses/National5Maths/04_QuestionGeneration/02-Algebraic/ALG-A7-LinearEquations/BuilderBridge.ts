import type {
  GeneratedQuestionData,
  GeneratorContext,
} from "@/app/Assessments/Questions/Generation/QuestionGenerationTypes";
import type {
  AreaEqualityDiagramPart,
  PaperPart,
} from "@/app/Assessments/Questions/Content/PaperParts";
import type {
  WorkedAnswerSet,
} from "@/app/Assessments/Questions/Generation/AnswerGenerationTypes";

import {
  formatHistoricalQuestionReferenceLabel,
} from "../../../CatalogCoreTypes";
import {
  generateA7AssessmentPair,
} from "../../../04_AnswerGeneration/02-Algebraic/ALG-A7-LinearEquations/Pairing";
import type {
  A7GeneratedMarkingScheme,
} from "../../../04_AnswerGeneration/02-Algebraic/ALG-A7-LinearEquations/Types";
import {
  linearDimensionLatex,
} from "./PromptGrammar";
import type {
  A7ContextGeneratedQuestion,
  A7FractionalGeneratedQuestion,
  A7GeneratedQuestion,
  A7GeneratorFamily,
  A7GeneratorPaper,
  A7Rational,
} from "./Types";

const A7_SKILL_ID = "alg-a07-linear-equations";
const A7_GENERAL_CONCEPT_ID = "alg-a7-linear-general";
const randomSeed = () => Math.floor(Math.random() * 0x7fffffff) + 1;

const rationalLatex = (value: A7Rational) =>
  value.denominator === 1
    ? `${value.numerator}`
    : `\\frac{${value.numerator}}{${value.denominator}}`;

const linearSideLatex = (xCoefficient: number, constant: number) => {
  const xTerm = xCoefficient === 0
    ? ""
    : xCoefficient === 1
      ? "x"
      : xCoefficient === -1
        ? "-x"
        : `${xCoefficient}x`;

  if (constant === 0) return xTerm || "0";
  if (!xTerm) return `${constant}`;
  return constant < 0
    ? `${xTerm}-${Math.abs(constant)}`
    : `${xTerm}+${constant}`;
};

const dimensionAt = (
  xCoefficient: number,
  constant: number,
  x: number,
) => xCoefficient * x + constant;

const areaDiagramPart = (
  question: A7ContextGeneratedQuestion,
): AreaEqualityDiagramPart => {
  const state = question.mathState;
  const triangleLinear = dimensionAt(
    state.triangle.linearDimension.xCoefficient,
    state.triangle.linearDimension.constant,
    state.solution,
  );
  const rectangleLinear = dimensionAt(
    state.rectangle.linearDimension.xCoefficient,
    state.rectangle.linearDimension.constant,
    state.solution,
  );

  return {
    kind: "areaEqualityDiagram",
    triangle: {
      baseLatex: question.visual.triangle.baseLatex,
      heightLatex: question.visual.triangle.heightLatex,
      resolvedBase: state.triangle.algebraicDimension === "BASE"
        ? triangleLinear
        : state.triangle.fixedDimension,
      resolvedHeight: state.triangle.algebraicDimension === "HEIGHT"
        ? triangleLinear
        : state.triangle.fixedDimension,
    },
    rectangle: {
      widthLatex: question.visual.rectangle.widthLatex,
      heightLatex: question.visual.rectangle.heightLatex,
      resolvedWidth: state.rectangle.algebraicDimension === "BASE"
        ? rectangleLinear
        : state.rectangle.fixedDimension,
      resolvedHeight: state.rectangle.algebraicDimension === "HEIGHT"
        ? rectangleLinear
        : state.rectangle.fixedDimension,
    },
  };
};

const builderPromptParts = (question: A7GeneratedQuestion): PaperPart[] => {
  if (question.family === "FRACTIONAL_COEFFICIENT") {
    return question.promptParts;
  }

  return [
    { kind: "text", value: "A triangle and rectangle are shown in the diagram." },
    areaDiagramPart(question),
    {
      kind: "text",
      value: `\n(a) ${question.promptSections[0].text}\n\n(b) ${question.promptSections[1].text}`,
    },
  ];
};

const fractionalWorkedAnswers = (
  question: A7FractionalGeneratedQuestion,
  marking: A7GeneratedMarkingScheme,
): WorkedAnswerSet => {
  const cleared = question.mathState.clearedEquation;
  const rearranged = question.mathState.rearrangedEquation;

  return {
    defaultMethodFamilyId: marking.defaultMethodFamilyId,
    methods: [{
      methodFamilyId: marking.defaultMethodFamilyId,
      evidenceScore: 1,
      sourceEvidenceIds: marking.profileSourceAnchorIds,
      lines: [
        {
          id: `${question.instanceId}-builder-clear`,
          parts: [
            { kind: "text", value: `Multiply throughout by ${question.mathState.denominatorLcm}:  ` },
            {
              kind: "math",
              latex: `${linearSideLatex(cleared.lhsX, cleared.lhsConstant)}=${linearSideLatex(cleared.rhsX, cleared.rhsConstant)}`,
            },
          ],
          markNumbers: [1],
        },
        {
          id: `${question.instanceId}-builder-rearrange`,
          parts: [{ kind: "math", latex: `${rearranged.xCoefficient}x=${rearranged.constant}` }],
          markNumbers: [2],
        },
        {
          id: `${question.instanceId}-builder-solve`,
          parts: [{ kind: "math", latex: `x=${rationalLatex(question.mathState.solution)}` }],
          markNumbers: [3],
        },
      ],
    }],
  };
};

const contextExpressions = (question: A7ContextGeneratedQuestion) => {
  const state = question.mathState;
  const triangleLinear = linearDimensionLatex(state.triangle.linearDimension);
  const rectangleLinear = linearDimensionLatex(state.rectangle.linearDimension);
  const triangleArea = `\\frac{${state.triangle.fixedDimension}}{2}\\left(${triangleLinear}\\right)`;
  const rectangleArea = `${state.rectangle.fixedDimension}\\left(${rectangleLinear}\\right)`;
  const cleared = `${state.triangle.fixedDimension}\\left(${triangleLinear}\\right)=${2 * state.rectangle.fixedDimension}\\left(${rectangleLinear}\\right)`;
  const expanded = `${linearSideLatex(state.clearedEquation.leftXCoefficient, state.clearedEquation.leftConstant)}=${linearSideLatex(state.clearedEquation.rightXCoefficient, state.clearedEquation.rightConstant)}`;
  const rearranged = `${state.rearrangedEquation.xCoefficient}x=${state.rearrangedEquation.constant}`;

  return {
    triangleArea,
    equalArea: `${triangleArea}=${rectangleArea}`,
    cleared,
    expanded,
    rearranged,
  };
};

const contextWorkedAnswers = (
  question: A7ContextGeneratedQuestion,
  marking: A7GeneratedMarkingScheme,
): WorkedAnswerSet => {
  const expressions = contextExpressions(question);

  return {
    defaultMethodFamilyId: marking.defaultMethodFamilyId,
    methods: [{
      methodFamilyId: marking.defaultMethodFamilyId,
      evidenceScore: 1,
      sourceEvidenceIds: marking.profileSourceAnchorIds,
      lines: [
        {
          id: `${question.instanceId}-builder-area`,
          parts: [
            { kind: "text", value: "(a)  Area of triangle = " },
            { kind: "math", latex: expressions.triangleArea },
          ],
          markNumbers: [1],
        },
        {
          id: `${question.instanceId}-builder-equate`,
          parts: [{ kind: "math", latex: expressions.equalArea }],
          markNumbers: [2],
        },
        {
          id: `${question.instanceId}-builder-clear-half`,
          parts: [
            { kind: "math", latex: expressions.cleared },
            { kind: "text", value: "  so  " },
            { kind: "math", latex: expressions.expanded },
          ],
          markNumbers: [3],
        },
        {
          id: `${question.instanceId}-builder-rearrange`,
          parts: [{ kind: "math", latex: expressions.rearranged }],
          markNumbers: [4],
        },
        {
          id: `${question.instanceId}-builder-solve`,
          parts: [{ kind: "math", latex: `x=${question.mathState.solution}` }],
          markNumbers: [5],
        },
      ],
    }],
  };
};

const answerParts = (question: A7GeneratedQuestion): PaperPart[] => {
  if (question.family === "FRACTIONAL_COEFFICIENT") {
    return [{ kind: "math", latex: `x=${rationalLatex(question.mathState.solution)}` }];
  }

  const expressions = contextExpressions(question);
  return [
    { kind: "text", value: "(a) " },
    { kind: "math", latex: expressions.triangleArea },
    { kind: "text", value: "\n(b) " },
    { kind: "math", latex: `x=${question.mathState.solution}` },
  ];
};

const familyFromContext = (
  context: GeneratorContext,
): A7GeneratorFamily | undefined => {
  const id = context.concept?.id ?? "";
  const selected = context.selectedConceptText.toLowerCase();

  if (id === "alg-a7-area-equality" || selected.includes("area")) {
    return "CONTEXT_AREA_EQUALITY";
  }
  if (id === "alg-a7-fractional" || selected.includes("fraction")) {
    return "FRACTIONAL_COEFFICIENT";
  }

  if (id === A7_GENERAL_CONCEPT_ID) {
    // A7.1 is an aggregate selector, not a third family. Resolve it through
    // the active Builder constraints so the generated tariff always matches
    // the family that made the parent selectable.
    if (context.selectionFilters?.targetMarks === 3) {
      return "FRACTIONAL_COEFFICIENT";
    }
    if (context.selectionFilters?.targetMarks === 5) {
      return "CONTEXT_AREA_EQUALITY";
    }
    if (context.selectionFilters?.selectedThinkingType === "REASONING") {
      return "CONTEXT_AREA_EQUALITY";
    }
    if (context.selectionFilters?.selectedThinkingType === "OPERATIONAL") {
      return "FRACTIONAL_COEFFICIENT";
    }
    if (context.paper === "P2") {
      return "FRACTIONAL_COEFFICIENT";
    }
    return undefined;
  }

  if (context.selectionFilters?.selectedThinkingType === "REASONING") {
    return "CONTEXT_AREA_EQUALITY";
  }
  if (context.selectionFilters?.selectedThinkingType === "OPERATIONAL") {
    return "FRACTIONAL_COEFFICIENT";
  }
  if (context.selectionFilters?.targetMarks === 5) {
    return "CONTEXT_AREA_EQUALITY";
  }
  if (context.selectionFilters?.targetMarks === 3) {
    return "FRACTIONAL_COEFFICIENT";
  }
  if (context.paper === "P2") {
    return "FRACTIONAL_COEFFICIENT";
  }
  return undefined;
};

export function buildA7BuilderGenerated(
  context: GeneratorContext,
): GeneratedQuestionData {
  if (context.skill.id !== A7_SKILL_ID) {
    throw new Error("A7 Builder bridge received a non-A7 skill.");
  }

  const paper: A7GeneratorPaper = context.paper === "P2" ? "P2" : "P1";
  const family = familyFromContext(context);
  const difficulty = context.difficulty <= 1 ? 1 : 2;

  const pair = generateA7AssessmentPair({
    seed: randomSeed(),
    difficulty,
    family,
    paper,
    includeExperimentalFamilies: true,
  });

  const question = pair.question;
  const marking = pair.markingScheme;
  const reasoningMarks = question.thinking === "REASONING" ? question.marks : 0;
  const reference = question.sourceBasis.historicalReference;
  const referenceId = reference.primaryQuestionCatalogId;
  const formattedReference = referenceId
    ? formatHistoricalQuestionReferenceLabel(referenceId)
    : null;

  return {
    prompt: question.prompt,
    promptParts: builderPromptParts(question),
    answer: marking.finalAnswers
      .map((entry) => entry.partLabel ? `(${entry.partLabel}) ${entry.normalisedAnswer}` : entry.normalisedAnswer)
      .join("; "),
    answerParts: answerParts(question),
    workedAnswers: question.family === "FRACTIONAL_COEFFICIENT"
      ? fractionalWorkedAnswers(question, marking)
      : contextWorkedAnswers(question, marking),
    historicalReference: {
      label: formattedReference ? `See ${formattedReference}` : "Historical reference",
      questionCatalogId: referenceId,
      matchReasons: [...reference.matchReasons],
    },
    marks: question.marks,
    questionCode: question.instanceId,
    markBreakdown: {
      totalMarks: question.marks,
      cMarks: 0,
      aMarks: question.marks,
      reasoningMarks,
    },
    classification: {
      standard: "A",
      calculatorStatus: paper === "P1" ? "NonCalculatorOnly" : "Either",
      structureType: question.family === "FRACTIONAL_COEFFICIENT"
        ? "EquationSolving"
        : "ContextualProblem",
      isReasoning: reasoningMarks > 0,
      paperSuitability: question.family === "CONTEXT_AREA_EQUALITY" ? "P1" : "BOTH",
    },
    sourceSkillCode: "A7",
    sourceConceptCode: context.concept?.code ?? "A7",
    sourceConceptLabel: context.concept?.label ?? "Linear equations",
    templateId: `${question.generatorId}:${question.family}`,
    topicMarkBreakdown: {
      NUM: 0,
      ALG: question.marks,
      GEO: 0,
      TRIG: 0,
      STAT: 0,
    },
    selectionMeta: {
      level: question.difficulty,
      templateId: `${question.generatorId}:${question.family}:${question.quality.difficultyBandId}`,
      marks: {
        totalMarks: question.marks,
        cMarks: 0,
        aMarks: question.marks,
        reasoningMarks,
      },
      standardProfile: "A",
      paperSuitability: question.family === "CONTEXT_AREA_EQUALITY" ? "P1" : "BOTH",
      calculatorStatus: "CalculatorAllowed",
    },
  };
}
