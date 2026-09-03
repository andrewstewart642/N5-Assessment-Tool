import type {
  ConceptGeneratorModule,
} from "@/app/Assessments/Questions/Generation/QuestionGenerationTypes";
import type {
  QuestionVariantSelectionMeta,
} from "@/app/Assessments/Questions/Selection/QuestionSelectionTypes";
import {
  buildA7BuilderGenerated,
} from "./BuilderBridge";

type A7Level = 1 | 2;
type A7BuilderCode = "A7.1" | "A7.1.1" | "A7.1.2";

const fractionalVariant = (
  level: A7Level,
): QuestionVariantSelectionMeta => ({
  level,
  templateId: `A7_LINEAR_EQUATIONS_V1:FRACTIONAL_COEFFICIENT:${level === 1 ? "LOWER_VALID" : "UPPER_VALID"}`,
  marks: {
    totalMarks: 3,
    cMarks: 0,
    aMarks: 3,
    reasoningMarks: 0,
  },
  standardProfile: "A",
  paperSuitability: "BOTH",
  calculatorStatus: "CalculatorAllowed",
});

const formAndSolveVariant = (): QuestionVariantSelectionMeta => ({
  level: 2,
  templateId: "A7_LINEAR_EQUATIONS_V1:CONTEXT_AREA_EQUALITY:UPPER_VALID",
  marks: {
    totalMarks: 5,
    cMarks: 0,
    aMarks: 5,
    reasoningMarks: 5,
  },
  standardProfile: "A",
  paperSuitability: "P1",
  calculatorStatus: "CalculatorAllowed",
});

type ModuleOptions = {
  code: A7BuilderCode;
  label: string;
  levels: A7Level[];
  defaultLevel: A7Level;
  variantsByLevel: Partial<Record<A7Level, QuestionVariantSelectionMeta[]>>;
  canGenerateReasoning: boolean;
  paperSuitability: "BOTH" | "P1";
  structures: ("EquationSolving" | "ContextualProblem")[];
};

const makeA7Module = ({
  code,
  label,
  levels,
  defaultLevel,
  variantsByLevel,
  canGenerateReasoning,
  paperSuitability,
  structures,
}: ModuleOptions): ConceptGeneratorModule => ({
  metadata: {
    moduleId: `NQ_N5_ALG_${code.replaceAll(".", "_")}_LINEAR_EQUATIONS`,
    domain: "ALG",
    skillCode: "A7",
    conceptCode: code,
    conceptLabel: label,
    tags: ["linear equations", "skill-catalog", "paired answer generation"],
    difficultyProfile: {
      availableLevels: levels,
      defaultLevel,
      levelDescriptions: {
        1: "Lower calibrated A7 demand within the selected family.",
        2: "Upper calibrated A7 demand within the selected family.",
      },
    },
    capabilities: {
      standardCoverage: ["A"],
      canGenerateReasoning,
      calculatorStatus: paperSuitability === "P1" ? "NonCalculatorOnly" : "Either",
      paperSuitability,
      typicalStructureTypes: structures,
    },
    levelSelectionProfile: variantsByLevel,
  },
  canHandle: (conceptCode) => conceptCode === code,
  generate: buildA7BuilderGenerated,
});

export const A7GeneralConceptModule = makeA7Module({
  code: "A7.1",
  label: "Work with linear equations",
  levels: [1, 2],
  defaultLevel: 1,
  variantsByLevel: {
    1: [fractionalVariant(1)],
    2: [fractionalVariant(2), formAndSolveVariant()],
  },
  canGenerateReasoning: true,
  paperSuitability: "BOTH",
  structures: ["EquationSolving", "ContextualProblem"],
});

export const A7FractionalConceptModule = makeA7Module({
  code: "A7.1.1",
  label: "Fractional linear equations",
  levels: [1, 2],
  defaultLevel: 1,
  variantsByLevel: {
    1: [fractionalVariant(1)],
    2: [fractionalVariant(2)],
  },
  canGenerateReasoning: false,
  paperSuitability: "BOTH",
  structures: ["EquationSolving"],
});

export const A7FormAndSolveConceptModule = makeA7Module({
  code: "A7.1.2",
  label: "Form and solve linear equations",
  levels: [2],
  defaultLevel: 2,
  variantsByLevel: {
    2: [formAndSolveVariant()],
  },
  canGenerateReasoning: true,
  paperSuitability: "P1",
  structures: ["ContextualProblem"],
});
