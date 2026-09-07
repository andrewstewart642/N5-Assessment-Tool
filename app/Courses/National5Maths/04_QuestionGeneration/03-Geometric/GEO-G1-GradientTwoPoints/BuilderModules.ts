import type {
  ConceptGeneratorModule,
  StructureType,
} from "@/app/Assessments/Questions/Generation/QuestionGenerationTypes";

import {
  buildG1BuilderGenerated,
  G1_BUILDER_VARIANTS,
  g1VariantSelectionMeta,
} from "./BuilderBridge";
import type {
  G1GeneratorFamily,
} from "./Types";

type G1BuilderCode = "G1" | "G1.1" | "G1.2" | "G1.3" | "G1.4";

const G1_FAMILIES_BY_CODE: Record<
  G1BuilderCode,
  readonly G1GeneratorFamily[]
> = {
  G1: [
    "LINE_EQUATION_FROM_TWO_POINTS",
    "CONTEXTUAL_LINEAR_MODEL",
    "BEST_FIT_LINEAR_MODEL",
    "SYMBOLIC_GRADIENT_FROM_TWO_POINTS",
  ],
  "G1.1": ["LINE_EQUATION_FROM_TWO_POINTS"],
  "G1.2": ["CONTEXTUAL_LINEAR_MODEL"],
  "G1.3": ["BEST_FIT_LINEAR_MODEL"],
  "G1.4": ["SYMBOLIC_GRADIENT_FROM_TWO_POINTS"],
};

const G1_LABELS: Record<G1BuilderCode, string> = {
  G1: "Gradient and equation of a straight line",
  "G1.1": "Equation from two points",
  "G1.2": "Straight-line models",
  "G1.3": "Line of best fit / scattergraphs",
  "G1.4": "Gradient from algebraic coordinates",
};

const variantsForCode = (code: G1BuilderCode) => {
  const families = G1_FAMILIES_BY_CODE[code];
  return G1_BUILDER_VARIANTS.filter((variant) => families.includes(variant.family));
};

const entriesForLevel = (code: G1BuilderCode, level: 1 | 2) =>
  variantsForCode(code)
    .filter((variant) => variant.difficulty === level)
    .map(g1VariantSelectionMeta);

const availableLevelsForCode = (code: G1BuilderCode): (1 | 2)[] => {
  const levels = new Set(variantsForCode(code).map((variant) => variant.difficulty));
  return [1, 2].filter((level): level is 1 | 2 => levels.has(level as 1 | 2));
};

const paperSuitabilityForCode = (code: G1BuilderCode) => {
  const papers = new Set(variantsForCode(code).map((variant) => variant.paper));
  if (papers.has("P1") && papers.has("P2")) return "BOTH" as const;
  return papers.has("P2") ? "P2" as const : "P1" as const;
};

const standardCoverageForCode = (code: G1BuilderCode) => {
  const coverage = new Set<"C" | "A">();
  for (const variant of variantsForCode(code)) {
    if (variant.cMarks > 0) coverage.add("C");
    if (variant.aMarks > 0) coverage.add("A");
  }
  return [...coverage];
};

const structureTypesForCode = (code: G1BuilderCode): StructureType[] => {
  if (code === "G1.1") return ["MultiStep", "GraphInterpretation"];
  if (code === "G1.2") return ["ContextualProblem"];
  if (code === "G1.3") return ["DataAnalysis"];
  if (code === "G1.4") return ["MultiStep"];
  return ["MultiStep", "GraphInterpretation", "ContextualProblem", "DataAnalysis"];
};

const tagsForCode = (code: G1BuilderCode): string[] => {
  if (code === "G1.1") return ["gradient", "two points", "line equation"];
  if (code === "G1.2") return ["gradient", "straight-line model", "context"];
  if (code === "G1.3") return ["gradient", "line of best fit", "scattergraph"];
  if (code === "G1.4") return ["gradient", "algebraic coordinates", "symbolic"];
  return ["gradient", "straight line", "line equation", "line of best fit", "scattergraph"];
};

const makeG1Module = (code: G1BuilderCode): ConceptGeneratorModule => {
  const availableLevels = availableLevelsForCode(code);
  const suitability = paperSuitabilityForCode(code);

  return {
    metadata: {
      moduleId: `NQ_N5_GEO_${code.replaceAll(".", "_")}_STRAIGHT_LINE`,
      domain: "GEO",
      skillCode: "G1",
      conceptCode: code,
      conceptLabel: G1_LABELS[code],
      tags: [...tagsForCode(code), "paired answer generation"],
      difficultyProfile: {
        availableLevels,
        defaultLevel: availableLevels[0] ?? 1,
        levelDescriptions: {
          1: "Lower source-centred straight-line demand with controlled written arithmetic and supportive visual surfaces.",
          2: "Upper straight-line demand using exact fractional gradients, scaled graph reading or the rare algebraic-coordinate route.",
        },
      },
      capabilities: {
        standardCoverage: standardCoverageForCode(code),
        canGenerateReasoning: false,
        calculatorStatus: suitability === "P1" ? "NonCalculatorOnly" : "Either",
        paperSuitability: suitability,
        typicalStructureTypes: structureTypesForCode(code),
      },
      levelSelectionProfile: {
        1: entriesForLevel(code, 1),
        2: entriesForLevel(code, 2),
      },
    },
    canHandle: (conceptCode) => conceptCode === code,
    generate: buildG1BuilderGenerated,
  };
};

export const G1GeneralConceptModule = makeG1Module("G1");
export const G1EquationFromTwoPointsConceptModule = makeG1Module("G1.1");
export const G1StraightLineModelsConceptModule = makeG1Module("G1.2");
export const G1BestFitScattergraphsConceptModule = makeG1Module("G1.3");
export const G1AlgebraicCoordinatesConceptModule = makeG1Module("G1.4");
