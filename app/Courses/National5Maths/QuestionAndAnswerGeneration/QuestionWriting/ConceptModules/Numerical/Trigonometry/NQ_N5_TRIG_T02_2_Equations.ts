// ============================================================================
// NATIONAL 5 MATHEMATICS — T2.2 TRIG EQUATIONS QUESTION GENERATOR
// ============================================================================

import type { PaperPart } from "@/app/Assessments/Questions/Content/PaperParts";                   /* Uses the Builder's text and maths paper-part contract. */
import type {                                                                                      /* Opens Question Generator contract imports. */
  ConceptGeneratorModule,                                                                          /* Uses the standard concept-module shape. */
  GeneratedQuestionData,                                                                           /* Uses the standard generated-question result shape. */
  GeneratorContext,                                                                                /* Uses the context supplied by the Builder. */
} from "@/app/Assessments/Questions/Generation/QuestionGenerationTypes";                           /* Closes Question Generator contract imports. */
import type {                                                                                      /* Opens Builder selection metadata imports. */
  QuestionVariantSelectionMeta,                                                                    /* Uses the Builder's filtering metadata shape. */
} from "@/app/Assessments/Questions/Selection/QuestionSelectionTypes";                             /* Closes Builder selection metadata imports. */

// ============================================================================
// SECTION 1 — GENERATOR FAMILY
// ============================================================================

const GENERATOR_FAMILY_ID =                                                                        /* Stores the structural family produced by this generator. */
  "TRIG_CONTEXTUAL_PERIODIC_MODEL_EQUATION";                                                      /* Matches the catalogue family tested by 2025 Paper 2 Question 14. */

const SOURCE_EVIDENCE_IDS = [                                                                      /* Records the catalogue evidence currently supporting this generator. */
  "N5_MATH_2025_P2_Q14",                                                                           /* Uses the catalogued historical Question as structural evidence. */
  "N5_MATH_2025_P2_Q14_MS",                                                                        /* Uses the matching Marking Scheme as marking evidence. */
] as const;                                                                                        /* Keeps the evidence IDs fixed. */

// ============================================================================
// SECTION 2 — ORIGINAL CONTEXT PROFILES
// ============================================================================

type ContextProfile = {                                                                            /* Opens one safe original context option. */
  id: string;                                                                                      /* Gives the context a stable generator ID. */
  opening: string;                                                                                 /* Supplies the opening contextual sentence. */
  objectName: string;                                                                              /* Names the moving object used later in the prompt. */
};                                                                                                 /* Closes the context profile. */

const CONTEXTS: readonly ContextProfile[] = [                                                       /* Opens the original context bank. */
  {                                                                                                /* Opens the observation-wheel context. */
    id: "OBSERVATION_WHEEL",                                                                       /* Gives the context its stable ID. */
    opening: "A cabin on an observation wheel moves around a circular path.",                     /* Uses original wording rather than historical source wording. */
    objectName: "cabin",                                                                           /* Names the moving object. */
  },                                                                                               /* Closes the observation-wheel context. */
  {                                                                                                /* Opens the inspection-frame context. */
    id: "INSPECTION_FRAME",                                                                        /* Gives the context its stable ID. */
    opening: "A sensor pod travels around a circular inspection frame in a large engineering hall.", /* Uses a different real-world setting. */
    objectName: "sensor pod",                                                                      /* Names the moving object. */
  },                                                                                               /* Closes the inspection-frame context. */
  {                                                                                                /* Opens the training-simulator context. */
    id: "TRAINING_SIMULATOR",                                                                      /* Gives the context its stable ID. */
    opening: "A training pod moves around a circular simulator.",                                 /* Uses another original cyclic-motion setting. */
    objectName: "training pod",                                                                    /* Names the moving object. */
  },                                                                                               /* Closes the training-simulator context. */
  {                                                                                                /* Opens the exhibition-display context. */
    id: "ROTATING_EXHIBIT",                                                                        /* Gives the context its stable ID. */
    opening: "A display capsule moves around a circular rotating exhibit.",                       /* Uses another original cyclic-motion setting. */
    objectName: "display capsule",                                                                 /* Names the moving object. */
  },                                                                                               /* Closes the exhibition-display context. */
];                                                                                                 /* Closes the original context bank. */

// ============================================================================
// SECTION 3 — SAFE NUMBER PROFILES
// ============================================================================

