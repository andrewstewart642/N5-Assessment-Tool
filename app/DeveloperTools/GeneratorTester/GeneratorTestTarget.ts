import type {
  Paper,
} from "@/app/Assessments/AssessmentTypes";

import type {
  ConceptGeneratorModule,
  GeneratedQuestionData,
  GeneratorContext,
  StandardClassification,
} from "@/app/Assessments/Questions/Generation/QuestionGenerationTypes";

import type {
  PaperPart,
} from "@/app/Assessments/Questions/Content/PaperParts";

// The National5Maths alias still points at National5MathsLegacy during the
// catalogue/generation transition. DeveloperTools therefore reaches the clean
// workspace through a relative import rather than the compatibility alias.
import {
  generateA8Question,
  type A8GeneratorFamily,
  type A8GeneratorPaper,
} from "../../Courses/National5Maths/03_QuestionGeneration/A8_SimultaneousEquations";

import {
  generateA8Answer,
} from "../../Courses/National5Maths/04_AnswerGeneration/A8_SimultaneousEquations";


export type GeneratorTestConcept = {
  code: string;
  label: string;
  papers?: Paper[];
};


export type GeneratorTestTarget = {
  /**
   * The actual generator module being tested.
   *
   * For clean-workspace generators that do not yet implement the generic
   * Assessment adapter directly, this may be a thin DeveloperTools adapter
   * around the exact production-intended generator functions.
   */
  module:
    ConceptGeneratorModule;


  /**
   * Concepts/variants exposed in the tester.
   */
  concepts:
    GeneratorTestConcept[];


  /**
   * Optional label for the first selector. Defaults to "Concept".
   */
  conceptControlLabel?:
    string;


  /**
   * Enables the reproducible base-seed control in GeneratorTesterPage.
   */
  supportsSeed?:
    boolean;


  /**
   * Optional notes shown near the tester controls.
   */
  notes?:
    string[];
};


type SeededGeneratorContext =
  GeneratorContext & {
    developerSeed?:
      number;
  };


const TEST_CODE_TO_FAMILY:
  Record<
    string,
    A8GeneratorFamily | "AUTO_CORE"
  > = {
    "A8.CORE":
      "AUTO_CORE",

    "A8.ABSTRACT":
      "ABSTRACT_SOLVE",

    "A8.CONTEXT":
      "CONTEXT_FORM_AND_SOLVE",

    "A8.GRAPH":
      "GRAPH_INTERSECTION_SOLVE",

    "A8.DERIVED":
      "CONTEXT_DERIVED_TOTAL",
  };


function paperFromContext(
  context:
    GeneratorContext
): A8GeneratorPaper {
  return context.paper === "P2"
    ? "P2"
    : "P1";
}


function familyFromContext(
  context:
    GeneratorContext,

  seed:
    number
): A8GeneratorFamily {
  const requested =
    context.concept?.code
      ? TEST_CODE_TO_FAMILY[
          context.concept.code
        ]
      : "AUTO_CORE";

  if (
    requested &&
    requested !== "AUTO_CORE"
  ) {
    return requested;
  }

  // The core random mode remains evidence-aware. The supplied A8 corpus has
  // contextual core evidence on both papers, but abstract core evidence only
  // on Paper 1. On P1, seed parity gives a deterministic 50/50 core split.
  if (
    paperFromContext(
      context
    ) === "P2"
  ) {
    return "CONTEXT_FORM_AND_SOLVE";
  }

  return seed % 2 === 0
    ? "ABSTRACT_SOLVE"
    : "CONTEXT_FORM_AND_SOLVE";
}


function standardFromDifficulty(
  difficulty:
    number
): StandardClassification {
  if (
    difficulty <= 2
  ) {
    return "C";
  }

  if (
    difficulty >= 4
  ) {
    return "A";
  }

  return "Mixed";
}


function answerText(
  finalAnswers:
    {
      partLabel: string;
      normalisedAnswer: string;
    }[]
): string {
  return finalAnswers
    .map(
      (answer) =>
        answer.partLabel
          ? `(${answer.partLabel}) ${answer.normalisedAnswer}`
          : answer.normalisedAnswer
    )
    .join(
      "\n"
    );
}


function asTextParts(
  value:
    string
): PaperPart[] {
  return [
    {
      kind:
        "text",

      value,
    },
  ];
}


