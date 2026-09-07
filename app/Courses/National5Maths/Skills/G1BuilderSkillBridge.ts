import type {
  Concept,
  DifficultyLevel,
  SkillPaperSuitability,
} from "@/app/Assessments/AssessmentTypes";
import type {
  BuilderSkillRegistration,
} from "./BuilderSkillRegistration";

type G1BuilderConceptCode = "G1" | "G1.1" | "G1.2" | "G1.3" | "G1.4";

type G1ConceptOptions = {
  marks?: number;
  standard: Concept["standard"];
  paperSuitability: SkillPaperSuitability;
  calculator: NonNullable<Concept["metadata"]>["calculator"];
  availableDifficultyLevels: DifficultyLevel[];
  defaultDifficultyLevel: DifficultyLevel;
  fullDescription: string;
  topicTags: string[];
};

const g1Concept = (
  id: string,
  code: G1BuilderConceptCode,
  label: string,
  options: G1ConceptOptions,
): Concept => ({
  id,
  code,
  label,
  shortLabel: label,
  fullDescription: options.fullDescription,
  standard: options.standard,
  marks: options.marks,
  promptStyleId: "B",
  metadata: {
    standardTier: options.standard,
    thinkingType: "operational",
    paperSuitability: options.paperSuitability,
    calculator: options.calculator,
    interactionType: "core",
    stepCount: "multi",
    topicTags: ["gradient", "straight line", ...options.topicTags],
    canBePrimary: true,
    availableDifficultyLevels: options.availableDifficultyLevels,
    defaultDifficultyLevel: options.defaultDifficultyLevel,
  },
});

/**
 * Builder-facing G1 hierarchy mirrors the four calibrated generator families.
 * G1 is the mixed parent selector; G1.1-G1.4 pin generation to one family.
 */
export const G1_BUILDER_CONCEPTS: Concept[] = [
  g1Concept(
    "geo-g1-all-straight-lines",
    "G1",
    "Gradient and equation of a straight line",
    {
      standard: "C+A",
      paperSuitability: "BOTH",
      calculator: "optional",
      availableDifficultyLevels: [1, 2],
      defaultDifficultyLevel: 1,
      fullDescription:
        "Generate across the complete calibrated G1 bank using the reviewed historical family weighting.",
      topicTags: ["line equation", "straight-line model", "scattergraph"],
    },
  ),
  g1Concept(
    "geo-g1-equation-two-points",
    "G1.1",
    "Equation from two points",
    {
      marks: 3,
      standard: "C",
      paperSuitability: "P1",
      calculator: "none",
      availableDifficultyLevels: [1, 2],
      defaultDifficultyLevel: 1,
      fullDescription:
        "Find the equation of a straight line from two points, with the coordinates supplied directly or through a coordinate sketch.",
      topicTags: ["two points", "line equation", "coordinate diagram"],
    },
  ),
  g1Concept(
    "geo-g1-straight-line-models",
    "G1.2",
    "Straight-line models",
    {
      marks: 4,
      standard: "C",
      paperSuitability: "P1",
      calculator: "none",
      availableDifficultyLevels: [1, 2],
      defaultDifficultyLevel: 1,
      fullDescription:
        "Build a deterministic straight-line model from contextual point data and use the model to calculate a further value.",
      topicTags: ["context", "linear model", "model application"],
    },
  ),
  g1Concept(
    "geo-g1-line-best-fit",
    "G1.3",
    "Line of best fit / scattergraphs",
    {
      marks: 4,
      standard: "C",
      paperSuitability: "P1",
      calculator: "none",
      availableDifficultyLevels: [1, 2],
      defaultDifficultyLevel: 1,
      fullDescription:
        "Form the equation of a line of best fit from labelled or grid-read points on a scattergraph; the adjacent one-mark estimate retains its separate statistics ownership.",
      topicTags: ["line of best fit", "scattergraph", "best-fit model"],
    },
  ),
  g1Concept(
    "geo-g1-algebraic-coordinates",
    "G1.4",
    "Gradient from algebraic coordinates",
    {
      marks: 3,
      standard: "A",
      paperSuitability: "P2",
      calculator: "optional",
      availableDifficultyLevels: [2],
      defaultDifficultyLevel: 2,
      fullDescription:
        "Find and simplify the gradient when one of the coordinate pairs is expressed algebraically.",
      topicTags: ["algebraic coordinates", "symbolic gradient"],
    },
  ),
];

export const G1_BUILDER_SKILL_REGISTRATION: BuilderSkillRegistration = {
  skillId: "geo-g01-gradient-two-points",
  apply: (skill) => ({
    ...skill,
    text: "Gradient and equation of a straight line",
    paperSuitability: "BOTH",
    concepts: G1_BUILDER_CONCEPTS,
  }),
};
