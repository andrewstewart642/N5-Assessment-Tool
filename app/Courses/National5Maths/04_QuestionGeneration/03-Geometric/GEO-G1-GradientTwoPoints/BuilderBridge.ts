import type {
  GeneratedQuestionData,
  GeneratorContext,
  StructureType,
} from "@/app/Assessments/Questions/Generation/QuestionGenerationTypes";
import type {
  WorkedAnswerSet,
} from "@/app/Assessments/Questions/Generation/AnswerGenerationTypes";
import type {
  PaperPart,
} from "@/app/Assessments/Questions/Content/PaperParts";
import type {
  QuestionVariantSelectionMeta,
} from "@/app/Assessments/Questions/Selection/QuestionSelectionTypes";
import {
  isVariantEligibleForFilters,
} from "@/app/Assessments/Questions/Selection/QuestionSelectionTypes";

import {
  formatHistoricalQuestionReferenceLabel,
} from "../../../CatalogCoreTypes";
import {
  generateG1Answer,
} from "../../../05_AnswerGeneration/03-Geometric/GEO-G1-GradientTwoPoints/Generator";
import {
  buildG1StraightLineModelGraphPart,
} from "../../../06_VisualAssets/03-Geometric/GEO-G1-GradientTwoPoints/BuilderVisualBridge";
import {
  generateG1Question,
} from "./Generator";
import {
  g1BestFitFollowUp,
  g1RationalLatex,
  g1RationalPlain,
} from "./PromptGrammar";
import type {
  G1BestFitGeneratedQuestion,
  G1GeneratedQuestion,
  G1GeneratorDifficulty,
  G1GeneratorFamily,
  G1GeneratorPaper,
  G1GeneratorSurfaceStyle,
  G1Rational,
} from "./Types";

const G1_SKILL_ID = "geo-g01-gradient-two-points";
const S2_SKILL_ID = "stat-s02-linear-model";
const randomSeed = () => Math.floor(Math.random() * 0x7fffffff) + 1;
const text = (value: string): PaperPart => ({ kind: "text", value });
const math = (latex: string): PaperPart => ({ kind: "math", latex, displayMode: false });

export type G1BuilderVariant = {
  family: G1GeneratorFamily;
  surfaceStyleId: G1GeneratorSurfaceStyle;
  paper: G1GeneratorPaper;
  difficulty: G1GeneratorDifficulty;
  weight: number;
  totalMarks: number;
  cMarks: number;
  aMarks: number;
};

const P1_VARIANTS: readonly G1BuilderVariant[] = [
  {
    family: "LINE_EQUATION_FROM_TWO_POINTS",
    surfaceStyleId: "DIRECT_COORDINATES_LINE_EQUATION",
    paper: "P1",
    difficulty: 1,
    weight: 2,
    totalMarks: 3,
    cMarks: 3,
    aMarks: 0,
  },
  {
    family: "LINE_EQUATION_FROM_TWO_POINTS",
    surfaceStyleId: "COORDINATE_DIAGRAM_LINE_EQUATION",
    paper: "P1",
    difficulty: 1,
    weight: 2,
    totalMarks: 3,
    cMarks: 3,
    aMarks: 0,
  },
  {
    family: "CONTEXTUAL_LINEAR_MODEL",
    surfaceStyleId: "CONTEXT_LINE_GRAPH_LABELLED_POINTS",
    paper: "P1",
    difficulty: 1,
    weight: 2,
    totalMarks: 4,
    cMarks: 4,
    aMarks: 0,
  },
  {
    family: "BEST_FIT_LINEAR_MODEL",
    surfaceStyleId: "BEST_FIT_LABELLED_POINTS_CONTEXT",
    paper: "P1",
    difficulty: 1,
    weight: 5,
    totalMarks: 4,
    cMarks: 4,
    aMarks: 0,
  },
  {
    family: "LINE_EQUATION_FROM_TWO_POINTS",
    surfaceStyleId: "DIRECT_COORDINATES_LINE_EQUATION",
    paper: "P1",
    difficulty: 2,
    weight: 2,
    totalMarks: 3,
    cMarks: 3,
    aMarks: 0,
  },
  {
    family: "LINE_EQUATION_FROM_TWO_POINTS",
    surfaceStyleId: "COORDINATE_DIAGRAM_LINE_EQUATION",
    paper: "P1",
    difficulty: 2,
    weight: 2,
    totalMarks: 3,
    cMarks: 3,
    aMarks: 0,
  },
  {
    family: "CONTEXTUAL_LINEAR_MODEL",
    surfaceStyleId: "CONTEXT_LINE_GRAPH_LABELLED_POINTS",
    paper: "P1",
    difficulty: 2,
    weight: 2,
    totalMarks: 4,
    cMarks: 4,
    aMarks: 0,
  },
  {
    family: "BEST_FIT_LINEAR_MODEL",
    surfaceStyleId: "BEST_FIT_GRID_READ_POINTS",
    paper: "P1",
    difficulty: 2,
    weight: 5,
    totalMarks: 4,
    cMarks: 4,
    aMarks: 0,
  },
];