const A8_TEST_MODULE:
  ConceptGeneratorModule = {
    metadata: {
      moduleId:
        "A8_SIMULTANEOUS_EQUATIONS_DEV_ADAPTER",

      domain:
        "ALG",

      skillCode:
        "A8",

      conceptCode:
        "alg-a8-1",

      conceptLabel:
        "Work with simultaneous equations",

      tags: [
        "simultaneous equations",
        "elimination",
        "A8 vertical slice",
      ],

      difficultyProfile: {
        availableLevels: [
          1,
          2,
          3,
          4,
          5,
        ],

        defaultLevel:
          3,

        levelDescriptions: {
          1:
            "Lower coefficient burden and straightforward integer/context values.",

          2:
            "Accessible National 5 elimination with modest scaling.",

          3:
            "Typical mixed-demand National 5 simultaneous-equation instance.",

          4:
            "Greater coefficient/scaling burden and broader generated values.",

          5:
            "Upper prototype difficulty within the evidence-led family constraints.",
        },
      },

      capabilities: {
        standardCoverage: [
          "C",
          "Mixed",
          "A",
        ],

        canGenerateReasoning:
          true,

        calculatorStatus:
          "Either",

        paperSuitability:
          "BOTH",

        typicalStructureTypes: [
          "EquationSolving",
          "ContextualProblem",
          "CompoundSkills",
        ],
      },
    },

    canHandle:
      (conceptCode) =>
        conceptCode in
        TEST_CODE_TO_FAMILY,

    generate:
      (context) => {
        const seededContext =
          context as SeededGeneratorContext;

        const seed =
          seededContext.developerSeed ??
          Math.floor(
            Math.random() *
              0x7fffffff
          );

        const family =
          familyFromContext(
            context,
            seed
          );

        const question =
          generateA8Question({
            seed,
            difficulty:
              context.difficulty,
            family,
            paper:
              paperFromContext(
                context
              ),
            includeExperimentalFamilies:
              family === "GRAPH_INTERSECTION_SOLVE" ||
              family === "CONTEXT_DERIVED_TOTAL",
          });

        // generateA8Answer validates the answer against the exact generated
        // question state before returning, so a successful sample means both
        // generation layers have passed their programmed integrity checks.
        const markingScheme =
          generateA8Answer(
            question
          );

        const finalAnswer =
          answerText(
            markingScheme.finalAnswers
          );

        const workedAnswers = {
          defaultMethodFamilyId:
            markingScheme
              .defaultMethodFamilyId,

          methods:
            markingScheme.methods.map(
              (
                method,
                methodIndex
              ) => ({
                methodFamilyId:
                  method.methodFamilyId,

                lines:
                  method.lines.map(
                    (line) => ({
                      id:
                        line.id,

                      parts:
                        asTextParts(
                          line.text
                        ),

                      markNumbers:
                        line.markNumbers,
                    })
                  ),

                evidenceScore:
                  method.methodFamilyId ===
                  markingScheme
                    .defaultMethodFamilyId
                    ? 1
                    : Math.max(
                        0.8,
                        0.95 -
                          methodIndex *
                            0.02
                      ),

                sourceEvidenceIds:
                  method
                    .sourceEvidenceIds,
              })
            ),
        };

        const contextual =
          question.context !== null;

        const generated = {
          prompt:
            question.prompt,

          answer:
            finalAnswer,

          marks:
            question.marks,

          questionCode:
            question.instanceId,

          promptParts:
            asTextParts(
              question.prompt
            ),

          answerParts:
            asTextParts(
              finalAnswer
            ),

          workedAnswers,

          classification: {
            standard:
              standardFromDifficulty(
                question.difficulty
              ),

            calculatorStatus:
              question.paper === "P1"
                ? "NonCalculatorOnly"
                : "Either",

            structureType:
              contextual
                ? "ContextualProblem"
                : question.family ===
                    "GRAPH_INTERSECTION_SOLVE"
                  ? "CompoundSkills"
                  : "EquationSolving",

            isReasoning:
              contextual,

            paperSuitability:
              question.paper,
          } satisfies NonNullable<
            GeneratedQuestionData["classification"]
          >,

          sourceSkillCode:
            "A8",

          sourceConceptCode:
            "alg-a8-1",

          sourceConceptLabel:
            "Work with simultaneous equations",

          templateId:
            question.family,

          /**
           * Deliberately retained in the runtime object for DeveloperTools raw
           * inspection. GeneratedQuestionData consumers ignore the extra field.
           */
          a8Diagnostics: {
            validation: {
              question:
                "PASSED",

              answer:
                "PASSED",
            },

            seed:
              question.seed,

            familyReadiness:
              question.familyReadiness,

            determinant:
              question.determinant,

            equations:
              question.equations,

            intendedSolution:
              question.solution,

            eliminationPlans:
              question.eliminationPlans,

            context:
              question.context,

            visual:
              question.visual,

            promptSections:
              question.promptSections,

            sourceBasis:
              question.sourceBasis,

            generationConstraints:
              question.generationConstraints,

            markPoints:
              markingScheme.markPoints,

            workingPolicy:
              markingScheme.workingPolicy,

            presentationPolicy:
              markingScheme.presentationPolicy,
          },
        };

        return generated satisfies
          GeneratedQuestionData;
      },
  };


/**
 * =========================================================
 * ACTIVE GENERATOR TEST TARGET
 * =========================================================
 *
 * This is now wired to the clean Architecture V2 A8 vertical slice rather
 * than the legacy National5Maths generator alias.
 * =========================================================
 */

export const GENERATOR_TEST_TARGET:
  GeneratorTestTarget = {
    module:
      A8_TEST_MODULE,

    conceptControlLabel:
      "A8 family",

    supportsSeed:
      true,

    concepts: [
      {
        code:
          "A8.CORE",

        label:
          "Core random — abstract/context",

        papers: [
          "P1",
          "P2",
        ],
      },
      {
        code:
          "A8.ABSTRACT",

        label:
          "Abstract solve",

        papers: [
          "P1",
        ],
      },
      {
        code:
          "A8.CONTEXT",

        label:
          "Context: form and solve",

        papers: [
          "P1",
          "P2",
        ],
      },
      {
        code:
          "A8.GRAPH",

        label:
          "Experimental: graph intersection",

        papers: [
          "P1",
        ],
      },
      {
        code:
          "A8.DERIVED",

        label:
          "Experimental: contextual derived total",

        papers: [
          "P2",
        ],
      },
    ],

    notes: [
      "Testing the clean A8 simultaneous-equations Question + Answer generators before Assessment Creation wiring.",
      "Core random uses only evidence-backed core families. Graph-intersection and derived-total remain explicitly experimental because each currently has one supplied historical comparator.",
      "Successful cards have passed both programmed question validation and answer-against-question validation. Use Raw output to inspect coefficients, determinant, intended solution, elimination plans, mark points and source basis.",
      "Use a fixed base seed to reproduce a batch exactly; sample n uses base seed + (n - 1).",
    ],
  };