type NumberProfile = {                                                                             /* Opens one reviewed numerical structure. */
  id: string;                                                                                      /* Gives the number profile a stable generator ID. */
  verticalShift: number;                                                                           /* Stores the centre height in the cosine model. */
  amplitude: number;                                                                               /* Stores the positive radius/amplitude magnitude. */
  targetHeight: number;                                                                            /* Stores the height the candidate must solve for. */
};                                                                                                 /* Closes the number profile. */

const NUMBER_PROFILES: readonly NumberProfile[] = [                                                /* Opens the reviewed numerical bank. */
  { id: "SET_A", verticalShift: 14, amplitude: 9, targetHeight: 19 },                              /* Produces cos(x) = -5/9 and two non-special solutions. */
  { id: "SET_B", verticalShift: 13, amplitude: 8, targetHeight: 18 },                              /* Produces cos(x) = -5/8 and two non-special solutions. */
  { id: "SET_C", verticalShift: 12, amplitude: 7, targetHeight: 16 },                              /* Produces cos(x) = -4/7 and two non-special solutions. */
  { id: "SET_D", verticalShift: 15, amplitude: 11, targetHeight: 21 },                             /* Produces cos(x) = -6/11 and two non-special solutions. */
];                                                                                                 /* Closes the reviewed numerical bank. */

// ============================================================================
// SECTION 4 — SMALL HELPERS
// ============================================================================

function chooseOne<T>(items: readonly T[]): T {                                                    /* Opens a helper for choosing one safe option. */
  return items[Math.floor(Math.random() * items.length)];                                          /* Chooses uniformly from the reviewed bank. */
}                                                                                                  /* Closes the random-choice helper. */

function textPart(value: string): PaperPart {                                                      /* Opens a helper for normal text. */
  return {                                                                                         /* Opens the text paper part. */
    kind: "text",                                                                                  /* Tells the PDF Builder to render text. */
    value,                                                                                         /* Supplies the text to render. */
  };                                                                                               /* Closes the text paper part. */
}                                                                                                  /* Closes the text helper. */

function mathPart(latex: string, displayMode = true): PaperPart {                                  /* Opens a helper for LaTeX maths. */
  return {                                                                                         /* Opens the maths paper part. */
    kind: "math",                                                                                  /* Tells the PDF Builder to render maths. */
    latex,                                                                                         /* Supplies the LaTeX expression. */
    displayMode,                                                                                   /* Uses display maths for the main equations. */
  };                                                                                               /* Closes the maths paper part. */
}                                                                                                  /* Closes the maths helper. */

function roundToOneDecimal(value: number): number {                                                /* Opens a helper for readable answer-key values. */
  return Math.round((value + Number.EPSILON) * 10) / 10;                                           /* Rounds only the displayed answer to one decimal place. */
}                                                                                                  /* Closes the rounding helper. */

// ============================================================================
// SECTION 5 — MATHEMATICAL VALIDATION
// ============================================================================

function validateNumberProfile(profile: NumberProfile): void {                                     /* Opens runtime checks for generator safety. */
  const minimumHeight = profile.verticalShift - profile.amplitude;                                 /* Calculates the lowest modelled height. */
  const maximumHeight = profile.verticalShift + profile.amplitude;                                 /* Calculates the highest modelled height. */
  const cosineValue =                                                                               /* Opens the isolated cosine calculation. */
    (profile.verticalShift - profile.targetHeight) / profile.amplitude;                            /* Rearranges target = shift - amplitude cos(x). */

  if (minimumHeight < 0) {                                                                         /* Checks physical plausibility. */
    throw new Error(`Invalid trig profile ${profile.id}: minimum height is below zero.`);          /* Stops generation if the model becomes physically unsuitable. */
  }                                                                                                /* Closes the minimum-height check. */

  if (profile.targetHeight <= profile.verticalShift) {                                             /* Checks the intended negative-cosine structure. */
    throw new Error(`Invalid trig profile ${profile.id}: target must be above the vertical shift.`); /* Preserves quadrant II and III solutions. */
  }                                                                                                /* Closes the negative-cosine structure check. */

  if (profile.targetHeight >= maximumHeight) {                                                     /* Checks that the target is strictly inside the range. */
    throw new Error(`Invalid trig profile ${profile.id}: target must be below the maximum height.`); /* Prevents a collapsed single maximum solution. */
  }                                                                                                /* Closes the target-range check. */

  if (!(cosineValue > -1 && cosineValue < 0)) {                                                    /* Checks the family-defining isolated trig value. */
    throw new Error(`Invalid trig profile ${profile.id}: cosine value must satisfy -1 < cos(x) < 0.`); /* Preserves two non-trivial negative-cosine solutions. */
  }                                                                                                /* Closes the trig-value check. */
}                                                                                                  /* Closes the mathematical validation function. */