const P2_VARIANTS: readonly G1BuilderVariant[] = [
  {
    family: "SYMBOLIC_GRADIENT_FROM_TWO_POINTS",
    surfaceStyleId: "SYMBOLIC_COORDINATE_GRADIENT",
    paper: "P2",
    difficulty: 2,
    weight: 1,
    totalMarks: 3,
    cMarks: 0,
    aMarks: 3,
  },
];

export const G1_BUILDER_VARIANTS: readonly G1BuilderVariant[] = [
  ...P1_VARIANTS,
  ...P2_VARIANTS,
];

export const g1VariantSelectionMeta = (
  variant: G1BuilderVariant
): QuestionVariantSelectionMeta => ({
  level: variant.difficulty,
  templateId: [
    "G1_GRADIENT_TWO_POINTS_V1",
    variant.family,
    variant.surfaceStyleId,
    `L${variant.difficulty}`,
  ].join(":"),
  marks: {
    totalMarks: variant.totalMarks,
    cMarks: variant.cMarks,
    aMarks: variant.aMarks,
    reasoningMarks: 0,
  },
  standardProfile:
    variant.cMarks > 0 && variant.aMarks > 0
      ? "C+A"
      : variant.aMarks > 0
        ? "A"
        : "C",
  paperSuitability: variant.paper,
  calculatorStatus:
    variant.paper === "P1"
      ? "NonCalculatorOnly"
      : "CalculatorAllowed",
});

const resolvePaper = (context: GeneratorContext): G1GeneratorPaper =>
  context.paper === "P2" || context.selectionFilters?.targetPaper === "P2"
    ? "P2"
    : "P1";

const resolveDifficulty = (
  context: GeneratorContext
): G1GeneratorDifficulty => context.difficulty <= 1 ? 1 : 2;

const chooseVariant = (
  context: GeneratorContext,
  paper: G1GeneratorPaper,
  difficulty: G1GeneratorDifficulty,
  seed: number
): G1BuilderVariant => {
  const candidates = G1_BUILDER_VARIANTS
    .filter((variant) => variant.paper === paper)
    .filter((variant) => variant.difficulty === difficulty)
    .filter((variant) =>
      !context.selectionFilters ||
      isVariantEligibleForFilters(
        g1VariantSelectionMeta(variant),
        context.selectionFilters
      )
    );

  if (candidates.length === 0) {
    throw new Error(
      `No G1 question family matches the active Builder filters on ${paper} at difficulty ${difficulty}.`
    );
  }

  const weighted = candidates.flatMap((variant) =>
    Array.from({ length: Math.max(1, variant.weight) }, () => variant)
  );

  return weighted[(seed >>> 0) % weighted.length];
};

const promptPartsFor = (
  question: G1GeneratedQuestion
): PaperPart[] => {
  if (!question.visual) return [...question.promptParts];

  const graph = buildG1StraightLineModelGraphPart(question.visual);
  const lines = question.prompt.split("\n");

  if (question.family === "LINE_EQUATION_FROM_TWO_POINTS") {
    return [
      text(lines[0] ?? ""),
      graph,
      text(lines.slice(1).join("\n")),
    ];
  }

  if (question.family === "CONTEXTUAL_LINEAR_MODEL") {
    return [
      text(lines.slice(0, 2).join("\n")),
      graph,
      text(lines.slice(2).join("\n")),
    ];
  }

  if (question.family === "BEST_FIT_LINEAR_MODEL") {
    return [
      text(lines.slice(0, 3).join("\n")),
      graph,
      text(lines.slice(3).join("\n")),
    ];
  }

  return [...question.promptParts];
};

type BuilderFinalAnswer = {
  partLabel: "" | "a" | "b";
  normalisedAnswer: string;
  latex: string;
  unit: string | null;
};

const deferredBestFitAnswer = (
  question: G1BestFitGeneratedQuestion
): BuilderFinalAnswer => {
  const followUp = g1BestFitFollowUp(question.mathState);
  return {
    partLabel: "b",
    normalisedAnswer: g1RationalPlain(followUp.exactOutput),
    latex: g1RationalLatex(followUp.exactOutput),
    unit: followUp.outputUnit,
  };
};

const builderFinalAnswers = (
  question: G1GeneratedQuestion,
  marking: ReturnType<typeof generateG1Answer>
): BuilderFinalAnswer[] => {
  const answers: BuilderFinalAnswer[] = marking.finalAnswers.map((answer) => ({
    partLabel: answer.partLabel,
    normalisedAnswer: answer.normalisedAnswer,
    latex: answer.latex,
    unit: answer.unit,
  }));

  if (question.family === "BEST_FIT_LINEAR_MODEL") {
    answers.push(deferredBestFitAnswer(question));
  }

  return answers;
};

const answerText = (
  answers: readonly BuilderFinalAnswer[]
) => answers
  .map((answer) => {
    const label = answer.partLabel ? `(${answer.partLabel}) ` : "";
    const unit = answer.unit ? ` ${answer.unit}` : "";
    return `${label}${answer.normalisedAnswer}${unit}`;
  })
  .join("\n");

