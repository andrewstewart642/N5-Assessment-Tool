import type {
  ConceptGeneratorModule,
} from "@/shared-types/QuestionGenerationTypes";

import FractionsConceptModule from "@/app/question-bank/skills/01-numerical/NQ_N5_NUM_N05_1_Fractions";


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
      FractionsConceptModule,

    concepts: [
      {
        code:
          "N5.1",

        label:
          "All fraction operations",
      },

      {
        code:
          "N5.1.1",

        label:
          "Addition",
      },

      {
        code:
          "N5.1.2",

        label:
          "Subtraction",
      },

      {
        code:
          "N5.1.3",

        label:
          "Multiplication",
      },

      {
        code:
          "N5.1.4",

        label:
          "Division",
      },

      {
        code:
          "N5.1.5",

        label:
          "Bracketed operations",
      },
    ],

    notes: [
      "Currently testing the National 5 Fractions generator and its evidence-backed worked answers.",
    ],
  };