// ============================================================================
// SECTION 6 — GENERATED MATHEMATICAL RESULT
// ============================================================================

type GeneratedTrigValues = {                                                                       /* Opens the calculated values used by prompt and answer. */
  cosineValue: number;                                                                             /* Stores the isolated cosine value. */
  firstAngle: number;                                                                              /* Stores the quadrant II solution. */
  secondAngle: number;                                                                             /* Stores the quadrant III solution. */
};                                                                                                 /* Closes the calculated-value shape. */

function calculateTrigValues(profile: NumberProfile): GeneratedTrigValues {                        /* Opens the exact mathematical calculation. */
  validateNumberProfile(profile);                                                                  /* Confirms the selected profile is safe before use. */

  const cosineValue =                                                                               /* Opens the isolated trig value. */
    (profile.verticalShift - profile.targetHeight) / profile.amplitude;                            /* Calculates the exact decimal equivalent of the chosen ratio. */

  const firstAngle =                                                                               /* Opens the principal degree solution. */
    Math.acos(cosineValue) * 180 / Math.PI;                                                        /* Converts JavaScript's radian inverse cosine to degrees. */

  const secondAngle =                                                                              /* Opens the second solution in one rotation. */
    360 - firstAngle;                                                                              /* Uses cosine symmetry to obtain the quadrant III solution. */

  return {                                                                                         /* Opens the calculated result. */
    cosineValue,                                                                                   /* Returns the isolated cosine value. */
    firstAngle,                                                                                    /* Returns the quadrant II solution. */
    secondAngle,                                                                                   /* Returns the quadrant III solution. */
  };                                                                                               /* Closes the calculated result. */
}                                                                                                  /* Closes the mathematical calculation. */

// ============================================================================
// SECTION 7 — BUILDER SELECTION METADATA
// ============================================================================

function buildSelectionMeta(templateId: string): QuestionVariantSelectionMeta {                    /* Opens the Builder filtering metadata. */
  return {                                                                                         /* Opens the metadata object. */
    level: 3,                                                                                      /* Uses one evidence-backed difficulty level for this first trial. */
    templateId,                                                                                    /* Gives this generated variant a traceable template ID. */
    marks: {                                                                                       /* Opens exact mark ownership. */
      totalMarks: 4,                                                                               /* Matches the four-mark source structure. */
      cMarks: 0,                                                                                   /* This trial carries no C marks. */
      aMarks: 4,                                                                                   /* Treats all four marks as A-standard for Builder filtering. */
      reasoningMarks: 1,                                                                           /* Treats the related-angle/solution-selection stage as reasoning. */
    },                                                                                             /* Closes exact mark ownership. */
    standardProfile: "A",                                                                          /* Exposes the question as A-standard. */
    paperSuitability: "P2",                                                                        /* Restricts the question to the calculator paper. */
    calculatorStatus: "CalculatorRequired",                                                        /* Requires calculator access for inverse cosine. */
  };                                                                                               /* Closes the metadata object. */
}                                                                                                  /* Closes the Builder filtering metadata helper. */

// ============================================================================
// SECTION 8 — QUESTION GENERATION
// ============================================================================