const answerPartsFor = (
  answers: readonly BuilderFinalAnswer[]
): PaperPart[] => answers.flatMap((answer, index) => {
  const parts: PaperPart[] = [];
  if (index > 0) parts.push(text("\n"));
  if (answer.partLabel) parts.push(text(`(${answer.partLabel}) `));
  parts.push(math(answer.latex));
  if (answer.unit) parts.push(text(` ${answer.unit}`));
  return parts;
});

const workedAnswersFor = (
  marking: ReturnType<typeof generateG1Answer>
): WorkedAnswerSet => ({
  defaultMethodFamilyId: marking.defaultMethodFamilyId,
  methods: marking.methods.map((method) => ({
    methodFamilyId: method.methodFamilyId,
    evidenceScore:
      method.methodFamilyId === marking.defaultMethodFamilyId ? 1 : 0.9,
    sourceEvidenceIds: [...method.sourceEvidenceIds],
    lines: method.lines.map((line) => ({
      id: line.id,
      parts: line.latex ? [math(line.latex)] : [text(line.text)],
      markNumbers: [...line.markNumbers],
    })),
  })),
});

const structureFor = (
  question: G1GeneratedQuestion
): StructureType => {
  if (question.family === "CONTEXTUAL_LINEAR_MODEL") return "ContextualProblem";
  if (question.family === "BEST_FIT_LINEAR_MODEL") return "DataAnalysis";
  if (question.surfaceStyleId === "COORDINATE_DIAGRAM_LINE_EQUATION") {
    return "GraphInterpretation";
  }
  return "MultiStep";
};

const topicMarksFor = (
  question: G1GeneratedQuestion,
  wrapperMarks: number
) => question.family === "BEST_FIT_LINEAR_MODEL"
  ? {
      NUM: 0,
      ALG: 0,
      GEO: 3,
      TRIG: 0,
      STAT: 1,
    }
  : {
      NUM: 0,
      ALG: 0,
      GEO: wrapperMarks,
      TRIG: 0,
      STAT: 0,
    };

const rationalValue = (value: G1Rational) =>
  value.numerator / value.denominator;

export function buildG1BuilderGenerated(
  context: GeneratorContext
): GeneratedQuestionData {
  if (context.skill.id !== G1_SKILL_ID) {
    throw new Error("G1 Builder bridge received a non-G1 skill.");
  }

  const paper = resolvePaper(context);
  const difficulty = resolveDifficulty(context);
  const seed = randomSeed();
  const variant = chooseVariant(context, paper, difficulty, seed);
  const question = generateG1Question({
    seed,
    paper,
    difficulty,
    family: variant.family,
    surfaceStyleId: variant.surfaceStyleId,
    includeExperimentalFamilies: true,
    includeDeferredCompositeFamilies: true,
  });
  const marking = generateG1Answer(question);
  const answers = builderFinalAnswers(question, marking);
  const selectionMeta = g1VariantSelectionMeta(variant);
  const wrapperMarks = selectionMeta.marks.totalMarks;
  const reference = question.sourceBasis.historicalReference;
  const referenceId = reference.primaryQuestionCatalogId;
  const formattedReference = referenceId
    ? formatHistoricalQuestionReferenceLabel(referenceId)
    : null;
  const templateId = `${question.generatorId}:${question.family}:${question.surfaceStyleId}`;

  // Touch the exact generated line state here rather than allowing the Builder
  // bridge to derive or replace it. This also makes a malformed rational state
  // fail loudly before it reaches the paper renderer.
  if (question.family !== "SYMBOLIC_GRADIENT_FROM_TWO_POINTS") {
    const gradient = rationalValue(question.mathState.gradient);
    const intercept = rationalValue(question.mathState.intercept);
    if (!Number.isFinite(gradient) || !Number.isFinite(intercept)) {
      throw new Error("G1 Builder bridge received a non-finite generated line state.");
    }
  }

  return {
    prompt: question.prompt,
    promptParts: promptPartsFor(question),
    answer: answerText(answers),
    answerParts: answerPartsFor(answers),
    workedAnswers: workedAnswersFor(marking),
    historicalReference: {
      label: formattedReference ? `See ${formattedReference}` : "Historical reference",
      questionCatalogId: referenceId,
      matchReasons: [...reference.matchReasons],
    },
    marks: wrapperMarks,
    questionCode: question.instanceId,
    markBreakdown: { ...selectionMeta.marks },
    classification: {
      standard: selectionMeta.standardProfile === "C+A"
        ? "Mixed"
        : selectionMeta.standardProfile,
      calculatorStatus: paper === "P1" ? "NonCalculatorOnly" : "Either",
      structureType: structureFor(question),
      isReasoning: false,
      paperSuitability: paper,
    },
    sourceSkillCode: "G1",
    sourceConceptCode: context.concept?.code ?? "G1.1",
    sourceConceptLabel:
      context.concept?.label ?? "Gradient and equation of a straight line",
    templateId,
    supportingSkillIds:
      question.family === "BEST_FIT_LINEAR_MODEL"
        ? [S2_SKILL_ID]
        : [],
    topicMarkBreakdown: topicMarksFor(question, wrapperMarks),
    selectionMeta,
  };
}
