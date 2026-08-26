import type {
  ConceptGeneratorModule,
} from "@/src/Assessments/Questions/Generation/QuestionGenerationTypes";

import AppreciationConceptModule from "@/src/Courses/National5Maths/QuestionAndAnswerGeneration/QuestionWriting/ConceptModules/Numerical/NQ_N5_NUM_N04_2_PercentagesAppreciation";


export type GeneratorTestConcept = {
  code: string;
  label: string;
};


export type GeneratorTestTarget = {
  /**
   * The actual generator module being tested.
   *
   * This should be the same module that will
   * eventually be registered in the production
   * builder.
   */
  module:
    ConceptGeneratorModule;


  /**
   * Concepts exposed in the tester.
   *
   * Most generators will only need one entry.
   *
   * Skills such as Fractions can expose their
   * individual operation concepts as well as
   * the general/random parent concept.
   */
  concepts:
    GeneratorTestConcept[];


  /**
   * Optional notes shown at the top of the
   * tester page.
   *
   * Useful while a generator is under active
   * development.
   */
  notes?:
    string[];
};


/**
 * =========================================================
 * ACTIVE GENERATOR TEST TARGET
 * =========================================================
 *
 * THIS IS THE ONLY BLOCK THAT SHOULD NORMALLY NEED CHANGING
 * WHEN MOVING THE DEV TESTER TO ANOTHER SKILL.
 *
 * 1. Change the import above.
 * 2. Change `module`.
 * 3. List the concept code(s) you want exposed.
 *
 * The tester page itself remains unchanged.
 * =========================================================
 */

export const GENERATOR_TEST_TARGET:
  GeneratorTestTarget = {
    module:
      AppreciationConceptModule,

    concepts: [
      {
        code:
          "N4.2",

        label:
          "Compound percentages",
      },
    ],

    notes: [
      "Currently testing the National 5 compound-percentage generator across appreciation, depreciation and multi-rate depreciation.",
      "Historical evidence: 11 calculator-paper questions from 2014–2025, all worth 3 marks.",
      "Check generated questions for realistic SQA-style contexts, sensible values, correct rounding and appropriate difficulty progression.",
      "Worked answers should normally use multiplier-power. Fixed-rate depreciation may also expose the evidence-backed year-by-year method.",
    ],
  };