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

const TEST_CODE_TO_FAMILY: Record<string, A8GeneratorFamily | "AUTO_CORE"> = {
  "A8.CORE": "AUTO_CORE",
  "A8.ABSTRACT": "ABSTRACT_SOLVE",
  "A8.CONTEXT": "CONTEXT_FORM_AND_SOLVE",
  "A8.GRAPH": "GRAPH_INTERSECTION_SOLVE",
  "A8.DERIVED": "CONTEXT_DERIVED_TOTAL",
};

/**
 * The weighted cycles reproduce the observed paper-conditioned A8 family mix
 * in every complete cycle rather than relying on independent random draws.
 *
 * P1 historical mix: 5 abstract : 2 contextual : 1 graph.
 * P2 historical mix: 2 contextual : 1 derived-total.
 */
const P1_FAMILY_CYCLE: A8GeneratorFamily[] = [
  "ABSTRACT_SOLVE",
  "CONTEXT_FORM_AND_SOLVE",
  "ABSTRACT_SOLVE",
  "GRAPH_INTERSECTION_SOLVE",
  "ABSTRACT_SOLVE",
  "CONTEXT_FORM_AND_SOLVE",
  "ABSTRACT_SOLVE",
  "ABSTRACT_SOLVE",
];

const P2_FAMILY_CYCLE: A8GeneratorFamily[] = [
  "CONTEXT_FORM_AND_SOLVE",
  "CONTEXT_DERIVED_TOTAL",
  "CONTEXT_FORM_AND_SOLVE",
];

const A8_DIFFICULTY_DESCRIPTIONS = {
  1: A8_DIFFICULTY_BANDS.find((band) => band.level === 1)?.description ?? "Lower valid A8 burden.",
  2: A8_DIFFICULTY_BANDS.find((band) => band.level === 2)?.description ?? "Typical A8 burden.",
  3: A8_DIFFICULTY_BANDS.find((band) => band.level === 3)?.description ?? "Upper valid A8 burden.",
};

function paperFromContext(context: GeneratorContext): A8GeneratorPaper {
  return context.paper === "P2" ? "P2" : "P1";
}

function familyFromContext(context: GeneratorContext, seed: number): A8GeneratorFamily {
  const requested = context.concept?.code
    ? TEST_CODE_TO_FAMILY[context.concept.code]
    : "AUTO_CORE";

  if (requested && requested !== "AUTO_CORE") return requested;

  const cycle = paperFromContext(context) === "P2" ? P2_FAMILY_CYCLE : P1_FAMILY_CYCLE;
  return cycle[Math.abs(seed) % cycle.length] ?? "ABSTRACT_SOLVE";
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
    const family = familyFromContext(context, seed);

    const question = generateA8Question({
      seed,
      difficulty: context.difficulty,
      family,
      paper: paperFromContext(context),
      includeExperimentalFamilies:
        family === "GRAPH_INTERSECTION_SOLVE" || family === "CONTEXT_DERIVED_TOTAL",
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
    "A dedicated A8 cross-corpus calibration pass found three useful difficulty bands: Lower valid, Typical and Upper valid. Other skills may expose a different number of bands after their own analysis.",
    "Core family selection now follows the observed paper-conditioned mix: P1 uses 5 abstract : 2 contextual : 1 graph; P2 uses 2 contextual : 1 derived-total.",
    "The calibration records cheapest-route scaling, number texture and Paper 1/Paper 2 arithmetic envelopes for all eleven historical A8 questions. The next generator-tightening pass should enforce those envelopes directly.",
    "Context generation uses 60 curated semantic shells rather than arbitrary noun substitution; purchase, fixed-mass and resource-use contexts each have context-specific plausible value ranges.",
    "Raw output exposes the seed, context ID, quality profile, equations, solution, elimination plans, mark points and source basis.",
  ],
};