function buildGeneratedTrigEquationQuestion(                                                      /* Opens the live Question Generator. */
  _context: GeneratorContext,                                                                      /* Receives Builder context; this first trial intentionally uses one fixed level. */
): GeneratedQuestionData {                                                                         /* Returns the standard Builder question shape. */

  const contextProfile = chooseOne(CONTEXTS);                                                      /* Chooses one original surface context. */
  const numberProfile = chooseOne(NUMBER_PROFILES);                                                /* Chooses one mathematically reviewed number profile. */
  const values = calculateTrigValues(numberProfile);                                               /* Calculates the valid angle pair. */

  const templateId =                                                                               /* Opens the traceable generated-template ID. */
    `catalogue-v1-t2-2-${contextProfile.id.toLowerCase()}-${numberProfile.id.toLowerCase()}`;      /* Records both surface and number choices. */

  const plainPrompt = [                                                                            /* Opens the plain-text fallback prompt. */
    contextProfile.opening,                                                                        /* Adds the original context sentence. */
    `The height h metres of the ${contextProfile.objectName} above the ground after it has turned through x° from its lowest position is modelled by`, /* Defines the model variables. */
    `h = ${numberProfile.verticalShift} - ${numberProfile.amplitude} cos(x°),`,                    /* Adds the generated cosine model. */
    `where 0 ≤ x < 360.`,                                                                          /* Restricts the solution to one rotation. */
    `Calculate the two values of x for which the ${contextProfile.objectName} is ${numberProfile.targetHeight} metres above the ground.`, /* Gives the reverse-solving target. */
  ].join("\n\n");                                                                                  /* Places each meaningful stage on a separate block. */

  const firstAnswer = roundToOneDecimal(values.firstAngle);                                       /* Prepares a readable answer-key value. */
  const secondAnswer = roundToOneDecimal(values.secondAngle);                                     /* Prepares the matching second answer. */

  const plainAnswer =                                                                              /* Opens the plain-text fallback answer. */
    `x ≈ ${firstAnswer}° and x ≈ ${secondAnswer}°`;                                                /* Gives the two valid degree solutions. */

  return {                                                                                         /* Opens the generated Builder result. */
    prompt: plainPrompt,                                                                           /* Supplies a plain-text fallback prompt. */
    answer: plainAnswer,                                                                           /* Supplies a plain-text fallback answer. */
    marks: 4,                                                                                      /* Records the four available marks. */
    questionCode: GENERATOR_FAMILY_ID,                                                             /* Records the structural Question family. */

    promptParts: [                                                                                 /* Opens the PDF-friendly prompt structure. */
      textPart(contextProfile.opening),                                                            /* Renders the original context. */
      textPart(`The height h metres of the ${contextProfile.objectName} above the ground after it has turned through x° from its lowest position is modelled by`), /* Introduces the displayed model. */
      mathPart(`h = ${numberProfile.verticalShift} - ${numberProfile.amplitude}\\cos(x^\\circ)`), /* Renders the generated cosine equation cleanly. */
      textPart("where"),                                                                           /* Introduces the domain as a separate mathematical statement. */
      mathPart("0 \\le x < 360"),                                                                  /* Renders the one-rotation domain. */
      textPart(`Calculate the two values of x for which the ${contextProfile.objectName} is ${numberProfile.targetHeight} metres above the ground.`), /* Renders the final task. */
    ],                                                                                             /* Closes the PDF-friendly prompt structure. */

    answerParts: [                                                                                 /* Opens the PDF-friendly answer structure. */
      textPart("The two values are"),                                                              /* Introduces the final answer pair. */
      mathPart(`x \\approx ${firstAnswer}^{\\circ} \\quad \\text{and} \\quad x \\approx ${secondAnswer}^{\\circ}`), /* Renders both solutions cleanly. */
    ],                                                                                             /* Closes the PDF-friendly answer structure. */

    markBreakdown: {                                                                               /* Opens Builder mark ownership. */
      totalMarks: 4,                                                                               /* Records the full Question total. */
      cMarks: 0,                                                                                   /* Records no C marks. */
      aMarks: 4,                                                                                   /* Records four A marks. */
      reasoningMarks: 1,                                                                           /* Records one reasoning mark for selection/related-angle work. */
    },                                                                                             /* Closes Builder mark ownership. */

    classification: {                                                                             /* Opens high-level Builder classification. */
      standard: "A",                                                                               /* Classifies this as A-standard. */
      calculatorStatus: "CalculatorOnly",                                                         /* Restricts it to calculator assessment. */
      structureType: "ContextualProblem",                                                         /* Records the main question structure. */
      isReasoning: true,                                                                           /* Records genuine solution-selection reasoning. */
      reasoningDiagnostic: "R1+R2",                                                               /* Flags both processing and interpretation/selection demand for this trial. */
      paperSuitability: "P2",                                                                      /* Restricts the Question to Paper 2. */
    },                                                                                             /* Closes high-level Builder classification. */

    sourceSkillCode: "T2",                                                                         /* Uses the canonical Course Skill code. */
    sourceConceptCode: "T2.2",                                                                     /* Uses the canonical trig-equations Concept code. */
    sourceConceptLabel: "Trig equations",                                                         /* Uses the canonical Course Concept label. */
    templateId,                                                                                    /* Records the exact generated template choice. */

    topicMarkBreakdown: {                                                                          /* Opens exact topic mark ownership. */
      NUM: 0,                                                                                      /* Assigns no marks to Number. */
      ALG: 0,                                                                                      /* Assigns no separate marks to Algebra. */
      GEO: 0,                                                                                      /* Assigns no marks to Geometry. */
      TRIG: 4,                                                                                     /* Assigns all four marks to Trigonometry. */
      STAT: 0,                                                                                     /* Assigns no marks to Statistics. */
    },                                                                                             /* Closes exact topic mark ownership. */

    selectionMeta: buildSelectionMeta(templateId),                                                 /* Supplies Builder filtering metadata. */
  };                                                                                               /* Closes the generated Builder result. */
}                                                                                                  /* Closes the live Question Generator. */

