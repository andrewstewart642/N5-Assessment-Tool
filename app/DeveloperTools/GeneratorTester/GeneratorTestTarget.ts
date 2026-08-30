import type { Paper } from "@/app/Assessments/AssessmentTypes";
import type {
  ConceptGeneratorModule,
  GeneratedQuestionData,
  GeneratorContext,
} from "@/app/Assessments/Questions/Generation/QuestionGenerationTypes";
import type { PaperPart } from "@/app/Assessments/Questions/Content/PaperParts";

// The National5Maths alias still points at National5MathsLegacy during the
// architecture transition, so DeveloperTools reaches the clean workspace by
// relative import.
import {
  A8_DEFAULT_DIFFICULTY_LEVEL,
  A8_DIFFICULTY_BANDS,
  A8_SUPPORTED_DIFFICULTY_LEVELS,
  generateA8Question,
  type A8GeneratorDifficulty,
  type A8GeneratorFamily,
  type A8GeneratorPaper,
} from "../../Courses/National5Maths/03_QuestionGeneration/A8_SimultaneousEquations";
import { generateA8Answer } from "../../Courses/National5Maths/04_AnswerGeneration/A8_SimultaneousEquations";

export type GeneratorTestConcept = {
  code: string;
  label: string;
  papers?: Paper[];
};

export type GeneratorTestTarget = {
  module: ConceptGeneratorModule;
  concepts: GeneratorTestConcept[];
  conceptControlLabel?: string;
  supportsSeed?: boolean;
  notes?: string[];
};

type SeededGeneratorContext = GeneratorContext & {
  developerSeed?: number;
};

const TEST_CODE_TO_FAMILY: Record<string, A8GeneratorFamily | "CALIBRATED_MIX"> = {
  "A8.CORE": "CALIBRATED_MIX",
  "A8.ABSTRACT": "ABSTRACT_SOLVE",
  "A8.CONTEXT": "CONTEXT_FORM_AND_SOLVE",
  "A8.GRAPH": "GRAPH_INTERSECTION_SOLVE",
  "A8.DERIVED": "CONTEXT_DERIVED_TOTAL",
};

const A8_DIFFICULTY_DESCRIPTIONS = {
  1: A8_DIFFICULTY_BANDS.find((band) => band.level === 1)?.description ?? "Lower valid A8 burden.",
  2: A8_DIFFICULTY_BANDS.find((band) => band.level === 2)?.description ?? "Typical A8 burden.",
  3: A8_DIFFICULTY_BANDS.find((band) => band.level === 3)?.description ?? "Upper valid A8 burden.",
};

function paperFromContext(context: GeneratorContext): A8GeneratorPaper {
  return context.paper === "P2" ? "P2" : "P1";
}

function difficultyFromContext(context: GeneratorContext): A8GeneratorDifficulty {
  if (context.difficulty === 1 || context.difficulty === 2 || context.difficulty === 3) {
    return context.difficulty;
  }
  throw new Error(`A8 exposes only its three calibrated difficulty levels; received level ${context.difficulty}.`);
}

function explicitFamilyFromContext(context: GeneratorContext): A8GeneratorFamily | undefined {
  const requested = context.concept?.code
    ? TEST_CODE_TO_FAMILY[context.concept.code]
    : "CALIBRATED_MIX";
  return requested && requested !== "CALIBRATED_MIX" ? requested : undefined;
}

function answerText(finalAnswers: { partLabel: string; normalisedAnswer: string }[]): string {
  return finalAnswers
    .map((answer) => answer.partLabel ? `(${answer.partLabel}) ${answer.normalisedAnswer}` : answer.normalisedAnswer)
    .join("\n");
}

function asTextParts(value: string): PaperPart[] {
  return [{ kind: "text", value }];
}

