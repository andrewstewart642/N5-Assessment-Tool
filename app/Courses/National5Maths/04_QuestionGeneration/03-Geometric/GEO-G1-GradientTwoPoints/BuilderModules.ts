import type {
  ConceptGeneratorModule,
} from "@/app/Assessments/Questions/Generation/QuestionGenerationTypes";

import {
  buildG1BuilderGenerated,
  G1_BUILDER_VARIANTS,
  g1VariantSelectionMeta,
} from "./BuilderBridge";

const entriesForLevel = (level: 1 | 2) =>
  G1_BUILDER_VARIANTS
    .filter((variant) => variant.difficulty === level)
    .map(g1VariantSelectionMeta);

export const G1GeneralConceptModule: ConceptGeneratorModule = {
  metadata: {
    moduleId: "NQ_N5_GEO_G1_1_GRADIENT_LINE_EQUATION",
    domain: "GEO",
    skillCode: "G1",
    conceptCode: "G1.1",
    conceptLabel: "Gradient and equation of a straight line",
    tags: [
      "gradient",
      "straight line",
      "line equation",
      "contextual model",
      "line of best fit",
      "paired answer generation",
    ],
    difficultyProfile: {
      availableLevels: [1, 2],
      defaultLevel: 1,
      levelDescriptions: {
        1: "Lower source-centred straight-line demand with controlled written arithmetic and supportive visual surfaces.",
        2: "Upper straight-line demand using exact fractional gradients, scaled graph reading or the rare symbolic-coordinate route.",
      },
    },
    capabilities: {
      standardCoverage: ["C", "A"],
      canGenerateReasoning: false,
      calculatorStatus: "Either",
      paperSuitability: "BOTH",
      typicalStructureTypes: [
        "MultiStep",
        "GraphInterpretation",
        "ContextualProblem",
        "DataAnalysis",
      ],
    },
    levelSelectionProfile: {
      1: entriesForLevel(1),
      2: entriesForLevel(2),
    },
  },
  canHandle: (conceptCode) => conceptCode === "G1.1",
  generate: buildG1BuilderGenerated,
};