// ============================================================================
// SECTION 9 — CONCEPT MODULE
// ============================================================================

export const TrigEquationsConceptModule: ConceptGeneratorModule = {                                /* Opens the module registered with the Question Writer. */
  metadata: {                                                                                      /* Opens module metadata. */
    moduleId: "N5_MATH_TRIG_T2_2_CONTEXTUAL_COSINE_EQUATIONS",                                    /* Gives the module a stable internal ID. */
    domain: "TRIG",                                                                                /* Places the module in Trigonometry. */
    skillCode: "T2",                                                                               /* Links to the canonical Course Skill code. */
    conceptCode: "T2.2",                                                                           /* Links to the canonical Course Concept code. */
    conceptLabel: "Trig equations",                                                               /* Uses the canonical Course Concept label. */
    tags: [                                                                                        /* Opens useful generator tags. */
      "catalogue-v1",                                                                              /* Marks this as Catalogue V1-derived work. */
      "contextual",                                                                                /* Records the contextual surface style. */
      "cosine",                                                                                    /* Records the trig function used. */
      "periodic-model",                                                                            /* Records the mathematical-model family. */
      "two-solutions",                                                                             /* Records the required response structure. */
      ...SOURCE_EVIDENCE_IDS,                                                                      /* Keeps the supporting catalogue IDs visible for audit/debugging. */
    ],                                                                                             /* Closes useful generator tags. */

    difficultyProfile: {                                                                           /* Opens supported difficulty metadata. */
      availableLevels: [3],                                                                        /* Exposes only the level currently supported by evidence. */
      defaultLevel: 3,                                                                             /* Uses level 3 whenever the Builder needs a default. */
      levelDescriptions: {                                                                         /* Opens the level description. */
        3: "Contextual cosine model requiring rearrangement, inverse trig and two valid solutions.", /* Describes the current evidence-backed demand. */
      },                                                                                           /* Closes the level description. */
    },                                                                                             /* Closes supported difficulty metadata. */

    capabilities: {                                                                                /* Opens module capabilities. */
      standardCoverage: ["A"],                                                                     /* Generates A-standard questions only. */
      canGenerateReasoning: true,                                                                  /* Includes related-angle and solution-selection reasoning. */
      calculatorStatus: "CalculatorOnly",                                                         /* Requires a calculator. */
      paperSuitability: "P2",                                                                      /* Generates Paper 2 questions only. */
      typicalStructureTypes: ["ContextualProblem", "EquationSolving"],                             /* Records both important structural views. */
    },                                                                                             /* Closes module capabilities. */

    levelSelectionProfile: {                                                                       /* Opens Builder filtering support. */
      3: [buildSelectionMeta("catalogue-v1-t2-2-contextual-cosine-level-3")],                       /* Exposes one stable eligibility profile for level 3. */
    },                                                                                             /* Closes Builder filtering support. */
  },                                                                                               /* Closes module metadata. */

  canHandle(conceptCode: string) {                                                                 /* Opens the registry compatibility check. */
    return conceptCode === "T2.2";                                                                 /* Handles only the canonical trig-equations Concept. */
  },                                                                                               /* Closes the registry compatibility check. */

  generate: buildGeneratedTrigEquationQuestion,                                                    /* Connects the Builder to the live generator. */
};                                                                                                 /* Closes the concept module. */

export default TrigEquationsConceptModule;                                                         /* Provides the default import used by the registry. */