const A8_TEST_MODULE: ConceptGeneratorModule = {
  metadata: {
    moduleId: "A8_SIMULTANEOUS_EQUATIONS_DEV_ADAPTER",
    domain: "ALG",
    skillCode: "A8",
    conceptCode: "alg-a8-1",
    conceptLabel: "Work with simultaneous equations",
    tags: ["simultaneous equations", "elimination", "A8 vertical slice"],
    difficultyProfile: {
      // Difficulty count is skill-specific. The A8 calibration pass found three
      // defensible bands; this is not a course-wide five-level requirement.
      availableLevels: [...A8_SUPPORTED_DIFFICULTY_LEVELS],
      defaultLevel: A8_DEFAULT_DIFFICULTY_LEVEL,
      levelDescriptions: A8_DIFFICULTY_DESCRIPTIONS,
    },
    capabilities: {
      standardCoverage: ["Mixed"],
      canGenerateReasoning: true,
      calculatorStatus: "Either",
      paperSuitability: "BOTH",
      typicalStructureTypes: ["EquationSolving", "ContextualProblem", "CompoundSkills"],
    },
  },

  canHandle: (conceptCode) => conceptCode in TEST_CODE_TO_FAMILY,

  generate: (context) => {
    const seededContext = context as SeededGeneratorContext;
    const seed = seededContext.developerSeed ?? Math.floor(Math.random() * 0x7fffffff);
    const explicitFamily = explicitFamilyFromContext(context);

    const question = generateA8Question({
      seed,
      difficulty: difficultyFromContext(context),
      ...(explicitFamily ? { family: explicitFamily } : {}),
      paper: paperFromContext(context),
      includeExperimentalFamilies: true,
    });

    // This also validates the answer against the exact generated question
    // state. A successful card therefore passed both generator validators.
    const markingScheme = generateA8Answer(question);
    const finalAnswer = answerText(markingScheme.finalAnswers);

    const workedAnswers = {
      defaultMethodFamilyId: markingScheme.defaultMethodFamilyId,
      methods: markingScheme.methods.map((method, methodIndex) => ({
        methodFamilyId: method.methodFamilyId,
        lines: method.lines.map((line) => ({
          id: line.id,
          parts: asTextParts(line.text),
          markNumbers: line.markNumbers,
        })),
        evidenceScore:
          method.methodFamilyId === markingScheme.defaultMethodFamilyId
            ? 1
            : Math.max(0.8, 0.95 - methodIndex * 0.02),
        sourceEvidenceIds: method.sourceEvidenceIds,
      })),
    };

    const contextual = question.context !== null;
    const generated = {
      prompt: question.prompt,
      answer: finalAnswer,
      marks: question.marks,
      questionCode: question.instanceId,
      promptParts: question.promptParts,
      answerParts: asTextParts(finalAnswer),
      workedAnswers,
      classification: {
        // A8 is a C+A / mixed-standard skill in the historical catalogue;
        // difficulty changes arithmetic burden, not the curriculum tier label.
        standard: "Mixed",
        calculatorStatus: question.paper === "P1" ? "NonCalculatorOnly" : "Either",
        structureType: contextual
          ? "ContextualProblem"
          : question.family === "GRAPH_INTERSECTION_SOLVE"
            ? "CompoundSkills"
            : "EquationSolving",
        isReasoning: contextual,
        paperSuitability: question.paper,
      } satisfies NonNullable<GeneratedQuestionData["classification"]>,
      sourceSkillCode: "A8",
      sourceConceptCode: "alg-a8-1",
      sourceConceptLabel: "Work with simultaneous equations",
      templateId: [question.family, question.context?.contextId].filter(Boolean).join(":"),
      a8Diagnostics: {
        validation: { question: "PASSED", answer: "PASSED" },
        seed: question.seed,
        generatorId: question.generatorId,
        familyReadiness: question.familyReadiness,
        quality: question.quality,
        determinant: question.determinant,
        equations: question.equations,
        intendedSolution: question.solution,
        eliminationPlans: question.eliminationPlans,
        context: question.context,
        visual: question.visual,
        promptSections: question.promptSections,
        sourceBasis: question.sourceBasis,
        generationConstraints: question.generationConstraints,
        markPoints: markingScheme.markPoints,
        workingPolicy: markingScheme.workingPolicy,
        presentationPolicy: markingScheme.presentationPolicy,
      },
    };

    return generated satisfies GeneratedQuestionData;
  },
};

export const GENERATOR_TEST_TARGET: GeneratorTestTarget = {
  module: A8_TEST_MODULE,
  conceptControlLabel: "A8 family",
  supportsSeed: true,
  concepts: [
    { code: "A8.CORE", label: "Calibrated mix — historical family distribution", papers: ["P1", "P2"] },
    { code: "A8.ABSTRACT", label: "Abstract solve", papers: ["P1"] },
    { code: "A8.CONTEXT", label: "Context: form and solve", papers: ["P1", "P2"] },
    { code: "A8.GRAPH", label: "Experimental: graph intersection", papers: ["P1"] },
    { code: "A8.DERIVED", label: "Experimental: contextual derived total", papers: ["P2"] },
  ],
  notes: [
    "A8 has three evidence-derived difficulty bands: Lower valid, Typical and Upper valid. Other skills may expose a different number after their own cross-corpus calibration.",
    "The Question Generator now consumes the calibration directly: family selection uses the observed paper-conditioned frequency, and unsupported family/difficulty combinations are excluded rather than invented.",
    "Paper 1 candidates are accepted against the cheapest calibrated written route, including the observed scaling, constant, decimal/roundness and solution-texture envelopes rather than a generic magnitude ceiling.",
    "Paper 2 normal contextual generation follows the observed purchase/currency texture; the derived-total family stays near its large-round-mass evidence.",
    "Generated systems are checked against canonical historical system signatures so calibration can be close without regenerating a catalogued SQA system.",
    "Context generation uses 60 curated semantic shells and a separately mixed context seed to reduce repeated scenarios across adjacent samples.",
    "Raw output exposes the calibrated band, empirical family frequency, selected written route, historical-overlap check, context, equations, solution and source basis.",
  ],
};
